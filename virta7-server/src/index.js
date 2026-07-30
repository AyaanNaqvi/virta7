import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { existsSync, mkdirSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { nanoid, customAlphabet } from 'nanoid';
import { db, DATA_DIR } from './db.js';
import { hashPassword, verifyPassword, signToken, requireAuth, requireRole } from './auth.js';
import { retrieve } from './knowledge.js';
import { sendPushToTokens, pushEnabled } from './push.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

class UploadError extends Error {}

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, cb) => cb(null, `${nanoid(12)}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 600 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new UploadError('Only video files are allowed'));
    }
    cb(null, true);
  },
});

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;
const CHAT_MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
const ADMIN_CODE = process.env.ADMIN_CODE || 'virta7-admin';

const LANGUAGE_NAMES = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'pt-PT': 'European Portuguese',
  'pt-BR': 'Brazilian Portuguese',
  es: 'Spanish',
  no: 'Norwegian',
  fr: 'French',
  it: 'Italian',
  hu: 'Hungarian',
};

const VIRTA_PERSONA = `You are Virta, a friendly companion character inside Virta7, an app that helps
autistic children and teens with daily routines and social skills.

How you talk:
- Keep replies short: 1-3 sentences at a time. Long paragraphs are overwhelming.
- Use simple, literal, concrete language. No idioms, sarcasm, rhetorical questions, or figures
  of speech ("that's a piece of cake" confuses more than it helps — just say what you mean).
- Ask one question at a time, never several stacked together.
- When you ask a question, prefer offering a couple of clear choices over an open-ended one
  ("Do you want to talk about school or about a friend?" rather than "What's on your mind?").
- Name feelings plainly and validate them before jumping to advice or solutions
  ("It sounds like that felt frustrating." before any suggestion).
- Be consistent and calm. Don't suddenly get overly silly, sarcastic, or intense — steady and
  predictable is comforting.
- Never tease, mock, or joke at the user's expense, even gently.
- Use minimal punctuation for emphasis — avoid stacking exclamation marks or all-caps.
- If the user mentions the app's own features (routines, tasks, stars, rewards, diary), you can
  refer to them naturally, but don't force it into every reply.
- If a topic is outside what you can help with, say so plainly and gently redirect, rather than
  guessing or rambling.
- Be honest that you're a helper character in the app, not a person and not a replacement for
  a real friend or trusted adult.

Safety: Never give medical, therapeutic, or crisis advice. If the user mentions being in danger,
being hurt, or wanting to harm themselves or someone else, calmly and clearly tell them to tell
a trusted adult right away, and keep the rest of your reply simple and brief.`;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

const PORT = process.env.PORT || 4001;

// Avoids visually-confusing characters (0/O, 1/I/L).
const genLoginCode = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 6);

function publicUser(user) {
  const { passwordHash, pin, ...safe } = user;
  return safe;
}

function findUser(id) {
  return db.users.find((u) => u.id === id);
}

function canManageChild(me, childId) {
  if (me.role === 'admin') return true;
  if (me.role === 'tutor') {
    const child = findUser(childId);
    return child?.tutorId === me.id;
  }
  return false;
}

function awardStars(child, amount, reason) {
  child.starsTotal = (child.starsTotal ?? 0) + amount;
  child.starsHistory = child.starsHistory ?? [];
  child.starsHistory.push({ date: new Date().toISOString(), amount, reason });
}

async function notifyTutorOfPendingTask(child, task) {
  if (!child.tutorId) return;
  const tutor = findUser(child.tutorId);
  if (!tutor?.pushTokens?.length) return;
  await sendPushToTokens(tutor.pushTokens, {
    title: `${child.name} says they finished a task`,
    body: `"${task.title}" needs your approval before stars are given.`,
  }, (badToken) => {
    tutor.pushTokens = tutor.pushTokens.filter((t) => t !== badToken);
    db.persist();
  });
}

function scopedChildIds(me) {
  if (me.role === 'admin') return null; // null = no filter, sees everyone
  return db.users.filter((u) => u.role === 'child' && u.tutorId === me.id).map((u) => u.id);
}

// GET-list helper: child sees own records, tutor sees their children's, admin sees all
// (or filtered by ?childId if provided and permitted).
function listForRole(collection, req, res) {
  const me = findUser(req.auth.sub);
  const { childId } = req.query;
  let items;
  if (me.role === 'child') {
    items = collection.filter((x) => x.childId === me.id);
  } else {
    const ids = scopedChildIds(me);
    items = ids === null ? collection : collection.filter((x) => ids.includes(x.childId));
  }
  if (childId) items = items.filter((x) => x.childId === childId);
  return items;
}

// -- Auth: admin/tutor register + login --

app.post('/api/auth/register', (req, res) => {
  const { role, name, email, password, adminCode } = req.body ?? {};
  if (!['admin', 'tutor'].includes(role)) {
    return res.status(400).json({ error: 'role must be admin or tutor' });
  }
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' });
  }
  if (role === 'admin' && adminCode !== ADMIN_CODE) {
    return res.status(403).json({ error: 'Incorrect admin code' });
  }
  if (db.users.some((u) => u.email && u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }
  const user = {
    id: nanoid(10),
    role,
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  db.persist();
  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body ?? {};
  const user = db.users.find(
    (u) => u.email && u.email.toLowerCase() === (email ?? '').toLowerCase()
  );
  if (!user || !verifyPassword(password ?? '', user.passwordHash)) {
    return res.status(401).json({ error: 'Incorrect email or password' });
  }
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

app.post('/api/auth/child-login', (req, res) => {
  const { loginCode, pin } = req.body ?? {};
  const user = db.users.find(
    (u) => u.role === 'child' && u.loginCode === (loginCode ?? '').toUpperCase()
  );
  if (!user || user.pin !== pin) {
    return res.status(401).json({ error: 'Incorrect login code or PIN' });
  }
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = findUser(req.auth.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
});

// -- Children --

app.get('/api/children', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const children = db.users.filter((u) => u.role === 'child' && (me.role === 'admin' || u.tutorId === me.id));
  res.json({ children: children.map(publicUser) });
});

app.post('/api/children', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const { name, avatarId, pin } = req.body ?? {};
  if (!name || !pin) {
    return res.status(400).json({ error: 'name and pin are required' });
  }
  if (!/^\d{4,6}$/.test(pin)) {
    return res.status(400).json({ error: 'pin must be 4-6 digits' });
  }
  let loginCode = genLoginCode();
  while (db.users.some((u) => u.loginCode === loginCode)) {
    loginCode = genLoginCode();
  }
  const child = {
    id: nanoid(10),
    role: 'child',
    name,
    avatarId: avatarId || 'cat',
    pin,
    loginCode,
    tutorId: me.role === 'tutor' ? me.id : (req.body.tutorId ?? null),
    accessibilitySettings: { fontSize: 'medium', highContrast: false, reduceMotion: false },
    starsTotal: 0,
    starsHistory: [],
    onboarded: false,
    createdAt: new Date().toISOString(),
  };
  db.users.push(child);
  db.persist();
  res.status(201).json({ child: publicUser(child) });
});

app.patch('/api/me', requireAuth, (req, res) => {
  const me = findUser(req.auth.sub);
  const { avatarId, accessibilitySettings, onboarded } = req.body ?? {};
  if (avatarId !== undefined) me.avatarId = avatarId;
  if (accessibilitySettings !== undefined) {
    me.accessibilitySettings = { ...me.accessibilitySettings, ...accessibilitySettings };
  }
  if (onboarded !== undefined) me.onboarded = onboarded;
  db.persist();
  res.json({ user: publicUser(me) });
});

// -- Push notifications (tutor/admin devices only) --

app.post('/api/push/register', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const { token } = req.body ?? {};
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'token is required' });
  }
  me.pushTokens = me.pushTokens ?? [];
  if (!me.pushTokens.includes(token)) {
    me.pushTokens.push(token);
    db.persist();
  }
  res.status(204).end();
});

app.delete('/api/auth/me', requireAuth, (req, res) => {
  const me = findUser(req.auth.sub);
  const { password, pin } = req.body ?? {};
  if (me.role === 'child') {
    if (pin !== me.pin) return res.status(401).json({ error: 'Incorrect PIN' });
  } else {
    if (!verifyPassword(password ?? '', me.passwordHash)) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
  }
  db.users.splice(db.users.indexOf(me), 1);
  for (const collection of [db.routines, db.tasks, db.rewards, db.diaryEntries]) {
    for (let i = collection.length - 1; i >= 0; i--) {
      if (collection[i].childId === me.id) collection.splice(i, 1);
    }
  }
  db.persist();
  res.status(204).end();
});

// -- Routines (Timetable) --

app.get('/api/routines', requireAuth, (req, res) => {
  res.json({ routines: listForRole(db.routines, req, res) });
});

app.post('/api/routines', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const { childId, day, time, title, iconId } = req.body ?? {};
  if (!childId || !day || !time || !title) {
    return res.status(400).json({ error: 'childId, day, time, and title are required' });
  }
  if (!canManageChild(me, childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  const dayBlocks = db.routines.filter((r) => r.childId === childId && r.day === day);
  const maxOrder = dayBlocks.reduce((m, r) => Math.max(m, r.order), 0);
  const routine = {
    id: nanoid(10),
    childId,
    day,
    time,
    title,
    iconId: iconId || 'sparkles',
    completed: false,
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
  };
  db.routines.push(routine);
  db.persist();
  res.status(201).json({ routine });
});

app.patch('/api/routines/:id', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const routine = db.routines.find((r) => r.id === req.params.id);
  if (!routine) return res.status(404).json({ error: 'Routine not found' });
  if (!canManageChild(me, routine.childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  const { day, time, title, iconId } = req.body ?? {};
  if (day !== undefined) routine.day = day;
  if (time !== undefined) routine.time = time;
  if (title !== undefined) routine.title = title;
  if (iconId !== undefined) routine.iconId = iconId;
  db.persist();
  res.json({ routine });
});

app.delete('/api/routines/:id', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const routine = db.routines.find((r) => r.id === req.params.id);
  if (!routine) return res.status(404).json({ error: 'Routine not found' });
  if (!canManageChild(me, routine.childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  db.routines.splice(db.routines.indexOf(routine), 1);
  db.persist();
  res.status(204).end();
});

app.post('/api/routines/reorder', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const { childId, day, orderedIds } = req.body ?? {};
  if (!canManageChild(me, childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  db.routines.forEach((r) => {
    if (r.childId !== childId || r.day !== day) return;
    const idx = orderedIds.indexOf(r.id);
    if (idx !== -1) r.order = idx + 1;
  });
  db.persist();
  res.json({ routines: db.routines.filter((r) => r.childId === childId) });
});

app.post('/api/routines/:id/complete', requireAuth, requireRole('child'), (req, res) => {
  const routine = db.routines.find((r) => r.id === req.params.id);
  if (!routine) return res.status(404).json({ error: 'Routine not found' });
  if (routine.childId !== req.auth.sub) return res.status(403).json({ error: 'This is not your routine' });
  if (!routine.completed) {
    routine.completed = true;
    const me = findUser(req.auth.sub);
    awardStars(me, 1, 'Routine completed');
  }
  db.persist();
  res.json({ routine, starsTotal: findUser(req.auth.sub).starsTotal });
});

// -- Tasks (earn stars) --

app.get('/api/tasks', requireAuth, (req, res) => {
  res.json({ tasks: listForRole(db.tasks, req, res) });
});

app.post('/api/tasks', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const { childId, title, description, starReward } = req.body ?? {};
  if (!childId || !title) {
    return res.status(400).json({ error: 'childId and title are required' });
  }
  if (!canManageChild(me, childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  const task = {
    id: nanoid(10),
    childId,
    title,
    description: description || '',
    starReward: Math.max(1, Number(starReward) || 1),
    completed: false,
    pendingApproval: false,
    createdAt: new Date().toISOString(),
  };
  db.tasks.push(task);
  db.persist();
  res.status(201).json({ task });
});

app.patch('/api/tasks/:id', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (!canManageChild(me, task.childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  const { title, description, starReward } = req.body ?? {};
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (starReward !== undefined) task.starReward = Math.max(1, Number(starReward) || 1);
  db.persist();
  res.json({ task });
});

app.delete('/api/tasks/:id', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (!canManageChild(me, task.childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  db.tasks.splice(db.tasks.indexOf(task), 1);
  db.persist();
  res.status(204).end();
});

// Child marks a task done. Stars aren't awarded yet: it goes to the tutor for
// approval first, so the child can't just self-report chores as finished.
app.post('/api/tasks/:id/complete', requireAuth, requireRole('child'), async (req, res) => {
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (task.childId !== req.auth.sub) return res.status(403).json({ error: 'This is not your task' });
  if (!task.completed && !task.pendingApproval) {
    task.pendingApproval = true;
    db.persist();
    const child = findUser(req.auth.sub);
    await notifyTutorOfPendingTask(child, task);
  }
  res.json({ task, starsTotal: findUser(req.auth.sub).starsTotal });
});

app.post('/api/tasks/:id/approve', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (!canManageChild(me, task.childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  if (task.pendingApproval && !task.completed) {
    task.pendingApproval = false;
    task.completed = true;
    const child = findUser(task.childId);
    awardStars(child, task.starReward, `Task completed: ${task.title}`);
  }
  db.persist();
  res.json({ task });
});

app.post('/api/tasks/:id/reject', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (!canManageChild(me, task.childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  task.pendingApproval = false;
  db.persist();
  res.json({ task });
});

// -- Rewards --

app.get('/api/rewards', requireAuth, (req, res) => {
  res.json({ rewards: listForRole(db.rewards, req, res) });
});

app.post('/api/rewards', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const { childId, title, starCost } = req.body ?? {};
  if (!childId || !title) {
    return res.status(400).json({ error: 'childId and title are required' });
  }
  if (!canManageChild(me, childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  const reward = {
    id: nanoid(10),
    childId,
    title,
    starCost: Math.max(1, Number(starCost) || 1),
    redeemed: false,
    createdAt: new Date().toISOString(),
  };
  db.rewards.push(reward);
  db.persist();
  res.status(201).json({ reward });
});

app.patch('/api/rewards/:id', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const reward = db.rewards.find((r) => r.id === req.params.id);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });
  if (!canManageChild(me, reward.childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  const { title, starCost } = req.body ?? {};
  if (title !== undefined) reward.title = title;
  if (starCost !== undefined) reward.starCost = Math.max(1, Number(starCost) || 1);
  db.persist();
  res.json({ reward });
});

app.delete('/api/rewards/:id', requireAuth, requireRole('admin', 'tutor'), (req, res) => {
  const me = findUser(req.auth.sub);
  const reward = db.rewards.find((r) => r.id === req.params.id);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });
  if (!canManageChild(me, reward.childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  db.rewards.splice(db.rewards.indexOf(reward), 1);
  db.persist();
  res.status(204).end();
});

app.post('/api/rewards/:id/redeem', requireAuth, requireRole('child'), (req, res) => {
  const reward = db.rewards.find((r) => r.id === req.params.id);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });
  if (reward.childId !== req.auth.sub) return res.status(403).json({ error: 'This is not your reward' });
  const me = findUser(req.auth.sub);
  if (reward.redeemed) return res.status(400).json({ error: 'Already redeemed' });
  if ((me.starsTotal ?? 0) < reward.starCost) {
    return res.status(400).json({ error: 'Not enough stars' });
  }
  reward.redeemed = true;
  awardStars(me, -reward.starCost, `Redeemed: ${reward.title}`);
  db.persist();
  res.json({ reward, starsTotal: me.starsTotal });
});

// -- Diary --
// Children write their own entries; their tutor/admin can read them (but not
// write or delete them).

app.get('/api/diary', requireAuth, (req, res) => {
  const me = findUser(req.auth.sub);
  if (me.role === 'child') {
    return res.json({ entries: db.diaryEntries.filter((e) => e.childId === me.id) });
  }
  const { childId } = req.query;
  if (!childId) return res.status(400).json({ error: 'childId is required' });
  if (!canManageChild(me, childId)) {
    return res.status(403).json({ error: 'You do not manage this child' });
  }
  res.json({ entries: db.diaryEntries.filter((e) => e.childId === childId) });
});

app.post('/api/diary', requireAuth, requireRole('child'), (req, res) => {
  const { text } = req.body ?? {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }
  const now = new Date();
  const entry = {
    id: nanoid(10),
    childId: req.auth.sub,
    date: now.toISOString().slice(0, 10),
    createdAt: now.toISOString(),
    text,
  };
  db.diaryEntries.push(entry);
  db.persist();
  res.status(201).json({ entry });
});

app.delete('/api/diary/:id', requireAuth, requireRole('child'), (req, res) => {
  const entry = db.diaryEntries.find((e) => e.id === req.params.id);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });
  if (entry.childId !== req.auth.sub) return res.status(403).json({ error: 'This is not your entry' });
  db.diaryEntries.splice(db.diaryEntries.indexOf(entry), 1);
  db.persist();
  res.status(204).end();
});

// -- Videos (formerly "missions") --
// Missions are now a video library curated by admins, not per-child chore tasks.
// Videos are global: any logged-in user (or a public viewer) can watch; only admins manage them.

app.get('/api/videos', (req, res) => {
  res.json({ videos: db.videos });
});

app.post('/api/videos', requireAuth, requireRole('admin'), (req, res) => {
  const { title, description, url } = req.body ?? {};
  if (!title || !url) {
    return res.status(400).json({ error: 'title and url are required' });
  }
  const video = {
    id: nanoid(10),
    title,
    description: description || '',
    url,
    createdAt: new Date().toISOString(),
  };
  db.videos.push(video);
  db.persist();
  res.status(201).json({ video });
});

app.post('/api/videos/upload', requireAuth, requireRole('admin'), upload.single('file'), (req, res) => {
  const { title, description } = req.body ?? {};
  if (!title || !req.file) {
    return res.status(400).json({ error: 'title and a video file are required' });
  }
  const video = {
    id: nanoid(10),
    title,
    description: description || '',
    url: `/uploads/${req.file.filename}`,
    createdAt: new Date().toISOString(),
  };
  db.videos.push(video);
  db.persist();
  res.status(201).json({ video });
});

app.patch('/api/videos/:id', requireAuth, requireRole('admin'), (req, res) => {
  const video = db.videos.find((v) => v.id === req.params.id);
  if (!video) return res.status(404).json({ error: 'Video not found' });
  const { title, description, url } = req.body ?? {};
  if (title !== undefined) video.title = title;
  if (description !== undefined) video.description = description;
  if (url !== undefined) video.url = url;
  db.persist();
  res.json({ video });
});

app.delete('/api/videos/:id', requireAuth, requireRole('admin'), (req, res) => {
  const video = db.videos.find((v) => v.id === req.params.id);
  if (!video) return res.status(404).json({ error: 'Video not found' });
  if (video.url.startsWith('/uploads/')) {
    try {
      unlinkSync(path.join(UPLOADS_DIR, path.basename(video.url)));
    } catch {
      // file already missing; nothing to clean up
    }
  }
  const idx = db.videos.indexOf(video);
  db.videos.splice(idx, 1);
  db.persist();
  res.status(204).end();
});

// -- Chat (Virta Go) --
// Public for now: the child-facing app that calls this has no login of its own yet.

app.post('/api/chat', async (req, res) => {
  if (!anthropic) {
    return res.status(503).json({
      error: 'Chat is not configured. Set ANTHROPIC_API_KEY in virta7-server/.env to enable it.',
    });
  }

  const { message, history, language } = req.body ?? {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }

  const context = retrieve(message);
  const languageName = LANGUAGE_NAMES[language];
  const languageInstruction = languageName ? `\n\nReply in ${languageName}, regardless of the language the user writes in.` : '';
  const system = context.length
    ? `${VIRTA_PERSONA}\n\nHelpful context you can draw on if relevant:\n${context.map((c) => `- ${c}`).join('\n')}${languageInstruction}`
    : `${VIRTA_PERSONA}${languageInstruction}`;

  const messages = [
    ...(Array.isArray(history) ? history : [])
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-10),
    { role: 'user', content: message },
  ];

  try {
    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 300,
      system,
      messages,
    });
    const reply = response.content.find((block) => block.type === 'text')?.text ?? '';
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(502).json({ error: 'Virta could not respond right now. Please try again.' });
  }
});

// -- Web app (built frontend, served same-origin) --

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
if (existsSync(PUBLIC_DIR)) {
  app.use(express.static(PUBLIC_DIR));
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof UploadError) {
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Video file is too large (max 600MB)' : err.message;
    return res.status(400).json({ error: message });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`virta7-server listening on http://localhost:${PORT}`);
});

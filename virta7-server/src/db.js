import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'db.json');

function defaultData() {
  return {
    users: [],
    videos: [],
    routines: [],
    tasks: [],
    rewards: [],
    diaryEntries: [],
  };
}

// When DATABASE_URL is set (Render/Vercel Postgres), the whole dataset lives
// in one JSONB row there instead of a local file — local disk on most hosts
// (Render's free tier included) doesn't survive restarts/redeploys, so
// registered accounts and everything else would otherwise vanish. Falls back
// to the on-disk JSON file when no DATABASE_URL is set, so local dev without
// a database configured keeps working exactly as before.
const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

async function loadFromPostgres() {
  await pool.query('CREATE TABLE IF NOT EXISTS app_data (id INTEGER PRIMARY KEY, data JSONB NOT NULL)');
  const { rows } = await pool.query('SELECT data FROM app_data WHERE id = 1');
  if (rows.length) return { ...defaultData(), ...rows[0].data };
  const fresh = defaultData();
  await pool.query('INSERT INTO app_data (id, data) VALUES (1, $1)', [JSON.stringify(fresh)]);
  return fresh;
}

function loadFromDisk() {
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, JSON.stringify(defaultData(), null, 2), 'utf-8');
  }
  const raw = readFileSync(DB_PATH, 'utf-8');
  return { ...defaultData(), ...JSON.parse(raw) };
}

let data = pool ? await loadFromPostgres() : loadFromDisk();

function save() {
  if (pool) {
    pool.query('UPDATE app_data SET data = $1 WHERE id = 1', [JSON.stringify(data)]).catch((err) => {
      console.error('Failed to persist to Postgres:', err);
    });
  } else {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }
}

export const db = {
  get users() {
    return data.users;
  },
  get videos() {
    return data.videos;
  },
  get routines() {
    return data.routines;
  },
  get tasks() {
    return data.tasks;
  },
  get rewards() {
    return data.rewards;
  },
  get diaryEntries() {
    return data.diaryEntries;
  },
  persist() {
    save();
  },
  reset() {
    data = defaultData();
    save();
  },
};

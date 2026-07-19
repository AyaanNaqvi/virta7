import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Star } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StarBadge } from '../../components/ui/StarBadge';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch, ApiError } from '../../lib/api';
import { getAvatar } from '../../data/avatars';
import { getRoutineIcon, ROUTINE_ICON_IDS } from '../../data/routineIcons';
import { WEEKDAYS, WEEKDAY_LABELS } from '../../data/weekdays';
import { formatTime } from '../../lib/date';
import type { BackendChild, BackendReward, BackendRoutine, BackendTask } from '../../types/backend';
import type { Weekday } from '../../types';

function AddRoutineForm({ childId, onAdded }: { childId: string; onAdded: () => void }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<Weekday>('monday');
  const [time, setTime] = useState('08:00');
  const [title, setTitle] = useState('');
  const [iconId, setIconId] = useState(ROUTINE_ICON_IDS[0]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    setError('');
    setSaving(true);
    try {
      await apiFetch('/routines', { method: 'POST', token, body: { childId, day, time, title, iconId } });
      setTitle('');
      setOpen(false);
      onAdded();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add routine.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button variant="secondary" size="md" icon={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={() => setOpen(true)}>
        Add routine block
      </Button>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {WEEKDAYS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDay(d)}
            className={`min-h-9 shrink-0 rounded-xl px-3 text-sm font-semibold ${
              d === day ? 'bg-primary text-white' : 'bg-surface-alt text-text'
            }`}
          >
            {WEEKDAY_LABELS[d].slice(0, 3)}
          </button>
        ))}
      </div>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        aria-label="Time"
        className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-text"
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Brush teeth"
        aria-label="Routine title"
        className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-text"
      />
      <div className="grid grid-cols-7 gap-2">
        {ROUTINE_ICON_IDS.map((id) => {
          const Icon = getRoutineIcon(id);
          const selected = id === iconId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setIconId(id)}
              aria-pressed={selected}
              className={`flex min-h-10 items-center justify-center rounded-xl border-2 ${
                selected ? 'border-primary' : 'border-border'
              }`}
            >
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
            </button>
          );
        })}
      </div>
      {error && <p role="alert" className="text-alert">{error}</p>}
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
        <Button className="flex-1" onClick={handleAdd} disabled={saving || !title}>Save</Button>
      </div>
    </Card>
  );
}

function AddTaskForm({ childId, onAdded }: { childId: string; onAdded: () => void }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [starReward, setStarReward] = useState('1');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    setError('');
    setSaving(true);
    try {
      await apiFetch('/tasks', {
        method: 'POST',
        token,
        body: { childId, title, description, starReward: Number(starReward) },
      });
      setTitle('');
      setDescription('');
      setStarReward('1');
      setOpen(false);
      onAdded();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add task.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button variant="secondary" size="md" icon={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={() => setOpen(true)}>
        Add task
      </Button>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Tidy room"
        aria-label="Task title"
        className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-text"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        aria-label="Task description"
        rows={2}
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
      />
      <input
        type="number"
        min={1}
        value={starReward}
        onChange={(e) => setStarReward(e.target.value)}
        aria-label="Stars earned"
        className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-text"
      />
      {error && <p role="alert" className="text-alert">{error}</p>}
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
        <Button className="flex-1" onClick={handleAdd} disabled={saving || !title}>Save</Button>
      </div>
    </Card>
  );
}

function AddRewardForm({ childId, onAdded }: { childId: string; onAdded: () => void }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [starCost, setStarCost] = useState('5');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    setError('');
    setSaving(true);
    try {
      await apiFetch('/rewards', { method: 'POST', token, body: { childId, title, starCost: Number(starCost) } });
      setTitle('');
      setStarCost('5');
      setOpen(false);
      onAdded();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add reward.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button variant="secondary" size="md" icon={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={() => setOpen(true)}>
        Add reward
      </Button>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Ice cream treat"
        aria-label="Reward title"
        className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-text"
      />
      <input
        type="number"
        min={1}
        value={starCost}
        onChange={(e) => setStarCost(e.target.value)}
        aria-label="Star cost"
        className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-text"
      />
      {error && <p role="alert" className="text-alert">{error}</p>}
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
        <Button className="flex-1" onClick={handleAdd} disabled={saving || !title}>Save</Button>
      </div>
    </Card>
  );
}

export function ManageChild() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [child, setChild] = useState<BackendChild | null>(null);
  const [routines, setRoutines] = useState<BackendRoutine[]>([]);
  const [tasks, setTasks] = useState<BackendTask[]>([]);
  const [rewards, setRewards] = useState<BackendReward[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!childId) return;
    setLoading(true);
    try {
      const [childrenData, routinesData, tasksData, rewardsData] = await Promise.all([
        apiFetch<{ children: BackendChild[] }>('/children', { token }),
        apiFetch<{ routines: BackendRoutine[] }>(`/routines?childId=${childId}`, { token }),
        apiFetch<{ tasks: BackendTask[] }>(`/tasks?childId=${childId}`, { token }),
        apiFetch<{ rewards: BackendReward[] }>(`/rewards?childId=${childId}`, { token }),
      ]);
      setChild(childrenData.children.find((c) => c.id === childId) ?? null);
      setRoutines(routinesData.routines);
      setTasks(tasksData.tasks);
      setRewards(rewardsData.rewards);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [childId, token, logout]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleDeleteRoutine(id: string) {
    await apiFetch(`/routines/${id}`, { method: 'DELETE', token });
    refresh();
  }

  async function handleDeleteTask(id: string) {
    await apiFetch(`/tasks/${id}`, { method: 'DELETE', token });
    refresh();
  }

  async function handleDeleteReward(id: string) {
    await apiFetch(`/rewards/${id}`, { method: 'DELETE', token });
    refresh();
  }

  if (loading) {
    return (
      <PageContainer>
        <p className="text-text-muted">Loading…</p>
      </PageContainer>
    );
  }

  if (!child) {
    return (
      <PageContainer>
        <Card className="text-center text-text-muted">Child not found.</Card>
        <Link to="/tutor/dashboard" className="mt-4 block text-center font-semibold text-primary">
          Back to dashboard
        </Link>
      </PageContainer>
    );
  }

  const Avatar = getAvatar(child.avatarId).icon;
  const sortedRoutines = [...routines].sort(
    (a, b) => WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day) || a.time.localeCompare(b.time)
  );

  return (
    <PageContainer>
      <button
        type="button"
        onClick={() => navigate('/tutor/dashboard')}
        className="mb-4 flex min-h-11 items-center gap-1 rounded-xl text-sm font-semibold text-primary"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Avatar className="h-8 w-8 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-text">{child.name}</h1>
          <StarBadge count={child.starsTotal ?? 0} />
        </div>
      </div>

      <h2 className="mb-3 text-lg font-bold text-text">Timetable</h2>
      <div className="mb-4 flex flex-col gap-3">
        {sortedRoutines.map((routine) => {
          const Icon = getRoutineIcon(routine.iconId);
          return (
            <Card key={routine.id} className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="font-bold text-text">{routine.title}</p>
                <p className="text-sm text-text-muted">
                  {WEEKDAY_LABELS[routine.day]} · {formatTime(routine.time)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteRoutine(routine.id)}
                aria-label="Delete routine"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-alert"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </button>
            </Card>
          );
        })}
        {sortedRoutines.length === 0 && (
          <Card className="text-center text-text-muted">No routine blocks yet.</Card>
        )}
      </div>
      <div className="mb-8">
        <AddRoutineForm childId={child.id} onAdded={refresh} />
      </div>

      <h2 className="mb-3 text-lg font-bold text-text">Tasks (earn stars)</h2>
      <div className="mb-4 flex flex-col gap-3">
        {tasks.map((task) => (
          <Card key={task.id} className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-bold text-text">{task.title}</p>
              {task.description && <p className="text-sm text-text-muted">{task.description}</p>}
              <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-accent">
                <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                {task.starReward}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDeleteTask(task.id)}
              aria-label="Delete task"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-alert"
            >
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </button>
          </Card>
        ))}
        {tasks.length === 0 && <Card className="text-center text-text-muted">No tasks yet.</Card>}
      </div>
      <div className="mb-8">
        <AddTaskForm childId={child.id} onAdded={refresh} />
      </div>

      <h2 className="mb-3 text-lg font-bold text-text">Rewards</h2>
      <div className="mb-4 flex flex-col gap-3">
        {rewards.map((reward) => (
          <Card key={reward.id} className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-bold text-text">{reward.title}</p>
              <StarBadge count={reward.starCost} />
              {reward.redeemed && <p className="mt-1 text-sm text-text-muted">Redeemed</p>}
            </div>
            <button
              type="button"
              onClick={() => handleDeleteReward(reward.id)}
              aria-label="Delete reward"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-alert"
            >
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </button>
          </Card>
        ))}
        {rewards.length === 0 && <Card className="text-center text-text-muted">No rewards yet.</Card>}
      </div>
      <AddRewardForm childId={child.id} onAdded={refresh} />
    </PageContainer>
  );
}

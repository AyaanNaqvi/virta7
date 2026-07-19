import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { useAuth } from './AuthContext';
import type {
  AuthUser,
  BackendDiaryEntry,
  BackendReward,
  BackendRoutine,
  BackendTask,
  StarsHistoryEntry,
} from '../types/backend';
import type { Weekday } from '../types';

interface ChildDataContextValue {
  loading: boolean;
  routines: BackendRoutine[];
  routinesForDay: (day: Weekday) => BackendRoutine[];
  completeRoutine: (id: string) => Promise<void>;
  tasks: BackendTask[];
  completeTask: (id: string) => Promise<void>;
  rewards: BackendReward[];
  redeemReward: (id: string) => Promise<{ ok: boolean; error?: string }>;
  diaryEntries: BackendDiaryEntry[];
  addDiaryEntry: (text: string) => Promise<void>;
  stars: { total: number; history: StarsHistoryEntry[] };
  refresh: () => Promise<void>;
}

const ChildDataContext = createContext<ChildDataContextValue | null>(null);

export function ChildDataProvider({ children }: { children: ReactNode }) {
  const { token, logout } = useAuth();
  const [routines, setRoutines] = useState<BackendRoutine[]>([]);
  const [tasks, setTasks] = useState<BackendTask[]>([]);
  const [rewards, setRewards] = useState<BackendReward[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<BackendDiaryEntry[]>([]);
  const [starsTotal, setStarsTotal] = useState(0);
  const [starsHistory, setStarsHistory] = useState<StarsHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const starsTotalRef = useRef(0);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [r, t, rw, d, me] = await Promise.all([
        apiFetch<{ routines: BackendRoutine[] }>('/routines', { token }),
        apiFetch<{ tasks: BackendTask[] }>('/tasks', { token }),
        apiFetch<{ rewards: BackendReward[] }>('/rewards', { token }),
        apiFetch<{ entries: BackendDiaryEntry[] }>('/diary', { token }),
        apiFetch<{ user: AuthUser }>('/auth/me', { token }),
      ]);
      setRoutines(r.routines);
      setTasks(t.tasks);
      setRewards(rw.rewards);
      setDiaryEntries(d.entries);
      starsTotalRef.current = me.user.starsTotal ?? 0;
      setStarsTotal(me.user.starsTotal ?? 0);
      setStarsHistory(me.user.starsHistory ?? []);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const routinesForDay = useCallback(
    (day: Weekday) => routines.filter((r) => r.day === day).sort((a, b) => a.order - b.order),
    [routines]
  );

  const recordStarsChange = useCallback((newTotal: number, reason: string) => {
    const prevTotal = starsTotalRef.current;
    if (newTotal !== prevTotal) {
      setStarsHistory((h) => [...h, { date: new Date().toISOString(), amount: newTotal - prevTotal, reason }]);
    }
    starsTotalRef.current = newTotal;
    setStarsTotal(newTotal);
  }, []);

  const completeRoutine = useCallback(
    async (id: string) => {
      const data = await apiFetch<{ routine: BackendRoutine; starsTotal: number }>(
        `/routines/${id}/complete`,
        { method: 'POST', token }
      );
      setRoutines((rs) => rs.map((r) => (r.id === id ? data.routine : r)));
      recordStarsChange(data.starsTotal, 'Routine completed');
    },
    [token, recordStarsChange]
  );

  const completeTask = useCallback(
    async (id: string) => {
      const data = await apiFetch<{ task: BackendTask; starsTotal: number }>(
        `/tasks/${id}/complete`,
        { method: 'POST', token }
      );
      setTasks((ts) => ts.map((t) => (t.id === id ? data.task : t)));
      recordStarsChange(data.starsTotal, `Task completed: ${data.task.title}`);
    },
    [token, recordStarsChange]
  );

  const redeemReward = useCallback(
    async (id: string) => {
      try {
        const data = await apiFetch<{ reward: BackendReward; starsTotal: number }>(
          `/rewards/${id}/redeem`,
          { method: 'POST', token }
        );
        setRewards((rs) => rs.map((r) => (r.id === id ? data.reward : r)));
        recordStarsChange(data.starsTotal, `Redeemed: ${data.reward.title}`);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Could not redeem reward.' };
      }
    },
    [token, recordStarsChange]
  );

  const addDiaryEntry = useCallback(
    async (text: string) => {
      const data = await apiFetch<{ entry: BackendDiaryEntry }>('/diary', {
        method: 'POST',
        token,
        body: { text },
      });
      setDiaryEntries((entries) => [...entries, data.entry]);
    },
    [token]
  );

  const value = useMemo<ChildDataContextValue>(
    () => ({
      loading,
      routines,
      routinesForDay,
      completeRoutine,
      tasks,
      completeTask,
      rewards,
      redeemReward,
      diaryEntries,
      addDiaryEntry,
      stars: { total: starsTotal, history: starsHistory },
      refresh,
    }),
    [
      loading,
      routines,
      routinesForDay,
      completeRoutine,
      tasks,
      completeTask,
      rewards,
      redeemReward,
      diaryEntries,
      addDiaryEntry,
      starsTotal,
      starsHistory,
      refresh,
    ]
  );

  return <ChildDataContext.Provider value={value}>{children}</ChildDataContext.Provider>;
}

export function useChildData(): ChildDataContextValue {
  const ctx = useContext(ChildDataContext);
  if (!ctx) throw new Error('useChildData must be used within ChildDataProvider');
  return ctx;
}

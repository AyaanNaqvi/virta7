const PREFIX = 'virta7:';

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage unavailable or full; fail silently, in-memory state still works
  }
}

export function removeKey(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

export const STORAGE_KEYS = {
  accessibility: 'accessibility',
  virtaGoMessages: 'virtaGoMessages',
  missionOfDaySeen: 'missionOfDaySeen',
} as const;

import { loadJSON, saveJSON, STORAGE_KEYS } from './storage';
import { getTodayDateKey } from './date';

interface WatchedRecord {
  date: string;
  watched: boolean;
}

function key(userId: string): string {
  return `${STORAGE_KEYS.missionWatched}:${userId}`;
}

export function isMissionWatchedToday(userId: string): boolean {
  const record = loadJSON<WatchedRecord | null>(key(userId), null);
  return !!record && record.date === getTodayDateKey() && record.watched;
}

export function setMissionWatchedToday(userId: string): void {
  saveJSON<WatchedRecord>(key(userId), { date: getTodayDateKey(), watched: true });
}

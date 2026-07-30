import { loadJSON, saveJSON, STORAGE_KEYS } from './storage';
import { getTodayDateKey } from './date';

export type Companion = 'virtinho' | 'virtinha';

interface CompanionRecord {
  date: string;
  companion: Companion;
}

function key(userId: string): string {
  return `${STORAGE_KEYS.todayCompanion}:${userId}`;
}

export function getTodayCompanion(userId: string): Companion | null {
  const record = loadJSON<CompanionRecord | null>(key(userId), null);
  if (!record || record.date !== getTodayDateKey()) return null;
  return record.companion;
}

export function setTodayCompanion(userId: string, companion: Companion): void {
  saveJSON<CompanionRecord>(key(userId), { date: getTodayDateKey(), companion });
}

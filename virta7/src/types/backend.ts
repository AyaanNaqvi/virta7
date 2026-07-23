import type { AccessibilitySettings, Weekday } from './index';

export type AuthRole = 'admin' | 'tutor' | 'child';

export interface StarsHistoryEntry {
  date: string;
  amount: number;
  reason: string;
}

export interface AuthUser {
  id: string;
  role: AuthRole;
  name: string;
  email?: string;
  avatarId?: string;
  tutorId?: string | null;
  loginCode?: string;
  accessibilitySettings?: AccessibilitySettings;
  starsTotal?: number;
  starsHistory?: StarsHistoryEntry[];
  onboarded?: boolean;
  createdAt: string;
}

export interface BackendChild {
  id: string;
  role: 'child';
  name: string;
  avatarId: string;
  loginCode: string;
  tutorId: string | null;
  starsTotal: number;
  createdAt: string;
}

export interface BackendRoutine {
  id: string;
  childId: string;
  day: Weekday;
  time: string;
  title: string;
  iconId: string;
  completed: boolean;
  order: number;
  createdAt: string;
}

export interface BackendTask {
  id: string;
  childId: string;
  title: string;
  description: string;
  starReward: number;
  completed: boolean;
  createdAt: string;
}

export interface BackendReward {
  id: string;
  childId: string;
  title: string;
  starCost: number;
  redeemed: boolean;
  createdAt: string;
}

export interface BackendDiaryEntry {
  id: string;
  childId: string;
  date: string;
  createdAt: string;
  text: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: string;
}

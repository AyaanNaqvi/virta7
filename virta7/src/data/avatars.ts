import {
  Cat,
  Dog,
  Bird,
  Fish,
  Rabbit,
  Turtle,
  Squirrel,
  Bug,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AvatarOption {
  id: string;
  label: string;
  icon: LucideIcon;
  colorVar: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'cat', label: 'Cat', icon: Cat, colorVar: '--color-avatar-1' },
  { id: 'dog', label: 'Dog', icon: Dog, colorVar: '--color-avatar-2' },
  { id: 'bird', label: 'Bird', icon: Bird, colorVar: '--color-avatar-3' },
  { id: 'fish', label: 'Fish', icon: Fish, colorVar: '--color-avatar-4' },
  { id: 'rabbit', label: 'Rabbit', icon: Rabbit, colorVar: '--color-avatar-5' },
  { id: 'turtle', label: 'Turtle', icon: Turtle, colorVar: '--color-avatar-6' },
  { id: 'squirrel', label: 'Squirrel', icon: Squirrel, colorVar: '--color-avatar-7' },
  { id: 'bug', label: 'Ladybug', icon: Bug, colorVar: '--color-avatar-8' },
];

export function getAvatar(avatarId: string): AvatarOption {
  return AVATAR_OPTIONS.find((a) => a.id === avatarId) ?? AVATAR_OPTIONS[0];
}

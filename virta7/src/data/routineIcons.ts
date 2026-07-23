import {
  Backpack,
  Bath,
  BedDouble,
  BookOpen,
  Bus,
  Shirt,
  Smile,
  Sparkles,
  Sun,
  Utensils,
  Brush,
  Sandwich,
  Moon,
  Droplets,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const ROUTINE_ICONS: Record<string, LucideIcon> = {
  backpack: Backpack,
  bath: Bath,
  bed: BedDouble,
  book: BookOpen,
  bus: Bus,
  shirt: Shirt,
  smile: Smile,
  sparkles: Sparkles,
  sun: Sun,
  meal: Utensils,
  brush: Brush,
  snack: Sandwich,
  moon: Moon,
  wash: Droplets,
};

export function getRoutineIcon(iconId: string): LucideIcon {
  return ROUTINE_ICONS[iconId] ?? Sparkles;
}

export const ROUTINE_ICON_IDS = Object.keys(ROUTINE_ICONS);

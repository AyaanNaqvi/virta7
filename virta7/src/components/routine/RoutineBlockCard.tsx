import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import type { BackendRoutine } from '../../types/backend';
import { getRoutineIcon } from '../../data/routineIcons';
import { formatTime } from '../../lib/date';
import { useReduceMotion } from '../../contexts/AccessibilityContext';

interface RoutineBlockCardProps {
  block: BackendRoutine;
  onComplete: (id: string) => void;
  size?: 'default' | 'large';
}

export function RoutineBlockCard({ block, onComplete, size = 'default' }: RoutineBlockCardProps) {
  const reduceMotion = useReduceMotion();
  const Icon = getRoutineIcon(block.iconId);
  const isLarge = size === 'large';

  return (
    <button
      type="button"
      disabled={block.completed}
      onClick={() => onComplete(block.id)}
      aria-pressed={block.completed}
      className={`relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border-2 text-left transition-colors
        ${isLarge ? 'min-h-24 p-5' : 'min-h-16 p-4'}
        ${block.completed ? 'border-secondary/40 bg-surface-alt' : 'border-border bg-surface active:bg-surface-alt'}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-2xl bg-primary/10
          ${isLarge ? 'h-16 w-16' : 'h-12 w-12'}`}
      >
        <Icon className={isLarge ? 'h-8 w-8 text-primary' : 'h-6 w-6 text-primary'} aria-hidden="true" />
      </span>

      <span className="flex-1">
        <span className={`block font-bold text-text ${isLarge ? 'text-xl' : 'text-base'}`}>
          {block.title}
        </span>
        <span className="block text-sm text-text-muted">{formatTime(block.time)}</span>
      </span>

      <AnimatePresence>
        {block.completed && (
          <motion.span
            initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 20 }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-white"
          >
            <Check className="h-5 w-5" aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

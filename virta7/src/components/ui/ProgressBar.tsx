import { motion } from 'framer-motion';
import { useReduceMotion } from '../../contexts/AccessibilityContext';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const reduceMotion = useReduceMotion();
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-sm font-medium text-text-muted">
          <span>{label}</span>
          <span>
            {value}/{max}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-4 w-full overflow-hidden rounded-full bg-surface-alt"
      >
        <motion.div
          className="h-full rounded-full bg-secondary"
          initial={reduceMotion ? { width: `${pct}%` } : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

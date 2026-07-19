import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Target, ListChecks, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReduceMotion } from '../contexts/AccessibilityContext';
import virtaWave from '../assets/virta-wave.png';
import virtaSpeaking from '../assets/virta-speaking.png';
import virtaMain from '../assets/virta-main.png';

const POSES = {
  wave: virtaWave,
  speaking: virtaSpeaking,
  main: virtaMain,
} as const;

type PoseId = keyof typeof POSES;

type Stage = 'wave' | 'choose' | 'confirm';

const OPTIONS = [
  { to: '/timetable', label: 'My timetable', icon: CalendarDays },
  { to: '/missions', label: 'Missions', icon: Target },
  { to: '/tasks', label: 'Earn stars', icon: ListChecks },
  { to: '/diary', label: 'Relax', icon: BookOpen },
];

const WAVE_DURATION_MS = 2600;
const CONFIRM_DURATION_MS = 900;

export function Greeting() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const reduceMotion = useReduceMotion();
  const [stage, setStage] = useState<Stage>('wave');

  const waveText = user?.name
    ? `Hey ${user.name}! How are you today?`
    : 'Hey there! How are you today?';

  function goHome() {
    navigate('/home');
  }

  function chooseOption(to: string) {
    setStage('confirm');
    const delay = reduceMotion ? 0 : CONFIRM_DURATION_MS;
    setTimeout(() => navigate(to), delay);
  }

  useEffect(() => {
    if (stage !== 'wave') return;
    const delay = reduceMotion ? WAVE_DURATION_MS * 0.7 : WAVE_DURATION_MS;
    const timer = setTimeout(() => setStage('choose'), delay);
    return () => clearTimeout(timer);
  }, [stage, reduceMotion]);

  const pose: PoseId = stage === 'wave' ? 'wave' : stage === 'choose' ? 'speaking' : 'main';
  const bubbleText =
    stage === 'wave' ? waveText : stage === 'choose' ? 'What would you like to do?' : 'Nice, go ahead!';

  return (
    <div className="flex min-h-svh flex-col bg-bg px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-2 w-8 rounded-full bg-primary" />
          <span className={`h-2 w-8 rounded-full ${stage !== 'wave' ? 'bg-primary' : 'bg-border'}`} />
        </div>
        {stage !== 'confirm' && (
          <button
            type="button"
            onClick={goHome}
            className="min-h-11 rounded-xl px-3 text-sm font-semibold text-text-muted"
          >
            Skip
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={stage === 'wave' ? () => setStage('choose') : undefined}
        className="flex flex-1 flex-col items-center justify-center gap-6 py-4"
        aria-label={stage === 'wave' ? 'Tap to continue' : undefined}
        disabled={stage !== 'wave'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`bubble-${stage}`}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
            className="max-w-xs rounded-3xl border border-border bg-surface px-5 py-4 text-center text-xl font-semibold text-text shadow-sm"
          >
            {bubbleText}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.img
            key={`pose-${pose}`}
            src={POSES[pose]}
            alt=""
            aria-hidden="true"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeOut' }}
            className="h-64 w-auto select-none object-contain"
            draggable={false}
          />
        </AnimatePresence>
      </button>

      {stage === 'choose' && (
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
          className="grid grid-cols-2 gap-3 pb-2"
        >
          {OPTIONS.map(({ to, label, icon: Icon }) => (
            <button
              key={to}
              type="button"
              onClick={() => chooseOption(to)}
              className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl border-2 border-border bg-surface px-3 py-4 text-center font-semibold text-text active:bg-surface-alt"
            >
              <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
              {label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

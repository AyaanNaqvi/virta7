import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Target, ListChecks, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReduceMotion } from '../contexts/AccessibilityContext';
import { apiFetch } from '../lib/api';
import virtinho from '../assets/virtinho.jpg';
import virtinha from '../assets/virtinha.jpg';

type Speaker = 'virtinho' | 'virtinha';
type Stage = 'dialogue' | 'choose' | 'confirm';

interface DialogueStep {
  speaker: Speaker;
  text: string;
}

const CHARACTERS: Record<Speaker, { name: string; image: string }> = {
  virtinho: { name: 'Virtinho', image: virtinho },
  virtinha: { name: 'Virtinha', image: virtinha },
};

const OPTIONS = [
  { to: '/timetable', label: 'My timetable', icon: CalendarDays },
  { to: '/missions', label: 'Missions', icon: Target },
  { to: '/tasks', label: 'Earn stars', icon: ListChecks },
  { to: '/diary', label: 'Relax', icon: BookOpen },
];

const CONFIRM_DURATION_MS = 900;

function buildReturningSteps(name?: string): DialogueStep[] {
  return [
    { speaker: 'virtinho', text: name ? `Hi ${name}! How are you today?` : 'Hi! How are you today?' },
    { speaker: 'virtinha', text: 'What are you trying to do today?' },
  ];
}

function buildFirstTimeSteps(name?: string): DialogueStep[] {
  return [
    { speaker: 'virtinho', text: name ? `Hi ${name}! I'm Virtinho.` : "Hi! I'm Virtinho." },
    { speaker: 'virtinha', text: "And I'm Virtinha!" },
    { speaker: 'virtinho', text: 'This app is called Virta7. Let us show you around.' },
    { speaker: 'virtinha', text: 'Timetable shows your routine for each day.' },
    { speaker: 'virtinho', text: 'Tasks are small jobs you can do to earn stars.' },
    { speaker: 'virtinha', text: 'Stars can be traded for rewards you like.' },
    { speaker: 'virtinho', text: 'Diary is a private place to write about your day.' },
    { speaker: 'virtinha', text: 'Missions are videos picked just for you.' },
    { speaker: 'virtinho', text: 'Virta Go is where you can chat with us anytime.' },
    { speaker: 'virtinha', text: "Now let's pick something to do!" },
  ];
}

export function Greeting() {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const reduceMotion = useReduceMotion();
  const isFirstTime = !user?.onboarded;

  const [steps] = useState<DialogueStep[]>(() =>
    isFirstTime ? buildFirstTimeSteps(user?.name) : buildReturningSteps(user?.name)
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('dialogue');
  const markedOnboarded = useRef(false);

  const step = steps[Math.min(stepIndex, steps.length - 1)];

  function markOnboarded() {
    if (markedOnboarded.current || !isFirstTime) return;
    markedOnboarded.current = true;
    updateUser({ onboarded: true });
    apiFetch('/me', { method: 'PATCH', token, body: { onboarded: true } }).catch(() => {
      // best-effort; local state is already updated
    });
  }

  function advance() {
    if (stage !== 'dialogue') return;
    if (stepIndex + 1 >= steps.length) {
      markOnboarded();
      setStage('choose');
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function goHome() {
    markOnboarded();
    navigate('/home');
  }

  function chooseOption(to: string) {
    setStage('confirm');
    const delay = reduceMotion ? 0 : CONFIRM_DURATION_MS;
    setTimeout(() => navigate(to), delay);
  }

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden px-6 py-6">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-2 w-8 rounded-full bg-white" />
          <span className={`h-2 w-8 rounded-full ${stage !== 'dialogue' ? 'bg-white' : 'bg-white/30'}`} />
        </div>
        {stage !== 'confirm' && (
          <button
            type="button"
            onClick={goHome}
            className="min-h-11 rounded-xl px-3 text-sm font-semibold text-white"
          >
            Skip
          </button>
        )}
      </div>

      {stage === 'dialogue' && (
        <button
          type="button"
          onClick={advance}
          aria-label="Tap to continue"
          className="relative z-10 flex flex-1 flex-col justify-end gap-4 pb-4"
        >
          <motion.div
            key={`bubble-${stepIndex}`}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
            className={`max-w-[75%] rounded-3xl border border-border bg-surface px-5 py-4 text-left text-lg font-semibold text-text shadow-sm
              ${step.speaker === 'virtinho' ? 'self-start' : 'self-end'}`}
          >
            {step.text}
          </motion.div>

          <div className="flex items-end justify-between">
            {(['virtinho', 'virtinha'] as Speaker[]).map((speaker) => {
              const active = step.speaker === speaker;
              const char = CHARACTERS[speaker];
              return (
                <motion.img
                  key={speaker}
                  src={char.image}
                  alt=""
                  aria-hidden="true"
                  animate={{ opacity: active ? 1 : 0.55, scale: active ? 1 : 0.92 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3 }}
                  className="h-48 w-auto select-none rounded-3xl object-cover"
                  draggable={false}
                />
              );
            })}
          </div>
        </button>
      )}

      {stage !== 'dialogue' && (
        <div className="relative z-10 flex flex-1 flex-col justify-end gap-4 pb-4">
          <motion.div
            key={stage}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
            className="max-w-[75%] self-start rounded-3xl border border-border bg-surface px-5 py-4 text-left text-lg font-semibold text-text shadow-sm"
          >
            {stage === 'choose' ? 'What would you like to do?' : 'Nice, go ahead!'}
          </motion.div>

          <div className="flex items-end justify-between">
            <img
              src={virtinho}
              alt=""
              aria-hidden="true"
              className="h-48 w-auto select-none rounded-3xl object-cover"
              draggable={false}
            />
            <img
              src={virtinha}
              alt=""
              aria-hidden="true"
              className="h-48 w-auto select-none rounded-3xl object-cover opacity-55"
              draggable={false}
            />
          </div>
        </div>
      )}

      {stage === 'choose' && (
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
          className="relative z-10 grid grid-cols-2 gap-3 pb-2"
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

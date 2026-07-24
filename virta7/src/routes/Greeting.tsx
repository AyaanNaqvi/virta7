import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Target, ListChecks, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReduceMotion } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';
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

const CONFIRM_DURATION_MS = 900;

export function Greeting() {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const reduceMotion = useReduceMotion();
  const { t } = useLanguage();
  const isFirstTime = !user?.onboarded;

  const OPTIONS = [
    { to: '/timetable', label: t('greeting_myTimetable'), icon: CalendarDays },
    { to: '/missions', label: t('greeting_missions'), icon: Target },
    { to: '/tasks', label: t('greeting_earnStars'), icon: ListChecks },
    { to: '/diary', label: t('greeting_relax'), icon: BookOpen },
  ];

  const [steps] = useState<DialogueStep[]>(() => {
    const name = user?.name;
    if (isFirstTime) {
      return [
        { speaker: 'virtinho', text: name ? t('greeting_imVirtinhoName', { name }) : t('greeting_imVirtinho') },
        { speaker: 'virtinha', text: t('greeting_andImVirtinha') },
        { speaker: 'virtinho', text: t('greeting_appIntro') },
        { speaker: 'virtinha', text: t('greeting_timetableIntro') },
        { speaker: 'virtinho', text: t('greeting_tasksIntro') },
        { speaker: 'virtinha', text: t('greeting_starsIntro') },
        { speaker: 'virtinho', text: t('greeting_diaryIntro') },
        { speaker: 'virtinha', text: t('greeting_missionsIntro') },
        { speaker: 'virtinho', text: t('greeting_virtaGoIntro') },
        { speaker: 'virtinha', text: t('greeting_pickSomething') },
      ];
    }
    return [
      { speaker: 'virtinho', text: name ? t('greeting_hiName', { name }) : t('greeting_hi') },
      { speaker: 'virtinha', text: t('greeting_whatDoing') },
    ];
  });
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
            {t('greeting_skip')}
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
            {stage === 'choose' ? t('greeting_whatWouldYouLikeToDo') : t('greeting_niceGoAhead')}
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

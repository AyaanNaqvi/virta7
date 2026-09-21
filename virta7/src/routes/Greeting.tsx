import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Target, ListChecks, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReduceMotion } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useBackgroundVideoControl } from '../contexts/BackgroundVideoContext';
import { apiFetch } from '../lib/api';
import { speak, stopSpeaking, isVoiceMuted, setVoiceMuted } from '../lib/speech';
import { getTodayCompanion, setTodayCompanion, type Companion } from '../lib/companion';
import virtinho from '../assets/virtinho.jpg';
import virtinha from '../assets/virtinha.jpg';
import virtagoIntro from '../assets/virtago-intro.mp4';

type Speaker = 'virtinho' | 'virtinha';
type Stage = 'splash' | 'pickCompanion' | 'dialogue' | 'choose' | 'confirm';

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
  const [searchParams] = useSearchParams();
  const { user, token, updateUser } = useAuth();
  const reduceMotion = useReduceMotion();
  const { t, locale } = useLanguage();
  const isFirstTime = !user?.onboarded;
  // markOnboarded() flips user.onboarded (and so isFirstTime) mid-flow, right
  // when the tutorial ends — freeze the value from mount so stage-flow
  // decisions later in this session aren't affected by that flip.
  const wasFirstTimeRef = useRef(isFirstTime);
  const jumpToChoose = searchParams.get('choose') === '1';

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
  const [companion, setCompanion] = useState<Companion | null>(() => (user ? getTodayCompanion(user.id) : null));
  // The splash always comes first on every login; dismissSplash() below
  // routes into whichever stage the old initializer used to pick directly.
  const [stage, setStage] = useState<Stage>('splash');
  const [muted, setMuted] = useState<boolean>(() => isVoiceMuted());
  const markedOnboarded = useRef(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  // A <video> that hasn't decoded a real frame yet renders Android WebView's
  // native "not started" placeholder (a gray field with a play icon) instead
  // of staying blank - stay hidden until its own `playing` event confirms
  // real frames are actually being drawn, same fix as the background videos.
  const [introReady, setIntroReady] = useState(false);
  const { suppressBackgroundVideo, releaseBackgroundVideo } = useBackgroundVideoControl();

  const step = steps[Math.min(stepIndex, steps.length - 1)];

  // The intro video autoplaying at the exact same moment as the background
  // video (both starting cold, right at app launch) was hitting the same
  // Android WebView concurrent-decoder limit that corrupted the background
  // video transitions earlier — pause the background video for as long as
  // the splash is up so only the intro video is actually decoding.
  useEffect(() => {
    if (stage !== 'splash') return;
    suppressBackgroundVideo();
    return () => releaseBackgroundVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (muted || stage !== 'dialogue') return;
    speak(step.text, locale, step.speaker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, stage, muted, locale]);

  // The intro video plays with sound by default (it follows right after the
  // login tap, so it still counts as a user-initiated action on most
  // platforms). If the browser blocks audible autoplay anyway, fall back to
  // muted autoplay rather than not playing at all.
  useEffect(() => {
    if (stage !== 'splash') return;
    const video = introVideoRef.current;
    if (!video) return;
    video.muted = muted;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [stage, muted]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  function toggleMuted() {
    setMuted((m) => {
      const next = !m;
      setVoiceMuted(next);
      if (next) stopSpeaking();
      return next;
    });
  }

  function markOnboarded() {
    if (markedOnboarded.current || !isFirstTime) return;
    markedOnboarded.current = true;
    updateUser({ onboarded: true });
    apiFetch('/me', { method: 'PATCH', token, body: { onboarded: true } }).catch(() => {
      // best-effort; local state is already updated
    });
  }

  function dismissSplash() {
    if (jumpToChoose) return setStage('choose');
    // First-time users do the tutorial first, then pick a companion afterward;
    // returning users (who have no tutorial to sit through) pick first.
    if (!companion && !wasFirstTimeRef.current) return setStage('pickCompanion');
    setStage('dialogue');
  }

  function pickCompanion(c: Companion) {
    if (user) setTodayCompanion(user.id, c);
    setCompanion(c);
    // First-timers already did the dialogue before this; returning users
    // still need to go through their short daily greeting.
    setStage(wasFirstTimeRef.current ? 'choose' : 'dialogue');
  }

  function advance() {
    if (stage !== 'dialogue') return;
    if (stepIndex + 1 >= steps.length) {
      markOnboarded();
      setStage(wasFirstTimeRef.current && !companion ? 'pickCompanion' : 'choose');
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
          <span className={`h-2 w-8 rounded-full ${stage === 'choose' || stage === 'confirm' ? 'bg-white' : 'bg-white/30'}`} />
        </div>
        <div className="flex items-center gap-1">
          {stage !== 'pickCompanion' && stage !== 'splash' && (
            <button
              type="button"
              onClick={toggleMuted}
              aria-label={muted ? 'Unmute voice' : 'Mute voice'}
              aria-pressed={muted}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-white"
            >
              {muted ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
            </button>
          )}
          {stage !== 'confirm' && stage !== 'pickCompanion' && stage !== 'splash' && (
            <button
              type="button"
              onClick={goHome}
              className="min-h-11 rounded-xl px-3 text-sm font-semibold text-white"
            >
              {t('greeting_skip')}
            </button>
          )}
        </div>
      </div>

      {stage === 'splash' && (
        <button
          type="button"
          onClick={dismissSplash}
          aria-label={t('greeting_tapToContinue')}
          className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-4"
        >
          <motion.video
            ref={introVideoRef}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
            animate={introReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
            src={virtagoIntro}
            playsInline
            preload="auto"
            onPlaying={() => setIntroReady(true)}
            onEnded={dismissSplash}
            className="w-full max-w-xs rounded-3xl bg-black object-contain shadow-lg"
          />
          <motion.p
            initial={reduceMotion ? { opacity: 0.6 } : { opacity: 0.3 }}
            animate={reduceMotion ? { opacity: 0.6 } : { opacity: [0.3, 0.8, 0.3] }}
            transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="text-center text-sm font-semibold text-white"
          >
            {t('greeting_tapToContinue')}
          </motion.p>
        </button>
      )}

      {stage === 'pickCompanion' && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-2 text-center">
          <p className="text-xl font-bold text-white">{t('greeting_pickCompanion')}</p>
          <div className="grid w-full max-w-sm grid-cols-2 gap-4">
            {(['virtinho', 'virtinha'] as Companion[]).map((c) => (
              <motion.button
                key={c}
                type="button"
                onClick={() => pickCompanion(c)}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                className="flex flex-col items-center gap-3 rounded-3xl border-2 border-border bg-surface p-4 active:bg-surface-alt"
              >
                <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                  <img
                    src={CHARACTERS[c].image}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover object-top"
                  />
                </span>
                <span className="text-lg font-bold text-text">{CHARACTERS[c].name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

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

          {isFirstTime && (
            <motion.p
              initial={reduceMotion ? { opacity: 0.6 } : { opacity: 0.3 }}
              animate={reduceMotion ? { opacity: 0.6 } : { opacity: [0.3, 0.8, 0.3] }}
              transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-center text-sm font-semibold text-white"
            >
              {t('greeting_tapToContinue')}
            </motion.p>
          )}

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

      {(stage === 'choose' || stage === 'confirm') && (
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

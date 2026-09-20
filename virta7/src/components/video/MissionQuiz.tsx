import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X } from 'lucide-react';
import { useReduceMotion } from '../../contexts/AccessibilityContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useChildData } from '../../contexts/ChildDataContext';
import { speak, stopSpeaking, isVoiceMuted } from '../../lib/speech';
import type { Video } from '../../types/backend';

type Feedback = 'correct' | 'incorrect' | null;

export function MissionQuiz({ video, onFinished }: { video: Video; onFinished: () => void }) {
  const reduceMotion = useReduceMotion();
  const { t, locale } = useLanguage();
  const { answerQuizQuestion } = useChildData();
  const questions = video.quizQuestions ?? [];
  const starReward = video.quizStarReward ?? 1;

  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [starsEarned, setStarsEarned] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const done = index >= questions.length;

  // Reads whatever's currently on screen aloud (question, feedback, or the
  // final tally) so the child doesn't have to be able to read the text —
  // same voice/mute behavior as the rest of the app.
  useEffect(() => {
    if (isVoiceMuted()) return;
    if (done) {
      speak(`${t('missions_quizComplete')} ${t('missions_quizStarsEarned', { count: starsEarned })}`, locale, 'virtinho');
    } else if (feedback === 'correct') {
      speak(`${t('missions_quizCorrect')} ${t('missions_quizStarsEarned', { count: starReward })}`, locale, 'virtinho');
    } else if (feedback === 'incorrect') {
      speak(t('missions_quizTryAgain'), locale, 'virtinho');
    } else if (question) {
      speak(question.question, locale, 'virtinho');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, feedback, question, locale]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  async function handleAnswer(answer: 'yes' | 'no') {
    if (submitting || !question) return;
    setSubmitting(true);
    try {
      const { correct } = await answerQuizQuestion(video.id, question.id, answer);
      if (correct) setStarsEarned((s) => s + starReward);
      setFeedback(correct ? 'correct' : 'incorrect');
    } finally {
      setSubmitting(false);
    }
  }

  function handleContinue() {
    if (feedback === 'incorrect') {
      setFeedback(null);
      return;
    }
    setFeedback(null);
    setIndex((i) => i + 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
        className="w-full max-w-sm rounded-3xl bg-surface p-6 text-center shadow-xl"
      >
        {!done ? (
          <>
            <p className="mb-1 text-sm font-semibold text-text-muted">
              {t('missions_quizQuestionProgress', { current: index + 1, total: questions.length })}
            </p>
            <p className="mb-2 flex items-center justify-center gap-1 text-lg font-bold text-text">
              {t('missions_quizIntro')}
            </p>

            <div className="mb-5 flex min-h-20 items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-primary/10 px-4 py-3">
              <p className="font-semibold text-text">{question.question}</p>
            </div>

            <AnimatePresence mode="wait">
              {feedback === null ? (
                <motion.div
                  key="answer"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    type="button"
                    onClick={() => handleAnswer('yes')}
                    disabled={submitting}
                    className="min-h-14 rounded-2xl bg-secondary px-4 text-lg font-bold text-white disabled:opacity-60"
                  >
                    {t('missions_quizYes')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswer('no')}
                    disabled={submitting}
                    className="min-h-14 rounded-2xl bg-alert px-4 text-lg font-bold text-white disabled:opacity-60"
                  >
                    {t('missions_quizNo')}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="feedback"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${
                      feedback === 'correct' ? 'bg-secondary/15 text-secondary' : 'bg-alert/15 text-alert'
                    }`}
                  >
                    {feedback === 'correct' ? (
                      <Check className="h-8 w-8" aria-hidden="true" />
                    ) : (
                      <X className="h-8 w-8" aria-hidden="true" />
                    )}
                  </span>
                  <p className="text-lg font-bold text-text">
                    {feedback === 'correct' ? t('missions_quizCorrect') : t('missions_quizTryAgain')}
                  </p>
                  {feedback === 'correct' && (
                    <p className="flex items-center gap-1 font-bold text-accent">
                      <Star className="h-5 w-5 fill-accent" aria-hidden="true" />
                      {t('missions_quizStarsEarned', { count: starReward })}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="min-h-11 w-full rounded-2xl bg-primary px-4 font-bold text-white"
                  >
                    {t('missions_quizContinue')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!isLast && feedback === null && (
              <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
                {questions.map((q, i) => (
                  <span
                    key={q.id}
                    className={`h-2 w-2 rounded-full ${i <= index ? 'bg-primary' : 'bg-border'}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mb-3 text-lg font-bold text-text">{t('missions_quizComplete')}</p>
            <p className="mb-5 flex items-center justify-center gap-1.5 text-2xl font-bold text-accent">
              <Star className="h-7 w-7 fill-accent" aria-hidden="true" />
              {t('missions_quizStarsEarned', { count: starsEarned })}
            </p>
            <button
              type="button"
              onClick={onFinished}
              className="min-h-11 w-full rounded-2xl bg-primary px-4 font-bold text-white"
            >
              {t('missions_quizContinue')}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

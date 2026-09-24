import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { VideoCard } from '../components/video/VideoCard';
import { MissionQuiz } from '../components/video/MissionQuiz';
import { apiFetch } from '../lib/api';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage';
import { isMissionWatchedToday, setMissionWatchedToday } from '../lib/missionWatched';
import { useAuth } from '../contexts/AuthContext';
import { useReduceMotion } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { Video } from '../types/backend';
import virtinho from '../assets/virtinho.jpg';
import virtinha from '../assets/virtinha.jpg';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// Days since the Unix epoch, a strictly increasing counter that never resets
// (unlike day-of-year, which would jump backwards every January 1st). This
// makes the mission-of-the-day walk through the video list in the order
// videos were added, one per day, indefinitely.
function daysSinceEpoch(date: Date): number {
  return Math.floor(date.getTime() / 86400000);
}

function pickMissionOfDay(videos: Video[]): Video | null {
  if (videos.length === 0) return null;
  return videos[daysSinceEpoch(new Date()) % videos.length];
}

function MissionOfDayPopup({ video, onDismiss }: { video: Video; onDismiss: () => void }) {
  const reduceMotion = useReduceMotion();
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
        className="w-full max-w-sm rounded-3xl bg-surface p-5 text-center shadow-xl"
      >
        <p className="mb-3 text-lg font-bold text-text">{t('missions_missionOfDayPopupHeading')}</p>

        <div className="mb-3 flex items-end justify-center gap-2">
          <img
            src={virtinho}
            alt=""
            aria-hidden="true"
            className="h-24 w-auto select-none rounded-2xl object-cover"
            draggable={false}
          />
          <div className="flex min-h-16 flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-primary/10 px-3 py-2">
            <p className="font-bold text-text">{video.title}</p>
          </div>
          <img
            src={virtinha}
            alt=""
            aria-hidden="true"
            className="h-24 w-auto select-none rounded-2xl object-cover"
            draggable={false}
          />
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="min-h-11 w-full rounded-2xl bg-primary px-4 font-bold text-white"
        >
          {t('missions_letsGo')}
        </button>
      </motion.div>
    </div>
  );
}

export function Missions() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const [watched, setWatched] = useState(() => (user ? isMissionWatchedToday(user.id) : false));
  const [quizVideo, setQuizVideo] = useState<Video | null>(null);
  const [quizIsMissionOfDay, setQuizIsMissionOfDay] = useState(false);
  // The video that just finished (video + quiz, if any) - drives the "Next
  // mission" button. Cleared once the child moves on to the next one.
  const [completedId, setCompletedId] = useState<string | null>(null);
  // Set when jumping to a video via "Next mission", so that card opens (and
  // starts playing) itself instead of waiting for another tap.
  const [autoOpenId, setAutoOpenId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Both the mission-of-day pick and "watched today" are date-derived, but
  // neither useState/useMemo re-evaluates on its own when the calendar day
  // rolls over under an app that's stayed open/mounted since - only when
  // their own inputs (videos, user) change. Polling for the day to change
  // and feeding that into both keeps them correct without needing a fresh
  // mount or a videos refetch to happen to coincide with midnight.
  const [today, setToday] = useState(() => todayKey());

  useEffect(() => {
    const interval = setInterval(() => {
      const current = todayKey();
      setToday((prev) => (prev === current ? prev : current));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setWatched(user ? isMissionWatchedToday(user.id) : false);
  }, [today, user]);

  function handleMissionComplete() {
    if (user) setMissionWatchedToday(user.id);
    setWatched(true);
  }

  // Every mission that has quiz questions shows them right after the video
  // ends; the mission-of-day's "watched today" tracking only fires once the
  // quiz (if any) is done, not the instant the video itself finishes.
  function handleVideoFinished(video: Video, isMissionOfDay: boolean) {
    if (video.quizQuestions && video.quizQuestions.length > 0) {
      setQuizVideo(video);
      setQuizIsMissionOfDay(isMissionOfDay);
    } else {
      if (isMissionOfDay) handleMissionComplete();
      setCompletedId(video.id);
    }
  }

  function handleQuizFinished() {
    if (quizIsMissionOfDay) handleMissionComplete();
    if (quizVideo) setCompletedId(quizVideo.id);
    setQuizVideo(null);
  }

  function handleNext(nextVideo: Video) {
    setCompletedId(null);
    setAutoOpenId(nextVideo.id);
    requestAnimationFrame(() => {
      cardRefs.current[nextVideo.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  useEffect(() => {
    apiFetch<{ videos: Video[] }>('/videos')
      .then((data) => setVideos(data.videos))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const missionOfDay = useMemo(() => pickMissionOfDay(videos), [videos, today]);

  useEffect(() => {
    if (!missionOfDay || !user) return;
    const seenKey = `${STORAGE_KEYS.missionOfDaySeen}:${user.id}`;
    const lastSeen = loadJSON<string | null>(seenKey, null);
    if (lastSeen !== todayKey()) {
      setShowPopup(true);
    }
  }, [missionOfDay, user]);

  function dismissPopup() {
    if (user) saveJSON(`${STORAGE_KEYS.missionOfDaySeen}:${user.id}`, todayKey());
    setShowPopup(false);
  }

  if (loading) {
    return (
      <PageContainer>
        <h1 className="mb-6 text-2xl font-bold text-text">{t('missions_title')}</h1>
        <p className="text-text-muted">{t('missions_loading')}</p>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <h1 className="mb-6 text-2xl font-bold text-text">{t('missions_title')}</h1>
        <Card className="text-center text-text-muted">{t('missions_couldntLoad')}</Card>
      </PageContainer>
    );
  }

  if (videos.length === 0) {
    return (
      <PageContainer>
        <h1 className="mb-6 text-2xl font-bold text-text">{t('missions_title')}</h1>
        <div className="flex flex-col items-center pt-8 text-center">
          <div className="flex items-end gap-3">
            <img
              src={virtinho}
              alt=""
              aria-hidden="true"
              className="h-40 w-auto select-none rounded-3xl object-cover"
              draggable={false}
            />
            <img
              src={virtinha}
              alt=""
              aria-hidden="true"
              className="h-40 w-auto select-none rounded-3xl object-cover"
              draggable={false}
            />
          </div>
          <p className="mt-4 text-lg font-semibold text-text">{t('missions_noVideos')}</p>
        </div>
      </PageContainer>
    );
  }

  const rest = videos.filter((v) => v.id !== missionOfDay?.id);
  // The order the child actually sees cards in: mission-of-day, then the
  // rest of the list, used to figure out what "next" means.
  const orderedList = missionOfDay ? [missionOfDay, ...rest] : rest;
  function getNextVideo(currentId: string): Video | null {
    const idx = orderedList.findIndex((v) => v.id === currentId);
    if (idx === -1 || idx + 1 >= orderedList.length) return null;
    return orderedList[idx + 1];
  }

  // Stay on the big centered mission-of-day view through the "Next mission"
  // moment, even though it's technically been marked watched already -
  // otherwise the button would vanish the instant it appears, since marking
  // it watched is what normally collapses this into the compact layout.
  const missionOfDayExpanded = Boolean(missionOfDay) && (!watched || completedId === missionOfDay?.id);

  return (
    <PageContainer>
      <h1 className="mb-1 text-2xl font-bold text-text">{t('missions_title')}</h1>
      <p className="mb-6 text-text-muted">{t('missions_subtitle')}</p>

      {missionOfDay && missionOfDayExpanded && (
        <div className="flex min-h-[65vh] flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="text-lg font-bold text-text">{t('missions_missionOfDay')}</h2>
          </div>
          <div ref={(el) => { cardRefs.current[missionOfDay.id] = el; }} className="w-full max-w-sm">
            <VideoCard
              video={missionOfDay}
              onComplete={() => handleVideoFinished(missionOfDay, true)}
              autoOpen={autoOpenId === missionOfDay.id}
              completed={completedId === missionOfDay.id}
              hasNext={Boolean(getNextVideo(missionOfDay.id))}
              onNext={() => {
                const next = getNextVideo(missionOfDay.id);
                if (next) handleNext(next);
              }}
            />
          </div>
        </div>
      )}

      {missionOfDay && !missionOfDayExpanded && (
        <>
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="text-lg font-bold text-text">{t('missions_missionOfDay')}</h2>
            </div>
            <div ref={(el) => { cardRefs.current[missionOfDay.id] = el; }}>
              <VideoCard video={missionOfDay} autoOpen={autoOpenId === missionOfDay.id} />
            </div>
          </div>

          {rest.length > 0 && (
            <>
              <h2 className="mb-3 text-lg font-bold text-text">{t('missions_moreMissions')}</h2>
              <div className="flex flex-col gap-3">
                {rest.map((video) => (
                  <div key={video.id} ref={(el) => { cardRefs.current[video.id] = el; }}>
                    <VideoCard
                      video={video}
                      onComplete={() => handleVideoFinished(video, false)}
                      autoOpen={autoOpenId === video.id}
                      completed={completedId === video.id}
                      hasNext={Boolean(getNextVideo(video.id))}
                      onNext={() => {
                        const next = getNextVideo(video.id);
                        if (next) handleNext(next);
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <AnimatePresence>
        {showPopup && missionOfDay && <MissionOfDayPopup video={missionOfDay} onDismiss={dismissPopup} />}
      </AnimatePresence>

      {quizVideo && <MissionQuiz video={quizVideo} onFinished={handleQuizFinished} />}
    </PageContainer>
  );
}

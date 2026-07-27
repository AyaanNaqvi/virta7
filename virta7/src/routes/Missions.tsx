import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { VideoCard } from '../components/video/VideoCard';
import { apiFetch } from '../lib/api';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage';
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

  useEffect(() => {
    apiFetch<{ videos: Video[] }>('/videos')
      .then((data) => setVideos(data.videos))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const missionOfDay = useMemo(() => pickMissionOfDay(videos), [videos]);

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

  return (
    <PageContainer>
      <h1 className="mb-1 text-2xl font-bold text-text">{t('missions_title')}</h1>
      <p className="mb-6 text-text-muted">{t('missions_subtitle')}</p>

      {missionOfDay && (
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="text-lg font-bold text-text">{t('missions_missionOfDay')}</h2>
          </div>
          <VideoCard video={missionOfDay} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {rest.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      <AnimatePresence>
        {showPopup && missionOfDay && <MissionOfDayPopup video={missionOfDay} onDismiss={dismissPopup} />}
      </AnimatePresence>
    </PageContainer>
  );
}

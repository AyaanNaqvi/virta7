import { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { VideoCard } from '../components/video/VideoCard';
import { apiFetch } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import type { Video } from '../types/backend';
import virtinho from '../assets/virtinho.jpg';
import virtinha from '../assets/virtinha.jpg';

export function Missions() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    apiFetch<{ videos: Video[] }>('/videos')
      .then((data) => setVideos(data.videos))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <PageContainer>
      <h1 className="mb-1 text-2xl font-bold text-text">{t('missions_title')}</h1>
      <p className="mb-6 text-text-muted">{t('missions_subtitle')}</p>

      <div className="flex flex-col gap-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </PageContainer>
  );
}

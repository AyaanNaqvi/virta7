import { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { VideoCard } from '../components/video/VideoCard';
import { apiFetch } from '../lib/api';
import type { Video } from '../types/backend';
import virtaMain from '../assets/virta-main.png';

export function Missions() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<{ videos: Video[] }>('/videos')
      .then((data) => setVideos(data.videos))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <h1 className="mb-6 text-2xl font-bold text-text">Missions</h1>
        <p className="text-text-muted">Loading…</p>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <h1 className="mb-6 text-2xl font-bold text-text">Missions</h1>
        <Card className="text-center text-text-muted">
          Couldn't load videos right now. Ask your tutor to check the connection.
        </Card>
      </PageContainer>
    );
  }

  if (videos.length === 0) {
    return (
      <PageContainer>
        <h1 className="mb-6 text-2xl font-bold text-text">Missions</h1>
        <div className="flex flex-col items-center pt-8 text-center">
          <img
            src={virtaMain}
            alt=""
            aria-hidden="true"
            className="h-56 w-auto select-none object-contain"
            draggable={false}
          />
          <p className="mt-4 text-lg font-semibold text-text">No videos added by tutor yet.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="mb-1 text-2xl font-bold text-text">Missions</h1>
      <p className="mb-6 text-text-muted">Videos picked for you. Tap one to watch.</p>

      <div className="flex flex-col gap-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </PageContainer>
  );
}

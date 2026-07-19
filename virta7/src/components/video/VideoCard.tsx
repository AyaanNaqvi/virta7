import { useState } from 'react';
import { PlayCircle, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { classifyVideoUrl, resolveVideoUrl } from '../../lib/video';
import type { Video } from '../../types/backend';

export function VideoCard({ video }: { video: Video }) {
  const [open, setOpen] = useState(false);
  const { kind, embedUrl } = classifyVideoUrl(video.url);
  const playableUrl = resolveVideoUrl(video.url);

  return (
    <Card className="flex flex-col gap-3">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex items-center gap-4 text-left">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
          <PlayCircle className="h-6 w-6 text-primary" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="font-bold text-text">{video.title}</p>
          {video.description && <p className="text-sm text-text-muted">{video.description}</p>}
        </div>
      </button>

      {open && (
        <div className="overflow-hidden rounded-2xl bg-surface-alt">
          {kind === 'youtube' && embedUrl && (
            <div className="aspect-video w-full">
              <iframe
                src={embedUrl}
                title={video.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          {kind === 'file' && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video src={playableUrl} controls className="aspect-video w-full" />
          )}
          {kind === 'link' && (
            <a
              href={playableUrl}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center justify-center gap-2 p-4 font-semibold text-primary"
            >
              Open video
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </Card>
  );
}

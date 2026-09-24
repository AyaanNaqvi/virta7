import { useEffect, useRef, useState } from 'react';
import { PlayCircle, ExternalLink, Check, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { useLanguage } from '../../contexts/LanguageContext';
import { classifyVideoUrl, resolveVideoUrl } from '../../lib/video';
import type { Video } from '../../types/backend';

// YouTube's embedded player, once it receives any postMessage from the
// parent, starts broadcasting "infoDelivery" messages with the player state
// (0 = ended) — no need to load the full iframe_api script for this.
const YOUTUBE_ENDED_STATE = 0;

interface VideoCardProps {
  video: Video;
  onComplete?: () => void;
  // Opens (and starts) this video without the child needing to tap it -
  // used by the "Next mission" flow to jump straight into the next video.
  autoOpen?: boolean;
  // Shows a "Next mission" button once this video is finished, wired up by
  // the parent since it's the one that knows what "next" means.
  completed?: boolean;
  hasNext?: boolean;
  onNext?: () => void;
}

export function VideoCard({ video, onComplete, autoOpen, completed, hasNext, onNext }: VideoCardProps) {
  const [open, setOpen] = useState(false);
  const [linkConfirmed, setLinkConfirmed] = useState(false);
  const { t } = useLanguage();
  const { kind, embedUrl } = classifyVideoUrl(video.url);
  const playableUrl = resolveVideoUrl(video.url);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const firedRef = useRef(false);

  // Tapping anywhere on the card (or arriving here via "Next mission")
  // should start playback immediately, not just reveal a paused player.
  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  useEffect(() => {
    if (!open || kind !== 'file') return;
    const el = videoElRef.current;
    if (!el) return;
    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => {});
    });
  }, [open, kind]);

  function fireOnce() {
    if (firedRef.current) return;
    firedRef.current = true;
    // A video finishing while the native fullscreen video player is still
    // open leaves the quiz modal rendered but hidden behind it — the browser
    // doesn't exit fullscreen on its own when playback ends.
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    onComplete?.();
  }

  useEffect(() => {
    if (kind !== 'youtube' || !open || !onComplete) return;
    function handleMessage(e: MessageEvent) {
      if (!e.origin.includes('youtube.com')) return;
      try {
        const data = JSON.parse(e.data);
        if (data.event === 'infoDelivery' && data.info?.playerState === YOUTUBE_ENDED_STATE) {
          fireOnce();
        }
      } catch {
        // not a JSON message from the player; ignore
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, open]);

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
                ref={iframeRef}
                // mute=1 is required for iframed YouTube embeds to be allowed
                // to autoplay at all; the player's own controls still let the
                // child unmute it.
                src={`${embedUrl}?enablejsapi=1&autoplay=1&mute=1`}
                title={video.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => {
                  iframeRef.current?.contentWindow?.postMessage(
                    JSON.stringify({ event: 'listening', id: video.id }),
                    '*'
                  );
                }}
              />
            </div>
          )}
          {kind === 'file' && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              ref={videoElRef}
              src={playableUrl}
              controls
              className="aspect-video w-full bg-black"
              onEnded={fireOnce}
            />
          )}
          {kind === 'link' && (
            <div className="flex flex-col items-center gap-2 p-4">
              <a
                href={playableUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setLinkConfirmed(true)}
                className="flex min-h-11 items-center justify-center gap-2 font-semibold text-primary"
              >
                {t('missions_openVideo')}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              {onComplete && linkConfirmed && !firedRef.current && (
                <button
                  type="button"
                  onClick={fireOnce}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 font-semibold text-white"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {t('missions_finishedWatching')}
                </button>
              )}
            </div>
          )}

          {completed && hasNext && (
            <div className="p-3">
              <button
                type="button"
                onClick={onNext}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-white"
              >
                {t('missions_nextMission')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

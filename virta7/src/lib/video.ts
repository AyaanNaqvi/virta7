import { API_ORIGIN } from './api';

export type VideoKind = 'youtube' | 'file' | 'link';

// Uploaded videos are stored as a path relative to the backend (e.g. "/uploads/xyz.mp4"),
// since the backend's origin may differ from the frontend's (different port in dev).
export function resolveVideoUrl(url: string): string {
  return url.startsWith('/') ? `${API_ORIGIN}${url}` : url;
}

export function classifyVideoUrl(url: string): { kind: VideoKind; embedUrl?: string } {
  if (url.startsWith('/uploads/')) {
    return { kind: 'file' };
  }
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/
  );
  if (youtubeMatch) {
    return { kind: 'youtube', embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  }
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
    return { kind: 'file' };
  }
  return { kind: 'link' };
}

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useBackgroundVideoControl } from '../../contexts/BackgroundVideoContext';
import bgBlue from '../../assets/bg-blue.mp4';
import bgRed from '../../assets/bg-red.mp4';
import bgPurple from '../../assets/bg-purple.mp4';
import bgOrange from '../../assets/bg-orange.mp4';
import bgGreen from '../../assets/bg-green.mp4';

// Blue everywhere before the child is really "in" the app (login, register,
// the greeting/tutorial) and on Home itself. Every other screen gets a
// jumbled color, arranged so no two adjacent bottom-nav screens match:
// purple, green, orange, red, purple, orange, green.
const ROUTE_BACKGROUND: Record<string, string> = {
  '/login': bgBlue,
  '/register': bgBlue,
  '/greeting': bgBlue,
  '/home': bgBlue,
  '/virta-go': bgPurple,
  '/missions': bgGreen,
  '/timetable': bgOrange,
  '/diary': bgRed,
  '/tasks': bgPurple,
  '/stars': bgOrange,
  '/profile': bgGreen,
};

function backgroundFor(pathname: string): string {
  if (pathname.startsWith('/diary')) return bgRed; // covers /diary and /diary/new
  return ROUTE_BACKGROUND[pathname] ?? bgOrange;
}

const ALL_BACKGROUNDS = [bgBlue, bgRed, bgPurple, bgOrange, bgGreen];

export function AppBackground() {
  const { pathname } = useLocation();
  const activeSrc = backgroundFor(pathname);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const { suppressed } = useBackgroundVideoControl();

  // Only the visible video is ever actually playing/decoding — the other
  // four sit paused (but still mounted, so switching to them is instant and
  // never re-triggers the native "not started yet" flash). Android WebView
  // has a low limit on concurrent *actively decoding* video surfaces; having
  // all five autoplay at once exceeded it and corrupted the rendering.
  // `suppressed` pauses even the active one too, for when some other video
  // on screen (e.g. the greeting intro) needs that decoder budget instead —
  // otherwise the two starting at once at cold app launch hits the same limit.
  useEffect(() => {
    for (const src of ALL_BACKGROUNDS) {
      const el = videoRefs.current[src];
      if (!el) continue;
      if (src === activeSrc && !suppressed) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    }
  }, [activeSrc, suppressed]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {ALL_BACKGROUNDS.map((src) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[src] = el;
          }}
          muted
          loop
          playsInline
          preload="auto"
          src={src}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            src === activeSrc ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}

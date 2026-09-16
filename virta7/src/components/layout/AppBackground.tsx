import { useLocation } from 'react-router-dom';
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

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* All five videos stay mounted and playing for the life of the app —
          swapping the `src` of a single <video> (or remounting via key) makes
          Android's WebView briefly flash its native play-button overlay while
          the new source buffers. Crossfading opacity between already-playing
          elements avoids that remount entirely. */}
      {ALL_BACKGROUNDS.map((src) => (
        <video
          key={src}
          autoPlay
          muted
          loop
          playsInline
          src={src}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            src === activeSrc ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}

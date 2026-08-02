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

export function AppBackground() {
  const { pathname } = useLocation();
  const src = backgroundFor(pathname);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <video
        key={src}
        autoPlay
        muted
        loop
        playsInline
        src={src}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

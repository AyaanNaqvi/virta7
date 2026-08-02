import { useLocation } from 'react-router-dom';
import bgBlue from '../../assets/bg-blue.mp4';
import bgRed from '../../assets/bg-red.mp4';
import bgPurple from '../../assets/bg-purple.mp4';
import bgOrange from '../../assets/bg-orange.mp4';
import bgGreen from '../../assets/bg-green.mp4';

// Jumbled on purpose so no two screens next to each other in the bottom nav
// (Home, Virta, Missions, Timetable, Diary, Tasks, Stars, Profile) share a
// background: blue, purple, green, orange, red, purple, orange, green.
const ROUTE_BACKGROUND: Record<string, string> = {
  '/login': bgBlue,
  '/register': bgBlue,
  '/home': bgBlue,
  '/virta-go': bgPurple,
  '/missions': bgGreen,
  '/timetable': bgOrange,
  '/diary': bgRed,
  '/tasks': bgPurple,
  '/stars': bgOrange,
  '/profile': bgGreen,
  '/greeting': bgRed,
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

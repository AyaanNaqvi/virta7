import { useLocation } from 'react-router-dom';
import bgRed from '../../assets/bg-red.mp4';
import bgPurple from '../../assets/bg-purple.mp4';
import bgOrange from '../../assets/bg-orange.mp4';
import bgGreen from '../../assets/bg-green.mp4';

// Missions, Home, and Virta Go each get their own distinct background; every
// other screen shares a common one (only 4 videos exist for many more screens).
function backgroundFor(pathname: string): string {
  if (pathname.startsWith('/missions')) return bgGreen;
  if (pathname.startsWith('/home')) return bgRed;
  if (pathname.startsWith('/virta-go')) return bgPurple;
  return bgOrange;
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

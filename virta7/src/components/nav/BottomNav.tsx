import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, BookOpen, Star, User, Target, MessageCircle, ListChecks } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/virta-go', label: 'Virta', icon: MessageCircle },
  { to: '/missions', label: 'Missions', icon: Target },
  { to: '/timetable', label: 'Timetable', icon: CalendarDays },
  { to: '/diary', label: 'Diary', icon: BookOpen },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/stars', label: 'Stars', icon: Star },
  { to: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky bottom-0 z-10 flex border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex min-h-16 flex-1 flex-col items-center justify-center gap-1 px-1 text-[0.625rem] font-semibold leading-tight
            ${isActive ? 'text-primary' : 'text-text-muted'}`
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
              <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

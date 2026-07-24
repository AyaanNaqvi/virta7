import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, BookOpen, Star, User, Target, MessageCircle, ListChecks } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function BottomNav() {
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { to: '/home', label: t('nav_home'), icon: Home },
    { to: '/virta-go', label: t('nav_virta'), icon: MessageCircle },
    { to: '/missions', label: t('nav_missions'), icon: Target },
    { to: '/timetable', label: t('nav_timetable'), icon: CalendarDays },
    { to: '/diary', label: t('nav_diary'), icon: BookOpen },
    { to: '/tasks', label: t('nav_tasks'), icon: ListChecks },
    { to: '/stars', label: t('nav_stars'), icon: Star },
    { to: '/profile', label: t('nav_profile'), icon: User },
  ];

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

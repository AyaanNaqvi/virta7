import { useNavigate } from 'react-router-dom';
import { PartyPopper, ChevronRight, Gift, Sparkles } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { StarBadge } from '../components/ui/StarBadge';
import { RoutineBlockCard } from '../components/routine/RoutineBlockCard';
import { useAuth } from '../contexts/AuthContext';
import { useChildData } from '../contexts/ChildDataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getAvatar } from '../data/avatars';
import { getTodayWeekday, getTodayDateKey } from '../lib/date';

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { routinesForDay, completeRoutine, stars } = useChildData();
  const { t } = useLanguage();

  const today = getTodayWeekday();
  const todayRoutines = routinesForDay(today);
  const upcoming = todayRoutines.filter((r) => !r.completed).slice(0, 3);
  const allDone = todayRoutines.length > 0 && upcoming.length === 0;

  const todayKey = getTodayDateKey();
  const starsToday = stars.history
    .filter((h) => h.date.slice(0, 10) === todayKey && h.amount > 0)
    .reduce((sum, h) => sum + h.amount, 0);

  const Avatar = getAvatar(user?.avatarId ?? 'cat').icon;

  return (
    <PageContainer>
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Avatar className="h-8 w-8 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-text-muted">{t('home_hello')}</p>
          <h1 className="text-2xl font-bold text-text">{user?.name || t('home_friend')}!</h1>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">{t('home_todaysTimetable')}</h2>
        <button
          type="button"
          onClick={() => navigate('/timetable')}
          className="flex min-h-11 items-center gap-1 rounded-xl px-2 text-sm font-semibold text-primary"
        >
          {t('home_seeAll')}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {allDone ? (
        <Card className="mb-6 flex flex-col items-center py-8 text-center">
          <PartyPopper className="mb-3 h-10 w-10 text-secondary" aria-hidden="true" />
          <p className="text-lg font-bold text-text">{t('home_allDoneTitle')}</p>
          <p className="text-text-muted">{t('home_allDoneSubtitle')}</p>
        </Card>
      ) : todayRoutines.length === 0 ? (
        <Card className="mb-6 text-center text-text-muted">{t('home_noRoutine')}</Card>
      ) : (
        <div className="mb-6 flex flex-col gap-3">
          {upcoming.map((block) => (
            <RoutineBlockCard key={block.id} block={block} onComplete={completeRoutine} size="large" />
          ))}
        </div>
      )}

      <Card className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-text">{t('home_starsTodayTitle')}</p>
          <p className="text-sm text-text-muted">{t('home_starsTodaySubtitle')}</p>
        </div>
        <StarBadge count={starsToday} size="lg" />
      </Card>

      <button
        type="button"
        onClick={() => navigate(stars.total > 0 ? '/stars' : '/tasks')}
        className="w-full text-left"
      >
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-bg">
            {stars.total > 0 ? (
              <Gift className="h-6 w-6 text-accent" aria-hidden="true" />
            ) : (
              <Sparkles className="h-6 w-6 text-accent" aria-hidden="true" />
            )}
          </span>
          <div className="flex-1">
            {stars.total > 0 ? (
              <>
                <p className="font-semibold text-text">
                  {t('home_youHaveStars', {
                    count: stars.total,
                    unit: stars.total === 1 ? t('home_star') : t('home_starsPlural'),
                  })}
                </p>
                <p className="text-sm text-text-muted">{t('home_tapRewards')}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-text">{t('home_earnStarsTitle')}</p>
                <p className="text-sm text-text-muted">{t('home_tapTasks')}</p>
              </>
            )}
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-text-muted" aria-hidden="true" />
        </Card>
      </button>
    </PageContainer>
  );
}

import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { RoutineBlockCard } from '../components/routine/RoutineBlockCard';
import { useChildData } from '../contexts/ChildDataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { WEEKDAYS } from '../data/weekdays';
import { getTodayWeekday } from '../lib/date';
import type { Weekday } from '../types';
import type { Translations } from '../i18n/translations';

const WEEKDAY_KEYS: Record<Weekday, keyof Translations> = {
  monday: 'weekday_monday',
  tuesday: 'weekday_tuesday',
  wednesday: 'weekday_wednesday',
  thursday: 'weekday_thursday',
  friday: 'weekday_friday',
  saturday: 'weekday_saturday',
  sunday: 'weekday_sunday',
};

const WEEKDAY_SHORT_KEYS: Record<Weekday, keyof Translations> = {
  monday: 'weekday_short_monday',
  tuesday: 'weekday_short_tuesday',
  wednesday: 'weekday_short_wednesday',
  thursday: 'weekday_short_thursday',
  friday: 'weekday_short_friday',
  saturday: 'weekday_short_saturday',
  sunday: 'weekday_short_sunday',
};

export function Timetable() {
  const { routinesForDay, completeRoutine } = useChildData();
  const { t } = useLanguage();
  const today = getTodayWeekday();
  const [selectedDay, setSelectedDay] = useState<Weekday>(today);

  const blocks = routinesForDay(selectedDay);
  const completedCount = blocks.filter((b) => b.completed).length;

  return (
    <PageContainer>
      <h1 className="mb-1 text-2xl font-bold text-text">{t('timetable_title')}</h1>
      <p className="mb-5 text-text-muted">{t(WEEKDAY_KEYS[selectedDay])}</p>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t('timetable_chooseDay')}>
        {WEEKDAYS.map((day) => {
          const isSelected = day === selectedDay;
          const isToday = day === today;
          return (
            <button
              key={day}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedDay(day)}
              className={`relative flex min-h-11 min-w-14 shrink-0 flex-col items-center justify-center rounded-2xl px-3 text-sm font-semibold transition-colors
                ${isSelected ? 'bg-primary text-white' : 'bg-surface-alt text-text'}`}
            >
              {t(WEEKDAY_SHORT_KEYS[day])}
              {isToday && (
                <span
                  className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {blocks.length === 0 ? (
        <Card className="text-center text-text-muted">{t('timetable_noBlocks')}</Card>
      ) : (
        <>
          <p className="mb-3 text-sm font-semibold text-text-muted">
            {t('timetable_doneOf', { done: completedCount, total: blocks.length })}
          </p>
          <div className="flex flex-col gap-3">
            {blocks.map((block) => (
              <RoutineBlockCard key={block.id} block={block} onComplete={completeRoutine} />
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}

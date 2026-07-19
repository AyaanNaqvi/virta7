import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { RoutineBlockCard } from '../components/routine/RoutineBlockCard';
import { useChildData } from '../contexts/ChildDataContext';
import { WEEKDAYS, WEEKDAY_LABELS } from '../data/weekdays';
import { getTodayWeekday } from '../lib/date';
import type { Weekday } from '../types';

const SHORT_LABELS: Record<Weekday, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

export function Timetable() {
  const { routinesForDay, completeRoutine } = useChildData();
  const today = getTodayWeekday();
  const [selectedDay, setSelectedDay] = useState<Weekday>(today);

  const blocks = routinesForDay(selectedDay);
  const completedCount = blocks.filter((b) => b.completed).length;

  return (
    <PageContainer>
      <h1 className="mb-1 text-2xl font-bold text-text">Timetable</h1>
      <p className="mb-5 text-text-muted">{WEEKDAY_LABELS[selectedDay]}</p>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Choose a day">
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
              {SHORT_LABELS[day]}
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
        <Card className="text-center text-text-muted">
          No routine blocks for this day yet. Ask your caregiver to add some.
        </Card>
      ) : (
        <>
          <p className="mb-3 text-sm font-semibold text-text-muted">
            {completedCount} of {blocks.length} done
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

import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useChildData } from '../contexts/ChildDataContext';
import { formatDiaryDate, formatEntryTime } from '../lib/date';

export function Diary() {
  const navigate = useNavigate();
  const { diaryEntries } = useChildData();

  const dateKeys = Array.from(new Set(diaryEntries.map((e) => e.date))).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <PageContainer>
      <h1 className="mb-1 text-2xl font-bold text-text">Diary</h1>
      <p className="mb-5 text-text-muted">Write about your day.</p>

      <Button
        size="lg"
        fullWidth
        icon={<Plus className="h-5 w-5" aria-hidden="true" />}
        onClick={() => navigate('/diary/new')}
        className="mb-6"
      >
        Add entry
      </Button>

      {dateKeys.length === 0 ? (
        <Card className="flex flex-col items-center py-8 text-center">
          <BookOpen className="mb-3 h-10 w-10 text-text-muted" aria-hidden="true" />
          <p className="font-semibold text-text">No diary entries yet</p>
          <p className="text-text-muted">Tap "Add entry" to write about your day.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {dateKeys.map((dateKey) => {
            const entriesForDate = diaryEntries
              .filter((e) => e.date === dateKey)
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            return (
              <div key={dateKey}>
                <h2 className="mb-3 text-lg font-bold text-text">{formatDiaryDate(dateKey)}</h2>
                <div className="flex flex-col gap-3">
                  {entriesForDate.map((entry) => (
                    <Card key={entry.id}>
                      <p className="mb-1 text-sm font-semibold text-text-muted">
                        {formatEntryTime(entry.createdAt)}
                      </p>
                      <p className="whitespace-pre-wrap text-text">{entry.text}</p>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { useChildData } from '../contexts/ChildDataContext';

export function DiaryEntryForm() {
  const navigate = useNavigate();
  const { addDiaryEntry } = useChildData();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await addDiaryEntry(trimmed);
      navigate('/diary');
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageContainer className="flex min-h-[calc(100svh-64px)] flex-col">
      <h1 className="mb-1 text-2xl font-bold text-text">New entry</h1>
      <p className="mb-5 text-text-muted">What happened today?</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        placeholder="Today I..."
        aria-label="Diary entry text"
        className="mb-6 min-h-48 flex-1 resize-none rounded-3xl border-2 border-border bg-surface p-4 text-lg text-text"
      />

      <div className="flex gap-3">
        <Button variant="ghost" size="lg" className="flex-1" onClick={() => navigate('/diary')}>
          Cancel
        </Button>
        <Button size="lg" className="flex-1" onClick={handleSave} disabled={!text.trim() || saving}>
          Save
        </Button>
      </div>
    </PageContainer>
  );
}

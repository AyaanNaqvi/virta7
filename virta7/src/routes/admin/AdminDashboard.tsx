import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, UploadCloud, HelpCircle } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { VideoCard } from '../../components/video/VideoCard';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch, apiUpload, ApiError } from '../../lib/api';
import type { Video } from '../../types/backend';

type Source = 'link' | 'upload';
type QuizQuestionDraft = { id?: string; question: string; correctAnswer: 'yes' | 'no' };

// Shared by the "add a mission" form and each existing video's quiz editor —
// lets an admin build the yes/no questions shown to the child right after
// they finish watching, plus how many stars each correct answer is worth.
function QuizEditor({
  questions,
  onQuestionsChange,
  starReward,
  onStarRewardChange,
}: {
  questions: QuizQuestionDraft[];
  onQuestionsChange: (qs: QuizQuestionDraft[]) => void;
  starReward: number;
  onStarRewardChange: (n: number) => void;
}) {
  function addQuestion() {
    onQuestionsChange([...questions, { question: '', correctAnswer: 'yes' }]);
  }
  function updateQuestion(i: number, patch: Partial<QuizQuestionDraft>) {
    onQuestionsChange(questions.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }
  function removeQuestion(i: number) {
    onQuestionsChange(questions.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-3">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-bold text-text">End-of-mission quiz (optional)</p>
      </div>

      {questions.length > 0 && (
        <label className="flex items-center gap-2 text-sm text-text-muted">
          Stars per correct answer
          <input
            type="number"
            min={1}
            value={starReward}
            onChange={(e) => onStarRewardChange(Math.max(1, Number(e.target.value) || 1))}
            className="min-h-9 w-20 rounded-lg border border-border bg-surface px-2 text-text"
          />
        </label>
      )}

      {questions.map((q, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-lg bg-surface-alt p-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(i, { question: e.target.value })}
              placeholder={`Question ${i + 1} (e.g. "Did the boy say thank you?")`}
              aria-label={`Quiz question ${i + 1}`}
              className="min-h-9 flex-1 rounded-lg border border-border bg-surface px-2 text-sm text-text"
            />
            <button
              type="button"
              onClick={() => removeQuestion(i)}
              aria-label={`Remove question ${i + 1}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-alert"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <SegmentedControl
            ariaLabel={`Correct answer for question ${i + 1}`}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            value={q.correctAnswer}
            onChange={(v) => updateQuestion(i, { correctAnswer: v as 'yes' | 'no' })}
          />
        </div>
      ))}

      <Button variant="ghost" onClick={addQuestion} icon={<Plus className="h-4 w-4" aria-hidden="true" />}>
        Add question
      </Button>
    </div>
  );
}

function AddVideoForm({ onAdded }: { onAdded: () => void }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<Source>('link');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionDraft[]>([]);
  const [quizStarReward, setQuizStarReward] = useState(1);

  function reset() {
    setTitle('');
    setDescription('');
    setUrl('');
    setFile(null);
    setSource('link');
    setOpen(false);
    setUploadProgress(null);
    setQuizQuestions([]);
    setQuizStarReward(1);
  }

  async function handleAdd() {
    setError('');
    setSaving(true);
    try {
      if (source === 'upload' && file) {
        setUploadProgress(0);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);
        formData.append('quizQuestions', JSON.stringify(quizQuestions));
        formData.append('quizStarReward', String(quizStarReward));
        await apiUpload('/videos/upload', { formData, token, onProgress: setUploadProgress });
      } else {
        await apiFetch('/videos', {
          method: 'POST',
          token,
          body: { title, description, url, quizQuestions, quizStarReward },
        });
      }
      reset();
      onAdded();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add video. Please try again.');
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  }

  if (!open) {
    return (
      <Button
        variant="secondary"
        size="lg"
        fullWidth
        icon={<Plus className="h-5 w-5" aria-hidden="true" />}
        onClick={() => setOpen(true)}
        className="mb-6"
      >
        Add mission
      </Button>
    );
  }

  const canSave = title && (source === 'link' ? url : file);

  return (
    <Card className="mb-6 flex flex-col gap-3">
      <p className="font-bold text-text">Add a mission video</p>
      <SegmentedControl
        ariaLabel="Video source"
        options={[
          { value: 'link', label: 'Paste a link' },
          { value: 'upload', label: 'Upload a file' },
        ]}
        value={source}
        onChange={(v) => setSource(v as Source)}
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Video title"
        aria-label="Video title"
        className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-text"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        aria-label="Video description"
        rows={2}
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
      />
      {source === 'link' ? (
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Video URL (YouTube link or direct video file)"
          aria-label="Video URL"
          className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-text"
        />
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={saving}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-3 text-text-muted disabled:opacity-60"
          >
            <UploadCloud className="h-5 w-5" aria-hidden="true" />
            {file ? file.name : 'Choose a video file (max 600MB)'}
          </button>
          {uploadProgress !== null && (
            <div className="mt-2">
              <div
                role="progressbar"
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2 w-full overflow-hidden rounded-full bg-surface-alt"
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-1 text-center text-sm text-text-muted">
                {uploadProgress < 100 ? `Uploading… ${uploadProgress}%` : 'Finishing up…'}
              </p>
            </div>
          )}
        </div>
      )}

      <QuizEditor
        questions={quizQuestions}
        onQuestionsChange={setQuizQuestions}
        starReward={quizStarReward}
        onStarRewardChange={setQuizStarReward}
      />

      {error && (
        <p role="alert" className="text-alert">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={reset}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleAdd} disabled={saving || !canSave}>
          {saving && source === 'upload' ? 'Uploading…' : 'Save'}
        </Button>
      </div>
    </Card>
  );
}

function VideoRow({ video, token, onDelete, onSaved }: {
  video: Video;
  token: string | null;
  onDelete: (id: string) => void;
  onSaved: (video: Video) => void;
}) {
  const [editingQuiz, setEditingQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionDraft[]>(video.quizQuestions ?? []);
  const [quizStarReward, setQuizStarReward] = useState(video.quizStarReward ?? 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const questionCount = video.quizQuestions?.length ?? 0;

  function openEditor() {
    setQuizQuestions(video.quizQuestions ?? []);
    setQuizStarReward(video.quizStarReward ?? 1);
    setError('');
    setEditingQuiz(true);
  }

  async function handleSaveQuiz() {
    setSaving(true);
    setError('');
    try {
      const data = await apiFetch<{ video: Video }>(`/videos/${video.id}`, {
        method: 'PATCH',
        token,
        body: { quizQuestions, quizStarReward },
      });
      onSaved(data.video);
      setEditingQuiz(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save the quiz.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <VideoCard video={video} />
        </div>
        <button
          type="button"
          onClick={() => onDelete(video.id)}
          aria-label="Delete video"
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-alert"
        >
          <Trash2 className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {!editingQuiz ? (
        <button
          type="button"
          onClick={openEditor}
          className="flex min-h-9 items-center gap-1.5 self-start text-sm font-semibold text-primary"
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          {questionCount > 0 ? `Edit quiz (${questionCount} question${questionCount === 1 ? '' : 's'})` : 'Add end-of-mission quiz'}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <QuizEditor
            questions={quizQuestions}
            onQuestionsChange={setQuizQuestions}
            starReward={quizStarReward}
            onStarRewardChange={setQuizStarReward}
          />
          {error && (
            <p role="alert" className="text-alert">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setEditingQuiz(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSaveQuiz} disabled={saving}>
              {saving ? 'Saving…' : 'Save quiz'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ videos: Video[] }>('/videos');
      setVideos(data.videos);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleDelete(id: string) {
    await apiFetch(`/videos/${id}`, { method: 'DELETE', token });
    refresh();
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Admin dashboard</h1>
          <p className="text-text-muted">{user?.name}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-text-muted"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <AddVideoForm onAdded={refresh} />

      <h2 className="mb-3 text-lg font-bold text-text">Missions</h2>
      {loading ? (
        <p className="text-text-muted">Loading…</p>
      ) : videos.length === 0 ? (
        <Card className="text-center text-text-muted">No missions yet. Add one above.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {videos.map((video) => (
            <VideoRow
              key={video.id}
              video={video}
              token={token}
              onDelete={handleDelete}
              onSaved={(updated) => setVideos((vs) => vs.map((v) => (v.id === updated.id ? updated : v)))}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, UploadCloud } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch, apiUpload, ApiError } from '../../lib/api';
import type { Video } from '../../types/backend';

type Source = 'link' | 'upload';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setTitle('');
    setDescription('');
    setUrl('');
    setFile(null);
    setSource('link');
    setOpen(false);
  }

  async function handleAdd() {
    setError('');
    setSaving(true);
    try {
      if (source === 'upload' && file) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);
        await apiUpload('/videos/upload', { formData, token });
      } else {
        await apiFetch('/videos', { method: 'POST', token, body: { title, description, url } });
      }
      reset();
      onAdded();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add video. Please try again.');
    } finally {
      setSaving(false);
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
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-3 text-text-muted"
          >
            <UploadCloud className="h-5 w-5" aria-hidden="true" />
            {file ? file.name : 'Choose a video file (max 300MB)'}
          </button>
        </div>
      )}
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
            <Card key={video.id} className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-text">{video.title}</p>
                {video.description && <p className="text-sm text-text-muted">{video.description}</p>}
                <p className="truncate text-sm text-primary">{video.url}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(video.id)}
                aria-label="Delete video"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-alert"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

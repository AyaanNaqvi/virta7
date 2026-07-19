import { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, UserPlus, ChevronRight } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch, ApiError } from '../../lib/api';
import { AVATAR_OPTIONS } from '../../data/avatars';
import type { BackendChild } from '../../types/backend';

function AddChildForm({ onAdded }: { onAdded: () => void }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [avatarId, setAvatarId] = useState(AVATAR_OPTIONS[0].id);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    setError('');
    if (!/^\d{4,6}$/.test(pin)) {
      setError('PIN must be 4-6 digits.');
      return;
    }
    setSaving(true);
    try {
      await apiFetch('/children', { method: 'POST', token, body: { name, avatarId, pin } });
      setName('');
      setPin('');
      setOpen(false);
      onAdded();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add child.');
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
        icon={<UserPlus className="h-5 w-5" aria-hidden="true" />}
        onClick={() => setOpen(true)}
        className="mb-6"
      >
        Add child
      </Button>
    );
  }

  return (
    <Card className="mb-6 flex flex-col gap-3">
      <p className="font-bold text-text">Add a child</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Child's name"
        aria-label="Child's name"
        className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-text"
      />
      <div className="grid grid-cols-4 gap-2">
        {AVATAR_OPTIONS.map((a) => {
          const Icon = a.icon;
          const selected = a.id === avatarId;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setAvatarId(a.id)}
              aria-pressed={selected}
              className={`flex min-h-11 items-center justify-center rounded-xl border-2 py-2 ${
                selected ? 'border-primary' : 'border-border'
              }`}
            >
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <input
        type="password"
        inputMode="numeric"
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
        placeholder="4-digit PIN for child login"
        aria-label="Child PIN"
        className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-text"
      />
      {error && (
        <p role="alert" className="text-alert">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleAdd} disabled={saving || !name || pin.length < 4}>
          Save
        </Button>
      </div>
    </Card>
  );
}

export function TutorDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [children, setChildren] = useState<BackendChild[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ children: BackendChild[] }>('/children', { token });
      setChildren(data.children);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Tutor dashboard</h1>
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

      <AddChildForm onAdded={refresh} />

      <h2 className="mb-3 text-lg font-bold text-text">Your children</h2>
      {loading ? (
        <p className="text-text-muted">Loading…</p>
      ) : children.length === 0 ? (
        <Card className="text-center text-text-muted">No children yet. Add one above.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {children.map((child) => {
            const Icon = AVATAR_OPTIONS.find((a) => a.id === child.avatarId)?.icon ?? AVATAR_OPTIONS[0].icon;
            return (
              <Link key={child.id} to={`/tutor/child/${child.id}`} className="block">
                <Card className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-text">{child.name}</p>
                    <p className="text-sm text-text-muted">
                      Login code: <span className="font-mono font-semibold text-text">{child.loginCode}</span>
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-text-muted" aria-hidden="true" />
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-text-muted">
        Videos are managed by an admin and shown to every child automatically.
      </p>
    </PageContainer>
  );
}

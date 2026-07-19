import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { useAuth, roleHome } from '../../contexts/AuthContext';
import { ApiError } from '../../lib/api';

type Mode = 'grownup' | 'child';

export function Login() {
  const navigate = useNavigate();
  const { login, childLogin, user } = useAuth();
  const [mode, setMode] = useState<Mode>('grownup');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginCode, setLoginCode] = useState('');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (user) navigate(roleHome(user.role), { replace: true });
  }, [user, navigate]);

  async function handleGrownupLogin() {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleChildLogin() {
    setError('');
    setLoading(true);
    try {
      await childLogin(loginCode, pin);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <h1 className="mb-1 text-2xl font-bold text-text">Log in</h1>
      <p className="mb-6 text-text-muted">Welcome back to Virta7.</p>

      <div className="mb-6">
        <SegmentedControl
          ariaLabel="Login as"
          options={[
            { value: 'grownup', label: 'Tutor / Admin' },
            { value: 'child', label: "Child's code" },
          ]}
          value={mode}
          onChange={(v) => {
            setMode(v as Mode);
            setError('');
          }}
        />
      </div>

      {error && (
        <p role="alert" className="mb-4 text-alert">
          {error}
        </p>
      )}

      {mode === 'grownup' ? (
        <>
          <label className="mb-4 block">
            <span className="mb-2 block font-semibold text-text">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-surface px-4 text-text"
              autoComplete="email"
            />
          </label>
          <label className="mb-6 block">
            <span className="mb-2 block font-semibold text-text">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-surface px-4 text-text"
              autoComplete="current-password"
            />
          </label>
          <Button size="lg" fullWidth onClick={handleGrownupLogin} disabled={loading || !email || !password}>
            Log in
          </Button>
          <p className="mt-4 text-center text-text-muted">
            No account? <Link to="/register" className="font-semibold text-primary">Register</Link>
          </p>
        </>
      ) : (
        <>
          <p className="mb-4 text-text-muted">
            Enter the login code and PIN your tutor gave you.
          </p>
          <label className="mb-4 block">
            <span className="mb-2 block font-semibold text-text">Login code</span>
            <input
              type="text"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
              placeholder="e.g. AB3K9Q"
              autoCapitalize="characters"
              className="min-h-14 w-full rounded-2xl border-2 border-border bg-surface px-4 text-center text-2xl tracking-[0.2em] text-text"
            />
          </label>
          <label className="mb-6 block">
            <span className="mb-2 block font-semibold text-text">PIN</span>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="min-h-14 w-full rounded-2xl border-2 border-border bg-surface px-4 text-center text-2xl tracking-[0.4em] text-text"
            />
          </label>
          <Button
            size="lg"
            fullWidth
            onClick={handleChildLogin}
            disabled={loading || loginCode.length < 4 || pin.length < 4}
          >
            Enter
          </Button>
        </>
      )}
    </PageContainer>
  );
}

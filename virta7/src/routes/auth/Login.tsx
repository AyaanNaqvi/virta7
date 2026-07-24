import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Languages } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { useAuth, roleHome } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LOCALES, type LocaleCode } from '../../i18n/locales';
import { ApiError } from '../../lib/api';

type Mode = 'grownup' | 'child';

export function Login() {
  const navigate = useNavigate();
  const { login, childLogin, user } = useAuth();
  const { t, locale, setLocale } = useLanguage();
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
      setError(err instanceof ApiError ? err.message : t('login_error'));
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
      setError(err instanceof ApiError ? err.message : t('login_error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <div className="mb-4 flex justify-end">
        <label className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-text-muted" aria-hidden="true" />
          <span className="sr-only">{t('profile_language')}</span>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as LocaleCode)}
            aria-label={t('profile_language')}
            className="min-h-11 rounded-xl border border-border bg-surface px-2 text-sm text-text"
          >
            {LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h1 className="mb-1 text-2xl font-bold text-text">{t('login_title')}</h1>
      <p className="mb-6 text-text-muted">{t('login_welcomeBack')}</p>

      <div className="mb-6">
        <SegmentedControl
          ariaLabel="Login as"
          options={[
            { value: 'grownup', label: t('login_tutorAdmin') },
            { value: 'child', label: t('login_childsCode') },
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
            <span className="mb-2 block font-semibold text-text">{t('login_email')}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-surface px-4 text-text"
              autoComplete="email"
            />
          </label>
          <label className="mb-6 block">
            <span className="mb-2 block font-semibold text-text">{t('login_password')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-surface px-4 text-text"
              autoComplete="current-password"
            />
          </label>
          <Button size="lg" fullWidth onClick={handleGrownupLogin} disabled={loading || !email || !password}>
            {t('login_logIn')}
          </Button>
          <p className="mt-4 text-center text-text-muted">
            {t('login_noAccount')} <Link to="/register" className="font-semibold text-primary">{t('login_register')}</Link>
          </p>
        </>
      ) : (
        <>
          <p className="mb-4 text-text-muted">{t('login_enterCode')}</p>
          <label className="mb-4 block">
            <span className="mb-2 block font-semibold text-text">{t('login_loginCode')}</span>
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
            <span className="mb-2 block font-semibold text-text">{t('login_pin')}</span>
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
            {t('login_enter')}
          </Button>
        </>
      )}
    </PageContainer>
  );
}

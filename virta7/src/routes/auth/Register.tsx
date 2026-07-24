import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { useAuth, roleHome } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ApiError } from '../../lib/api';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [role, setRole] = useState<'tutor' | 'admin'>('tutor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    if (password.length < 6) {
      setError(t('register_passwordLength'));
      return;
    }
    setLoading(true);
    try {
      await register({ role, name, email, password, adminCode: role === 'admin' ? adminCode : undefined });
      navigate(roleHome(role), { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('register_error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <h1 className="mb-1 text-2xl font-bold text-text">{t('register_title')}</h1>
      <p className="mb-6 text-text-muted">{t('register_subtitle')}</p>

      <div className="mb-6">
        <SegmentedControl
          ariaLabel="Account type"
          options={[
            { value: 'tutor', label: t('register_tutor') },
            { value: 'admin', label: t('register_admin') },
          ]}
          value={role}
          onChange={(v) => setRole(v as 'tutor' | 'admin')}
        />
      </div>

      {error && (
        <p role="alert" className="mb-4 text-alert">
          {error}
        </p>
      )}

      <label className="mb-4 block">
        <span className="mb-2 block font-semibold text-text">{t('register_yourName')}</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-h-11 w-full rounded-xl border border-border bg-surface px-4 text-text"
        />
      </label>
      <label className="mb-4 block">
        <span className="mb-2 block font-semibold text-text">{t('register_email')}</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 w-full rounded-xl border border-border bg-surface px-4 text-text"
          autoComplete="email"
        />
      </label>
      <label className="mb-6 block">
        <span className="mb-2 block font-semibold text-text">{t('register_password')}</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="min-h-11 w-full rounded-xl border border-border bg-surface px-4 text-text"
          autoComplete="new-password"
        />
      </label>

      {role === 'admin' && (
        <label className="mb-6 block">
          <span className="mb-2 block font-semibold text-text">{t('register_adminCode')}</span>
          <input
            type="password"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            className="min-h-11 w-full rounded-xl border border-border bg-surface px-4 text-text"
            autoComplete="off"
          />
        </label>
      )}

      <Button
        size="lg"
        fullWidth
        onClick={handleSubmit}
        disabled={loading || !name || !email || !password || (role === 'admin' && !adminCode)}
      >
        {t('register_createAccount')}
      </Button>

      <p className="mt-4 text-center text-text-muted">
        {t('register_alreadyHave')} <Link to="/login" className="font-semibold text-primary">{t('register_logIn')}</Link>
      </p>
    </PageContainer>
  );
}

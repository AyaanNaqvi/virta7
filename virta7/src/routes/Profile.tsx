import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { Toggle } from '../components/ui/Toggle';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getAvatar } from '../data/avatars';
import { LOCALES, type LocaleCode } from '../i18n/locales';
import type { FontSize } from '../types';

export function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { fontSize, setFontSize, highContrast, setHighContrast, reduceMotion, setReduceMotion } =
    useAccessibility();
  const { t, locale, setLocale } = useLanguage();
  const Avatar = getAvatar(user?.avatarId ?? 'cat').icon;

  const FONT_SIZE_OPTIONS: { value: FontSize; label: string }[] = [
    { value: 'small', label: t('profile_small') },
    { value: 'medium', label: t('profile_medium') },
    { value: 'large', label: t('profile_large') },
    { value: 'x-large', label: t('profile_xlarge') },
  ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <PageContainer>
      <h1 className="mb-6 text-2xl font-bold text-text">{t('profile_title')}</h1>

      <Card className="mb-6 flex flex-col items-center py-8 text-center">
        <span className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Avatar className="h-10 w-10 text-primary" aria-hidden="true" />
        </span>
        <p className="text-xl font-bold text-text">{user?.name || t('profile_friend')}</p>
      </Card>

      <Card className="mb-4">
        <span className="mb-3 block font-semibold text-text">{t('profile_language')}</span>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as LocaleCode)}
          aria-label={t('profile_language')}
          className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-text"
        >
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </Card>

      <Card className="mb-4">
        <span className="mb-3 block font-semibold text-text">{t('profile_textSize')}</span>
        <SegmentedControl
          ariaLabel={t('profile_textSize')}
          options={FONT_SIZE_OPTIONS}
          value={fontSize}
          onChange={setFontSize}
        />
      </Card>

      <Card className="mb-6 divide-y divide-border">
        <div className="pb-3">
          <Toggle
            checked={highContrast}
            onChange={setHighContrast}
            label={t('profile_highContrast')}
            description={t('profile_highContrastDesc')}
          />
        </div>
        <div className="pt-3">
          <Toggle
            checked={reduceMotion}
            onChange={setReduceMotion}
            label={t('profile_reduceMotion')}
            description={t('profile_reduceMotionDesc')}
          />
        </div>
      </Card>

      <Button
        variant="ghost"
        size="lg"
        fullWidth
        icon={<LogOut className="h-5 w-5" aria-hidden="true" />}
        onClick={handleLogout}
      >
        {t('profile_logOut')}
      </Button>
    </PageContainer>
  );
}

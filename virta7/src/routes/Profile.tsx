import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { Toggle } from '../components/ui/Toggle';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { getAvatar } from '../data/avatars';
import type { FontSize } from '../types';

const FONT_SIZE_OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'x-large', label: 'X-Large' },
];

export function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { fontSize, setFontSize, highContrast, setHighContrast, reduceMotion, setReduceMotion } =
    useAccessibility();
  const Avatar = getAvatar(user?.avatarId ?? 'cat').icon;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <PageContainer>
      <h1 className="mb-6 text-2xl font-bold text-text">Profile</h1>

      <Card className="mb-6 flex flex-col items-center py-8 text-center">
        <span className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Avatar className="h-10 w-10 text-primary" aria-hidden="true" />
        </span>
        <p className="text-xl font-bold text-text">{user?.name || 'Friend'}</p>
      </Card>

      <Card className="mb-4">
        <span className="mb-3 block font-semibold text-text">Text size</span>
        <SegmentedControl
          ariaLabel="Text size"
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
            label="High contrast"
            description="Stronger colors, easier to see"
          />
        </div>
        <div className="pt-3">
          <Toggle
            checked={reduceMotion}
            onChange={setReduceMotion}
            label="Reduce motion"
            description="Turns off animations"
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
        Log out
      </Button>
    </PageContainer>
  );
}

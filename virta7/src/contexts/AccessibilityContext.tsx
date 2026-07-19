import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AccessibilitySettings, FontSize } from '../types';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  reduceMotion: false,
};

interface AccessibilityContextValue extends AccessibilitySettings {
  setFontSize: (size: FontSize) => void;
  setHighContrast: (value: boolean) => void;
  setReduceMotion: (value: boolean) => void;
  prefersReducedMotionSystem: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function loadInitial(): AccessibilitySettings {
  return loadJSON<AccessibilitySettings>(STORAGE_KEYS.accessibility, DEFAULT_SETTINGS);
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadInitial);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font-size', settings.fontSize);
    root.setAttribute('data-contrast', settings.highContrast ? 'high' : 'normal');
    root.setAttribute(
      'data-reduce-motion',
      settings.reduceMotion || systemReducedMotion ? 'true' : 'false'
    );
  }, [settings, systemReducedMotion]);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.accessibility, settings);
  }, [settings]);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      ...settings,
      setFontSize: (fontSize) => setSettings((s) => ({ ...s, fontSize })),
      setHighContrast: (highContrast) => setSettings((s) => ({ ...s, highContrast })),
      setReduceMotion: (reduceMotion) => setSettings((s) => ({ ...s, reduceMotion })),
      prefersReducedMotionSystem: systemReducedMotion,
    }),
    [settings, systemReducedMotion]
  );

  return (
    <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}

export function useReduceMotion(): boolean {
  const { reduceMotion, prefersReducedMotionSystem } = useAccessibility();
  return reduceMotion || prefersReducedMotionSystem;
}

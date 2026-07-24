import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_LOCALE, type LocaleCode } from '../i18n/locales';
import { TRANSLATIONS, type Translations } from '../i18n/translations';
import { loadJSON, saveJSON } from '../lib/storage';

const STORAGE_KEY = 'language';

type TranslationKey = keyof Translations;

interface LanguageContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(() =>
    loadJSON<LocaleCode>(STORAGE_KEY, DEFAULT_LOCALE)
  );

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
    saveJSON(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      const dict = TRANSLATIONS[locale] ?? TRANSLATIONS[DEFAULT_LOCALE];
      let text = dict[key] ?? TRANSLATIONS[DEFAULT_LOCALE][key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
        }
      }
      return text;
    },
    [locale]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

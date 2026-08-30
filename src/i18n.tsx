import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { L, Locale } from './content';

const STORAGE_KEY = 'fllcker.locale';

type LocaleValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  /** Разворачивает двуязычное поле в строку текущего языка. */
  l: <T>(field: L<T>) => T;
};

const LocaleContext = createContext<LocaleValue | null>(null);

function readInitialLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'ru' || saved === 'en') return saved;
  // Английский — только для тех, у кого в браузере нет русского.
  return navigator.languages.some((tag) => tag.toLowerCase().startsWith('ru')) ? 'ru' : 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const l = useCallback(<T,>(field: L<T>): T => field[locale], [locale]);

  const value = useMemo<LocaleValue>(() => ({ locale, setLocale, l }), [locale, setLocale, l]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
  return ctx;
}

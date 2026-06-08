import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Lang, type Translations } from '../lib/i18n';

const STORAGE_KEY = 'weddingbook_lang';

interface LangContextValue {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial: Lang = saved === 'en' || saved === 'vi' ? saved : 'vi';
    document.documentElement.lang = initial;
    return initial;
  });

  const t = translations[lang];

  const toggleLang = () => {
    setLang((prev) => {
      const next: Lang = prev === 'vi' ? 'en' : 'vi';
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
      return next;
    });
  };

  return <LangContext.Provider value={{ lang, t, toggleLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}

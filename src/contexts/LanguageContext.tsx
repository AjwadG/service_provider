import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const availableLanguages: Language[] = [
  { code: 'en', name: 'English', isRTL: false },
  { code: 'ar', name: 'العربية', isRTL: true }
];

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(availableLanguages[0]);

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      const lang = availableLanguages.find(l => l.code === storedLang);
      if (lang) {
        setLanguageState(lang);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = language.isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language.code;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang.code);
  };

  const t = (key: string): string => {
    return translations[language.code]?.[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    availableLanguages
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
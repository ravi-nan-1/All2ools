"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { languages, translations } from '@/lib/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translate: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && languages.some(lang => lang.code === storedLanguage)) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (languages.some(l => l.code === lang)) {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    }
  };

  const translate = useCallback((key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

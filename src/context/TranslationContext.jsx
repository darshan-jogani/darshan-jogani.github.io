import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Define your EN/DE dictionary here!
const dictionary = {
  en: {
    'nav.about': 'About',
    'nav.research': 'Research',
    'nav.pubs': 'Pubs',
    'nav.talks': 'Talks',
    'nav.contact': 'Contact',
  },
  de: {
    'nav.about': 'Über mich',
    'nav.research': 'Forschung',
    'nav.pubs': 'Publikationen',
    'nav.talks': 'Vorträge',
    'nav.contact': 'Kontakt',
  }
};

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('dj_lang');
    if (saved === 'en' || saved === 'de') setLang(saved);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'de' : 'en';
    setLang(newLang);
    localStorage.setItem('dj_lang', newLang);
    document.documentElement.lang = newLang; // Good for SEO & Accessibility
  };

  const t = (key) => dictionary[lang][key] || key;

  return <TranslationContext.Provider value={{ lang, toggleLang, t }}>{children}</TranslationContext.Provider>;
}

export const useTranslation = () => useContext(TranslationContext);
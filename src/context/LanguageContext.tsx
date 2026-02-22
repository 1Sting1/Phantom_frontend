'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ru, Translations } from '@/translations/ru';
import { en } from '@/translations/en';

type Language = 'ru' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('ru');

    const translations: Record<Language, Translations> = { ru, en };

    // Load language preference from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('phantom-language') as Language;
        if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
            setLanguage(savedLang);
        }
    }, []);

    // Save language preference to localStorage when it changes
    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('phantom-language', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

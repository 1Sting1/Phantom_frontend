'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ru, Translations } from '../translations/ru';
import { en } from '../translations/en';

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

    useEffect(() => {
        const savedLang = localStorage.getItem('phantom-language') as Language;
        if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
            setLanguage(savedLang);
        }
    }, []);

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

// --- Auth (in same file so Docker build has no missing module) ---

const AUTH_STORAGE_TOKEN = 'phantom-token';
const AUTH_STORAGE_REFRESH = 'phantom-refresh-token';
const AUTH_STORAGE_USER = 'phantom-user';

export interface AuthUser {
    id: string;
    email: string;
}

interface AuthContextType {
    token: string | null;
    refreshToken: string | null;
    user: AuthUser | null;
    isReady: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getAuthApiBase(): string {
    if (typeof window !== 'undefined') return window.location.origin + '/api/v1';
    return process.env.NEXT_PUBLIC_API_BASE || '/api/v1';
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isReady, setIsReady] = useState(false);

    const persistAuth = useCallback((t: string, r: string, u: AuthUser) => {
        setToken(t);
        setRefreshToken(r);
        setUser(u);
        if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_STORAGE_TOKEN, t);
            localStorage.setItem(AUTH_STORAGE_REFRESH, r);
            localStorage.setItem(AUTH_STORAGE_USER, JSON.stringify(u));
        }
    }, []);

    const clearAuth = useCallback(() => {
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_STORAGE_TOKEN);
            localStorage.removeItem(AUTH_STORAGE_REFRESH);
            localStorage.removeItem(AUTH_STORAGE_USER);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            setIsReady(true);
            return;
        }
        const t = localStorage.getItem(AUTH_STORAGE_TOKEN);
        const r = localStorage.getItem(AUTH_STORAGE_REFRESH);
        const uStr = localStorage.getItem(AUTH_STORAGE_USER);
        if (t && r && uStr) {
            try {
                const u = JSON.parse(uStr) as AuthUser;
                setToken(t);
                setRefreshToken(r);
                setUser(u);
            } catch {
                clearAuth();
            }
        }
        setIsReady(true);
    }, [clearAuth]);

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const base = getAuthApiBase();
        try {
            const res = await fetch(`${base}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                return { success: false, error: data?.error || 'Login failed' };
            }
            if (!data?.success || !data?.data?.token) {
                return { success: false, error: 'Invalid response' };
            }
            const { token: t, refresh_token: r, user: u } = data.data;
            persistAuth(t, r, { id: u.id, email: u.email });
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Ошибка сети. Проверьте подключение и доступность сервера.' };
        }
    }, [persistAuth]);

    const register = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const base = getAuthApiBase();
        try {
            const res = await fetch(`${base}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                return { success: false, error: data?.error || 'Registration failed' };
            }
            if (!data?.success || !data?.data?.token) {
                return { success: false, error: 'Invalid response' };
            }
            const { token: t, refresh_token: r, user: u } = data.data;
            persistAuth(t, r, { id: u.id, email: u.email });
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Ошибка сети. Проверьте подключение и доступность сервера.' };
        }
    }, [persistAuth]);

    const logout = useCallback(() => {
        const r = refreshToken;
        clearAuth();
        if (r) {
            fetch(`${getAuthApiBase()}/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: r }),
            }).catch(() => {});
        }
    }, [refreshToken, clearAuth]);

    const value: AuthContextType = {
        token,
        refreshToken,
        user,
        isReady,
        login,
        register,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

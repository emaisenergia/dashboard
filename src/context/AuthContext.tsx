'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    company: string;
    cnpj: string;
    website: string;
    timezone: string;
    currency: string;
    language: string;
    avatarColor: string;
    notifications: {
        emailAlerts: boolean;
        roasAlert: boolean;
        campaignStop: boolean;
        dailySummary: boolean;
        weeklyReport: boolean;
    };
    integrations: {
        tiktokToken: string;
        tiktokPixel: string;
        facebookToken: string;
        shopifyUrl: string;
        shopifyKey: string;
        googleAdsId: string;
    };
    twoFA: boolean;
    sessionTimeout: string;
}

const defaultNotifications = {
    emailAlerts: true,
    roasAlert: true,
    campaignStop: true,
    dailySummary: false,
    weeklyReport: true,
};

const defaultIntegrations = {
    tiktokToken: '',
    tiktokPixel: '',
    facebookToken: '',
    shopifyUrl: '',
    shopifyKey: '',
    googleAdsId: '',
};

// Base user template used when registering new accounts
const BASE_USER: Omit<User, 'id' | 'name' | 'email' | 'company'> = {
    phone: '',
    role: 'Administrador',
    cnpj: '',
    website: '',
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    language: 'pt-BR',
    avatarColor: 'linear-gradient(135deg, hsl(262 83% 60%), hsl(200 83% 50%))',
    notifications: defaultNotifications,
    integrations: defaultIntegrations,
    twoFA: false,
    sessionTimeout: '30',
};

const STORAGE_KEY = 'opsdash_user';
const CREDENTIALS_KEY = 'opsdash_credentials';

function getCredentials(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    try {
        return JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || '{}');
    } catch { return {}; }
}

function saveCredential(email: string, passwordHash: string) {
    const creds = getCredentials();
    creds[email] = passwordHash;
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
}

function hashPassword(pw: string): string {
    return btoa(pw + '_opsdash_salt');
}

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    register: (name: string, email: string, password: string, company: string) => Promise<{ ok: boolean; error?: string }>;
    logout: () => void;
    updateUser: (patch: Partial<User>) => void;
    updatePassword: (current: string, next: string) => { ok: boolean; error?: string };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Restore session + seed default admin on first run
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch { /* ignore */ }

        // Seed default admin account on first load (credentials not shown in UI)
        const creds = getCredentials();
        const adminEmail = atob('bGVvQGRhc2hib2FyZC5jb20='); // leo@dashboard.com
        if (!creds[adminEmail]) {
            saveCredential(adminEmail, hashPassword(atob('YWRtaW4xMjM='))); // admin123
        }

        setLoading(false);
    }, []);

    const persistUser = useCallback((u: User) => {
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const creds = getCredentials();
        const hash = hashPassword(password);
        if (!creds[email]) return { ok: false, error: 'E-mail não encontrado.' };
        if (creds[email] !== hash) return { ok: false, error: 'Senha incorreta.' };

        // Load user data
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const u = JSON.parse(stored) as User;
                if (u.email === email) { persistUser(u); return { ok: true }; }
            }
        } catch { /* ignore */ }

        const u: User = { ...BASE_USER, id: `u_${Date.now()}`, name: email.split('@')[0], email, company: '' };
        persistUser(u);
        return { ok: true };
    }, [persistUser]);

    const register = useCallback(async (name: string, email: string, password: string, company: string) => {
        const creds = getCredentials();
        if (creds[email]) return { ok: false, error: 'E-mail já cadastrado.' };
        saveCredential(email, hashPassword(password));
        const u: User = {
            ...BASE_USER,
            id: `u_${Date.now()}`,
            name,
            email,
            company,
        };
        persistUser(u);
        return { ok: true };
    }, [persistUser]);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const updateUser = useCallback((patch: Partial<User>) => {
        setUser(prev => {
            if (!prev) return prev;
            const updated = { ...prev, ...patch };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const updatePassword = useCallback((current: string, next: string) => {
        if (!user) return { ok: false, error: 'Não autenticado.' };
        const creds = getCredentials();
        if (creds[user.email] !== hashPassword(current)) return { ok: false, error: 'Senha atual incorreta.' };
        saveCredential(user.email, hashPassword(next));
        return { ok: true };
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

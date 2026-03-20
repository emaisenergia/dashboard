'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const Toaster = dynamic(() => import('sonner').then(m => ({ default: m.Toaster })), { ssr: false });

interface AppLayoutProps {
    children: React.ReactNode;
}

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center" style={{ background: 'hsl(222 47% 7%)' }}>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: 'hsl(262 83% 66%)', borderTopColor: 'transparent' }} />
                    <p className="text-sm" style={{ color: 'hsl(215 20% 55%)' }}>Carregando...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}

function LayoutInner({ children }: AppLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: 'hsl(var(--background))' }}>
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
                {children}
            </main>
            <Toaster
                position="bottom-right"
                theme="dark"
                toastOptions={{
                    style: {
                        background: 'hsl(var(--surface-elevated))',
                        border: '1px solid hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                        fontFamily: 'DM Sans, sans-serif',
                    },
                }}
            />
        </div>
    );
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <AuthProvider>
            <AppProvider>
                <AuthGuard>
                    <LayoutInner>
                        {children}
                    </LayoutInner>
                </AuthGuard>
            </AppProvider>
        </AuthProvider>
    );
}

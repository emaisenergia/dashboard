'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Rocket, Mail, Lock, AlertCircle } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function LoginForm() {
    const router = useRouter();
    const { login, user, loading } = useAuth();
    const [email, setEmail] = useState('marcos@opsdash.com');
    const [password, setPassword] = useState('admin123');
    const [showPass, setShowPass] = useState(false);
    const [remember, setRemember] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && user) router.replace('/operations-dashboard');
    }, [user, loading, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        const res = await login(email, password);
        setSubmitting(false);
        if (res.ok) {
            router.push('/operations-dashboard');
        } else {
            setError(res.error || 'Erro ao entrar.');
        }
    }

    const inp = (icon: React.ReactNode, content: React.ReactNode) => (
        <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'hsl(215 20% 45%)' }}>{icon}</span>
            {content}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'hsl(222 47% 7%)' }}>

            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, hsl(262 83% 66%), transparent 70%)' }} />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, hsl(200 83% 55%), transparent 70%)' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 66%), hsl(240 83% 52%))' }}>
                        <Rocket size={22} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Bem-vindo ao OpsDash</h1>
                    <p className="text-sm mt-1" style={{ color: 'hsl(215 20% 55%)' }}>
                        Entre na sua conta para continuar
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl p-8"
                    style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>

                    {error && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm"
                            style={{ background: 'hsl(0 60% 12%)', border: '1px solid hsl(0 60% 22%)', color: 'hsl(0 84% 65%)' }}>
                            <AlertCircle size={15} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                                style={{ color: 'hsl(215 20% 50%)' }}>E-mail</label>
                            {inp(<Mail size={15} />,
                                <input
                                    type="email" required autoComplete="email"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                                    style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 92%)' }}
                                    placeholder="seu@email.com"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                                style={{ color: 'hsl(215 20% 50%)' }}>Senha</label>
                            {inp(<Lock size={15} />,
                                <input
                                    type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm outline-none"
                                    style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 92%)' }}
                                    placeholder="••••••••"
                                />
                            )}
                            <button type="button" onClick={() => setShowPass(v => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2"
                                style={{ color: 'hsl(215 20% 45%)' }}>
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                                    className="w-4 h-4 rounded cursor-pointer accent-violet-500" />
                                <span className="text-sm" style={{ color: 'hsl(215 20% 60%)' }}>Lembrar de mim</span>
                            </label>
                            <button type="button" className="text-sm font-medium transition-colors"
                                style={{ color: 'hsl(262 83% 70%)' }}>
                                Esqueceu a senha?
                            </button>
                        </div>

                        <button type="submit" disabled={submitting}
                            className="w-full py-2.5 rounded-xl font-semibold text-white text-sm mt-2 transition-all"
                            style={{
                                background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))',
                                opacity: submitting ? 0.7 : 1,
                            }}>
                            {submitting ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 text-center text-sm" style={{ borderTop: '1px solid hsl(222 30% 16%)' }}>
                        <span style={{ color: 'hsl(215 20% 50%)' }}>Não tem uma conta? </span>
                        <Link href="/register" className="font-semibold transition-colors"
                            style={{ color: 'hsl(262 83% 72%)' }}>
                            Criar conta
                        </Link>
                    </div>
                </div>

                {/* Demo hint */}
                <div className="mt-4 text-center text-xs px-4 py-2.5 rounded-lg"
                    style={{ background: 'hsl(262 83% 10%)', border: '1px solid hsl(262 83% 18%)', color: 'hsl(262 83% 65%)' }}>
                    Demo: <strong>marcos@opsdash.com</strong> · senha: <strong>admin123</strong>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <AuthProvider>
            <LoginForm />
        </AuthProvider>
    );
}

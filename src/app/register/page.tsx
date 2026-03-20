'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Rocket, Mail, Lock, User, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function RegisterForm() {
    const router = useRouter();
    const { register, user, loading } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', company: '', password: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && user) router.replace('/operations-dashboard');
    }, [user, loading, router]);

    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    const strength = (() => {
        const p = form.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    })();

    const strengthLabel = ['', 'Fraca', 'Razoável', 'Boa', 'Forte'];
    const strengthColor = ['', 'hsl(0 84% 60%)', 'hsl(38 92% 56%)', 'hsl(43 96% 56%)', 'hsl(142 71% 45%)'];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) { setError('As senhas não coincidem.'); return; }
        if (form.password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return; }
        setSubmitting(true);
        const res = await register(form.name, form.email, form.password, form.company);
        setSubmitting(false);
        if (res.ok) router.push('/operations-dashboard');
        else setError(res.error || 'Erro ao criar conta.');
    }

    const field = (label: string, icon: React.ReactNode, input: React.ReactNode) => (
        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'hsl(215 20% 50%)' }}>{label}</label>
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'hsl(215 20% 45%)' }}>{icon}</span>
                {input}
            </div>
        </div>
    );

    const inputStyle = { background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 92%)' };
    const inputCls = "w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8"
            style={{ background: 'hsl(222 47% 7%)' }}>
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, hsl(262 83% 66%), transparent 70%)' }} />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, hsl(142 71% 45%), transparent 70%)' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 66%), hsl(240 83% 52%))' }}>
                        <Rocket size={22} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Criar sua conta</h1>
                    <p className="text-sm mt-1" style={{ color: 'hsl(215 20% 55%)' }}>
                        Comece a gerenciar seus anúncios hoje
                    </p>
                </div>

                <div className="rounded-2xl p-8"
                    style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>

                    {error && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm"
                            style={{ background: 'hsl(0 60% 12%)', border: '1px solid hsl(0 60% 22%)', color: 'hsl(0 84% 65%)' }}>
                            <AlertCircle size={15} className="shrink-0" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {field('Nome completo', <User size={15} />,
                            <input style={inputStyle} className={inputCls} type="text" required placeholder="Seu nome completo"
                                value={form.name} onChange={e => set('name', e.target.value)} />
                        )}
                        {field('E-mail', <Mail size={15} />,
                            <input style={inputStyle} className={inputCls} type="email" required placeholder="seu@email.com"
                                value={form.email} onChange={e => set('email', e.target.value)} />
                        )}
                        {field('Empresa', <Building2 size={15} />,
                            <input style={inputStyle} className={inputCls} type="text" placeholder="Nome da sua empresa"
                                value={form.company} onChange={e => set('company', e.target.value)} />
                        )}
                        {field('Senha', <Lock size={15} />,
                            <input style={inputStyle} className={`${inputCls} pr-10`}
                                type={showPass ? 'text' : 'password'} required placeholder="Mínimo 6 caracteres"
                                value={form.password} onChange={e => set('password', e.target.value)} />
                        )}

                        {/* Password strength */}
                        {form.password && (
                            <div className="-mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex-1 h-1 rounded-full transition-all"
                                            style={{ background: i <= strength ? strengthColor[strength] : 'hsl(222 30% 18%)' }} />
                                    ))}
                                </div>
                                <p className="text-xs" style={{ color: strengthColor[strength] }}>
                                    Força: {strengthLabel[strength]}
                                </p>
                            </div>
                        )}

                        {field('Confirmar senha', <Lock size={15} />,
                            <input style={inputStyle} className={`${inputCls} pr-10`}
                                type={showPass ? 'text' : 'password'} required placeholder="Repita a senha"
                                value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                        )}

                        {/* Passwords match indicator */}
                        {form.confirm && (
                            <div className="flex items-center gap-1.5 -mt-2 text-xs"
                                style={{ color: form.password === form.confirm ? 'hsl(142 71% 50%)' : 'hsl(0 84% 60%)' }}>
                                {form.password === form.confirm
                                    ? <><CheckCircle2 size={13} /> Senhas coincidem</>
                                    : <><AlertCircle size={13} /> Senhas não coincidem</>}
                            </div>
                        )}

                        <button type="button" onClick={() => setShowPass(v => !v)}
                            className="text-xs flex items-center gap-1.5 -mt-1 transition-colors"
                            style={{ color: 'hsl(215 20% 50%)' }}>
                            {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                            {showPass ? 'Ocultar senhas' : 'Mostrar senhas'}
                        </button>

                        <button type="submit" disabled={submitting}
                            className="w-full py-2.5 rounded-xl font-semibold text-white text-sm mt-2 transition-all"
                            style={{
                                background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))',
                                opacity: submitting ? 0.7 : 1,
                            }}>
                            {submitting ? 'Criando conta...' : 'Criar conta'}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 text-center text-sm" style={{ borderTop: '1px solid hsl(222 30% 16%)' }}>
                        <span style={{ color: 'hsl(215 20% 50%)' }}>Já tem uma conta? </span>
                        <Link href="/login" className="font-semibold" style={{ color: 'hsl(262 83% 72%)' }}>
                            Entrar
                        </Link>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs" style={{ color: 'hsl(215 20% 40%)' }}>
                    Ao criar uma conta, você concorda com os Termos de Uso e Política de Privacidade.
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <AuthProvider>
            <RegisterForm />
        </AuthProvider>
    );
}

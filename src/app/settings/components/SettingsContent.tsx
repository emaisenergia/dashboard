'use client';
import React, { useState } from 'react';
import {
    User, Lock, Bell, Plug, Building2, Globe,
    Camera, CheckCircle2, AlertCircle, Save, Eye, EyeOff,
    Shield, ChevronRight, LogOut, Trash2, DatabaseZap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// ── Shared styles ─────────────────────────────────────────────────────────────
const inp = {
    background: 'hsl(222 40% 13%)',
    border: '1px solid hsl(222 30% 20%)',
    color: 'hsl(210 40% 92%)',
    borderRadius: '10px',
    padding: '9px 13px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
} as React.CSSProperties;

const lbl = (t: string) => (
    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
        style={{ color: 'hsl(215 20% 50%)' }}>{t}</label>
);

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-2xl p-6 ${className}`}
        style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
        {children}
    </div>
);

const SectionTitle = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'hsl(262 83% 18%)' }}>
            <span style={{ color: 'hsl(262 83% 70%)' }}>{icon}</span>
        </div>
        <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>{sub}</p>
        </div>
    </div>
);

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button type="button" onClick={() => onChange(!checked)}
            className="relative w-11 h-6 rounded-full transition-all duration-200 shrink-0"
            style={{ background: checked ? 'hsl(262 83% 58%)' : 'hsl(222 30% 22%)' }}>
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
                style={{ left: checked ? '22px' : '2px' }} />
        </button>
    );
}

const timezones = ['America/Sao_Paulo', 'America/Manaus', 'America/Fortaleza', 'America/Belem', 'America/Recife', 'UTC'];
const currencies = ['BRL', 'USD', 'EUR'];
const languages = [{ value: 'pt-BR', label: 'Português (BR)' }, { value: 'en-US', label: 'English (US)' }, { value: 'es', label: 'Español' }];

// ─────────────────────────────────────────────────────────────────────────────
// Sections
// ─────────────────────────────────────────────────────────────────────────────

function ProfileSection() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || '',
    });
    const [saved, setSaved] = useState(false);
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        updateUser(form);
        setSaved(true);
        toast.success('Perfil atualizado com sucesso!');
        setTimeout(() => setSaved(false), 3000);
    }

    const initials = (user?.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    return (
        <Card>
            <SectionTitle icon={<User size={16} />} title="Meu Perfil" sub="Informações pessoais e de contato" />

            {/* Avatar */}
            <div className="flex items-center gap-5 mb-6 pb-6" style={{ borderBottom: '1px solid hsl(222 30% 15%)' }}>
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 60%), hsl(200 83% 50%))' }}>
                        {initials}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'hsl(262 83% 50%)', border: '2px solid hsl(222 40% 10%)' }}>
                        <Camera size={12} className="text-white" />
                    </button>
                </div>
                <div>
                    <p className="font-semibold text-white text-lg">{user?.name}</p>
                    <p className="text-sm mt-0.5" style={{ color: 'hsl(215 20% 55%)' }}>{user?.email}</p>
                    <span className="mt-1.5 inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: 'hsl(262 83% 18%)', color: 'hsl(262 83% 72%)' }}>
                        {user?.role || 'Administrador'}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>{lbl('Nome completo')}<input style={inp} value={form.name} onChange={e => set('name', e.target.value)} /></div>
                    <div>{lbl('E-mail')}<input style={inp} type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>{lbl('Telefone / WhatsApp')}<input style={inp} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+55 11 99999-0000" /></div>
                    <div>{lbl('Cargo / Função')}<input style={inp} value={form.role} onChange={e => set('role', e.target.value)} placeholder="Ex: Gestor de Tráfego" /></div>
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                        style={{ background: saved ? 'hsl(142 60% 30%)' : 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                        {saved ? <><CheckCircle2 size={15} /> Salvo!</> : <><Save size={15} /> Salvar Perfil</>}
                    </button>
                </div>
            </form>
        </Card>
    );
}

function SecuritySection() {
    const { updatePassword, updateUser, user } = useAuth();
    const [form, setForm] = useState({ current: '', next: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [ok, setOk] = useState(false);
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setOk(false);
        if (form.next !== form.confirm) { setError('As senhas não coincidem.'); return; }
        if (form.next.length < 6) { setError('Nova senha deve ter pelo menos 6 caracteres.'); return; }
        const res = updatePassword(form.current, form.next);
        if (res.ok) {
            setOk(true);
            toast.success('Senha alterada com sucesso!');
            setForm({ current: '', next: '', confirm: '' });
            setTimeout(() => setOk(false), 3000);
        } else {
            setError(res.error || 'Erro ao alterar senha.');
        }
    }

    const passInp = (label: string, key: string, placeholder: string) => (
        <div>
            {lbl(label)}
            <input style={inp} type={showPass ? 'text' : 'password'} placeholder={placeholder}
                value={(form as any)[key]} onChange={e => set(key, e.target.value)} />
        </div>
    );

    return (
        <Card>
            <SectionTitle icon={<Lock size={16} />} title="Segurança" sub="Senha e configurações de acesso" />

            {/* Change password */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Alterar Senha</h3>

                {error && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                        style={{ background: 'hsl(0 60% 12%)', border: '1px solid hsl(0 60% 22%)', color: 'hsl(0 84% 65%)' }}>
                        <AlertCircle size={14} className="shrink-0" /> {error}
                    </div>
                )}
                {ok && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                        style={{ background: 'hsl(142 60% 10%)', border: '1px solid hsl(142 60% 20%)', color: 'hsl(142 71% 55%)' }}>
                        <CheckCircle2 size={14} /> Senha alterada com sucesso!
                    </div>
                )}

                {passInp('Senha Atual', 'current', '••••••••')}
                <div className="grid grid-cols-2 gap-4">
                    {passInp('Nova Senha', 'next', 'Mínimo 6 caracteres')}
                    {passInp('Confirmar Nova Senha', 'confirm', 'Repita a nova senha')}
                </div>

                <div className="flex items-center justify-between pt-1">
                    <button type="button" onClick={() => setShowPass(v => !v)}
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: 'hsl(215 20% 50%)' }}>
                        {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                        {showPass ? 'Ocultar' : 'Mostrar'} senhas
                    </button>
                    <button type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                        <Shield size={14} /> Alterar Senha
                    </button>
                </div>
            </form>

            {/* 2FA & Session */}
            <div className="mt-6 pt-6 space-y-4" style={{ borderTop: '1px solid hsl(222 30% 15%)' }}>
                <h3 className="text-sm font-semibold text-white">Autenticação & Sessão</h3>

                <div className="flex items-center justify-between py-3 px-4 rounded-xl"
                    style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)' }}>
                    <div>
                        <p className="text-sm font-medium text-white">Autenticação em dois fatores (2FA)</p>
                        <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>Adiciona camada extra de segurança</p>
                    </div>
                    <Toggle checked={user?.twoFA || false} onChange={v => updateUser({ twoFA: v })} />
                </div>

                <div className="flex items-center justify-between py-3 px-4 rounded-xl"
                    style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)' }}>
                    <div>
                        <p className="text-sm font-medium text-white">Timeout de sessão</p>
                        <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>Desconectar após inatividade</p>
                    </div>
                    <select value={user?.sessionTimeout || '30'} onChange={e => updateUser({ sessionTimeout: e.target.value })}
                        className="appearance-none px-3 py-1.5 rounded-lg text-sm outline-none cursor-pointer"
                        style={{ background: 'hsl(222 40% 16%)', border: '1px solid hsl(222 30% 22%)', color: 'hsl(210 40% 90%)' }}>
                        {['15', '30', '60', '120', '480'].map(v => <option key={v} value={v}>{v} min</option>)}
                    </select>
                </div>
            </div>
        </Card>
    );
}

function CompanySection() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        company: user?.company || '',
        cnpj: user?.cnpj || '',
        website: user?.website || '',
        timezone: user?.timezone || 'America/Sao_Paulo',
        currency: user?.currency || 'BRL',
        language: user?.language || 'pt-BR',
    });
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        updateUser(form);
        toast.success('Dados da empresa atualizados!');
    }

    return (
        <Card>
            <SectionTitle icon={<Building2 size={16} />} title="Empresa" sub="Dados da empresa e configurações regionais" />
            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>{lbl('Nome da Empresa')}<input style={inp} value={form.company} onChange={e => set('company', e.target.value)} placeholder="Nome da empresa" /></div>
                    <div>{lbl('CNPJ')}<input style={inp} value={form.cnpj} onChange={e => set('cnpj', e.target.value)} placeholder="00.000.000/0000-00" /></div>
                </div>
                <div>
                    {lbl('Website')}
                    <input style={inp} type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://suaempresa.com" />
                </div>

                <div style={{ borderTop: '1px solid hsl(222 30% 15%)' }} className="pt-4 mt-2">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Globe size={14} /> Configurações Regionais
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            {lbl('Fuso Horário')}
                            <select style={inp} value={form.timezone} onChange={e => set('timezone', e.target.value)} className="cursor-pointer">
                                {timezones.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            {lbl('Moeda')}
                            <select style={inp} value={form.currency} onChange={e => set('currency', e.target.value)} className="cursor-pointer">
                                {currencies.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            {lbl('Idioma')}
                            <select style={inp} value={form.language} onChange={e => set('language', e.target.value)} className="cursor-pointer">
                                {languages.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                        <Save size={15} /> Salvar
                    </button>
                </div>
            </form>
        </Card>
    );
}

function NotificationsSection() {
    const { user, updateUser } = useAuth();
    const notif = user?.notifications || { emailAlerts: true, roasAlert: true, campaignStop: true, dailySummary: false, weeklyReport: true };

    const items = [
        { key: 'emailAlerts', label: 'Alertas por e-mail', sub: 'Receba notificações importantes no e-mail cadastrado' },
        { key: 'roasAlert', label: 'Alerta de ROAS abaixo da meta', sub: 'Notificar quando ROAS cair abaixo de 3.0x' },
        { key: 'campaignStop', label: 'Campanha pausada automaticamente', sub: 'Alerta quando uma campanha for pausada' },
        { key: 'dailySummary', label: 'Resumo diário', sub: 'Relatório automático todos os dias às 08h' },
        { key: 'weeklyReport', label: 'Relatório semanal', sub: 'Resumo completo toda segunda-feira' },
    ];

    return (
        <Card>
            <SectionTitle icon={<Bell size={16} />} title="Notificações" sub="Configure quais alertas você deseja receber" />
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 px-4 rounded-xl"
                        style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)' }}>
                        <div>
                            <p className="text-sm font-medium text-white">{item.label}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>{item.sub}</p>
                        </div>
                        <Toggle
                            checked={(notif as any)[item.key]}
                            onChange={v => updateUser({ notifications: { ...notif, [item.key]: v } })}
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
}

function IntegrationCard({ name, color, icon, fields, values, onSave }: {
    name: string; color: string; icon: string;
    fields: { key: string; label: string; placeholder: string; type?: string }[];
    values: Record<string, string>;
    onSave: (v: Record<string, string>) => void;
}) {
    const [form, setForm] = useState(values);
    const [open, setOpen] = useState(false);
    const connected = Object.values(values).some(v => v.length > 0);

    return (
        <div className="rounded-xl overflow-hidden"
            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)' }}>
            <button type="button" onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-white">{name}</p>
                        <p className="text-xs" style={{ color: connected ? 'hsl(142 71% 50%)' : 'hsl(215 20% 45%)' }}>
                            {connected ? '✓ Configurado' : 'Não configurado'}
                        </p>
                    </div>
                </div>
                <ChevronRight size={16} className={`transition-transform ${open ? 'rotate-90' : ''}`}
                    style={{ color: 'hsl(215 20% 50%)' }} />
            </button>

            {open && (
                <div className="px-5 pb-5 space-y-3 pt-1" style={{ borderTop: '1px solid hsl(222 30% 15%)' }}>
                    {fields.map(f => (
                        <div key={f.key}>
                            {lbl(f.label)}
                            <input style={inp} type={f.type || 'text'} placeholder={f.placeholder}
                                value={form[f.key] || ''} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} />
                        </div>
                    ))}
                    <button onClick={() => { onSave(form); toast.success(`${name} salvo!`); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                        <Save size={13} /> Salvar Integração
                    </button>
                </div>
            )}
        </div>
    );
}

function IntegrationsSection() {
    const { user, updateUser } = useAuth();
    const integ = user?.integrations || { tiktokToken: '', tiktokPixel: '', facebookToken: '', shopifyUrl: '', shopifyKey: '', googleAdsId: '' };

    const integrations = [
        {
            name: 'TikTok Ads', icon: '🎵', color: 'hsl(180 80% 50%)',
            fields: [
                { key: 'tiktokToken', label: 'Access Token', placeholder: 'TikTok Ads Access Token' },
                { key: 'tiktokPixel', label: 'Pixel ID', placeholder: 'ID do Pixel TikTok' },
            ],
            keys: ['tiktokToken', 'tiktokPixel'],
        },
        {
            name: 'Facebook Ads', icon: '📘', color: 'hsl(220 80% 60%)',
            fields: [{ key: 'facebookToken', label: 'Access Token', placeholder: 'Facebook Ads Access Token' }],
            keys: ['facebookToken'],
        },
        {
            name: 'Shopify', icon: '🛒', color: 'hsl(142 60% 50%)',
            fields: [
                { key: 'shopifyUrl', label: 'URL da Loja', placeholder: 'sua-loja.myshopify.com' },
                { key: 'shopifyKey', label: 'API Key', placeholder: 'Shopify Admin API Key' },
            ],
            keys: ['shopifyUrl', 'shopifyKey'],
        },
        {
            name: 'Google Ads', icon: '🔍', color: 'hsl(38 92% 56%)',
            fields: [{ key: 'googleAdsId', label: 'Customer ID', placeholder: '000-000-0000' }],
            keys: ['googleAdsId'],
        },
    ];

    return (
        <Card>
            <SectionTitle icon={<Plug size={16} />} title="Integrações" sub="Conecte suas plataformas de anúncios e e-commerce" />
            <div className="space-y-3">
                {integrations.map(i => (
                    <IntegrationCard key={i.name}
                        name={i.name} color={i.color} icon={i.icon}
                        fields={i.fields}
                        values={Object.fromEntries(i.keys.map(k => [k, (integ as any)[k] || '']))}
                        onSave={vals => updateUser({ integrations: { ...integ, ...vals } })}
                    />
                ))}
            </div>
        </Card>
    );
}

// ── Danger item: header + expandable confirmation panel ───────────────────────
function DangerItem({
    bg, border, iconBg, iconColor, icon, title, titleColor, sub,
    buttonBg, buttonBorder, buttonColor, buttonIcon, buttonLabel,
    confirmTitle, confirmText,
    confirmBg, confirmBorder, confirmTitleColor,
    actionBg, actionBorder, actionColor, actionIcon, actionLabel,
    onConfirm,
}: {
    bg: string; border: string;
    iconBg: string; iconColor: string; icon: React.ReactNode;
    title: string; titleColor: string; sub: string;
    buttonBg: string; buttonBorder: string; buttonColor: string;
    buttonIcon: React.ReactNode; buttonLabel: string;
    confirmTitle: string; confirmText: string;
    confirmBg: string; confirmBorder: string; confirmTitleColor: string;
    actionBg: string; actionBorder: string; actionColor: string;
    actionIcon: React.ReactNode; actionLabel: string;
    onConfirm: () => void;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-xl overflow-hidden" style={{ background: bg, border }}>
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: iconBg }}>
                        <span style={{ color: iconColor }}>{icon}</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium" style={{ color: titleColor }}>{title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 45%)' }}>{sub}</p>
                    </div>
                </div>
                {!open && (
                    <button onClick={() => setOpen(true)}
                        className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-80"
                        style={{ background: buttonBg, border: buttonBorder, color: buttonColor }}>
                        {buttonIcon} {buttonLabel}
                    </button>
                )}
            </div>

            {open && (
                <div className="px-4 pb-4 pt-1" style={{ borderTop: `1px solid ${border.replace('1px solid ', '')}` }}>
                    <div className="rounded-lg px-4 py-3 mb-3" style={{ background: confirmBg, border: confirmBorder }}>
                        <p className="text-sm font-semibold mb-1" style={{ color: confirmTitleColor }}>
                            {confirmTitle}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: 'hsl(215 20% 55%)' }}>
                            {confirmText}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setOpen(false)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
                            style={{ background: 'hsl(222 40% 16%)', border: '1px solid hsl(222 30% 22%)', color: 'hsl(215 20% 65%)' }}>
                            Cancelar
                        </button>
                        <button onClick={() => { onConfirm(); setOpen(false); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
                            style={{ background: actionBg, border: actionBorder, color: actionColor }}>
                            {actionIcon} {actionLabel}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function DangerSection() {
    const { logout } = useAuth();
    const { clearSeedData } = useApp();
    const router = useRouter();

    return (
        <Card>
            <SectionTitle icon={<AlertCircle size={16} />} title="Zona de Perigo" sub="Ações irreversíveis — confirme antes de prosseguir" />
            <div className="space-y-3">

                {/* Limpar dados simulados */}
                <DangerItem
                    bg="hsl(38 70% 9%)" border="1px solid hsl(38 70% 20%)"
                    iconBg="hsl(38 92% 20%)" iconColor="hsl(38 92% 60%)"
                    icon={<DatabaseZap size={15} />}
                    title="Limpar dados simulados" titleColor="hsl(38 92% 75%)"
                    sub="Remove todas as despesas, receitas, saques e campanhas de demonstração"
                    buttonBg="hsl(38 60% 18%)" buttonBorder="1px solid hsl(38 60% 28%)" buttonColor="hsl(38 92% 65%)"
                    buttonIcon={<DatabaseZap size={14} />} buttonLabel="Limpar dados"
                    confirmTitle="⚠️ Confirmar limpeza de dados simulados"
                    confirmText="Esta ação removerá permanentemente todos os registros de demonstração: despesas, receitas, saques e campanhas pré-carregados. Apenas os dados inseridos manualmente serão mantidos. Não pode ser desfeita."
                    confirmBg="hsl(38 60% 12%)" confirmBorder="1px solid hsl(38 60% 22%)" confirmTitleColor="hsl(38 92% 70%)"
                    actionBg="hsl(38 70% 22%)" actionBorder="1px solid hsl(38 70% 35%)" actionColor="hsl(38 92% 75%)"
                    actionIcon={<DatabaseZap size={14} />} actionLabel="Sim, limpar dados"
                    onConfirm={() => {
                        clearSeedData();
                        toast.success('Dados simulados removidos. O sistema agora contém apenas dados reais.');
                    }}
                />

                {/* Encerrar sessão */}
                <DangerItem
                    bg="hsl(222 40% 13%)" border="1px solid hsl(222 30% 18%)"
                    iconBg="hsl(222 40% 18%)" iconColor="hsl(215 20% 65%)"
                    icon={<LogOut size={15} />}
                    title="Encerrar sessão" titleColor="hsl(210 40% 90%)"
                    sub="Sair da conta e ser redirecionado para a tela de login"
                    buttonBg="hsl(222 40% 16%)" buttonBorder="1px solid hsl(222 30% 22%)" buttonColor="hsl(215 20% 65%)"
                    buttonIcon={<LogOut size={14} />} buttonLabel="Sair"
                    confirmTitle="Confirmar encerramento de sessão"
                    confirmText="Você será desconectado imediatamente e redirecionado para a tela de login. Seus dados permanecem salvos e você poderá entrar novamente a qualquer momento."
                    confirmBg="hsl(222 40% 11%)" confirmBorder="1px solid hsl(222 30% 20%)" confirmTitleColor="hsl(210 40% 85%)"
                    actionBg="hsl(222 40% 20%)" actionBorder="1px solid hsl(222 30% 30%)" actionColor="hsl(210 40% 90%)"
                    actionIcon={<LogOut size={14} />} actionLabel="Sim, encerrar sessão"
                    onConfirm={() => { logout(); router.push('/login'); }}
                />

                {/* Excluir conta */}
                <DangerItem
                    bg="hsl(0 50% 10%)" border="1px solid hsl(0 50% 18%)"
                    iconBg="hsl(0 60% 18%)" iconColor="hsl(0 84% 65%)"
                    icon={<Trash2 size={15} />}
                    title="Excluir conta" titleColor="hsl(0 84% 70%)"
                    sub="Remove permanentemente a conta e todos os dados associados"
                    buttonBg="hsl(0 60% 18%)" buttonBorder="1px solid hsl(0 60% 28%)" buttonColor="hsl(0 84% 65%)"
                    buttonIcon={<Trash2 size={14} />} buttonLabel="Excluir conta"
                    confirmTitle="⛔ Confirmar exclusão de conta"
                    confirmText="Esta ação é irreversível. Todos os seus dados, histórico financeiro, campanhas e configurações serão apagados permanentemente. Esta funcionalidade está desabilitada no plano demo."
                    confirmBg="hsl(0 50% 8%)" confirmBorder="1px solid hsl(0 50% 20%)" confirmTitleColor="hsl(0 84% 65%)"
                    actionBg="hsl(0 60% 22%)" actionBorder="1px solid hsl(0 60% 32%)" actionColor="hsl(0 84% 70%)"
                    actionIcon={<Trash2 size={14} />} actionLabel="Sim, excluir conta"
                    onConfirm={() => toast.error('Funcionalidade desabilitada no plano demo.')}
                />

            </div>
        </Card>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const SECTIONS = [
    { id: 'profile', label: 'Perfil', icon: <User size={15} /> },
    { id: 'security', label: 'Segurança', icon: <Lock size={15} /> },
    { id: 'company', label: 'Empresa', icon: <Building2 size={15} /> },
    { id: 'notifications', label: 'Notificações', icon: <Bell size={15} /> },
    { id: 'integrations', label: 'Integrações', icon: <Plug size={15} /> },
    { id: 'danger', label: 'Zona de Perigo', icon: <AlertCircle size={15} /> },
];

export default function SettingsContent() {
    const [active, setActive] = useState('profile');

    const content: Record<string, React.ReactNode> = {
        profile: <ProfileSection />,
        security: <SecuritySection />,
        company: <CompanySection />,
        notifications: <NotificationsSection />,
        integrations: <IntegrationsSection />,
        danger: <DangerSection />,
    };

    return (
        <div className="flex gap-6 items-start">
            {/* Sidebar nav */}
            <div className="w-52 shrink-0 rounded-2xl p-2 sticky top-6"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                <ul className="space-y-0.5">
                    {SECTIONS.map(s => (
                        <li key={s.id}>
                            <button onClick={() => setActive(s.id)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                                style={active === s.id ? {
                                    background: 'linear-gradient(135deg, hsl(262 83% 30% / 0.5), hsl(240 83% 28% / 0.4))',
                                    color: 'hsl(262 83% 80%)',
                                    boxShadow: 'inset 0 0 0 1px hsl(262 83% 50% / 0.3)',
                                } : { color: 'hsl(215 20% 60%)' }}>
                                <span style={{ opacity: active === s.id ? 1 : 0.7 }}>{s.icon}</span>
                                {s.label}
                                {s.id === 'danger' && (
                                    <span className="ml-auto w-2 h-2 rounded-full shrink-0" style={{ background: 'hsl(0 84% 60%)' }} />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {content[active]}
            </div>
        </div>
    );
}

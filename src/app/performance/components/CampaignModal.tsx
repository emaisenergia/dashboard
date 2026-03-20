'use client';
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp, Platform, CampaignStatus } from '@/context/AppContext';
import { toast } from 'sonner';

interface CampaignModalProps {
    open: boolean;
    onClose: () => void;
}

const platforms: Platform[] = ['TikTok', 'Facebook', 'Google', 'Instagram', 'YouTube'];
const statuses: CampaignStatus[] = ['ATIVA', 'PAUSADA', 'RASCUNHO'];

const inp = {
    background: 'hsl(222 40% 13%)',
    border: '1px solid hsl(222 30% 22%)',
    color: 'hsl(210 40% 90%)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
} as React.CSSProperties;

const lbl = (text: string) => (
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
        style={{ color: 'hsl(215 20% 50%)' }}>{text}</label>
);

export default function CampaignModal({ open, onClose }: CampaignModalProps) {
    const { addCampaign, addExpense } = useApp();
    const today = new Date().toISOString().slice(0, 10);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [form, setForm] = useState({
        platform: 'TikTok' as Platform,
        name: '',
        budget: '',
        spend: '',
        impressions: '',
        clicks: '',
        orders: '',
        revenue: '',
        status: 'ATIVA' as CampaignStatus,
        startDate: today,
    });

    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    const spend = parseFloat(form.spend) || 0;
    const clicks = parseFloat(form.clicks) || 0;
    const orders = parseFloat(form.orders) || 0;
    const revenue = parseFloat(form.revenue) || 0;
    const ctr = clicks > 0 && parseFloat(form.impressions) > 0
        ? ((clicks / parseFloat(form.impressions)) * 100).toFixed(2) : '—';
    const conv = clicks > 0 ? ((orders / clicks) * 100).toFixed(2) : '—';
    const roas = spend > 0 ? (revenue / spend).toFixed(2) : '—';
    const cpc = clicks > 0 ? (spend / clicks).toFixed(2) : '—';

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.budget) return toast.error('Preencha os campos obrigatórios');
        addCampaign({
            platform: form.platform,
            name: form.name,
            budget: parseFloat(form.budget),
            spend,
            impressions: parseFloat(form.impressions) || 0,
            clicks,
            orders,
            revenue,
            status: form.status,
            startDate: form.startDate,
        });
        // Auto-create expense if spend > 0
        if (spend > 0) {
            addExpense({
                type: 'ad',
                platform: form.platform,
                campaign: form.name,
                amount: spend,
                date: form.startDate,
                status: 'PAGO',
                notes: `Criado automaticamente via Performance`,
            });
            toast.success(`Campanha adicionada + despesa de R$ ${spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} lançada`);
        } else {
            toast.success(`Campanha "${form.name}" adicionada`);
        }
        onClose();
    }

    return (
        <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === overlayRef.current) onClose(); }}>
            <div className="w-full max-w-[560px] rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
                style={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(222 30% 18%)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
                <div className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: '1px solid hsl(222 30% 15%)' }}>
                    <h2 className="text-base font-semibold text-white">Nova Campanha de Anúncio</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        style={{ color: 'hsl(215 20% 55%)' }}><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            {lbl('Plataforma *')}
                            <select style={inp} value={form.platform} onChange={e => set('platform', e.target.value)} className="cursor-pointer">
                                {platforms.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            {lbl('Status')}
                            <select style={inp} value={form.status} onChange={e => set('status', e.target.value)} className="cursor-pointer">
                                {statuses.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        {lbl('Nome da Campanha *')}
                        <input style={inp} placeholder="Ex: UCG Whey Banana — TOF" value={form.name} onChange={e => set('name', e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            {lbl('Orçamento (R$) *')}
                            <input style={inp} type="number" step="0.01" min="0" placeholder="0,00" value={form.budget} onChange={e => set('budget', e.target.value)} required />
                        </div>
                        <div>
                            {lbl('Gasto Real (R$)')}
                            <input style={inp} type="number" step="0.01" min="0" placeholder="0,00" value={form.spend} onChange={e => set('spend', e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            {lbl('Impressões')}
                            <input style={inp} type="number" min="0" placeholder="0" value={form.impressions} onChange={e => set('impressions', e.target.value)} />
                        </div>
                        <div>
                            {lbl('Cliques')}
                            <input style={inp} type="number" min="0" placeholder="0" value={form.clicks} onChange={e => set('clicks', e.target.value)} />
                        </div>
                        <div>
                            {lbl('Pedidos')}
                            <input style={inp} type="number" min="0" placeholder="0" value={form.orders} onChange={e => set('orders', e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            {lbl('Receita Atribuída (R$)')}
                            <input style={inp} type="number" step="0.01" min="0" placeholder="0,00" value={form.revenue} onChange={e => set('revenue', e.target.value)} />
                        </div>
                        <div>
                            {lbl('Data de Início')}
                            <input style={inp} type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
                        </div>
                    </div>

                    {/* Live metrics preview */}
                    {(spend > 0 || clicks > 0) && (
                        <div className="rounded-xl p-4 grid grid-cols-4 gap-3"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)' }}>
                            {[
                                { label: 'CTR', value: `${ctr}%`, color: 'hsl(200 80% 60%)' },
                                { label: 'Conv.', value: `${conv}%`, color: 'hsl(142 71% 50%)' },
                                { label: 'ROAS', value: `${roas}x`, color: 'hsl(262 83% 70%)' },
                                { label: 'CPC', value: `R$${cpc}`, color: 'hsl(38 92% 56%)' },
                            ].map(m => (
                                <div key={m.label} className="text-center">
                                    <p className="text-xs" style={{ color: 'hsl(215 20% 50%)' }}>{m.label}</p>
                                    <p className="text-sm font-bold mt-0.5" style={{ color: m.color }}>{m.value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {spend > 0 && (
                        <p className="text-xs px-1" style={{ color: 'hsl(38 92% 56%)' }}>
                            ⚡ Um gasto de <strong>R$ {spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> será lançado automaticamente como despesa de anúncio em Financeiro.
                        </p>
                    )}

                    <button type="submit" className="w-full py-2.5 rounded-lg font-semibold text-white text-sm"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                        Salvar Campanha
                    </button>
                </form>
            </div>
        </div>
    );
}

'use client';
import React, { useState, useRef, useEffect } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { useApp, Campaign } from '@/context/AppContext';
import { toast } from 'sonner';

interface Props {
    campaign: Campaign | null;
    onClose: () => void;
}

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

const platformColors: Record<string, string> = {
    TikTok: 'hsl(180 80% 50%)',
    Facebook: 'hsl(220 80% 60%)',
    Google: 'hsl(38 92% 56%)',
    Instagram: 'hsl(330 80% 60%)',
    YouTube: 'hsl(0 84% 60%)',
};

export default function CampaignUpdateModal({ campaign, onClose }: Props) {
    const { updateCampaign } = useApp();
    const overlayRef = useRef<HTMLDivElement>(null);

    const [form, setForm] = useState({
        spend: '',
        impressions: '',
        clicks: '',
        orders: '',
        revenue: '',
        budget: '',
    });

    // Pre-fill when campaign changes
    useEffect(() => {
        if (campaign) {
            setForm({
                spend: String(campaign.spend),
                impressions: String(campaign.impressions),
                clicks: String(campaign.clicks),
                orders: String(campaign.orders),
                revenue: String(campaign.revenue),
                budget: String(campaign.budget),
            });
        }
    }, [campaign]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (campaign) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [campaign, onClose]);

    if (!campaign) return null;

    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    const spend = parseFloat(form.spend) || 0;
    const clicks = parseFloat(form.clicks) || 0;
    const orders = parseFloat(form.orders) || 0;
    const revenue = parseFloat(form.revenue) || 0;
    const impressions = parseFloat(form.impressions) || 0;
    const budget = parseFloat(form.budget) || 0;

    const roas = spend > 0 ? revenue / spend : 0;
    const conv = clicks > 0 ? (orders / clicks) * 100 : 0;
    const ctr = impressions > 0 && clicks > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const spentPct = budget > 0 ? (spend / budget) * 100 : 0;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        updateCampaign(campaign.id, { spend, impressions, clicks, orders, revenue, budget });
        toast.success(`Campanha atualizada: ${campaign.name}`);
        onClose();
    }

    return (
        <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === overlayRef.current) onClose(); }}>
            <div className="w-full max-w-[540px] rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
                style={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(222 30% 18%)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: '1px solid hsl(222 30% 15%)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'hsl(262 83% 20%)' }}>
                            <TrendingUp size={15} style={{ color: 'hsl(262 83% 70%)' }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">Atualizar Campanha</h2>
                            <p className="text-xs mt-0.5 flex items-center gap-1.5"
                                style={{ color: platformColors[campaign.platform] || 'hsl(215 20% 55%)' }}>
                                {campaign.platform} · <span style={{ color: 'hsl(215 20% 50%)' }}>{campaign.name}</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        style={{ color: 'hsl(215 20% 55%)' }}><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto flex-1 space-y-5">
                    {/* Budget & Spend */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                            style={{ color: 'hsl(215 20% 45%)' }}>Orçamento & Investimento</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                {lbl('Orçamento Total (R$)')}
                                <input style={inp} type="number" step="0.01" min="0"
                                    value={form.budget} onChange={e => set('budget', e.target.value)} />
                            </div>
                            <div>
                                {lbl('Total Gasto (R$)')}
                                <input style={inp} type="number" step="0.01" min="0"
                                    value={form.spend} onChange={e => set('spend', e.target.value)} />
                            </div>
                        </div>
                        {budget > 0 && (
                            <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1"
                                    style={{ color: 'hsl(215 20% 50%)' }}>
                                    <span>Orçamento utilizado</span>
                                    <span style={{ color: spentPct > 90 ? 'hsl(0 84% 60%)' : 'hsl(262 83% 70%)' }}>
                                        {spentPct.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(222 30% 18%)' }}>
                                    <div className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${Math.min(spentPct, 100)}%`,
                                            background: spentPct > 90 ? 'hsl(0 84% 55%)' : 'hsl(262 83% 60%)',
                                        }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Traffic */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                            style={{ color: 'hsl(215 20% 45%)' }}>Tráfego</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                {lbl('Impressões')}
                                <input style={inp} type="number" min="0"
                                    value={form.impressions} onChange={e => set('impressions', e.target.value)} />
                            </div>
                            <div>
                                {lbl('Cliques')}
                                <input style={inp} type="number" min="0"
                                    value={form.clicks} onChange={e => set('clicks', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Conversions */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                            style={{ color: 'hsl(215 20% 45%)' }}>Conversões & Receita</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                {lbl('Nº de Vendas (Pedidos)')}
                                <input style={inp} type="number" min="0"
                                    value={form.orders} onChange={e => set('orders', e.target.value)} />
                            </div>
                            <div>
                                {lbl('Receita Atribuída (R$)')}
                                <input style={inp} type="number" step="0.01" min="0"
                                    value={form.revenue} onChange={e => set('revenue', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Live metrics preview */}
                    {(spend > 0 || clicks > 0) && (
                        <div className="rounded-xl p-4"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)' }}>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                                style={{ color: 'hsl(215 20% 45%)' }}>Métricas Calculadas</p>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: 'ROAS', value: `${roas.toFixed(2)}x`, color: roas >= 3 ? 'hsl(142 71% 50%)' : roas >= 2 ? 'hsl(43 96% 56%)' : 'hsl(0 84% 60%)' },
                                    { label: 'Conv.', value: `${conv.toFixed(2)}%`, color: conv >= 2 ? 'hsl(142 71% 50%)' : 'hsl(43 96% 56%)' },
                                    { label: 'CTR', value: `${ctr.toFixed(2)}%`, color: 'hsl(200 80% 60%)' },
                                    { label: 'CPC', value: `R$${cpc.toFixed(2)}`, color: 'hsl(262 83% 70%)' },
                                ].map(m => (
                                    <div key={m.label} className="text-center">
                                        <p className="text-xs" style={{ color: 'hsl(215 20% 50%)' }}>{m.label}</p>
                                        <p className="text-sm font-bold mt-0.5" style={{ color: m.color }}>{m.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="w-full py-2.5 rounded-lg font-semibold text-white text-sm"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                        Salvar Atualização
                    </button>
                </form>
            </div>
        </div>
    );
}

'use client';
import React from 'react';
import { useApp } from '@/context/AppContext';
import type { Campaign, CampaignStatus, Platform } from '@/context/AppContext';
import { Rocket } from 'lucide-react';

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const statusLabel: Record<CampaignStatus, string> = {
    ATIVA: 'Ativa',
    PAUSADA: 'Pausada',
    ENCERRADA: 'Encerrada',
    RASCUNHO: 'Rascunho',
};

const statusStyle: Record<CampaignStatus, { bg: string; color: string }> = {
    ATIVA: { bg: 'hsl(142 71% 15%)', color: 'hsl(142 71% 55%)' },
    PAUSADA: { bg: 'hsl(43 96% 15%)', color: 'hsl(43 96% 60%)' },
    ENCERRADA: { bg: 'hsl(215 20% 15%)', color: 'hsl(215 20% 55%)' },
    RASCUNHO: { bg: 'hsl(262 83% 15%)', color: 'hsl(262 83% 60%)' },
};

const platformColor: Record<Platform, string> = {
    TikTok: 'hsl(180 80% 55%)',
    Facebook: 'hsl(220 80% 65%)',
    Google: 'hsl(38 92% 56%)',
    Instagram: 'hsl(320 80% 60%)',
    YouTube: 'hsl(0 84% 60%)',
};

function StatusBadge({ status }: { status: CampaignStatus }) {
    const s = statusStyle[status];
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
            style={{ background: s.bg, color: s.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
            {statusLabel[status]}
        </span>
    );
}

function PlatformBadge({ platform }: { platform: Platform }) {
    const color = platformColor[platform];
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            {platform}
        </span>
    );
}

export default function CampaignTable() {
    const { campaigns } = useApp();
    const active = campaigns.filter(c => c.status === 'ATIVA');

    return (
        <div className="rounded-xl overflow-hidden"
            style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
            <div className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid hsl(222 30% 16%)' }}>
                <div>
                    <h3 className="text-base font-semibold text-white">Campanhas Ativas</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>
                        {active.length} {active.length === 1 ? 'campanha' : 'campanhas'} ativas
                    </p>
                </div>
            </div>

            {campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl"
                        style={{ background: 'hsl(222 40% 14%)', color: 'hsl(215 20% 40%)' }}>
                        <Rocket size={22} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'hsl(215 20% 50%)' }}>Nenhuma campanha cadastrada</p>
                    <p className="text-xs" style={{ color: 'hsl(215 20% 38%)' }}>Cadastre campanhas no módulo Financeiro</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                                {['Campanha', 'Plataforma', 'Status', 'Orçamento', 'Gasto', 'ROAS', 'Conv.', 'CPA'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wider"
                                        style={{ color: 'hsl(215 20% 45%)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((c) => {
                                const roas = c.spend > 0 ? c.revenue / c.spend : 0;
                                const cpa = c.orders > 0 ? c.spend / c.orders : 0;
                                return (
                                    <tr key={c.id}
                                        className="transition-colors"
                                        style={{ borderBottom: '1px solid hsl(222 30% 13%)' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'hsl(222 40% 12%)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                        <td className="px-4 py-3 font-medium text-white max-w-[200px] truncate">{c.name}</td>
                                        <td className="px-4 py-3"><PlatformBadge platform={c.platform} /></td>
                                        <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                                        <td className="px-4 py-3" style={{ color: 'hsl(215 20% 65%)' }}>{fmt(c.budget)}</td>
                                        <td className="px-4 py-3" style={{ color: 'hsl(215 20% 65%)' }}>{fmt(c.spend)}</td>
                                        <td className="px-4 py-3 font-semibold"
                                            style={{ color: roas >= 3 ? 'hsl(142 71% 50%)' : 'hsl(43 96% 56%)' }}>
                                            {roas.toFixed(2)}x
                                        </td>
                                        <td className="px-4 py-3 text-white">{c.orders}</td>
                                        <td className="px-4 py-3" style={{ color: 'hsl(215 20% 65%)' }}>
                                            {cpa > 0 ? fmt(cpa) : '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

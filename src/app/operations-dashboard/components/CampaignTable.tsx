'use client';
import React from 'react';

interface Campaign {
    name: string;
    platform: 'TikTok' | 'Facebook';
    status: 'Ativa' | 'Pausada' | 'Concluída';
    budget: number;
    spend: number;
    roas: number;
    conversions: number;
    cpa: number;
}

const campaigns: Campaign[] = [
    { name: 'Black Week - Produto Hero', platform: 'TikTok', status: 'Ativa', budget: 3000, spend: 2841, roas: 4.12, conversions: 312, cpa: 9.11 },
    { name: 'Retargeting - Abandono de Carrinho', platform: 'Facebook', status: 'Ativa', budget: 2000, spend: 1923, roas: 3.87, conversions: 241, cpa: 7.98 },
    { name: 'Lookalike 2% - Compradores', platform: 'TikTok', status: 'Ativa', budget: 2500, spend: 2290, roas: 3.54, conversions: 198, cpa: 11.57 },
    { name: 'Interesse - Fitness & Saúde', platform: 'Facebook', status: 'Ativa', budget: 1500, spend: 1487, roas: 3.21, conversions: 156, cpa: 9.53 },
    { name: 'UGC Creative Test #4', platform: 'TikTok', status: 'Ativa', budget: 1000, spend: 876, roas: 2.98, conversions: 89, cpa: 9.84 },
    { name: 'Remarketing 30d - Visualizações', platform: 'Facebook', status: 'Pausada', budget: 1200, spend: 1104, roas: 2.41, conversions: 67, cpa: 16.48 },
    { name: 'Topo de Funil - Broad', platform: 'TikTok', status: 'Ativa', budget: 2000, spend: 1890, roas: 2.76, conversions: 143, cpa: 13.22 },
    { name: 'Coleção Verão - Catálogo', platform: 'Facebook', status: 'Ativa', budget: 1800, spend: 1571, roas: 3.45, conversions: 178, cpa: 8.83 },
];

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

function StatusBadge({ status }: { status: Campaign['status'] }) {
    const styles: Record<Campaign['status'], { bg: string; color: string }> = {
        Ativa: { bg: 'hsl(142 71% 15%)', color: 'hsl(142 71% 55%)' },
        Pausada: { bg: 'hsl(43 96% 15%)', color: 'hsl(43 96% 60%)' },
        Concluída: { bg: 'hsl(215 20% 15%)', color: 'hsl(215 20% 55%)' },
    };
    const s = styles[status];
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
            style={{ background: s.bg, color: s.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
            {status}
        </span>
    );
}

function PlatformBadge({ platform }: { platform: Campaign['platform'] }) {
    const isTT = platform === 'TikTok';
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ color: isTT ? 'hsl(180 80% 55%)' : 'hsl(220 80% 65%)' }}>
            <span className="w-1.5 h-1.5 rounded-full"
                style={{ background: isTT ? 'hsl(180 80% 50%)' : 'hsl(220 80% 60%)' }} />
            {platform}
        </span>
    );
}

export default function CampaignTable() {
    return (
        <div className="rounded-xl overflow-hidden"
            style={{
                background: 'hsl(222 40% 10%)',
                border: '1px solid hsl(222 30% 16%)',
            }}>
            <div className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid hsl(222 30% 16%)' }}>
                <div>
                    <h3 className="text-base font-semibold text-white">Campanhas Ativas</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>14 campanhas · Hoje</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                            {['Campanha', 'Plataforma', 'Status', 'Orçamento', 'Gasto', 'ROAS', 'Conv.', 'CPA'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wider"
                                    style={{ color: 'hsl(215 20% 45%)' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((c, i) => (
                            <tr key={i}
                                className="transition-colors"
                                style={{ borderBottom: '1px solid hsl(222 30% 13%)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'hsl(222 40% 12%)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                <td className="px-4 py-3 font-medium text-white max-w-[200px] truncate">{c.name}</td>
                                <td className="px-4 py-3"><PlatformBadge platform={c.platform} /></td>
                                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                                <td className="px-4 py-3" style={{ color: 'hsl(215 20% 65%)' }}>{fmt(c.budget)}</td>
                                <td className="px-4 py-3" style={{ color: 'hsl(215 20% 65%)' }}>{fmt(c.spend)}</td>
                                <td className="px-4 py-3 font-semibold"
                                    style={{ color: c.roas >= 3 ? 'hsl(142 71% 50%)' : 'hsl(43 96% 56%)' }}>
                                    {c.roas.toFixed(2)}x
                                </td>
                                <td className="px-4 py-3 text-white">{c.conversions}</td>
                                <td className="px-4 py-3" style={{ color: 'hsl(215 20% 65%)' }}>{fmt(c.cpa)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

'use client';
import React from 'react';
import { Target, MousePointer, ShoppingBag, TrendingUp, DollarSign, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

const fmtN = (v: number) =>
    new Intl.NumberFormat('pt-BR').format(Math.round(v));

export default function PerformanceKPIs() {
    const { kpis, campaigns } = useApp();

    const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
    const activeCampaignRevenue = campaigns.filter(c => c.status === 'ATIVA').reduce((acc, c) => acc + c.revenue, 0);
    const avgCPC = kpis.totalClicks > 0 ? kpis.totalAdSpend / kpis.totalClicks : 0;

    const cards = [
        {
            label: 'ROAS GERAL',
            value: `${kpis.roas.toFixed(2)}x`,
            sub: `Meta: 3.0x`,
            subColor: kpis.roas >= 3 ? 'hsl(142 71% 45%)' : 'hsl(43 96% 56%)',
            icon: <Target size={18} />,
            iconColor: 'hsl(262 83% 66%)',
            bg: 'hsl(222 40% 10%)',
            border: 'hsl(222 30% 16%)',
        },
        {
            label: 'GASTO EM ANÚNCIOS',
            value: fmt(kpis.totalAdSpend),
            sub: `${kpis.activeCampaigns} campanhas ativas`,
            subColor: 'hsl(38 92% 56%)',
            icon: <Zap size={18} />,
            iconColor: 'hsl(38 92% 56%)',
            bg: 'linear-gradient(135deg, hsl(38 50% 10%), hsl(38 40% 8%))',
            border: 'hsl(38 50% 22%)',
        },
        {
            label: 'IMPRESSÕES TOTAIS',
            value: fmtN(totalImpressions),
            sub: `CTR médio: ${kpis.totalClicks > 0 && totalImpressions > 0 ? ((kpis.totalClicks / totalImpressions) * 100).toFixed(2) : '0'}%`,
            subColor: 'hsl(200 80% 60%)',
            icon: <MousePointer size={18} />,
            iconColor: 'hsl(200 80% 60%)',
            bg: 'hsl(222 40% 10%)',
            border: 'hsl(222 30% 16%)',
        },
        {
            label: 'CLIQUES TOTAIS',
            value: fmtN(kpis.totalClicks),
            sub: `CPC médio: R$ ${avgCPC.toFixed(2)}`,
            subColor: 'hsl(215 20% 55%)',
            icon: <MousePointer size={18} />,
            iconColor: 'hsl(180 80% 55%)',
            bg: 'hsl(222 40% 10%)',
            border: 'hsl(222 30% 16%)',
        },
        {
            label: 'PEDIDOS GERADOS',
            value: fmtN(kpis.totalOrders),
            sub: `Taxa de conv.: ${kpis.conversionRate.toFixed(2)}%`,
            subColor: kpis.conversionRate >= 2 ? 'hsl(142 71% 45%)' : 'hsl(0 84% 60%)',
            icon: <ShoppingBag size={18} />,
            iconColor: 'hsl(142 71% 45%)',
            bg: 'linear-gradient(135deg, hsl(142 50% 10%), hsl(142 40% 8%))',
            border: 'hsl(142 50% 20%)',
        },
        {
            label: 'RECEITA ATRIBUÍDA',
            value: fmt(activeCampaignRevenue),
            sub: `De campanhas ativas`,
            subColor: 'hsl(262 83% 66%)',
            icon: <DollarSign size={18} />,
            iconColor: 'hsl(262 83% 66%)',
            bg: 'hsl(222 40% 10%)',
            border: 'hsl(222 30% 16%)',
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 xl:grid-cols-6">
            {cards.map((c, i) => (
                <div key={i} className="rounded-xl p-4 xl:p-5 col-span-1"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold tracking-widest uppercase"
                            style={{ color: 'hsl(215 20% 50%)' }}>{c.label}</span>
                        <span style={{ color: c.iconColor }}>{c.icon}</span>
                    </div>
                    <p className="text-xl font-bold text-white leading-tight">{c.value}</p>
                    <p className="text-xs mt-1.5 font-medium" style={{ color: c.subColor }}>{c.sub}</p>
                </div>
            ))}
        </div>
    );
}

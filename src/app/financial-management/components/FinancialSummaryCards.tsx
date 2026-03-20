'use client';
import React from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v);

export default function FinancialSummaryCards() {
    const { kpis } = useApp();

    const cards = [
        {
            label: 'SALDO DISPONÍVEL',
            value: fmt(kpis.availableBalance),
            sub: 'Após despesas e saques',
            subColor: 'hsl(215 20% 50%)',
            icon: <Wallet size={18} />,
            iconColor: 'hsl(180 80% 50%)',
            bg: 'hsl(222 40% 10%)',
            border: 'hsl(222 30% 16%)',
        },
        {
            label: 'RECEITA DO MÊS',
            value: fmt(kpis.totalRevenue),
            sub: `${kpis.totalOrders} pedidos este mês`,
            subColor: 'hsl(142 71% 45%)',
            icon: <TrendingUp size={18} />,
            iconColor: 'hsl(142 71% 45%)',
            bg: 'linear-gradient(135deg, hsl(142 50% 10%), hsl(142 40% 8%))',
            border: 'hsl(142 50% 20%)',
        },
        {
            label: 'DESPESAS TOTAIS',
            value: fmt(kpis.totalExpenses),
            sub: `Anúncios: ${fmt(kpis.totalAdSpend)}`,
            subColor: 'hsl(0 84% 60%)',
            icon: <TrendingDown size={18} />,
            iconColor: 'hsl(0 84% 60%)',
            bg: 'linear-gradient(135deg, hsl(0 50% 10%), hsl(0 40% 8%))',
            border: 'hsl(0 50% 22%)',
        },
        {
            label: 'LUCRO LÍQUIDO',
            value: fmt(kpis.netProfit),
            sub: `Margem: ${kpis.totalRevenue > 0 ? ((kpis.netProfit / kpis.totalRevenue) * 100).toFixed(1) : '0'}%`,
            subColor: kpis.netProfit >= 0 ? 'hsl(142 71% 45%)' : 'hsl(0 84% 60%)',
            icon: <DollarSign size={18} />,
            iconColor: 'hsl(220 80% 60%)',
            bg: 'hsl(222 40% 10%)',
            border: 'hsl(222 30% 16%)',
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card, i) => (
                <div key={i} className="rounded-xl p-5"
                    style={{ background: card.bg, border: `1px solid ${card.border}` }}>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold tracking-widest uppercase"
                            style={{ color: 'hsl(215 20% 50%)' }}>{card.label}</span>
                        <span style={{ color: card.iconColor }}>{card.icon}</span>
                    </div>
                    <p className="text-2xl font-bold text-white leading-tight">{card.value}</p>
                    <p className="text-xs mt-2 font-medium" style={{ color: card.subColor }}>{card.sub}</p>
                </div>
            ))}
        </div>
    );
}

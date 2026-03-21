'use client';
import React, { useMemo } from 'react';
import { TrendingUp, CheckCircle, DollarSign, Zap, Bell } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Expense, Revenue, Campaign } from '@/context/AppContext';

type ActivityType = 'revenue' | 'expense' | 'campaign' | 'withdrawal';

interface Activity {
    type: ActivityType;
    title: string;
    desc: string;
    date: string;
}

const icons: Record<ActivityType, { icon: React.ReactNode; color: string; bg: string }> = {
    revenue: { icon: <DollarSign size={14} />, color: 'hsl(142 71% 50%)', bg: 'hsl(142 71% 15%)' },
    expense: { icon: <Zap size={14} />, color: 'hsl(43 96% 56%)', bg: 'hsl(43 96% 15%)' },
    campaign: { icon: <TrendingUp size={14} />, color: 'hsl(262 83% 66%)', bg: 'hsl(262 83% 15%)' },
    withdrawal: { icon: <Bell size={14} />, color: 'hsl(215 20% 65%)', bg: 'hsl(215 20% 18%)' },
};

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

function formatDate(dateStr: string): string {
    try {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } catch {
        return dateStr;
    }
}

export default function ActivityFeed() {
    const { revenues, expenses, campaigns, withdrawals } = useApp();

    const activities = useMemo((): Activity[] => {
        const items: Activity[] = [];

        revenues.forEach((r: Revenue) => {
            const val = r.type === 'product_sale' ? r.total : r.amount;
            const title = r.type === 'product_sale'
                ? `Venda registrada — ${r.product}`
                : `Receita — ${r.description}`;
            items.push({ type: 'revenue', title, desc: `${fmt(val)} · ${r.status}`, date: r.date });
        });

        expenses.forEach((e: Expense) => {
            const val = e.type === 'product' ? e.quantity * e.unitCost : e.amount;
            const title = e.type === 'ad'
                ? `Gasto em anúncio — ${e.platform}`
                : e.type === 'product'
                ? `Compra de produto — ${e.product}`
                : `Despesa — ${e.description}`;
            items.push({ type: 'expense', title, desc: `${fmt(val)} · ${e.status}`, date: e.date });
        });

        campaigns.forEach((c: Campaign) => {
            items.push({
                type: 'campaign',
                title: `Campanha — ${c.name}`,
                desc: `${c.platform} · ${fmt(c.spend)} gastos · ${c.status}`,
                date: c.startDate,
            });
        });

        withdrawals.forEach(w => {
            items.push({
                type: 'withdrawal',
                title: `Retirada — ${w.desc}`,
                desc: `${fmt(w.valor)} → ${w.destino} · ${w.status}`,
                date: w.data,
            });
        });

        return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20);
    }, [revenues, expenses, campaigns, withdrawals]);

    return (
        <div className="rounded-xl flex flex-col h-full"
            style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid hsl(222 30% 16%)' }}>
                <h3 className="text-base font-semibold text-white">Atividade Recente</h3>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>
                    {activities.length > 0 ? `${activities.length} registros` : 'Nenhuma atividade'}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2">
                        <CheckCircle size={28} style={{ color: 'hsl(215 20% 35%)' }} />
                        <p className="text-sm" style={{ color: 'hsl(215 20% 45%)' }}>Nenhuma atividade registrada</p>
                        <p className="text-xs" style={{ color: 'hsl(215 20% 35%)' }}>Adicione receitas, despesas ou campanhas</p>
                    </div>
                ) : (
                    activities.map((a, i) => {
                        const { icon, color, bg } = icons[a.type];
                        return (
                            <div key={i}
                                className="flex items-start gap-3 px-5 py-3.5 transition-colors"
                                style={{ borderBottom: i < activities.length - 1 ? '1px solid hsl(222 30% 13%)' : 'none' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'hsl(222 40% 12%)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <div className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5"
                                    style={{ background: bg, color }}>
                                    {icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white leading-snug">{a.title}</p>
                                    <p className="text-xs mt-0.5 truncate" style={{ color: 'hsl(215 20% 50%)' }}>{a.desc}</p>
                                </div>
                                <span className="text-xs shrink-0 mt-0.5" style={{ color: 'hsl(215 20% 40%)' }}>
                                    {formatDate(a.date)}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

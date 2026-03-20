'use client';
import React from 'react';
import { useApp } from '@/context/AppContext';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg p-3 text-sm space-y-1"
            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)' }}>
            <p className="font-semibold mb-1" style={{ color: 'hsl(215 20% 60%)' }}>{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
                    <span style={{ color: 'hsl(215 20% 65%)' }}>{p.name}:</span>
                    <span className="font-medium text-white">{typeof p.value === 'number'
                        ? p.value > 1000 ? fmt(p.value) : `${p.value.toFixed(2)}x`
                        : p.value}</span>
                </div>
            ))}
        </div>
    );
};

const monthlyData = [
    { mes: 'Out/25', receita: 210000, despesas: 148000, lucro: 62000 },
    { mes: 'Nov/25', receita: 245000, despesas: 162000, lucro: 83000 },
    { mes: 'Dez/25', receita: 298000, despesas: 185000, lucro: 113000 },
    { mes: 'Jan/26', receita: 252000, despesas: 170000, lucro: 82000 },
    { mes: 'Fev/26', receita: 271000, despesas: 178000, lucro: 93000 },
    { mes: 'Mar/26', receita: 312840, despesas: 198621, lucro: 80000 },
];

export default function ReportsContent() {
    const { kpis, campaigns, expenses, revenues } = useApp();

    const topCampaigns = [...campaigns]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    const platformRevenue = campaigns.reduce<Record<string, number>>((acc, c) => {
        acc[c.platform] = (acc[c.platform] || 0) + c.revenue;
        return acc;
    }, {});

    const platformData = Object.entries(platformRevenue).map(([p, v]) => ({ platform: p, receita: v }));

    return (
        <div className="space-y-6">
            {/* Summary KPIs */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Receita Total (Mês)', value: fmt(kpis.totalRevenue), color: 'hsl(142 71% 50%)' },
                    { label: 'Despesas Totais', value: fmt(kpis.totalExpenses), color: 'hsl(0 84% 60%)' },
                    { label: 'Lucro Líquido', value: fmt(kpis.netProfit), color: kpis.netProfit >= 0 ? 'hsl(142 71% 50%)' : 'hsl(0 84% 60%)' },
                    { label: 'ROAS Geral', value: `${kpis.roas.toFixed(2)}x`, color: 'hsl(262 83% 70%)' },
                ].map((c, i) => (
                    <div key={i} className="rounded-xl p-5"
                        style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: 'hsl(215 20% 50%)' }}>{c.label}</p>
                        <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-2 gap-4">
                {/* Revenue vs Expenses */}
                <div className="rounded-xl p-5"
                    style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                    <h3 className="text-sm font-semibold text-white mb-1">Receita vs Despesas (6 meses)</h3>
                    <p className="text-xs mb-4" style={{ color: 'hsl(215 20% 50%)' }}>Evolução histórica</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="despesasGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                            <XAxis dataKey="mes" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 12, color: 'hsl(215 20% 60%)', paddingTop: 8 }} />
                            <Area type="monotone" dataKey="receita" name="Receita" stroke="hsl(142 71% 45%)" fill="url(#receitaGrad)" strokeWidth={2} />
                            <Area type="monotone" dataKey="despesas" name="Despesas" stroke="hsl(0 84% 60%)" fill="url(#despesasGrad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by platform */}
                <div className="rounded-xl p-5"
                    style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                    <h3 className="text-sm font-semibold text-white mb-1">Receita por Plataforma</h3>
                    <p className="text-xs mb-4" style={{ color: 'hsl(215 20% 50%)' }}>Campanhas ativas</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={platformData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                            <XAxis dataKey="platform" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="receita" name="Receita" fill="hsl(262 83% 66%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top campaigns table */}
            <div className="rounded-xl overflow-hidden"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                    <h3 className="text-sm font-semibold text-white">Top Campanhas por Receita</h3>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                            {['Campanha', 'Plataforma', 'Gasto', 'Receita', 'ROAS', 'Pedidos', 'Conv.'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wider"
                                    style={{ color: 'hsl(215 20% 45%)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {topCampaigns.map((c, i) => {
                            const roas = c.spend > 0 ? c.revenue / c.spend : 0;
                            const conv = c.clicks > 0 ? (c.orders / c.clicks) * 100 : 0;
                            return (
                                <tr key={i} style={{ borderBottom: '1px solid hsl(222 30% 12%)' }}
                                    className="hover:bg-[hsl(222_40%_12%)] transition-colors">
                                    <td className="px-5 py-3 font-medium text-white">{c.name}</td>
                                    <td className="px-5 py-3 text-xs font-semibold"
                                        style={{ color: { TikTok: 'hsl(180 80% 50%)', Facebook: 'hsl(220 80% 60%)', Google: 'hsl(38 92% 56%)' }[c.platform] || 'hsl(215 20% 55%)' }}>
                                        {c.platform}
                                    </td>
                                    <td className="px-5 py-3" style={{ color: 'hsl(215 20% 65%)' }}>{fmt(c.spend)}</td>
                                    <td className="px-5 py-3 font-semibold" style={{ color: 'hsl(142 71% 50%)' }}>{fmt(c.revenue)}</td>
                                    <td className="px-5 py-3">
                                        <span className="font-bold" style={{ color: roas >= 3 ? 'hsl(142 71% 50%)' : 'hsl(43 96% 56%)' }}>
                                            {roas.toFixed(2)}x
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-white">{c.orders}</td>
                                    <td className="px-5 py-3">
                                        <span style={{ color: conv >= 2 ? 'hsl(142 71% 50%)' : 'hsl(43 96% 56%)' }}>{conv.toFixed(2)}%</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

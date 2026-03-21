'use client';
import React, { useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import type { Expense, Revenue } from '@/context/AppContext';
import { BarChart2 } from 'lucide-react';

const formatY = (v: number) => `R$${(v / 1000).toFixed(0)}k`;
const formatTooltip = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg p-3 text-sm space-y-1.5"
            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }}>
            <p className="font-semibold mb-2" style={{ color: 'hsl(215 20% 60%)' }}>{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span style={{ color: 'hsl(215 20% 65%)' }}>{p.name}:</span>
                    <span className="font-medium">{formatTooltip(p.value)}</span>
                </div>
            ))}
        </div>
    );
};

function getExpenseValue(e: Expense): number {
    if (e.status === 'CANCELADO') return 0;
    if (e.type === 'product') return e.quantity * e.unitCost;
    return e.amount;
}

function getRevenueValue(r: Revenue): number {
    if (r.status === 'CANCELADO') return 0;
    if (r.type === 'product_sale') return r.total;
    return r.amount;
}

export default function RevenueSpendChart() {
    const { revenues, expenses } = useApp();

    const data = useMemo(() => {
        const map = new Map<string, { receita: number; gasto: number }>();

        revenues.forEach(r => {
            const val = getRevenueValue(r);
            const entry = map.get(r.date) ?? { receita: 0, gasto: 0 };
            entry.receita += val;
            map.set(r.date, entry);
        });

        expenses.forEach(e => {
            const val = getExpenseValue(e);
            const entry = map.get(e.date) ?? { receita: 0, gasto: 0 };
            entry.gasto += val;
            map.set(e.date, entry);
        });

        return Array.from(map.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, vals]) => {
                const d = new Date(date + 'T00:00:00');
                const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                return {
                    date: label,
                    receita: vals.receita,
                    lucro: vals.receita - vals.gasto,
                    gasto: vals.gasto,
                };
            });
    }, [revenues, expenses]);

    const hasData = data.length > 0;

    return (
        <div className="rounded-xl p-5 h-full"
            style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
            <div className="mb-4">
                <h3 className="text-base font-semibold text-white">Receita vs Gasto</h3>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>
                    {hasData ? `${data.length} dias com dados` : 'Sem dados ainda'}
                </p>
            </div>

            {!hasData ? (
                <div className="flex flex-col items-center justify-center h-[260px] gap-3">
                    <BarChart2 size={32} style={{ color: 'hsl(215 20% 30%)' }} />
                    <p className="text-sm" style={{ color: 'hsl(215 20% 45%)' }}>Nenhum dado financeiro registrado</p>
                    <p className="text-xs" style={{ color: 'hsl(215 20% 35%)' }}>Adicione receitas e despesas para ver o gráfico</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="gradLucro" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(262 83% 66%)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(262 83% 66%)" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="gradGasto" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={formatY} tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ fontSize: 12, color: 'hsl(215 20% 60%)', paddingTop: 12 }}
                            formatter={(value) => value === 'receita' ? 'Receita' : value === 'lucro' ? 'Lucro' : 'Gasto'}
                        />
                        <Area type="monotone" dataKey="receita" name="receita" stroke="hsl(142 71% 45%)" strokeWidth={2} fill="url(#gradReceita)" />
                        <Area type="monotone" dataKey="lucro" name="lucro" stroke="hsl(262 83% 66%)" strokeWidth={2} fill="url(#gradLucro)" />
                        <Area type="monotone" dataKey="gasto" name="gasto" stroke="hsl(0 84% 60%)" strokeWidth={2} fill="url(#gradGasto)" />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

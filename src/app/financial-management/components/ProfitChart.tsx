'use client';
import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import type { Expense, Revenue } from '@/context/AppContext';
import { BarChart2 } from 'lucide-react';

const fmt = (v: number) => `R$${(v / 1000).toFixed(0)}k`;
const fmtFull = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg p-3 text-sm space-y-1.5"
            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)' }}>
            <p className="font-semibold mb-1" style={{ color: 'hsl(215 20% 60%)' }}>{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
                    <span style={{ color: 'hsl(215 20% 65%)' }}>{p.name}:</span>
                    <span className="font-medium text-white">{fmtFull(p.value)}</span>
                </div>
            ))}
        </div>
    );
};

function monthKey(date: string): string {
    // date is "YYYY-MM-DD"
    const [year, month] = date.split('-');
    const d = new Date(Number(year), Number(month) - 1, 1);
    return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
        .replace('.', '')
        .replace(' de ', '/')
        .replace(' ', '/');
}

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

export default function ProfitChart() {
    const { revenues, expenses } = useApp();

    const monthlyData = useMemo(() => {
        const map = new Map<string, { sortKey: string; receita: number; despesas: number }>();

        revenues.forEach(r => {
            const key = monthKey(r.date);
            const sortKey = r.date.substring(0, 7); // YYYY-MM
            const entry = map.get(key) ?? { sortKey, receita: 0, despesas: 0 };
            entry.receita += getRevenueValue(r);
            map.set(key, entry);
        });

        expenses.forEach(e => {
            const key = monthKey(e.date);
            const sortKey = e.date.substring(0, 7);
            const entry = map.get(key) ?? { sortKey, receita: 0, despesas: 0 };
            entry.despesas += getExpenseValue(e);
            map.set(key, entry);
        });

        return Array.from(map.entries())
            .sort(([, a], [, b]) => a.sortKey.localeCompare(b.sortKey))
            .map(([mes, vals]) => ({
                mes,
                receita: vals.receita,
                despesas: vals.despesas,
                lucro: vals.receita - vals.despesas,
            }));
    }, [revenues, expenses]);

    const hasData = monthlyData.length > 0;

    const EmptyState = ({ label }: { label: string }) => (
        <div className="flex flex-col items-center justify-center h-[200px] gap-3">
            <BarChart2 size={28} style={{ color: 'hsl(215 20% 30%)' }} />
            <p className="text-sm" style={{ color: 'hsl(215 20% 45%)' }}>{label}</p>
        </div>
    );

    return (
        <div className="space-y-5">
            {/* Bar chart — Receita vs Despesas */}
            <div className="rounded-xl p-5"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                <div className="mb-4">
                    <h3 className="text-base font-semibold text-white">Receita vs Despesas</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>
                        {hasData ? `${monthlyData.length} ${monthlyData.length === 1 ? 'mês' : 'meses'} com dados` : 'Sem dados ainda'}
                    </p>
                </div>
                {!hasData ? (
                    <EmptyState label="Adicione receitas e despesas para ver o gráfico" />
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barSize={18} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                            <XAxis dataKey="mes" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={fmt} tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 12, color: 'hsl(215 20% 60%)', paddingTop: 12 }} />
                            <Bar dataKey="receita" name="Receita" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="despesas" name="Despesas" fill="hsl(0 84% 55%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Line chart — Lucro líquido */}
            <div className="rounded-xl p-5"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                <div className="mb-4">
                    <h3 className="text-base font-semibold text-white">Evolução do Lucro Líquido</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>
                        {hasData ? 'Receita − Despesas por mês' : 'Sem dados ainda'}
                    </p>
                </div>
                {!hasData ? (
                    <EmptyState label="Sem dados financeiros para exibir" />
                ) : (
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={monthlyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                            <XAxis dataKey="mes" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={fmt} tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="lucro" name="Lucro" stroke="hsl(262 83% 66%)" strokeWidth={2.5} dot={{ fill: 'hsl(262 83% 66%)', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

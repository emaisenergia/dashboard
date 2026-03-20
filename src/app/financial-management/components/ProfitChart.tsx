'use client';
import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';

const monthlyData = [
    { mes: 'Out', receita: 210000, despesas: 148000, lucro: 62000 },
    { mes: 'Nov', receita: 245000, despesas: 162000, lucro: 83000 },
    { mes: 'Dez', receita: 298000, despesas: 185000, lucro: 113000 },
    { mes: 'Jan', receita: 252000, despesas: 170000, lucro: 82000 },
    { mes: 'Fev', receita: 271000, despesas: 178000, lucro: 93000 },
    { mes: 'Mar', receita: 312840, despesas: 198621, lucro: 80000 },
];

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

export default function ProfitChart() {
    return (
        <div className="space-y-5">
            {/* Bar chart — Receita vs Despesas */}
            <div className="rounded-xl p-5"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                <div className="mb-4">
                    <h3 className="text-base font-semibold text-white">Receita vs Despesas</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>Últimos 6 meses</p>
                </div>
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
            </div>

            {/* Line chart — Lucro líquido */}
            <div className="rounded-xl p-5"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                <div className="mb-4">
                    <h3 className="text-base font-semibold text-white">Evolução do Lucro Líquido</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>Últimos 6 meses</p>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={monthlyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                        <XAxis dataKey="mes" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={fmt} tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="lucro" name="Lucro" stroke="hsl(262 83% 66%)" strokeWidth={2.5} dot={{ fill: 'hsl(262 83% 66%)', r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

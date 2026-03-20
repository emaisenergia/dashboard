'use client';
import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const data = [
    { date: '06/03', receita: 32400, lucro: 14200, gasto: 12800 },
    { date: '07/03', receita: 29800, lucro: 12900, gasto: 11900 },
    { date: '08/03', receita: 35200, lucro: 15600, gasto: 13100 },
    { date: '09/03', receita: 38100, lucro: 16800, gasto: 13500 },
    { date: '10/03', receita: 36700, lucro: 16100, gasto: 13200 },
    { date: '11/03', receita: 40200, lucro: 17900, gasto: 13800 },
    { date: '12/03', receita: 43500, lucro: 19400, gasto: 14200 },
    { date: '13/03', receita: 41800, lucro: 18500, gasto: 13900 },
    { date: '14/03', receita: 44900, lucro: 20100, gasto: 14100 },
    { date: '15/03', receita: 46200, lucro: 20800, gasto: 14300 },
    { date: '16/03', receita: 44100, lucro: 19600, gasto: 14000 },
    { date: '17/03', receita: 48300, lucro: 21500, gasto: 14400 },
    { date: '18/03', receita: 51200, lucro: 22800, gasto: 14600 },
    { date: '19/03', receita: 49800, lucro: 22100, gasto: 14200 },
    { date: '20/03', receita: 54600, lucro: 24300, gasto: 13982 },
];

const formatY = (v: number) => `R$${(v / 1000).toFixed(0)}k`;
const formatTooltip = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg p-3 text-sm space-y-1.5"
            style={{
                background: 'hsl(222 40% 13%)',
                border: '1px solid hsl(222 30% 20%)',
                color: 'hsl(210 40% 90%)',
            }}>
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

export default function RevenueSpendChart() {
    return (
        <div className="rounded-xl p-5 h-full"
            style={{
                background: 'hsl(222 40% 10%)',
                border: '1px solid hsl(222 30% 16%)',
            }}>
            <div className="mb-4">
                <h3 className="text-base font-semibold text-white">Receita vs Gasto</h3>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>Últimos 15 dias</p>
            </div>

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
                    <XAxis
                        dataKey="date"
                        tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={formatY}
                        tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontSize: 12, color: 'hsl(215 20% 60%)', paddingTop: 12 }}
                        formatter={(value) =>
                            value === 'receita' ? 'Receita' : value === 'lucro' ? 'Lucro' : 'Gasto'
                        }
                    />
                    <Area
                        type="monotone"
                        dataKey="receita"
                        name="receita"
                        stroke="hsl(142 71% 45%)"
                        strokeWidth={2}
                        fill="url(#gradReceita)"
                    />
                    <Area
                        type="monotone"
                        dataKey="lucro"
                        name="lucro"
                        stroke="hsl(262 83% 66%)"
                        strokeWidth={2}
                        fill="url(#gradLucro)"
                    />
                    <Area
                        type="monotone"
                        dataKey="gasto"
                        name="gasto"
                        stroke="hsl(0 84% 60%)"
                        strokeWidth={2}
                        fill="url(#gradGasto)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

'use client';
import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const weekData = [
    { day: 'Seg', tiktok: 2100, facebook: 1540 },
    { day: 'Ter', tiktok: 2400, facebook: 1760 },
    { day: 'Qua', tiktok: 2200, facebook: 1620 },
    { day: 'Qui', tiktok: 2800, facebook: 2010 },
    { day: 'Sex', tiktok: 3100, facebook: 2280 },
    { day: 'Sáb', tiktok: 2600, facebook: 1900 },
    { day: 'Dom', tiktok: 1630, facebook: 1170 },
];

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg p-3 text-sm space-y-1.5"
            style={{
                background: 'hsl(222 40% 13%)',
                border: '1px solid hsl(222 30% 20%)',
            }}>
            <p className="font-semibold mb-1" style={{ color: 'hsl(215 20% 60%)' }}>{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
                    <span style={{ color: 'hsl(215 20% 65%)' }}>{p.name}:</span>
                    <span className="font-medium text-white">{fmt(p.value)}</span>
                </div>
            ))}
        </div>
    );
};

export default function PlatformSpendChart() {
    return (
        <div className="rounded-xl p-5 h-full flex flex-col"
            style={{
                background: 'hsl(222 40% 10%)',
                border: '1px solid hsl(222 30% 16%)',
            }}>
            <div className="mb-4">
                <h3 className="text-base font-semibold text-white">Gasto por Plataforma</h3>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>Esta semana</p>
            </div>

            {/* Platform cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-lg p-3" style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(180 80% 50%)' }} />
                        <span className="text-xs font-medium" style={{ color: 'hsl(180 80% 60%)' }}>TikTok</span>
                    </div>
                    <p className="text-lg font-bold text-white">R$ 16.830,00</p>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>58% do total</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(220 80% 60%)' }} />
                        <span className="text-xs font-medium" style={{ color: 'hsl(220 80% 70%)' }}>Facebook</span>
                    </div>
                    <p className="text-lg font-bold text-white">R$ 12.280,00</p>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>42% do total</p>
                </div>
            </div>

            {/* Bar chart */}
            <div className="flex-1" style={{ minHeight: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={8} barGap={3}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                        <XAxis
                            dataKey="day"
                            tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="tiktok" name="TikTok" fill="hsl(180 80% 50%)" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="facebook" name="Facebook" fill="hsl(220 80% 60%)" radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

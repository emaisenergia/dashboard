'use client';
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '@/context/AppContext';
import type { Platform } from '@/context/AppContext';
import { BarChart2 } from 'lucide-react';

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

const PLATFORM_COLORS: Record<Platform, string> = {
    TikTok: 'hsl(180 80% 50%)',
    Facebook: 'hsl(220 80% 60%)',
    Google: 'hsl(38 92% 56%)',
    Instagram: 'hsl(320 80% 60%)',
    YouTube: 'hsl(0 84% 60%)',
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg p-3 text-sm space-y-1.5"
            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)' }}>
            <p className="font-semibold mb-1" style={{ color: 'hsl(215 20% 60%)' }}>{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
                    <span style={{ color: 'hsl(215 20% 65%)' }}>Gasto:</span>
                    <span className="font-medium text-white">{fmt(p.value)}</span>
                </div>
            ))}
        </div>
    );
};

export default function PlatformSpendChart() {
    const { campaigns } = useApp();

    const { chartData, platformTotals, grandTotal } = useMemo(() => {
        const totals = new Map<Platform, number>();

        campaigns.forEach(c => {
            if (c.spend > 0) {
                totals.set(c.platform, (totals.get(c.platform) ?? 0) + c.spend);
            }
        });

        const sorted = Array.from(totals.entries()).sort(([, a], [, b]) => b - a);
        const grand = sorted.reduce((acc, [, v]) => acc + v, 0);

        const chartData = sorted.map(([platform, spend]) => ({ platform, spend }));
        const platformTotals = sorted.slice(0, 4); // top 4 for display cards

        return { chartData, platformTotals, grandTotal: grand };
    }, [campaigns]);

    const hasData = chartData.length > 0;

    return (
        <div className="rounded-xl p-5 h-full flex flex-col"
            style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
            <div className="mb-4">
                <h3 className="text-base font-semibold text-white">Gasto por Plataforma</h3>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>
                    {hasData ? 'Total acumulado por plataforma' : 'Sem dados ainda'}
                </p>
            </div>

            {!hasData ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-3">
                    <BarChart2 size={32} style={{ color: 'hsl(215 20% 30%)' }} />
                    <p className="text-sm" style={{ color: 'hsl(215 20% 45%)' }}>Nenhuma campanha registrada</p>
                    <p className="text-xs" style={{ color: 'hsl(215 20% 35%)' }}>Cadastre campanhas para ver os gastos</p>
                </div>
            ) : (
                <>
                    {/* Platform summary cards */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        {platformTotals.map(([platform, spend]) => {
                            const color = PLATFORM_COLORS[platform];
                            const pct = grandTotal > 0 ? Math.round((spend / grandTotal) * 100) : 0;
                            return (
                                <div key={platform} className="rounded-lg p-3"
                                    style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                                        <span className="text-xs font-medium" style={{ color }}>{platform}</span>
                                    </div>
                                    <p className="text-base font-bold text-white">{fmt(spend)}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>{pct}% do total</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bar chart */}
                    <div className="flex-1" style={{ minHeight: 140 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                                <XAxis
                                    dataKey="platform"
                                    tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="spend"
                                    name="Gasto"
                                    radius={[3, 3, 0, 0]}
                                    fill="hsl(262 83% 58%)"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
}

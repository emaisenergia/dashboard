'use client';
import React from 'react';
import { useApp } from '@/context/AppContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, AreaChart, Area,
} from 'recharts';

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
                    <span className="font-medium text-white">{typeof p.value === 'number' && p.value > 100
                        ? new Intl.NumberFormat('pt-BR').format(p.value)
                        : `${Number(p.value).toFixed(2)}${String(p.dataKey).includes('rate') || String(p.dataKey).includes('conv') ? '%' : ''}`
                    }</span>
                </div>
            ))}
        </div>
    );
};

export default function ConversionChart() {
    const { campaigns } = useApp();

    // Platform aggregated data
    const byPlatform = campaigns.reduce<Record<string, { clicks: number; orders: number; spend: number; revenue: number }>>((acc, c) => {
        if (!acc[c.platform]) acc[c.platform] = { clicks: 0, orders: 0, spend: 0, revenue: 0 };
        acc[c.platform].clicks += c.clicks;
        acc[c.platform].orders += c.orders;
        acc[c.platform].spend += c.spend;
        acc[c.platform].revenue += c.revenue;
        return acc;
    }, {});

    const platformData = Object.entries(byPlatform).map(([platform, d]) => ({
        platform,
        conv: d.clicks > 0 ? parseFloat(((d.orders / d.clicks) * 100).toFixed(2)) : 0,
        roas: d.spend > 0 ? parseFloat((d.revenue / d.spend).toFixed(2)) : 0,
        cpc: d.clicks > 0 ? parseFloat((d.spend / d.clicks).toFixed(2)) : 0,
    }));

    // Per-campaign ROAS/conv scatter
    const campaignData = campaigns.map(c => ({
        name: c.name.length > 22 ? c.name.slice(0, 22) + '…' : c.name,
        roas: c.spend > 0 ? parseFloat((c.revenue / c.spend).toFixed(2)) : 0,
        conv: c.clicks > 0 ? parseFloat(((c.orders / c.clicks) * 100).toFixed(2)) : 0,
        spend: c.spend,
    }));

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Conv rate by platform */}
            <div className="rounded-xl p-5"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                <h3 className="text-sm font-semibold text-white mb-1">Taxa de Conversão por Plataforma</h3>
                <p className="text-xs mb-4" style={{ color: 'hsl(215 20% 50%)' }}>Cliques → Pedidos (%)</p>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={platformData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={24}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                        <XAxis dataKey="platform" tick={{ fill: 'hsl(215 20% 50%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'hsl(215 20% 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="conv" name="Conv (%)" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ROAS by platform */}
            <div className="rounded-xl p-5"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                <h3 className="text-sm font-semibold text-white mb-1">ROAS por Plataforma</h3>
                <p className="text-xs mb-4" style={{ color: 'hsl(215 20% 50%)' }}>Receita / Gasto</p>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={platformData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={24}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                        <XAxis dataKey="platform" tick={{ fill: 'hsl(215 20% 50%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'hsl(215 20% 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="roas" name="ROAS" fill="hsl(262 83% 66%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ROAS per campaign */}
            <div className="rounded-xl p-5 col-span-2"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                <h3 className="text-sm font-semibold text-white mb-1">ROAS vs Taxa de Conversão por Campanha</h3>
                <p className="text-xs mb-4" style={{ color: 'hsl(215 20% 50%)' }}>Todas as campanhas</p>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={campaignData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12, color: 'hsl(215 20% 60%)', paddingTop: 8 }} />
                        <Line yAxisId="left" type="monotone" dataKey="roas" name="ROAS" stroke="hsl(262 83% 66%)" strokeWidth={2} dot={{ r: 3, fill: 'hsl(262 83% 66%)' }} />
                        <Line yAxisId="right" type="monotone" dataKey="conv" name="Conv (%)" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={{ r: 3, fill: 'hsl(142 71% 45%)' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

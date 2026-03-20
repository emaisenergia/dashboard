'use client';
import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, DollarSign, Zap, Bell } from 'lucide-react';

interface Activity {
    type: 'success' | 'warning' | 'info' | 'revenue' | 'budget' | 'alert';
    title: string;
    desc: string;
    time: string;
}

const activities: Activity[] = [
    {
        type: 'revenue',
        title: 'Meta de receita atingida',
        desc: 'R$ 47.820,50 — 159% da meta diária',
        time: 'Agora',
    },
    {
        type: 'warning',
        title: 'Taxa de conversão em queda',
        desc: 'TikTok: 2.1% (-0.6pp vs ontem)',
        time: '12 min',
    },
    {
        type: 'budget',
        title: 'Orçamento 93% usado',
        desc: 'R$ 13.018 de R$ 15.000 consumidos',
        time: '28 min',
    },
    {
        type: 'success',
        title: 'Campanha top: Black Week',
        desc: 'ROAS 4.12x · 312 conversões hoje',
        time: '1h',
    },
    {
        type: 'info',
        title: 'Novo pedido em processamento',
        desc: '#14.821 · R$ 289,90 · TikTok Ads',
        time: '1h 14min',
    },
    {
        type: 'alert',
        title: 'Campanha pausada automaticamente',
        desc: 'Remarketing 30d — CPA acima do limite',
        time: '2h 05min',
    },
    {
        type: 'success',
        title: 'Pico de tráfego detectado',
        desc: '+38% de sessões vs média das 17h',
        time: '3h',
    },
    {
        type: 'revenue',
        title: 'Margem líquida acima da meta',
        desc: '44.6% — Meta 40% (+4.6pp)',
        time: '4h 20min',
    },
];

const icons: Record<Activity['type'], { icon: React.ReactNode; color: string; bg: string }> = {
    revenue: { icon: <DollarSign size={14} />, color: 'hsl(142 71% 50%)', bg: 'hsl(142 71% 15%)' },
    success: { icon: <CheckCircle size={14} />, color: 'hsl(142 71% 50%)', bg: 'hsl(142 71% 15%)' },
    warning: { icon: <TrendingUp size={14} />, color: 'hsl(0 84% 60%)', bg: 'hsl(0 60% 15%)' },
    budget: { icon: <Zap size={14} />, color: 'hsl(43 96% 56%)', bg: 'hsl(43 96% 15%)' },
    info: { icon: <Bell size={14} />, color: 'hsl(262 83% 66%)', bg: 'hsl(262 83% 15%)' },
    alert: { icon: <AlertTriangle size={14} />, color: 'hsl(43 96% 56%)', bg: 'hsl(43 96% 15%)' },
};

export default function ActivityFeed() {
    return (
        <div className="rounded-xl flex flex-col h-full"
            style={{
                background: 'hsl(222 40% 10%)',
                border: '1px solid hsl(222 30% 16%)',
            }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid hsl(222 30% 16%)' }}>
                <h3 className="text-base font-semibold text-white">Atividade Recente</h3>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>Últimas 24 horas</p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activities.map((a, i) => {
                    const { icon, color, bg } = icons[a.type];
                    return (
                        <div key={i}
                            className="flex items-start gap-3 px-5 py-3.5 transition-colors"
                            style={{ borderBottom: i < activities.length - 1 ? '1px solid hsl(222 30% 13%)' : 'none' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'hsl(222 40% 12%)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            <div className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5"
                                style={{ background: bg, color }}>
                                {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white leading-snug">{a.title}</p>
                                <p className="text-xs mt-0.5 truncate" style={{ color: 'hsl(215 20% 50%)' }}>{a.desc}</p>
                            </div>
                            <span className="text-xs shrink-0 mt-0.5" style={{ color: 'hsl(215 20% 40%)' }}>{a.time}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

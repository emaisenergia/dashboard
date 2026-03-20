'use client';
import React, { useState } from 'react';
import { Calendar, RefreshCw, Download, ChevronDown } from 'lucide-react';

export default function DashboardHeader() {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const now = new Date();
    const formatted = now.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    }) + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard Operacional</h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm" style={{ color: 'hsl(215 20% 55%)' }}>
                        Atualizado em {formatted}
                    </span>
                    <span className="text-sm" style={{ color: 'hsl(215 20% 40%)' }}>·</span>
                    <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'hsl(142 71% 45%)' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: 'hsl(142 71% 45%)' }} />
                        Ao vivo
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Date picker */}
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                        background: 'hsl(222 40% 12%)',
                        border: '1px solid hsl(222 30% 18%)',
                        color: 'hsl(210 40% 90%)',
                    }}>
                    <Calendar size={15} />
                    <span>Hoje</span>
                    <ChevronDown size={14} style={{ color: 'hsl(215 20% 55%)' }} />
                </button>

                {/* Refresh */}
                <button
                    onClick={handleRefresh}
                    className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                    style={{
                        background: 'hsl(222 40% 12%)',
                        border: '1px solid hsl(222 30% 18%)',
                        color: 'hsl(215 20% 60%)',
                    }}>
                    <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                </button>

                {/* Export */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                    <Download size={15} />
                    <span>Exportar</span>
                </button>
            </div>
        </div>
    );
}

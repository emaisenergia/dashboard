import React from 'react';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

const cards = [
    {
        label: 'TOTAL DE PRODUTOS',
        value: '38',
        sub: '34 ativos · 4 inativos',
        icon: <Package size={18} />,
        iconColor: 'hsl(262 83% 66%)',
        bg: 'hsl(222 40% 10%)',
        border: 'hsl(222 30% 16%)',
    },
    {
        label: 'MARGEM MÉDIA',
        value: '52.4%',
        sub: '+3.2pp vs mês anterior',
        subColor: 'hsl(142 71% 45%)',
        icon: <TrendingUp size={18} />,
        iconColor: 'hsl(142 71% 45%)',
        bg: 'linear-gradient(135deg, hsl(142 50% 10%), hsl(142 40% 8%))',
        border: 'hsl(142 50% 20%)',
    },
    {
        label: 'ESTOQUE CRÍTICO',
        value: '5',
        sub: 'Abaixo de 20 unidades',
        icon: <AlertTriangle size={18} />,
        iconColor: 'hsl(43 96% 56%)',
        bg: 'linear-gradient(135deg, hsl(43 60% 10%), hsl(43 50% 8%))',
        border: 'hsl(43 60% 22%)',
    },
    {
        label: 'RECEITA TOTAL (MÊS)',
        value: 'R$ 312.840',
        sub: '1.847 pedidos este mês',
        icon: <DollarSign size={18} />,
        iconColor: 'hsl(180 80% 50%)',
        bg: 'hsl(222 40% 10%)',
        border: 'hsl(222 30% 16%)',
    },
];

export default function ProductSummaryCards() {
    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card, i) => (
                <div key={i} className="rounded-xl p-5"
                    style={{ background: card.bg, border: `1px solid ${card.border}` }}>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold tracking-widest uppercase"
                            style={{ color: 'hsl(215 20% 50%)' }}>
                            {card.label}
                        </span>
                        <span style={{ color: card.iconColor }}>{card.icon}</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{card.value}</p>
                    <p className="text-xs mt-2" style={{ color: (card as any).subColor || 'hsl(215 20% 50%)' }}>
                        {card.sub}
                    </p>
                </div>
            ))}
        </div>
    );
}

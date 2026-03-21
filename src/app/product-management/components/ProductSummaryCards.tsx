'use client';
import React from 'react';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

export default function ProductSummaryCards() {
    const { products, revenues } = useApp();

    const ativos = products.filter(p => p.status === 'ATIVO').length;
    const inativos = products.filter(p => p.status === 'INATIVO').length;

    const avgMargem = products.length > 0
        ? products.reduce((acc, p) => {
            const margem = p.preco > 0 ? ((p.preco - p.custo) / p.preco) * 100 : 0;
            return acc + margem;
        }, 0) / products.length
        : 0;

    const criticos = products.filter(p => p.estoque <= p.estoqueMinimo && p.status !== 'INATIVO').length;

    const totalReceita = revenues
        .filter(r => r.status !== 'CANCELADO' && r.type === 'product_sale')
        .reduce((acc, r) => acc + (r.type === 'product_sale' ? r.total : 0), 0);

    const cards = [
        {
            label: 'TOTAL DE PRODUTOS',
            value: products.length.toString(),
            sub: products.length === 0 ? 'Nenhum produto cadastrado' : `${ativos} ativos · ${inativos} inativos`,
            icon: <Package size={18} />,
            iconColor: 'hsl(262 83% 66%)',
            bg: 'hsl(222 40% 10%)',
            border: 'hsl(222 30% 16%)',
        },
        {
            label: 'MARGEM MÉDIA',
            value: products.length > 0 ? `${avgMargem.toFixed(1)}%` : '—',
            sub: products.length === 0 ? 'Sem produtos cadastrados' : 'Margem bruta média',
            subColor: avgMargem >= 50 ? 'hsl(142 71% 45%)' : 'hsl(43 96% 56%)',
            icon: <TrendingUp size={18} />,
            iconColor: 'hsl(142 71% 45%)',
            bg: 'linear-gradient(135deg, hsl(142 50% 10%), hsl(142 40% 8%))',
            border: 'hsl(142 50% 20%)',
        },
        {
            label: 'ESTOQUE CRÍTICO',
            value: criticos.toString(),
            sub: criticos === 0 ? 'Nenhum produto em alerta' : 'Abaixo do estoque mínimo',
            icon: <AlertTriangle size={18} />,
            iconColor: 'hsl(43 96% 56%)',
            bg: criticos > 0
                ? 'linear-gradient(135deg, hsl(43 60% 10%), hsl(43 50% 8%))'
                : 'hsl(222 40% 10%)',
            border: criticos > 0 ? 'hsl(43 60% 22%)' : 'hsl(222 30% 16%)',
        },
        {
            label: 'RECEITA DE PRODUTOS',
            value: fmt(totalReceita),
            sub: totalReceita === 0 ? 'Nenhuma venda registrada' : 'Total acumulado de vendas',
            icon: <DollarSign size={18} />,
            iconColor: 'hsl(180 80% 50%)',
            bg: 'hsl(222 40% 10%)',
            border: 'hsl(222 30% 16%)',
        },
    ];

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

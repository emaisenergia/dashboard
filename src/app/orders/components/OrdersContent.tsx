'use client';
import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

type OStatus = 'ENTREGUE' | 'EM TRÂNSITO' | 'AGUARDANDO' | 'CANCELADO';

interface Order {
    id: string;
    customer: string;
    product: string;
    qty: number;
    total: number;
    date: string;
    platform: string;
    status: OStatus;
}

const orders: Order[] = [
    { id: 'ORD-1001', customer: 'Ana Lima', product: 'Whey Protein 900g — Banana', qty: 2, total: 379.80, date: '2026-03-20', platform: 'TikTok', status: 'EM TRÂNSITO' },
    { id: 'ORD-1002', customer: 'Carlos Mendes', product: 'Creatina Monoidratada 300g', qty: 1, total: 149.90, date: '2026-03-20', platform: 'Facebook', status: 'AGUARDANDO' },
    { id: 'ORD-1003', customer: 'Fernanda Souza', product: 'Kit Suplemento Starter', qty: 1, total: 297.00, date: '2026-03-19', platform: 'Shopify', status: 'ENTREGUE' },
    { id: 'ORD-1004', customer: 'Rodrigo Alves', product: 'Pré-Treino Energy Burst', qty: 1, total: 169.90, date: '2026-03-19', platform: 'TikTok', status: 'EM TRÂNSITO' },
    { id: 'ORD-1005', customer: 'Juliana Costa', product: 'Ômega 3 1000mg', qty: 3, total: 239.70, date: '2026-03-18', platform: 'Facebook', status: 'ENTREGUE' },
    { id: 'ORD-1006', customer: 'Marcelo Pinto', product: 'Whey Protein 900g — Chocolate', qty: 1, total: 189.90, date: '2026-03-18', platform: 'Shopify', status: 'ENTREGUE' },
    { id: 'ORD-1007', customer: 'Patrícia Nunes', product: 'Colágeno + Vitamina C', qty: 2, total: 109.80, date: '2026-03-17', platform: 'TikTok', status: 'EM TRÂNSITO' },
    { id: 'ORD-1008', customer: 'Diego Santos', product: 'BCAA 2:1:1 300g', qty: 1, total: 119.90, date: '2026-03-17', platform: 'Site', status: 'CANCELADO' },
    { id: 'ORD-1009', customer: 'Luciana Rocha', product: 'Kit Suplemento Starter', qty: 2, total: 594.00, date: '2026-03-16', platform: 'Facebook', status: 'ENTREGUE' },
    { id: 'ORD-1010', customer: 'Bruno Ferreira', product: 'Vitamina D3 60 Caps', qty: 2, total: 69.80, date: '2026-03-16', platform: 'Shopify', status: 'ENTREGUE' },
    { id: 'ORD-1011', customer: 'Camila Vaz', product: 'Magnésio Quelato', qty: 1, total: 44.90, date: '2026-03-15', platform: 'TikTok', status: 'ENTREGUE' },
    { id: 'ORD-1012', customer: 'Rafael Torres', product: 'Glutamina 300g', qty: 1, total: 99.90, date: '2026-03-15', platform: 'Facebook', status: 'AGUARDANDO' },
];

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const fmtDate = (d: string) => {
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
};

const statusConfig: Record<OStatus, { bg: string; color: string; icon: React.ReactNode }> = {
    ENTREGUE: { bg: 'hsl(142 71% 15%)', color: 'hsl(142 71% 55%)', icon: <CheckCircle size={12} /> },
    'EM TRÂNSITO': { bg: 'hsl(200 80% 15%)', color: 'hsl(200 80% 60%)', icon: <Truck size={12} /> },
    AGUARDANDO: { bg: 'hsl(43 96% 15%)', color: 'hsl(43 96% 60%)', icon: <Package size={12} /> },
    CANCELADO: { bg: 'hsl(0 60% 15%)', color: 'hsl(0 84% 60%)', icon: <XCircle size={12} /> },
};

const platformColors: Record<string, string> = {
    TikTok: 'hsl(180 80% 50%)', Facebook: 'hsl(220 80% 60%)',
    Shopify: 'hsl(142 60% 50%)', Site: 'hsl(262 83% 66%)',
};

export default function OrdersContent() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const filtered = useMemo(() => orders.filter(o => {
        const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.customer.toLowerCase().includes(search.toLowerCase()) ||
            o.product.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'Todos' || o.status === statusFilter;
        return matchSearch && matchStatus;
    }), [search, statusFilter]);

    const totalRevenue = filtered.filter(o => o.status !== 'CANCELADO').reduce((acc, o) => acc + o.total, 0);

    const summaryCards = [
        { label: 'Total de Pedidos', value: String(orders.length), color: 'hsl(262 83% 66%)' },
        { label: 'Entregues', value: String(orders.filter(o => o.status === 'ENTREGUE').length), color: 'hsl(142 71% 50%)' },
        { label: 'Em Trânsito', value: String(orders.filter(o => o.status === 'EM TRÂNSITO').length), color: 'hsl(200 80% 60%)' },
        { label: 'Receita Total', value: fmt(orders.filter(o => o.status !== 'CANCELADO').reduce((a, o) => a + o.total, 0)), color: 'hsl(142 71% 50%)' },
    ];

    return (
        <div className="space-y-5">
            {/* Summary */}
            <div className="grid grid-cols-4 gap-4">
                {summaryCards.map((c, i) => (
                    <div key={i} className="rounded-xl p-4"
                        style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'hsl(215 20% 50%)' }}>{c.label}</p>
                        <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-xl overflow-hidden"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                <div className="flex items-center gap-3 px-5 py-4"
                    style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                    <div className="flex-1 relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: 'hsl(215 20% 45%)' }} />
                        <input type="text" placeholder="Buscar por ID, cliente ou produto..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }} />
                    </div>
                    <div className="relative">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                            {['Todos', 'ENTREGUE', 'EM TRÂNSITO', 'AGUARDANDO', 'CANCELADO'].map(s => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'hsl(215 20% 50%)' }} />
                    </div>
                    <span className="text-xs px-3 py-2 rounded-lg"
                        style={{ color: 'hsl(142 71% 50%)', background: 'hsl(142 71% 10%)', border: '1px solid hsl(142 71% 18%)' }}>
                        {fmt(totalRevenue)}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                                {['Pedido', 'Cliente', 'Produto', 'Qtd', 'Total', 'Data', 'Plataforma', 'Status'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wider"
                                        style={{ color: 'hsl(215 20% 45%)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((o, i) => {
                                const s = statusConfig[o.status];
                                return (
                                    <tr key={i} style={{ borderBottom: '1px solid hsl(222 30% 12%)' }}
                                        className="hover:bg-[hsl(222_40%_12%)] transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'hsl(262 83% 70%)' }}>{o.id}</td>
                                        <td className="px-4 py-3 font-medium text-white">{o.customer}</td>
                                        <td className="px-4 py-3 max-w-[200px] truncate" style={{ color: 'hsl(215 20% 70%)' }}>{o.product}</td>
                                        <td className="px-4 py-3 text-white">{o.qty}</td>
                                        <td className="px-4 py-3 font-semibold" style={{ color: 'hsl(142 71% 50%)' }}>{fmt(o.total)}</td>
                                        <td className="px-4 py-3" style={{ color: 'hsl(215 20% 60%)' }}>{fmtDate(o.date)}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-medium" style={{ color: platformColors[o.platform] || 'hsl(215 20% 55%)' }}>{o.platform}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold w-fit"
                                                style={{ background: s.bg, color: s.color }}>
                                                {s.icon} {o.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

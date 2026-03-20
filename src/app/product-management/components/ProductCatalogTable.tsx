'use client';
import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Eye, Pencil, Trash2, AlertTriangle } from 'lucide-react';

type PStatus = 'ATIVO' | 'INATIVO' | 'RASCUNHO';

interface Product {
    sku: string;
    name: string;
    code: string;
    category: string;
    catColor: string;
    custo: number;
    preco: number;
    margem: number;
    campanhas: number;
    vendas: number;
    estoque: number;
    estoqueAlert: boolean;
    status: PStatus;
}

const products: Product[] = [
    { sku: 'WHEY-900-BAN', name: 'Whey Protein 900g — Banana', code: 'P001', category: 'Proteínas', catColor: 'hsl(38 92% 56%)', custo: 68.90, preco: 189.90, margem: 63.7, campanhas: 3, vendas: 412, estoque: 148, estoqueAlert: false, status: 'ATIVO' },
    { sku: 'WHEY-900-CHOC', name: 'Whey Protein 900g — Chocol...', code: 'P009', category: 'Proteínas', catColor: 'hsl(38 92% 56%)', custo: 68.90, preco: 189.90, margem: 63.7, campanhas: 3, vendas: 389, estoque: 34, estoqueAlert: false, status: 'ATIVO' },
    { sku: 'CREAT-300-UNF', name: 'Creatina Monoidratada 300g', code: 'P002', category: 'Suplementos', catColor: 'hsl(142 60% 50%)', custo: 42.00, preco: 149.90, margem: 72.0, campanhas: 2, vendas: 298, estoque: 87, estoqueAlert: false, status: 'ATIVO' },
    { sku: 'KIT-STARTER-01', name: 'Kit Suplemento Starter', code: 'P003', category: 'Suplementos', catColor: 'hsl(142 60% 50%)', custo: 98.00, preco: 297.00, margem: 67.0, campanhas: 4, vendas: 231, estoque: 62, estoqueAlert: false, status: 'ATIVO' },
    { sku: 'COLAGEN-VIT-60', name: 'Colágeno + Vitamina C 60 Caps', code: 'P011', category: 'Vitaminas', catColor: 'hsl(200 80% 55%)', custo: 15.50, preco: 54.90, margem: 71.8, campanhas: 1, vendas: 203, estoque: 18, estoqueAlert: true, status: 'ATIVO' },
    { sku: 'OMEGA3-120-CAP', name: 'Ômega 3 1000mg 120 Cápsl...', code: 'P004', category: 'Vitaminas', catColor: 'hsl(200 80% 55%)', custo: 22.50, preco: 79.90, margem: 71.8, campanhas: 1, vendas: 187, estoque: 203, estoqueAlert: false, status: 'ATIVO' },
    { sku: 'PRE-WORKOUT-300', name: 'Pré-Treino Energy Burst 300g', code: 'P010', category: 'Suplementos', catColor: 'hsl(142 60% 50%)', custo: 54.00, preco: 169.90, margem: 68.2, campanhas: 2, vendas: 167, estoque: 71, estoqueAlert: false, status: 'ATIVO' },
    { sku: 'BCAA-300-UNF', name: 'BCAA 2:1:1 300g', code: 'P005', category: 'Proteínas', catColor: 'hsl(38 92% 56%)', custo: 38.00, preco: 119.90, margem: 68.3, campanhas: 2, vendas: 143, estoque: 55, estoqueAlert: false, status: 'ATIVO' },
    { sku: 'GLUTAM-300-UNF', name: 'Glutamina 300g', code: 'P006', category: 'Suplementos', catColor: 'hsl(142 60% 50%)', custo: 32.00, preco: 99.90, margem: 68.0, campanhas: 1, vendas: 98, estoque: 12, estoqueAlert: true, status: 'ATIVO' },
    { sku: 'VITD-60-CAP', name: 'Vitamina D3 2000UI 60 Caps', code: 'P007', category: 'Vitaminas', catColor: 'hsl(200 80% 55%)', custo: 8.50, preco: 34.90, margem: 75.6, campanhas: 0, vendas: 76, estoque: 290, estoqueAlert: false, status: 'ATIVO' },
    { sku: 'MAGNES-60-CAP', name: 'Magnésio Quelato 60 Caps', code: 'P008', category: 'Vitaminas', catColor: 'hsl(200 80% 55%)', custo: 12.00, preco: 44.90, margem: 73.3, campanhas: 0, vendas: 54, estoque: 0, estoqueAlert: true, status: 'INATIVO' },
];

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const statusStyle: Record<PStatus, { bg: string; color: string }> = {
    ATIVO: { bg: 'hsl(142 71% 15%)', color: 'hsl(142 71% 55%)' },
    INATIVO: { bg: 'hsl(215 20% 15%)', color: 'hsl(215 20% 55%)' },
    RASCUNHO: { bg: 'hsl(43 96% 15%)', color: 'hsl(43 96% 60%)' },
};

function MargemBar({ value }: { value: number }) {
    const color = value >= 70 ? 'hsl(142 71% 45%)' : value >= 65 ? 'hsl(142 60% 40%)' : 'hsl(38 92% 56%)';
    return (
        <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(222 30% 20%)' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
            </div>
            <span className="text-xs font-semibold" style={{ color }}>{value.toFixed(1)}%</span>
        </div>
    );
}

export default function ProductCatalogTable() {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('Todas');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const categories = ['Todas', ...Array.from(new Set(products.map(p => p.category)))];

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === 'Todas' || p.category === catFilter;
        const matchStatus = statusFilter === 'Todos' || p.status === statusFilter;
        return matchSearch && matchCat && matchStatus;
    });

    return (
        <div className="rounded-xl overflow-hidden"
            style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                <div className="flex-1 relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'hsl(215 20% 45%)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou SKU..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                        style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}
                    />
                </div>
                <div className="relative">
                    <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer outline-none"
                        style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                        {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: 'hsl(215 20% 50%)' }} />
                </div>
                <div className="relative">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer outline-none"
                        style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                        {['Todos', 'ATIVO', 'INATIVO', 'RASCUNHO'].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: 'hsl(215 20% 50%)' }} />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                    <Plus size={14} />
                    Cadastrar Produto
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                            {['SKU', 'Produto', 'Categoria', 'Custo', 'Preço', 'Margem', 'Campanhas', 'Vendas ↓', 'Estoque', 'Status', 'Ações'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wider whitespace-nowrap"
                                    style={{ color: 'hsl(215 20% 45%)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p, i) => {
                            const s = statusStyle[p.status];
                            return (
                                <tr key={i} style={{ borderBottom: '1px solid hsl(222 30% 12%)' }}
                                    className="group hover:bg-[hsl(222_40%_12%)] transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-mono" style={{ color: 'hsl(215 20% 50%)' }}>{p.sku}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-white text-sm leading-tight">{p.name}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 45%)' }}>{p.code}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-medium" style={{ color: p.catColor }}>{p.category}</span>
                                    </td>
                                    <td className="px-4 py-3 text-white font-medium">{fmt(p.custo)}</td>
                                    <td className="px-4 py-3 text-white font-semibold">{fmt(p.preco)}</td>
                                    <td className="px-4 py-3"><MargemBar value={p.margem} /></td>
                                    <td className="px-4 py-3">
                                        {p.campanhas > 0 ? (
                                            <span className="px-2 py-0.5 rounded text-xs font-bold"
                                                style={{ background: 'hsl(262 83% 20%)', color: 'hsl(262 83% 75%)' }}>
                                                {p.campanhas} {p.campanhas === 1 ? 'ATIVA' : 'ATIVAS'}
                                            </span>
                                        ) : (
                                            <span className="text-xs" style={{ color: 'hsl(215 20% 40%)' }}>—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-white">{p.vendas}</td>
                                    <td className="px-4 py-3">
                                        {p.estoqueAlert ? (
                                            <span className="flex items-center gap-1 text-xs font-semibold"
                                                style={{ color: 'hsl(43 96% 56%)' }}>
                                                <AlertTriangle size={12} />
                                                {p.estoque}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-white">{p.estoque}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded text-xs font-bold"
                                            style={{ background: s.bg, color: s.color }}>{p.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button style={{ color: 'hsl(215 20% 50%)' }} className="hover:text-white transition-colors"><Eye size={14} /></button>
                                            <button style={{ color: 'hsl(215 20% 50%)' }} className="hover:text-white transition-colors"><Pencil size={14} /></button>
                                            <button style={{ color: 'hsl(215 20% 50%)' }} className="hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

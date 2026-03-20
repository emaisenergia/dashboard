'use client';
import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Plus, Pencil, Trash2, Megaphone, Package, MoreHorizontal } from 'lucide-react';
import { useApp, Expense, AdExpense, ProductExpense, OtherExpense } from '@/context/AppContext';
import RecordModal from './RecordModal';
import { toast } from 'sonner';

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const statusStyles: Record<string, { bg: string; color: string }> = {
    PAGO: { bg: 'hsl(142 71% 15%)', color: 'hsl(142 71% 55%)' },
    RECEBIDO: { bg: 'hsl(142 71% 15%)', color: 'hsl(142 71% 55%)' },
    PENDENTE: { bg: 'hsl(43 96% 15%)', color: 'hsl(43 96% 60%)' },
    CANCELADO: { bg: 'hsl(0 60% 15%)', color: 'hsl(0 84% 60%)' },
};

const typeConfig = {
    ad: { label: 'Anúncio', icon: <Megaphone size={12} />, color: 'hsl(38 92% 56%)' },
    product: { label: 'Produto', icon: <Package size={12} />, color: 'hsl(200 80% 55%)' },
    other: { label: 'Outros', icon: <MoreHorizontal size={12} />, color: 'hsl(262 83% 66%)' },
};

function getCategory(e: Expense): string {
    if (e.type === 'ad') return (e as AdExpense).platform;
    if (e.type === 'product') return 'Produto';
    return (e as OtherExpense).category;
}

function getDescription(e: Expense): string {
    if (e.type === 'ad') return (e as AdExpense).campaign;
    if (e.type === 'product') {
        const pe = e as ProductExpense;
        return `${pe.product} (${pe.quantity}x)`;
    }
    return (e as OtherExpense).description;
}

function getAmount(e: Expense): number {
    if (e.type === 'ad') return (e as AdExpense).amount;
    if (e.type === 'product') {
        const pe = e as ProductExpense;
        return pe.quantity * pe.unitCost;
    }
    return (e as OtherExpense).amount;
}

function getNotes(e: Expense): string {
    return (e as any).notes || '—';
}

function fmtDate(d: string): string {
    if (!d) return '—';
    if (d.includes('/')) return d;
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
}

const catColors: Record<string, string> = {
    TikTok: 'hsl(180 80% 50%)', Facebook: 'hsl(220 80% 60%)', Google: 'hsl(38 92% 56%)',
    Instagram: 'hsl(330 80% 60%)', YouTube: 'hsl(0 84% 60%)',
    Ferramentas: 'hsl(262 83% 66%)', Logística: 'hsl(142 60% 50%)',
    Pessoal: 'hsl(330 80% 60%)', Infraestrutura: 'hsl(200 80% 55%)',
    Marketing: 'hsl(38 92% 56%)', Outros: 'hsl(215 20% 55%)', Produto: 'hsl(200 80% 55%)',
};

export default function ExpenseTable() {
    const { expenses, deleteExpense } = useApp();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [modalOpen, setModalOpen] = useState(false);

    const filtered = useMemo(() => expenses.filter(e => {
        const desc = getDescription(e).toLowerCase();
        const matchSearch = desc.includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'Todos' || e.type === typeFilter ||
            (typeFilter === 'ad' && e.type === 'ad') ||
            (typeFilter === 'product' && e.type === 'product') ||
            (typeFilter === 'other' && e.type === 'other');
        const matchStatus = statusFilter === 'Todos' || e.status === statusFilter;
        return matchSearch && matchType && matchStatus;
    }), [expenses, search, typeFilter, statusFilter]);

    function handleDelete(id: string) {
        deleteExpense(id);
        toast.success('Despesa removida');
    }

    return (
        <>
            <div className="rounded-xl overflow-hidden"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                {/* Toolbar */}
                <div className="flex items-center gap-3 px-5 py-4"
                    style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                    <div className="flex-1 relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: 'hsl(215 20% 45%)' }} />
                        <input type="text" placeholder="Buscar despesa ou ID..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }} />
                    </div>
                    <div className="relative">
                        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                            <option value="Todos">Todos os tipos</option>
                            <option value="ad">Anúncios</option>
                            <option value="product">Produtos</option>
                            <option value="other">Outros</option>
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'hsl(215 20% 50%)' }} />
                    </div>
                    <div className="relative">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                            {['Todos', 'PAGO', 'PENDENTE', 'CANCELADO'].map(s => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'hsl(215 20% 50%)' }} />
                    </div>
                    <button onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                        <Plus size={14} /> Adicionar
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                                {['ID', 'Tipo', 'Descrição', 'Categoria', 'Valor', 'Data', 'Status', 'Observações', ''].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wider"
                                        style={{ color: 'hsl(215 20% 45%)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((e, i) => {
                                const s = statusStyles[e.status];
                                const tc = typeConfig[e.type];
                                const cat = getCategory(e);
                                const catColor = catColors[cat] || 'hsl(215 20% 55%)';
                                return (
                                    <tr key={i} style={{ borderBottom: '1px solid hsl(222 30% 12%)' }}
                                        className="group hover:bg-[hsl(222_40%_12%)] transition-colors">
                                        <td className="px-4 py-3 text-xs font-mono" style={{ color: 'hsl(215 20% 50%)' }}>{e.id}</td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1 text-xs font-medium whitespace-nowrap"
                                                style={{ color: tc.color }}>{tc.icon} {tc.label}</span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-white max-w-[200px] truncate">{getDescription(e)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-xs font-medium" style={{ color: catColor }}>{cat}</span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{fmt(getAmount(e))}</td>
                                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'hsl(215 20% 60%)' }}>{fmtDate(e.date)}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap"
                                                style={{ background: s.bg, color: s.color }}>{e.status}</span>
                                        </td>
                                        <td className="px-4 py-3 max-w-[140px] truncate" style={{ color: 'hsl(215 20% 50%)' }}>{getNotes(e)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button style={{ color: 'hsl(215 20% 55%)' }} className="hover:text-white transition-colors"><Pencil size={14} /></button>
                                                <button onClick={() => handleDelete(e.id)} style={{ color: 'hsl(215 20% 55%)' }} className="hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr><td colSpan={9} className="px-4 py-10 text-center text-sm" style={{ color: 'hsl(215 20% 45%)' }}>Nenhuma despesa encontrada</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RecordModal open={modalOpen} initialMode="expense" onClose={() => setModalOpen(false)} />
        </>
    );
}

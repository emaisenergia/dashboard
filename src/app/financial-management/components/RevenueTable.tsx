'use client';
import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Plus, Trash2, Pencil, ShoppingCart, Banknote } from 'lucide-react';
import { useApp, Revenue, ProductRevenue, OtherRevenue } from '@/context/AppContext';
import RecordModal from './RecordModal';
import { RevenueEditModal } from './QuickEditModal';
import { toast } from 'sonner';

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const statusStyles: Record<string, { bg: string; color: string }> = {
    RECEBIDO: { bg: 'hsl(142 71% 15%)', color: 'hsl(142 71% 55%)' },
    PENDENTE: { bg: 'hsl(43 96% 15%)', color: 'hsl(43 96% 60%)' },
    CANCELADO: { bg: 'hsl(0 60% 15%)', color: 'hsl(0 84% 60%)' },
};

const platformColors: Record<string, string> = {
    TikTok: 'hsl(180 80% 50%)', Facebook: 'hsl(220 80% 60%)', Google: 'hsl(38 92% 56%)',
    Instagram: 'hsl(330 80% 60%)', YouTube: 'hsl(0 84% 60%)', Shopify: 'hsl(142 60% 50%)', Site: 'hsl(262 83% 66%)',
};

const revCatColors: Record<string, string> = {
    Parceria: 'hsl(200 80% 55%)', Afiliado: 'hsl(262 83% 66%)', Consultoria: 'hsl(38 92% 56%)',
    Licenciamento: 'hsl(330 80% 60%)', Outros: 'hsl(215 20% 55%)',
};

function getDescription(r: Revenue): string {
    if (r.type === 'product_sale') return (r as ProductRevenue).product;
    return (r as OtherRevenue).description;
}

function getAmount(r: Revenue): number {
    if (r.type === 'product_sale') return (r as ProductRevenue).total;
    return (r as OtherRevenue).amount;
}

function getCategoryLabel(r: Revenue): string {
    if (r.type === 'product_sale') return (r as ProductRevenue).platform;
    return (r as OtherRevenue).category;
}

function getCategoryColor(r: Revenue): string {
    if (r.type === 'product_sale') return platformColors[(r as ProductRevenue).platform] || 'hsl(215 20% 55%)';
    return revCatColors[(r as OtherRevenue).category] || 'hsl(215 20% 55%)';
}

function fmtDate(d: string): string {
    if (!d) return '—';
    if (d.includes('/')) return d;
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
}

export default function RevenueTable() {
    const { revenues, deleteRevenue, clearRevenues } = useApp();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);

    const filtered = useMemo(() => revenues.filter(r => {
        const desc = getDescription(r).toLowerCase();
        const matchSearch = desc.includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'Todos' || r.type === typeFilter;
        const matchStatus = statusFilter === 'Todos' || r.status === statusFilter;
        return matchSearch && matchType && matchStatus;
    }), [revenues, search, typeFilter, statusFilter]);

    const total = useMemo(() =>
        filtered.filter(r => r.status !== 'CANCELADO').reduce((acc, r) => acc + getAmount(r), 0),
        [filtered]);

    function handleDelete(id: string) {
        deleteRevenue(id);
        toast.success('Receita removida');
    }

    function handleClearAll() {
        if (!confirm(`Excluir todas as ${revenues.length} receitas? Essa ação não pode ser desfeita.`)) return;
        clearRevenues();
        toast.success('Todas as receitas foram removidas');
    }

    return (
        <>
            <div className="rounded-xl overflow-hidden"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                {/* Summary bar */}
                <div className="px-5 py-3 flex items-center justify-between"
                    style={{ borderBottom: '1px solid hsl(222 30% 14%)', background: 'hsl(142 60% 8%)' }}>
                    <span className="text-xs font-semibold" style={{ color: 'hsl(142 71% 50%)' }}>
                        Receita Filtrada: {fmt(total)}
                    </span>
                    <span className="text-xs" style={{ color: 'hsl(215 20% 50%)' }}>{filtered.length} registros</span>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-3 px-5 py-4"
                    style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                    <div className="flex-1 relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: 'hsl(215 20% 45%)' }} />
                        <input type="text" placeholder="Buscar receita ou ID..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }} />
                    </div>
                    <div className="relative">
                        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                            <option value="Todos">Todos os tipos</option>
                            <option value="product_sale">Venda de Produto</option>
                            <option value="other_revenue">Outras Receitas</option>
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'hsl(215 20% 50%)' }} />
                    </div>
                    <div className="relative">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                            {['Todos', 'RECEBIDO', 'PENDENTE', 'CANCELADO'].map(s => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'hsl(215 20% 50%)' }} />
                    </div>
                    {revenues.length > 0 && (
                        <button onClick={handleClearAll}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                            style={{ background: 'hsl(0 60% 14%)', border: '1px solid hsl(0 60% 22%)', color: 'hsl(0 84% 60%)' }}>
                            <Trash2 size={13} /> Limpar tudo
                        </button>
                    )}
                    <button onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, hsl(142 60% 35%), hsl(142 80% 28%))' }}>
                        <Plus size={14} /> Adicionar
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                                {['ID', 'Tipo', 'Descrição', 'Origem / Categoria', 'Valor', 'Data', 'Status', ''].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wider"
                                        style={{ color: 'hsl(215 20% 45%)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, i) => {
                                const s = statusStyles[r.status];
                                return (
                                    <tr key={i} style={{ borderBottom: '1px solid hsl(222 30% 12%)' }}
                                        className="group hover:bg-[hsl(222_40%_12%)] transition-colors">
                                        <td className="px-4 py-3 text-xs font-mono" style={{ color: 'hsl(215 20% 50%)' }}>{r.id}</td>
                                        <td className="px-4 py-3">
                                            {r.type === 'product_sale'
                                                ? <span className="flex items-center gap-1 text-xs font-medium" style={{ color: 'hsl(142 71% 50%)' }}><ShoppingCart size={12} /> Venda</span>
                                                : <span className="flex items-center gap-1 text-xs font-medium" style={{ color: 'hsl(200 80% 60%)' }}><Banknote size={12} /> Receita</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3 font-medium text-white max-w-[220px] truncate">{getDescription(r)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-xs font-medium" style={{ color: getCategoryColor(r) }}>{getCategoryLabel(r)}</span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: 'hsl(142 71% 50%)' }}>{fmt(getAmount(r))}</td>
                                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'hsl(215 20% 60%)' }}>{fmtDate(r.date)}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap"
                                                style={{ background: s.bg, color: s.color }}>{r.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditingRevenue(r)} style={{ color: 'hsl(215 20% 55%)' }} className="hover:text-white transition-colors"><Pencil size={14} /></button>
                                                <button onClick={() => handleDelete(r.id)} style={{ color: 'hsl(215 20% 55%)' }} className="hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: 'hsl(215 20% 45%)' }}>Nenhuma receita encontrada</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RecordModal open={modalOpen} initialMode="revenue" onClose={() => setModalOpen(false)} />
            {editingRevenue && <RevenueEditModal revenue={editingRevenue} onClose={() => setEditingRevenue(null)} />}
        </>
    );
}

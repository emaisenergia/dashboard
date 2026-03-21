'use client';
import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Pencil, Trash2, AlertTriangle, Package, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Product, ProductStatus } from '@/context/AppContext';
import { toast } from 'sonner';

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const statusStyle: Record<ProductStatus, { bg: string; color: string }> = {
    ATIVO: { bg: 'hsl(142 71% 15%)', color: 'hsl(142 71% 55%)' },
    INATIVO: { bg: 'hsl(215 20% 15%)', color: 'hsl(215 20% 55%)' },
    RASCUNHO: { bg: 'hsl(43 96% 15%)', color: 'hsl(43 96% 60%)' },
};

const CATEGORY_COLORS: Record<string, string> = {
    'Proteínas': 'hsl(38 92% 56%)',
    'Suplementos': 'hsl(142 60% 50%)',
    'Vitaminas': 'hsl(200 80% 55%)',
    'Outros': 'hsl(262 83% 66%)',
};

function getCatColor(cat: string): string {
    return CATEGORY_COLORS[cat] || 'hsl(262 83% 66%)';
}

function MargemBar({ value }: { value: number }) {
    const color = value >= 70 ? 'hsl(142 71% 45%)' : value >= 50 ? 'hsl(142 60% 40%)' : 'hsl(38 92% 56%)';
    return (
        <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(222 30% 20%)' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
            </div>
            <span className="text-xs font-semibold" style={{ color }}>{value.toFixed(1)}%</span>
        </div>
    );
}

// ── Modal ──────────────────────────────────────────────────────────────────────

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
    onSave: (data: Omit<Product, 'id'>) => void;
}

const CATEGORIES = ['Proteínas', 'Suplementos', 'Vitaminas', 'Outros'];

function ProductModal({ product, onClose, onSave }: ProductModalProps) {
    const [form, setForm] = useState({
        sku: product?.sku ?? '',
        nome: product?.nome ?? '',
        categoria: product?.categoria ?? 'Suplementos',
        custo: product?.custo ?? 0,
        preco: product?.preco ?? 0,
        estoque: product?.estoque ?? 0,
        estoqueMinimo: product?.estoqueMinimo ?? 10,
        status: product?.status ?? 'ATIVO' as ProductStatus,
    });

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    const margem = form.preco > 0 ? ((form.preco - form.custo) / form.preco) * 100 : 0;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.sku.trim() || !form.nome.trim()) {
            toast.error('SKU e nome são obrigatórios');
            return;
        }
        onSave({
            sku: form.sku.trim(),
            nome: form.nome.trim(),
            categoria: form.categoria,
            catColor: getCatColor(form.categoria),
            custo: Number(form.custo),
            preco: Number(form.preco),
            estoque: Number(form.estoque),
            estoqueMinimo: Number(form.estoqueMinimo),
            status: form.status,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-lg rounded-2xl overflow-hidden"
                style={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(222 30% 18%)' }}>
                <div className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: '1px solid hsl(222 30% 16%)' }}>
                    <h2 className="text-base font-semibold text-white">
                        {product ? 'Editar Produto' : 'Cadastrar Produto'}
                    </h2>
                    <button onClick={onClose} className="hover:text-white transition-colors"
                        style={{ color: 'hsl(215 20% 50%)' }}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>SKU *</label>
                            <input value={form.sku} onChange={e => set('sku', e.target.value)}
                                placeholder="EX: WHEY-900-BAN"
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Categoria</label>
                            <select value={form.categoria} onChange={e => set('categoria', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Nome do Produto *</label>
                        <input value={form.nome} onChange={e => set('nome', e.target.value)}
                            placeholder="Ex: Whey Protein 900g — Banana"
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Custo (R$)</label>
                            <input type="number" min="0" step="0.01" value={form.custo}
                                onChange={e => set('custo', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Preço de Venda (R$)</label>
                            <input type="number" min="0" step="0.01" value={form.preco}
                                onChange={e => set('preco', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                        </div>
                    </div>

                    {/* Margem preview */}
                    {form.preco > 0 && (
                        <div className="rounded-lg px-4 py-3 flex items-center justify-between"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)' }}>
                            <span className="text-xs" style={{ color: 'hsl(215 20% 55%)' }}>Margem calculada</span>
                            <span className="text-sm font-bold"
                                style={{ color: margem >= 50 ? 'hsl(142 71% 50%)' : 'hsl(43 96% 56%)' }}>
                                {margem.toFixed(1)}%
                            </span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Estoque Atual</label>
                            <input type="number" min="0" step="1" value={form.estoque}
                                onChange={e => set('estoque', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Estoque Mínimo</label>
                            <input type="number" min="0" step="1" value={form.estoqueMinimo}
                                onChange={e => set('estoqueMinimo', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Status</label>
                        <select value={form.status} onChange={e => set('status', e.target.value as ProductStatus)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }}>
                            <option value="ATIVO">ATIVO</option>
                            <option value="INATIVO">INATIVO</option>
                            <option value="RASCUNHO">RASCUNHO</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2" style={{ borderTop: '1px solid hsl(222 30% 16%)' }}>
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
                            style={{ background: 'hsl(222 40% 14%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(215 20% 65%)' }}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                            {product ? 'Salvar Alterações' : 'Cadastrar Produto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Main Table ─────────────────────────────────────────────────────────────────

export default function ProductCatalogTable() {
    const { products, addProduct, updateProduct, deleteProduct } = useApp();
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('Todas');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [modalProduct, setModalProduct] = useState<Product | null | 'new'>(null);

    const categories = ['Todas', ...Array.from(new Set(products.map(p => p.categoria)))];

    const filtered = products.filter(p => {
        const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === 'Todas' || p.categoria === catFilter;
        const matchStatus = statusFilter === 'Todos' || p.status === statusFilter;
        return matchSearch && matchCat && matchStatus;
    });

    function handleSave(data: Omit<Product, 'id'>) {
        if (modalProduct === 'new') {
            addProduct(data);
            toast.success('Produto cadastrado com sucesso');
        } else if (modalProduct) {
            updateProduct(modalProduct.id, data);
            toast.success('Produto atualizado');
        }
        setModalProduct(null);
    }

    function handleDelete(p: Product) {
        if (!confirm(`Excluir o produto "${p.nome}"? Esta ação não pode ser desfeita.`)) return;
        deleteProduct(p.id);
        toast.success('Produto excluído');
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
                    <button onClick={() => setModalProduct('new')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                        <Plus size={14} />
                        Cadastrar Produto
                    </button>
                </div>

                {/* Empty state */}
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="flex items-center justify-center w-14 h-14 rounded-xl"
                            style={{ background: 'hsl(222 40% 14%)', color: 'hsl(215 20% 35%)' }}>
                            <Package size={26} />
                        </div>
                        <p className="text-sm font-medium" style={{ color: 'hsl(215 20% 50%)' }}>Nenhum produto cadastrado</p>
                        <p className="text-xs" style={{ color: 'hsl(215 20% 38%)' }}>Clique em "Cadastrar Produto" para adicionar</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                        <p className="text-sm" style={{ color: 'hsl(215 20% 50%)' }}>Nenhum produto encontrado</p>
                        <p className="text-xs" style={{ color: 'hsl(215 20% 38%)' }}>Tente outros filtros</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                                    {['SKU', 'Produto', 'Categoria', 'Custo', 'Preço', 'Margem', 'Estoque', 'Mín.', 'Status', 'Ações'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wider whitespace-nowrap"
                                            style={{ color: 'hsl(215 20% 45%)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p) => {
                                    const s = statusStyle[p.status];
                                    const margem = p.preco > 0 ? ((p.preco - p.custo) / p.preco) * 100 : 0;
                                    const stockAlert = p.estoque <= p.estoqueMinimo && p.status !== 'INATIVO';
                                    return (
                                        <tr key={p.id}
                                            style={{ borderBottom: '1px solid hsl(222 30% 12%)' }}
                                            className="group hover:bg-[hsl(222_40%_12%)] transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-mono" style={{ color: 'hsl(215 20% 50%)' }}>{p.sku}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-white text-sm leading-tight">{p.nome}</p>
                                                <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 45%)' }}>{p.id}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-medium" style={{ color: p.catColor }}>{p.categoria}</span>
                                            </td>
                                            <td className="px-4 py-3 text-white font-medium">{fmt(p.custo)}</td>
                                            <td className="px-4 py-3 text-white font-semibold">{fmt(p.preco)}</td>
                                            <td className="px-4 py-3"><MargemBar value={margem} /></td>
                                            <td className="px-4 py-3">
                                                {stockAlert ? (
                                                    <span className="flex items-center gap-1 text-xs font-semibold"
                                                        style={{ color: 'hsl(43 96% 56%)' }}>
                                                        <AlertTriangle size={12} />
                                                        {p.estoque}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-white">{p.estoque}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3" style={{ color: 'hsl(215 20% 55%)' }}>{p.estoqueMinimo}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded text-xs font-bold"
                                                    style={{ background: s.bg, color: s.color }}>{p.status}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setModalProduct(p)}
                                                        style={{ color: 'hsl(215 20% 50%)' }} className="hover:text-white transition-colors">
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(p)}
                                                        style={{ color: 'hsl(215 20% 50%)' }} className="hover:text-red-400 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalProduct !== null && (
                <ProductModal
                    product={modalProduct === 'new' ? null : modalProduct}
                    onClose={() => setModalProduct(null)}
                    onSave={handleSave}
                />
            )}
        </>
    );
}

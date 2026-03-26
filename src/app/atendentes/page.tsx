'use client';
import React, { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { useApp } from '@/context/AppContext';
import { Atendente, AtendenteSale, SaleStatus } from '@/context/AppContext';
import {
    Users, Plus, Trash2, Pencil, X, TrendingUp, TrendingDown,
    DollarSign, ShoppingBag, ChevronDown, UserPlus, Settings2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from 'recharts';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const brl = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const inp: React.CSSProperties = {
    background: 'hsl(222 40% 13%)',
    border: '1px solid hsl(222 30% 20%)',
    color: 'hsl(210 40% 90%)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
};

const statusStyle: Record<SaleStatus, { bg: string; color: string }> = {
    RECEBIDO:  { bg: 'hsl(142 71% 10%)', color: 'hsl(142 71% 55%)' },
    PENDENTE:  { bg: 'hsl(43 96% 10%)',  color: 'hsl(43 96% 60%)'  },
    CANCELADO: { bg: 'hsl(0 60% 10%)',   color: 'hsl(0 84% 60%)'   },
};

const statusLabel: Record<SaleStatus, string> = {
    RECEBIDO: 'Recebido', PENDENTE: 'Pendente', CANCELADO: 'Cancelado',
};

const COR_OPTIONS = [
    'hsl(262 83% 66%)', 'hsl(142 71% 45%)', 'hsl(43 96% 56%)',
    'hsl(200 83% 55%)', 'hsl(0 84% 60%)',   'hsl(330 80% 60%)',
    'hsl(30 90% 55%)',  'hsl(180 70% 45%)', 'hsl(280 70% 60%)',
];

// ─── Atendente Modal (add/edit) ───────────────────────────────────────────────

interface AtendenteModalProps {
    atendente?: Atendente;
    onClose: () => void;
    onSave: (data: Omit<Atendente, 'id'>) => void;
}

function AtendenteModal({ atendente, onClose, onSave }: AtendenteModalProps) {
    const [nome, setNome] = useState(atendente?.nome ?? '');
    const [cor, setCor]   = useState(atendente?.cor ?? COR_OPTIONS[0]);

    function handleSave() {
        if (!nome.trim()) { toast.error('Informe o nome do atendente.'); return; }
        onSave({ nome: nome.trim(), cor });
        onClose();
    }

    const initials = nome.trim()
        ? nome.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="w-full max-w-sm rounded-2xl p-6 space-y-5"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 18%)' }}>

                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">
                        {atendente ? 'Editar Atendente' : 'Cadastrar Atendente'}
                    </h2>
                    <button onClick={onClose} style={{ color: 'hsl(215 20% 55%)' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Preview avatar */}
                <div className="flex justify-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full text-xl font-bold text-white"
                        style={{ background: cor }}>
                        {initials}
                    </div>
                </div>

                {/* Nome */}
                <div>
                    <label className="block text-xs mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Nome</label>
                    <input style={inp} placeholder="Ex.: Ana Silva" value={nome}
                        onChange={e => setNome(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSave()} />
                </div>

                {/* Cor */}
                <div>
                    <label className="block text-xs mb-2" style={{ color: 'hsl(215 20% 55%)' }}>Cor do avatar</label>
                    <div className="flex flex-wrap gap-2">
                        {COR_OPTIONS.map(c => (
                            <button key={c} onClick={() => setCor(c)}
                                className="w-8 h-8 rounded-full transition-all"
                                style={{
                                    background: c,
                                    outline: cor === c ? `3px solid white` : '3px solid transparent',
                                    outlineOffset: '2px',
                                }} />
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-1">
                    <button onClick={onClose}
                        className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                        style={{ background: 'hsl(222 40% 14%)', color: 'hsl(215 20% 65%)', border: '1px solid hsl(222 30% 20%)' }}>
                        Cancelar
                    </button>
                    <button onClick={handleSave}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 60%), hsl(240 83% 55%))' }}>
                        {atendente ? 'Salvar' : 'Cadastrar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Manage Atendentes Panel ──────────────────────────────────────────────────

interface ManagePanelProps {
    atendentes: Atendente[];
    onAdd: () => void;
    onEdit: (a: Atendente) => void;
    onDelete: (id: string) => void;
    salesCount: (id: string) => number;
    onClose: () => void;
}

function ManagePanel({ atendentes, onAdd, onEdit, onDelete, salesCount, onClose }: ManagePanelProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 18%)' }}>

                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">Gerenciar Atendentes</h2>
                    <button onClick={onClose} style={{ color: 'hsl(215 20% 55%)' }}><X size={18} /></button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {atendentes.length === 0 && (
                        <p className="text-sm text-center py-6" style={{ color: 'hsl(215 20% 45%)' }}>
                            Nenhum atendente cadastrado.
                        </p>
                    )}
                    {atendentes.map(a => {
                        const count = salesCount(a.id);
                        return (
                            <div key={a.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                                style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)' }}>
                                <div className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold text-white shrink-0"
                                    style={{ background: a.cor }}>
                                    {a.nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{a.nome}</p>
                                    <p className="text-xs" style={{ color: 'hsl(215 20% 45%)' }}>{count} venda{count !== 1 ? 's' : ''}</p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button onClick={() => onEdit(a)}
                                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                        style={{ color: 'hsl(215 20% 60%)' }}>
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => {
                                        if (count > 0) {
                                            toast.error(`${a.nome} possui ${count} venda${count !== 1 ? 's' : ''} registrada${count !== 1 ? 's' : ''}. Remova as vendas primeiro.`);
                                            return;
                                        }
                                        onDelete(a.id);
                                        toast.success('Atendente removido.');
                                    }}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                        style={{ color: 'hsl(0 84% 60%)' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button onClick={onAdd}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'hsl(262 83% 20%)', color: 'hsl(262 83% 80%)', border: '1px solid hsl(262 83% 40%)' }}>
                    <UserPlus size={15} />
                    Cadastrar novo atendente
                </button>
            </div>
        </div>
    );
}

// ─── Sale Modal ───────────────────────────────────────────────────────────────

interface SaleModalProps {
    sale?: AtendenteSale;
    atendentes: Atendente[];
    onClose: () => void;
    onSave: (data: Omit<AtendenteSale, 'id'>) => void;
}

function SaleModal({ sale, atendentes, onClose, onSave }: SaleModalProps) {
    const [form, setForm] = useState({
        atendenteId:   sale?.atendenteId   ?? (atendentes[0]?.id ?? ''),
        produto:       sale?.produto       ?? '',
        quantidade:    sale?.quantidade    ?? 1,
        precoUnitario: sale?.precoUnitario ?? 0,
        custoUnitario: sale?.custoUnitario ?? 0,
        data:          sale?.data          ?? new Date().toISOString().slice(0, 10),
        status:        (sale?.status       ?? 'RECEBIDO') as SaleStatus,
        notas:         sale?.notas         ?? '',
    });

    const total      = form.quantidade * form.precoUnitario;
    const totalCusto = form.quantidade * form.custoUnitario;
    const lucro      = total - totalCusto;

    function set(field: string, value: string | number) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function handleSave() {
        if (!form.atendenteId) { toast.error('Selecione um atendente.'); return; }
        if (!form.produto.trim()) { toast.error('Informe o produto.'); return; }
        if (form.precoUnitario <= 0) { toast.error('Preço de venda deve ser maior que zero.'); return; }
        onSave({ ...form, total, totalCusto, lucro, notas: form.notas });
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="w-full max-w-lg rounded-2xl p-6 space-y-5"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 18%)' }}>

                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">
                        {sale ? 'Editar Venda' : 'Adicionar Venda'}
                    </h2>
                    <button onClick={onClose} style={{ color: 'hsl(215 20% 55%)' }}><X size={18} /></button>
                </div>

                {atendentes.length === 0 ? (
                    <p className="text-sm text-center py-4" style={{ color: 'hsl(215 20% 50%)' }}>
                        Nenhum atendente cadastrado. Cadastre um atendente primeiro.
                    </p>
                ) : (<>
                    <div>
                        <label className="block text-xs mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Atendente</label>
                        <select style={inp} value={form.atendenteId}
                            onChange={e => set('atendenteId', e.target.value)}>
                            {atendentes.map(a => (
                                <option key={a.id} value={a.id}>{a.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Produto / Serviço</label>
                        <input style={inp} placeholder="Ex.: Whey Protein 900g" value={form.produto}
                            onChange={e => set('produto', e.target.value)} />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Quantidade</label>
                            <input style={inp} type="number" min={1} value={form.quantidade}
                                onChange={e => set('quantidade', Number(e.target.value))} />
                        </div>
                        <div>
                            <label className="block text-xs mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Preço unitário (R$)</label>
                            <input style={inp} type="number" min={0} step={0.01} value={form.precoUnitario}
                                onChange={e => set('precoUnitario', Number(e.target.value))} />
                        </div>
                        <div>
                            <label className="block text-xs mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Custo unitário (R$)</label>
                            <input style={inp} type="number" min={0} step={0.01} value={form.custoUnitario}
                                onChange={e => set('custoUnitario', Number(e.target.value))} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 rounded-xl p-3"
                        style={{ background: 'hsl(222 40% 8%)', border: '1px solid hsl(222 30% 16%)' }}>
                        <div className="text-center">
                            <p className="text-xs mb-0.5" style={{ color: 'hsl(215 20% 45%)' }}>Total venda</p>
                            <p className="text-sm font-semibold text-white">{brl(total)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs mb-0.5" style={{ color: 'hsl(215 20% 45%)' }}>Total custo</p>
                            <p className="text-sm font-semibold" style={{ color: 'hsl(0 84% 60%)' }}>{brl(totalCusto)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs mb-0.5" style={{ color: 'hsl(215 20% 45%)' }}>Lucro</p>
                            <p className="text-sm font-semibold"
                                style={{ color: lucro >= 0 ? 'hsl(142 71% 55%)' : 'hsl(0 84% 60%)' }}>
                                {brl(lucro)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Data</label>
                            <input style={inp} type="date" value={form.data}
                                onChange={e => set('data', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Status</label>
                            <select style={inp} value={form.status}
                                onChange={e => set('status', e.target.value as SaleStatus)}>
                                <option value="RECEBIDO">Recebido</option>
                                <option value="PENDENTE">Pendente</option>
                                <option value="CANCELADO">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Observações (opcional)</label>
                        <textarea style={{ ...inp, resize: 'none', height: '64px' } as React.CSSProperties}
                            placeholder="Ex.: cliente retorno, venda em grupo..."
                            value={form.notas}
                            onChange={e => set('notas', e.target.value)} />
                    </div>
                </>)}

                <div className="flex gap-3 pt-1">
                    <button onClick={onClose}
                        className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                        style={{ background: 'hsl(222 40% 14%)', color: 'hsl(215 20% 65%)', border: '1px solid hsl(222 30% 20%)' }}>
                        Cancelar
                    </button>
                    {atendentes.length > 0 && (
                        <button onClick={handleSave}
                            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg, hsl(262 83% 60%), hsl(240 83% 55%))' }}>
                            {sale ? 'Salvar' : 'Adicionar'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Inner content ────────────────────────────────────────────────────────────

function AtendentesContent() {
    const {
        atendenteSales, addAtendenteSale, updateAtendenteSale, deleteAtendenteSale, clearAtendenteSales,
        atendentes, addAtendente, updateAtendente, deleteAtendente,
    } = useApp();

    const [selectedTab,  setSelectedTab]  = useState<string>('all');
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [editSale,     setEditSale]     = useState<AtendenteSale | undefined>();
    const [search,       setSearch]       = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showReport,   setShowReport]   = useState(false);
    const [showManage,   setShowManage]   = useState(false);
    const [showAtendenteModal, setShowAtendenteModal] = useState(false);
    const [editAtendente, setEditAtendente] = useState<Atendente | undefined>();

    // ─ Per-attendant KPIs ─
    const kpisPerAtendente = useMemo(() =>
        atendentes.map(a => {
            const sales = atendenteSales.filter(s => s.atendenteId === a.id && s.status !== 'CANCELADO');
            const totalVendas = sales.reduce((acc, s) => acc + s.total, 0);
            const totalCusto  = sales.reduce((acc, s) => acc + s.totalCusto, 0);
            const lucro       = totalVendas - totalCusto;
            const margem      = totalVendas > 0 ? (lucro / totalVendas) * 100 : 0;
            const qtdVendas   = sales.length;
            return { ...a, totalVendas, totalCusto, lucro, margem, qtdVendas };
        }), [atendentes, atendenteSales]);

    // ─ Filtered sales ─
    const filteredSales = useMemo(() => {
        let list = selectedTab === 'all'
            ? atendenteSales
            : atendenteSales.filter(s => s.atendenteId === selectedTab);
        if (filterStatus !== 'all') list = list.filter(s => s.status === filterStatus);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(s =>
                s.produto.toLowerCase().includes(q) ||
                (atendentes.find(a => a.id === s.atendenteId)?.nome.toLowerCase().includes(q) ?? false)
            );
        }
        return [...list].sort((a, b) => b.data.localeCompare(a.data));
    }, [atendenteSales, atendentes, selectedTab, filterStatus, search]);

    // ─ Global KPIs ─
    const globalKpis = useMemo(() => {
        const active = atendenteSales.filter(s => s.status !== 'CANCELADO');
        const totalVendas = active.reduce((acc, s) => acc + s.total, 0);
        const totalCusto  = active.reduce((acc, s) => acc + s.totalCusto, 0);
        const lucro       = totalVendas - totalCusto;
        const margem      = totalVendas > 0 ? (lucro / totalVendas) * 100 : 0;
        return { totalVendas, totalCusto, lucro, margem };
    }, [atendenteSales]);

    function handleSaveSale(data: Omit<AtendenteSale, 'id'>) {
        if (editSale) { updateAtendenteSale(editSale.id, data); toast.success('Venda atualizada.'); }
        else          { addAtendenteSale(data);                 toast.success('Venda registrada.'); }
        setEditSale(undefined);
    }

    function handleDeleteSale(id: string) {
        deleteAtendenteSale(id);
        toast.success('Venda removida.');
    }

    function handleClearAllSales() {
        const count = selectedTab === 'all'
            ? atendenteSales.length
            : atendenteSales.filter(s => s.atendenteId === selectedTab).length;
        if (!confirm(`Excluir ${count} venda(s)? Essa ação não pode ser desfeita.`)) return;
        if (selectedTab === 'all') {
            clearAtendenteSales();
        } else {
            filteredSales.forEach(s => deleteAtendenteSale(s.id));
        }
        toast.success('Vendas removidas.');
    }

    function handleSaveAtendente(data: Omit<Atendente, 'id'>) {
        if (editAtendente) { updateAtendente(editAtendente.id, data); toast.success('Atendente atualizado.'); }
        else               { addAtendente(data);                      toast.success('Atendente cadastrado.'); }
        setEditAtendente(undefined);
    }

    const getAt = (id: string) => atendentes.find(a => a.id === id);
    const salesCount = (id: string) => atendenteSales.filter(s => s.atendenteId === id).length;

    return (
        <>
        <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">

            {/* ── Header ─────────────────────────────── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 30% / 0.6), hsl(240 83% 28% / 0.4))', border: '1px solid hsl(262 83% 50% / 0.3)' }}>
                        <Users size={18} style={{ color: 'hsl(262 83% 75%)' }} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Atendentes</h1>
                        <p className="text-xs" style={{ color: 'hsl(215 20% 50%)' }}>
                            Vendas, custos e lucro por atendente
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setShowReport(v => !v)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                            background: showReport ? 'hsl(262 83% 20%)' : 'hsl(222 40% 14%)',
                            color: showReport ? 'hsl(262 83% 80%)' : 'hsl(215 20% 65%)',
                            border: `1px solid ${showReport ? 'hsl(262 83% 40%)' : 'hsl(222 30% 20%)'}`,
                        }}>
                        <TrendingUp size={15} />
                        Relatórios
                    </button>
                    <button onClick={() => setShowManage(true)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium"
                        style={{ background: 'hsl(222 40% 14%)', color: 'hsl(215 20% 65%)', border: '1px solid hsl(222 30% 20%)' }}>
                        <Settings2 size={15} />
                        Atendentes
                    </button>
                    {filteredSales.length > 0 && (
                        <button onClick={handleClearAllSales}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                            style={{ background: 'hsl(0 60% 14%)', border: '1px solid hsl(0 60% 22%)', color: 'hsl(0 84% 60%)' }}>
                            <Trash2 size={13} /> Limpar tudo
                        </button>
                    )}
                    <button
                        onClick={() => { setEditSale(undefined); setShowSaleModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 60%), hsl(240 83% 55%))' }}>
                        <Plus size={15} />
                        Adicionar Venda
                    </button>
                </div>
            </div>

            {/* ── Global summary cards ────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total em Vendas', value: brl(globalKpis.totalVendas), icon: ShoppingBag, color: 'hsl(262 83% 66%)', sub: `${atendenteSales.filter(s => s.status !== 'CANCELADO').length} vendas` },
                    { label: 'Total em Custos', value: brl(globalKpis.totalCusto),  icon: DollarSign,  color: 'hsl(0 84% 60%)',   sub: 'custo total das vendas' },
                    { label: 'Lucro Total',     value: brl(globalKpis.lucro),       icon: TrendingUp,  color: 'hsl(142 71% 45%)', sub: `margem ${globalKpis.margem.toFixed(1)}%` },
                    { label: 'Atendentes',      value: String(atendentes.length),   icon: Users,       color: 'hsl(43 96% 56%)',  sub: `${atendentes.length} cadastrado${atendentes.length !== 1 ? 's' : ''}` },
                ].map(card => (
                    <div key={card.label} className="rounded-2xl p-4"
                        style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center justify-center w-7 h-7 rounded-lg"
                                style={{ background: `${card.color}22` }}>
                                <card.icon size={14} style={{ color: card.color }} />
                            </div>
                            <span className="text-xs" style={{ color: 'hsl(215 20% 50%)' }}>{card.label}</span>
                        </div>
                        <p className="text-xl font-bold text-white">{card.value}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 45%)' }}>{card.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Per-attendant cards ─────────────────── */}
            {atendentes.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpisPerAtendente.map(a => (
                        <button key={a.id}
                            onClick={() => setSelectedTab(selectedTab === a.id ? 'all' : a.id)}
                            className="rounded-2xl p-4 text-left transition-all"
                            style={{
                                background: selectedTab === a.id ? 'hsl(262 83% 14%)' : 'hsl(222 40% 10%)',
                                border: `1px solid ${selectedTab === a.id ? 'hsl(262 83% 45%)' : 'hsl(222 30% 16%)'}`,
                            }}>
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white"
                                    style={{ background: a.cor }}>
                                    {a.nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white leading-tight">{a.nome}</p>
                                    <p className="text-[11px]" style={{ color: 'hsl(215 20% 50%)' }}>{a.qtdVendas} vendas</p>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span style={{ color: 'hsl(215 20% 50%)' }}>Vendas</span>
                                    <span className="text-white font-medium">{brl(a.totalVendas)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span style={{ color: 'hsl(215 20% 50%)' }}>Custos</span>
                                    <span style={{ color: 'hsl(0 84% 60%)' }}>{brl(a.totalCusto)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-semibold">
                                    <span style={{ color: 'hsl(215 20% 50%)' }}>Lucro</span>
                                    <span style={{ color: a.lucro >= 0 ? 'hsl(142 71% 55%)' : 'hsl(0 84% 60%)' }}>
                                        {brl(a.lucro)}
                                    </span>
                                </div>
                                <div className="h-1.5 rounded-full mt-2 overflow-hidden"
                                    style={{ background: 'hsl(222 40% 15%)' }}>
                                    <div className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${Math.min(Math.max(a.margem, 0), 100)}%`,
                                            background: a.margem >= 40 ? 'hsl(142 71% 45%)' : a.margem >= 20 ? 'hsl(43 96% 56%)' : 'hsl(0 84% 60%)',
                                        }} />
                                </div>
                                <p className="text-[10px]" style={{ color: 'hsl(215 20% 45%)' }}>Margem {a.margem.toFixed(1)}%</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* ── Report panel ────────────────────────── */}
            {showReport && kpisPerAtendente.length > 0 && (
                <div className="rounded-2xl p-5"
                    style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                    <h3 className="text-sm font-semibold text-white mb-4">Comparativo de Atendentes</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs mb-3" style={{ color: 'hsl(215 20% 50%)' }}>Vendas vs Custos vs Lucro</p>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={kpisPerAtendente} barSize={18}
                                    margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" vertical={false} />
                                    <XAxis dataKey="nome" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }}
                                        axisLine={false} tickLine={false}
                                        tickFormatter={v => v.split(' ')[0]} />
                                    <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }}
                                        axisLine={false} tickLine={false}
                                        tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        contentStyle={{ background: 'hsl(222 40% 12%)', border: '1px solid hsl(222 30% 20%)', borderRadius: '10px' }}
                                        labelStyle={{ color: 'hsl(215 20% 75%)', fontSize: 12 }}
                                        formatter={(v: number, name: string) => [brl(v), name === 'totalVendas' ? 'Vendas' : name === 'totalCusto' ? 'Custos' : 'Lucro']}
                                    />
                                    <Bar dataKey="totalVendas" fill="hsl(262 83% 60%)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="totalCusto"  fill="hsl(0 84% 55%)"   radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="lucro"       fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <p className="text-xs mb-3" style={{ color: 'hsl(215 20% 50%)' }}>Ranking por lucro</p>
                            <div className="space-y-3">
                                {[...kpisPerAtendente].sort((a, b) => b.lucro - a.lucro).map((a, i) => (
                                    <div key={a.id} className="flex items-center gap-3">
                                        <span className="text-xs font-bold w-5 text-center"
                                            style={{ color: i === 0 ? 'hsl(43 96% 56%)' : 'hsl(215 20% 45%)' }}>
                                            #{i + 1}
                                        </span>
                                        <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0"
                                            style={{ background: a.cor }}>
                                            {a.nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-white">{a.nome}</span>
                                                <span style={{ color: 'hsl(142 71% 55%)' }}>{brl(a.lucro)}</span>
                                            </div>
                                            <div className="h-1.5 rounded-full" style={{ background: 'hsl(222 40% 15%)' }}>
                                                <div className="h-full rounded-full"
                                                    style={{
                                                        width: `${Math.min((a.lucro / (Math.max(...kpisPerAtendente.map(x => x.lucro)) || 1)) * 100, 100)}%`,
                                                        background: a.cor,
                                                    }} />
                                            </div>
                                        </div>
                                        <span className="text-xs w-12 text-right" style={{ color: 'hsl(215 20% 50%)' }}>
                                            {a.margem.toFixed(1)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 rounded-xl overflow-hidden"
                                style={{ border: '1px solid hsl(222 30% 16%)' }}>
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr style={{ background: 'hsl(222 40% 8%)' }}>
                                            {['Atendente', 'Vendas', 'Custos', 'Lucro', 'Margem'].map(h => (
                                                <th key={h} className="px-3 py-2 text-left font-medium"
                                                    style={{ color: 'hsl(215 20% 50%)' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kpisPerAtendente.map(a => (
                                            <tr key={a.id} style={{ borderTop: '1px solid hsl(222 30% 14%)' }}>
                                                <td className="px-3 py-2 text-white">{a.nome.split(' ')[0]}</td>
                                                <td className="px-3 py-2" style={{ color: 'hsl(262 83% 75%)' }}>{brl(a.totalVendas)}</td>
                                                <td className="px-3 py-2" style={{ color: 'hsl(0 84% 60%)' }}>{brl(a.totalCusto)}</td>
                                                <td className="px-3 py-2" style={{ color: a.lucro >= 0 ? 'hsl(142 71% 55%)' : 'hsl(0 84% 60%)' }}>{brl(a.lucro)}</td>
                                                <td className="px-3 py-2" style={{ color: 'hsl(215 20% 65%)' }}>{a.margem.toFixed(1)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tabs + Filters + Table ──────────────── */}
            <div className="rounded-2xl overflow-hidden"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>

                <div className="flex items-center gap-1 px-4 pt-4 border-b overflow-x-auto"
                    style={{ borderColor: 'hsl(222 30% 16%)' }}>
                    {[{ id: 'all', label: 'Todos' }, ...atendentes.map(a => ({ id: a.id, label: a.nome.split(' ')[0] }))].map(tab => {
                        const active = selectedTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setSelectedTab(tab.id)}
                                className="px-3.5 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors"
                                style={{
                                    color: active ? 'hsl(262 83% 80%)' : 'hsl(215 20% 55%)',
                                    borderBottom: active ? '2px solid hsl(262 83% 66%)' : '2px solid transparent',
                                    marginBottom: '-1px',
                                }}>
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
                    <input
                        style={{ ...inp, width: 'auto', flex: 1, minWidth: '160px' }}
                        placeholder="Buscar produto ou atendente..."
                        value={search}
                        onChange={e => setSearch(e.target.value)} />
                    <div className="relative">
                        <select style={{ ...inp, width: 'auto', paddingRight: '32px', appearance: 'none' }}
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}>
                            <option value="all">Todos os status</option>
                            <option value="RECEBIDO">Recebido</option>
                            <option value="PENDENTE">Pendente</option>
                            <option value="CANCELADO">Cancelado</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'hsl(215 20% 55%)' }} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ background: 'hsl(222 40% 8%)', borderTop: '1px solid hsl(222 30% 14%)' }}>
                                {['Data', 'Atendente', 'Produto', 'Qtd', 'Preço Unit.', 'Custo Unit.', 'Total', 'Custo Total', 'Lucro', 'Status', ''].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-medium"
                                        style={{ color: 'hsl(215 20% 50%)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan={11} className="px-4 py-10 text-center text-sm"
                                        style={{ color: 'hsl(215 20% 45%)' }}>
                                        Nenhuma venda encontrada.
                                    </td>
                                </tr>
                            )}
                            {filteredSales.map(sale => {
                                const at = getAt(sale.atendenteId);
                                const ss = statusStyle[sale.status];
                                return (
                                    <tr key={sale.id}
                                        style={{ borderTop: '1px solid hsl(222 30% 13%)' }}
                                        className="transition-colors hover:bg-white/[0.02]">
                                        <td className="px-4 py-3 text-xs whitespace-nowrap"
                                            style={{ color: 'hsl(215 20% 55%)' }}>
                                            {sale.data.split('-').reverse().join('/')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold text-white shrink-0"
                                                    style={{ background: at?.cor ?? 'hsl(262 83% 60%)' }}>
                                                    {at?.nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?'}
                                                </div>
                                                <span className="text-xs text-white whitespace-nowrap">{at?.nome ?? '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-white max-w-[180px] truncate">{sale.produto}</td>
                                        <td className="px-4 py-3 text-xs text-white">{sale.quantidade}</td>
                                        <td className="px-4 py-3 text-xs text-white">{brl(sale.precoUnitario)}</td>
                                        <td className="px-4 py-3 text-xs" style={{ color: 'hsl(0 84% 60%)' }}>{brl(sale.custoUnitario)}</td>
                                        <td className="px-4 py-3 text-xs font-medium text-white">{brl(sale.total)}</td>
                                        <td className="px-4 py-3 text-xs" style={{ color: 'hsl(0 84% 60%)' }}>{brl(sale.totalCusto)}</td>
                                        <td className="px-4 py-3 text-xs font-semibold"
                                            style={{ color: sale.lucro >= 0 ? 'hsl(142 71% 55%)' : 'hsl(0 84% 60%)' }}>
                                            {brl(sale.lucro)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                                                style={{ background: ss.bg, color: ss.color }}>
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: ss.color }} />
                                                {statusLabel[sale.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => { setEditSale(sale); setShowSaleModal(true); }}
                                                    className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                                                    style={{ color: 'hsl(215 20% 55%)' }}>
                                                    <Pencil size={13} />
                                                </button>
                                                <button onClick={() => handleDeleteSale(sale.id)}
                                                    className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                                                    style={{ color: 'hsl(0 84% 60%)' }}>
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredSales.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 text-xs"
                        style={{ borderTop: '1px solid hsl(222 30% 14%)', color: 'hsl(215 20% 45%)' }}>
                        <span>{filteredSales.length} venda{filteredSales.length !== 1 ? 's' : ''}</span>
                        <span>
                            Total: <span className="text-white font-medium">
                                {brl(filteredSales.filter(s => s.status !== 'CANCELADO').reduce((a, s) => a + s.total, 0))}
                            </span>
                            {' · '}Lucro: <span style={{ color: 'hsl(142 71% 55%)' }} className="font-medium">
                                {brl(filteredSales.filter(s => s.status !== 'CANCELADO').reduce((a, s) => a + s.lucro, 0))}
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </div>

        {/* ── Modals ──────────────────────────────── */}
        {showSaleModal && (
            <SaleModal
                sale={editSale}
                atendentes={atendentes}
                onClose={() => { setShowSaleModal(false); setEditSale(undefined); }}
                onSave={handleSaveSale} />
        )}

        {showManage && (
            <ManagePanel
                atendentes={atendentes}
                salesCount={salesCount}
                onAdd={() => { setEditAtendente(undefined); setShowAtendenteModal(true); }}
                onEdit={a  => { setEditAtendente(a);         setShowAtendenteModal(true); }}
                onDelete={deleteAtendente}
                onClose={() => setShowManage(false)} />
        )}

        {showAtendenteModal && (
            <AtendenteModal
                atendente={editAtendente}
                onClose={() => { setShowAtendenteModal(false); setEditAtendente(undefined); }}
                onSave={handleSaveAtendente} />
        )}
        </>
    );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export default function AtendentesPage() {
    return (
        <AppLayout>
            <AtendentesContent />
        </AppLayout>
    );
}

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, TrendingDown, TrendingUp, Megaphone, Package, MoreHorizontal, ShoppingCart, Banknote } from 'lucide-react';
import { useApp, Platform, ExpenseStatus, RevenueStatus } from '@/context/AppContext';
import { toast } from 'sonner';

interface RecordModalProps {
    open: boolean;
    initialMode: 'expense' | 'revenue';
    onClose: () => void;
}

const platforms: Platform[] = ['TikTok', 'Facebook', 'Google', 'Instagram', 'YouTube'];
const expenseStatuses: ExpenseStatus[] = ['PAGO', 'PENDENTE', 'CANCELADO'];
const revenueStatuses: RevenueStatus[] = ['RECEBIDO', 'PENDENTE', 'CANCELADO'];
const otherCategories = ['Ferramentas', 'Logística', 'Pessoal', 'Infraestrutura', 'Marketing', 'Outros'] as const;
const revenueCategories = ['Parceria', 'Afiliado', 'Consultoria', 'Licenciamento', 'Outros'] as const;
const saleplatforms = ['TikTok', 'Facebook', 'Google', 'Instagram', 'YouTube', 'Shopify', 'Site'] as const;

// shared input/select styles
const inp = {
    background: 'hsl(222 40% 13%)',
    border: '1px solid hsl(222 30% 22%)',
    color: 'hsl(210 40% 90%)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
} as React.CSSProperties;

const label = (text: string) => (
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
        style={{ color: 'hsl(215 20% 50%)' }}>{text}</label>
);

// ── Ad Expense Form ──────────────────────────────────────────────────────────
function AdExpenseForm({ onSubmit }: { onSubmit: () => void }) {
    const { addExpense } = useApp();
    const today = new Date().toISOString().slice(0, 10);
    const [form, setForm] = useState({
        platform: 'TikTok' as Platform,
        campaign: '',
        amount: '',
        date: today,
        status: 'PAGO' as ExpenseStatus,
        notes: '',
    });
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.campaign || !form.amount) return toast.error('Preencha os campos obrigatórios');
        addExpense({ type: 'ad', platform: form.platform, campaign: form.campaign, amount: parseFloat(form.amount), date: form.date, status: form.status, notes: form.notes });
        toast.success(`Despesa de anúncio adicionada — R$ ${parseFloat(form.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    {label('Plataforma *')}
                    <select style={inp} value={form.platform} onChange={e => set('platform', e.target.value)} className="cursor-pointer">
                        {platforms.map(p => <option key={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    {label('Status')}
                    <select style={inp} value={form.status} onChange={e => set('status', e.target.value)} className="cursor-pointer">
                        {expenseStatuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div>
                {label('Nome da Campanha *')}
                <input style={inp} placeholder="Ex: Campanha UCG Whey — TOF" value={form.campaign} onChange={e => set('campaign', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    {label('Valor Investido (R$) *')}
                    <input style={inp} type="number" step="0.01" min="0" placeholder="0,00" value={form.amount} onChange={e => set('amount', e.target.value)} required />
                </div>
                <div>
                    {label('Data')}
                    <input style={inp} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                </div>
            </div>
            <div>
                {label('Observações')}
                <textarea style={{ ...inp, height: '72px', resize: 'none' }} placeholder="Notas sobre essa campanha..." value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                Salvar Despesa de Anúncio
            </button>
        </form>
    );
}

// ── Product Expense Form ─────────────────────────────────────────────────────
function ProductExpenseForm({ onSubmit }: { onSubmit: () => void }) {
    const { addExpense } = useApp();
    const today = new Date().toISOString().slice(0, 10);
    const [form, setForm] = useState({ product: '', quantity: '', unitCost: '', supplier: '', date: today, status: 'PAGO' as ExpenseStatus, notes: '' });
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
    const total = (parseFloat(form.quantity) || 0) * (parseFloat(form.unitCost) || 0);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.product || !form.quantity || !form.unitCost) return toast.error('Preencha os campos obrigatórios');
        addExpense({ type: 'product', product: form.product, quantity: parseFloat(form.quantity), unitCost: parseFloat(form.unitCost), supplier: form.supplier, date: form.date, status: form.status, notes: form.notes });
        toast.success(`Despesa de produto adicionada — R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                {label('Produto *')}
                <input style={inp} placeholder="Ex: Whey Protein 900g" value={form.product} onChange={e => set('product', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    {label('Quantidade *')}
                    <input style={inp} type="number" min="1" placeholder="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} required />
                </div>
                <div>
                    {label('Custo Unitário (R$) *')}
                    <input style={inp} type="number" step="0.01" min="0" placeholder="0,00" value={form.unitCost} onChange={e => set('unitCost', e.target.value)} required />
                </div>
            </div>
            {total > 0 && (
                <div className="rounded-lg px-4 py-3 text-sm font-semibold"
                    style={{ background: 'hsl(262 83% 15%)', color: 'hsl(262 83% 75%)', border: '1px solid hsl(262 83% 25%)' }}>
                    Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
            )}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    {label('Fornecedor')}
                    <input style={inp} placeholder="Ex: Distribuidor ABC" value={form.supplier} onChange={e => set('supplier', e.target.value)} />
                </div>
                <div>
                    {label('Data')}
                    <input style={inp} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    {label('Status')}
                    <select style={inp} value={form.status} onChange={e => set('status', e.target.value)} className="cursor-pointer">
                        {expenseStatuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    {label('Observações')}
                    <input style={inp} placeholder="Notas..." value={form.notes} onChange={e => set('notes', e.target.value)} />
                </div>
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                Salvar Despesa de Produto
            </button>
        </form>
    );
}

// ── Other Expense Form ───────────────────────────────────────────────────────
function OtherExpenseForm({ onSubmit }: { onSubmit: () => void }) {
    const { addExpense } = useApp();
    const today = new Date().toISOString().slice(0, 10);
    const [form, setForm] = useState({ description: '', category: 'Ferramentas' as typeof otherCategories[number], amount: '', date: today, status: 'PAGO' as ExpenseStatus, notes: '' });
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.description || !form.amount) return toast.error('Preencha os campos obrigatórios');
        addExpense({ type: 'other', description: form.description, category: form.category, amount: parseFloat(form.amount), date: form.date, status: form.status, notes: form.notes });
        toast.success(`Despesa adicionada — ${form.description}`);
        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                {label('Descrição *')}
                <input style={inp} placeholder="Ex: Shopify Plus — Plano mensal" value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    {label('Categoria')}
                    <select style={inp} value={form.category} onChange={e => set('category', e.target.value)} className="cursor-pointer">
                        {otherCategories.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    {label('Status')}
                    <select style={inp} value={form.status} onChange={e => set('status', e.target.value)} className="cursor-pointer">
                        {expenseStatuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    {label('Valor (R$) *')}
                    <input style={inp} type="number" step="0.01" min="0" placeholder="0,00" value={form.amount} onChange={e => set('amount', e.target.value)} required />
                </div>
                <div>
                    {label('Data')}
                    <input style={inp} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                </div>
            </div>
            <div>
                {label('Observações')}
                <textarea style={{ ...inp, height: '72px', resize: 'none' }} placeholder="Detalhes adicionais..." value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                Salvar Despesa
            </button>
        </form>
    );
}

// ── Product Sale Revenue Form ────────────────────────────────────────────────
const PRODUCT_NAME = 'Serum facial Lumielle';
const PRICE_OPTIONS = [
    { label: 'R$ 197,90 — Frasco único', value: 197.90 },
    { label: 'R$ 297,90 — Kit 2 frascos', value: 297.90 },
    { label: 'R$ 397,90 — Kit 3 frascos', value: 397.90 },
];

function ProductSaleForm({ onSubmit }: { onSubmit: () => void }) {
    const { addRevenue } = useApp();
    const today = new Date().toISOString().slice(0, 10);
    const [form, setForm] = useState({
        unitPrice: PRICE_OPTIONS[0].value,
        quantity: '1',
        date: today,
        platform: 'Shopify' as typeof saleplatforms[number],
        orderId: '',
        status: 'RECEBIDO' as RevenueStatus,
    });
    const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));
    const total = (parseFloat(String(form.quantity)) || 0) * form.unitPrice;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.quantity || form.unitPrice <= 0) return toast.error('Preencha os campos obrigatórios');
        addRevenue({
            type: 'product_sale',
            product: PRODUCT_NAME,
            quantity: parseFloat(form.quantity),
            unitPrice: form.unitPrice,
            total,
            date: form.date,
            platform: form.platform as Platform,
            orderId: form.orderId || `ORD-${Date.now()}`,
            status: form.status,
        });
        toast.success(`Venda registrada — R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fixed product display */}
            <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: 'hsl(262 83% 12%)', border: '1px solid hsl(262 83% 22%)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'hsl(262 83% 22%)' }}>
                    <span style={{ color: 'hsl(262 83% 75%)' }}>✦</span>
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{PRODUCT_NAME}</p>
                    <p className="text-xs" style={{ color: 'hsl(262 83% 65%)' }}>Produto fixo do catálogo</p>
                </div>
            </div>

            {/* Price options */}
            <div>
                {label('Opção de Preço *')}
                <div className="space-y-2">
                    {PRICE_OPTIONS.map(opt => (
                        <label key={opt.value}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all"
                            style={{
                                background: form.unitPrice === opt.value ? 'hsl(142 60% 10%)' : 'hsl(222 40% 13%)',
                                border: `1px solid ${form.unitPrice === opt.value ? 'hsl(142 60% 30%)' : 'hsl(222 30% 18%)'}`,
                            }}>
                            <input type="radio" name="price" className="sr-only"
                                checked={form.unitPrice === opt.value}
                                onChange={() => set('unitPrice', opt.value)} />
                            <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                                style={{ borderColor: form.unitPrice === opt.value ? 'hsl(142 71% 50%)' : 'hsl(215 20% 40%)' }}>
                                {form.unitPrice === opt.value && (
                                    <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(142 71% 50%)' }} />
                                )}
                            </span>
                            <span className="text-sm font-medium text-white">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    {label('Quantidade *')}
                    <input style={inp} type="number" min="1" placeholder="0"
                        value={form.quantity} onChange={e => set('quantity', e.target.value)} required />
                </div>
                <div>
                    {label('Data')}
                    <input style={inp} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                </div>
            </div>

            {total > 0 && (
                <div className="rounded-lg px-4 py-3 text-sm font-semibold"
                    style={{ background: 'hsl(142 71% 10%)', color: 'hsl(142 71% 55%)', border: '1px solid hsl(142 71% 20%)' }}>
                    Total da Venda: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <div>
                    {label('Plataforma')}
                    <select style={inp} value={form.platform} onChange={e => set('platform', e.target.value)} className="cursor-pointer">
                        {saleplatforms.map(p => <option key={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    {label('Status')}
                    <select style={inp} value={form.status} onChange={e => set('status', e.target.value)} className="cursor-pointer">
                        {revenueStatuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div>
                {label('ID do Pedido')}
                <input style={inp} placeholder="ORD-0000" value={form.orderId} onChange={e => set('orderId', e.target.value)} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, hsl(142 60% 35%), hsl(142 80% 28%))' }}>
                Salvar Venda de Produto
            </button>
        </form>
    );
}

// ── Other Revenue Form ───────────────────────────────────────────────────────
function OtherRevenueForm({ onSubmit }: { onSubmit: () => void }) {
    const { addRevenue } = useApp();
    const today = new Date().toISOString().slice(0, 10);
    const [form, setForm] = useState({ description: '', category: 'Parceria' as typeof revenueCategories[number], amount: '', date: today, status: 'RECEBIDO' as RevenueStatus, notes: '' });
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.description || !form.amount) return toast.error('Preencha os campos obrigatórios');
        addRevenue({ type: 'other_revenue', description: form.description, category: form.category, amount: parseFloat(form.amount), date: form.date, status: form.status, notes: form.notes });
        toast.success(`Receita adicionada — ${form.description}`);
        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                {label('Descrição *')}
                <input style={inp} placeholder="Ex: Parceria — Blog Fitness" value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    {label('Categoria')}
                    <select style={inp} value={form.category} onChange={e => set('category', e.target.value)} className="cursor-pointer">
                        {revenueCategories.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    {label('Status')}
                    <select style={inp} value={form.status} onChange={e => set('status', e.target.value)} className="cursor-pointer">
                        {revenueStatuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    {label('Valor (R$) *')}
                    <input style={inp} type="number" step="0.01" min="0" placeholder="0,00" value={form.amount} onChange={e => set('amount', e.target.value)} required />
                </div>
                <div>
                    {label('Data')}
                    <input style={inp} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                </div>
            </div>
            <div>
                {label('Observações')}
                <textarea style={{ ...inp, height: '72px', resize: 'none' }} placeholder="Detalhes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, hsl(142 60% 35%), hsl(142 80% 28%))' }}>
                Salvar Receita
            </button>
        </form>
    );
}

// ── Main Modal ───────────────────────────────────────────────────────────────
type Mode = 'expense' | 'revenue';
type ExpenseSubtype = 'ad' | 'product' | 'other';
type RevenueSubtype = 'product_sale' | 'other_revenue';

export default function RecordModal({ open, initialMode, onClose }: RecordModalProps) {
    const [mode, setMode] = useState<Mode>(initialMode);
    const [expSub, setExpSub] = useState<ExpenseSubtype>('ad');
    const [revSub, setRevSub] = useState<RevenueSubtype>('product_sale');
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMode(initialMode); }, [initialMode]);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    const expSubtypes: { key: ExpenseSubtype; label: string; icon: React.ReactNode; color: string }[] = [
        { key: 'ad', label: 'Anúncio', icon: <Megaphone size={15} />, color: 'hsl(38 92% 56%)' },
        { key: 'product', label: 'Produto', icon: <Package size={15} />, color: 'hsl(200 80% 55%)' },
        { key: 'other', label: 'Outros', icon: <MoreHorizontal size={15} />, color: 'hsl(262 83% 66%)' },
    ];

    const revSubtypes: { key: RevenueSubtype; label: string; icon: React.ReactNode; color: string }[] = [
        { key: 'product_sale', label: 'Venda de Produto', icon: <ShoppingCart size={15} />, color: 'hsl(142 71% 45%)' },
        { key: 'other_revenue', label: 'Outras Receitas', icon: <Banknote size={15} />, color: 'hsl(142 50% 55%)' },
    ];

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div className="w-full max-w-[520px] rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
                style={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(222 30% 18%)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid hsl(222 30% 15%)' }}>
                    <div className="flex gap-2">
                        <button onClick={() => setMode('expense')}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
                            style={mode === 'expense'
                                ? { background: 'hsl(0 70% 20%)', color: 'hsl(0 80% 70%)', border: '1px solid hsl(0 70% 30%)' }
                                : { color: 'hsl(215 20% 55%)', border: '1px solid transparent' }}>
                            <TrendingDown size={14} /> Despesa
                        </button>
                        <button onClick={() => setMode('revenue')}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
                            style={mode === 'revenue'
                                ? { background: 'hsl(142 60% 12%)', color: 'hsl(142 71% 55%)', border: '1px solid hsl(142 60% 25%)' }
                                : { color: 'hsl(215 20% 55%)', border: '1px solid transparent' }}>
                            <TrendingUp size={14} /> Receita
                        </button>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'hsl(215 20% 55%)' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Subtype selector */}
                <div className="px-6 pt-4">
                    {mode === 'expense' && (
                        <div className="flex gap-2 mb-4">
                            {expSubtypes.map(s => (
                                <button key={s.key} onClick={() => setExpSub(s.key)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all"
                                    style={expSub === s.key
                                        ? { background: 'hsl(222 40% 16%)', color: s.color, border: `1px solid ${s.color}40` }
                                        : { color: 'hsl(215 20% 50%)', border: '1px solid hsl(222 30% 16%)' }}>
                                    {s.icon} {s.label}
                                </button>
                            ))}
                        </div>
                    )}
                    {mode === 'revenue' && (
                        <div className="flex gap-2 mb-4">
                            {revSubtypes.map(s => (
                                <button key={s.key} onClick={() => setRevSub(s.key)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all"
                                    style={revSub === s.key
                                        ? { background: 'hsl(142 60% 10%)', color: s.color, border: `1px solid ${s.color}50` }
                                        : { color: 'hsl(215 20% 50%)', border: '1px solid hsl(222 30% 16%)' }}>
                                    {s.icon} {s.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Form content */}
                <div className="px-6 pb-6 overflow-y-auto flex-1">
                    {mode === 'expense' && expSub === 'ad' && <AdExpenseForm onSubmit={onClose} />}
                    {mode === 'expense' && expSub === 'product' && <ProductExpenseForm onSubmit={onClose} />}
                    {mode === 'expense' && expSub === 'other' && <OtherExpenseForm onSubmit={onClose} />}
                    {mode === 'revenue' && revSub === 'product_sale' && <ProductSaleForm onSubmit={onClose} />}
                    {mode === 'revenue' && revSub === 'other_revenue' && <OtherRevenueForm onSubmit={onClose} />}
                </div>
            </div>
        </div>
    );
}

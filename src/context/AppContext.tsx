'use client';
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Platform = 'TikTok' | 'Facebook' | 'Google' | 'Instagram' | 'YouTube';
export type ExpenseStatus = 'PAGO' | 'PENDENTE' | 'CANCELADO';
export type RevenueStatus = 'RECEBIDO' | 'PENDENTE' | 'CANCELADO';
export type CampaignStatus = 'ATIVA' | 'PAUSADA' | 'ENCERRADA' | 'RASCUNHO';

export interface AdExpense {
    id: string;
    type: 'ad';
    platform: Platform;
    campaign: string;
    amount: number;
    date: string;
    status: ExpenseStatus;
    notes: string;
}

export interface ProductExpense {
    id: string;
    type: 'product';
    product: string;
    quantity: number;
    unitCost: number;
    supplier: string;
    date: string;
    status: ExpenseStatus;
    notes: string;
}

export interface OtherExpense {
    id: string;
    type: 'other';
    description: string;
    category: 'Ferramentas' | 'Logística' | 'Pessoal' | 'Infraestrutura' | 'Marketing' | 'Outros';
    amount: number;
    date: string;
    status: ExpenseStatus;
    notes: string;
}

export type Expense = AdExpense | ProductExpense | OtherExpense;

export interface ProductRevenue {
    id: string;
    type: 'product_sale';
    product: string;
    quantity: number;
    unitPrice: number;
    total: number;
    date: string;
    platform: Platform | 'Shopify' | 'Site';
    orderId: string;
    status: RevenueStatus;
}

export interface OtherRevenue {
    id: string;
    type: 'other_revenue';
    description: string;
    category: 'Parceria' | 'Afiliado' | 'Consultoria' | 'Licenciamento' | 'Outros';
    amount: number;
    date: string;
    status: RevenueStatus;
    notes: string;
}

export type Revenue = ProductRevenue | OtherRevenue;

export interface Withdrawal {
    id: string;
    desc: string;
    destino: string;
    valor: number;
    data: string;
    status: 'CONCLUÍDO' | 'PENDENTE' | 'AGENDADO';
}

export interface Campaign {
    id: string;
    platform: Platform;
    name: string;
    budget: number;
    spend: number;
    impressions: number;
    clicks: number;
    orders: number;
    revenue: number;
    status: CampaignStatus;
    startDate: string;
}

export type ProductStatus = 'ATIVO' | 'INATIVO' | 'RASCUNHO';

export interface Product {
    id: string;
    sku: string;
    nome: string;
    categoria: string;
    catColor: string;
    custo: number;
    preco: number;
    estoque: number;
    estoqueMinimo: number;
    status: ProductStatus;
}

export type SaleStatus = 'RECEBIDO' | 'PENDENTE' | 'CANCELADO';

export interface AtendenteSale {
    id: string;
    atendenteId: string;
    produto: string;
    quantidade: number;
    precoUnitario: number;
    custoUnitario: number;
    total: number;
    totalCusto: number;
    lucro: number;
    data: string;
    status: SaleStatus;
    notas: string;
}

export interface Atendente {
    id: string;
    nome: string;
    cor: string;
}

// ─── localStorage helpers ────────────────────────────────────────────────────

const LS_KEYS = {
    expenses: 'opsdash_expenses',
    revenues: 'opsdash_revenues',
    withdrawals: 'opsdash_withdrawals',
    campaigns: 'opsdash_campaigns',
    atendenteSales: 'opsdash_atendenteSales',
    atendentes: 'opsdash_atendentes',
    products: 'opsdash_products',
    counters: 'opsdash_counters',
};

function lsGet<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function lsSet(key: string, value: unknown) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { /* quota exceeded — ignore */ }
}

function loadCounters() {
    return lsGet(LS_KEYS.counters, {
        expense: 1,
        revenue: 1,
        withdrawal: 1,
        campaign: 1,
        atendenteSale: 1,
        atendente: 1,
        product: 1,
    });
}

// ─── Context interface ───────────────────────────────────────────────────────

interface AppContextValue {
    expenses: Expense[];
    revenues: Revenue[];
    withdrawals: Withdrawal[];
    campaigns: Campaign[];
    atendenteSales: AtendenteSale[];
    atendentes: Atendente[];
    products: Product[];

    addProduct: (p: Omit<Product, 'id'>) => void;
    updateProduct: (id: string, p: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    clearProducts: () => void;

    addAtendente: (a: Omit<Atendente, 'id'>) => void;
    updateAtendente: (id: string, a: Partial<Atendente>) => void;
    deleteAtendente: (id: string) => void;

    addExpense: (e: Omit<Expense, 'id'>) => void;
    updateExpense: (id: string, e: Partial<Expense>) => void;
    deleteExpense: (id: string) => void;
    clearExpenses: () => void;

    addRevenue: (r: Omit<Revenue, 'id'>) => void;
    updateRevenue: (id: string, r: Partial<Revenue>) => void;
    deleteRevenue: (id: string) => void;
    clearRevenues: () => void;

    addWithdrawal: (w: Omit<Withdrawal, 'id'>) => void;
    updateWithdrawal: (id: string, patch: Partial<Withdrawal>) => void;
    deleteWithdrawal: (id: string) => void;
    clearWithdrawals: () => void;

    addCampaign: (c: Omit<Campaign, 'id'>) => void;
    updateCampaign: (id: string, c: Partial<Campaign>) => void;
    deleteCampaign: (id: string) => void;
    clearCampaigns: () => void;

    addAtendenteSale: (s: Omit<AtendenteSale, 'id'>) => void;
    updateAtendenteSale: (id: string, s: Partial<AtendenteSale>) => void;
    deleteAtendenteSale: (id: string) => void;
    clearAtendenteSales: () => void;

    clearAll: () => void;
    clearSeedData: () => void;

    kpis: {
        totalExpenses: number;
        totalRevenue: number;
        totalWithdrawals: number;
        netProfit: number;
        availableBalance: number;
        totalAdSpend: number;
        totalClicks: number;
        totalOrders: number;
        conversionRate: number;
        roas: number;
        activeCampaigns: number;
    };
}

const AppContext = createContext<AppContextValue | null>(null);

const pad = (n: number, prefix: string) => `${prefix}${String(n).padStart(3, '0')}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
    // ── State (initialised from localStorage) ───────────────────────────────
    const [expenses, setExpenses] = useState<Expense[]>(() => lsGet(LS_KEYS.expenses, []));
    const [revenues, setRevenues] = useState<Revenue[]>(() => lsGet(LS_KEYS.revenues, []));
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => lsGet(LS_KEYS.withdrawals, []));
    const [campaigns, setCampaigns] = useState<Campaign[]>(() => lsGet(LS_KEYS.campaigns, []));
    const [atendenteSales, setAtendenteSales] = useState<AtendenteSale[]>(() => lsGet(LS_KEYS.atendenteSales, []));
    const [atendentes, setAtendentes] = useState<Atendente[]>(() => lsGet(LS_KEYS.atendentes, []));
    const [products, setProducts] = useState<Product[]>(() => lsGet(LS_KEYS.products, []));

    // ── Counters (mutable ref persisted to localStorage) ────────────────────
    const counters = React.useRef(loadCounters());

    const saveCounters = () => lsSet(LS_KEYS.counters, counters.current);

    // ── Persist to localStorage on every change ──────────────────────────────
    useEffect(() => { lsSet(LS_KEYS.expenses, expenses); }, [expenses]);
    useEffect(() => { lsSet(LS_KEYS.revenues, revenues); }, [revenues]);
    useEffect(() => { lsSet(LS_KEYS.withdrawals, withdrawals); }, [withdrawals]);
    useEffect(() => { lsSet(LS_KEYS.campaigns, campaigns); }, [campaigns]);
    useEffect(() => { lsSet(LS_KEYS.atendenteSales, atendenteSales); }, [atendenteSales]);
    useEffect(() => { lsSet(LS_KEYS.atendentes, atendentes); }, [atendentes]);
    useEffect(() => { lsSet(LS_KEYS.products, products); }, [products]);

    // ── Expenses ─────────────────────────────────────────────────────────────
    const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
        const id = pad(counters.current.expense++, 'E');
        saveCounters();
        setExpenses(prev => [{ ...e, id } as Expense, ...prev]);
    }, []);

    const updateExpense = useCallback((id: string, patch: Partial<Expense>) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...patch } as Expense : e));
    }, []);

    const deleteExpense = useCallback((id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
    }, []);

    const clearExpenses = useCallback(() => { setExpenses([]); }, []);

    // ── Revenues ─────────────────────────────────────────────────────────────
    const addRevenue = useCallback((r: Omit<Revenue, 'id'>) => {
        const id = pad(counters.current.revenue++, 'R');
        saveCounters();
        setRevenues(prev => [{ ...r, id } as Revenue, ...prev]);
    }, []);

    const updateRevenue = useCallback((id: string, patch: Partial<Revenue>) => {
        setRevenues(prev => prev.map(r => r.id === id ? { ...r, ...patch } as Revenue : r));
    }, []);

    const deleteRevenue = useCallback((id: string) => {
        setRevenues(prev => prev.filter(r => r.id !== id));
    }, []);

    const clearRevenues = useCallback(() => { setRevenues([]); }, []);

    // ── Withdrawals ───────────────────────────────────────────────────────────
    const addWithdrawal = useCallback((w: Omit<Withdrawal, 'id'>) => {
        const id = pad(counters.current.withdrawal++, 'S');
        saveCounters();
        setWithdrawals(prev => [{ ...w, id }, ...prev]);
    }, []);

    const updateWithdrawal = useCallback((id: string, patch: Partial<Withdrawal>) => {
        setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, ...patch } : w));
    }, []);

    const deleteWithdrawal = useCallback((id: string) => {
        setWithdrawals(prev => prev.filter(w => w.id !== id));
    }, []);

    const clearWithdrawals = useCallback(() => { setWithdrawals([]); }, []);

    // ── Campaigns ─────────────────────────────────────────────────────────────
    const addCampaign = useCallback((c: Omit<Campaign, 'id'>) => {
        const id = pad(counters.current.campaign++, 'C');
        saveCounters();
        setCampaigns(prev => [{ ...c, id }, ...prev]);
    }, []);

    const updateCampaign = useCallback((id: string, patch: Partial<Campaign>) => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    }, []);

    const deleteCampaign = useCallback((id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
    }, []);

    const clearCampaigns = useCallback(() => { setCampaigns([]); }, []);

    // ── Products ──────────────────────────────────────────────────────────────
    const addProduct = useCallback((p: Omit<Product, 'id'>) => {
        const id = pad(counters.current.product++, 'P');
        saveCounters();
        setProducts(prev => [{ ...p, id }, ...prev]);
    }, []);

    const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
    }, []);

    const deleteProduct = useCallback((id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    }, []);

    const clearProducts = useCallback(() => { setProducts([]); }, []);

    // ── Atendentes ────────────────────────────────────────────────────────────
    const addAtendente = useCallback((a: Omit<Atendente, 'id'>) => {
        const id = `A${counters.current.atendente++}`;
        saveCounters();
        setAtendentes(prev => [...prev, { ...a, id }]);
    }, []);

    const updateAtendente = useCallback((id: string, patch: Partial<Atendente>) => {
        setAtendentes(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
    }, []);

    const deleteAtendente = useCallback((id: string) => {
        setAtendentes(prev => prev.filter(a => a.id !== id));
    }, []);

    // ── Atendente Sales ───────────────────────────────────────────────────────
    const addAtendenteSale = useCallback((s: Omit<AtendenteSale, 'id'>) => {
        const id = pad(counters.current.atendenteSale++, 'AT');
        saveCounters();
        setAtendenteSales(prev => [{ ...s, id }, ...prev]);
    }, []);

    const updateAtendenteSale = useCallback((id: string, patch: Partial<AtendenteSale>) => {
        setAtendenteSales(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
    }, []);

    const deleteAtendenteSale = useCallback((id: string) => {
        setAtendenteSales(prev => prev.filter(s => s.id !== id));
    }, []);

    const clearAtendenteSales = useCallback(() => { setAtendenteSales([]); }, []);

    // ── Global clear ──────────────────────────────────────────────────────────
    const clearAll = useCallback(() => {
        setExpenses([]);
        setRevenues([]);
        setWithdrawals([]);
        setCampaigns([]);
        setAtendenteSales([]);
        setAtendentes([]);
        setProducts([]);
        const fresh = { expense: 1, revenue: 1, withdrawal: 1, campaign: 1, atendenteSale: 1, atendente: 1, product: 1 };
        counters.current = fresh;
        lsSet(LS_KEYS.counters, fresh);
    }, []);

    // Legacy: clearSeedData (no-op now that seeds are empty — kept for settings page compat)
    const clearSeedData = clearAll;

    // ── KPIs ──────────────────────────────────────────────────────────────────
    const kpis = useMemo(() => {
        const totalExpenses = expenses
            .filter(e => e.status !== 'CANCELADO')
            .reduce((acc, e) => {
                if (e.type === 'ad') return acc + e.amount;
                if (e.type === 'product') return acc + e.quantity * e.unitCost;
                return acc + (e as OtherExpense).amount;
            }, 0);

        const totalRevenue = revenues
            .filter(r => r.status !== 'CANCELADO')
            .reduce((acc, r) => {
                if (r.type === 'product_sale') return acc + r.total;
                return acc + (r as OtherRevenue).amount;
            }, 0);

        const totalWithdrawals = withdrawals
            .filter(w => w.status === 'CONCLUÍDO')
            .reduce((acc, w) => acc + w.valor, 0);

        const netProfit = totalRevenue - totalExpenses;
        const availableBalance = netProfit - totalWithdrawals;

        const totalAdSpend = expenses
            .filter(e => e.type === 'ad' && e.status !== 'CANCELADO')
            .reduce((acc, e) => acc + (e as AdExpense).amount, 0);

        const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
        const totalOrders = campaigns.reduce((acc, c) => acc + c.orders, 0);
        const conversionRate = totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0;
        const roas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;
        const activeCampaigns = campaigns.filter(c => c.status === 'ATIVA').length;

        return {
            totalExpenses, totalRevenue, totalWithdrawals,
            netProfit, availableBalance, totalAdSpend,
            totalClicks, totalOrders, conversionRate, roas, activeCampaigns,
        };
    }, [expenses, revenues, withdrawals, campaigns]);

    return (
        <AppContext.Provider value={{
            expenses, revenues, withdrawals, campaigns, atendenteSales, atendentes, products,
            addProduct, updateProduct, deleteProduct, clearProducts,
            addExpense, updateExpense, deleteExpense, clearExpenses,
            addRevenue, updateRevenue, deleteRevenue, clearRevenues,
            addWithdrawal, updateWithdrawal, deleteWithdrawal, clearWithdrawals,
            addCampaign, updateCampaign, deleteCampaign, clearCampaigns,
            addAtendenteSale, updateAtendenteSale, deleteAtendenteSale, clearAtendenteSales,
            addAtendente, updateAtendente, deleteAtendente,
            clearAll, clearSeedData,
            kpis,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}

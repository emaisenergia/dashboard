'use client';
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

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

export const SEED_ATENDENTES: Atendente[] = [];

// ─── Initial seed data ───────────────────────────────────────────────────────

const seedExpenses: Expense[] = [];

const seedRevenues: Revenue[] = [];

const seedWithdrawals: Withdrawal[] = [];

const seedAtendenteSales: AtendenteSale[] = [];

const seedCampaigns: Campaign[] = [];

// ─── Context ─────────────────────────────────────────────────────────────────

// IDs that belong to seed/demo data — used to identify what to clear
const SEED_EXPENSE_IDS = new Set(seedExpenses.map(e => e.id));
const SEED_REVENUE_IDS = new Set(seedRevenues.map(r => r.id));
const SEED_WITHDRAWAL_IDS = new Set(seedWithdrawals.map(w => w.id));
const SEED_CAMPAIGN_IDS = new Set(seedCampaigns.map(c => c.id));
const SEED_ATENDENTE_SALE_IDS = new Set(seedAtendenteSales.map(s => s.id));

interface AppContextValue {
    expenses: Expense[];
    revenues: Revenue[];
    withdrawals: Withdrawal[];
    campaigns: Campaign[];
    atendenteSales: AtendenteSale[];
    atendentes: Atendente[];
    addAtendente: (a: Omit<Atendente, 'id'>) => void;
    updateAtendente: (id: string, a: Partial<Atendente>) => void;
    deleteAtendente: (id: string) => void;
    addExpense: (e: Omit<Expense, 'id'>) => void;
    updateExpense: (id: string, e: Partial<Expense>) => void;
    deleteExpense: (id: string) => void;
    addRevenue: (r: Omit<Revenue, 'id'>) => void;
    updateRevenue: (id: string, r: Partial<Revenue>) => void;
    deleteRevenue: (id: string) => void;
    addWithdrawal: (w: Omit<Withdrawal, 'id'>) => void;
    deleteWithdrawal: (id: string) => void;
    addCampaign: (c: Omit<Campaign, 'id'>) => void;
    updateCampaign: (id: string, c: Partial<Campaign>) => void;
    deleteCampaign: (id: string) => void;
    addAtendenteSale: (s: Omit<AtendenteSale, 'id'>) => void;
    updateAtendenteSale: (id: string, s: Partial<AtendenteSale>) => void;
    deleteAtendenteSale: (id: string) => void;
    clearSeedData: () => void;
    // Computed KPIs
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

let expenseCounter = 1;
let revenueCounter = 1;
let withdrawalCounter = 1;
let campaignCounter = 1;
let atendenteSaleCounter = 1;
let atendenteCounter = 1;

const pad = (n: number, prefix: string) => `${prefix}${String(n).padStart(3, '0')}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [expenses, setExpenses] = useState<Expense[]>(seedExpenses);
    const [revenues, setRevenues] = useState<Revenue[]>(seedRevenues);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(seedWithdrawals);
    const [campaigns, setCampaigns] = useState<Campaign[]>(seedCampaigns);
    const [atendenteSales, setAtendenteSales] = useState<AtendenteSale[]>(seedAtendenteSales);
    const [atendentes, setAtendentes] = useState<Atendente[]>(SEED_ATENDENTES);

    const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
        const id = pad(expenseCounter++, 'E');
        setExpenses(prev => [{ ...e, id } as Expense, ...prev]);
    }, []);

    const updateExpense = useCallback((id: string, patch: Partial<Expense>) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...patch } as Expense : e));
    }, []);

    const deleteExpense = useCallback((id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
    }, []);

    const addRevenue = useCallback((r: Omit<Revenue, 'id'>) => {
        const id = pad(revenueCounter++, 'R');
        setRevenues(prev => [{ ...r, id } as Revenue, ...prev]);
    }, []);

    const updateRevenue = useCallback((id: string, patch: Partial<Revenue>) => {
        setRevenues(prev => prev.map(r => r.id === id ? { ...r, ...patch } as Revenue : r));
    }, []);

    const deleteRevenue = useCallback((id: string) => {
        setRevenues(prev => prev.filter(r => r.id !== id));
    }, []);

    const addWithdrawal = useCallback((w: Omit<Withdrawal, 'id'>) => {
        const id = pad(withdrawalCounter++, 'S');
        setWithdrawals(prev => [{ ...w, id }, ...prev]);
    }, []);

    const deleteWithdrawal = useCallback((id: string) => {
        setWithdrawals(prev => prev.filter(w => w.id !== id));
    }, []);

    const addCampaign = useCallback((c: Omit<Campaign, 'id'>) => {
        const id = pad(campaignCounter++, 'C');
        setCampaigns(prev => [{ ...c, id }, ...prev]);
    }, []);

    const updateCampaign = useCallback((id: string, patch: Partial<Campaign>) => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    }, []);

    const deleteCampaign = useCallback((id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
    }, []);

    const addAtendente = useCallback((a: Omit<Atendente, 'id'>) => {
        const id = `A${atendenteCounter++}`;
        setAtendentes(prev => [...prev, { ...a, id }]);
    }, []);

    const updateAtendente = useCallback((id: string, patch: Partial<Atendente>) => {
        setAtendentes(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
    }, []);

    const deleteAtendente = useCallback((id: string) => {
        setAtendentes(prev => prev.filter(a => a.id !== id));
    }, []);

    const addAtendenteSale = useCallback((s: Omit<AtendenteSale, 'id'>) => {
        const id = pad(atendenteSaleCounter++, 'AT');
        setAtendenteSales(prev => [{ ...s, id }, ...prev]);
    }, []);

    const updateAtendenteSale = useCallback((id: string, patch: Partial<AtendenteSale>) => {
        setAtendenteSales(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
    }, []);

    const deleteAtendenteSale = useCallback((id: string) => {
        setAtendenteSales(prev => prev.filter(s => s.id !== id));
    }, []);

    const clearSeedData = useCallback(() => {
        setExpenses(prev => prev.filter(e => !SEED_EXPENSE_IDS.has(e.id)));
        setRevenues(prev => prev.filter(r => !SEED_REVENUE_IDS.has(r.id)));
        setWithdrawals(prev => prev.filter(w => !SEED_WITHDRAWAL_IDS.has(w.id)));
        setCampaigns(prev => prev.filter(c => !SEED_CAMPAIGN_IDS.has(c.id)));
        setAtendenteSales(prev => prev.filter(s => !SEED_ATENDENTE_SALE_IDS.has(s.id)));
    }, []);

    const kpis = useMemo(() => {
        const totalExpenses = expenses
            .filter(e => e.status !== 'CANCELADO')
            .reduce((acc, e) => {
                if (e.type === 'ad') return acc + e.amount;
                if (e.type === 'product') return acc + e.quantity * e.unitCost;
                return acc + e.amount;
            }, 0);

        const totalRevenue = revenues
            .filter(r => r.status !== 'CANCELADO')
            .reduce((acc, r) => {
                if (r.type === 'product_sale') return acc + r.total;
                return acc + r.amount;
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
            totalExpenses,
            totalRevenue,
            totalWithdrawals,
            netProfit,
            availableBalance,
            totalAdSpend,
            totalClicks,
            totalOrders,
            conversionRate,
            roas,
            activeCampaigns,
        };
    }, [expenses, revenues, withdrawals, campaigns]);

    return (
        <AppContext.Provider value={{
            expenses, revenues, withdrawals, campaigns, atendenteSales, atendentes,
            addExpense, updateExpense, deleteExpense,
            addRevenue, updateRevenue, deleteRevenue,
            addWithdrawal, deleteWithdrawal,
            addCampaign, updateCampaign, deleteCampaign,
            addAtendenteSale, updateAtendenteSale, deleteAtendenteSale,
            addAtendente, updateAtendente, deleteAtendente,
            clearSeedData,
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

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

export const SEED_ATENDENTES: Atendente[] = [
    { id: 'A1', nome: 'Ana Silva',      cor: 'hsl(262 83% 66%)' },
    { id: 'A2', nome: 'Bruno Costa',    cor: 'hsl(142 71% 45%)' },
    { id: 'A3', nome: 'Carla Mendes',   cor: 'hsl(43 96% 56%)'  },
    { id: 'A4', nome: 'Diego Santos',   cor: 'hsl(200 83% 55%)' },
];

// ─── Initial seed data ───────────────────────────────────────────────────────

const seedExpenses: Expense[] = [
    { id: 'E001', type: 'ad', platform: 'TikTok', campaign: 'Campanha UCG Março', amount: 48200, date: '2026-03-01', status: 'PAGO', notes: 'Campanha UCG e prosp...' },
    { id: 'E002', type: 'ad', platform: 'Facebook', campaign: 'Remarketing Lookalike', amount: 32400, date: '2026-03-01', status: 'PAGO', notes: 'Remarketing e lookalike' },
    { id: 'E003', type: 'other', description: 'Shopify Plus — Plano mensal', category: 'Ferramentas', amount: 2890, date: '2026-03-05', status: 'PAGO', notes: '' },
    { id: 'E004', type: 'other', description: 'Freelancer — Criação de criativos', category: 'Marketing', amount: 4500, date: '2026-03-08', status: 'PAGO', notes: '15 vídeos UGC' },
    { id: 'E005', type: 'other', description: 'Frete e logística — Jadlog', category: 'Logística', amount: 18700, date: '2026-03-10', status: 'PAGO', notes: 'Contrato mensal' },
    { id: 'E006', type: 'other', description: 'Salário — Gestor de tráfego', category: 'Pessoal', amount: 6800, date: '2026-03-10', status: 'PAGO', notes: 'CLT' },
    { id: 'E007', type: 'other', description: 'Servidor AWS + CDN', category: 'Infraestrutura', amount: 1240, date: '2026-03-12', status: 'PAGO', notes: '' },
    { id: 'E008', type: 'other', description: 'Klarna — Email marketing', category: 'Ferramentas', amount: 800, date: '2026-03-15', status: 'PENDENTE', notes: 'Cobrança automática' },
    { id: 'E009', type: 'other', description: 'Influencer — @modafit', category: 'Marketing', amount: 12000, date: '2026-03-18', status: 'PAGO', notes: 'Contrato 3 posts' },
    { id: 'E010', type: 'other', description: 'Embalagens personalizadas', category: 'Logística', amount: 7800, date: '2026-03-20', status: 'PENDENTE', notes: '2.000 unidades' },
];

const seedRevenues: Revenue[] = [
    // Semana 1
    { id: 'R001', type: 'product_sale', product: 'Whey Protein 900g — Banana', quantity: 142, unitPrice: 189.90, total: 26965.80, date: '2026-03-01', platform: 'TikTok', orderId: 'ORD-0001', status: 'RECEBIDO' },
    { id: 'R002', type: 'product_sale', product: 'Creatina Monoidratada 300g', quantity: 98, unitPrice: 149.90, total: 14690.20, date: '2026-03-02', platform: 'TikTok', orderId: 'ORD-0045', status: 'RECEBIDO' },
    { id: 'R003', type: 'product_sale', product: 'Kit Suplemento Starter', quantity: 67, unitPrice: 297.00, total: 19899.00, date: '2026-03-03', platform: 'Facebook', orderId: 'ORD-0089', status: 'RECEBIDO' },
    { id: 'R004', type: 'product_sale', product: 'Whey Protein 900g — Chocolate', quantity: 89, unitPrice: 189.90, total: 16900.10, date: '2026-03-04', platform: 'Facebook', orderId: 'ORD-0134', status: 'RECEBIDO' },
    { id: 'R005', type: 'product_sale', product: 'Pré-Treino Energy Burst 300g', quantity: 54, unitPrice: 169.90, total: 9174.60, date: '2026-03-05', platform: 'Shopify', orderId: 'ORD-0178', status: 'RECEBIDO' },
    { id: 'R006', type: 'product_sale', product: 'Colágeno + Vitamina C 60 Caps', quantity: 71, unitPrice: 54.90, total: 3897.90, date: '2026-03-05', platform: 'TikTok', orderId: 'ORD-0210', status: 'RECEBIDO' },
    // Semana 2
    { id: 'R007', type: 'product_sale', product: 'Ômega 3 1000mg 120 Cáps', quantity: 87, unitPrice: 79.90, total: 6951.30, date: '2026-03-08', platform: 'Site', orderId: 'ORD-0245', status: 'RECEBIDO' },
    { id: 'R008', type: 'product_sale', product: 'BCAA 2:1:1 300g', quantity: 65, unitPrice: 119.90, total: 7793.50, date: '2026-03-09', platform: 'Facebook', orderId: 'ORD-0278', status: 'RECEBIDO' },
    { id: 'R009', type: 'product_sale', product: 'Kit Suplemento Starter', quantity: 58, unitPrice: 297.00, total: 17226.00, date: '2026-03-10', platform: 'TikTok', orderId: 'ORD-0312', status: 'RECEBIDO' },
    { id: 'R010', type: 'product_sale', product: 'Whey Protein 900g — Banana', quantity: 118, unitPrice: 189.90, total: 22408.20, date: '2026-03-11', platform: 'TikTok', orderId: 'ORD-0345', status: 'RECEBIDO' },
    { id: 'R011', type: 'product_sale', product: 'Creatina Monoidratada 300g', quantity: 74, unitPrice: 149.90, total: 11092.60, date: '2026-03-12', platform: 'Facebook', orderId: 'ORD-0389', status: 'RECEBIDO' },
    { id: 'R012', type: 'other_revenue', description: 'Parceria — Blog Fitness Total', category: 'Parceria', amount: 3500, date: '2026-03-12', status: 'RECEBIDO', notes: 'Post patrocinado' },
    // Semana 3
    { id: 'R013', type: 'product_sale', product: 'Pré-Treino Energy Burst 300g', quantity: 61, unitPrice: 169.90, total: 10363.90, date: '2026-03-14', platform: 'Facebook', orderId: 'ORD-0420', status: 'RECEBIDO' },
    { id: 'R014', type: 'product_sale', product: 'Whey Protein 900g — Chocolate', quantity: 96, unitPrice: 189.90, total: 18230.40, date: '2026-03-15', platform: 'TikTok', orderId: 'ORD-0456', status: 'RECEBIDO' },
    { id: 'R015', type: 'product_sale', product: 'Kit Suplemento Starter', quantity: 44, unitPrice: 297.00, total: 13068.00, date: '2026-03-16', platform: 'Shopify', orderId: 'ORD-0489', status: 'RECEBIDO' },
    { id: 'R016', type: 'product_sale', product: 'Ômega 3 1000mg 120 Cáps', quantity: 93, unitPrice: 79.90, total: 7430.70, date: '2026-03-17', platform: 'Site', orderId: 'ORD-0512', status: 'RECEBIDO' },
    { id: 'R017', type: 'product_sale', product: 'Colágeno + Vitamina C 60 Caps', quantity: 82, unitPrice: 54.90, total: 4501.80, date: '2026-03-17', platform: 'Facebook', orderId: 'ORD-0534', status: 'RECEBIDO' },
    { id: 'R018', type: 'other_revenue', description: 'Afiliado — Programa Nutri+', category: 'Afiliado', amount: 2800, date: '2026-03-18', status: 'RECEBIDO', notes: 'Comissão mensal' },
    // Semana 4
    { id: 'R019', type: 'product_sale', product: 'Whey Protein 900g — Banana', quantity: 127, unitPrice: 189.90, total: 24117.30, date: '2026-03-19', platform: 'TikTok', orderId: 'ORD-0560', status: 'RECEBIDO' },
    { id: 'R020', type: 'product_sale', product: 'Creatina Monoidratada 300g', quantity: 88, unitPrice: 149.90, total: 13191.20, date: '2026-03-19', platform: 'Facebook', orderId: 'ORD-0589', status: 'RECEBIDO' },
    { id: 'R021', type: 'product_sale', product: 'BCAA 2:1:1 300g', quantity: 55, unitPrice: 119.90, total: 6594.50, date: '2026-03-20', platform: 'TikTok', orderId: 'ORD-0612', status: 'RECEBIDO' },
    { id: 'R022', type: 'product_sale', product: 'Pré-Treino Energy Burst 300g', quantity: 52, unitPrice: 169.90, total: 8834.80, date: '2026-03-20', platform: 'Shopify', orderId: 'ORD-0634', status: 'PENDENTE' },
    { id: 'R023', type: 'product_sale', product: 'Vitamina D3 2000UI 60 Caps', quantity: 110, unitPrice: 34.90, total: 3839.00, date: '2026-03-20', platform: 'Site', orderId: 'ORD-0656', status: 'PENDENTE' },
];

const seedWithdrawals: Withdrawal[] = [
    { id: 'S001', desc: 'Saque — Lucro março semana 1', destino: 'Conta pessoal Marcos', valor: 20000, data: '07/03/2026', status: 'CONCLUÍDO' },
    { id: 'S002', desc: 'Saque — Reserva tributária', destino: 'Conta empresarial', valor: 15000, data: '10/03/2026', status: 'CONCLUÍDO' },
    { id: 'S003', desc: 'Saque — Lucro março semana 2', destino: 'Conta pessoal Marcos', valor: 25000, data: '14/03/2026', status: 'CONCLUÍDO' },
    { id: 'S004', desc: 'Saque — Fundo de emergência', destino: 'Poupança empresarial', valor: 10000, data: '18/03/2026', status: 'CONCLUÍDO' },
    { id: 'S005', desc: 'Saque — Lucro março semana 3', destino: 'Conta pessoal Marcos', valor: 20000, data: '21/03/2026', status: 'PENDENTE' },
    { id: 'S006', desc: 'Saque — Distribuição sócios', destino: 'Múltiplas contas', valor: 30000, data: '28/03/2026', status: 'AGENDADO' },
];

const seedAtendenteSales: AtendenteSale[] = [
    { id: 'AT001', atendenteId: 'A1', produto: 'Whey Protein 900g — Banana',      quantidade: 12, precoUnitario: 189.90, custoUnitario: 90.00, total: 2278.80, totalCusto: 1080.00, lucro: 1198.80, data: '2026-03-03', status: 'RECEBIDO', notas: '' },
    { id: 'AT002', atendenteId: 'A2', produto: 'Creatina Monoidratada 300g',       quantidade: 8,  precoUnitario: 149.90, custoUnitario: 60.00, total: 1199.20, totalCusto: 480.00,  lucro: 719.20,  data: '2026-03-03', status: 'RECEBIDO', notas: '' },
    { id: 'AT003', atendenteId: 'A3', produto: 'Kit Suplemento Starter',           quantidade: 5,  precoUnitario: 297.00, custoUnitario: 130.00,total: 1485.00, totalCusto: 650.00,  lucro: 835.00,  data: '2026-03-04', status: 'RECEBIDO', notas: '' },
    { id: 'AT004', atendenteId: 'A4', produto: 'Pré-Treino Energy Burst 300g',     quantidade: 10, precoUnitario: 169.90, custoUnitario: 70.00, total: 1699.00, totalCusto: 700.00,  lucro: 999.00,  data: '2026-03-04', status: 'RECEBIDO', notas: '' },
    { id: 'AT005', atendenteId: 'A1', produto: 'BCAA 2:1:1 300g',                  quantidade: 7,  precoUnitario: 119.90, custoUnitario: 50.00, total: 839.30,  totalCusto: 350.00,  lucro: 489.30,  data: '2026-03-07', status: 'RECEBIDO', notas: '' },
    { id: 'AT006', atendenteId: 'A2', produto: 'Colágeno + Vitamina C 60 Caps',    quantidade: 15, precoUnitario: 54.90,  custoUnitario: 20.00, total: 823.50,  totalCusto: 300.00,  lucro: 523.50,  data: '2026-03-08', status: 'RECEBIDO', notas: '' },
    { id: 'AT007', atendenteId: 'A3', produto: 'Whey Protein 900g — Chocolate',    quantidade: 9,  precoUnitario: 189.90, custoUnitario: 90.00, total: 1709.10, totalCusto: 810.00,  lucro: 899.10,  data: '2026-03-10', status: 'RECEBIDO', notas: '' },
    { id: 'AT008', atendenteId: 'A4', produto: 'Vitamina D3 2000UI 60 Caps',       quantidade: 20, precoUnitario: 34.90,  custoUnitario: 12.00, total: 698.00,  totalCusto: 240.00,  lucro: 458.00,  data: '2026-03-10', status: 'RECEBIDO', notas: '' },
    { id: 'AT009', atendenteId: 'A1', produto: 'Kit Suplemento Starter',           quantidade: 4,  precoUnitario: 297.00, custoUnitario: 130.00,total: 1188.00, totalCusto: 520.00,  lucro: 668.00,  data: '2026-03-12', status: 'RECEBIDO', notas: 'Cliente retorno' },
    { id: 'AT010', atendenteId: 'A2', produto: 'Ômega 3 1000mg 120 Cáps',          quantidade: 11, precoUnitario: 79.90,  custoUnitario: 30.00, total: 878.90,  totalCusto: 330.00,  lucro: 548.90,  data: '2026-03-13', status: 'RECEBIDO', notas: '' },
    { id: 'AT011', atendenteId: 'A3', produto: 'Creatina Monoidratada 300g',       quantidade: 6,  precoUnitario: 149.90, custoUnitario: 60.00, total: 899.40,  totalCusto: 360.00,  lucro: 539.40,  data: '2026-03-14', status: 'RECEBIDO', notas: '' },
    { id: 'AT012', atendenteId: 'A4', produto: 'BCAA 2:1:1 300g',                  quantidade: 8,  precoUnitario: 119.90, custoUnitario: 50.00, total: 959.20,  totalCusto: 400.00,  lucro: 559.20,  data: '2026-03-15', status: 'RECEBIDO', notas: '' },
    { id: 'AT013', atendenteId: 'A1', produto: 'Pré-Treino Energy Burst 300g',     quantidade: 6,  precoUnitario: 169.90, custoUnitario: 70.00, total: 1019.40, totalCusto: 420.00,  lucro: 599.40,  data: '2026-03-17', status: 'RECEBIDO', notas: '' },
    { id: 'AT014', atendenteId: 'A2', produto: 'Whey Protein 900g — Banana',      quantidade: 14, precoUnitario: 189.90, custoUnitario: 90.00, total: 2658.60, totalCusto: 1260.00, lucro: 1398.60, data: '2026-03-18', status: 'RECEBIDO', notas: 'Venda em grupo' },
    { id: 'AT015', atendenteId: 'A3', produto: 'Colágeno + Vitamina C 60 Caps',    quantidade: 18, precoUnitario: 54.90,  custoUnitario: 20.00, total: 988.20,  totalCusto: 360.00,  lucro: 628.20,  data: '2026-03-19', status: 'RECEBIDO', notas: '' },
    { id: 'AT016', atendenteId: 'A4', produto: 'Kit Suplemento Starter',           quantidade: 3,  precoUnitario: 297.00, custoUnitario: 130.00,total: 891.00,  totalCusto: 390.00,  lucro: 501.00,  data: '2026-03-19', status: 'PENDENTE', notas: '' },
    { id: 'AT017', atendenteId: 'A1', produto: 'Vitamina D3 2000UI 60 Caps',       quantidade: 16, precoUnitario: 34.90,  custoUnitario: 12.00, total: 558.40,  totalCusto: 192.00,  lucro: 366.40,  data: '2026-03-20', status: 'RECEBIDO', notas: '' },
    { id: 'AT018', atendenteId: 'A2', produto: 'Pré-Treino Energy Burst 300g',     quantidade: 9,  precoUnitario: 169.90, custoUnitario: 70.00, total: 1529.10, totalCusto: 630.00,  lucro: 899.10,  data: '2026-03-20', status: 'PENDENTE', notas: 'Aguardando confirmação' },
];

const seedCampaigns: Campaign[] = [
    { id: 'C001', platform: 'TikTok', name: 'UCG Whey Banana - TOF', budget: 15000, spend: 12400, impressions: 1240000, clicks: 38200, orders: 412, revenue: 78218.80, status: 'ATIVA', startDate: '2026-03-01' },
    { id: 'C002', platform: 'TikTok', name: 'Creatina - Remarketing', budget: 8000, spend: 7200, impressions: 620000, clicks: 18600, orders: 298, revenue: 44690.20, status: 'ATIVA', startDate: '2026-03-01' },
    { id: 'C003', platform: 'TikTok', name: 'Kit Starter - Conversão', budget: 10000, spend: 9800, impressions: 980000, clicks: 28000, orders: 231, revenue: 68607.00, status: 'ATIVA', startDate: '2026-03-05' },
    { id: 'C004', platform: 'Facebook', name: 'Remarketing - Carrinho', budget: 6000, spend: 5800, impressions: 480000, clicks: 14200, orders: 187, revenue: 35442.70, status: 'ATIVA', startDate: '2026-03-01' },
    { id: 'C005', platform: 'Facebook', name: 'Lookalike 2% - Whey', budget: 8000, spend: 7600, impressions: 720000, clicks: 22800, orders: 203, revenue: 38517.30, status: 'ATIVA', startDate: '2026-03-03' },
    { id: 'C006', platform: 'Facebook', name: 'Pré-Treino - Interesse', budget: 5000, spend: 4800, impressions: 390000, clicks: 11400, orders: 167, revenue: 28373.30, status: 'ATIVA', startDate: '2026-03-05' },
    { id: 'C007', platform: 'TikTok', name: 'Colágeno - TOF Mulheres', budget: 6000, spend: 5200, impressions: 890000, clicks: 24600, orders: 143, revenue: 27134.30, status: 'ATIVA', startDate: '2026-03-08' },
    { id: 'C008', platform: 'Facebook', name: 'Omega3 - Retenção', budget: 3000, spend: 2600, impressions: 210000, clicks: 6200, orders: 98, revenue: 18602.00, status: 'PAUSADA', startDate: '2026-03-10' },
];

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

let expenseCounter = 11;
let revenueCounter = 24;
let withdrawalCounter = seedWithdrawals.length + 1;
let campaignCounter = seedCampaigns.length + 1;
let atendenteSaleCounter = seedAtendenteSales.length + 1;
let atendenteCounter = SEED_ATENDENTES.length + 1;

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

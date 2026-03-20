'use client';
import React from 'react';
import { Target, DollarSign, Zap, TrendingUp, MousePointer, CalendarCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface KPICardProps {
    label: string;
    value: string;
    sub?: string;
    detail?: string;
    change: string;
    changePositive: boolean;
    icon: React.ReactNode;
    iconColor: string;
    badge?: { text: string; color: string; bg: string };
    highlight?: boolean;
}

function KPICard({ label, value, sub, detail, change, changePositive, icon, iconColor, badge, highlight }: KPICardProps) {
    return (
        <div className="relative rounded-xl p-5 flex flex-col gap-3 overflow-hidden"
            style={{
                background: highlight
                    ? 'linear-gradient(135deg, hsl(0 60% 14%), hsl(0 50% 11%))'
                    : 'hsl(222 40% 10%)',
                border: highlight
                    ? '1px solid hsl(0 70% 30%)'
                    : '1px solid hsl(222 30% 16%)',
            }}>
            <div className="flex items-start justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'hsl(215 20% 50%)' }}>
                    {label}
                </span>
                <div className="flex items-center gap-2">
                    {badge && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
                            style={{ background: badge.bg, color: badge.color }}>
                            {badge.text === 'BAIXO' && <span>↓</span>}
                            {badge.text === 'ATENÇÃO' && <span>⚠</span>}
                            {badge.text}
                        </span>
                    )}
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: `${iconColor}20` }}>
                        <span style={{ color: iconColor }}>{icon}</span>
                    </div>
                </div>
            </div>

            <div>
                <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                {sub && <p className="text-xs mt-1" style={{ color: 'hsl(215 20% 50%)' }}>{sub}</p>}
                {detail && <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>{detail}</p>}
            </div>

            <div className="flex items-center gap-1">
                <span className="text-xs font-semibold"
                    style={{ color: changePositive ? 'hsl(142 71% 45%)' : 'hsl(0 84% 60%)' }}>
                    {changePositive ? '↗' : '↘'} {change}
                </span>
                <span className="text-xs" style={{ color: 'hsl(215 20% 45%)' }}>vs ontem</span>
            </div>
        </div>
    );
}

const fmtBR = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v);

export default function KPIBentoGrid() {
    const { kpis, campaigns } = useApp();

    const tikTokCamps = campaigns.filter(c => c.platform === 'TikTok' && c.status === 'ATIVA').length;
    const fbCamps = campaigns.filter(c => c.platform === 'Facebook' && c.status === 'ATIVA').length;
    const tikTokRev = campaigns.filter(c => c.platform === 'TikTok').reduce((a, c) => a + c.revenue, 0);
    const fbRev = campaigns.filter(c => c.platform === 'Facebook').reduce((a, c) => a + c.revenue, 0);
    const margin = kpis.totalRevenue > 0 ? ((kpis.netProfit / kpis.totalRevenue) * 100) : 0;
    const convAlert = kpis.conversionRate < 2;

    return (
        <div className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                    <KPICard
                        label="ROAS Geral"
                        value={`${kpis.roas.toFixed(2)}x`}
                        sub={`Meta: 3.0x · R$ 1,00 gasto → R$ ${kpis.roas.toFixed(2)} receita`}
                        change={`${kpis.roas >= 3 ? '+' : ''}${((kpis.roas - 3) / 3 * 100).toFixed(1)}% da meta`}
                        changePositive={kpis.roas >= 3}
                        icon={<Target size={16} />}
                        iconColor="hsl(142 71% 45%)"
                    />
                </div>
                <div className="col-span-1">
                    <KPICard
                        label="Receita Total"
                        value={fmtBR(kpis.totalRevenue)}
                        sub={`TikTok: ${fmtBR(tikTokRev)} · FB: ${fmtBR(fbRev)}`}
                        change="+12.4% vs ontem"
                        changePositive={true}
                        icon={<DollarSign size={16} />}
                        iconColor="hsl(142 71% 45%)"
                    />
                </div>
                <div className="col-span-1">
                    <KPICard
                        label="Gasto em Anúncios"
                        value={fmtBR(kpis.totalAdSpend)}
                        sub={`${kpis.activeCampaigns} campanhas · ${kpis.totalOrders} pedidos`}
                        change="-3.1% vs ontem"
                        changePositive={false}
                        icon={<Zap size={16} />}
                        iconColor="hsl(43 96% 56%)"
                        badge={{ text: 'BAIXO', color: 'hsl(43 96% 70%)', bg: 'hsl(43 96% 20%)' }}
                    />
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-4 gap-4">
                <KPICard
                    label="Lucro Líquido"
                    value={fmtBR(kpis.netProfit)}
                    sub={`Margem: ${margin.toFixed(1)}%`}
                    change="+6.7% vs ontem"
                    changePositive={kpis.netProfit > 0}
                    icon={<TrendingUp size={16} />}
                    iconColor="hsl(142 71% 45%)"
                />
                <KPICard
                    label="Margem Líquida"
                    value={`${margin.toFixed(1)}%`}
                    sub={`Meta: 40% · ${margin >= 40 ? '+' : ''}${(margin - 40).toFixed(1)}pp ${margin >= 40 ? 'acima' : 'abaixo'}`}
                    change="+2.1% vs ontem"
                    changePositive={margin >= 40}
                    icon={<Target size={16} />}
                    iconColor="hsl(142 71% 45%)"
                />
                <KPICard
                    label="Taxa de Conversão"
                    value={`${kpis.conversionRate.toFixed(1)}%`}
                    sub={`${kpis.totalOrders} pedidos / ${new Intl.NumberFormat('pt-BR').format(kpis.totalClicks)} cliques`}
                    change="-0.4% vs ontem"
                    changePositive={!convAlert}
                    icon={<MousePointer size={16} />}
                    iconColor={convAlert ? 'hsl(0 84% 60%)' : 'hsl(142 71% 45%)'}
                    badge={convAlert ? { text: 'ATENÇÃO', color: 'hsl(0 84% 70%)', bg: 'hsl(0 60% 20%)' } : undefined}
                    highlight={convAlert}
                />
                <KPICard
                    label="Campanhas Ativas"
                    value={String(kpis.activeCampaigns)}
                    sub={`TikTok: ${tikTokCamps} · Facebook: ${fbCamps}`}
                    change="+16.7% vs ontem"
                    changePositive={true}
                    icon={<CalendarCheck size={16} />}
                    iconColor="hsl(262 83% 66%)"
                />
            </div>
        </div>
    );
}

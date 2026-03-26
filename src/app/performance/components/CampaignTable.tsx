'use client';
import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Plus, RefreshCw, Trash2, Play, Pause } from 'lucide-react';
import { useApp, Campaign, CampaignStatus } from '@/context/AppContext';
import CampaignModal from './CampaignModal';
import CampaignUpdateModal from './CampaignUpdateModal';
import { toast } from 'sonner';

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);
const fmtN = (v: number) => new Intl.NumberFormat('pt-BR').format(v);
const pct = (v: number) => `${v.toFixed(2)}%`;

const platformColors: Record<string, string> = {
    TikTok: 'hsl(180 80% 50%)',
    Facebook: 'hsl(220 80% 60%)',
    Google: 'hsl(38 92% 56%)',
    Instagram: 'hsl(330 80% 60%)',
    YouTube: 'hsl(0 84% 60%)',
};

const statusStyles: Record<CampaignStatus, { bg: string; color: string }> = {
    ATIVA: { bg: 'hsl(142 71% 15%)', color: 'hsl(142 71% 55%)' },
    PAUSADA: { bg: 'hsl(43 96% 15%)', color: 'hsl(43 96% 60%)' },
    ENCERRADA: { bg: 'hsl(215 20% 15%)', color: 'hsl(215 20% 55%)' },
    RASCUNHO: { bg: 'hsl(262 83% 15%)', color: 'hsl(262 83% 70%)' },
};

function RoasBar({ roas }: { roas: number }) {
    const pct = Math.min((roas / 6) * 100, 100);
    const color = roas >= 3 ? 'hsl(142 71% 45%)' : roas >= 2 ? 'hsl(43 96% 56%)' : 'hsl(0 84% 60%)';
    return (
        <div className="flex items-center gap-2">
            <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(222 30% 20%)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="text-xs font-semibold" style={{ color }}>{roas.toFixed(2)}x</span>
        </div>
    );
}

export default function CampaignTable() {
    const { campaigns, updateCampaign, deleteCampaign, clearCampaigns } = useApp();
    const [search, setSearch] = useState('');
    const [platformFilter, setPlatformFilter] = useState('Todas');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [modalOpen, setModalOpen] = useState(false);
    const [updateTarget, setUpdateTarget] = useState<Campaign | null>(null);

    const filtered = useMemo(() => campaigns.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
        const matchPlatform = platformFilter === 'Todas' || c.platform === platformFilter;
        const matchStatus = statusFilter === 'Todos' || c.status === statusFilter;
        return matchSearch && matchPlatform && matchStatus;
    }), [campaigns, search, platformFilter, statusFilter]);

    function toggleStatus(c: Campaign) {
        const next: CampaignStatus = c.status === 'ATIVA' ? 'PAUSADA' : 'ATIVA';
        updateCampaign(c.id, { status: next });
        toast.success(`Campanha ${next === 'ATIVA' ? 'ativada' : 'pausada'}: ${c.name}`);
    }

    function handleDelete(c: Campaign) {
        deleteCampaign(c.id);
        toast.success(`Campanha removida: ${c.name}`);
    }

    function handleClearAll() {
        if (!confirm(`Excluir todas as ${campaigns.length} campanhas? Essa ação não pode ser desfeita.`)) return;
        clearCampaigns();
        toast.success('Todas as campanhas foram removidas');
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
                        <input type="text" placeholder="Buscar campanha ou ID..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }} />
                    </div>
                    <div className="relative">
                        <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                            {['Todas', 'TikTok', 'Facebook', 'Google', 'Instagram', 'YouTube'].map(p => <option key={p}>{p}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'hsl(215 20% 50%)' }} />
                    </div>
                    <div className="relative">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                            {['Todos', 'ATIVA', 'PAUSADA', 'ENCERRADA', 'RASCUNHO'].map(s => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'hsl(215 20% 50%)' }} />
                    </div>
                    {campaigns.length > 0 && (
                        <button onClick={handleClearAll}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                            style={{ background: 'hsl(0 60% 14%)', border: '1px solid hsl(0 60% 22%)', color: 'hsl(0 84% 60%)' }}>
                            <Trash2 size={13} /> Limpar tudo
                        </button>
                    )}
                    <button onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                        <Plus size={14} /> Nova Campanha
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                                {['ID', 'Plataforma', 'Campanha', 'Orçamento', 'Gasto', 'Impressões', 'Cliques', 'Pedidos', 'Conv.', 'ROAS', 'Receita', 'Status', ''].map(h => (
                                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold tracking-wider whitespace-nowrap"
                                        style={{ color: 'hsl(215 20% 45%)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c, i) => {
                                const conv = c.clicks > 0 ? (c.orders / c.clicks) * 100 : 0;
                                const roas = c.spend > 0 ? c.revenue / c.spend : 0;
                                const spent_pct = c.budget > 0 ? (c.spend / c.budget) * 100 : 0;
                                const s = statusStyles[c.status];
                                return (
                                    <tr key={i} style={{ borderBottom: '1px solid hsl(222 30% 12%)' }}
                                        className="group hover:bg-[hsl(222_40%_12%)] transition-colors">
                                        <td className="px-3 py-3 text-xs font-mono" style={{ color: 'hsl(215 20% 50%)' }}>{c.id}</td>
                                        <td className="px-3 py-3">
                                            <span className="text-xs font-semibold" style={{ color: platformColors[c.platform] || 'hsl(215 20% 55%)' }}>{c.platform}</span>
                                        </td>
                                        <td className="px-3 py-3 font-medium text-white max-w-[180px] truncate">{c.name}</td>
                                        <td className="px-3 py-3 text-white">{fmt(c.budget)}</td>
                                        <td className="px-3 py-3">
                                            <div>
                                                <span className="text-white font-medium">{fmt(c.spend)}</span>
                                                <div className="w-16 h-1 rounded-full mt-1 overflow-hidden" style={{ background: 'hsl(222 30% 20%)' }}>
                                                    <div className="h-full rounded-full"
                                                        style={{ width: `${Math.min(spent_pct, 100)}%`, background: spent_pct > 90 ? 'hsl(0 84% 60%)' : 'hsl(262 83% 66%)' }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3" style={{ color: 'hsl(215 20% 65%)' }}>{fmtN(c.impressions)}</td>
                                        <td className="px-3 py-3" style={{ color: 'hsl(215 20% 65%)' }}>{fmtN(c.clicks)}</td>
                                        <td className="px-3 py-3 text-white font-medium">{c.orders}</td>
                                        <td className="px-3 py-3">
                                            <span className="text-xs font-semibold"
                                                style={{ color: conv >= 2 ? 'hsl(142 71% 50%)' : conv >= 1 ? 'hsl(43 96% 56%)' : 'hsl(0 84% 60%)' }}>
                                                {pct(conv)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3"><RoasBar roas={roas} /></td>
                                        <td className="px-3 py-3 font-semibold" style={{ color: 'hsl(142 71% 50%)' }}>{fmt(c.revenue)}</td>
                                        <td className="px-3 py-3">
                                            <span className="px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap"
                                                style={{ background: s.bg, color: s.color }}>{c.status}</span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => toggleStatus(c)} title={c.status === 'ATIVA' ? 'Pausar' : 'Ativar'}
                                                    style={{ color: 'hsl(215 20% 55%)' }} className="hover:text-white transition-colors p-1">
                                                    {c.status === 'ATIVA' ? <Pause size={13} /> : <Play size={13} />}
                                                </button>
                                                <button onClick={() => setUpdateTarget(c)} title="Atualizar dados"
                                                    style={{ color: 'hsl(215 20% 55%)' }} className="hover:text-white transition-colors p-1">
                                                    <RefreshCw size={13} />
                                                </button>
                                                <button onClick={() => handleDelete(c)} style={{ color: 'hsl(215 20% 55%)' }} className="hover:text-red-400 transition-colors p-1"><Trash2 size={13} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr><td colSpan={13} className="px-4 py-10 text-center text-sm" style={{ color: 'hsl(215 20% 45%)' }}>Nenhuma campanha encontrada</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CampaignModal open={modalOpen} onClose={() => setModalOpen(false)} />
            <CampaignUpdateModal campaign={updateTarget} onClose={() => setUpdateTarget(null)} />
        </>
    );
}

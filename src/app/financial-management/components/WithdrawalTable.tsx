'use client';
import React, { useState } from 'react';
import { ArrowUpRight, Trash2, ArrowDownUp, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Withdrawal } from '@/context/AppContext';
import { toast } from 'sonner';

type WStatus = Withdrawal['status'];

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const sStyles: Record<WStatus, { bg: string; color: string }> = {
    CONCLUÍDO: { bg: 'hsl(142 71% 15%)', color: 'hsl(142 71% 55%)' },
    PENDENTE: { bg: 'hsl(43 96% 15%)', color: 'hsl(43 96% 60%)' },
    AGENDADO: { bg: 'hsl(262 83% 15%)', color: 'hsl(262 83% 70%)' },
};

// ── Modal ──────────────────────────────────────────────────────────────────────

interface WithdrawalModalProps {
    onClose: () => void;
    onSave: (data: Omit<Withdrawal, 'id'>) => void;
}

function WithdrawalModal({ onClose, onSave }: WithdrawalModalProps) {
    const today = new Date().toISOString().split('T')[0];
    const [form, setForm] = useState({
        desc: '',
        destino: '',
        valor: '',
        data: today,
        status: 'PENDENTE' as WStatus,
    });

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const valor = parseFloat(form.valor);
        if (!form.desc.trim()) { toast.error('Informe uma descrição'); return; }
        if (!form.destino.trim()) { toast.error('Informe o destino'); return; }
        if (!valor || valor <= 0) { toast.error('Informe um valor válido'); return; }
        onSave({
            desc: form.desc.trim(),
            destino: form.destino.trim(),
            valor,
            data: form.data,
            status: form.status,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-md rounded-2xl overflow-hidden"
                style={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(222 30% 18%)' }}>
                <div className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: '1px solid hsl(222 30% 16%)' }}>
                    <h2 className="text-base font-semibold text-white">Novo Saque</h2>
                    <button onClick={onClose} className="hover:text-white transition-colors"
                        style={{ color: 'hsl(215 20% 50%)' }}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Descrição *</label>
                        <input value={form.desc} onChange={e => set('desc', e.target.value)}
                            placeholder="Ex: Saque — Lucro semana 1"
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Destino *</label>
                        <input value={form.destino} onChange={e => set('destino', e.target.value)}
                            placeholder="Ex: Conta pessoal, Poupança empresarial..."
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Valor (R$) *</label>
                            <input type="number" min="0.01" step="0.01" value={form.valor}
                                onChange={e => set('valor', e.target.value)}
                                placeholder="0,00"
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Data *</label>
                            <input type="date" value={form.data} onChange={e => set('data', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Status</label>
                        <select value={form.status} onChange={e => set('status', e.target.value as WStatus)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }}>
                            <option value="PENDENTE">PENDENTE</option>
                            <option value="CONCLUÍDO">CONCLUÍDO</option>
                            <option value="AGENDADO">AGENDADO</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2" style={{ borderTop: '1px solid hsl(222 30% 16%)' }}>
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                            style={{ background: 'hsl(222 40% 14%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(215 20% 65%)' }}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                            Registrar Saque
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Table ──────────────────────────────────────────────────────────────────────

export default function WithdrawalTable() {
    const { withdrawals, addWithdrawal, deleteWithdrawal } = useApp();
    const [showModal, setShowModal] = useState(false);

    const total = withdrawals.reduce((acc, w) => acc + w.valor, 0);

    function handleSave(data: Omit<Withdrawal, 'id'>) {
        addWithdrawal(data);
        toast.success('Saque registrado');
        setShowModal(false);
    }

    function handleDelete(w: Withdrawal) {
        if (!confirm(`Excluir o saque "${w.desc}"?`)) return;
        deleteWithdrawal(w.id);
        toast.success('Saque excluído');
    }

    function formatDate(d: string) {
        // supports both "YYYY-MM-DD" and "DD/MM/YYYY"
        if (d.includes('-')) {
            const [y, m, day] = d.split('-');
            return `${day}/${m}/${y}`;
        }
        return d;
    }

    return (
        <>
            <div className="rounded-xl overflow-hidden"
                style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
                <div className="flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                    <div>
                        <h3 className="text-base font-semibold text-white">Saques</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>
                            {withdrawals.length === 0
                                ? 'Nenhum saque registrado'
                                : `Total: ${fmt(total)} · ${withdrawals.length} ${withdrawals.length === 1 ? 'saque' : 'saques'}`}
                        </p>
                    </div>
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white"
                        style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                        <ArrowUpRight size={14} />
                        Novo Saque
                    </button>
                </div>

                {withdrawals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl"
                            style={{ background: 'hsl(222 40% 14%)', color: 'hsl(215 20% 35%)' }}>
                            <ArrowDownUp size={22} />
                        </div>
                        <p className="text-sm font-medium" style={{ color: 'hsl(215 20% 50%)' }}>Nenhum saque registrado</p>
                        <p className="text-xs" style={{ color: 'hsl(215 20% 38%)' }}>Clique em "Novo Saque" para registrar</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                                    {['ID', 'Descrição', 'Destino', 'Valor', 'Data', 'Status', ''].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wider"
                                            style={{ color: 'hsl(215 20% 45%)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawals.map((w) => {
                                    const s = sStyles[w.status];
                                    return (
                                        <tr key={w.id} style={{ borderBottom: '1px solid hsl(222 30% 12%)' }}
                                            className="group hover:bg-[hsl(222_40%_12%)] transition-colors">
                                            <td className="px-4 py-3 text-xs font-mono" style={{ color: 'hsl(215 20% 50%)' }}>{w.id}</td>
                                            <td className="px-4 py-3 font-medium text-white">{w.desc}</td>
                                            <td className="px-4 py-3" style={{ color: 'hsl(215 20% 65%)' }}>{w.destino}</td>
                                            <td className="px-4 py-3 font-semibold" style={{ color: 'hsl(142 71% 50%)' }}>{fmt(w.valor)}</td>
                                            <td className="px-4 py-3" style={{ color: 'hsl(215 20% 60%)' }}>{formatDate(w.data)}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded text-xs font-bold"
                                                    style={{ background: s.bg, color: s.color }}>{w.status}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleDelete(w)}
                                                        style={{ color: 'hsl(215 20% 55%)' }}
                                                        className="hover:text-red-400 transition-colors">
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

            {showModal && (
                <WithdrawalModal
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
}

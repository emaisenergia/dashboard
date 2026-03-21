'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Expense, Revenue, ExpenseStatus, RevenueStatus } from '@/context/AppContext';
import { toast } from 'sonner';

// ── Expense Edit ──────────────────────────────────────────────────────────────

interface ExpenseEditModalProps {
    expense: Expense;
    onClose: () => void;
}

export function ExpenseEditModal({ expense, onClose }: ExpenseEditModalProps) {
    const { updateExpense } = useApp();
    const [status, setStatus] = useState<ExpenseStatus>(expense.status);
    const [date, setDate] = useState(expense.date);
    const [notes, setNotes] = useState((expense as any).notes ?? '');

    function handleSave() {
        updateExpense(expense.id, { status, date, notes } as any);
        toast.success('Despesa atualizada');
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-sm rounded-2xl overflow-hidden"
                style={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(222 30% 18%)' }}>
                <div className="flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: '1px solid hsl(222 30% 16%)' }}>
                    <div>
                        <p className="text-xs font-mono mb-0.5" style={{ color: 'hsl(215 20% 45%)' }}>{expense.id}</p>
                        <h2 className="text-sm font-semibold text-white">Editar Despesa</h2>
                    </div>
                    <button onClick={onClose} style={{ color: 'hsl(215 20% 50%)' }} className="hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4">
                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as ExpenseStatus)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }}>
                            <option value="PAGO">PAGO</option>
                            <option value="PENDENTE">PENDENTE</option>
                            <option value="CANCELADO">CANCELADO</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Data</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Observações</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)}
                            rows={3} placeholder="Notas adicionais..."
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                    </div>

                    <div className="flex gap-3 pt-1" style={{ borderTop: '1px solid hsl(222 30% 16%)' }}>
                        <button onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                            style={{ background: 'hsl(222 40% 14%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(215 20% 65%)' }}>
                            Cancelar
                        </button>
                        <button onClick={handleSave}
                            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Revenue Edit ──────────────────────────────────────────────────────────────

interface RevenueEditModalProps {
    revenue: Revenue;
    onClose: () => void;
}

export function RevenueEditModal({ revenue, onClose }: RevenueEditModalProps) {
    const { updateRevenue } = useApp();
    const [status, setStatus] = useState<RevenueStatus>(revenue.status);
    const [date, setDate] = useState(revenue.date);
    const [notes, setNotes] = useState((revenue as any).notes ?? '');

    function handleSave() {
        updateRevenue(revenue.id, { status, date, notes } as any);
        toast.success('Receita atualizada');
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-sm rounded-2xl overflow-hidden"
                style={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(222 30% 18%)' }}>
                <div className="flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: '1px solid hsl(222 30% 16%)' }}>
                    <div>
                        <p className="text-xs font-mono mb-0.5" style={{ color: 'hsl(215 20% 45%)' }}>{revenue.id}</p>
                        <h2 className="text-sm font-semibold text-white">Editar Receita</h2>
                    </div>
                    <button onClick={onClose} style={{ color: 'hsl(215 20% 50%)' }} className="hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4">
                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as RevenueStatus)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }}>
                            <option value="RECEBIDO">RECEBIDO</option>
                            <option value="PENDENTE">PENDENTE</option>
                            <option value="CANCELADO">CANCELADO</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Data</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                    </div>
                    {revenue.type === 'other_revenue' && (
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 55%)' }}>Observações</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)}
                                rows={3} placeholder="Notas adicionais..."
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                                style={{ background: 'hsl(222 40% 13%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(210 40% 90%)' }} />
                        </div>
                    )}

                    <div className="flex gap-3 pt-1" style={{ borderTop: '1px solid hsl(222 30% 16%)' }}>
                        <button onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                            style={{ background: 'hsl(222 40% 14%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(215 20% 65%)' }}>
                            Cancelar
                        </button>
                        <button onClick={handleSave}
                            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg, hsl(142 60% 35%), hsl(142 80% 28%))' }}>
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';
import React from 'react';
import { ArrowUpRight, Pencil, Trash2 } from 'lucide-react';

type WStatus = 'CONCLUÍDO' | 'PENDENTE' | 'AGENDADO';

interface Withdrawal {
    id: string;
    desc: string;
    destino: string;
    valor: number;
    data: string;
    status: WStatus;
}

const withdrawals: Withdrawal[] = [
    { id: 'S001', desc: 'Saque — Lucro março semana 1', destino: 'Conta pessoal Marcos', valor: 20000, data: '07/03/2026', status: 'CONCLUÍDO' },
    { id: 'S002', desc: 'Saque — Reserva tributária', destino: 'Conta empresarial', valor: 15000, data: '10/03/2026', status: 'CONCLUÍDO' },
    { id: 'S003', desc: 'Saque — Lucro março semana 2', destino: 'Conta pessoal Marcos', valor: 25000, data: '14/03/2026', status: 'CONCLUÍDO' },
    { id: 'S004', desc: 'Saque — Fundo de emergência', destino: 'Poupança empresarial', valor: 10000, data: '18/03/2026', status: 'CONCLUÍDO' },
    { id: 'S005', desc: 'Saque — Lucro março semana 3', destino: 'Conta pessoal Marcos', valor: 20000, data: '21/03/2026', status: 'PENDENTE' },
    { id: 'S006', desc: 'Saque — Distribuição sócios', destino: 'Múltiplas contas', valor: 30000, data: '28/03/2026', status: 'AGENDADO' },
];

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const sStyles: Record<WStatus, { bg: string; color: string }> = {
    CONCLUÍDO: { bg: 'hsl(142 71% 15%)', color: 'hsl(142 71% 55%)' },
    PENDENTE: { bg: 'hsl(43 96% 15%)', color: 'hsl(43 96% 60%)' },
    AGENDADO: { bg: 'hsl(262 83% 15%)', color: 'hsl(262 83% 70%)' },
};

export default function WithdrawalTable() {
    const total = withdrawals.reduce((acc, w) => acc + w.valor, 0);
    return (
        <div className="rounded-xl overflow-hidden"
            style={{ background: 'hsl(222 40% 10%)', border: '1px solid hsl(222 30% 16%)' }}>
            <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid hsl(222 30% 14%)' }}>
                <div>
                    <h3 className="text-base font-semibold text-white">Saques do Mês</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>
                        Total: {fmt(total)} · {withdrawals.length} saques
                    </p>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                    <ArrowUpRight size={14} />
                    Novo Saque
                </button>
            </div>
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
                        {withdrawals.map((w, i) => {
                            const s = sStyles[w.status];
                            return (
                                <tr key={i} style={{ borderBottom: '1px solid hsl(222 30% 12%)' }}
                                    className="group hover:bg-[hsl(222_40%_12%)] transition-colors">
                                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'hsl(215 20% 50%)' }}>{w.id}</td>
                                    <td className="px-4 py-3 font-medium text-white">{w.desc}</td>
                                    <td className="px-4 py-3" style={{ color: 'hsl(215 20% 65%)' }}>{w.destino}</td>
                                    <td className="px-4 py-3 font-semibold" style={{ color: 'hsl(142 71% 50%)' }}>{fmt(w.valor)}</td>
                                    <td className="px-4 py-3" style={{ color: 'hsl(215 20% 60%)' }}>{w.data}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded text-xs font-bold"
                                            style={{ background: s.bg, color: s.color }}>{w.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button style={{ color: 'hsl(215 20% 55%)' }} className="hover:text-white transition-colors"><Pencil size={14} /></button>
                                            <button style={{ color: 'hsl(215 20% 55%)' }} className="hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

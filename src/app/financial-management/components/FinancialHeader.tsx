'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Download, ChevronDown, TrendingDown, TrendingUp } from 'lucide-react';
import RecordModal from './RecordModal';

export default function FinancialHeader() {
    const [openRecord, setOpenRecord] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'expense' | 'revenue'>('expense');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenRecord(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function openModal(mode: 'expense' | 'revenue') {
        setModalMode(mode);
        setOpenRecord(false);
        setModalOpen(true);
    }

    return (
        <>
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gestão Financeira</h1>
                    <p className="text-sm mt-1" style={{ color: 'hsl(215 20% 55%)' }}>
                        Despesas, saques, lucro e fluxo de caixa
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ background: 'hsl(222 40% 12%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                        <Calendar size={15} />
                        <span>Março 2026</span>
                        <ChevronDown size={14} style={{ color: 'hsl(215 20% 55%)' }} />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ background: 'hsl(222 40% 12%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                        <Download size={15} />
                        <span>Exportar</span>
                    </button>

                    {/* Dropdown Novo Registro */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpenRecord(!openRecord)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                            <span>+ Novo Registro</span>
                            <ChevronDown size={13} className={`transition-transform duration-200 ${openRecord ? 'rotate-180' : ''}`} />
                        </button>

                        {openRecord && (
                            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
                                style={{ background: 'hsl(222 47% 10%)', border: '1px solid hsl(222 30% 18%)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
                                <button onClick={() => openModal('expense')}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-left transition-colors hover:bg-white/5"
                                    style={{ color: 'hsl(0 80% 70%)' }}>
                                    <TrendingDown size={16} />
                                    Adicionar Despesa
                                </button>
                                <div style={{ height: '1px', background: 'hsl(222 30% 18%)' }} />
                                <button onClick={() => openModal('revenue')}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-left transition-colors hover:bg-white/5"
                                    style={{ color: 'hsl(142 70% 60%)' }}>
                                    <TrendingUp size={16} />
                                    Adicionar Receita
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <RecordModal open={modalOpen} initialMode={modalMode} onClose={() => setModalOpen(false)} />
        </>
    );
}

'use client';
import React from 'react';
import { Filter, Download, Plus } from 'lucide-react';

export default function ProductHeader() {
    return (
        <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <h1 className="text-2xl font-bold text-white">Gestão de Produtos</h1>
                <p className="text-sm mt-1" style={{ color: 'hsl(215 20% 55%)' }}>
                    Catálogo, margens, custos e desempenho por produto
                </p>
            </div>
            <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                    style={{ background: 'hsl(222 40% 12%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                    <Filter size={15} />
                    <span>Filtros</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                    style={{ background: 'hsl(222 40% 12%)', border: '1px solid hsl(222 30% 18%)', color: 'hsl(210 40% 90%)' }}>
                    <Download size={15} />
                    <span>Exportar</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(240 83% 52%))' }}>
                    <Plus size={15} />
                    <span>Novo Produto</span>
                </button>
            </div>
        </div>
    );
}

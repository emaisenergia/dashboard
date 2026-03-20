'use client';
import React, { useState } from 'react';
import ExpenseTable from './ExpenseTable';
import WithdrawalTable from './WithdrawalTable';
import ProfitChart from './ProfitChart';
import RevenueTable from './RevenueTable';

const tabs = ['Despesas', 'Receitas', 'Saques', 'Análise de Lucro'];

export default function FinancialTabs() {
    const [active, setActive] = useState(0);

    return (
        <div>
            {/* Tab nav */}
            <div className="flex gap-1 mb-5" style={{ borderBottom: '1px solid hsl(222 30% 16%)' }}>
                {tabs.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActive(i)}
                        className="px-4 py-2.5 text-sm font-medium transition-colors relative"
                        style={{
                            color: active === i ? 'hsl(262 83% 75%)' : 'hsl(215 20% 55%)',
                        }}
                    >
                        {tab}
                        {active === i && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                                style={{ background: 'hsl(262 83% 66%)' }} />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {active === 0 && <ExpenseTable />}
            {active === 1 && <RevenueTable />}
            {active === 2 && <WithdrawalTable />}
            {active === 3 && <ProfitChart />}
        </div>
    );
}

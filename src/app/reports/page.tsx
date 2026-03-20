import React from 'react';
import AppLayout from '@/components/AppLayout';
import ReportsContent from './components/ReportsContent';

export default function ReportsPage() {
    return (
        <AppLayout>
            <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Relatórios</h1>
                    <p className="text-sm mt-1" style={{ color: 'hsl(215 20% 55%)' }}>
                        Resumo consolidado de performance, finanças e produtos
                    </p>
                </div>
                <ReportsContent />
            </div>
        </AppLayout>
    );
}

import React from 'react';
import AppLayout from '@/components/AppLayout';
import FinancialHeader from './components/FinancialHeader';
import FinancialSummaryCards from './components/FinancialSummaryCards';
import FinancialTabs from './components/FinancialTabs';

export default function FinancialManagementPage() {
    return (
        <AppLayout>
            <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">
                <FinancialHeader />
                <FinancialSummaryCards />
                <FinancialTabs />
            </div>
        </AppLayout>
    );
}
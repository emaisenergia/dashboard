import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardHeader from './components/DashboardHeader';
import KPIBentoGrid from './components/KPIBentoGrid';
import PlatformSpendChart from './components/PlatformSpendChart';
import RevenueSpendChart from './components/RevenueSpendChart';
import CampaignTable from './components/CampaignTable';
import ActivityFeed from './components/ActivityFeed';

export default function OperationsDashboardPage() {
    return (
        <AppLayout>
            <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">
                <DashboardHeader />
                <KPIBentoGrid />
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    <div className="lg:col-span-3">
                        <RevenueSpendChart />
                    </div>
                    <div className="lg:col-span-2">
                        <PlatformSpendChart />
                    </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    <div className="xl:col-span-2">
                        <CampaignTable />
                    </div>
                    <div className="xl:col-span-1">
                        <ActivityFeed />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
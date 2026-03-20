import React from 'react';
import AppLayout from '@/components/AppLayout';
import PerformanceKPIs from './components/PerformanceKPIs';
import CampaignTable from './components/CampaignTable';
import ConversionChart from './components/ConversionChart';

export default function PerformancePage() {
    return (
        <AppLayout>
            <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Performance</h1>
                        <p className="text-sm mt-1" style={{ color: 'hsl(215 20% 55%)' }}>
                            Anúncios, campanhas, taxa de conversão e ROAS em tempo real
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: 'hsl(142 71% 12%)', color: 'hsl(142 71% 55%)', border: '1px solid hsl(142 71% 22%)' }}>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(142 71% 55%)' }} />
                            Ao vivo
                        </div>
                    </div>
                </div>

                <PerformanceKPIs />

                {/* Section: Campaigns */}
                <div>
                    <h2 className="text-base font-semibold text-white mb-3">Campanhas Ativas</h2>
                    <CampaignTable />
                </div>

                {/* Section: Charts */}
                <div>
                    <h2 className="text-base font-semibold text-white mb-3">Análise de Performance</h2>
                    <ConversionChart />
                </div>
            </div>
        </AppLayout>
    );
}

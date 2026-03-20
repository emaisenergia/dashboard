import React from 'react';
import AppLayout from '@/components/AppLayout';
import OrdersContent from './components/OrdersContent';

export default function OrdersPage() {
    return (
        <AppLayout>
            <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Pedidos</h1>
                    <p className="text-sm mt-1" style={{ color: 'hsl(215 20% 55%)' }}>
                        Histórico de vendas e status de entrega
                    </p>
                </div>
                <OrdersContent />
            </div>
        </AppLayout>
    );
}

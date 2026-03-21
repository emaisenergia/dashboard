'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ProductHeader from './components/ProductHeader';
import ProductSummaryCards from './components/ProductSummaryCards';
import ProductCatalogTable from './components/ProductCatalogTable';

export default function ProductManagementPage() {
    const [openNewProduct, setOpenNewProduct] = useState(false);

    return (
        <AppLayout>
            <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">
                <ProductHeader onNewProduct={() => setOpenNewProduct(true)} />
                <ProductSummaryCards />
                <ProductCatalogTable triggerNew={openNewProduct} onTriggerConsumed={() => setOpenNewProduct(false)} />
            </div>
        </AppLayout>
    );
}

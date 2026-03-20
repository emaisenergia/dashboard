import type { Metadata } from 'next';
import '@/styles/index.css';

export const metadata: Metadata = {
    title: 'OpsDash - Dashboard Operacional',
    description: 'Painel de operações e análise de campanhas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    );
}

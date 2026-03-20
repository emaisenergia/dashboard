import AppLayout from '@/components/AppLayout';
import SettingsContent from './components/SettingsContent';

export default function SettingsPage() {
    return (
        <AppLayout>
            <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Configurações</h1>
                    <p className="text-sm mt-1" style={{ color: 'hsl(215 20% 55%)' }}>
                        Gerencie sua conta, empresa e integrações
                    </p>
                </div>
                <SettingsContent />
            </div>
        </AppLayout>
    );
}

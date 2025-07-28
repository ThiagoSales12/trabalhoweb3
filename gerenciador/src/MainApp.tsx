import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { ClientsView } from './views/ClientsView';
import { ProjectDetailsView } from './views/ProjectDetailsView';
import { Button } from './components/common/Button';
import { CheckSquare, LogOut } from 'lucide-react';
import type { Client } from './types';

export function MainApp() {
    const { currentUser, logout } = useContext(AuthContext);
    const [currentView, setCurrentView] = useState<'clients' | 'projectDetails'>('clients');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const handleSelectClient = (client: Client) => {
        setSelectedClient(client);
        setCurrentView('projectDetails');
    };

    const handleBackToClients = () => {
        setSelectedClient(null);
        setCurrentView('clients');
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <div className="container mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden my-8">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="text-indigo-400" size={28} />
                        <h1 className="text-xl font-bold">Gerenciador de Projetos</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-300">Olá, {currentUser?.name}</span>
                        <Button onClick={logout} variant="danger">
                            <LogOut size={16} /> Sair
                        </Button>
                    </div>
                </header>
                <main className="p-4 md:p-8">
                    {currentView === 'clients' && <ClientsView onSelectClient={handleSelectClient} />}
                    {currentView === 'projectDetails' && selectedClient && (
                        <ProjectDetailsView client={selectedClient} onBack={handleBackToClients} />
                    )}
                </main>
            </div>
        </div>
    );
}

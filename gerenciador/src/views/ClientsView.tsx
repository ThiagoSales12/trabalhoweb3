import { useState, useContext, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Loader2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import type { Client } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ClientForm } from '../components/forms/ClientForm';

export function ClientsView({ onSelectClient }: { onSelectClient: (client: Client) => void }) {
  const { clients, clientActions, fetchClients, loading, errors } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

  useEffect(() => {
      fetchClients();
  }, [fetchClients]);

  const handleEdit = (client: Client) => { setEditingClient(client); setIsModalOpen(true); };
  const handleAdd = () => { setEditingClient(undefined); setIsModalOpen(true); };

  if (loading.clients) {
      return <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin text-indigo-400" size={40}/></div>;
  }
  
  if (errors.clients) {
      return <div className="text-red-400 text-center p-10">Erro ao carregar clientes: {errors.clients}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">Clientes</h2><Button onClick={handleAdd}><Plus size={16} /> Novo Cliente</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client: Client) => (
          <Card key={client.id} className="hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer">
            <div onClick={() => onSelectClient(client)}>
                <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-indigo-500/20 rounded-full"><User className="text-indigo-400" size={20}/></div><h3 className="text-lg font-semibold text-white">{client.name}</h3></div>
                <p className="text-gray-400">{client.email}</p><p className="text-sm text-gray-500 mt-2">Cliente desde: {new Date(client.since).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-700"><Button onClick={() => handleEdit(client)} variant="secondary" className="px-2 py-1 text-sm"><Edit size={14} /></Button><Button onClick={() => clientActions.remove(client.id)} variant="danger" className="px-2 py-1 text-sm"><Trash2 size={14} /></Button></div>
          </Card>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}><ClientForm client={editingClient} onDone={() => setIsModalOpen(false)} /></Modal>
    </div>
  );
}
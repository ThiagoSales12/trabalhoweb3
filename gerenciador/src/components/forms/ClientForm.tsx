import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import type { Client } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function ClientForm({ client, onDone }: { client?: Client, onDone: () => void }) {
  const { clientActions, loading } = useContext(AppContext);
  const [name, setName] = useState(client?.name || '');
  const [email, setEmail] = useState(client?.email || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientData = { name, email, since: client?.since || new Date().toISOString() };
    if (client) {
      await clientActions.update(client.id, clientData);
    } else {
      await clientActions.add(clientData);
    }
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-gray-300 mb-1">Nome</label><Input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
      <div><label className="block text-sm font-medium text-gray-300 mb-1">Email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="flex justify-end gap-2 pt-4"><Button onClick={onDone}>Cancelar</Button><Button type="submit" disabled={loading.addClient || loading.updateClient}>{client ? 'Atualizar' : 'Criar'} Cliente</Button></div>
    </form>
  );
}
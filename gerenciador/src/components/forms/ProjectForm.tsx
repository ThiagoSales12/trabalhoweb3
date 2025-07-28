import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import type { Project, Client } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';


export function ProjectForm({ project, onDone, preselectedClient }: { project?: Project, onDone: () => void, preselectedClient?: string }) {
    const { clients, projectActions, loading } = useContext(AppContext);
    const [name, setName] = useState(project?.name || '');
    const [deadline, setDeadline] = useState(project?.deadline || '');
    const [clientId, setClientId] = useState(project?.clientId || preselectedClient || '');
    const [status, setStatus] = useState<'active' | 'completed' | 'on-hold'>(project?.status || 'active');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId) { alert("Por favor, selecione um cliente."); return; }
        const projectData = { name, deadline, clientId, status };
        if (project) { await projectActions.update(project.id, projectData); } else { await projectActions.add(projectData); }
        onDone();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div><label className="block text-sm font-medium text-gray-300 mb-1">Cliente</label><Select value={clientId} onChange={(e) => setClientId(e.target.value)} required disabled={!!preselectedClient}><option value="">Selecione um Cliente</option>{clients.map((c: Client) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Nome do Projeto</label><Input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Prazo</label><Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Status</label><Select value={status} onChange={(e) => setStatus(e.target.value as any)} required><option value="active">Ativo</option><option value="completed">Concluído</option><option value="on-hold">Em espera</option></Select></div>
            <div className="flex justify-end gap-2 pt-4"><Button onClick={onDone}>Cancelar</Button><Button type="submit" disabled={loading.addProject || loading.updateProject}>{project ? 'Atualizar' : 'Criar'} Projeto</Button></div>
        </form>
    );
}
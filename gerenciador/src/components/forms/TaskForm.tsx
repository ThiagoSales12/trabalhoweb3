import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { Task } from '../../types';

export function TaskForm({ task, onDone, projectId }: { task?: Task, onDone: () => void, projectId: string }) {
    const { taskActions, loading } = useContext(AppContext);
    const [title, setTitle] = useState(task?.title || '');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const taskData = { title, projectId };
        if (task) { await taskActions.update(task.id, { title }); } else { await taskActions.add(taskData); }
        onDone();
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Título da Tarefa</label><Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div className="flex justify-end gap-2 pt-4"><Button onClick={onDone}>Cancelar</Button><Button type="submit" disabled={loading.addTask || loading.updateTask}>{task ? 'Atualizar' : 'Adicionar'} Tarefa</Button></div>
        </form>
    );
}
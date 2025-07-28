import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { AuthContext } from '../../context/AuthContext';

export function CommentForm({ onDone, taskId }: { onDone: () => void, taskId: string }) {
    const { commentActions, loading } = useContext(AppContext);
    const { currentUser } = useContext(AuthContext);
    const [text, setText] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const commentData = { text, taskId, author: currentUser.name };
        await commentActions.add(commentData);
        onDone();
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Comentário</label><Input type="text" value={text} onChange={(e) => setText(e.target.value)} required /></div>
            <div className="flex justify-end gap-2 pt-4"><Button onClick={onDone}>Cancelar</Button><Button type="submit" disabled={loading.addComment}>Adicionar Comentário</Button></div>
        </form>
    );
}
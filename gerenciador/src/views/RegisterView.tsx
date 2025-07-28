import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Input } from "../components/common/Input";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Loader2 } from "lucide-react";

export function RegisterView({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
    const { register } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const { success, message } = await register(name, email, password);
        if (!success) {
            setError(message);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <Card className="w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-white mb-6">Criar Conta</h2>
                {error && <p className="bg-red-500/20 text-red-400 text-center p-2 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Nome</label><Input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Email</label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Password</label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin"/> : 'Registar'}</Button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-6">Já tem uma conta? <button onClick={onSwitchToLogin} className="font-semibold text-indigo-400 hover:underline">Faça login</button></p>
            </Card>
        </div>
    );
}
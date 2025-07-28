import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Loader2 } from "lucide-react";
import { Input } from "../components/common/Input";

export function LoginView({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('admin@demo.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const success = await login(email, password);
        if (!success) {
            setError('Email ou password inválidos.');
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <Card className="w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
                {error && <p className="bg-red-500/20 text-red-400 text-center p-2 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Email</label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Password</label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin"/> : 'Entrar'}</Button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-6">Não tem uma conta? <button onClick={onSwitchToRegister} className="font-semibold text-indigo-400 hover:underline">Registe-se</button></p>
            </Card>
        </div>
    );
}
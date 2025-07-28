import { Loader2 } from "lucide-react";
import { AuthContext } from "./context/AuthContext";
import { useContext, useState } from "react";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { MainApp } from "./MainApp";

export function AppContent() {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    const [view, setView] = useState<'login' | 'register'>('login');
    

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <Loader2 className="animate-spin text-indigo-400" size={40} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return view === 'login'
            ? <LoginView onSwitchToRegister={() => setView('register')} />
            : <RegisterView onSwitchToLogin={() => setView('login')} />;
    }

    return <MainApp />;
}

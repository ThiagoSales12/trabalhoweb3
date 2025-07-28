import { createContext, useEffect, useState } from "react";
import { eraseCookie, getCookie, setCookie } from "../utils/cookies";
import { apiFetch } from "../services/api";
import type { User } from "../types";

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode })  {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const validateSession = async () => {
            if (typeof window !== 'undefined') {
                const token = getCookie('session_token');
                if (token) {
                    try {
                        const user = await apiFetch('/api/Auth/me');
                        setCurrentUser(user);
                        setIsAuthenticated(true);
                    } catch (error) {
                        console.error("Sessão inválida, limpando o cookie.", error);
                        eraseCookie('session_token');
                    }
                }
            }
            setIsLoading(false);
        };
        
        validateSession();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const { token, user } = await apiFetch('/api/Auth/login', {
                method: 'POST',
                body: { email, password },
            });
            setCookie('session_token', token, 1);
            setCurrentUser(user);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error("Falha no login", error);
            return false;
        }
    };

    const register = async (name: string, email: string, password: string): Promise<{success: boolean, message: string}> => {
    try {
        await apiFetch('/api/Auth/register', {
            method: 'POST',
            body: { name, email, password },
        });

        try {
            await login(email, password);
            return { success: true, message: 'Registro bem-sucedido!' };
        } catch (loginError) {
            return { 
                success: true, 
                message: 'Conta criada com sucesso, mas o login automático falhou. Por favor, faça o login manualmente.' 
            };
        }

    } catch (registerError: any) {
        return { success: false, message: registerError.message };
    }
};

    const logout = async () => {
        try {
            await apiFetch('/api/Auth/logout', { method: 'POST' });
        } catch (error) {
            console.error("Erro no logout da API, a fazer logout localmente.", error);
        } finally {
            eraseCookie('session_token');
            setCurrentUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = { isAuthenticated, currentUser, login, register, logout, isLoading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
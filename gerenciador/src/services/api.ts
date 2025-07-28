import axios, { AxiosError } from 'axios';
import {getCookie} from '../utils/cookies';

const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
     withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getCookie('session_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export async function apiFetch(endpoint: string, options: { method?: string; body?: any; } = {})  {
    try {
        const response = await apiClient({
            url: endpoint,
            method: options.method || 'GET',
            data: options.body,
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            const errorData: any = axiosError.response.data;
            throw new Error(errorData.message || `Erro ${axiosError.response.status}`);
        } else if (axiosError.request) {
            throw new Error('Sem resposta do servidor. Verifique a sua ligação.');
        } else {
            throw new Error(axiosError.message);
        }
    }
};
import { createContext, useCallback, useState } from "react";
import type { Client, Project, Task, Comment } from "../types";
import { apiFetch } from "../services/api";

export const AppContext = createContext<any>(null);

export default function AppProvider({ children }: { children: React.ReactNode }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    const handleApiCall = async (key: string, apiCall: () => Promise<any>) => {
        setLoading(prev => ({ ...prev, [key]: true }));
        setErrors(prev => ({ ...prev, [key]: null }));
        try {
            return await apiCall();
        } catch (error: any) {
            setErrors(prev => ({ ...prev, [key]: error.message }));
            return null;
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    const fetchClients = useCallback(async () => {
        const data = await handleApiCall('clients', () => apiFetch('/api/Clients'));
        if (data) setClients(data);
    }, []);

    const clientActions = {
        add: async (client: Omit<Client, 'id'>) => {
            await handleApiCall('addClient', () => apiFetch('/api/Clients', { method: 'POST', body: client }));
            fetchClients();
        },
        update: async (id: string, client: Partial<Client>) => {
            await handleApiCall('updateClient', () => apiFetch(`/api/Clients/${id}`, { method: 'PUT', body: client }));
            fetchClients();
        },
        remove: async (id: string) => {
            await handleApiCall('deleteClient', () => apiFetch(`/api/Clients/${id}`, { method: 'DELETE' }));
            setClients(prev => prev.filter(c => c.id !== id));
        }
    };

    const fetchProjectsByClient = useCallback(async (clientId: string) => {
        const data = await handleApiCall(`projects_${clientId}`, () => apiFetch(`/api/Projects/client/${clientId}`));
        if (data) {
            setProjects(prev => [...prev.filter(p => p.clientId !== clientId), ...data]);
        }
    }, []);

    const projectActions = {
        add: async (project: Omit<Project, 'id'>) => {
            const newProject = await handleApiCall('addProject', () => apiFetch('/api/Projects', { method: 'POST', body: project }));
            if (newProject) {
                await fetchProjectsByClient(project.clientId);
            }
        },
        update: async (id: string, project: Partial<Project>) => {
            const updatedProject = await handleApiCall('updateProject', () => apiFetch(`/api/Projects/${id}`, { method: 'PUT', body: project }));
            if (updatedProject) {
                setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
            }
        },
        remove: async (id: string, clientId: string) => {
            await handleApiCall('deleteProject', () => apiFetch(`/api/Projects/${id}`, { method: 'DELETE' }));
            setProjects(prev => prev.filter(p => p.id !== id));
        }
    };

    const fetchTasksByProject = useCallback(async (projectId: string) => {
        const data = await handleApiCall(`tasks_${projectId}`, () => apiFetch(`/api/Tasks/project/${projectId}`));
        if (data) {
            setTasks(prev => [...prev.filter(t => t.projectId !== projectId), ...data]);
        }
    }, []);

    const taskActions = {
        add: async (task: Omit<Task, 'id' | 'completed'>) => {
            const taskDataToSend = { ...task, completed: false };
            const newTask = await handleApiCall('addTask', () => apiFetch('/api/Tasks', { method: 'POST', body: taskDataToSend }));

            if (newTask) {
                await fetchTasksByProject(task.projectId);
            }
        },
        update: async (id: string, taskUpdate: Partial<Task>) => {
            const updatedTask = await handleApiCall('updateTask', () => apiFetch(`/api/Tasks/${id}`, { method: 'PUT', body: taskUpdate }));
            if (updatedTask) {
                setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
            }
        },
        remove: async (id: string) => {
            await handleApiCall('deleteTask', () => apiFetch(`/api/Tasks/${id}`, { method: 'DELETE' }));
            setTasks(prev => prev.filter(t => t.id !== id));
        }
    };

    const fetchCommentsByTask = useCallback(async (taskId: string) => {
        const data = await handleApiCall(`comments_${taskId}`, () => apiFetch(`/api/Comments/task/${taskId}`));
        if (data) {
            setComments(prev => [...prev.filter(c => c.taskId !== taskId), ...data]);
        }
    }, []);

    const commentActions = {
        add: async (comment: Omit<Comment, 'id' | 'timestamp'>) => {
            const newComment = await handleApiCall('addComment', () => apiFetch('/api/Comments', { method: 'POST', body: comment }));
            if (newComment) setComments(prev => [...prev, newComment]);
        },
        remove: async (id: string) => {
            await handleApiCall('deleteComment', () => apiFetch(`/api/Comments/${id}`, { method: 'DELETE' }));
            setComments(prev => prev.filter(c => c.id !== id));
        }
    };

    const value = {
        clients, projects, tasks, comments, loading, errors,
        fetchClients, clientActions,
        fetchProjectsByClient, projectActions,
        fetchTasksByProject, taskActions,
        fetchCommentsByTask, commentActions,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
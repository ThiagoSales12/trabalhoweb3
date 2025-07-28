import type { Client, Project, Task, Comment } from "../types";

export const initialClients: Client[] = [
  { id: 'cli1', name: 'Empresa Alpha', email: 'contato@alpha.com', since: '2022-01-15' },
  { id: 'cli2', name: 'Soluções Beta', email: 'suporte@beta.com', since: '2023-03-20' },
];

export const initialProjects: Project[] = [
  { id: 'proj1', clientId: 'cli1', name: 'Website Corporativo', deadline: '2025-09-30', status: 'active' },
  { id: 'proj2', clientId: 'cli1', name: 'App Mobile de E-commerce', deadline: '2025-12-15', status: 'active' },
  { id: 'proj3', clientId: 'cli2', name: 'Sistema de CRM', deadline: '2025-08-20', status: 'completed' },
];

export const initialTasks: Task[] = [
  { id: 'task1', projectId: 'proj1', title: 'Design da Home Page', completed: true },
  { id: 'task2', projectId: 'proj1', title: 'Desenvolvimento do Backend', completed: false },
  { id: 'task3', projectId: 'proj3', title: 'Módulo de Contatos', completed: true },
];

export const initialComments: Comment[] = [
    {id: 'com1', taskId: 'task2', author: 'Gerente', text: 'Prioridade alta para esta tarefa!', timestamp: new Date().toISOString()},
];
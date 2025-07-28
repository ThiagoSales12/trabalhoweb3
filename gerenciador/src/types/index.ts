export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; 
}

export interface Client {
  id: string;
  name: string;
  email: string;
  since: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  deadline: string;
  status: 'active' | 'completed' | 'on-hold';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id:string;
  taskId: string;
  author: string;
  text: string;
  timestamp: string;
}
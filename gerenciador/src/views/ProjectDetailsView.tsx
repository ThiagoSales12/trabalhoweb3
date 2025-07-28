import { useState, useContext, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, MessageSquare, Briefcase, User, Calendar, Loader2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import type { Client, Project, Task, Comment } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ProjectForm } from '../components/forms/ProjectForm';
import { TaskForm } from '../components/forms/TaskForm';
import { CommentForm } from '../components/forms/CommentForm';

export function ProjectDetailsView({ client, onBack }: { client: Client, onBack: () => void }) {
    const { projects, tasks, comments, projectActions, taskActions, commentActions, fetchProjectsByClient, fetchTasksByProject, fetchCommentsByTask, loading, errors } = useContext(AppContext);
    
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [selectedProjectForTask, setSelectedProjectForTask] = useState<string>('');
    const [selectedTaskForComment, setSelectedTaskForComment] = useState<string>('');
    const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
    
    const statusColors = { active: 'text-green-400 bg-green-500/20', completed: 'text-blue-400 bg-blue-500/20', 'on-hold': 'text-yellow-400 bg-yellow-500/20' };

    useEffect(() => {
        if (client?.id) {
            fetchProjectsByClient(client.id);
        }
    }, [client?.id, fetchProjectsByClient]);

    const handleToggleProject = (projectId: string) => {
        const isExpanded = !expandedProjects[projectId];
        setExpandedProjects(prev => ({ ...prev, [projectId]: isExpanded }));
        if (isExpanded) {
            fetchTasksByProject(projectId);
        }
    };

    const handleToggleTask = (taskId: string) => {
        fetchCommentsByTask(taskId);
    };

    const handleEditProject = (project: Project) => { setEditingProject(project); setIsProjectModalOpen(true); };
    const handleAddProject = () => { setEditingProject(undefined); setIsProjectModalOpen(true); };
    const handleEditTask = (task: Task) => { setEditingTask(task); setSelectedProjectForTask(task.projectId); setIsTaskModalOpen(true); };
    const handleAddTask = (projectId: string) => { setEditingTask(undefined); setSelectedProjectForTask(projectId); setIsTaskModalOpen(true); };
    const handleAddComment = (taskId: string) => { setSelectedTaskForComment(taskId); setIsCommentModalOpen(true); };

    const clientProjects = projects.filter((p: Project) => p.clientId === client.id);

    return (
        <div>
            <Button onClick={onBack} variant="secondary" className="mb-6"><ArrowLeft size={16} /> Voltar para Clientes</Button>
            <div className="flex items-center gap-4 mb-8"><div className="p-3 bg-indigo-500/20 rounded-full"><User className="text-indigo-400" size={32}/></div><div><h2 className="text-3xl font-bold text-white">{client.name}</h2><p className="text-gray-400">{client.email}</p></div></div>
            <div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-white">Projetos</h3><Button onClick={handleAddProject}><Plus size={16} /> Novo Projeto</Button></div>
            
            {loading[`projects_${client.id}`] && <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin text-indigo-400" size={40}/></div>}
            {errors[`projects_${client.id}`] && <div className="text-red-400 text-center p-10">Erro ao carregar projetos: {errors[`projects_${client.id}`]}</div>}
            
            {!loading[`projects_${client.id}`] && (
                <div className="space-y-6">
                    {clientProjects.length > 0 ? clientProjects.map((project: Project) => (
                        <Card key={project.id}>
                            <div className="flex justify-between items-start">
                                <div onClick={() => handleToggleProject(project.id)} className="cursor-pointer flex-grow">
                                    <div className="flex items-center gap-3 mb-2"><div className="p-2 bg-indigo-500/20 rounded-full"><Briefcase className="text-indigo-400" size={20}/></div><h4 className="text-xl font-semibold text-white">{project.name}</h4></div>
                                    <div className="flex items-center gap-4 text-sm text-gray-400"><span className="flex items-center gap-1"><Calendar size={14}/> Prazo: {new Date(project.deadline).toLocaleDateString()}</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>{project.status}</span></div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0"><Button onClick={() => handleEditProject(project)} variant="secondary" className="px-2 py-1 text-sm"><Edit size={14} /></Button><Button onClick={() => projectActions.remove(project.id, client.id)} variant="danger" className="px-2 py-1 text-sm"><Trash2 size={14} /></Button></div>
                            </div>

                            {expandedProjects[project.id] && (
                                <div className="mt-6">
                                    <div className="flex justify-between items-center mb-3"><h5 className="font-semibold text-gray-200">Tarefas</h5><Button onClick={() => handleAddTask(project.id)} variant="secondary" className="text-xs px-2 py-1"><Plus size={12}/> Adicionar Tarefa</Button></div>
                                    <div className="space-y-2">
                                        {tasks.filter((t: Task) => t.projectId === project.id).map((task: Task) => (
                                            <div key={task.id} className="bg-gray-700/50 p-3 rounded-md">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2"><input type="checkbox" checked={task.completed} onChange={() => taskActions.update(task.id, { completed: !task.completed })} className="form-checkbox h-4 w-4 bg-gray-800 border-gray-600 text-indigo-600 focus:ring-indigo-500 rounded"/><span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.title}</span></div>
                                                    <div className="flex gap-2">
                                                        <Button onClick={() => handleToggleTask(task.id)} variant="secondary" className="px-2 py-1 text-sm"><MessageSquare size={14} /></Button>
                                                        <Button onClick={() => handleEditTask(task)} variant="secondary" className="px-2 py-1 text-sm"><Edit size={14} /></Button>
                                                        <Button onClick={() => taskActions.remove(task.id)} variant="danger" className="px-2 py-1 text-sm"><Trash2 size={14} /></Button>
                                                    </div>
                                                </div>
                                                <div className="pl-6 mt-2 space-y-2">
                                                    {comments.filter((c: Comment) => c.taskId === task.id).map((comment: Comment) => (
                                                        <div key={comment.id} className="text-sm text-gray-400 bg-gray-900/50 p-2 rounded flex justify-between items-center">
                                                           <span><strong>{comment.author}:</strong> {comment.text}</span>
                                                           <Button onClick={() => commentActions.remove(comment.id)} variant="danger" className="px-1 py-0 text-xs h-5 w-5 flex-shrink-0"><Trash2 size={10} /></Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    )) : <p className="text-gray-400 text-center py-4">Nenhum projeto encontrado para este cliente.</p>}
                </div>
            )}
            <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title={editingProject ? 'Editar Projeto' : 'Novo Projeto'}><ProjectForm project={editingProject} onDone={() => setIsProjectModalOpen(false)} preselectedClient={client.id} /></Modal>
            <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}><TaskForm task={editingTask} onDone={() => setIsTaskModalOpen(false)} projectId={selectedProjectForTask} /></Modal>
            <Modal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} title="Adicionar Comentário"><CommentForm onDone={() => setIsCommentModalOpen(false)} taskId={selectedTaskForComment} /></Modal>
        </div>
    );
}
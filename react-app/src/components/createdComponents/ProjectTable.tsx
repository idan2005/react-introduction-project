import { Project, ProjectUtils, Task } from "@/Services/ProjectService";
import { Button } from "../ui/button"
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "../ui/table"
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import UserSelect from "./UserSelect";
interface ProjectTableProps {
    project: Project;
    onClose: () => void;
}

const ProjectTable = ({ project, onClose }: ProjectTableProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<Task>({
        name: '',
        assignedTo: [],
        description: '',
        status: 'todoList'
    });

    useEffect(() => {
        const allTasks = [
            ...(project.todoList || []),
            ...(project.inProgressList || []),
            ...(project.doneList || [])
        ];
        setTasks(allTasks);
    }, [project]);

    const createTask = async () => {
        if(project.id === undefined) {
            console.error('Project ID is undefined');
            return;
        }
        if (!newTask.name.trim() || newTask.assignedTo.length === 0 || !newTask.description?.trim()) {
            alert("Please fill in all fields");
            return; 
        }
        const result = await ProjectUtils.createTask(project.id, newTask);
        console.log('Task creation result:', result);
        
        if (result.success) {
            setTasks(prevTasks => [...prevTasks, { ...newTask, id: result.data?.id }]);
            
            setNewTask({ 
                name: '', 
                status: 'todoList', 
                assignedTo: [], 
                description: '' 
            });
        } else {
            alert(`Failed to create task: ${result.message}`);
        }
    };

    const updateTaskStatus = async (taskId: string, fromStatus: 'todoList' | 'inProgressList' | 'doneList', toStatus: 'todoList' | 'inProgressList' | 'doneList') => {
        if(project.id === undefined) {
            console.error('Project ID is undefined');
            return;
        }
        
        const result = await ProjectUtils.updateTaskStatus(project.id, taskId, fromStatus, toStatus);
        
        if (result.success) {
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === taskId ? { ...task, status: toStatus } : task
                )
            );
        } else {
            alert(`Failed to update task status: ${result.message}`);
        }
    };

    const allTasks = tasks.map((task: Task) => {
        let listName = 'To Do';
        if (task.status === 'inProgressList') listName = 'In Progress';
        if (task.status === 'doneList') listName = 'Done';
        
        return {
            ...task,
            listName
        };
    });

   return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Tasks Table for Project: {project.name}</h2>
            <div className="flex gap-4">
                <Button variant="outline" onClick={createTask}>+ Create New Task</Button>
                <Button variant="outline" onClick={onClose}>← Back to Projects</Button>
            </div>
        </div>
        <div className="mb-4">
            <p className="text-gray-600">Description: {project.description}</p>
        </div>
        <div className="mb-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Task Name</label>
                <Input
                    placeholder="Enter Task Name" 
                    value={newTask.name}
                    onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Task Description</label>
                <Input
                    placeholder="Enter Task Description" 
                    value={newTask.description || ''}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                />
            </div>
            <UserSelect
                value={newTask.assignedTo[0] || ''}
                onChange={(value) => setNewTask(prev => ({ ...prev, assignedTo: [value] }))}
                label='Assign A User'
                placeholder='Assigned User'
            />
            {/* <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Status</label>
                <select
                    value={newTask.status}
                    onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value as
                         'todoList' | 'inProgressList' | 'doneList' }))}
                    className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                    <option value="todoList">To Do</option>
                    <option value="inProgressList">In Progress</option>
                    <option value="doneList">Done</option>
                </select>
            </div> */}
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Assigned User</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {allTasks.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                            No tasks found in this project
                        </TableCell>
                    </TableRow>
                ) : (
                    allTasks.map((task, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{task.name || 'Unnamed Task'}</TableCell>
                            <TableCell>{task.description || 'No description'}</TableCell>
                            <TableCell>
                                {Array.isArray(task.assignedTo) 
                                    ? task.assignedTo.join(', ') || 'Unassigned'
                                    : task.assignedTo || 'Unassigned'
                                }
                            </TableCell>
                            <TableCell>
                                <select
                                    value={task.status}
                                    onChange={(e) => task.id && updateTaskStatus(task.id, task.status, e.target.value as 'todoList' | 'inProgressList' | 'doneList')}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                    disabled={!task.id}
                                >
                                    <option value="todoList">To Do</option>
                                    <option value="inProgressList">In Progress</option>
                                    <option value="doneList">Done</option>
                                </select>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
        <p className="text-sm text-gray-500 mt-5 text-center">Owner: {project.owner}</p>
    </div>
  )
}


export default ProjectTable;
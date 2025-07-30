import React from 'react'
import Project from './Project'
import { Button } from '../ui/button'
import { Project as ProjectType } from '../../Services/ProjectService'

interface RemovableProjectProps {
  project: ProjectType;
  onRemove: (id: number) => void;
  onUpdate?: (project: ProjectType) => void; // Optional update handler
}

const RemovableProject = ({ project, onRemove }: RemovableProjectProps) => {
  return (
    console.log('Rendering RemovableProject:', project),
    <li className="border p-4 rounded-lg shadow-sm bg-white">
      <Project 
        name={project.name}
        description={project.description || ''} 
        owner={project.owner?.toString() || 'Unknown'}
        todoList={project.todoList || []}
        inProgressList={project.inProgressList || []}
        doneList={project.doneList || []}
      />
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => project.id && onRemove(project.id)}
        className="mt-3"
      >
        Remove Project
      </Button>
    </li>
  );
};

export default RemovableProject;

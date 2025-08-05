import React from 'react'
import Project from './Project'
import { Button } from '../ui/button'
import { Project as ProjectType } from '../../Services/ProjectService'

interface RemovableProjectProps {
  project: ProjectType;
  onRemove: (id: number) => void;
  currentUser?: string;
  openProject: (project: ProjectType) => void;
}

const ModifiedProject = ({ project, onRemove, currentUser, openProject }: RemovableProjectProps) => {
  return (
    <li className="border p-4 rounded-lg shadow-sm bg-white">
      <Project 
        name={project.name}
        description={project.description || ''} 
        owner={project.owner?.toString() || 'Unknown'}
        todoList={project.todoList || []}
        inProgressList={project.inProgressList || []}
        doneList={project.doneList || []}
      />
      <div className="flex justify-between items-center mt-3">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => project.id && openProject(project)}
        >
          Open Project
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => project.id && onRemove(project.id)}
          disabled={!currentUser || currentUser !== project.owner?.toString()}
        >
          Remove Project
        </Button>
      </div>
    </li>
  );
};

export default ModifiedProject;

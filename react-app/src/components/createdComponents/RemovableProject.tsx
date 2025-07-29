import React from 'react'
import Project from './Project'
import { Button } from '../ui/button'
import { Project as ProjectType } from '../../Services/ProjectService'

interface RemovableProjectProps {
  project: ProjectType;
  onRemove: (id: number) => void;
}

const RemovableProject = ({ project, onRemove }: RemovableProjectProps) => {
  return (
    <li className="border p-4 rounded-lg shadow-sm bg-white">
      <Project 
        title={project.title}
        description={project.description || ''} 
        owner={project.ownerName?.toString() || 'Unknown'}
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

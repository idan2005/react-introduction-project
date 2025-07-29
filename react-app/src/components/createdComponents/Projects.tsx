import React from 'react'
import RemovableProject from './RemovableProject'
import { Project } from '../../Services/ProjectService'

interface ProjectsProps {
  projects: Project[];
  onRemoveProject: (id: number) => void;
}

const Projects = ({ projects, onRemoveProject }: ProjectsProps) => {
  if (projects.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-lg">No projects yet.</p>
        <p>Click "Add New Project" to get started!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {projects.map((project) => (
        <RemovableProject
          key={project.id}
          project={project}
          onRemove={onRemoveProject}
        />
      ))}
    </ul>
  )
}

export default Projects
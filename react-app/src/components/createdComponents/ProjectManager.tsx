import React, { useState, useEffect } from 'react'
import Projects from './Projects'
import AddProjectForm from './AddProjectForm'
import { Button } from '../ui/button'
import { ProjectUtils, Project } from '../../Services/ProjectService'

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    setError('');
    
    const result = await ProjectUtils.getProjects();
    
    if (result.success) {
      setProjects(result.data || []);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  const handleAddProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    setError('');

    const result = await ProjectUtils.addProject(projectData);
    
    if (result.success && result.data) {
      setProjects(prev => [...prev, result.data!]);
      setShowAddForm(false);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  const removeProject = async (id: number) => {
    if (!id) return;
    
    setIsLoading(true);
    setError('');

    const result = await ProjectUtils.removeProject(id.toString());
    
    if (result.success) {
      setProjects(prev => prev.filter(project => project.id !== id));
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex gap-4 items-center flex-wrap">
          <Button onClick={() => setShowAddForm(true)} disabled={isLoading}>
            Add New Project
          </Button>
          <div className="text-gray-600">
            Total Projects: <span className="font-semibold">{projects.length}</span>
          </div>
          {isLoading && (
            <div className="text-blue-500">Loading...</div>
          )}
          {error && (
            <div className="text-red-600 text-sm">❌ {error}</div>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading projects...</div>
        </div>
      ) : (
        <Projects 
          projects={projects} 
          onRemoveProject={removeProject} 
        />
      )}

      {showAddForm && (
        <AddProjectForm
          onAddProject={handleAddProject}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}

export default ProjectManager

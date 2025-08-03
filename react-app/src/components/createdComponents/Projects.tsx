import { useState, useEffect } from 'react'
import RemovableProject from './RemovableProject'
import { Project } from '../../Services/ProjectService'
import { UserUtils } from '../../Services/UserService'

interface ProjectsProps {
  projects: Project[];
  onRemoveProject: (id: number) => void;
}

const Projects = ({ projects, onRemoveProject }: ProjectsProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentIdResponse = await UserUtils.getIdFromToken(localStorage.getItem('jwt_token') || '');
        const currentUserId = currentIdResponse.success ? currentIdResponse.data : null;
        const currentUserResponse = currentUserId ? await UserUtils.getUserById(currentUserId) : null;
        const fetchedUser = currentUserResponse?.success ? currentUserResponse.data : null;
        
        console.log('username: ', fetchedUser?.name, 'from id: ', currentUserId);
        setCurrentUser(fetchedUser);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

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
          currentUser={currentUser ? currentUser.name.toString() : undefined}
        />
      ))}
    </ul>
  )
}

export default Projects
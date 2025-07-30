import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Project } from '../../Services/ProjectService'
import { UserUtils, User } from '../../Services/UserService'

interface AddProjectFormProps {
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onCancel: () => void;
}

const AddProjectForm = ({ onAddProject, onCancel }: AddProjectFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    owner: ''
  });

  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await UserUtils.getAllUsers();
        console.log(result);
        if (result.success && result.data) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      owner: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    if (!formData.owner.trim()) {
      newErrors.owner = 'Project owner is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        owner: formData.owner.trim(),
        todoList: [],
        inProgressList: [],
        doneList: []
      });

      setFormData({ name: '', description: '', owner: '' });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Add New Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter project name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter project description"
              className={`w-full px-3 py-2 border rounded-md resize-none h-20 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Project Owner</label>
            {isLoadingUsers ? (
              <div className="text-sm text-gray-500">Loading users...</div>
            ) : (
              <select
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.owner ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select project owner</option>
                {users.map((user) => (
                  <option key={user.id || user.name} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            )}
            {errors.owner && (
              <p className="text-red-500 text-sm mt-1">{errors.owner}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Add Project
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectForm;

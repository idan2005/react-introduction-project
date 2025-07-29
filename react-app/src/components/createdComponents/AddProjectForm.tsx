import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Project } from '../../Services/ProjectService'
import { UserUtils, User } from '../../Services/UserService'

interface AddProjectFormProps {
  onAddProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddProjectForm = ({ onAddProject, onCancel }: AddProjectFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ownerName: ''
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    ownerName: ''
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
      title: '',
      description: '',
      ownerName: ''
    };

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Project owner is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddProject({
        title: formData.title.trim(),
        description: formData.description.trim(),
        ownerName: formData.ownerName.trim()
      });
      
      setFormData({ title: '', description: '', ownerName: '' });
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
            <label className="block text-sm font-medium mb-1">Project Title</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter project title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
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
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.ownerName ? 'border-red-500' : 'border-gray-300'
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
            {errors.ownerName && (
              <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
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

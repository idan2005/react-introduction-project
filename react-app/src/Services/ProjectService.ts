
const API_BASE_URL = 'http://127.0.0.1:8000';


export interface Project {
  id?: number;
  name: string;
  description: string;
  owner: string;
  todoList: [];
  inProgressList?: [];
  doneList: [];
}

export interface Task{ 
    id?: string;
    name: string;
    assignedTo: string[];
    description?: string;
    status: 'todoList' | 'inProgressList' | 'doneList';
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

const getProjects = async (): Promise<ApiResponse<Project[]>> => {
  try {
    const response = await apiRequest('/projects');
    return {
      success: true,
      message: 'Projects fetched successfully',
      data: response
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch projects'
    };
  }
};

const addProject = async (projectData: Omit<Project, 'id'>): Promise<ApiResponse<Project>> => {
  try {
    const response = await apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
    return {
      success: true,
      message: 'Project created successfully',
      data: response
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to create project'
    };
  }
};

const removeProject = async (projectId: string): Promise<ApiResponse> => {
  try {
    await apiRequest(`/projects/${projectId}`, {
      method: 'DELETE'
    });

    return {
      success: true,
      message: 'Project deleted successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to delete project'
    };
  }
};

const createTask = async (projectId: number, task: Task): Promise<ApiResponse<Task>> => {
  try {
    const response = await apiRequest(`/projects/${projectId}/tasks/${task.status}`, {
      method: 'POST',
      body: JSON.stringify(task)
    });
    return {
      success: true,
      message: 'Task created successfully',
      data: response
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to create task'
    };
  }
};

export const ProjectUtils = {
  getProjects,
  addProject,
  removeProject,
  createTask
};

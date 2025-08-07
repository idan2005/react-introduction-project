import axios, { AxiosInstance } from "axios";
import { toast, Toaster } from "sonner";
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

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('jwt_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('jwt_token');
        console.error('Authentication failed - token cleared');
      }
      console.error('API Error:', error.response?.data || error.message);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Network error');
    }
  );

  return client;
};

const api = createApiClient();

const wrapApiCall = <T>(
  apiCall: Promise<any>,
  successMessage: string,
  errorMessage: string
): Promise<ApiResponse<T>> => {
  return apiCall
    .then(response => ({
      success: true,
      message: successMessage,
      data: response,
    }))
    .catch(error => ({
      success: false,
      message: error.message || errorMessage,
    }));
};

const getProjects = (): Promise<ApiResponse<Project[]>> => {
  return wrapApiCall<Project[]>(
    api.get('/projects'),
    'Projects fetched successfully',
    'Failed to fetch projects'
  );
};

const addProject = (projectData: Omit<Project, 'id'>): Promise<ApiResponse<Project>> => {
  return wrapApiCall<Project>(
    api.post('/projects', projectData),
    'Project created successfully',
    'Failed to create project'
  );
};

const removeProject = (projectId: string): Promise<ApiResponse> => {
  return wrapApiCall(
    api.delete(`/projects/${projectId}`),
    'Project deleted successfully',
    'Failed to delete project'
  );
};

const createTask = (projectId: number, task: Task): Promise<ApiResponse<Task>> => {
  return wrapApiCall<Task>(
    api.post(`/projects/${projectId}/tasks/${task.status}`, task),
    'Task created successfully',
    'Failed to create task'
  );
};

const updateTaskStatus = (projectId: number, taskId: string, fromStatus: 'todoList' | 'inProgressList' | 'doneList', toStatus: 'todoList' | 'inProgressList' | 'doneList'): Promise<ApiResponse<any>> => {
  return wrapApiCall(
    api.post(`/projects/${projectId}/tasks/move/${taskId}/${fromStatus}/${toStatus}`),
    'Task moved successfully',
    'Failed to move task'
  );
};

export const ProjectUtils = {
  getProjects,
  addProject,
  removeProject,
  createTask,
  updateTaskStatus
};

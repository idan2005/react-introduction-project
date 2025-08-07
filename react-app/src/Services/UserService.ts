import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export interface User {
  id?: string;
  name: string;
  password: string;
  registeredAt?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
interface AuthResponse {
  access_token: string;
  [key: string]: any;
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
        // Token expired or invalid - clear it and redirect to login
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

// Removed old apiRequest function - using the new api client instead

const registerUser = (name: string, password: string): Promise<ApiResponse<string>> => {
  const userData = {
    name: name.trim(),
    password: password.trim(),
  };
  
  return wrapApiCall<AuthResponse>(
    api.post('/users/register', userData),
    'User registered successfully',
    'Registration failed'
  ).then(result => ({
    ...result,
    data: result.success ? result.data?.access_token : undefined
  }));
};


const loginUser = (name: string, password: string): Promise<ApiResponse<string>> => {
    const loginData = {
      name: name.trim(),
      password: password.trim(),
    };

    return wrapApiCall<AuthResponse>(
      api.post('/users/login', loginData),
      'Login successful',
      'Login failed'
    ).then(result => ({
      ...result,
      data: result.success ? result.data?.access_token : undefined
    }));
  }

const getUserById = (userId: number): Promise<ApiResponse<User>> => {
  return wrapApiCall<User>(
    api.get(`/users/${userId}`),
    'User fetched successfully',
    'Failed to fetch user'
  );
};

const getAllUsers = (): Promise<ApiResponse<User[]>> => {
  return wrapApiCall<{ users: User[] } | User[]>(
    api.get('/users'),
    'Users fetched successfully',
    'Failed to fetch users'
  ).then(result => ({
    ...result,
    data: result.success ? (Array.isArray(result.data) ? result.data : result.data?.users) : undefined
  }));
};

const getIdFromToken = (token: string): Promise<ApiResponse<number>> => {
  return wrapApiCall<number>(
    api.get(`/users/decode-token/${token}`),
    'UserId fetched successfully',
    'Failed to fetch user'
  );
};

export const UserUtils = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  getIdFromToken,
};

export default UserUtils;

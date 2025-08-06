import axios, { AxiosRequestConfig } from 'axios';

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

const apiRequest = async (endpoint: string, options: AxiosRequestConfig = {}): Promise<any> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await axios({
      url,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
    } else {
      throw error;
    }
  }
};

const registerUser = async (name: string, password: string): Promise<ApiResponse<string>> => {
  try {
    const userData = {
      name: name.trim(),
      password: password.trim(),
    };

    const response = await apiRequest('/users/register', {
      method: 'POST',
      data: userData, 
    });

    return {
      success: true,
      message: 'User registered successfully',
      data: response.access_token,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Registration failed',
    };
  }
};

const loginUser = async (name: string, password: string): Promise<ApiResponse<string>> => {
  try {
    const loginData = {
      name: name.trim(),
      password: password.trim(),
    };

    const response = await apiRequest('/users/login', {
      method: 'POST',
      data: loginData,
    });

    return {
      success: true,
      message: 'Login successful',
      data: response.access_token,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Login failed',
    };
  }
};

const getUserById = async (userId: number): Promise<ApiResponse<User>> => {
  try {
    const response = await apiRequest(`/users/${userId}`);
    return {
      success: true,
      message: 'User fetched successfully',
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch user',
    };
  }
};

const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await apiRequest('/users');
    return {
      success: true,
      message: 'Users fetched successfully',
      data: response.users || response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch users',
    };
  }
};

const getIdFromToken = async (token: string): Promise<ApiResponse<number>> => {
  try {
    const response = await apiRequest(`/users/decode-token/${token}`);
    return {
      success: true,
      message: 'UserId fetched successfully',
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch user',
    };
  }
};

export const UserUtils = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  getIdFromToken,
};

export default UserUtils;

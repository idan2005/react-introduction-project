const API_BASE_URL = 'http://127.0.0.1:8000'

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

const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('jwt_token');
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
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


const registerUser = async (name: string, password: string): Promise<ApiResponse<string>> => {
  try {
    const userData = {
      name: name.trim(),
      password: password.trim()
    };

    const response = await apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    return {
      success: true,
      message: 'User registered successfully',
      data: response.access_token
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Registration failed'
    };
  }
};

const loginUser = async (name: string, password: string): Promise<ApiResponse<string>> => {
  try {
    const loginData = {
      name: name.trim(),
      password: password.trim()
    };

    const response = await apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(loginData)
    });

    return {
      success: true,
      message: 'Login successful',
      data: response.access_token
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Login failed'
    };
  }
};

const getUserById = async (userId: number): Promise<ApiResponse<User>> => {
  try {
    const response = await apiRequest(`/users/${userId}`);
    
    return {
      success: true,
      message: 'User fetched successfully',
      data: response
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch user'
    };
  }
};

const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await apiRequest('/users');
    
    return {
      success: true,
      message: 'Users fetched successfully',
      data: response.users || response 
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch users'
    };
  }
};
const getIdFromToken = async (token: string): Promise<ApiResponse<number>> => {
  try {
    const response = await apiRequest(`/users/decode-token/${token}`);
    return {
      success: true,
      message: 'UserId fetched successfully',
      data: response
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch user'
    };
  }
};

export const UserUtils = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  getIdFromToken
};

export default UserUtils;
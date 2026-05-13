import api from '../../../services/axios';
import { LoginCredentials, LoginResponse } from '../authTypes';
import { ApiResponse } from '../../../types';
import { User } from '../../../types';

/**
 * Auth API service - handles all auth-related HTTP requests.
 */
const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/logout');
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};

export default authApi;

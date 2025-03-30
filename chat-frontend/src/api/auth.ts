import api from './axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/user';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/login', credentials);
    console.log('Login successful, received user data:', response.data);
    
    // Lưu user vào localStorage để có phương án dự phòng
    if (response.data && response.data.id) {
      localStorage.setItem('chatUser', JSON.stringify({
        id: response.data.id,
        username: response.data.username
      }));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/signup', userData);
    console.log('Registration successful, received response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration API error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/logout');
    console.log('Logout successful');
    // Clear cookie and localStorage after successful logout
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('chatUser');
  } catch (error) {
    console.error('Logout API error:', error);
    // Clear cookie and localStorage anyway even if API fails
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('chatUser');
    throw error;
  }
};

export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    console.log('Calling refresh token API...');
    const response = await api.post<AuthResponse>('/refresh');
    console.log('Refresh token API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Refresh token API error:', error);
    throw error;
  }
};

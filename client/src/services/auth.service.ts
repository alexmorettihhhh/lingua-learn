import api from './api';
import { ILoginData, IRegisterData, IUser } from '../types';

// Интерфейс для ответа при аутентификации
interface AuthResponse {
  success: boolean;
  token: string;
  user: IUser;
  message?: string;
}

// Регистрация пользователя
export const register = async (userData: IRegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

// Вход пользователя
export const login = async (userData: ILoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', userData);
  return response.data;
};

// Получение данных текущего пользователя
export const getCurrentUser = async (): Promise<{ success: boolean; user: IUser }> => {
  const response = await api.get<{ success: boolean; user: IUser }>('/auth/me');
  return response.data;
};

// Обновление пароля
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put<{ success: boolean; message: string }>(
    '/auth/updatepassword',
    { currentPassword, newPassword }
  );
  return response.data;
};

// Выход пользователя (локальная очистка)
export const logout = (): void => {
  localStorage.removeItem('token');
}; 
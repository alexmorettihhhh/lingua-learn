import api from './api';
import { IUser, IProgress, ApiResponse } from '../types';

// Получение прогресса пользователя
export const getUserProgress = async (): Promise<ApiResponse<IProgress[]>> => {
  const response = await api.get<ApiResponse<IProgress[]>>('/users/me/progress');
  return response.data;
};

// Обновление языков пользователя
export const updateUserLanguage = async (
  language: string,
  level: 'beginner' | 'intermediate' | 'advanced'
): Promise<ApiResponse<IUser>> => {
  const response = await api.put<ApiResponse<IUser>>('/users/me/languages', {
    language,
    level,
  });
  return response.data;
};

// Получение всех пользователей (только для админов)
export const getUsers = async (): Promise<ApiResponse<IUser[]>> => {
  const response = await api.get<ApiResponse<IUser[]>>('/users');
  return response.data;
};

// Получение пользователя по ID (только для админов)
export const getUser = async (id: string): Promise<ApiResponse<IUser>> => {
  const response = await api.get<ApiResponse<IUser>>(`/users/${id}`);
  return response.data;
};

// Обновление пользователя (только для админов)
export const updateUser = async (
  id: string,
  userData: Partial<IUser>
): Promise<ApiResponse<IUser>> => {
  const response = await api.put<ApiResponse<IUser>>(`/users/${id}`, userData);
  return response.data;
};

// Удаление пользователя (только для админов)
export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/users/${id}`);
  return response.data;
}; 
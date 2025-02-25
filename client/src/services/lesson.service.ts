import api from './api';
import { ILesson, ApiResponse } from '../types';
import axios from 'axios';
import { getAuthHeader } from '../utils/auth';
import { API_URL } from '../config';

// Получение всех уроков с пагинацией
export const getLessons = async (
  page = 1,
  limit = 20
): Promise<ApiResponse<ILesson[]>> => {
  const response = await api.get<ApiResponse<ILesson[]>>(
    `/lessons?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Получение урока по ID
export const getLesson = async (id: string): Promise<ApiResponse<ILesson>> => {
  const response = await api.get<ApiResponse<ILesson>>(`/lessons/${id}`);
  return response.data;
};

// Получение уроков по языку
export const getLessonsByLanguage = async (
  language: string,
  page = 1,
  limit = 20
): Promise<ApiResponse<ILesson[]>> => {
  const response = await api.get<ApiResponse<ILesson[]>>(
    `/lessons/language/${language}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Получение уроков по уровню
export const getLessonsByLevel = async (
  level: string,
  page = 1,
  limit = 20
): Promise<ApiResponse<ILesson[]>> => {
  const response = await api.get<ApiResponse<ILesson[]>>(
    `/lessons/level/${level}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Создание нового урока (только для админов)
export const createLesson = async (
  lessonData: Partial<ILesson>
): Promise<ApiResponse<ILesson>> => {
  const response = await api.post<ApiResponse<ILesson>>('/lessons', lessonData);
  return response.data;
};

// Обновление урока (только для админов)
export const updateLesson = async (
  id: string,
  lessonData: Partial<ILesson>
): Promise<ApiResponse<ILesson>> => {
  const response = await api.put<ApiResponse<ILesson>>(
    `/lessons/${id}`,
    lessonData
  );
  return response.data;
};

// Удаление урока (только для админов)
export const deleteLesson = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/lessons/${id}`);
  return response.data;
};

/**
 * Start a lesson
 * @param id - The ID of the lesson to start
 */
export const startLesson = async (id: string): Promise<{
  success: boolean;
  message?: string;
  data?: any;
}> => {
  try {
    const response = await axios.post(
      `${API_URL}/lessons/${id}/start`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Ошибка при начале урока',
      };
    }
    return {
      success: false,
      message: 'Не удалось начать урок. Проверьте подключение к интернету.',
    };
  }
}; 
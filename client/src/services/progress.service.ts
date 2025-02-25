import api from './api';
import { ApiResponse, IProgress } from '../types';
import axios from 'axios';
import { getAuthHeader } from '../utils/auth';
import { API_URL } from '../config';

export interface IProgressResponse {
  success: boolean;
  message?: string;
  data?: {
    lessonId: string;
    userId: string;
    completedWords: string[];
    completionPercentage: number;
    lastAccessed: Date;
  };
}

/**
 * Получает прогресс для конкретного урока
 * @param lessonId ID урока
 * @returns Объект с данными о прогрессе
 */
export const getLessonProgress = async (lessonId: string): Promise<IProgressResponse> => {
  try {
    const response = await api.get<IProgressResponse>(`/progress/lesson/${lessonId}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Ошибка при получении прогресса',
      };
    }
    return {
      success: false,
      message: 'Не удалось получить прогресс. Проверьте подключение к интернету.',
    };
  }
};

/**
 * Обновляет прогресс для конкретного урока
 * @param lessonId ID урока
 * @param data Данные о прогрессе (процент завершения)
 * @returns Объект с результатом операции
 */
export const updateLessonProgress = async (
  lessonId: string, 
  data: { completionPercentage: number }
): Promise<IProgressResponse> => {
  try {
    const response = await api.post<IProgressResponse>(
      `/progress/update`,
      { lessonId, ...data }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Ошибка при обновлении прогресса',
      };
    }
    return {
      success: false,
      message: 'Не удалось обновить прогресс. Проверьте подключение к интернету.',
    };
  }
};

/**
 * Получает весь прогресс пользователя
 * @returns Объект со всеми данными о прогрессе
 */
export const getAllProgress = async (): Promise<ApiResponse<IProgress[]>> => {
  try {
    const response = await api.get<ApiResponse<IProgress[]>>(`/progress`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Ошибка при получении прогресса',
      };
    }
    return {
      success: false,
      message: 'Не удалось получить прогресс. Проверьте подключение к интернету.',
    };
  }
};

/**
 * Обновляет прогресс для конкретного слова в уроке
 * @param lessonId ID урока
 * @param wordId ID слова
 * @returns Объект с результатом операции
 */
export const updateWordProgress = async (
  lessonId: string, 
  wordId: string
): Promise<IProgressResponse> => {
  try {
    const response = await api.post<IProgressResponse>(
      `/progress/update`,
      { lessonId, wordId }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Ошибка при обновлении прогресса',
      };
    }
    return {
      success: false,
      message: 'Не удалось обновить прогресс. Проверьте подключение к интернету.',
    };
  }
};

/**
 * Получает общий прогресс пользователя
 * @returns Объект с общими данными о прогрессе
 */
export interface IUserProgressResponse {
  success: boolean;
  message?: string;
  data?: {
    completedLessons: number;
    totalLessons: number;
    completedWords: number;
    totalWords: number;
    overallPercentage: number;
  };
}

export const getUserProgress = async (): Promise<IUserProgressResponse> => {
  try {
    const response = await api.get<IUserProgressResponse>(`/progress/user`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Ошибка при получении прогресса',
      };
    }
    return {
      success: false,
      message: 'Не удалось получить прогресс. Проверьте подключение к интернету.',
    };
  }
};

/**
 * Сбрасывает прогресс для конкретного урока
 * @param lessonId ID урока
 * @returns Объект с результатом операции
 */
export const resetLessonProgress = async (lessonId: string): Promise<IProgressResponse> => {
  try {
    const response = await api.delete<IProgressResponse>(`/progress/lesson/${lessonId}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Ошибка при сбросе прогресса',
      };
    }
    return {
      success: false,
      message: 'Не удалось сбросить прогресс. Проверьте подключение к интернету.',
    };
  }
}; 
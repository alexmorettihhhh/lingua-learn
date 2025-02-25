import api from './api';
import { IWord, ApiResponse } from '../types';

// Получение всех слов с пагинацией
export const getWords = async (
  page = 1,
  limit = 50
): Promise<ApiResponse<IWord[]>> => {
  const response = await api.get<ApiResponse<IWord[]>>(
    `/words?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Получение слова по ID
export const getWord = async (id: string): Promise<ApiResponse<IWord>> => {
  const response = await api.get<ApiResponse<IWord>>(`/words/${id}`);
  return response.data;
};

// Получение слов по языку
export const getWordsByLanguage = async (
  language: string,
  page = 1,
  limit = 50
): Promise<ApiResponse<IWord[]>> => {
  const response = await api.get<ApiResponse<IWord[]>>(
    `/words/language/${language}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Получение слов по категории
export const getWordsByCategory = async (
  category: string,
  page = 1,
  limit = 50
): Promise<ApiResponse<IWord[]>> => {
  const response = await api.get<ApiResponse<IWord[]>>(
    `/words/category/${category}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Создание нового слова (только для админов)
export const createWord = async (wordData: Partial<IWord>): Promise<ApiResponse<IWord>> => {
  const response = await api.post<ApiResponse<IWord>>('/words', wordData);
  return response.data;
};

// Обновление слова (только для админов)
export const updateWord = async (
  id: string,
  wordData: Partial<IWord>
): Promise<ApiResponse<IWord>> => {
  const response = await api.put<ApiResponse<IWord>>(`/words/${id}`, wordData);
  return response.data;
};

// Удаление слова (только для админов)
export const deleteWord = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/words/${id}`);
  return response.data;
}; 
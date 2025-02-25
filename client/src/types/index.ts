// Типы пользователя
export interface IUser {
  _id: string;
  id?: string;
  name: string;
  username: string;
  email: string;
  role: string;
  languages?: IUserLanguage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserLanguage {
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
}

// Типы для аутентификации
export interface IAuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

// Типы для слов
export interface IWord {
  _id: string;
  original: string;
  translation: string;
  language: string;
  category: string;
  difficulty: number | string;
  examples?: string[];
  imageUrl?: string;
  audioUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Типы для уроков
export interface ILesson {
  _id: string;
  title: string;
  description: string;
  language: string;
  level: string;
  category: string;
  words: IWord[] | string[];
  imageUrl?: string;
  order?: number;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Типы для прогресса пользователя
export interface IProgress {
  _id?: string;
  userId: string;
  lessonId: string;
  completedWords: string[];
  completionPercentage: number;
  lastAccessed?: Date;
}

// Типы для пагинации
export interface IPagination {
  total: number;
  page: number;
  pages: number;
}

// Типы для ответов API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: IPagination;
}

// Alias for backward compatibility
export type IApiResponse<T> = ApiResponse<T>;
export type IUserProgress = IProgress; 
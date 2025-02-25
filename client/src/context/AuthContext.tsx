import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types';
import * as authService from '../services/auth.service';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: IUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authService.getCurrentUser();
      
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        setIsAuthenticated(true);
        setUser(response.user);
      } else {
        setError(response.message || 'Ошибка входа');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || 
        'Ошибка сервера. Пожалуйста, попробуйте позже.'
      );
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register({ name, email, password });
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        setIsAuthenticated(true);
        setUser(response.user);
      } else {
        setError(response.message || 'Ошибка регистрации');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || 
        'Ошибка сервера. Пожалуйста, попробуйте позже.'
      );
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 
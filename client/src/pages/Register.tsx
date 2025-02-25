import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    await register(name, email, password);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-amoled-dark rounded-lg shadow-md border border-amoled-light">
      <h1 className="text-2xl font-bold text-center mb-6 text-amoled-text-primary">Регистрация</h1>
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-amoled-text-secondary text-sm font-bold mb-2" htmlFor="name">
            Имя
          </label>
          <input
            className="shadow appearance-none border border-amoled-light rounded w-full py-2 px-3 bg-amoled-gray text-amoled-text-primary leading-tight focus:outline-none focus:border-amoled-accent"
            id="name"
            type="text"
            placeholder="Имя"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-amoled-text-secondary text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border border-amoled-light rounded w-full py-2 px-3 bg-amoled-gray text-amoled-text-primary leading-tight focus:outline-none focus:border-amoled-accent"
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-amoled-text-secondary text-sm font-bold mb-2" htmlFor="password">
            Пароль
          </label>
          <input
            className="shadow appearance-none border border-amoled-light rounded w-full py-2 px-3 bg-amoled-gray text-amoled-text-primary leading-tight focus:outline-none focus:border-amoled-accent"
            id="password"
            type="password"
            placeholder="Пароль"
            name="password"
            value={password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-amoled-text-secondary text-sm font-bold mb-2" htmlFor="confirmPassword">
            Подтверждение пароля
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 bg-amoled-gray text-amoled-text-primary leading-tight focus:outline-none focus:border-amoled-accent ${
              passwordError ? 'border-red-700' : 'border-amoled-light'
            }`}
            id="confirmPassword"
            type="password"
            placeholder="Подтверждение пароля"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
          {passwordError && (
            <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-amoled-accent hover:bg-opacity-90 text-amoled-text-primary font-bold py-2 px-4 rounded focus:outline-none"
            type="submit"
          >
            Зарегистрироваться
          </button>
          <Link
            to="/login"
            className="inline-block align-baseline font-bold text-sm text-amoled-accent hover:text-opacity-90"
          >
            Уже есть аккаунт?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/user.service';
import { IUserLanguage } from '../types';
import api from '../services/api';

const Profile: React.FC = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  const languages = [
    { code: 'en', name: 'Английский' },
    { code: 'fr', name: 'Французский' },
    { code: 'de', name: 'Немецкий' },
    { code: 'es', name: 'Испанский' },
    { code: 'it', name: 'Итальянский' },
    { code: 'zh', name: 'Китайский' },
    { code: 'ja', name: 'Японский' },
    { code: 'ru', name: 'Русский' },
  ];

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLanguage) {
      setMessage({ text: 'Пожалуйста, выберите язык', type: 'error' });
      return;
    }

    try {
      const response = await userService.updateUserLanguage(selectedLanguage, selectedLevel);
      if (response.success) {
        setMessage({ text: 'Язык успешно добавлен', type: 'success' });
        // Update the user in context if available
        if (updateAuthUser && response.data) {
          updateAuthUser(response.data);
        }
      } else {
        setMessage({ text: response.message || 'Ошибка при добавлении языка', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Ошибка при добавлении языка', type: 'error' });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?._id) return;
    
    try {
      const response = await userService.updateUser(user._id, {
        name: editForm.name,
        username: editForm.username,
        email: editForm.email
      });
      
      if (response.success) {
        setMessage({ text: 'Профиль успешно обновлен', type: 'success' });
        setIsEditing(false);
        // Update the user in context if available
        if (updateAuthUser && response.data) {
          updateAuthUser(response.data);
        }
      } else {
        setMessage({ text: response.message || 'Ошибка при обновлении профиля', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Ошибка при обновлении профиля', type: 'error' });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ text: 'Пароли не совпадают', type: 'error' });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ text: 'Пароль должен содержать не менее 6 символов', type: 'error' });
      return;
    }
    
    try {
      // Use a separate API endpoint for password changes
      const response = await api.put(`/users/${user?._id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.data.success) {
        setPasswordMessage({ text: 'Пароль успешно изменен', type: 'success' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordMessage({ text: response.data.message || 'Ошибка при изменении пароля', type: 'error' });
      }
    } catch (error) {
      setPasswordMessage({ text: 'Ошибка при изменении пароля', type: 'error' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-amoled-black">
      <h1 className="text-3xl font-bold mb-6 text-amoled-text-primary">Профиль</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-amoled-gray rounded-full flex items-center justify-center mb-4 border-2 border-amoled-accent">
                <span className="text-2xl font-bold text-amoled-accent">
                  {(user?.name || user?.username)?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-amoled-text-primary">{user?.name || user?.username}</h2>
              <p className="text-amoled-text-secondary mb-4">{user?.email}</p>
              <p className="text-sm bg-amoled-gray text-amoled-accent px-3 py-1 rounded-full">
                {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </p>
              
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-amoled-accent hover:bg-amoled-accent-hover text-amoled-text-primary font-medium py-2 px-4 rounded-md transition-colors w-full"
                >
                  Редактировать профиль
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {message.text && (
            <div 
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-900 text-green-100 border border-green-700' : 'bg-red-900 text-red-100 border border-red-700'
              }`}
            >
              {message.text}
            </div>
          )}
          
          {isEditing ? (
            <div className="bg-amoled-dark p-6 rounded-lg shadow-md mb-8 border border-amoled-light animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Редактировать профиль</h2>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="name">
                    Имя
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="username">
                    Имя пользователя
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                
                <div className="flex space-x-4 pt-2">
                  <button
                    type="submit"
                    className="bg-amoled-accent hover:bg-amoled-accent-hover text-amoled-text-primary font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Сохранить
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        name: user?.name || '',
                        username: user?.username || '',
                        email: user?.email || ''
                      });
                    }}
                    className="bg-amoled-gray hover:bg-amoled-light text-amoled-text-primary font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-amoled-dark p-6 rounded-lg shadow-md mb-8 border border-amoled-light">
              <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Мои языки</h2>
              
              {user?.languages && user.languages.length > 0 ? (
                <div className="mb-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-amoled-gray rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-amoled-light text-amoled-text-primary">
                          <th className="py-3 px-4 text-left">Язык</th>
                          <th className="py-3 px-4 text-left">Уровень</th>
                          <th className="py-3 px-4 text-left">Прогресс</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.languages.map((lang: IUserLanguage, index: number) => (
                          <tr key={index} className="border-b border-amoled-light">
                            <td className="py-3 px-4 text-amoled-text-primary">
                              {languages.find(l => l.code === lang.language)?.name || lang.language}
                            </td>
                            <td className="py-3 px-4 text-amoled-text-primary capitalize">
                              {lang.level === 'beginner' ? 'Начинающий' : 
                               lang.level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="w-full bg-amoled-light rounded-full h-2.5">
                                <div 
                                  className="bg-amoled-accent h-2.5 rounded-full" 
                                  style={{ width: `${lang.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-amoled-text-secondary mt-1 inline-block">{lang.progress}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-amoled-text-secondary mb-6">Вы еще не добавили ни одного языка.</p>
              )}
              
              <h3 className="text-lg font-medium mb-3 text-amoled-text-primary">Добавить язык</h3>
              <form onSubmit={handleAddLanguage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="language">
                      Язык
                    </label>
                    <select
                      id="language"
                      className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      <option value="">Выберите язык</option>
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="level">
                      Уровень
                    </label>
                    <select
                      id="level"
                      className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                    >
                      <option value="beginner">Начинающий</option>
                      <option value="intermediate">Средний</option>
                      <option value="advanced">Продвинутый</option>
                    </select>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="bg-amoled-accent hover:bg-amoled-accent-hover text-amoled-text-primary font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Добавить язык
                </button>
              </form>
            </div>
          )}
          
          <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light">
            <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Настройки аккаунта</h2>
            
            {passwordMessage.text && (
              <div 
                className={`mb-4 p-3 rounded-lg ${
                  passwordMessage.type === 'success' ? 'bg-green-900 text-green-100 border border-green-700' : 'bg-red-900 text-red-100 border border-red-700'
                }`}
              >
                {passwordMessage.text}
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-amoled-text-primary">Изменить пароль</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="currentPassword">
                    Текущий пароль
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                    placeholder="Текущий пароль"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="newPassword">
                    Новый пароль
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                    placeholder="Новый пароль"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="confirmPassword">
                    Подтверждение пароля
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                    placeholder="Подтверждение пароля"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  />
                </div>
                
                <button
                  type="submit"
                  className="bg-amoled-accent hover:bg-amoled-accent-hover text-amoled-text-primary font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Изменить пароль
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
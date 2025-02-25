import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/user.service';
import { IUserLanguage } from '../types';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [message, setMessage] = useState({ text: '', type: '' });

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

  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLanguage) {
      setMessage({ text: 'Пожалуйста, выберите язык', type: 'error' });
      return;
    }

    try {
      await userService.updateUserLanguage(selectedLanguage, selectedLevel);
      setMessage({ text: 'Язык успешно добавлен', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Ошибка при добавлении языка', type: 'error' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Профиль</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  {(user?.name || user?.username)?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold">{user?.name || user?.username}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Мои языки</h2>
            
            {message.text && (
              <div 
                className={`mb-4 p-3 rounded ${
                  message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}
            
            {user?.languages && user.languages.length > 0 ? (
              <div className="mb-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="py-3 px-4 text-left">Язык</th>
                        <th className="py-3 px-4 text-left">Уровень</th>
                        <th className="py-3 px-4 text-left">Прогресс</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.languages.map((lang: IUserLanguage, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">
                            {languages.find(l => l.code === lang.language)?.name || lang.language}
                          </td>
                          <td className="py-3 px-4 capitalize">
                            {lang.level === 'beginner' ? 'Начинающий' : 
                             lang.level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${lang.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{lang.progress}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mb-6">У вас пока нет выбранных языков.</p>
            )}
            
            <h3 className="text-lg font-medium mb-3">Добавить язык</h3>
            <form onSubmit={handleAddLanguage} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
                    Язык
                  </label>
                  <select
                    id="language"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
                    Уровень
                  </label>
                  <select
                    id="level"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Добавить язык
              </button>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Настройки аккаунта</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Изменить пароль</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                    Текущий пароль
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Текущий пароль"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                    Новый пароль
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Новый пароль"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Подтверждение пароля
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Подтверждение пароля"
                  />
                </div>
                
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
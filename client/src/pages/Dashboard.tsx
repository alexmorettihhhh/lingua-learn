import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IUserLanguage } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать, {user?.name || user?.username}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Ваши языки</h2>
          {user?.languages && user.languages.length > 0 ? (
            <ul className="space-y-2">
              {user.languages.map((lang: IUserLanguage, index: number) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="capitalize">{lang.language}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {lang.level}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Вы еще не добавили ни одного языка</p>
          )}
          <Link
            to="/profile"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Управление языками
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Статистика обучения</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Изучено слов:</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div>
              <p className="text-gray-600">Завершено уроков:</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div>
              <p className="text-gray-600">Текущая серия:</p>
              <p className="text-2xl font-bold">0 дней</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Быстрый доступ</h2>
          <div className="space-y-3">
            <Link
              to="/words"
              className="block w-full py-2 px-4 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
            >
              Словарь
            </Link>
            <Link
              to="/lessons"
              className="block w-full py-2 px-4 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
            >
              Уроки
            </Link>
            <Link
              to="/profile"
              className="block w-full py-2 px-4 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
            >
              Профиль
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Рекомендуемые уроки</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-gray-500">Загрузка рекомендаций...</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Слова для повторения</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-gray-500">Загрузка слов...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
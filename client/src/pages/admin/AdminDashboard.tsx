import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Управление словами</h2>
          <p className="text-gray-600 mb-4">
            Добавляйте, редактируйте и удаляйте слова в базе данных.
          </p>
          <Link
            to="/admin/words"
            className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition-colors"
          >
            Управление словами
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Управление уроками</h2>
          <p className="text-gray-600 mb-4">
            Создавайте и редактируйте уроки, добавляйте слова в уроки.
          </p>
          <Link
            to="/admin/lessons"
            className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition-colors"
          >
            Управление уроками
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Управление пользователями</h2>
          <p className="text-gray-600 mb-4">
            Просматривайте и редактируйте информацию о пользователях.
          </p>
          <Link
            to="/admin/users"
            className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition-colors"
          >
            Управление пользователями
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Статистика системы</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-gray-600 text-sm">Всего пользователей</p>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-gray-600 text-sm">Всего слов</p>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center">
            <p className="text-gray-600 text-sm">Всего уроков</p>
            <p className="text-3xl font-bold text-yellow-600">0</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="text-gray-600 text-sm">Активных пользователей</p>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Последние действия</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Действие</th>
                <th className="py-3 px-4 text-left">Пользователь</th>
                <th className="py-3 px-4 text-left">Дата</th>
                <th className="py-3 px-4 text-left">Детали</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4" colSpan={4}>
                  <p className="text-center text-gray-500">Нет данных для отображения</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
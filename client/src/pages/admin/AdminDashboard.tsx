import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 admin-panel">
      <h1 className={`text-4xl font-bold mb-8 ${animateIn ? 'animate-fade-in' : 'opacity-0'}`}>
        Панель администратора
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`admin-card ${animateIn ? 'animate-fade-in delay-100' : 'opacity-0'}`}>
          <h2 className="text-xl font-semibold mb-4">Управление словами</h2>
          <p className="text-amoled-text-secondary mb-4">
            Добавляйте, редактируйте и удаляйте слова в базе данных.
          </p>
          <Link
            to="/admin/words"
            className="admin-button"
          >
            Управление словами
          </Link>
        </div>
        
        <div className={`admin-card ${animateIn ? 'animate-fade-in delay-200' : 'opacity-0'}`}>
          <h2 className="text-xl font-semibold mb-4">Управление уроками</h2>
          <p className="text-amoled-text-secondary mb-4">
            Создавайте и редактируйте уроки, добавляйте слова в уроки.
          </p>
          <Link
            to="/admin/lessons"
            className="admin-button"
          >
            Управление уроками
          </Link>
        </div>
        
        <div className={`admin-card ${animateIn ? 'animate-fade-in delay-300' : 'opacity-0'}`}>
          <h2 className="text-xl font-semibold mb-4">Управление пользователями</h2>
          <p className="text-amoled-text-secondary mb-4">
            Просматривайте и редактируйте информацию о пользователях.
          </p>
          <Link
            to="/admin/users"
            className="admin-button"
          >
            Управление пользователями
          </Link>
        </div>
      </div>
      
      <div className={`admin-card mb-8 ${animateIn ? 'animate-fade-in delay-400' : 'opacity-0'}`}>
        <h2 className="text-xl font-semibold mb-6">Статистика системы</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card stat-users">
            <p>Всего пользователей</p>
            <p className="text-amoled-accent">0</p>
          </div>
          <div className="stat-card stat-words">
            <p>Всего слов</p>
            <p className="text-green-400">0</p>
          </div>
          <div className="stat-card stat-lessons">
            <p>Всего уроков</p>
            <p className="text-yellow-400">0</p>
          </div>
          <div className="stat-card stat-active">
            <p>Активных пользователей</p>
            <p className="text-purple-400">0</p>
          </div>
        </div>
      </div>
      
      <div className={`admin-card ${animateIn ? 'animate-fade-in delay-400' : 'opacity-0'}`}>
        <h2 className="text-xl font-semibold mb-6">Последние действия</h2>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Действие</th>
                <th>Пользователь</th>
                <th>Дата</th>
                <th>Детали</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4}>
                  <p className="text-center text-amoled-text-secondary py-4">Нет данных для отображения</p>
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
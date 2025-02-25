import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as userService from '../../services/user.service';
import { IUser } from '../../types';

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    fetchUsers();
    setAnimateIn(true);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.message || 'Ошибка при загрузке пользователей');
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      setLoading(true);
      const response = await userService.deleteUser(deleteId);
      if (response.success) {
        setUsers(users.filter(user => user._id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
      } else {
        setError(response.message);
      }
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 admin-panel">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-4xl font-bold ${animateIn ? 'animate-fade-in' : 'opacity-0'}`}>
          Управление пользователями
        </h1>
      </div>

      <div className={`admin-card mb-8 ${animateIn ? 'animate-fade-in delay-100' : 'opacity-0'}`}>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-amoled-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-amoled-text-secondary">
            Пользователи не найдены.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Языки</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className={`${animateIn ? `animate-fade-in delay-${(index % 5) * 100}` : 'opacity-0'}`}>
                    <td>
                      <div className="font-medium text-amoled-text-primary">{user.name}</div>
                    </td>
                    <td>
                      <div className="text-amoled-text-secondary">{user.email}</div>
                    </td>
                    <td>
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-900 bg-opacity-30 text-purple-400 border border-purple-700' 
                          : 'bg-blue-900 bg-opacity-30 text-blue-400 border border-blue-700'
                      }`}>
                        {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    </td>
                    <td>
                      <div>
                        {user.languages && user.languages.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.languages.map((lang, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-amoled-gray rounded-full text-amoled-text-secondary border border-amoled-light">
                                {lang.language} ({lang.level})
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-amoled-text-disabled">Нет языков</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-3">
                        <Link
                          to={`/admin/users/edit/${user._id}`}
                          className="text-amoled-accent hover:text-purple-400 transition-colors"
                        >
                          Редактировать
                        </Link>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteClick(user._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            Удалить
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in">
          <div className="admin-card max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-amoled-text-primary">Подтверждение удаления</h3>
            <p className="mb-6 text-amoled-text-secondary">Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-amoled-gray text-amoled-text-primary rounded hover:bg-amoled-light transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserList; 
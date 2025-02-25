import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as wordService from '../../services/word.service';
import { IWord } from '../../types';

const AdminWordList: React.FC = () => {
  const [words, setWords] = useState<IWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<string | null>(null);

  const languages = [
    { code: '', name: 'Все языки' },
    { code: 'en', name: 'Английский' },
    { code: 'fr', name: 'Французский' },
    { code: 'de', name: 'Немецкий' },
    { code: 'es', name: 'Испанский' },
    { code: 'it', name: 'Итальянский' },
    { code: 'zh', name: 'Китайский' },
    { code: 'ja', name: 'Японский' },
    { code: 'ru', name: 'Русский' },
  ];

  const categories = [
    { code: '', name: 'Все категории' },
    { code: 'basic', name: 'Базовые слова' },
    { code: 'food', name: 'Еда' },
    { code: 'travel', name: 'Путешествия' },
    { code: 'business', name: 'Бизнес' },
    { code: 'technology', name: 'Технологии' },
    { code: 'nature', name: 'Природа' },
    { code: 'health', name: 'Здоровье' },
  ];

  useEffect(() => {
    fetchWords();
  }, [currentPage, selectedLanguage, selectedCategory]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (selectedLanguage && selectedCategory) {
        // В реальном приложении нужно реализовать API для фильтрации по языку и категории одновременно
        response = await wordService.getWordsByLanguage(selectedLanguage, currentPage);
      } else if (selectedLanguage) {
        response = await wordService.getWordsByLanguage(selectedLanguage, currentPage);
      } else if (selectedCategory) {
        response = await wordService.getWordsByCategory(selectedCategory, currentPage);
      } else {
        response = await wordService.getWords(currentPage);
      }
      
      if (response.success && response.data) {
        setWords(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        }
      } else {
        setError('Не удалось загрузить слова');
      }
    } catch (err) {
      setError('Ошибка при загрузке слов');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (id: string) => {
    setWordToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!wordToDelete) return;
    
    try {
      const response = await wordService.deleteWord(wordToDelete);
      
      if (response.success) {
        setWords(words.filter(word => word._id !== wordToDelete));
        setShowDeleteModal(false);
        setWordToDelete(null);
      } else {
        setError('Не удалось удалить слово');
      }
    } catch (err) {
      setError('Ошибка при удалении слова');
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          &laquo;
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          &raquo;
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление словами</h1>
        <Link
          to="/admin/words/create"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Добавить слово
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
              Язык
            </label>
            <select
              id="language"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Категория
            </label>
            <select
              id="category"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Слова не найдены. Попробуйте изменить фильтры или добавьте новые слова.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">Слово</th>
                    <th className="py-3 px-4 text-left">Перевод</th>
                    <th className="py-3 px-4 text-left">Язык</th>
                    <th className="py-3 px-4 text-left">Категория</th>
                    <th className="py-3 px-4 text-left">Сложность</th>
                    <th className="py-3 px-4 text-left">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((word) => (
                    <tr key={word._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{word.original}</td>
                      <td className="py-3 px-4">{word.translation}</td>
                      <td className="py-3 px-4">{word.language}</td>
                      <td className="py-3 px-4">{word.category}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            String(word.difficulty) === 'easy'
                              ? 'bg-green-100 text-green-800'
                              : String(word.difficulty) === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {String(word.difficulty) === 'easy'
                            ? 'Легкий'
                            : String(word.difficulty) === 'medium'
                            ? 'Средний'
                            : 'Сложный'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/words/edit/${word._id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(word._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {renderPagination()}
          </>
        )}
      </div>
      
      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Подтверждение удаления</h2>
            <p className="mb-6">Вы уверены, что хотите удалить это слово? Это действие нельзя отменить.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setWordToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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

export default AdminWordList; 
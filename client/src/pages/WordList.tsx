import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as wordService from '../services/word.service';
import { IWord } from '../types';
import '../styles/animations.css';

const WordList: React.FC = () => {
  const [words, setWords] = useState<IWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  const languageOptions = [
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

  useEffect(() => {
    fetchWords();
  }, [selectedLanguage, selectedCategory, page]);

  useEffect(() => {
    // Сброс страницы при изменении фильтров
    if (page !== 1) {
      setPage(1);
    } else {
      fetchWords();
    }
  }, [selectedLanguage, selectedCategory]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (selectedLanguage && selectedCategory) {
        // Если выбраны и язык, и категория, используем общий запрос с фильтрацией на клиенте
        response = await wordService.getWordsByLanguage(selectedLanguage, page);
        if (response.success && response.data) {
          setWords(response.data.filter((word: IWord) => word.category === selectedCategory));
        }
      } else if (selectedLanguage) {
        response = await wordService.getWordsByLanguage(selectedLanguage, page);
        if (response.success && response.data) {
          setWords(response.data);
        }
      } else if (selectedCategory) {
        response = await wordService.getWordsByCategory(selectedCategory, page);
        if (response.success && response.data) {
          setWords(response.data);
        }
      } else {
        response = await wordService.getWords(page);
        if (response.success && response.data) {
          setWords(response.data);
        }
      }

      if (response.success) {
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        }

        // Собираем уникальные категории и языки для фильтров
        if (response.data && response.data.length > 0) {
          const uniqueCategories = Array.from(
            new Set(response.data.map((word: IWord) => word.category))
          ) as string[];
          const uniqueLanguages = Array.from(
            new Set(response.data.map((word: IWord) => word.language))
          ) as string[];
          
          setCategories(uniqueCategories);
          setLanguages(uniqueLanguages);
        }
      } else {
        setError(response.message || 'Ошибка при загрузке слов');
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка при загрузке слов');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            page === i
              ? 'bg-amoled-accent text-amoled-text-primary'
              : 'bg-amoled-gray text-amoled-text-secondary hover:bg-amoled-light'
          }`}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-3 py-1 mx-1 rounded ${
            page === 1
              ? 'bg-amoled-gray text-amoled-text-secondary opacity-50 cursor-not-allowed'
              : 'bg-amoled-gray text-amoled-text-secondary hover:bg-amoled-light'
          }`}
        >
          &laquo;
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-3 py-1 mx-1 rounded ${
            page === totalPages
              ? 'bg-amoled-gray text-amoled-text-secondary opacity-50 cursor-not-allowed'
              : 'bg-amoled-gray text-amoled-text-secondary hover:bg-amoled-light'
          }`}
        >
          &raquo;
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-amoled-black animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-amoled-text-primary">Словарь</h1>

      <div className="bg-amoled-dark p-6 rounded-lg shadow-md mb-8 border border-amoled-light">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-amoled-text-primary text-sm font-bold mb-2" htmlFor="language">
              Язык
            </label>
            <select
              id="language"
              className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {languageOptions.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-amoled-text-primary text-sm font-bold mb-2" htmlFor="category">
              Категория
            </label>
            <select
              id="category"
              className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-amoled-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-8 text-amoled-text-secondary">
            Слова не найдены. Попробуйте изменить фильтры.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-amoled-gray rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-amoled-light text-amoled-text-primary">
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
                    <tr key={word._id} className="border-b border-amoled-light hover:bg-amoled-gray">
                      <td className="py-3 px-4 text-amoled-text-primary">{word.original}</td>
                      <td className="py-3 px-4 text-amoled-text-primary">{word.translation}</td>
                      <td className="py-3 px-4 text-amoled-text-primary">
                        {languageOptions.find(lang => lang.code === word.language)?.name || word.language}
                      </td>
                      <td className="py-3 px-4 text-amoled-text-primary">{word.category}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            String(word.difficulty) === 'easy'
                              ? 'bg-green-900 text-green-100'
                              : String(word.difficulty) === 'medium'
                              ? 'bg-yellow-900 text-yellow-100'
                              : 'bg-red-900 text-red-100'
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
                        <Link
                          to={`/words/${word._id}`}
                          className="text-amoled-accent hover:text-amoled-accent-hover mr-3"
                        >
                          Подробнее
                        </Link>
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
    </div>
  );
};

export default WordList; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as lessonService from '../services/lesson.service';
import { ILesson } from '../types';

const LessonList: React.FC = () => {
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const levelOptions = [
    { code: '', name: 'Все уровни' },
    { code: 'beginner', name: 'Начинающий' },
    { code: 'intermediate', name: 'Средний' },
    { code: 'advanced', name: 'Продвинутый' },
  ];

  useEffect(() => {
    fetchLessons();
  }, [selectedLanguage, selectedLevel, page]);

  useEffect(() => {
    // Сброс страницы при изменении фильтров
    if (page !== 1) {
      setPage(1);
    } else {
      fetchLessons();
    }
  }, [selectedLanguage, selectedLevel]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (selectedLanguage && selectedLevel) {
        // Если выбраны и язык, и уровень, используем запрос по языку и фильтруем на клиенте
        response = await lessonService.getLessonsByLanguage(selectedLanguage, page);
        if (response.success && response.data) {
          setLessons(response.data.filter((lesson: ILesson) => lesson.level === selectedLevel));
        }
      } else if (selectedLanguage) {
        response = await lessonService.getLessonsByLanguage(selectedLanguage, page);
        if (response.success && response.data) {
          setLessons(response.data);
        }
      } else if (selectedLevel) {
        response = await lessonService.getLessonsByLevel(selectedLevel, page);
        if (response.success && response.data) {
          setLessons(response.data);
        }
      } else {
        response = await lessonService.getLessons(page);
        if (response.success && response.data) {
          setLessons(response.data);
        }
      }

      if (response.success) {
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        }
      } else {
        setError(response.message || 'Ошибка при загрузке уроков');
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка при загрузке уроков');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(e.target.value);
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
              ? 'bg-amoled-accent text-amoled-text-primary font-bold'
              : 'bg-amoled-gray text-amoled-text-secondary hover:bg-amoled-light hover:text-amoled-text-primary transition-colors'
          }`}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-3 py-1 mx-1 rounded ${
            page === 1
              ? 'bg-amoled-gray text-amoled-text-disabled cursor-not-allowed opacity-50'
              : 'bg-amoled-gray text-amoled-text-secondary hover:bg-amoled-light hover:text-amoled-text-primary transition-colors'
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
              ? 'bg-amoled-gray text-amoled-text-disabled cursor-not-allowed opacity-50'
              : 'bg-amoled-gray text-amoled-text-secondary hover:bg-amoled-light hover:text-amoled-text-primary transition-colors'
          }`}
        >
          &raquo;
        </button>
      </div>
    );
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-900 text-green-100';
      case 'intermediate':
        return 'bg-yellow-900 text-yellow-100';
      case 'advanced':
        return 'bg-red-900 text-red-100';
      default:
        return 'bg-amoled-gray text-amoled-text-secondary';
    }
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Начинающий';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return level;
    }
  };

  const getLanguageName = (code: string) => {
    return languageOptions.find(lang => lang.code === code)?.name || code;
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-amoled-dark">
      <h1 className="text-3xl font-bold mb-8 text-amoled-text-primary text-center">Доступные уроки</h1>

      <div className="bg-amoled-dark p-6 rounded-lg shadow-lg mb-8 border border-amoled-light">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-amoled-text-primary text-sm font-bold mb-2" htmlFor="language">
              Язык
            </label>
            <select
              id="language"
              className="shadow border border-amoled-light rounded w-full py-3 px-4 bg-amoled-gray text-amoled-text-primary leading-tight focus:outline-none focus:border-amoled-accent focus:ring-1 focus:ring-amoled-accent transition-colors"
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
            <label className="block text-amoled-text-primary text-sm font-bold mb-2" htmlFor="level">
              Уровень
            </label>
            <select
              id="level"
              className="shadow border border-amoled-light rounded w-full py-3 px-4 bg-amoled-gray text-amoled-text-primary leading-tight focus:outline-none focus:border-amoled-accent focus:ring-1 focus:ring-amoled-accent transition-colors"
              value={selectedLevel}
              onChange={handleLevelChange}
            >
              {levelOptions.map((level) => (
                <option key={level.code} value={level.code}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-16 h-16 border-4 border-amoled-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-lg mb-6 shadow-md">
            <p className="font-medium">{error}</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12 text-amoled-text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-amoled-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl">Уроки не найдены. Попробуйте изменить фильтры.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <Link 
                  to={`/lessons/${lesson._id}`} 
                  key={lesson._id} 
                  className="bg-amoled-gray border border-amoled-light rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  {lesson.imageUrl ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={lesson.imageUrl}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-amoled-dark flex items-center justify-center">
                      <span className="text-amoled-accent text-4xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-amoled-text-primary group-hover:text-amoled-accent transition-colors">
                        {lesson.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelBadgeClass(lesson.level)}`}>
                        {getLevelName(lesson.level)}
                      </span>
                    </div>
                    <p className="text-amoled-text-secondary mb-4 line-clamp-3">
                      {lesson.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-amoled-text-secondary">
                        {getLanguageName(lesson.language)}
                      </span>
                      <span className="inline-flex items-center text-amoled-accent group-hover:translate-x-1 transition-transform">
                        Начать
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonList; 
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as lessonService from '../services/lesson.service';
import * as progressService from '../services/progress.service';
import { ILesson, IWord } from '../types';

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingLesson, setStartingLesson] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await lessonService.getLesson(id);
        
        if (response.success && response.data) {
          setLesson(response.data);
          
          // Fetch progress for this lesson
          try {
            const progressResponse = await progressService.getLessonProgress(id);
            if (progressResponse.success && progressResponse.data) {
              setProgress(progressResponse.data.completionPercentage);
            }
          } catch (error) {
            // If there's no progress yet, that's okay
            console.log('No progress data available');
          }
        } else {
          setError(response.message || 'Не удалось загрузить урок');
        }
      } catch (error: any) {
        setError(error.message || 'Ошибка при загрузке урока');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const startLesson = async () => {
    if (!id) return;
    
    try {
      setStartingLesson(true);
      const response = await lessonService.startLesson(id);
      
      if (response.success) {
        navigate(`/lessons/${id}/learn`);
      } else {
        setError(response.message || 'Не удалось начать урок');
        setStartingLesson(false);
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка при запуске урока');
      setStartingLesson(false);
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

  const getLanguageName = (code: string) => {
    const languageOptions = [
      { code: 'en', name: 'Английский' },
      { code: 'fr', name: 'Французский' },
      { code: 'de', name: 'Немецкий' },
      { code: 'es', name: 'Испанский' },
      { code: 'it', name: 'Итальянский' },
      { code: 'zh', name: 'Китайский' },
      { code: 'ja', name: 'Японский' },
      { code: 'ru', name: 'Русский' },
    ];
    return languageOptions.find(lang => lang.code === code)?.name || code;
  };

  const getDifficultyBadgeClass = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-900 text-green-100';
    if (difficulty <= 4) return 'bg-yellow-900 text-yellow-100';
    return 'bg-red-900 text-red-100';
  };

  // Helper function to check if a word is an IWord object
  const isWordObject = (word: string | IWord): word is IWord => {
    return typeof word === 'object' && word !== null && '_id' in word;
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-amoled-dark">
      <div className="mb-6">
        <Link to="/lessons" className="text-amoled-accent hover:text-amoled-accent-hover flex items-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Назад к урокам
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-16 h-16 border-4 border-amoled-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-lg mb-6 shadow-md">
          <p className="font-medium">{error}</p>
        </div>
      ) : lesson ? (
        <div className="bg-amoled-gray rounded-lg shadow-lg overflow-hidden border border-amoled-light">
          {/* Заголовок и изображение */}
          <div className="relative">
            {lesson.imageUrl ? (
              <div className="h-64 md:h-80 overflow-hidden">
                <img
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-64 md:h-80 bg-amoled-dark flex items-center justify-center">
                <span className="text-amoled-accent text-6xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBadgeClass(lesson.level)} mr-2`}>
                  {getLevelName(lesson.level)}
                </span>
                <span className="text-amoled-text-primary text-sm">
                  {getLanguageName(lesson.language)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-amoled-text-primary">{lesson.title}</h1>
            </div>
          </div>

          {/* Основная информация */}
          <div className="p-6">
            {progress !== null && (
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-amoled-text-secondary">Прогресс</span>
                  <span className="text-sm font-medium text-amoled-text-secondary">{progress}%</span>
                </div>
                <div className="w-full bg-amoled-dark rounded-full h-2.5">
                  <div 
                    className="bg-amoled-accent h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="prose max-w-none mb-8 text-amoled-text-primary">
              <p>{lesson.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Информация об уроке</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amoled-dark p-4 rounded-lg border border-amoled-light">
                  <div className="text-sm text-amoled-text-secondary mb-1">Количество слов</div>
                  <div className="text-lg font-medium text-amoled-text-primary">
                    {Array.isArray(lesson.words) ? lesson.words.length : 0}
                  </div>
                </div>
                <div className="bg-amoled-dark p-4 rounded-lg border border-amoled-light">
                  <div className="text-sm text-amoled-text-secondary mb-1">Примерное время</div>
                  <div className="text-lg font-medium text-amoled-text-primary">
                    {Array.isArray(lesson.words) ? Math.ceil(lesson.words.length * 1.5) : 0} минут
                  </div>
                </div>
              </div>
            </div>

            {/* Список слов */}
            {Array.isArray(lesson.words) && lesson.words.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Слова в уроке</h2>
                <div className="overflow-x-auto rounded-lg border border-amoled-light">
                  <table className="min-w-full divide-y divide-amoled-light">
                    <thead className="bg-amoled-dark">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amoled-text-secondary uppercase tracking-wider">
                          Слово
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amoled-text-secondary uppercase tracking-wider">
                          Перевод
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amoled-text-secondary uppercase tracking-wider">
                          Сложность
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-amoled-gray divide-y divide-amoled-light">
                      {lesson.words.map((word, index) => {
                        // If word is a string (ID), we can't display details
                        if (!isWordObject(word)) {
                          return (
                            <tr key={`word-${index}`} className="hover:bg-amoled-dark transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap" colSpan={3}>
                                <div className="text-sm text-amoled-text-secondary">Загрузка данных слова...</div>
                              </td>
                            </tr>
                          );
                        }
                        
                        // If word is an object, display its details
                        return (
                          <tr key={word._id} className="hover:bg-amoled-dark transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-amoled-text-primary">{word.original}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-amoled-text-secondary">{word.translation}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyBadgeClass(Number(word.difficulty) || 1)}`}>
                                {word.difficulty}/5
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Кнопка начать урок */}
            <div className="flex justify-center mt-8">
              <button
                onClick={startLesson}
                disabled={startingLesson}
                className="bg-amoled-accent hover:bg-amoled-accent-hover text-amoled-text-primary font-bold py-4 px-10 rounded-lg shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-amoled-accent focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {startingLesson ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-amoled-text-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    Загрузка...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Начать урок
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LessonDetail; 
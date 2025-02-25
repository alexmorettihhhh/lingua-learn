import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as progressService from '../services/progress.service';
import * as lessonService from '../services/lesson.service';
import { ILesson, IUserLanguage } from '../types';
import '../styles/animations.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendedLessons, setRecommendedLessons] = useState<ILesson[]>([]);
  const [recentLessons, setRecentLessons] = useState<ILesson[]>([]);
  const [stats, setStats] = useState({
    totalLessonsCompleted: 0,
    totalWordsLearned: 0,
    streakDays: 0,
    lastActive: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Получаем общий прогресс пользователя
        const progressResponse = await progressService.getUserProgress();
        if (progressResponse.success && progressResponse.data) {
          setUserProgress(progressResponse.data);
          
          // Устанавливаем статистику
          setStats({
            totalLessonsCompleted: progressResponse.data.completedLessons || 0,
            totalWordsLearned: progressResponse.data.completedWords || 0,
            streakDays: 0,
            lastActive: new Date().toLocaleDateString()
          });
        }
        
        // Получаем рекомендуемые уроки
        if (user?.languages && user.languages.length > 0) {
          const primaryLanguage = user.languages[0].language;
          const level = user.languages[0].level;
          
          const lessonsResponse = await lessonService.getLessonsByLanguage(primaryLanguage);
          if (lessonsResponse.success && lessonsResponse.data) {
            // Фильтруем уроки по уровню пользователя
            const filteredLessons = lessonsResponse.data.filter(
              (lesson: ILesson) => lesson.level === level && lesson.isPublished
            );
            
            // Берем первые 3 урока как рекомендуемые
            setRecommendedLessons(filteredLessons.slice(0, 3));
          }
        }
        
        // Получаем последние уроки (можно заменить на реальный API-запрос)
        const allLessonsResponse = await lessonService.getLessons();
        if (allLessonsResponse.success && allLessonsResponse.data) {
          // Берем последние 3 урока
          setRecentLessons(allLessonsResponse.data.slice(0, 3));
        }
      } catch (error) {
        setError('Ошибка при загрузке данных');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  const getLanguageName = (code: string): string => {
    const languages: { [key: string]: string } = {
      en: 'Английский',
      fr: 'Французский',
      de: 'Немецкий',
      es: 'Испанский',
      it: 'Итальянский',
      zh: 'Китайский',
      ja: 'Японский',
      ru: 'Русский'
    };
    
    return languages[code] || code;
  };

  const getLevelName = (level: string): string => {
    const levels: { [key: string]: string } = {
      beginner: 'Начинающий',
      intermediate: 'Средний',
      advanced: 'Продвинутый'
    };
    
    return levels[level] || level;
  };

  const renderLanguageProgress = () => {
    if (!user?.languages || user.languages.length === 0) {
      return (
        <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light">
          <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Изучаемые языки</h2>
          <p className="text-amoled-text-secondary">
            У вас пока нет изучаемых языков. Добавьте язык в{' '}
            <Link to="/profile" className="text-amoled-accent hover:text-amoled-accent-hover">
              профиле
            </Link>
            .
          </p>
        </div>
      );
    }
    
    return (
      <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light">
        <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Изучаемые языки</h2>
        <div className="space-y-6">
          {user.languages.map((language: IUserLanguage, index: number) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-medium text-amoled-text-primary">
                    {getLanguageName(language.language)}
                  </h3>
                  <p className="text-sm text-amoled-text-secondary">
                    {getLevelName(language.level)}
                  </p>
                </div>
                <span className="text-amoled-accent font-bold">{language.progress}%</span>
              </div>
              <div className="w-full bg-amoled-gray rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-amoled-accent h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${language.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStatistics = () => {
    return (
      <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light">
        <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Статистика</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-amoled-gray p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-amoled-accent">{stats.totalLessonsCompleted}</p>
            <p className="text-sm text-amoled-text-secondary">Уроков завершено</p>
          </div>
          <div className="bg-amoled-gray p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-amoled-accent">{stats.totalWordsLearned}</p>
            <p className="text-sm text-amoled-text-secondary">Слов изучено</p>
          </div>
          <div className="bg-amoled-gray p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-amoled-accent">{stats.streakDays}</p>
            <p className="text-sm text-amoled-text-secondary">Дней подряд</p>
          </div>
          <div className="bg-amoled-gray p-4 rounded-lg text-center">
            <p className="text-sm text-amoled-text-secondary">Последняя активность</p>
            <p className="text-amoled-text-primary">{stats.lastActive}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderRecommendedLessons = () => {
    if (recommendedLessons.length === 0) {
      return (
        <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light">
          <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Рекомендуемые уроки</h2>
          <p className="text-amoled-text-secondary">
            У нас пока нет рекомендаций для вас. Добавьте язык в{' '}
            <Link to="/profile" className="text-amoled-accent hover:text-amoled-accent-hover">
              профиле
            </Link>
            .
          </p>
        </div>
      );
    }
    
    return (
      <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light">
        <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Рекомендуемые уроки</h2>
        <div className="space-y-4">
          {recommendedLessons.map((lesson, index) => (
            <Link 
              key={lesson._id} 
              to={`/lessons/${lesson._id}`}
              className="block bg-amoled-gray p-4 rounded-lg hover:bg-amoled-light transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="font-medium text-amoled-text-primary mb-1">{lesson.title}</h3>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="text-xs bg-amoled-dark text-amoled-accent px-2 py-0.5 rounded-full">
                    {getLanguageName(lesson.language)}
                  </span>
                  <span className="text-xs bg-amoled-dark text-amoled-text-secondary px-2 py-0.5 rounded-full">
                    {getLevelName(lesson.level)}
                  </span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amoled-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link 
            to="/lessons" 
            className="text-amoled-accent hover:text-amoled-accent-hover inline-flex items-center"
          >
            <span>Все уроки</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    );
  };

  const renderRecentLessons = () => {
    if (recentLessons.length === 0) {
      return null;
    }
    
    return (
      <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light">
        <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Недавние уроки</h2>
        <div className="space-y-4">
          {recentLessons.map((lesson, index) => (
            <Link 
              key={lesson._id} 
              to={`/lessons/${lesson._id}`}
              className="block bg-amoled-gray p-4 rounded-lg hover:bg-amoled-light transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="font-medium text-amoled-text-primary mb-1">{lesson.title}</h3>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="text-xs bg-amoled-dark text-amoled-accent px-2 py-0.5 rounded-full">
                    {getLanguageName(lesson.language)}
                  </span>
                  <span className="text-xs bg-amoled-dark text-amoled-text-secondary px-2 py-0.5 rounded-full">
                    {getLevelName(lesson.level)}
                  </span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amoled-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-amoled-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amoled-text-primary">Панель управления</h1>
        <div className="flex space-x-4">
          <Link 
            to="/lessons" 
            className="bg-amoled-accent hover:bg-amoled-accent-hover text-amoled-text-primary px-4 py-2 rounded-md transition-colors"
          >
            Уроки
          </Link>
          <Link 
            to="/words" 
            className="bg-amoled-gray hover:bg-amoled-light text-amoled-text-primary px-4 py-2 rounded-md transition-colors"
          >
            Словарь
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-amoled-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900 text-red-100 p-4 rounded-lg border border-red-700 mb-6">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {renderLanguageProgress()}
            {renderRecommendedLessons()}
            {renderRecentLessons()}
          </div>
          <div className="space-y-6">
            <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amoled-gray rounded-full flex items-center justify-center mr-4 border-2 border-amoled-accent">
                  <span className="text-xl font-bold text-amoled-accent">
                    {(user?.name || user?.username)?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-amoled-text-primary">
                    {user?.name || user?.username}
                  </h2>
                  <p className="text-sm text-amoled-text-secondary">{user?.email}</p>
                </div>
              </div>
              <Link 
                to="/profile" 
                className="block text-center bg-amoled-gray hover:bg-amoled-light text-amoled-text-primary py-2 rounded-md transition-colors"
              >
                Редактировать профиль
              </Link>
            </div>
            
            {renderStatistics()}
            
            <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light">
              <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Ежедневная цель</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-amoled-text-secondary">Прогресс</span>
                  <span className="text-sm text-amoled-text-secondary">5/10 слов</span>
                </div>
                <div className="w-full bg-amoled-gray rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-amoled-accent h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: '50%' }}
                  ></div>
                </div>
              </div>
              <p className="text-amoled-text-secondary text-sm">
                Изучайте по 10 слов каждый день, чтобы достичь своей цели!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
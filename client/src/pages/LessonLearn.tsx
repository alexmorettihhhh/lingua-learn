import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as lessonService from '../services/lesson.service';
import * as progressService from '../services/progress.service';
import { ILesson, IWord } from '../types';
import '../styles/animations.css';

const LessonLearn: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await lessonService.getLesson(id);
        
        if (response.success && response.data) {
          setLesson(response.data);
          
          try {
            const progressResponse = await progressService.getLessonProgress(id);
            if (progressResponse.success && progressResponse.data) {
              setProgress(progressResponse.data.completionPercentage);
              setCompletedWords(progressResponse.data.completedWords || []);
              
              if (progressResponse.data.completionPercentage === 100) {
                setIsCompleted(true);
              }
            }
          } catch (error) {
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

  const handleShowTranslation = () => {
    setShowTranslation(true);
  };

  const handleKnowWord = async () => {
    if (!lesson || !id || !Array.isArray(lesson.words)) return;
    
    const currentWord = lesson.words[currentWordIndex];
    const wordId = typeof currentWord === 'object' ? currentWord._id : currentWord;
    
    if (!wordId) return;
    
    try {
      await progressService.updateWordProgress(id, wordId);
      
      if (!completedWords.includes(wordId)) {
        const newCompletedWords = [...completedWords, wordId];
        setCompletedWords(newCompletedWords);
        
        const newProgress = Math.round((newCompletedWords.length / lesson.words.length) * 100);
        setProgress(newProgress);
        if (newProgress === 100) {
          setIsCompleted(true);
        }
      }
      if (currentWordIndex < lesson.words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setShowTranslation(false);
      } else {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error updating word progress:', error);
    }
  };

  const handleDontKnowWord = () => {
    if (!lesson || !Array.isArray(lesson.words)) return;
    
    if (currentWordIndex < lesson.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowTranslation(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestartLesson = () => {
    setCurrentWordIndex(0);
    setShowTranslation(false);
    setIsCompleted(false);
  };

  const handleFinishLesson = () => {
    navigate(`/lessons/${id}`);
  };

  // Helper function to check if a word is an IWord object
  const isWordObject = (word: string | IWord): word is IWord => {
    return typeof word === 'object' && word !== null && '_id' in word;
  };

  const getCurrentWord = (): IWord | null => {
    if (!lesson || !Array.isArray(lesson.words) || lesson.words.length === 0) {
      return null;
    }
    
    const currentWord = lesson.words[currentWordIndex];
    
    if (isWordObject(currentWord)) {
      return currentWord;
    }
    
    return null;
  };

  const renderProgressBar = () => {
    return (
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-amoled-text-secondary">Прогресс</span>
          <span className="text-sm font-medium text-amoled-text-secondary">{progress}%</span>
        </div>
        <div className="w-full bg-amoled-dark rounded-full h-2.5">
          <div 
            className="bg-amoled-accent h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderWordCard = () => {
    const currentWord = getCurrentWord();
    
    if (!currentWord) {
      return (
        <div className="text-center py-8">
          <p className="text-amoled-text-secondary">Слово не найдено</p>
        </div>
      );
    }
    
    return (
      <div className="bg-amoled-dark rounded-lg p-8 shadow-lg border border-amoled-light">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-amoled-text-primary mb-2">{currentWord.original}</h3>
          {currentWord.examples && currentWord.examples.length > 0 && (
            <p className="text-amoled-text-secondary italic">
              {currentWord.examples[0]}
            </p>
          )}
        </div>
        
        {showTranslation ? (
          <div className="mb-8 text-center animate-fade-in">
            <h4 className="text-xl font-semibold text-amoled-accent mb-2">Перевод:</h4>
            <p className="text-2xl text-amoled-text-primary">{currentWord.translation}</p>
          </div>
        ) : (
          <div className="mb-8 text-center">
            <button
              onClick={handleShowTranslation}
              className="bg-amoled-gray hover:bg-amoled-light text-amoled-text-primary font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Показать перевод
            </button>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            onClick={handleDontKnowWord}
            className="bg-red-900 hover:bg-red-800 text-red-100 font-bold py-3 px-6 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50"
          >
            Не знаю
          </button>
          <button
            onClick={handleKnowWord}
            className="bg-green-900 hover:bg-green-800 text-green-100 font-bold py-3 px-6 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
          >
            Знаю
          </button>
        </div>
      </div>
    );
  };

  const renderCompletionScreen = () => {
    return (
      <div className="bg-amoled-dark rounded-lg p-8 shadow-lg border border-amoled-light text-center">
        <div className="mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-amoled-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-bold text-amoled-text-primary mt-4">Урок завершен!</h2>
          <p className="text-amoled-text-secondary mt-2">
            Вы успешно прошли урок "{lesson?.title}".
          </p>
        </div>
        
        <div className="mb-8">
          <div className="bg-amoled-gray p-4 rounded-lg inline-block">
            <p className="text-amoled-text-primary text-lg">
              Прогресс: <span className="font-bold text-amoled-accent">{progress}%</span>
            </p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleRestartLesson}
            className="bg-amoled-gray hover:bg-amoled-light text-amoled-text-primary font-bold py-3 px-6 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-amoled-light focus:ring-opacity-50"
          >
            Повторить урок
          </button>
          <button
            onClick={handleFinishLesson}
            className="bg-amoled-accent hover:bg-amoled-accent-hover text-amoled-text-primary font-bold py-3 px-6 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-amoled-accent focus:ring-opacity-50"
          >
            Завершить
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-amoled-dark">
      <div className="mb-6">
        <Link to={`/lessons/${id}`} className="text-amoled-accent hover:text-amoled-accent-hover flex items-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Вернуться к уроку
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-amoled-text-primary text-center">
            {lesson.title}
          </h1>
          
          {renderProgressBar()}
          
          {isCompleted ? renderCompletionScreen() : renderWordCard()}
        </div>
      ) : null}
    </div>
  );
};

export default LessonLearn; 
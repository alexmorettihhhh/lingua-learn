import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as wordService from '../services/word.service';
import { IWord } from '../types';

const WordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [word, setWord] = useState<IWord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError('ID слова не указан');
          return;
        }

        const response = await wordService.getWord(id);

        if (response.success && response.data) {
          setWord(response.data);
        } else {
          setError(response.message || 'Ошибка при загрузке слова');
        }
      } catch (error: any) {
        setError(error.message || 'Ошибка при загрузке слова');
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [id]);

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

  const getLanguageName = (code: string) => {
    return languageOptions.find(lang => lang.code === code)?.name || code;
  };

  const getDifficultyName = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Легкий';
      case 'medium':
        return 'Средний';
      case 'hard':
        return 'Сложный';
      default:
        return difficulty;
    }
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-16">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link to="/words" className="text-blue-600 hover:text-blue-800">
          &larr; Вернуться к списку слов
        </Link>
      </div>
    );
  }

  if (!word) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-gray-500">
          Слово не найдено.
        </div>
        <Link to="/words" className="text-blue-600 hover:text-blue-800">
          &larr; Вернуться к списку слов
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/words" className="text-blue-600 hover:text-blue-800">
          &larr; Вернуться к списку слов
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{word.original}</h1>
          <div className="mt-2 md:mt-0">
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${getDifficultyClass(String(word.difficulty))}`}
            >
              {getDifficultyName(String(word.difficulty))}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Основная информация</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Перевод</p>
                  <p className="text-lg font-medium">{word.translation}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Язык</p>
                  <p className="text-lg font-medium">{getLanguageName(word.language)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Категория</p>
                  <p className="text-lg font-medium">{word.category}</p>
                </div>
              </div>
            </div>

            {word.examples && word.examples.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Примеры использования</h2>
                <ul className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {word.examples.map((example, index) => (
                    <li key={index} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            {word.imageUrl && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Изображение</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <img
                    src={word.imageUrl}
                    alt={word.original}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}

            {word.audioUrl && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Произношение</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <audio controls className="w-full">
                    <source src={word.audioUrl} type="audio/mpeg" />
                    Ваш браузер не поддерживает аудио элемент.
                  </audio>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetail; 
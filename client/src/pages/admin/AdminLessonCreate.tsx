import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as lessonService from '../../services/lesson.service';
import * as wordService from '../../services/word.service';
import { IWord, ILesson } from '../../types';
import '../../styles/animations.css';

const AdminLessonCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<ILesson>>({
    title: '',
    description: '',
    language: '',
    level: 'beginner',
    category: '',
    words: [],
    isPublished: false
  });
  
  const [availableWords, setAvailableWords] = useState<IWord[]>([]);
  const [selectedWords, setSelectedWords] = useState<IWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [wordLoading, setWordLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWords, setFilteredWords] = useState<IWord[]>([]);

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

  const levelOptions = [
    { code: 'beginner', name: 'Начинающий' },
    { code: 'intermediate', name: 'Средний' },
    { code: 'advanced', name: 'Продвинутый' },
  ];

  const categoryOptions = [
    'Общие',
    'Путешествия',
    'Бизнес',
    'Технологии',
    'Еда',
    'Здоровье',
    'Образование',
    'Культура',
    'Спорт'
  ];

  useEffect(() => {
    if (formData.language) {
      fetchWordsByLanguage(formData.language);
    }
  }, [formData.language]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredWords(availableWords);
    } else {
      const filtered = availableWords.filter(
        word => 
          word.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.translation.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWords(filtered);
    }
  }, [searchTerm, availableWords]);

  const fetchWordsByLanguage = async (language: string) => {
    try {
      setWordLoading(true);
      const response = await wordService.getWordsByLanguage(language);
      if (response.success && response.data) {
        setAvailableWords(response.data);
        setFilteredWords(response.data);
      }
    } catch (error) {
      console.error('Error fetching words:', error);
    } finally {
      setWordLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddWord = (word: IWord) => {
    if (!selectedWords.some(w => w._id === word._id)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleRemoveWord = (wordId: string) => {
    setSelectedWords(selectedWords.filter(word => word._id !== wordId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.language || !formData.level || !formData.category) {
      setMessage({ text: 'Пожалуйста, заполните все обязательные поля', type: 'error' });
      return;
    }

    if (selectedWords.length === 0) {
      setMessage({ text: 'Пожалуйста, добавьте хотя бы одно слово в урок', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      const lessonData = {
        ...formData,
        words: selectedWords.map(word => word._id)
      };
      
      const response = await lessonService.createLesson(lessonData);
      
      if (response.success) {
        setMessage({ text: 'Урок успешно создан', type: 'success' });
        setTimeout(() => {
          navigate('/admin/lessons');
        }, 2000);
      } else {
        setMessage({ text: response.message || 'Ошибка при создании урока', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Ошибка при создании урока', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-amoled-black animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amoled-text-primary">Создание урока</h1>
        <button
          onClick={() => navigate('/admin/lessons')}
          className="bg-amoled-gray hover:bg-amoled-light text-amoled-text-primary px-4 py-2 rounded-md transition-colors"
        >
          Назад к списку
        </button>
      </div>

      {message.text && (
        <div 
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-900 text-green-100 border border-green-700' : 'bg-red-900 text-red-100 border border-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Информация об уроке</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="title">
                  Название урока *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="description">
                  Описание
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="language">
                    Язык *
                  </label>
                  <select
                    id="language"
                    name="language"
                    className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Выберите язык</option>
                    {languageOptions.map(option => (
                      <option key={option.code} value={option.code}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="level">
                    Уровень *
                  </label>
                  <select
                    id="level"
                    name="level"
                    className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                    value={formData.level}
                    onChange={handleInputChange}
                    required
                  >
                    {levelOptions.map(option => (
                      <option key={option.code} value={option.code}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-amoled-text-primary text-sm font-medium mb-2" htmlFor="category">
                    Категория *
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <input
                  id="isPublished"
                  name="isPublished"
                  type="checkbox"
                  className="h-4 w-4 text-amoled-accent focus:ring-amoled-accent border-amoled-light rounded"
                  checked={formData.isPublished}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="isPublished" className="ml-2 block text-amoled-text-primary">
                  Опубликовать урок
                </label>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-amoled-accent hover:bg-amoled-accent-hover text-amoled-text-primary font-medium py-2 px-6 rounded-md transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Создание...' : 'Создать урок'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Выбранные слова ({selectedWords.length})</h2>
            
            {selectedWords.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {selectedWords.map(word => (
                  <div 
                    key={word._id} 
                    className="flex justify-between items-center p-3 bg-amoled-gray rounded-md border border-amoled-light"
                  >
                    <div>
                      <p className="font-medium text-amoled-text-primary">{word.original}</p>
                      <p className="text-sm text-amoled-text-secondary">{word.translation}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveWord(word._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-amoled-text-secondary">Нет выбранных слов</p>
            )}
          </div>
          
          <div className="bg-amoled-dark p-6 rounded-lg shadow-md border border-amoled-light">
            <h2 className="text-xl font-semibold mb-4 text-amoled-text-primary">Доступные слова</h2>
            
            {!formData.language ? (
              <p className="text-amoled-text-secondary">Выберите язык, чтобы увидеть доступные слова</p>
            ) : (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Поиск слов..."
                    className="form-control bg-amoled-gray border-amoled-light text-amoled-text-primary w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {wordLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-8 h-8 border-2 border-amoled-accent border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredWords.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {filteredWords.map(word => (
                      <div 
                        key={word._id} 
                        className={`p-3 bg-amoled-gray rounded-md border border-amoled-light cursor-pointer hover:bg-amoled-light transition-colors ${
                          selectedWords.some(w => w._id === word._id) ? 'opacity-50' : ''
                        }`}
                        onClick={() => handleAddWord(word)}
                      >
                        <p className="font-medium text-amoled-text-primary">{word.original}</p>
                        <p className="text-sm text-amoled-text-secondary">{word.translation}</p>
                        <div className="flex mt-1">
                          <span className="text-xs bg-amoled-dark text-amoled-accent px-2 py-0.5 rounded-full">
                            {word.category}
                          </span>
                          <span className="text-xs bg-amoled-dark ml-2 px-2 py-0.5 rounded-full" style={{ color: getDifficultyColor(word.difficulty) }}>
                            {typeof word.difficulty === 'number' ? `Сложность: ${word.difficulty}` : word.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-amoled-text-secondary">Нет доступных слов для выбранного языка</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Вспомогательная функция для определения цвета сложности
const getDifficultyColor = (difficulty: number | string): string => {
  if (typeof difficulty === 'string') return '#64748b';
  
  if (difficulty <= 3) return '#4ade80'; // Легкий - зеленый
  if (difficulty <= 6) return '#facc15'; // Средний - желтый
  return '#f87171'; // Сложный - красный
};

export default AdminLessonCreate; 
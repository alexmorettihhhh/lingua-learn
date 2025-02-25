import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 bg-blue-50 rounded-lg mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-800">
            Изучайте языки эффективно с LinguaLearn
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Наша платформа использует технику интервального повторения для максимально
            эффективного запоминания слов и выражений.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Перейти к обучению
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Зарегистрироваться
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-12 text-center">Почему LinguaLearn?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Эффективность</h3>
            <p className="text-gray-600 text-center">
              Интервальное повторение позволяет запоминать слова на долгий срок, а не просто
              зубрить их.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Персонализация</h3>
            <p className="text-gray-600 text-center">
              Система адаптируется к вашему темпу обучения и показывает слова именно тогда,
              когда вам нужно их повторить.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Разнообразие</h3>
            <p className="text-gray-600 text-center">
              Множество уроков и категорий слов для разных языков и уровней подготовки.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Готовы начать?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам студентов, которые уже улучшили свои языковые навыки с
            помощью LinguaLearn.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Перейти к обучению
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Зарегистрироваться бесплатно
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 
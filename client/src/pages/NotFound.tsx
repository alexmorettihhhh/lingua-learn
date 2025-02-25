import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Страница не найдена</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Извините, страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound; 
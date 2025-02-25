import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when navigating
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [navigate]);

  return (
    <header className="bg-amoled-black text-amoled-text-primary shadow-md border-b border-amoled-light">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-amoled-accent">
            LinguaLearn
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-amoled-accent transition-colors">
              Главная
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-amoled-accent transition-colors">
                  Обучение
                </Link>
                <Link to="/words" className="hover:text-amoled-accent transition-colors">
                  Словарь
                </Link>
                <Link to="/lessons" className="hover:text-amoled-accent transition-colors">
                  Уроки
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button 
                    className="flex items-center hover:text-amoled-accent transition-colors"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="mr-1">{user?.name || user?.username}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-amoled-dark rounded-md shadow-lg py-1 z-10 border border-amoled-light">
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-amoled-text-primary hover:bg-amoled-light"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Панель администратора
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-amoled-text-primary hover:bg-amoled-light"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Профиль
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-amoled-text-primary hover:bg-amoled-light"
                      >
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-amoled-accent transition-colors"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="bg-amoled-accent text-amoled-text-primary px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-amoled-light">
            <Link
              to="/"
              className="block py-2 hover:bg-amoled-light px-2 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 hover:bg-amoled-light px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Обучение
                </Link>
                <Link
                  to="/words"
                  className="block py-2 hover:bg-amoled-light px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Словарь
                </Link>
                <Link
                  to="/lessons"
                  className="block py-2 hover:bg-amoled-light px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Уроки
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 hover:bg-amoled-light px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профиль
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block py-2 hover:bg-amoled-light px-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Панель администратора
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:bg-amoled-light px-2 rounded"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 hover:bg-amoled-light px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="block py-2 hover:bg-amoled-light px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 
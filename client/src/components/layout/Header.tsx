import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-amoled-black bg-opacity-80 backdrop-blur-lg shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold relative group">
            <span className="bg-gradient-to-r from-amoled-accent to-purple-500 bg-clip-text text-transparent">
              LinguaLearn
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amoled-accent to-purple-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none text-amoled-text-primary hover:text-amoled-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Главная
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  Обучение
                </Link>
                <Link 
                  to="/words" 
                  className={`nav-link ${isActive('/words') ? 'active' : ''}`}
                >
                  Словарь
                </Link>
                <Link 
                  to="/lessons" 
                  className={`nav-link ${isActive('/lessons') ? 'active' : ''}`}
                >
                  Уроки
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button 
                    className="flex items-center px-3 py-2 rounded-full border border-amoled-light hover:border-amoled-accent transition-all duration-300 group"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amoled-accent to-purple-500 flex items-center justify-center mr-2 text-white font-medium">
                      {(user?.name || user?.username)?.charAt(0).toUpperCase()}
                    </div>
                    <span className="mr-1 group-hover:text-amoled-accent transition-colors">{user?.name || user?.username}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 group-hover:text-amoled-accent ${isDropdownOpen ? 'transform rotate-180' : ''}`}
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
                    <div className="absolute right-0 mt-2 w-48 bg-amoled-dark rounded-lg shadow-lg py-1 z-10 border border-amoled-light overflow-hidden animate-fade-in">
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-amoled-text-primary hover:bg-amoled-light hover:text-amoled-accent transition-all duration-200"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Панель администратора
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-amoled-text-primary hover:bg-amoled-light hover:text-amoled-accent transition-all duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Профиль
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-amoled-text-primary hover:bg-amoled-light hover:text-red-400 transition-all duration-200"
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
                  className="nav-link"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-amoled-light animate-fade-in">
            <Link
              to="/"
              className={`block py-3 px-3 rounded-lg mb-1 ${isActive('/') ? 'bg-amoled-light text-amoled-accent' : 'hover:bg-amoled-light'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block py-3 px-3 rounded-lg mb-1 ${isActive('/dashboard') ? 'bg-amoled-light text-amoled-accent' : 'hover:bg-amoled-light'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Обучение
                </Link>
                <Link
                  to="/words"
                  className={`block py-3 px-3 rounded-lg mb-1 ${isActive('/words') ? 'bg-amoled-light text-amoled-accent' : 'hover:bg-amoled-light'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Словарь
                </Link>
                <Link
                  to="/lessons"
                  className={`block py-3 px-3 rounded-lg mb-1 ${isActive('/lessons') ? 'bg-amoled-light text-amoled-accent' : 'hover:bg-amoled-light'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Уроки
                </Link>
                <Link
                  to="/profile"
                  className={`block py-3 px-3 rounded-lg mb-1 ${isActive('/profile') ? 'bg-amoled-light text-amoled-accent' : 'hover:bg-amoled-light'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профиль
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`block py-3 px-3 rounded-lg mb-1 ${isActive('/admin') ? 'bg-amoled-light text-amoled-accent' : 'hover:bg-amoled-light'}`}
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
                  className="block w-full text-left py-3 px-3 rounded-lg mb-1 hover:bg-amoled-light hover:text-red-400 transition-colors"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-3 px-3 rounded-lg mb-1 hover:bg-amoled-light"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="block py-3 px-3 rounded-lg mb-1 bg-amoled-accent text-white hover:bg-opacity-90"
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
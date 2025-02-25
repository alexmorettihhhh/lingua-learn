import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Компоненты
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Страницы
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import WordList from './pages/WordList';
import LessonList from './pages/LessonList';
import LessonDetail from './pages/LessonDetail';
import LessonLearn from './pages/LessonLearn';
import WordDetail from './pages/WordDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminWordList from './pages/admin/AdminWordList';
import AdminLessonList from './pages/admin/AdminLessonList';
import AdminUserList from './pages/admin/AdminUserList';
import NotFound from './pages/NotFound';

// Стили
import './App.css';

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amoled-black">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-amoled-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-amoled-text-secondary animate-pulse">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-amoled-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Приватные маршруты */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/words" element={<PrivateRoute element={<WordList />} />} />
          <Route path="/words/:id" element={<PrivateRoute element={<WordDetail />} />} />
          <Route path="/lessons" element={<PrivateRoute element={<LessonList />} />} />
          <Route path="/lessons/:id" element={<PrivateRoute element={<LessonDetail />} />} />
          <Route path="/lessons/:id/learn" element={<PrivateRoute element={<LessonLearn />} />} />

          {/* Маршруты администратора */}
          <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
          <Route path="/admin/words" element={<AdminRoute element={<AdminWordList />} />} />
          <Route path="/admin/lessons" element={<AdminRoute element={<AdminLessonList />} />} />
          <Route path="/admin/users" element={<AdminRoute element={<AdminUserList />} />} />

          {/* Маршрут 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App; 
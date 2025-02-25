import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserProgress,
  updateUserLanguage,
} from '../controllers/user';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Все маршруты ниже требуют аутентификации
router.use(protect);

// Маршруты для обычных пользователей
router.get('/me/progress', getUserProgress);
router.put('/me/languages', updateUserLanguage);

// Маршруты для администраторов
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router; 
import express from 'express';
import {
  getWords,
  getWord,
  createWord,
  updateWord,
  deleteWord,
  getWordsByLanguage,
  getWordsByCategory,
} from '../controllers/word';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Все маршруты ниже требуют аутентификации
router.use(protect);

// Маршруты для всех пользователей
router.get('/', getWords);
router.get('/:id', getWord);
router.get('/language/:language', getWordsByLanguage);
router.get('/category/:category', getWordsByCategory);

// Маршруты только для администраторов
router.post('/', authorize('admin'), createWord);
router.put('/:id', authorize('admin'), updateWord);
router.delete('/:id', authorize('admin'), deleteWord);

export default router; 
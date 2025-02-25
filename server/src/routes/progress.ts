import express from 'express';
import {
  getLessonProgress,
  updateWordProgress,
  getAllProgress,
  getUserProgress,
  resetLessonProgress,
} from '../controllers/progress';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/', getAllProgress);

router.get('/user', getUserProgress);

router.get('/lesson/:lessonId', getLessonProgress);

router.post('/update', updateWordProgress);

router.delete('/lesson/:lessonId', resetLessonProgress);

export default router; 
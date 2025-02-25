import express from 'express';
import {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonsByLanguage,
  getLessonsByLevel,
  startLesson,
} from '../controllers/lesson';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/', getLessons);
router.get('/:id', getLesson);
router.get('/language/:language', getLessonsByLanguage);
router.get('/level/:level', getLessonsByLevel);

router.post('/:id/start', startLesson);

router.post('/', authorize('admin'), createLesson);
router.put('/:id', authorize('admin'), updateLesson);
router.delete('/:id', authorize('admin'), deleteLesson);

export default router; 
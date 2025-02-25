import { Request, Response } from 'express';
import Progress from '../models/Progress';
import Lesson from '../models/Lesson';
import mongoose from 'mongoose';

// @desc    Get progress for a specific lesson
// @route   GET /api/progress/lesson/:lessonId
// @access  Private
export const getLessonProgress = async (req: Request, res: Response) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user?.id,
      lessonId: req.params.lessonId,
    });

    if (!progress) {
      return res.status(200).json({
        success: true,
        message: 'Прогресс для данного урока не найден',
        data: {
          lessonId: req.params.lessonId,
          userId: req.user?.id,
          completedWords: [],
          completionPercentage: 0,
          lastAccessed: new Date(),
        },
      });
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Неверный формат ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении прогресса урока',
    });
  }
};

// @desc    Update word progress for a lesson
// @route   POST /api/progress/update
// @access  Private
export const updateWordProgress = async (req: Request, res: Response) => {
  try {
    const { lessonId, wordId } = req.body;

    if (!lessonId || !wordId) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать ID урока и ID слова',
      });
    }

    // Get the lesson to calculate completion percentage
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Урок не найден',
      });
    }

    // Find or create progress record
    let progress = await Progress.findOne({
      userId: req.user?.id,
      lessonId,
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user?.id,
        lessonId,
        completedWords: [wordId],
        lastAccessed: new Date(),
      });
    } else {
      // Add word to completed words if not already there
      if (!progress.completedWords.includes(wordId)) {
        progress.completedWords.push(wordId);
      }
      progress.lastAccessed = new Date();
    }

    // Calculate completion percentage
    const totalWords = lesson.words.length;
    const completedWords = progress.completedWords.length;
    progress.completionPercentage = Math.round((completedWords / totalWords) * 100);

    await progress.save();

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Неверный формат ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении прогресса',
    });
  }
};

// @desc    Get all progress for current user
// @route   GET /api/progress
// @access  Private
export const getAllProgress = async (req: Request, res: Response) => {
  try {
    const progress = await Progress.find({ userId: req.user?.id })
      .populate('lessonId', 'title language level');

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении прогресса',
    });
  }
};

// @desc    Get overall user progress across all lessons
// @route   GET /api/progress/user
// @access  Private
export const getUserProgress = async (req: Request, res: Response) => {
  try {
    // Get all lessons
    const totalLessons = await Lesson.countDocuments({ isPublished: true });
    
    // Get all words count
    const lessons = await Lesson.find({ isPublished: true });
    let totalWords = 0;
    lessons.forEach(lesson => {
      totalWords += lesson.words.length;
    });
    
    // Get completed lessons (100% completion)
    const completedLessonsProgress = await Progress.find({ 
      userId: req.user?.id,
      completionPercentage: 100
    });
    const completedLessons = completedLessonsProgress.length;
    
    // Get total completed words
    const allProgress = await Progress.find({ userId: req.user?.id });
    let completedWords = 0;
    allProgress.forEach(progress => {
      completedWords += progress.completedWords.length;
    });
    
    // Calculate overall percentage
    const overallPercentage = totalWords > 0 
      ? Math.round((completedWords / totalWords) * 100)
      : 0;
    
    res.status(200).json({
      success: true,
      data: {
        completedLessons,
        totalLessons,
        completedWords,
        totalWords,
        overallPercentage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении общего прогресса',
    });
  }
};

// @desc    Reset progress for a specific lesson
// @route   DELETE /api/progress/lesson/:lessonId
// @access  Private
export const resetLessonProgress = async (req: Request, res: Response) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user?.id,
      lessonId: req.params.lessonId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Прогресс для данного урока не найден',
      });
    }

    await progress.remove();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Прогресс урока успешно сброшен',
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Неверный формат ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при сбросе прогресса урока',
    });
  }
}; 
import { Request, Response } from 'express';
import Lesson from '../models/Lesson';
import mongoose from 'mongoose';

// @desc    Get all lessons
// @route   GET /api/lessons
// @access  Private
export const getLessons = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;

    // Фильтры
    const filter: any = {};
    
    // Для обычных пользователей показываем только опубликованные уроки
    if (req.user?.role !== 'admin') {
      filter.isPublished = true;
    }

    const total = await Lesson.countDocuments(filter);
    const lessons = await Lesson.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('words', 'original translation');

    const pagination = {
      total,
      page,
      pages: Math.ceil(total / limit),
    };

    res.status(200).json({
      success: true,
      count: lessons.length,
      pagination,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении уроков',
    });
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Private
export const getLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate(
      'words',
      'original translation examples imageUrl audioUrl'
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Урок не найден',
      });
    }

    // Проверка доступа для неопубликованных уроков
    if (!lesson.isPublished && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Нет доступа к этому уроку',
      });
    }

    res.status(200).json({
      success: true,
      data: lesson,
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
      message: 'Ошибка сервера при получении урока',
    });
  }
};

// @desc    Create new lesson
// @route   POST /api/lessons
// @access  Private/Admin
export const createLesson = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      language,
      level,
      category,
      words,
      imageUrl,
      order,
      isPublished,
    } = req.body;

    // Проверка обязательных полей
    if (!title || !description || !language || !level || !category) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, заполните все обязательные поля',
      });
    }

    const lesson = await Lesson.create({
      title,
      description,
      language,
      level,
      category,
      words: words || [],
      imageUrl,
      order: order || 0,
      isPublished: isPublished !== undefined ? isPublished : false,
    });

    res.status(201).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при создании урока',
    });
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Admin
export const updateLesson = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      language,
      level,
      category,
      words,
      imageUrl,
      order,
      isPublished,
    } = req.body;

    let lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Урок не найден',
      });
    }

    lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        language,
        level,
        category,
        words,
        imageUrl,
        order,
        isPublished,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('words', 'original translation');

    res.status(200).json({
      success: true,
      data: lesson,
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
      message: 'Ошибка сервера при обновлении урока',
    });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Урок не найден',
      });
    }

    await lesson.remove();

    res.status(200).json({
      success: true,
      data: {},
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
      message: 'Ошибка сервера при удалении урока',
    });
  }
};

// @desc    Get lessons by language
// @route   GET /api/lessons/language/:language
// @access  Private
export const getLessonsByLanguage = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;

    // Фильтры
    const filter: any = { language: req.params.language };
    
    // Для обычных пользователей показываем только опубликованные уроки
    if (req.user?.role !== 'admin') {
      filter.isPublished = true;
    }

    const total = await Lesson.countDocuments(filter);
    const lessons = await Lesson.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('words', 'original translation');

    const pagination = {
      total,
      page,
      pages: Math.ceil(total / limit),
    };

    res.status(200).json({
      success: true,
      count: lessons.length,
      pagination,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении уроков по языку',
    });
  }
};

// @desc    Get lessons by level
// @route   GET /api/lessons/level/:level
// @access  Private
export const getLessonsByLevel = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;

    // Проверка корректности уровня
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(req.params.level)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный уровень. Допустимые значения: beginner, intermediate, advanced',
      });
    }

    // Фильтры
    const filter: any = { level: req.params.level };
    
    // Для обычных пользователей показываем только опубликованные уроки
    if (req.user?.role !== 'admin') {
      filter.isPublished = true;
    }

    const total = await Lesson.countDocuments(filter);
    const lessons = await Lesson.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('words', 'original translation');

    const pagination = {
      total,
      page,
      pages: Math.ceil(total / limit),
    };

    res.status(200).json({
      success: true,
      count: lessons.length,
      pagination,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении уроков по уровню',
    });
  }
};

// @desc    Start a lesson
// @route   POST /api/lessons/:id/start
// @access  Private
export const startLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Урок не найден',
      });
    }

    // Проверка доступа для неопубликованных уроков
    if (!lesson.isPublished && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Нет доступа к этому уроку',
      });
    }

    // Здесь можно добавить логику для отслеживания начала урока,
    // например, запись в историю активности пользователя

    res.status(200).json({
      success: true,
      message: 'Урок успешно начат',
      data: {
        lessonId: lesson._id,
      },
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
      message: 'Ошибка сервера при запуске урока',
    });
  }
}; 
import { Request, Response } from 'express';
import Word from '../models/Word';
import UserProgress from '../models/UserProgress';
import mongoose from 'mongoose';

// @desc    Get all words
// @route   GET /api/words
// @access  Private
export const getWords = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const startIndex = (page - 1) * limit;

    const total = await Word.countDocuments();
    const words = await Word.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const pagination = {
      total,
      page,
      pages: Math.ceil(total / limit),
    };

    res.status(200).json({
      success: true,
      count: words.length,
      pagination,
      data: words,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении слов',
    });
  }
};

// @desc    Get single word
// @route   GET /api/words/:id
// @access  Private
export const getWord = async (req: Request, res: Response) => {
  try {
    const word = await Word.findById(req.params.id);

    if (!word) {
      return res.status(404).json({
        success: false,
        message: 'Слово не найдено',
      });
    }

    res.status(200).json({
      success: true,
      data: word,
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
      message: 'Ошибка сервера при получении слова',
    });
  }
};

// @desc    Create new word
// @route   POST /api/words
// @access  Private/Admin
export const createWord = async (req: Request, res: Response) => {
  try {
    const {
      original,
      translation,
      language,
      category,
      difficulty,
      examples,
      imageUrl,
      audioUrl,
    } = req.body;

    // Проверка обязательных полей
    if (!original || !translation || !language || !category) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, заполните все обязательные поля',
      });
    }

    const word = await Word.create({
      original,
      translation,
      language,
      category,
      difficulty: difficulty || 'medium',
      examples: examples || [],
      imageUrl,
      audioUrl,
    });

    res.status(201).json({
      success: true,
      data: word,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при создании слова',
    });
  }
};

// @desc    Update word
// @route   PUT /api/words/:id
// @access  Private/Admin
export const updateWord = async (req: Request, res: Response) => {
  try {
    const {
      original,
      translation,
      language,
      category,
      difficulty,
      examples,
      imageUrl,
      audioUrl,
    } = req.body;

    let word = await Word.findById(req.params.id);

    if (!word) {
      return res.status(404).json({
        success: false,
        message: 'Слово не найдено',
      });
    }

    word = await Word.findByIdAndUpdate(
      req.params.id,
      {
        original,
        translation,
        language,
        category,
        difficulty,
        examples,
        imageUrl,
        audioUrl,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: word,
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
      message: 'Ошибка сервера при обновлении слова',
    });
  }
};

// @desc    Delete word
// @route   DELETE /api/words/:id
// @access  Private/Admin
export const deleteWord = async (req: Request, res: Response) => {
  try {
    const word = await Word.findById(req.params.id);

    if (!word) {
      return res.status(404).json({
        success: false,
        message: 'Слово не найдено',
      });
    }

    // Удаление связанных записей прогресса пользователей
    await UserProgress.deleteMany({ wordId: req.params.id });

    await word.remove();

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
      message: 'Ошибка сервера при удалении слова',
    });
  }
};

// @desc    Get words by language
// @route   GET /api/words/language/:language
// @access  Private
export const getWordsByLanguage = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const startIndex = (page - 1) * limit;

    const total = await Word.countDocuments({ language: req.params.language });
    const words = await Word.find({ language: req.params.language })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const pagination = {
      total,
      page,
      pages: Math.ceil(total / limit),
    };

    res.status(200).json({
      success: true,
      count: words.length,
      pagination,
      data: words,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении слов по языку',
    });
  }
};

// @desc    Get words by category
// @route   GET /api/words/category/:category
// @access  Private
export const getWordsByCategory = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const startIndex = (page - 1) * limit;

    const total = await Word.countDocuments({ category: req.params.category });
    const words = await Word.find({ category: req.params.category })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const pagination = {
      total,
      page,
      pages: Math.ceil(total / limit),
    };

    res.status(200).json({
      success: true,
      count: words.length,
      pagination,
      data: words,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении слов по категории',
    });
  }
}; 
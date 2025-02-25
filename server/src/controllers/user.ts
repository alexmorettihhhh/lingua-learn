import { Request, Response } from 'express';
import User from '../models/User';
import UserProgress from '../models/UserProgress';
import mongoose from 'mongoose';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении пользователей',
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
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
      message: 'Ошибка сервера при получении пользователя',
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, languages } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
    }

    // Обновление полей
    const updatedFields: any = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (role) updatedFields.role = role;
    if (languages) updatedFields.languages = languages;

    user = await User.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
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
      message: 'Ошибка сервера при обновлении пользователя',
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
    }

    // Удаление связанных записей прогресса
    await UserProgress.deleteMany({ userId: req.params.id });

    await user.remove();

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
      message: 'Ошибка сервера при удалении пользователя',
    });
  }
};

// @desc    Get user progress
// @route   GET /api/users/me/progress
// @access  Private
export const getUserProgress = async (req: Request, res: Response) => {
  try {
    const userProgress = await UserProgress.find({ userId: req.user?.id })
      .populate('wordId', 'original translation language category');

    res.status(200).json({
      success: true,
      count: userProgress.length,
      data: userProgress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении прогресса пользователя',
    });
  }
};

// @desc    Update user language
// @route   PUT /api/users/me/languages
// @access  Private
export const updateUserLanguage = async (req: Request, res: Response) => {
  try {
    const { language, level } = req.body;

    if (!language || !level) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, укажите язык и уровень',
      });
    }

    // Проверка корректности уровня
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный уровень. Допустимые значения: beginner, intermediate, advanced',
      });
    }

    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
    }

    // Проверка, есть ли уже такой язык
    const existingLanguageIndex = user.languages.findIndex(
      (lang) => lang.language === language
    );

    if (existingLanguageIndex !== -1) {
      // Обновление существующего языка
      user.languages[existingLanguageIndex].level = level;
    } else {
      // Добавление нового языка
      user.languages.push({
        language,
        level,
        progress: 0,
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении языка пользователя',
    });
  }
}; 
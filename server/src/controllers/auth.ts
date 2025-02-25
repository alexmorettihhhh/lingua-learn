import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import mongoose from 'mongoose';

// Генерация JWT токена
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = process.env.JWT_EXPIRE || '30d';
  
  return jwt.sign({ id }, secret, { expiresIn } as jwt.SignOptions);
};

// @desc    Регистрация пользователя
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Проверка обязательных полей
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, заполните все поля',
      });
    }

    // Проверка существования пользователя
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует',
      });
    }

    // Создание пользователя
    const user = await User.create({
      name,
      email,
      password,
    });

    // Генерация токена
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        languages: user.languages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при регистрации пользователя',
    });
  }
};

// @desc    Вход пользователя
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Проверка обязательных полей
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, укажите email и пароль',
      });
    }

    // Поиск пользователя
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверные учетные данные',
      });
    }

    // Проверка пароля
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Неверные учетные данные',
      });
    }

    // Генерация токена
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        languages: user.languages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при входе пользователя',
    });
  }
};

// @desc    Получение текущего пользователя
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        languages: user.languages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении данных пользователя',
    });
  }
};

// @desc    Обновление пароля
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Проверка обязательных полей
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, укажите текущий и новый пароль',
      });
    }

    // Поиск пользователя
    const user = await User.findById(req.user?.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
    }

    // Проверка текущего пароля
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Неверный текущий пароль',
      });
    }

    // Обновление пароля
    user.password = newPassword;
    await user.save();

    // Генерация нового токена
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      message: 'Пароль успешно обновлен',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении пароля',
    });
  }
}; 
import express from 'express';
import { register, login, getMe, updatePassword } from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

// Эндпоинт для выдачи прав администратора (только в режиме разработки)
if (process.env.NODE_ENV === 'development') {
  router.post('/make-admin', async (req, res) => {
    try {
      const { email, secretKey } = req.body;
      
      // Проверка секретного ключа (должен совпадать с JWT_SECRET)
      if (secretKey !== process.env.JWT_SECRET) {
        return res.status(401).json({
          success: false,
          message: 'Неверный секретный ключ',
        });
      }
      
      // Импорт модели User
      const User = require('../models/User').default;
      
      // Поиск пользователя по email
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден',
        });
      }
      
      // Обновление роли пользователя
      user.role = 'admin';
      await user.save();
      
      res.status(200).json({
        success: true,
        message: `Пользователь ${user.name} (${user.email}) теперь администратор`,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message,
      });
    }
  });
}

export default router; 
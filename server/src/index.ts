import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Импорт маршрутов
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import wordRoutes from './routes/word';
import lessonRoutes from './routes/lesson';
import progressRoutes from './routes/progress';

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);

// Базовый маршрут
app.get('/', (req, res) => {
  res.send('LinguaLearn API is running');
});

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lingua-learn')
  .then(() => {
    console.log('Connected to MongoDB');
    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default app; 
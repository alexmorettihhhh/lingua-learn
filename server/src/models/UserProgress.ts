import mongoose from 'mongoose';

// Интерфейс для модели прогресса пользователя
export interface IUserProgress extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  wordId: mongoose.Types.ObjectId;
  repetitionCount: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewed: Date;
  nextReviewDate: Date;
  easeFactor: number;
  interval: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
  createdAt: Date;
  updatedAt: Date;
}

// Схема прогресса пользователя
const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Word',
      required: true,
    },
    repetitionCount: {
      type: Number,
      default: 0,
    },
    correctCount: {
      type: Number,
      default: 0,
    },
    incorrectCount: {
      type: Number,
      default: 0,
    },
    lastReviewed: {
      type: Date,
      default: Date.now,
    },
    nextReviewDate: {
      type: Date,
      default: Date.now,
    },
    easeFactor: {
      type: Number,
      default: 2.5, // Начальный фактор легкости (по алгоритму SuperMemo)
    },
    interval: {
      type: Number,
      default: 1, // Интервал в днях
    },
    status: {
      type: String,
      enum: ['new', 'learning', 'review', 'mastered'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

// Создание составного индекса для уникальности пары пользователь-слово
userProgressSchema.index({ userId: 1, wordId: 1 }, { unique: true });

// Создание модели
const UserProgress = mongoose.model<IUserProgress>(
  'UserProgress',
  userProgressSchema
);

export default UserProgress; 
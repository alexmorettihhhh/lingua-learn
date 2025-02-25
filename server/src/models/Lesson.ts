import mongoose from 'mongoose';

// Интерфейс для модели урока
export interface ILesson extends mongoose.Document {
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  words: mongoose.Types.ObjectId[];
  imageUrl?: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Схема урока
const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Пожалуйста, укажите название урока'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Пожалуйста, укажите описание урока'],
      trim: true,
    },
    language: {
      type: String,
      required: [true, 'Пожалуйста, укажите язык'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: [true, 'Пожалуйста, укажите уровень сложности'],
    },
    category: {
      type: String,
      required: [true, 'Пожалуйста, укажите категорию'],
      trim: true,
    },
    words: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word',
      },
    ],
    imageUrl: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Создание индекса для более быстрого поиска по языку и уровню
lessonSchema.index({ language: 1, level: 1 });

// Создание модели
const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);

export default Lesson; 
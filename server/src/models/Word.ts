import mongoose from 'mongoose';

// Интерфейс для модели слова
export interface IWord extends mongoose.Document {
  original: string;
  translation: string;
  language: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examples: string[];
  imageUrl?: string;
  audioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Схема слова
const wordSchema = new mongoose.Schema(
  {
    original: {
      type: String,
      required: [true, 'Пожалуйста, укажите оригинальное слово или фразу'],
      trim: true,
    },
    translation: {
      type: String,
      required: [true, 'Пожалуйста, укажите перевод'],
      trim: true,
    },
    language: {
      type: String,
      required: [true, 'Пожалуйста, укажите язык'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Пожалуйста, укажите категорию'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    examples: [
      {
        type: String,
        trim: true,
      },
    ],
    imageUrl: {
      type: String,
      trim: true,
    },
    audioUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Создание модели
const Word = mongoose.model<IWord>('Word', wordSchema);

export default Word; 
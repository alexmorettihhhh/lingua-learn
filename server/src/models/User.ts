import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

// Интерфейс для модели пользователя
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  languages: {
    language: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    progress: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Пожалуйста, укажите ваше имя'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Пожалуйста, укажите ваш email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Пожалуйста, укажите корректный email'],
    },
    password: {
      type: String,
      required: [true, 'Пожалуйста, укажите пароль'],
      minlength: [8, 'Пароль должен содержать минимум 8 символов'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    languages: [
      {
        language: {
          type: String,
          required: true,
        },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced'],
          default: 'beginner',
        },
        progress: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>('save', async function (next) {
  // Хешируем пароль только если он был изменен
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Создание модели
const User = mongoose.model<IUser>('User', userSchema);

export default User; 
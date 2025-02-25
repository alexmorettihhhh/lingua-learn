import mongoose from 'mongoose';

// Interface for the Progress model
export interface IProgress extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  completedWords: mongoose.Types.ObjectId[];
  completionPercentage: number;
  lastAccessed: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Progress schema
const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    completedWords: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Word',
    }],
    completionPercentage: {
      type: Number,
      default: 0,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for uniqueness of user-lesson pair
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const Progress = mongoose.model<IProgress>('Progress', progressSchema);

export default Progress; 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lingua-learn')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Lesson schema for the script
const lessonSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    language: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    category: String,
    words: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word',
      },
    ],
    imageUrl: String,
    order: Number,
    isPublished: Boolean,
  },
  {
    timestamps: true,
  }
);

// Create Lesson model
const Lesson = mongoose.model('Lesson', lessonSchema);

// Sample lessons data
const lessons = [
  {
    title: 'Основы английского языка',
    description: 'Изучите базовые слова и фразы для начинающих. Этот урок поможет вам освоить основы английского языка и начать строить простые предложения.',
    language: 'en',
    level: 'beginner',
    category: 'basics',
    words: [],
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    order: 1,
    isPublished: true
  },
  {
    title: 'Повседневные разговоры',
    description: 'Научитесь вести повседневные разговоры на английском языке. Этот урок включает в себя фразы для общения в магазинах, ресторанах и на улице.',
    language: 'en',
    level: 'beginner',
    category: 'conversation',
    words: [],
    imageUrl: 'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    order: 2,
    isPublished: true
  },
  {
    title: 'Деловой английский',
    description: 'Изучите деловую лексику и фразы для профессионального общения. Этот урок поможет вам уверенно вести деловые переговоры и переписку.',
    language: 'en',
    level: 'intermediate',
    category: 'business',
    words: [],
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    order: 3,
    isPublished: true
  },
  {
    title: 'Идиомы и сленг',
    description: 'Познакомьтесь с популярными английскими идиомами и сленговыми выражениями. Этот урок поможет вам понимать носителей языка и звучать более естественно.',
    language: 'en',
    level: 'advanced',
    category: 'idioms',
    words: [],
    imageUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    order: 4,
    isPublished: true
  },
  {
    title: 'Основы французского языка',
    description: 'Изучите базовые слова и фразы для начинающих. Этот урок поможет вам освоить основы французского языка и начать строить простые предложения.',
    language: 'fr',
    level: 'beginner',
    category: 'basics',
    words: [],
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    order: 1,
    isPublished: true
  },
  {
    title: 'Французская кухня',
    description: 'Изучите названия блюд и кулинарные термины на французском языке. Этот урок поможет вам разбираться в меню и обсуждать гастрономические темы.',
    language: 'fr',
    level: 'intermediate',
    category: 'food',
    words: [],
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    order: 2,
    isPublished: true
  },
  {
    title: 'Основы немецкого языка',
    description: 'Изучите базовые слова и фразы для начинающих. Этот урок поможет вам освоить основы немецкого языка и начать строить простые предложения.',
    language: 'de',
    level: 'beginner',
    category: 'basics',
    words: [],
    imageUrl: 'https://images.unsplash.com/photo-1527866512907-a35a62a0f6c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    order: 1,
    isPublished: true
  },
  {
    title: 'Немецкая грамматика',
    description: 'Изучите основные правила немецкой грамматики. Этот урок поможет вам разобраться в падежах, артиклях и структуре предложений.',
    language: 'de',
    level: 'intermediate',
    category: 'grammar',
    words: [],
    imageUrl: 'https://images.unsplash.com/photo-1568793504045-3b6b7b6b3e08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    order: 2,
    isPublished: true
  },
  {
    title: 'Основы испанского языка',
    description: 'Изучите базовые слова и фразы для начинающих. Этот урок поможет вам освоить основы испанского языка и начать строить простые предложения.',
    language: 'es',
    level: 'beginner',
    category: 'basics',
    words: [],
    imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    order: 1,
    isPublished: true
  },
  {
    title: 'Испанская культура',
    description: 'Познакомьтесь с испанской культурой и традициями. Этот урок поможет вам лучше понять менталитет и образ жизни испанцев.',
    language: 'es',
    level: 'intermediate',
    category: 'culture',
    words: [],
    imageUrl: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    order: 2,
    isPublished: true
  }
];

// Function to add lessons
async function addLessons() {
  try {
    // Clear existing lessons
    await Lesson.deleteMany({});
    console.log('Existing lessons deleted');
    
    // Add new lessons
    const result = await Lesson.insertMany(lessons);
    console.log(`${result.length} lessons added successfully`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error adding lessons:', error);
    mongoose.disconnect();
  }
}

// Run the function
addLessons(); 
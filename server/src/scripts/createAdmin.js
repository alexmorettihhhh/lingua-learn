const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

// Определение модели пользователя
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  languages: Array,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Получение аргументов командной строки
const name = process.argv[2];
const email = process.argv[3];
const password = process.argv[4];

if (!name || !email || !password) {
  console.error('Пожалуйста, укажите имя, email и пароль');
  console.log('Пример: node src/scripts/createAdmin.js "Имя Администратора" admin@example.com password123');
  process.exit(1);
}

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lingua-learn')
  .then(async () => {
    console.log('Подключено к MongoDB');
    
    try {
      // Проверка, существует ли пользователь с таким email
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      
      if (existingUser) {
        console.error(`Пользователь с email ${email} уже существует`);
        process.exit(1);
      }
      
      // Хеширование пароля
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Создание нового пользователя
      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
        languages: [],
      });
      
      await newUser.save();
      
      console.log(`Администратор ${name} (${email}) успешно создан`);
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
    } finally {
      // Закрытие соединения с MongoDB
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  }); 
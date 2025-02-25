/**
 * Скрипт для обновления роли пользователя до администратора
 * Запуск: node src/scripts/makeAdmin.js your@email.com
 */

const mongoose = require('mongoose');
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
});

const User = mongoose.model('User', userSchema);

// Получение email из аргументов командной строки
const email = process.argv[2];

if (!email) {
  console.error('Пожалуйста, укажите email пользователя');
  console.log('Пример: node src/scripts/makeAdmin.js your@email.com');
  process.exit(1);
}

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lingua-learn')
  .then(async () => {
    console.log('Подключено к MongoDB');
    
    try {
      // Поиск пользователя по email
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        console.error(`Пользователь с email ${email} не найден`);
        process.exit(1);
      }
      
      // Обновление роли пользователя
      user.role = 'admin';
      await user.save();
      
      console.log(`Пользователь ${user.name} (${user.email}) теперь администратор`);
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
    } finally {
      // Закрытие соединения с MongoDB
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  }); 
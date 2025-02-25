/**
 * Скрипт для выдачи прав администратора через API
 * Запуск: node src/scripts/makeAdmin.js your@email.com your_jwt_secret
 */

const axios = require('axios');

// Получение аргументов командной строки
const email = process.argv[2];
const secretKey = process.argv[3];
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

if (!email || !secretKey) {
  console.error('Пожалуйста, укажите email пользователя и секретный ключ');
  console.log('Пример: node src/scripts/makeAdmin.js your@email.com your_jwt_secret');
  process.exit(1);
}

// Вызов API-эндпоинта
async function makeAdmin() {
  try {
    const response = await axios.post(`${apiUrl}/auth/make-admin`, {
      email,
      secretKey
    });
    
    console.log(response.data.message);
  } catch (error) {
    if (error.response) {
      console.error('Ошибка:', error.response.data.message);
    } else {
      console.error('Ошибка:', error.message);
    }
  }
}

makeAdmin(); 
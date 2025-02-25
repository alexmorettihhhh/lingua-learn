import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-amoled-dark text-amoled-text-primary py-8 border-t border-amoled-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-amoled-accent">LinguaLearn</h3>
            <p className="text-amoled-text-secondary">
              Эффективное изучение языков с использованием техник интервального повторения.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-amoled-text-primary">Ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-amoled-text-secondary hover:text-amoled-accent">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/words" className="text-amoled-text-secondary hover:text-amoled-accent">
                  Словарь
                </Link>
              </li>
              <li>
                <Link to="/lessons" className="text-amoled-text-secondary hover:text-amoled-accent">
                  Уроки
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-amoled-text-primary">Контакты</h3>
            <ul className="space-y-2 text-amoled-text-secondary">
              <li>Email: info@lingualean.com</li>
              <li>Телефон: +7 (123) 456-78-90</li>
              <li>Адрес: г. Москва, ул. Примерная, 123</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-amoled-light mt-8 pt-6 text-center text-amoled-text-disabled">
          <p>&copy; {currentYear} LinguaLearn. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
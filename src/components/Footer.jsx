import { Link } from 'react-router-dom';
import { mySocials } from '../constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black-200 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="text-blue-500">Port</span>folio
            </h3>
            <p className="text-gray-400 text-sm">
              Веб-разработчик, специализирующийся на создании современных и функциональных веб-приложений.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm transition">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-white text-sm transition">
                  Проекты
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-400 hover:text-white text-sm transition">
                  Админ панель
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Социальные сети</h3>
            <div className="flex space-x-4">
              {mySocials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-black-300 rounded-lg hover:bg-blue-500 transition group"
                >
                  <img
                    src={social.icon}
                    alt={social.name}
                    className="w-5 h-5 opacity-70 group-hover:opacity-100 transition"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Portfolio. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

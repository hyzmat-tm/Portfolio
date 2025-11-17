import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Пароль берется из переменных окружения
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

  const handleLogin = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      // Сохраняем токен авторизации
      localStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } else {
      setError("Неверный пароль");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Вход в админ-панель
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="Введите пароль"
              autoFocus
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Войти
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-neutral-400 hover:text-white text-sm transition-colors"
          >
            ← Вернуться на главную
          </a>
        </div>

        <div className="mt-6 p-4 bg-neutral-800 rounded-lg">
          <p className="text-neutral-400 text-xs text-center">
            💡 Пароль настраивается в файле .env
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

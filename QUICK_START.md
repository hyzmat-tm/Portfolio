# Быстрый запуск Portfolio

## 🚀 Запуск в режиме разработки

### 1. Запуск серверов

**Terminal 1 - Backend:**
```bash
cd server
node server.js
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 2. Перезагрузка Apache (Linux)

```bash
# Применить новый конфиг
sudo cp apache-dev.conf /etc/apache2/sites-available/portfolio.conf

# Включить необходимые модули (один раз)
sudo a2enmod proxy proxy_http proxy_wstunnel rewrite headers ssl

# Перезагрузить Apache
sudo systemctl reload apache2

# Или полный перезапуск
sudo systemctl restart apache2
```

**Windows (XAMPP):**
```
1. Открыть XAMPP Control Panel
2. Нажать "Stop" для Apache
3. Нажать "Start" для Apache
```

### 3. Проверка

- **Через Apache:** https://portfolio.hyzmat-tm.com (или http://)
- **Frontend напрямую:** http://localhost:5173
- **Backend напрямую:** http://localhost:3001/api/projects

---

## 🔧 Что было исправлено

### CORS ошибка
**Было:** Backend разрешал только `http://localhost:5173`
**Стало:** Backend разрешает оба домена:
- `http://localhost:5173`
- `https://portfolio.hyzmat-tm.com`

**Файл:** `server/.env`
```env
CORS_ORIGIN=http://localhost:5173,https://portfolio.hyzmat-tm.com
```

### WebSocket (HMR) ошибка
**Было:** Vite пытался подключиться через localhost
**Стало:** Vite использует правильный домен через WSS

**Файл:** `vite.config.js`
```js
hmr: {
  protocol: 'wss',
  host: 'portfolio.hyzmat-tm.com',
  clientPort: 443,
}
```

**Файл:** `apache-dev.conf` - добавлен HTTPS VirtualHost для WebSocket

---

## 📝 Команды для управления

### Проверка запущенных серверов

**PowerShell:**
```powershell
# Проверить Node.js процессы
Get-Process | Where-Object {$_.ProcessName -like "*node*"}

# Проверить порты
netstat -ano | findstr "5173"
netstat -ano | findstr "3001"
```

**Linux:**
```bash
# Проверить порты
netstat -tulpn | grep :5173
netstat -tulpn | grep :3001

# Проверить процессы
ps aux | grep node
```

### Остановка серверов

**PowerShell:**
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

**Linux:**
```bash
pkill -f "node server.js"
pkill -f "vite"
```

### Логи Apache

```bash
# Смотреть логи в реальном времени
sudo tail -f /var/log/apache2/portfolio_error.log
sudo tail -f /var/log/apache2/portfolio_access.log

# Для HTTPS
sudo tail -f /var/log/apache2/portfolio_error_ssl.log
```

---

## 🐛 Troubleshooting

### Ошибка CORS
✅ **Решение:** Перезапустите backend сервер
```bash
cd server
node server.js
```

### WebSocket не подключается
✅ **Решение:**
1. Проверьте, что модуль `proxy_wstunnel` включен
2. Перезагрузите Apache
```bash
sudo a2enmod proxy_wstunnel
sudo systemctl restart apache2
```

### Ошибка 502 Bad Gateway
✅ **Решение:**
1. Убедитесь, что оба сервера запущены
2. Проверьте логи Apache
```bash
sudo tail -f /var/log/apache2/portfolio_error.log
```

### "Cannot GET /admin" или 404 на маршрутах
✅ **Решение:** Очистите кеш браузера или используйте режим инкогнито

---

## 📦 Обновление после изменений

### После изменения .env файлов
```bash
# Перезапустить backend
cd server
node server.js

# Перезапустить frontend
npm run dev
```

### После изменения vite.config.js
```bash
npm run dev
```

### После изменения Apache конфигов
```bash
sudo systemctl reload apache2
```

---

## 🌐 Продакшен

Для деплоя на продакшен смотрите:
- `APACHE_SETUP.md` - полная инструкция по Apache
- `apache-prod.conf` - конфиг для продакшена
- `EMAIL_SETUP.md` - настройка SMTP
- `ANALYTICS_SETUP.md` - настройка аналитики

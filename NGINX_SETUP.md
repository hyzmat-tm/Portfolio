# Настройка Nginx

## Режим разработки (Development)

### 1. Установка Nginx

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nginx
```

**CentOS/RHEL:**
```bash
sudo yum install nginx
```

**Windows (через Chocolatey):**
```bash
choco install nginx
```

### 2. Настройка для dev режима

**Linux/Mac:**
```bash
# Скопировать конфиг
sudo cp nginx-dev.conf /etc/nginx/sites-available/portfolio

# Создать символическую ссылку
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Удалить дефолтный конфиг (опционально)
sudo rm /etc/nginx/sites-enabled/default

# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx
```

**Windows:**
```bash
# Скопировать nginx-dev.conf в папку nginx/conf/
copy nginx-dev.conf C:\nginx\conf\portfolio.conf

# Добавить в nginx.conf в секцию http:
# include conf/portfolio.conf;

# Перезапустить nginx
nginx -s reload
```

### 3. Запуск приложения

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
npm run dev

# Terminal 3: Nginx (если нужно)
sudo systemctl start nginx
```

### 4. Доступ

- **Через Nginx:** http://localhost или http://portfolio.hyzmat-tm.com
- **Frontend напрямую:** http://localhost:5173
- **Backend напрямую:** http://localhost:3001/api/projects

---

## Продакшен (Production)

### 1. Сборка frontend

```bash
npm run build
```

Это создаст папку `dist/` с оптимизированными файлами.

### 2. Настройка Nginx для продакшена

```bash
# Скопировать конфиг
sudo cp nginx-prod.conf /etc/nginx/sites-available/portfolio

# Создать директорию для сайта
sudo mkdir -p /var/www/portfolio

# Скопировать собранные файлы
sudo cp -r dist/* /var/www/portfolio/

# Настроить права
sudo chown -R www-data:www-data /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio

# Активировать конфиг
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Проверить и перезапустить
sudo nginx -t
sudo systemctl restart nginx
```

### 3. SSL сертификаты (Let's Encrypt)

```bash
# Установить certbot
sudo apt install certbot python3-certbot-nginx

# Получить сертификат
sudo certbot --nginx -d portfolio.hyzmat-tm.com

# Автообновление сертификатов
sudo certbot renew --dry-run
```

### 4. Запуск backend как сервис (systemd)

Создайте файл `/etc/systemd/system/portfolio-api.service`:

```ini
[Unit]
Description=Portfolio API Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/portfolio/server
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Активация:
```bash
sudo systemctl daemon-reload
sudo systemctl enable portfolio-api
sudo systemctl start portfolio-api
sudo systemctl status portfolio-api
```

### 5. Использование PM2 (альтернатива)

```bash
# Установить PM2
npm install -g pm2

# Запустить backend
cd server
pm2 start server.js --name portfolio-api

# Автозапуск при перезагрузке
pm2 startup
pm2 save

# Мониторинг
pm2 status
pm2 logs portfolio-api
pm2 monit
```

---

## Обновление файлов на сервере

### Вариант 1: Git (Рекомендуется)

```bash
# На сервере
cd /var/www/portfolio
git pull origin main

# Пересобрать frontend
npm run build

# Перезапустить backend
pm2 restart portfolio-api
# или
sudo systemctl restart portfolio-api
```

### Вариант 2: SFTP/SCP

```bash
# С локальной машины
scp -r dist/* user@server:/var/www/portfolio/
scp -r server/* user@server:/var/www/portfolio/server/
```

### Вариант 3: rsync (лучше чем SCP)

```bash
# Синхронизация frontend
rsync -avz --delete dist/ user@server:/var/www/portfolio/

# Синхронизация backend
rsync -avz --exclude node_modules --exclude .env server/ user@server:/var/www/portfolio/server/
```

---

## Полезные команды Nginx

```bash
# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx

# Перезагрузить конфиг без остановки
sudo nginx -s reload

# Просмотр логов
sudo tail -f /var/log/nginx/portfolio_access.log
sudo tail -f /var/log/nginx/portfolio_error.log

# Статус Nginx
sudo systemctl status nginx
```

---

## Настройка hosts для локального тестирования

**Linux/Mac** (`/etc/hosts`):
```
127.0.0.1 portfolio.hyzmat-tm.com
```

**Windows** (`C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1 portfolio.hyzmat-tm.com
```

---

## Troubleshooting

### Ошибка "Connection refused"
```bash
# Проверить, запущены ли серверы
netstat -tulpn | grep :5173
netstat -tulpn | grep :3001

# Проверить SELinux (если на CentOS/RHEL)
sudo setenforce 0
```

### Ошибка 502 Bad Gateway
```bash
# Проверить логи backend
pm2 logs portfolio-api

# Проверить, работает ли backend
curl http://localhost:3001/api/projects
```

### HMR не работает в dev режиме
Убедитесь, что WebSocket соединения проксируются правильно в `nginx-dev.conf`.

### Права доступа
```bash
sudo chown -R www-data:www-data /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio
```

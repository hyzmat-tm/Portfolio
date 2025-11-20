# Настройка Apache

## Режим разработки (Development)

### 1. Проверка установки Apache

**Linux:**
```bash
# Проверить версию
apache2 -v

# Если не установлен
sudo apt update
sudo apt install apache2
```

**Windows:**
```bash
# Проверить через XAMPP/WAMP или отдельную установку Apache
httpd -v
```

### 2. Включение необходимых модулей

**Ubuntu/Debian:**
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_wstunnel
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl
sudo systemctl restart apache2
```

**CentOS/RHEL** (модули уже включены, проверить в httpd.conf):
```apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule headers_module modules/mod_headers.so
LoadModule ssl_module modules/mod_ssl.so
```

### 3. Настройка для dev режима

**Linux:**
```bash
# Скопировать конфиг
sudo cp apache-dev.conf /etc/apache2/sites-available/portfolio.conf

# Активировать сайт
sudo a2ensite portfolio.conf

# Отключить дефолтный сайт (опционально)
sudo a2dissite 000-default.conf

# Проверить конфигурацию
sudo apache2ctl configtest

# Перезапустить Apache
sudo systemctl restart apache2
```

**Windows (XAMPP):**
```bash
# 1. Открыть C:\xampp\apache\conf\extra\httpd-vhosts.conf
# 2. Добавить содержимое apache-dev.conf
# 3. В httpd.conf раскомментировать:
#    Include conf/extra/httpd-vhosts.conf
# 4. Перезапустить Apache через XAMPP Control Panel
```

### 4. Настройка hosts (для локального тестирования)

**Linux/Mac** (`/etc/hosts`):
```
127.0.0.1 portfolio.hyzmat-tm.com
```

**Windows** (`C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1 portfolio.hyzmat-tm.com
```

### 5. Запуск приложения

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
npm run dev

# Apache должен быть уже запущен
sudo systemctl status apache2
```

### 6. Доступ

- **Через Apache:** http://localhost или http://portfolio.hyzmat-tm.com
- **Frontend напрямую:** http://localhost:5173
- **Backend напрямую:** http://localhost:3001/api/projects

---

## Продакшен (Production)

### 1. Сборка frontend

```bash
npm run build
```

Это создаст папку `dist/` с оптимизированными файлами.

### 2. Настройка Apache для продакшена

```bash
# Создать директорию для сайта
sudo mkdir -p /var/www/portfolio/dist
sudo mkdir -p /var/www/portfolio/server

# Скопировать собранные файлы frontend
sudo cp -r dist/* /var/www/portfolio/dist/

# Скопировать backend
sudo cp -r server/* /var/www/portfolio/server/

# Настроить права
sudo chown -R www-data:www-data /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio

# Скопировать конфиг
sudo cp apache-prod.conf /etc/apache2/sites-available/portfolio.conf

# Активировать конфиг
sudo a2ensite portfolio.conf

# Проверить и перезапустить
sudo apache2ctl configtest
sudo systemctl restart apache2
```

### 3. SSL сертификаты (Let's Encrypt)

```bash
# Установить certbot
sudo apt install certbot python3-certbot-apache

# Получить сертификат
sudo certbot --apache -d portfolio.hyzmat-tm.com

# Certbot автоматически настроит SSL в конфиге

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
# Установить PM2 глобально
npm install -g pm2

# Запустить backend
cd /var/www/portfolio/server
pm2 start server.js --name portfolio-api

# Автозапуск при перезагрузке
pm2 startup systemd
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

# Обновить код
git pull origin main

# Пересобрать frontend
npm install
npm run build
sudo cp -r dist/* /var/www/portfolio/dist/

# Обновить backend
cd server
npm install

# Перезапустить backend
pm2 restart portfolio-api
# или
sudo systemctl restart portfolio-api
```

### Вариант 2: FTP/SFTP

Используйте FileZilla, WinSCP или командную строку:
```bash
# С локальной машины
scp -r dist/* user@server:/var/www/portfolio/dist/
scp -r server/* user@server:/var/www/portfolio/server/
```

### Вариант 3: rsync (лучше чем SCP)

```bash
# Синхронизация frontend
rsync -avz --delete dist/ user@server:/var/www/portfolio/dist/

# Синхронизация backend
rsync -avz --exclude node_modules --exclude .env server/ user@server:/var/www/portfolio/server/

# После синхронизации перезапустить backend
ssh user@server "cd /var/www/portfolio/server && npm install && pm2 restart portfolio-api"
```

### Вариант 4: GitHub Actions (CI/CD)

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy Portfolio

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build frontend
        run: npm run build

      - name: Deploy to server
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
          TARGET: "/var/www/portfolio/dist/"

      - name: Restart backend
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/portfolio/server
            git pull origin main
            npm install
            pm2 restart portfolio-api
```

---

## Полезные команды Apache

```bash
# Проверить конфигурацию
sudo apache2ctl configtest

# Перезапустить Apache
sudo systemctl restart apache2

# Перезагрузить конфиг без остановки
sudo systemctl reload apache2

# Статус Apache
sudo systemctl status apache2

# Просмотр логов
sudo tail -f /var/log/apache2/portfolio_error.log
sudo tail -f /var/log/apache2/portfolio_access.log

# Список включенных сайтов
sudo apache2ctl -S

# Список включенных модулей
sudo apache2ctl -M
```

---

## Troubleshooting

### Ошибка "AH00526: Syntax error"
```bash
# Проверить конфигурацию
sudo apache2ctl configtest

# Проверить, включены ли модули
sudo apache2ctl -M | grep proxy
```

### Ошибка 502 Bad Gateway / Proxy Error
```bash
# Проверить, запущены ли серверы
netstat -tulpn | grep :5173
netstat -tulpn | grep :3001

# Проверить логи backend
pm2 logs portfolio-api

# Проверить SELinux (CentOS/RHEL)
sudo setenforce 0
# Или настроить правильно:
sudo setsebool -P httpd_can_network_connect 1
```

### HMR не работает в dev режиме
Убедитесь, что модуль `proxy_wstunnel` включен:
```bash
sudo a2enmod proxy_wstunnel
sudo systemctl restart apache2
```

### Ошибка 403 Forbidden
```bash
# Проверить права доступа
sudo chown -R www-data:www-data /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio

# Проверить SELinux контекст (CentOS/RHEL)
sudo chcon -R -t httpd_sys_content_t /var/www/portfolio
```

### Apache не запускается
```bash
# Проверить, не занят ли порт 80
sudo netstat -tulpn | grep :80

# Остановить другой процесс или изменить порт в конфиге
sudo systemctl stop nginx  # если nginx тоже установлен
```

### Проблемы с React Router (404 на обновление страницы)
Убедитесь, что в конфиге есть:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

И что `.htaccess` поддерживается:
```apache
<Directory /var/www/portfolio/dist>
    AllowOverride All
</Directory>
```

---

## Windows (XAMPP) специфичные настройки

### 1. Путь к конфигам:
- Основной конфиг: `C:\xampp\apache\conf\httpd.conf`
- Virtual hosts: `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
- Логи: `C:\xampp\apache\logs\`

### 2. Включение модулей в httpd.conf:
Убрать `#` перед:
```apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule headers_module modules/mod_headers.so
```

### 3. Включение virtual hosts в httpd.conf:
```apache
Include conf/extra/httpd-vhosts.conf
```

### 4. Перезапуск через XAMPP Control Panel
Нажать "Stop" и "Start" для Apache

---

## Мониторинг и оптимизация

### Мониторинг производительности:
```bash
# Установить Apache top
sudo apt install apache2-utils

# Мониторинг в реальном времени
watch -n 1 'apache2ctl status'
```

### Оптимизация Apache (httpd.conf или apache2.conf):
```apache
# MPM Prefork настройки
<IfModule mpm_prefork_module>
    StartServers             5
    MinSpareServers          5
    MaxSpareServers         10
    MaxRequestWorkers      150
    MaxConnectionsPerChild   0
</IfModule>

# Кеширование (для продакшена)
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

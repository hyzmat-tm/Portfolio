#!/bin/bash
# Скрипт для перезапуска сервера

echo "=== Перезапуск Portfolio Backend ==="

# Остановить старый процесс
echo "1. Остановка старого процесса..."
PORT=3001
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ -n "$PID" ]; then
    echo "   Найден процесс с PID: $PID"
    kill -9 $PID
    sleep 1
    echo "   Процесс остановлен"
else
    echo "   Процесс на порту $PORT не найден"
fi

# Проверить, что порт свободен
echo "2. Проверка порта..."
if lsof -ti:$PORT >/dev/null 2>&1; then
    echo "   ❌ Порт $PORT все еще занят!"
    exit 1
else
    echo "   ✅ Порт $PORT свободен"
fi

# Запустить сервер
echo "3. Запуск сервера..."
npm start &

echo "4. Ожидание запуска (3 сек)..."
sleep 3

# Проверить, что сервер запущен
if lsof -ti:$PORT >/dev/null 2>&1; then
    echo "   ✅ Сервер успешно запущен на порту $PORT"
else
    echo "   ❌ Сервер не запустился!"
    exit 1
fi

echo ""
echo "=== Сервер работает ==="
echo "API: http://localhost:$PORT/api/projects"
echo ""
echo "Для просмотра логов: tail -f /var/log/portfolio-api.log"
echo "Для остановки: ./stop-server.sh"

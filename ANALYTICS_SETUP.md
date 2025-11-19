# 📊 Настройка аналитики (Яндекс.Метрика и Google Analytics)

## Яндекс.Метрика

### Шаг 1: Создайте счетчик

1. Перейдите на https://metrika.yandex.ru
2. Войдите в аккаунт Яндекса
3. Нажмите **"Добавить счетчик"**
4. Заполните:
   - Название: `Portfolio Website`
   - Адрес сайта: `your-domain.com`
5. Включите:
   - ✅ Вебвизор (записи посещений)
   - ✅ Карта кликов
   - ✅ Аналитика форм
6. Скопируйте номер счетчика (например: `12345678`)

### Шаг 2: Добавьте в index.html

В файле `index.html` замените `XXXXXXXX` на ваш номер счетчика:

```javascript
ym(12345678, "init", {
  clickmap:true,
  trackLinks:true,
  accurateTrackBounce:true,
  webvisor:true
});
```

---

## Google Analytics (GA4)

### Шаг 1: Создайте ресурс

1. Перейдите на https://analytics.google.com
2. Войдите в Google аккаунт
3. Создайте **Аккаунт** → **Ресурс**
4. Выберите **GA4 (Google Analytics 4)**
5. Настройте:
   - Название ресурса: `Portfolio Website`
   - Часовой пояс и валюта
6. Создайте **Поток данных** → **Веб**
7. Укажите URL: `your-domain.com`
8. Скопируйте **Идентификатор измерения** (например: `G-XXXXXXXXXX`)

### Шаг 2: Добавьте в index.html

Замените `G-XXXXXXXXXX` на ваш идентификатор:

```javascript
gtag('config', 'G-ABC123DEF456');
```

---

## Настройка через переменные окружения (рекомендуется)

### 1. Добавьте в `.env`:

```env
# Analytics
VITE_YANDEX_METRIKA_ID=12345678
VITE_GOOGLE_ANALYTICS_ID=G-ABC123DEF456
```

### 2. Создайте компонент Analytics:

```jsx
// src/components/Analytics.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Analytics = () => {
  const location = useLocation();
  const YM_ID = import.meta.env.VITE_YANDEX_METRIKA_ID;
  const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

  useEffect(() => {
    // Yandex.Metrika
    if (window.ym && YM_ID) {
      window.ym(YM_ID, 'hit', location.pathname);
    }

    // Google Analytics
    if (window.gtag && GA_ID) {
      window.gtag('config', GA_ID, {
        page_path: location.pathname,
      });
    }
  }, [location, YM_ID, GA_ID]);

  return null;
};

export default Analytics;
```

### 3. Добавьте в App.jsx:

```jsx
import Analytics from './components/Analytics';

function App() {
  return (
    <Router>
      <Analytics />
      {/* остальной код */}
    </Router>
  );
}
```

---

## Отслеживание событий

### Клики на кнопки:

```jsx
const handleButtonClick = () => {
  // Yandex.Metrika
  if (window.ym) {
    window.ym(YM_ID, 'reachGoal', 'button_click');
  }

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'button_click', {
      event_category: 'engagement',
      event_label: 'CTA Button'
    });
  }
};
```

### Отправка форм:

```jsx
const handleFormSubmit = () => {
  // Yandex.Metrika
  if (window.ym) {
    window.ym(YM_ID, 'reachGoal', 'contact_form_submit');
  }

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'form_submit', {
      event_category: 'contact',
      event_label: 'Contact Form'
    });
  }
};
```

### Переходы по проектам:

```jsx
const trackProjectView = (projectName) => {
  // Yandex.Metrika
  if (window.ym) {
    window.ym(YM_ID, 'reachGoal', 'project_view', {
      project: projectName
    });
  }

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'project_view', {
      event_category: 'projects',
      event_label: projectName
    });
  }
};
```

---

## Что отслеживать

### Основные метрики:

- ✅ **Просмотры страниц** - автоматически
- ✅ **Источники трафика** - автоматически
- ✅ **Время на сайте** - автоматически
- ✅ **География посетителей** - автоматически

### Пользовательские события:

- 📧 **Отправка контактной формы**
- 🔗 **Клики на проекты**
- 📱 **Клики на соцсети**
- 📥 **Скачивание резюме** (если есть)
- 🎯 **Переход в админку** (для анализа)
- 🔍 **Просмотр деталей проекта**

---

## Проверка работы

### Яндекс.Метрика:

1. Откройте сайт
2. Откройте консоль браузера (F12)
3. Введите: `ym(12345678, 'hit', window.location.href)`
4. Проверьте в Метрике через 10-15 минут

### Google Analytics:

1. Установите расширение: **Google Analytics Debugger**
2. Откройте сайт
3. В консоли должны появиться GA события
4. Проверьте в GA через "Realtime" отчеты

---

## Конфиденциальность и GDPR

Добавьте уведомление о cookies:

```jsx
// src/components/CookieConsent.jsx
import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShow(false);

    // Инициализируйте аналитику после согласия
    window.location.reload();
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-neutral-300">
          Мы используем cookies для улучшения работы сайта и аналитики.
          Продолжая использовать сайт, вы соглашаетесь с этим.
        </p>
        <button
          onClick={acceptCookies}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
        >
          Принять
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
```

---

## .env.example

Обновите файл:

```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:3001/api/projects
VITE_ADMIN_PASSWORD=admin123

# Analytics
VITE_YANDEX_METRIKA_ID=12345678
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## Готово! 📊

Теперь у вас есть:
- ✅ Яндекс.Метрика с вебвизором
- ✅ Google Analytics GA4
- ✅ Отслеживание пользовательских событий
- ✅ Согласие на cookies (GDPR)

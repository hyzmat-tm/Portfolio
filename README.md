# 🚀 3D Developer Portfolio

A modern, animated 3D developer portfolio built with React, Three.js, TailwindCSS, and motion effects — designed to help you stand out and showcase your skills creatively.

![3d Portfolio Screenshot GitHub](https://github.com/user-attachments/assets/9b0ed20e-074e-4f2a-81d8-20c9da751e9e)

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Assets](#-assets)
- [Contact Me](#-contact-me)
- [Suggestions or Feedback](#-suggestions-or-feedback)
- [Like This Project?](#-like-this-project)

---

## ✨ Features

- 🔥 3D visuals powered by **React Three Fiber** and **Drei**
- ⚡ Smooth transitions and scroll-based animations using **Framer Motion**
- 🎨 Clean, responsive UI with **TailwindCSS**
- 💌 Working contact form using **EmailJS**
- 🧱 Beautiful UI enhancements with **Aceternity UI** and **Magic UI**
- 🚀 Lightning-fast development with **Vite**
- 🎯 **Admin Panel** - Управляйте проектами через веб-интерфейс без изменения кода
- 🔐 **Аутентификация** - Защита админ-панели паролем
- 📊 **REST API** - Backend для динамического управления проектами

---

## 🛠 Tech Stack

| Tech              | Description                           |
|-------------------|---------------------------------------|
| React             | Front-end JavaScript library          |
| Vite              | Fast bundler and dev environment      |
| TailwindCSS       | Utility-first CSS framework           |
| React Three Fiber | 3D rendering with Three.js in React   |
| Drei              | Helpers and abstractions for R3F      |
| Framer Motion     | Animation library for React           |
| EmailJS           | Form handling and email integration   |
| Aceternity UI     | Custom UI components                  |
| Magic UI          | Prebuilt UI elements and design extras|

---

## 📁 Project Structure

```bash
├── public/
│   ├── assets/             # Images, textures, models
│   ├── models/             # 3D Astronaut model
│   └── vite.svg
├── server/                 # Backend API server
│   ├── server.js           # Express API server
│   ├── db.json             # JSON database for projects
│   └── package.json        # Server dependencies
├── src/
│   ├── components/         # Reusable components
│   ├── constants/          # Reusable datas
│   ├── pages/              # App pages (Home, Admin, Login)
│   ├── sections/           # Portfolio sections (Hero, About, etc.)
│   ├── App.jsx             # Main app file with routing
│   ├── index.css           # Tailwind css
│   └── main.jsx            # Entry point
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Первая настройка

1. **Настройте переменные окружения**
```bash
# Скопируйте примеры
copy .env.example .env
copy server\.env.example server\.env

# Откройте файлы и установите свой пароль:
# .env → VITE_ADMIN_PASSWORD=ваш_пароль
# server\.env → ADMIN_PASSWORD=ваш_пароль
```

2. **Важно:** Не используйте стандартный пароль `admin123` в продакшене!
   📖 Подробнее: [SECURITY.md](SECURITY.md)

### Frontend Setup

1. Clone the Repository
```bash
git clone https://github.com/Ali-Sanati/Portfolio.git
cd Portfolio
```
2. Install Dependencies
```bash
npm install
```
3. Run the Development Server
```bash
npm run dev
```
The app will be available at http://localhost:5173.

### Backend Setup (для управления проектами)

1. Navigate to server directory
```bash
cd server
```

2. Install server dependencies
```bash
npm install
```

3. Start the API server
```bash
npm start
```
The API will be available at http://localhost:3001.

---

## 🔐 Admin Panel

Система управления проектами доступна через веб-интерфейс:

1. Убедитесь, что сервер запущен (`npm start` в папке `server`)
2. Откройте браузер и перейдите: `http://localhost:5173/login`
3. Войдите с паролем из `.env` (по умолчанию: `admin123`)
4. Добавляйте, редактируйте или удаляйте проекты через удобный интерфейс

⚠️ **Безопасность:** Измените пароль в файле `.env` перед деплоем!
📖 Подробная инструкция: [SECURITY.md](SECURITY.md)

### API Endpoints

- `GET /api/projects` - Получить все проекты
- `POST /api/projects` - Создать новый проект
- `PUT /api/projects/:id` - Обновить проект
- `DELETE /api/projects/:id` - Удалить проект

### Как добавить проект из Kwork

1. Перейдите на `/login` и войдите в админ-панель
2. Заполните форму с информацией о проекте:
   - Название проекта
   - Описание
   - Детальное описание (список пунктов)
   - Путь к изображению проекта
   - Теги (технологии)
   - Ссылка на проект (опционально)
3. Нажмите "Создать проект"
4. Проект автоматически появится на главной странице портфолио

---

## 🔗 Assets
Assets used in the project can be found [here](https://github.com/user-attachments/files/19820923/public.zip)

---

## 📬 Contact Me
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://www.instagram.com/ali.sanatidev/reels/)
[![Static Badge](https://img.shields.io/badge/Youtube-%23FF0033?style=flat&logo=youtube)](https://www.youtube.com/channel/UCZhtUWTtk3bGJiMPN9T4HWA)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ali-sanati/)

---

## 💡 Suggestions or Feedback?
Leave a comment on the [YouTube video](https://youtu.be/S9UQItTpwUQ) or open an issue here on GitHub.<br/>
👉 What should I build next?

- A beautiful Landing Page

- A complete E-commerce site

- A fun App Clone (YouTube, Netflix, etc.)

Or another interactive Portfolio

Let me know!

---

## ⭐ Like This Project?
Star the repo and [subscribe](https://www.youtube.com/channel/UCZhtUWTtk3bGJiMPN9T4HWA??sub_confirmation=1) to the YouTube channel for more dev content!

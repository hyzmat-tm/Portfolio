import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { availableTags } from "../constants/availableTags";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/projects";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "personal",
    description: "",
    subDescription: [],
    href: "",
    logo: "",
    image: "",
    tags: [],
  });
  const [subDescInput, setSubDescInput] = useState("");
  const [tagInput, setTagInput] = useState({ name: "", path: "" });
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTagDropdown && !event.target.closest('.tag-dropdown-container')) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTagDropdown]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("Не удалось загрузить проекты");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add sub-description item
  const addSubDescription = () => {
    if (subDescInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        subDescription: [...prev.subDescription, subDescInput.trim()],
      }));
      setSubDescInput("");
    }
  };

  // Remove sub-description item
  const removeSubDescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      subDescription: prev.subDescription.filter((_, i) => i !== index),
    }));
  };

  // Add tag
  const addTag = () => {
    if (tagInput.name.trim() && tagInput.path.trim()) {
      const newTag = {
        id: formData.tags.length + 1,
        name: tagInput.name.trim(),
        path: tagInput.path.trim(),
      };
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setTagInput({ name: "", path: "" });
    }
  };

  // Remove tag
  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  // Create new project
  const createProject = async () => {
    if (!formData.title || !formData.description) {
      alert("Заполните обязательные поля: название и описание");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Проект успешно создан!");
        resetForm();
        fetchProjects();
      } else {
        alert("Ошибка при создании проекта");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Ошибка при создании проекта");
    } finally {
      setLoading(false);
    }
  };

  // Update existing project
  const updateProject = async () => {
    if (!currentProject) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${currentProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Проект успешно обновлен!");
        resetForm();
        fetchProjects();
      } else {
        alert("Ошибка при обновлении проекта");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Ошибка при обновлении проекта");
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить этот проект?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Проект успешно удален!");
        fetchProjects();
      } else {
        alert("Ошибка при удалении проекта");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Ошибка при удалении проекта");
    }
  };

  // Edit project
  const editProject = (project) => {
    setIsEditing(true);
    setCurrentProject(project);
    setFormData({
      title: project.title,
      category: project.category || "personal",
      description: project.description,
      subDescription: project.subDescription || [],
      href: project.href || "",
      logo: project.logo || "",
      image: project.image || "",
      tags: project.tags || [],
    });
  };

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setCurrentProject(null);
    setFormData({
      title: "",
      category: "personal",
      description: "",
      subDescription: [],
      href: "",
      logo: "",
      image: "",
      tags: [],
    });
    setSubDescInput("");
    setTagInput({ name: "", path: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Валидация типа файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageError("Разрешены только изображения (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Валидация размера (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Размер файла не должен превышать 5MB");
      return;
    }

    setImageUploading(true);
    setImageError("");

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Определяем базовый URL API
      let API_BASE;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        API_BASE = 'http://localhost:3001';
      } else {
        API_BASE = window.location.origin;
      }

      const response = await fetch(`${API_BASE}/api/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка загрузки изображения');
      }

      const data = await response.json();

      // Обновляем поле image в форме
      setFormData(prev => ({
        ...prev,
        image: data.path
      }));

      setImageError("");

    } catch (error) {
      console.error('Upload error:', error);
      setImageError(`Не удалось загрузить изображение: ${error.message}`);
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
          >
            Панель Управления Проектами
          </motion.h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
          >
            Выйти
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-neutral-900 p-6 rounded-xl border border-neutral-800"
          >
            <h2 className="text-2xl font-semibold mb-6">
              {isEditing ? "Редактировать проект" : "Добавить новый проект"}
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Название *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="E-commerce Platform"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Категория *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="personal">Личный проект</option>
                  <option value="kwork">Kwork проект</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Описание *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Краткое описание проекта"
                />
              </div>

              {/* Sub-descriptions */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Детальное описание (список)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={subDescInput}
                    onChange={(e) => setSubDescInput(e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Добавить пункт описания"
                    onKeyPress={(e) => e.key === "Enter" && addSubDescription()}
                  />
                  <button
                    onClick={addSubDescription}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                  >
                    Добавить
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.subDescription.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-neutral-800 p-2 rounded"
                    >
                      <span className="flex-1 text-sm">{item}</span>
                      <button
                        onClick={() => removeSubDescription(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Path */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Изображение проекта
                </label>

                {/* Upload button */}
                <div className="flex gap-2 mb-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-center transition">
                      {imageUploading ? "Загрузка..." : "📁 Выбрать файл с компьютера"}
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* OR divider */}
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-neutral-700"></div>
                  <span className="text-xs text-neutral-500">или</span>
                  <div className="flex-1 h-px bg-neutral-700"></div>
                </div>

                {/* Manual URL input */}
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={(e) => {
                    handleInputChange(e);
                    setImageError("");
                  }}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Или вставьте URL: https://i.imgur.com/image.jpg"
                />
                <details className="text-xs text-neutral-500 mt-1">
                  <summary className="cursor-pointer hover:text-neutral-400">
                    💡 Как получить прямую ссылку на изображение
                  </summary>
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-neutral-700">
                    <p><strong>Яндекс.Диск:</strong></p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Откройте изображение в Яндекс.Диске</li>
                      <li>Нажмите "Поделиться" → "Скопировать ссылку"</li>
                      <li>Замените <code className="bg-neutral-800 px-1 rounded">disk.yandex.ru/i/</code> на <code className="bg-neutral-800 px-1 rounded">downloader.disk.yandex.ru/preview?</code></li>
                      <li>Добавьте <code className="bg-neutral-800 px-1 rounded">&size=1280x720</code> в конец</li>
                      <li>Пример: <code className="bg-neutral-800 px-1 rounded text-xs">https://downloader.disk.yandex.ru/preview?size=1280x720&url=ya-disk-public://...</code></li>
                    </ol>
                    <p className="mt-2"><strong>Imgur (рекомендуется):</strong></p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Зайдите на <a href="https://imgur.com" target="_blank" className="text-blue-400 hover:underline">imgur.com</a></li>
                      <li>Нажмите "New post" и загрузите изображение</li>
                      <li>Правый клик на изображении → "Копировать адрес изображения"</li>
                      <li>Используйте эту ссылку (например: <code className="bg-neutral-800 px-1 rounded text-xs">https://i.imgur.com/abc123.jpg</code>)</li>
                    </ol>
                    <p className="mt-2"><strong>Google Drive:</strong></p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Откройте файл → Три точки → "Открыть доступ"</li>
                      <li>Выберите "Все, у кого есть ссылка"</li>
                      <li>Скопируйте ID из ссылки (между <code className="bg-neutral-800 px-1 rounded">/d/</code> и <code className="bg-neutral-800 px-1 rounded">/view</code>)</li>
                      <li>Используйте: <code className="bg-neutral-800 px-1 rounded text-xs">https://drive.google.com/uc?export=view&id=ВАШ_ID</code></li>
                    </ol>
                  </div>
                </details>
                {formData.image && (
                  <div className="mt-2">
                    <p className="text-xs text-neutral-400 mb-1">Предпросмотр:</p>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full max-w-xs h-32 object-cover rounded-lg border border-neutral-700"
                      onLoad={() => setImageError("")}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const url = e.target.src;
                        let errorMsg = "❌ Не удалось загрузить изображение. ";

                        if (url.includes('disk.yandex.ru/i/')) {
                          errorMsg += "Это ссылка на страницу Яндекс.Диска, а не на само изображение. Используйте инструкцию выше для получения прямой ссылки.";
                        } else if (url.includes('drive.google.com/file/')) {
                          errorMsg += "Это ссылка на страницу Google Drive. Используйте формат: https://drive.google.com/uc?export=view&id=ВАШ_ID";
                        } else if (url.startsWith('/')) {
                          errorMsg += "Локальный путь. Убедитесь, что файл существует в папке public" + url;
                        } else {
                          errorMsg += "Возможные причины: 1) Неправильная ссылка 2) CORS блокировка 3) Файл не существует. Попробуйте Imgur.";
                        }

                        setImageError(errorMsg);
                      }}
                    />
                    {imageError && (
                      <div className="text-red-400 text-sm mt-2 p-2 bg-red-950/20 border border-red-900/50 rounded">
                        {imageError}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tags with Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2">Теги</label>

                {/* Search and Dropdown */}
                <div className="relative mb-2 tag-dropdown-container">
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => {
                      setTagSearch(e.target.value);
                      setShowTagDropdown(true);
                    }}
                    onFocus={() => setShowTagDropdown(true)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Поиск тега... (или нажмите, чтобы увидеть все)"
                  />

                  {showTagDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg max-h-60 overflow-y-auto shadow-xl">
                      {availableTags
                        .filter(tag =>
                          tag.name.toLowerCase().includes(tagSearch.toLowerCase())
                        )
                        .map((tag, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              const newTag = {
                                id: formData.tags.length + 1,
                                name: tag.name,
                                path: tag.path,
                              };
                              setFormData((prev) => ({
                                ...prev,
                                tags: [...prev.tags, newTag],
                              }));
                              setTagSearch("");
                              setShowTagDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-700 transition-colors"
                          >
                            <img
                              src={tag.path}
                              alt={tag.name}
                              className="w-6 h-6 object-contain"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            <span className="text-sm">{tag.name}</span>
                          </button>
                        ))}
                      {availableTags.filter(tag =>
                        tag.name.toLowerCase().includes(tagSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-3 text-sm text-neutral-500">
                          Тег не найден
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Manual Tag Input */}
                <details className="mb-2">
                  <summary className="text-sm text-neutral-400 cursor-pointer hover:text-neutral-300">
                    ➕ Добавить кастомный тег
                  </summary>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={tagInput.name}
                      onChange={(e) =>
                        setTagInput({ ...tagInput, name: e.target.value })
                      }
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      placeholder="Название тега"
                    />
                    <input
                      type="text"
                      value={tagInput.path}
                      onChange={(e) =>
                        setTagInput({ ...tagInput, path: e.target.value })
                      }
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      placeholder="Путь к иконке"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </details>

                {/* Selected Tags */}
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700"
                    >
                      <img
                        src={tag.path}
                        alt={tag.name}
                        className="w-4 h-4 object-contain"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span className="text-sm">{tag.name}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project URL */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ссылка на проект (необязательно)
                </label>
                <input
                  type="text"
                  name="href"
                  value={formData.href}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={updateProject}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-neutral-700 px-6 py-3 rounded-lg font-semibold"
                    >
                      {loading ? "Обновление..." : "Обновить"}
                    </button>
                    <button
                      onClick={resetForm}
                      className="bg-neutral-700 hover:bg-neutral-600 px-6 py-3 rounded-lg"
                    >
                      Отмена
                    </button>
                  </>
                ) : (
                  <button
                    onClick={createProject}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 px-6 py-3 rounded-lg font-semibold"
                  >
                    {loading ? "Создание..." : "Создать проект"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Projects List Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-neutral-900 p-6 rounded-xl border border-neutral-800"
          >
            <h2 className="text-2xl font-semibold mb-6">
              Список проектов ({projects.length})
            </h2>

            <div className="space-y-4 max-h-[800px] overflow-y-auto">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-neutral-800 p-4 rounded-lg border border-neutral-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editProject(project)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-400 mb-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-neutral-700 px-2 py-1 rounded text-xs"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <a
            href="/"
            className="inline-block bg-neutral-800 hover:bg-neutral-700 px-8 py-3 rounded-lg font-semibold"
          >
            ← Вернуться на главную
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;

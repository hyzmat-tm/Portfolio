import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/projects";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subDescription: [],
    href: "",
    logo: "",
    image: "",
    tags: [],
  });
  const [subDescInput, setSubDescInput] = useState("");
  const [tagInput, setTagInput] = useState({ name: "", path: "" });

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

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
                  Путь к изображению
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="/assets/projects/project.jpg"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Теги</label>
                <div className="flex gap-2 mb-2">
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
                    onClick={addTag}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{tag.name}</span>
                      <button
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

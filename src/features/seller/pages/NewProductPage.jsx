import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiTrash2, FiX, FiPlus } from "react-icons/fi";
import { addProduct } from "@/features/products/services/productService";
import { useToast } from "@/shared/context/ToastContext";
import styles from "./NewProductPage.module.css";

const NewProductPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: 0,
    category: "",
    stock: "",
    sku: "",
    images: [],
    sizes: [],
    colors: [],
    specifications: [],
  });

  const categories = [
    "Электроника",
    "Одежда",
    "Обувь",
    "Аксессуары",
    "Книги",
    "Дом и сад",
    "Спорт",
    "Игрушки",
    "Красота и здоровье",
    "Зоотовары",
  ];

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...formData.images];
    const newImageFiles = [...imageFiles];

    for (const file of files) {
      if (newImages.length >= 5) {
        addToast("Максимум 5 фотографий", "error");
        break;
      }

      if (!file.type.startsWith("image/")) {
        addToast("Можно загружать только изображения", "error");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast("Файл не должен превышать 5MB", "error");
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        newImages.push(base64);
        newImageFiles.push(file);
        addToast(`Фото "${file.name}" загружено`, "success");
      } catch (err) {
        console.error("Ошибка загрузки файла", err);
        addToast("Ошибка загрузки файла", "error");
      }
    }

    setFormData((prev) => ({ ...prev, images: newImages }));
    setImageFiles(newImageFiles);
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
    setImageFiles(newImageFiles);
    addToast("Фото удалено", "info");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const handleRemoveSpecification = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const handleAddSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, ""],
    }));
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = value;
    setFormData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const handleRemoveSize = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const handleAddColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, ""],
    }));
  };

  const handleColorChange = (index, value) => {
    const newColors = [...formData.colors];
    newColors[index] = value;
    setFormData((prev) => ({ ...prev, colors: newColors }));
  };

  const handleRemoveColor = (index) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, colors: newColors }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Название товара обязательно";
    if (!formData.description.trim()) return "Описание обязательно";
    if (!formData.price || Number(formData.price) <= 0)
      return "Цена должна быть больше 0";
    if (!formData.stock || Number(formData.stock) < 0)
      return "Остаток не может быть отрицательным";
    if (!formData.category) return "Выберите категорию";
    if (formData.images.length === 0) return "Добавьте хотя бы одно фото";
    if (formData.discount < 0 || formData.discount > 99)
      return "Скидка должна быть от 0 до 99%";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      addToast(validationError, "error");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        sellerId: user.id,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        discount: Number(formData.discount),
        category: formData.category,
        stock: Number(formData.stock),
        sku: formData.sku || `SKU-${Date.now()}`,
        images: formData.images,
        sizes: formData.sizes.filter((s) => s.trim()),
        colors: formData.colors.filter((c) => c.trim()),
        specifications: formData.specifications.filter(
          (s) => s.key.trim() && s.value.trim(),
        ),
        status: "pending",
      };

      await addProduct(productData);
      addToast("Товар успешно создан и отправлен на модерацию", "success");
      navigate("/seller/products");
    } catch (err) {
      setError("Ошибка при создании товара");
      addToast("Ошибка при создании товара", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Новый товар</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2>Основная информация</h2>

            <div className={styles.field}>
              <label>Название товара *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Например: Смартфон X"
                required
              />
            </div>

            <div className={styles.field}>
              <label>Категория *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Описание *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Подробное описание товара..."
                required
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2>Фотографии</h2>
            <p className={styles.hint}>
              Добавьте до 5 фотографий. Поддерживаются JPG, PNG (до 5MB каждая)
            </p>

            <div className={styles.imagePreview}>
              {formData.images.map((url, index) => (
                <div key={index} className={styles.imagePreviewItem}>
                  <img src={url} alt={`preview ${index}`} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}
              {formData.images.length < 5 && (
                <label className={styles.imageUploadLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <span><FiPlus /> Добавить фото</span>
                </label>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2>Цена и наличие</h2>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Цена *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1000"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Скидка (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="99"
                />
              </div>

              <div className={styles.field}>
                <label>Остаток на складе *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="100"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Артикул (SKU)</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Необязательно"
              />
            </div>
          </div>

          {formData.category === "Одежда" && (
            <div className={styles.section}>
              <h2>Размеры</h2>
              {formData.sizes.map((size, index) => (
                <div key={index} className={styles.specRow}>
                  <input
                    type="text"
                    placeholder="Размер (S, M, L, XL, 42, 44...)"
                    value={size}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                  />
                  <button type="button" onClick={() => handleRemoveSize(index)}>
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSize}
                className={styles.addBtn}
              >
                <FiPlus /> Добавить размер
              </button>

              <h2 style={{ marginTop: "24px" }}>Цвета</h2>
              {formData.colors.map((color, index) => (
                <div key={index} className={styles.specRow}>
                  <input
                    type="text"
                    placeholder="Цвет (черный, белый, синий...)"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddColor}
                className={styles.addBtn}
              >
                <FiPlus /> Добавить цвет
              </button>
            </div>
          )}

          {formData.category === "Электроника" && (
            <div className={styles.section}>
              <h2>Технические характеристики</h2>

              {formData.specifications.map((spec, index) => (
                <div key={index} className={styles.specRow}>
                  <input
                    type="text"
                    placeholder="Название (например, Процессор)"
                    value={spec.key}
                    onChange={(e) =>
                      handleSpecificationChange(index, "key", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Значение (например, Intel i7)"
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecificationChange(index, "value", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecification(index)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddSpecification}
                className={styles.addBtn}
              >
                <FiPlus /> Добавить характеристику
              </button>
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className={styles.cancelBtn}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? "Создание..." : "Создать товар"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductPage;
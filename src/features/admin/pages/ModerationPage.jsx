import { useEffect, useState } from "react";
import { getAll } from "@/shared/lib/api";
import { STORAGE_KEYS } from "@/shared/lib/api";
import { updateProduct } from "@/features/products/services/productService";
import { FiCheck, FiX, FiEye } from "react-icons/fi";
import { useToast } from "@/shared/context/ToastContext";
import styles from "./ModerationPage.module.css";

const ModerationPage = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAll(STORAGE_KEYS.PRODUCTS);
        const pendingProducts = allProducts.filter(
          (p) => p.status === "pending",
        );
        setProducts(pendingProducts);
      } catch (err) {
        console.error("Ошибка загрузки товаров", err);
        addToast("Ошибка загрузки товаров", "error");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [addToast]);

  const handleApprove = async (product) => {
    console.log("Одобряем товар:", product.id);
    try {
      const updated = await updateProduct(product.id, {
        status: "approved",
        moderationComment: null,
      });
      console.log("Обновлённый товар:", updated);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setSelectedProduct(null);
      addToast(`Товар "${product.name}" одобрен`, "success");
    } catch (err) {
      console.error("Ошибка при одобрении:", err);
      addToast("Ошибка при одобрении товара", "error");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      addToast("Укажите причину отклонения", "error");
      return;
    }
    try {
      await updateProduct(selectedProduct.id, {
        status: "rejected",
        moderationComment: rejectReason,
      });
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setSelectedProduct(null);
      setShowRejectModal(false);
      setRejectReason("");
      addToast(`Товар "${selectedProduct.name}" отклонён`, "info");
    } catch (err) {
      console.error("Ошибка при отклонении:", err);
      addToast("Ошибка при отклонении товара", "error");
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Нет товаров на модерации</h2>
        <p>Все товары проверены</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Модерация товаров</h1>

        <div className={styles.productsList}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img
                src={product.images?.[0] || product.imageUrl}
                alt={product.name}
              />
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p>Продавец: {product.sellerId}</p>
                <p>Цена: {product.price} ₽</p>
              </div>
              <button
                className={styles.viewBtn}
                onClick={() => setSelectedProduct(product)}
              >
                <FiEye /> Подробнее
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedProduct(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{selectedProduct.name}</h2>
            <div className={styles.modalImages}>
              {selectedProduct.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${selectedProduct.name} ${idx + 1}`}
                />
              ))}
            </div>
            <p>
              <strong>Описание:</strong> {selectedProduct.description}
            </p>
            <p>
              <strong>Цена:</strong> {selectedProduct.price} ₽
            </p>
            <p>
              <strong>Скидка:</strong> {selectedProduct.discount}%
            </p>
            <p>
              <strong>Категория:</strong> {selectedProduct.category}
            </p>
            <p>
              <strong>Остаток:</strong> {selectedProduct.stock} шт
            </p>
            {selectedProduct.sizes?.length > 0 && (
              <p>
                <strong>Размеры:</strong> {selectedProduct.sizes.join(", ")}
              </p>
            )}
            {selectedProduct.colors?.length > 0 && (
              <p>
                <strong>Цвета:</strong> {selectedProduct.colors.join(", ")}
              </p>
            )}
            {selectedProduct.specifications?.length > 0 && (
              <div>
                <strong>Характеристики:</strong>
                <ul>
                  {selectedProduct.specifications.map((spec, idx) => (
                    <li key={idx}>
                      {spec.key}: {spec.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className={styles.modalActions}>
              <button
                className={styles.approveBtn}
                onClick={() => handleApprove(selectedProduct)}
              >
                <FiCheck /> Одобрить
              </button>
              <button
                className={styles.rejectBtn}
                onClick={() => setShowRejectModal(true)}
              >
                <FiX /> Отклонить
              </button>
            </div>
            <button
              className={styles.closeModalBtn}
              onClick={() => setSelectedProduct(null)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowRejectModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Причина отклонения</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Укажите причину, почему товар не прошёл модерацию..."
              rows="5"
            />
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowRejectModal(false)}
              >
                Отмена
              </button>
              <button className={styles.submitBtn} onClick={handleReject}>
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModerationPage;

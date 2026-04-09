import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiPackage, FiTrash2, FiPlus } from "react-icons/fi";
import {
  getSellerProducts,
  deleteProduct,
  updateProduct,
} from "@/features/products/services/productService";
import { setProducts } from "@/features/products/store/productsSlice";
import StockModal from "../components/StockModal";
import styles from "./SellerProductsPage.module.css";

const SellerProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const products = await getSellerProducts(user.id);
        setSellerProducts(products);
        dispatch(setProducts(products));
      } catch (err) {
        console.error("Ошибка загрузки товаров", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [user, dispatch]);

  const handleDelete = async (productId) => {
    if (window.confirm("Удалить товар? Это действие нельзя отменить.")) {
      try {
        await deleteProduct(productId);
        setSellerProducts((prev) => prev.filter((p) => p.id !== productId));
      } catch (err) {
        console.error("Ошибка удаления", err);
        alert("Не удалось удалить товар");
      }
    }
  };

  const handleUpdateStock = async (productId, updates) => {
    await updateProduct(productId, updates);
    const updatedProducts = sellerProducts.map((p) =>
      p.id === productId ? { ...p, ...updates } : p,
    );
    setSellerProducts(updatedProducts);
    dispatch(setProducts(updatedProducts));
  };

  const handleOpenStockModal = (product) => {
    setSelectedProduct(product);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className={styles.statusApproved}>Одобрен</span>;
      case "pending":
        return <span className={styles.statusPending}>На модерации</span>;
      case "rejected":
        return <span className={styles.statusRejected}>Отклонён</span>;
      default:
        return null;
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка товаров...</div>;

  if (sellerProducts.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>У вас пока нет товаров</h2>
        <p>Создайте первый товар, чтобы начать продавать</p>
        <button
          className={styles.createBtn}
          onClick={() => navigate("/seller/products/new")}
        >
          <FiPlus /> Создать товар
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Мои товары</h1>
          <button
            className={styles.createBtn}
            onClick={() => navigate("/seller/products/new")}
          >
            <FiPlus /> Новый товар
          </button>
        </div>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Товар</div>
            <div>Цена</div>
            <div>Остаток</div>
            <div>Статус</div>
            <div>Действия</div>
          </div>

          {sellerProducts.map((product) => (
            <div key={product.id} className={styles.tableRow}>
              <div className={styles.productInfo}>
                <img
                  src={product.images?.[0] || product.imageUrl}
                  alt={product.name}
                />
                <span>{product.name}</span>
              </div>
              <div>
                {product.discount > 0
                  ? `${Math.round((product.price * (100 - product.discount)) / 100)} ₽`
                  : `${product.price} ₽`}
              </div>
              <div>{product.stock} шт</div>
              <div>{getStatusBadge(product.status)}</div>
              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() =>
                    navigate(`/seller/products/edit/${product.id}`)
                  }
                  title="Редактировать"
                >
                  <FiEdit2 />
                </button>
                <button
                  className={styles.stockBtn}
                  onClick={() => handleOpenStockModal(product)}
                  title="Пополнить склад"
                >
                  <FiPackage />
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(product.id)}
                  title="Удалить"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <StockModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={handleUpdateStock}
        />
      )}
    </div>
  );
};

export default SellerProductsPage;

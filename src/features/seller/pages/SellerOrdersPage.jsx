import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAll } from "@/shared/lib/api";
import { STORAGE_KEYS } from "@/shared/lib/api";
import { FiPackage, FiTruck } from "react-icons/fi";
import { updateOrderStatus } from "@/features/orders/services/orderService";
import styles from "./SellerOrdersPage.module.css";

const SellerOrdersPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersByUser = await getAll(STORAGE_KEYS.ORDERS_BY_USER);
        if (!ordersByUser) {
          setOrders([]);
          return;
        }

        // Собираем все заказы всех пользователей
        const allOrders = [];
        for (const userId in ordersByUser) {
          allOrders.push(...ordersByUser[userId]);
        }

        // Фильтруем заказы, где есть товары продавца
        const sellerOrders = allOrders.filter((order) =>
          order.items.some((item) => item.sellerId === user.id),
        );

        // Сортируем от новых к старым
        sellerOrders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setOrders(sellerOrders);
      } catch (err) {
        console.error("Ошибка загрузки заказов", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user.id]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Нужно найти userId по заказу
      const ordersByUser = await getAll(STORAGE_KEYS.ORDERS_BY_USER);
      for (const userId in ordersByUser) {
        const order = ordersByUser[userId].find((o) => o.id === orderId);
        if (order) {
          await updateOrderStatus(
            userId,
            orderId,
            newStatus,
            new Date().toISOString(),
          );
          break;
        }
      }
      // Обновляем локальный список
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                shippedAt: new Date().toISOString(),
              }
            : order,
        ),
      );
    } catch (err) {
      console.error("Ошибка обновления статуса", err);
      alert("Не удалось обновить статус");
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      created: "Ожидает оплаты",
      paid: "Оплачен",
      shipped: "Отправлен",
      delivered: "Доставлен",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "created":
        return styles.statusCreated;
      case "paid":
        return styles.statusPaid;
      case "shipped":
        return styles.statusShipped;
      case "delivered":
        return styles.statusDelivered;
      default:
        return "";
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка заказов...</div>;

  if (orders.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Нет заказов</h2>
        <p>У вас пока нет заказов с вашими товарами</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Заказы</h1>

        <div className={styles.ordersList}>
          {orders.map((order) => {
            const sellerItems = order.items.filter(
              (item) => item.sellerId === user.id,
            );

            return (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.orderNumber}>
                      Заказ №{order.id.slice(0, 8)}
                    </span>
                    <span className={styles.orderDate}>
                      от {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <div
                    className={`${styles.status} ${getStatusClass(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {sellerItems.map((item, idx) => (
                    <div key={idx} className={styles.orderItem}>
                      <img src={item.imageUrl} alt={item.name} />
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{item.name}</div>
                        <div className={styles.itemDetails}>
                          {item.quantity} шт × {Math.round(item.price)} ₽
                        </div>
                      </div>
                      <div className={styles.itemTotal}>
                        {Math.round(item.price * item.quantity)} ₽
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.orderTotal}>
                    Итого: <span>{Math.round(order.total)} ₽</span>
                  </div>

                  {order.status === "paid" && (
                    <button
                      className={styles.shipBtn}
                      onClick={() => handleStatusChange(order.id, "shipped")}
                    >
                      <FiTruck /> Отправить заказ
                    </button>
                  )}

                  {order.status === "shipped" && (
                    <div className={styles.shippedBadge}>
                      <FiPackage /> Заказ отправлен
                    </div>
                  )}
                  {order.status === "shipped" && (
                    <button
                      className={styles.deliverBtn}
                      onClick={() => handleStatusChange(order.id, "delivered")}
                    >
                      <FiPackage /> Подтвердить доставку
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SellerOrdersPage;

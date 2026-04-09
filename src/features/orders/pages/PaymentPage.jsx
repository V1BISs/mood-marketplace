import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOrderById, updateOrderStatus } from "../services/orderService";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { PatternFormat } from "react-number-format";
import { useToast } from "@/shared/context/ToastContext";
import styles from "./PaymentPage.module.css";

const PaymentPage = () => {
  const { orderId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [cardData, setCardData] = useState({
    cvc: "",
    expiry: "",
    name: "",
    number: "",
  });
  const [focused, setFocused] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      if (!user) return;

      try {
        const foundOrder = await getOrderById(user.id, orderId);
        if (!foundOrder) {
          setError("Заказ не найден");
        } else {
          setOrder(foundOrder);
        }
      } catch (err) {
        setError("Ошибка загрузки заказа");
        addToast("Ошибка загрузки заказа", "error");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, user, addToast]);

  const processPayment = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const number = cardData.number.replace(/\s/g, "");

        if (
          number === "4111111111111113" ||
          number === "5555555555554446"
        ) {
          reject(new Error("Карта заблокирована"));
          return;
        }

        if (
          number === "4111111111111112" ||
          number === "5555555555554445"
        ) {
          reject(new Error("Недостаточно средств на карте"));
          return;
        }

        resolve(true);
      }, 1000);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    try {
      await processPayment();
      await updateOrderStatus(
        user.id,
        order.id,
        "paid",
        new Date().toISOString()
      );
      addToast("Оплата прошла успешно!", "success");
      navigate("/profile/orders");
    } catch (err) {
      console.error("Ошибка оплаты", err);
      addToast(err.message || "Ошибка оплаты", "error");
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!order) return <div className={styles.error}>Заказ не найден</div>;
  if (order.status !== "created") {
    return (
      <div className={styles.error}>
        Этот заказ уже оплачен или не может быть оплачен
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Оплата заказа</h1>
        <p className={styles.orderInfo}>Заказ №{order.id.slice(0, 8)}</p>

        <div className={styles.content}>
          <div className={styles.summary}>
            <h2>Сумма к оплате</h2>
            <div className={styles.total}>{Math.round(order.total)} ₽</div>
          </div>

          <div className={styles.paymentForm}>
            <h2>Данные карты</h2>

            <div className={styles.cardWrapper}>
              <Cards
                number={cardData.number}
                name={cardData.name}
                expiry={cardData.expiry}
                cvc={cardData.cvc}
                focused={focused}
              />
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <PatternFormat
                  name="number"
                  format="#### #### #### ####"
                  placeholder="Номер карты"
                  value={cardData.number}
                  onChange={handleInputChange}
                  onFocus={(e) => setFocused(e.target.name)}
                  className={styles.input}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <PatternFormat
                    name="expiry"
                    format="##/##"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={handleInputChange}
                    onFocus={(e) => setFocused(e.target.name)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <PatternFormat
                    name="cvc"
                    format="###"
                    placeholder="CVC"
                    value={cardData.cvc}
                    onChange={handleInputChange}
                    onFocus={(e) => setFocused(e.target.name)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <input
                  name="name"
                  placeholder="Имя владельца"
                  value={cardData.name}
                  onChange={handleInputChange}
                  onFocus={(e) => setFocused(e.target.name)}
                  className={styles.input}
                />
              </div>

              <button
                type="submit"
                disabled={paymentProcessing}
                className={styles.submitBtn}
              >
                {paymentProcessing ? "Обработка..." : "Оплатить"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
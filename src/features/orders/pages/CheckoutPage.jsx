import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrderByUser as createOrder } from "../services/orderService";
import { clearCart } from "../../cart/services/cartService";
import { setItems } from "../../cart/store/cartSlice";
import { useToast } from "@/shared/context/ToastContext";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import styles from "./CheckoutPage.module.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const selectedItems = location.state?.selectedItems || [];

  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [intercom, setIntercom] = useState("");
  const [phone, setPhone] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const { user: currentUser } = useSelector((state) => state.auth);

  // Список городов для подсказок
  const citiesList = [
    "Москва",
    "Санкт-Петербург",
    "Новосибирск",
    "Екатеринбург",
    "Казань",
    "Нижний Новгород",
    "Челябинск",
    "Самара",
    "Омск",
    "Ростов-на-Дону",
    "Уфа",
    "Красноярск",
    "Пермь",
    "Воронеж",
    "Волгоград",
    "Краснодар",
    "Саратов",
    "Тюмень",
    "Тольятти",
    "Ижевск",
  ];

  useEffect(() => {
    if (currentUser) {
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.address) {
        const addressParts = currentUser.address.split(",");
        if (addressParts[0]) setCity(addressParts[0].trim());
        if (addressParts[1]) setStreet(addressParts[1].trim());
        if (addressParts[2]) {
          const buildingMatch = addressParts[2].match(/д\.?\s*(\S+)/);
          if (buildingMatch) setBuilding(buildingMatch[1]);
        }
      }
    }
  }, [currentUser]);

  const total = selectedItems.reduce((sum, item) => {
    const price =
      (item.product.price * (100 - (item.product.discount || 0))) / 100;
    return sum + price * item.quantity;
  }, 0);

  const fetchCitySuggestions = (query) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    const filtered = citiesList.filter((city) =>
      city.toLowerCase().includes(query.toLowerCase()),
    );
    setCitySuggestions(filtered);
  };

  const handleCityChange = (value) => {
    setCity(value);
    fetchCitySuggestions(value);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setCitySuggestions([]);
  };

  const validatePhone = (value) => {
    if (!value) {
      setPhoneError("Введите номер телефона");
      return false;
    }

    const digits = value.replace(/\D/g, "");
    if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) {
      setPhoneError("");
      return true;
    }

    setPhoneError("Введите корректный российский номер телефона");
    return false;
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    if (value) {
      validatePhone(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!city || !street || !building) {
      setError("Заполните обязательные поля (Город, Улица, Дом)");
      addToast("Заполните обязательные поля", "error");
      return;
    }

    if (!phone || !validatePhone(phone)) {
      addToast("Введите корректный номер телефона", "error");
      return;
    }

    const fullAddress = `${city}, ${street}, д. ${building}${apartment ? `, кв. ${apartment}` : ""}${entrance ? `, подъезд ${entrance}` : ""}${intercom ? `, домофон ${intercom}` : ""}`;

    setLoading(true);
    setError("");

    try {
      const orderData = {
        items: selectedItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price:
            (item.product.price * (100 - (item.product.discount || 0))) / 100,
          quantity: item.quantity,
          sellerId: item.product.sellerId,
          imageUrl: item.product.imageUrl,
        })),
        total,
        address: fullAddress,
        phone,
      };

      const newOrder = await createOrder(user.id, orderData);

      const { getCart } = await import("../../cart/services/cartService");
      const currentCart = await getCart(user.id);
      const updatedItems = currentCart.items.filter(
        (cartItem) =>
          !selectedItems.some(
            (selected) => selected.productId === cartItem.productId,
          ),
      );
      await clearCart(user.id);
      for (const item of updatedItems) {
        const { addToCart } = await import("../../cart/services/cartService");
        await addToCart(user.id, item.product.id, item.product, item.quantity);
      }
      dispatch(setItems(updatedItems));

      addToast(
        "Заказ успешно оформлен! Перенаправление на оплату...",
        "success",
      );
      navigate(`/payment/${newOrder.id}`);
    } catch (err) {
      setError(err.message || "Ошибка оформления заказа");
      addToast(err.message || "Ошибка оформления заказа", "error");
    } finally {
      setLoading(false);
    }
  };

  if (selectedItems.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Нет выбранных товаров</h2>
        <button onClick={() => navigate("/cart")}>Вернуться в корзину</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Оформление заказа</h1>

        <div className={styles.content}>
          <div className={styles.products}>
            <h2>Товары</h2>
            {selectedItems.map((item) => (
              <div key={item.productId} className={styles.productItem}>
                <img src={item.product.imageUrl} alt={item.product.name} />
                <div>{item.product.name}</div>
                <div>{item.quantity} шт</div>
                <div>
                  {Math.round(
                    ((item.product.price *
                      (100 - (item.product.discount || 0))) /
                      100) *
                      item.quantity,
                  )}{" "}
                  ₽
                </div>
              </div>
            ))}
            <div className={styles.total}>Итого: {Math.round(total)} ₽</div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Данные доставки</h2>

            <div className={styles.field}>
              <label>Город *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="Например: Москва"
                required
              />
              {citySuggestions.length > 0 && (
                <div className={styles.suggestions}>
                  {citySuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className={styles.suggestionItem}
                      onClick={() => handleCitySelect(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Улица *</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="ул. Пушкина"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Дом *</label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="10"
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Квартира/офис</label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="42"
                />
              </div>
              <div className={styles.field}>
                <label>Подъезд</label>
                <input
                  type="text"
                  value={entrance}
                  onChange={(e) => setEntrance(e.target.value)}
                  placeholder="2"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Домофон</label>
              <input
                type="text"
                value={intercom}
                onChange={(e) => setIntercom(e.target.value)}
                placeholder="42к"
              />
            </div>

            <div className={styles.field}>
              <label>Телефон *</label>
              <PhoneInput
                international
                defaultCountry="RU"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+7 (XXX) XXX-XX-XX"
                className={styles.phoneInput}
              />
              {phoneError && (
                <div className={styles.phoneError}>{phoneError}</div>
              )}
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? "Оформление..." : "Оформить заказ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

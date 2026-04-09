import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { setUser } from "../store/authSlice";
import Button from "@/shared/ui/Button/Button";
import Input from "@/shared/ui/Input/Input";
import styles from "../pages/AuthPage.module.css";

const RegisterSellerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "seller",
    organizationName: "",
    inn: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (formData.password.length < 8) {
        throw new Error("Пароль должен быть не менее 8 символов");
      }

      if (!formData.organizationName || !formData.inn) {
        throw new Error("Заполните все поля организации");
      }

      const user = await registerUser(formData);
      dispatch(setUser(user));
      localStorage.setItem("user", JSON.stringify(user)); // добавить
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Название организации</label>
        <Input
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          placeholder="ООО Ромашка"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Email</label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seller@company.com"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Пароль</label>
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Минимум 6 символов"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>ИНН</label>
        <Input
          name="inn"
          value={formData.inn}
          onChange={handleChange}
          placeholder="1234567890"
          required
        />
      </div>

      {error && <div className={styles.errorText}>{error}</div>}

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </Button>
    </form>
  );
};

export default RegisterSellerForm;

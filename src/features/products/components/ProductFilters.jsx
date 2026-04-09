import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  setSort,
  applyFiltersAndSort,
} from "../store/productsSlice";
import { useState } from "react";
import styles from "./ProductFilters.module.css";

const ProductFilters = () => {
  const [localFilters, setLocalFilters] = useState({
    search: "",
    category: "",
    priceMin: "",
    priceMax: "",
  });
  const [localSort, setLocalSort] = useState("default");

  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);

  const handleApply = () => {
    dispatch(setFilters(localFilters));
    dispatch(setSort(localSort));
    dispatch(applyFiltersAndSort());
  };

  const handleSortChange = (value) => {
    setLocalSort(value);
  };

  const categories = [...new Set(items.map((item) => item.category))];

  return (
    <div className={styles.filters}>
      <input
        className={styles.search}
        type="text"
        placeholder="Поиск..."
        value={localFilters.search}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, search: e.target.value })
        }
      />
      <select
        className={styles.select}
        value={localFilters.category}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, category: e.target.value })
        }
      >
        <option value="">Все категории</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input
        className={styles.priceInput}
        type="number"
        placeholder="Цена от"
        value={localFilters.priceMin}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, priceMin: e.target.value })
        }
      />
      <input
        className={styles.priceInput}
        type="number"
        placeholder="Цена до"
        value={localFilters.priceMax}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, priceMax: e.target.value })
        }
      />
      <select
        className={styles.select}
        value={localSort}
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="default">По умолчанию</option>
        <option value="price_asc">Цена: по возрастанию</option>
        <option value="price_desc">Цена: по убыванию</option>
        <option value="date_desc">По новизне</option>
      </select>
      <button className={styles.button} onClick={handleApply}>
        Применить
      </button>
    </div>
  );
};

export default ProductFilters;

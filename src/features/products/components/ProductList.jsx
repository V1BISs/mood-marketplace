import ProductCard from "./ProductCard";
import styles from "./ProductList.module.css";

const ProductList = ({ products }) => {
  if (products.length === 0) {
    return <div className={styles.empty}>Товары не найдены</div>;
  }

  return (
    <div className={styles.container}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
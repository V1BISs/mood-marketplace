import { getAll, saveAll, STORAGE_KEYS } from "../../../shared/lib/api";

const getApprovedProducts = async () => {
  const products = await getAll(STORAGE_KEYS.PRODUCTS);
  const productsFilter = products.filter(
    (product) => product.status === "approved",
  );
  return productsFilter;
};

export const getProductById = async (productId) => {
  const products = await getAll(STORAGE_KEYS.PRODUCTS);
  return products.find((product) => product.id === productId) || null;
};

export const addProduct = async (productData) => {
  const products = await getAll(STORAGE_KEYS.PRODUCTS);
  const newProduct = {
    id: crypto.randomUUID(),
    ...productData,
    rating: 0,
    ratingCount: 0,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updatedProducts = [...products, newProduct];
  await saveAll(STORAGE_KEYS.PRODUCTS, updatedProducts);
  return newProduct;
};

export const updateProduct = async (productId, updates) => {
  const products = await getAll(STORAGE_KEYS.PRODUCTS);
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) throw new Error("Товар не найден");

  const oldProduct = products[index];
  const needsModeration =
    updates.name !== oldProduct.name ||
    updates.description !== oldProduct.description ||
    updates.category !== oldProduct.category ||
    updates.price > oldProduct.price; // только увеличение цены требует модерации

  const updatedProduct = {
    ...oldProduct,
    ...updates,
    status: needsModeration ? "pending" : oldProduct.status,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  await saveAll(STORAGE_KEYS.PRODUCTS, products);
  return updatedProduct;
};

export const deleteProduct = async (productId) => {
  const products = await getAll(STORAGE_KEYS.PRODUCTS);
  const filtered = products.filter((p) => p.id !== productId);
  await saveAll(STORAGE_KEYS.PRODUCTS, filtered);
};

export const getSellerProducts = async (sellerId) => {
  const products = await getAll(STORAGE_KEYS.PRODUCTS);
  return products.filter((p) => p.sellerId === sellerId);
};

export default getApprovedProducts;

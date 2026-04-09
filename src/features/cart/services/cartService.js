import { getAll, saveAll, STORAGE_KEYS } from "../../../shared/lib/api";

export const getCart = async (userId) => {
  const allCarts = await getAll(STORAGE_KEYS.CART);
  const userCart = allCarts.find((cart) => cart.userId === userId);

  if (!userCart) {
    return { userId, items: [] };
  }

  return userCart;
};

export const saveCart = async (userId, items) => {
  const allCarts = await getAll(STORAGE_KEYS.CART);
  const existingIndex = allCarts.findIndex((cart) => cart.userId === userId);

  if (existingIndex !== -1) {
    allCarts[existingIndex].items = items;
  } else {
    allCarts.push({ userId, items });
  }

  await saveAll(STORAGE_KEYS.CART, allCarts);
};

export const addToCart = async (userId, productId, product, quantity = 1) => {
  const cart = await getCart(userId);
  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, product, quantity });
  }

  await saveCart(userId, cart.items);
};

export const removeFromCart = async (userId, productId) => {
  const cart = await getCart(userId);
  const updatedItems = cart.items.filter(item => item.productId !== productId);
  await saveCart(userId, updatedItems);
};

export const updateQuantity = async (userId, productId, quantity) => {
  const cart = await getCart(userId);
  const existingItem = cart.items.find(item => item.productId === productId);

  if (existingItem) {
    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.productId !== productId);
    } else {
      existingItem.quantity = quantity;
    }
    await saveCart(userId, cart.items);
  }
};

export const clearCart = async (userId) => {
  await saveCart(userId, []);
};

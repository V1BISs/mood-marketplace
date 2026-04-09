import { getItem, setItem, STORAGE_KEYS } from "../../../shared/lib/api";

export const getOrdersByUser = async (userId) => {
  const ordersByUser = await getItem(STORAGE_KEYS.ORDERS_BY_USER);
  if (!ordersByUser) {
    return [];
  }
  return ordersByUser[userId] || [];
};

export const createOrderByUser = async (userId, orderData) => {
  const ordersByUser = await getItem(STORAGE_KEYS.ORDERS_BY_USER);

  let allOrders = ordersByUser;
  if (!allOrders) {
    allOrders = {};
  }
  const userOrders = allOrders[userId] || [];
  const { items, total, address, phone } = orderData;

  const newOrder = {
    id: crypto.randomUUID(),
    userId: userId,
    items: items,
    total: total,
    address: address,
    phone: phone,
    status: "created",
    createdAt: new Date().toISOString(),
  };
  const updatedUserOrders = [...userOrders, newOrder];
  allOrders[userId] = updatedUserOrders;
  await setItem(STORAGE_KEYS.ORDERS_BY_USER, allOrders);
  return newOrder;
};

export const updateOrderStatus = async (
  userId,
  orderId,
  newStatus,
  paidAt = null,
) => {
  const ordersByUser = await getItem(STORAGE_KEYS.ORDERS_BY_USER);
  if (!ordersByUser) return null;

  const userOrders = ordersByUser[userId];
  if (!userOrders) return null;

  const orderIndex = userOrders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) return null;

  const updatedOrder = {
    ...userOrders[orderIndex],
    status: newStatus,
    ...(paidAt && { paidAt }),
  };

  userOrders[orderIndex] = updatedOrder;
  ordersByUser[userId] = userOrders;

  await setItem(STORAGE_KEYS.ORDERS_BY_USER, ordersByUser);

  return updatedOrder;
};

export const getOrderById = async (userId, orderId) => {
  const ordersByUser = await getItem(STORAGE_KEYS.ORDERS_BY_USER);
  if (!ordersByUser) return null;

  const userOrders = ordersByUser[userId];
  if (!userOrders) return null;

  const order = userOrders.find((order) => order.id === orderId);

  return order || null;
};

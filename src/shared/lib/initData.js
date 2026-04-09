import { getAll, saveAll, STORAGE_KEYS } from './api'

export const initializeData = async () => {
  const existingUsers = await getAll(STORAGE_KEYS.USERS)
  
  if (existingUsers.length === 0) {
    await saveAll(STORAGE_KEYS.USERS, users)
    await saveAll(STORAGE_KEYS.PRODUCTS, products)
  }
}

const users = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin",
    name: "Администратор",
    role: "admin",
    isBlocked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "seller@example.com",
    password: "seller",
    name: "Продавец",
    role: "seller",
    isBlocked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "buyer@example.com",
    password: "buyer",
    name: "Покупатель",
    role: "buyer",
    isBlocked: false,
    createdAt: new Date().toISOString(),
  },
];

const products = [
  {
    id: "1",
    sellerId: "2",
    name: "Смартфон X",
    description: "Современный смартфон с отличной камерой, 6.5-дюймовый дисплей, 128 ГБ памяти, 8 ГБ ОЗУ, батарея 5000 мАч. Поддерживает быструю зарядку и беспроводную зарядку.",
    price: 29990,
    discount: 10,
    category: "Электроника",
    images: [
      "https://via.placeholder.com/600x400?text=Смартфон+1",
      "https://via.placeholder.com/600x400?text=Смартфон+2",
      "https://via.placeholder.com/600x400?text=Смартфон+3"
    ],
    sizes: [],
    colors: ["черный", "синий"],
    stock: 50,
    sku: "PHONE-001",
    status: "approved",
    rating: 4.5,
    ratingCount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    sellerId: "2",
    name: "Джинсы классические",
    description: "Удобные джинсы из качественного денима. Классический крой, подходят под любую обувь. Состав: 98% хлопок, 2% эластан.",
    price: 3490,
    discount: 0,
    category: "Одежда",
    images: [
      "https://via.placeholder.com/600x400?text=Джинсы+1",
      "https://via.placeholder.com/600x400?text=Джинсы+2"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["синий", "черный"],
    stock: 100,
    sku: "JEANS-001",
    status: "approved",
    rating: 4.2,
    ratingCount: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    sellerId: "2",
    name: "Книга 'Изучаем React'",
    description: "Полное руководство по React. Изучите хуки, контекст, роутинг, управление состоянием и многое другое. Автор: Алекс Бэнкс.",
    price: 1200,
    discount: 5,
    category: "Книги",
    images: [
      "https://via.placeholder.com/600x400?text=Книга+React+1",
      "https://via.placeholder.com/600x400?text=Книга+React+2"
    ],
    sizes: [],
    colors: [],
    stock: 30,
    sku: "BOOK-001",
    status: "approved",
    rating: 4.8,
    ratingCount: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
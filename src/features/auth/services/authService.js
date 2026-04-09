import { getAll, saveAll, STORAGE_KEYS } from "../../../shared/lib/api";

export const loginUser = async (email, password) => {
  const users = await getAll(STORAGE_KEYS.USERS);
  const foundUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!foundUser) {
    throw new Error("Неверный email или пароль");
  }

  const { password: _, ...userWithoutPassword } = foundUser;
  return userWithoutPassword;
};

export const registerUser = async (userData) => {
  const users = await getAll(STORAGE_KEYS.USERS);
  const existingUser = users.find((user) => user.email === userData.email);
  if (existingUser) {
    throw new Error("Пользователь с таким email уже существует");
  }

  const newUser = {
    id: Date.now().toString(),
    ...userData,
    isBlocked: false,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  await saveAll(STORAGE_KEYS.USERS, updatedUsers);

  const { _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const logoutUser = () => {
    return null
}

export const getCurrentUser = () => {
  return null
}

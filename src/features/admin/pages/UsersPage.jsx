import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAll, saveAll } from "@/shared/lib/api";
import { STORAGE_KEYS } from "@/shared/lib/api";
import { FiLock, FiUnlock, FiUser } from "react-icons/fi";
import styles from "./UsersPage.module.css";

const UsersPage = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await getAll(STORAGE_KEYS.USERS);
        setUsers(allUsers);
      } catch (err) {
        console.error("Ошибка загрузки пользователей", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleToggleBlock = async (userId, isBlocked) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isBlocked: !isBlocked } : user,
    );
    await saveAll(STORAGE_KEYS.USERS, updatedUsers);
    setUsers(updatedUsers);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "seller":
        return "Продавец";
      default:
        return "Покупатель";
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Управление пользователями</h1>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Пользователь</div>
            <div>Email</div>
            <div>Роль</div>
            <div>Статус</div>
            <div>Действия</div>
          </div>

          {users.map((user) => (
            <div key={user.id} className={styles.tableRow}>
              <div className={styles.userInfo}>
                <FiUser className={styles.userIcon} />
                <span>{user.name}</span>
              </div>
              <div>{user.email}</div>
              <div>{getRoleLabel(user.role)}</div>
              <div>
                <span
                  className={user.isBlocked ? styles.blocked : styles.active}
                >
                  {user.isBlocked ? "Заблокирован" : "Активен"}
                </span>
              </div>
              <div>
                {user.id !== currentUser?.id && (
                  <button
                    className={
                      user.isBlocked ? styles.unblockBtn : styles.blockBtn
                    }
                    onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                  >
                    {user.isBlocked ? <FiUnlock /> : <FiLock />}
                    {user.isBlocked ? " Разблокировать" : " Заблокировать"}
                  </button>
                )}
                {user.id === currentUser?.id && (
                  <span className={styles.selfHint}>Вы</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;

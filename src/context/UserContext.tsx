import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  role: string;
  name: string;
  token: string;
}

// Định nghĩa kiểu cho UserContext
interface UserContextType {
  user: User | null; // Dữ liệu người dùng có thể là null nếu chưa đăng nhập
  setUser: (user: User | null) => void; // Hàm để cập nhật thông tin người dùng
}

// Tạo context với giá trị mặc định là null
const UserContext = createContext<UserContextType | null>(null);

// Tạo Provider để bao bọc các component và cung cấp dữ liệu người dùng
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Quản lý trạng thái người dùng

  // Lấy dữ liệu từ localStorage khi ứng dụng khởi động
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Khôi phục người dùng từ localStorage
    }
  }, []);

  // Hàm để lưu người dùng vào state và localStorage
  const updateUser = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData"); // Xóa khỏi localStorage khi đăng xuất
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook để sử dụng UserContext dễ dàng trong các component
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { message } from "antd";
import { useUser } from "../../context/UserContext";

interface ProtectedRouteProps {
  roleRequired: string;
  children: React.ReactNode; // Thêm prop children
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  roleRequired,
  children,
}) => {
  const { user } = useUser(); // Lấy thông tin người dùng từ context
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    console.log("User hiện tại:", user); // Kiểm tra thông tin user

    // Kiểm tra xem user đã đăng nhập và có quyền hay không
    if (!user || !user.token) {
      message.error("Bạn cần đăng nhập để truy cập vào trang này!");
      setRedirect("/login"); // Nếu chưa đăng nhập thì chuyển đến trang đăng nhập
    } else if (user && user.role && user.role !== roleRequired) {
      message.error("Bạn không có quyền truy cập vào trang này!");
      setRedirect("/"); // Chuyển hướng về trang chủ nếu không có quyền
    }
  }, [user, roleRequired]);

  if (redirect) {
    return <Navigate to={redirect} />; // Nếu cần chuyển hướng thì thực hiện
  }

  return <>{children}</>; // Render children nếu người dùng có vai trò đúng
};

export default ProtectedRoute;

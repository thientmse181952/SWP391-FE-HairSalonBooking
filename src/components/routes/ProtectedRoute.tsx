import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { message } from "antd";
import { useUser } from "../../context/UserContext";

interface ProtectedRouteProps {
  roleRequired: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  roleRequired,
  children,
}) => {
  const { user, isLoading } = useUser();
  const [redirect, setRedirect] = useState<string | null>(null);
  const [hasShownMessage, setHasShownMessage] = useState(false); // Một cờ duy nhất kiểm soát hiển thị thông báo

  useEffect(() => {
    if (isLoading) return; // Chờ cho đến khi quá trình tải kết thúc

    console.log("User hiện tại:", user);

    if (!user || !user.token || user.role !== "MANAGER") {
      if (!hasShownMessage) {
        message.error("Bạn không có quyền truy cập vào trang này!");
        setHasShownMessage(true); // Đặt cờ để không hiển thị lặp lại
      }
      setRedirect("/"); // Chuyển hướng về trang chủ nếu không phải "MANAGER"
    }
  }, [user, isLoading, hasShownMessage]);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

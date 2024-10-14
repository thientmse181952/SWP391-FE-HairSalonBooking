import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, message, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // Sử dụng UserContext để quản lý người dùng
import "./index.scss";

const { Header, Content, Footer, Sider } = Layout;

const AdminCategory: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { setUser } = useUser(); // Lấy hàm setUser từ UserContext để cập nhật trạng thái người dùng
  const navigate = useNavigate(); // Sử dụng hook navigate để điều hướng
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Tương tự như hàm handleLogout trong Header
  const handleLogout = () => {
    localStorage.removeItem("fullName");
    localStorage.removeItem("token"); // Xóa token khi đăng xuất
    setUser(null); // Reset lại trạng thái người dùng

    // Thêm thông báo đăng xuất thành công
    message.success("Đăng xuất thành công!");

    navigate("/"); // Điều hướng về trang đăng nhập
  };

  function getItem(
    label: React.ReactNode,
    key: string,
    icon?: React.ReactNode,
    children?: any
  ) {
    return {
      key,
      icon,
      children,
      label: <Link to={`/adminpage/${key}`}>{label}</Link>, // Cập nhật đường dẫn
    };
  }

  const items = [
    getItem("Thông Tin Admin", "adminInfo", <PieChartOutlined />),
    getItem(
      "Personnel Management",
      "adminPersonnelManagement",
      <DesktopOutlined />
    ), // Đường dẫn cho Tất cả nhân sự
    getItem(
      "Tạo Tài Khoản Stylist",
      "create-stylist-account",
      <UserOutlined />
    ), // Đường dẫn cho Tạo Tài Khoản Stylist
    getItem("Quản Lý Nhân Viên", "adminEmployeeRegistration", <UserOutlined />), // Đường dẫn cho Đăng ký nhân viên
    getItem("Dashboard", "adminDashboard", <TeamOutlined />), // Đường dẫn cho Dashboard
    getItem("Calendar Management", "adminCalendarManagement", <FileOutlined />), // Đường dẫn cho Xếp lịch Stylist
    getItem("Quản Lý Dịch Vụ", "adminServiceManagement", <UserOutlined />),
    getItem("Quản Lý Danh Mục", "category-management", <UserOutlined />),
    getItem("Quản Lý BST", "collection-management", <UserOutlined />), // Đường dẫn cho Quản lý dịch vụ
    {
      key: "logout",
      icon: <UploadOutlined />,
      label: <span onClick={handleLogout}>Logout</span>, // Gọi trực tiếp handleLogout khi click vào Logout
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={230}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["adminInfo"]}
          mode="inline"
          items={items.map((item) => ({
            ...item,
            label:
              item.key === "logout" ? (
                <span onClick={handleLogout}>{item.label}</span>
              ) : (
                item.label
              ),
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Category</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminCategory;

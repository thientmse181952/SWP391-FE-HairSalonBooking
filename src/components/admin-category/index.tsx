import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import AdminPersonnelManagement from "./pages/admin/admin-personnel-management"; // Import đúng các component
import AdminEmployeeRegistration from "./pages/admin/admin-employee-registration";
import AdminDashboard from "./pages/admin/admin-dashboard";
import AdminCalendarManagement from "./pages/admin/admin-calendar-management";
import AdminServiceManagement from "./pages/admin/admin-service-management";

const { Header, Content, Footer, Sider } = Layout;

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
  getItem("Admin Information", "adminInfo", <PieChartOutlined />),
  getItem(
    "Personnel Management",
    "adminPersonnelManagement",
    <DesktopOutlined />
  ), // Đường dẫn cho Tất cả nhân sự
  getItem(
    "Employee Registration",
    "adminEmployeeRegistration",
    <UserOutlined />
  ), // Đường dẫn cho Đăng ký nhân viên
  getItem("Dashboard", "adminDashboard", <TeamOutlined />), // Đường dẫn cho Dashboard
  getItem("Calendar Management", "adminCalendarManagement", <FileOutlined />), // Đường dẫn cho Xếp lịch Stylist
  getItem("Service Management", "adminServiceManagement", <UserOutlined />),
  getItem("Category Management", "category-management", <UserOutlined />),
  getItem("Add Selection", "adminAddSelection", <UserOutlined />), // Đường dẫn cho Quản lý dịch vụ
  getItem("Logout", "logout", <UploadOutlined />), // Thêm mục đăng xuất
];

const AdminCategory: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    // Xử lý đăng xuất ở đây
    window.location.href = "/"; // Chuyển hướng về trang chính
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
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
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminCategory;

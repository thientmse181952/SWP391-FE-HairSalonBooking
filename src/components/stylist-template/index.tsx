/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, message, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // Sử dụng UserContext để quản lý người dùng

const { Header, Content, Sider } = Layout;

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
    label: <Link to={`/stylistpage/${key}`}>{label}</Link>,
  };
}

const StylistPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { setUser } = useUser(); // Lấy hàm setUser từ UserContext để cập nhật trạng thái người dùng
  const navigate = useNavigate(); // Sử dụng hook navigate để điều hướng
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Hàm handleLogout tương tự admin
  const handleLogout = () => {
    localStorage.removeItem("fullName");
    localStorage.removeItem("token"); // Xóa token khi stylist đăng xuất
    setUser(null); // Reset lại trạng thái người dùng

    // Thêm thông báo đăng xuất thành công
    message.success("Đăng xuất thành công!");

    navigate("/"); // Điều hướng về trang đăng nhập
  };

  const items = [
    getItem("Stylist Information", "stylistInfo", <PieChartOutlined />),
    getItem("Stylist Feedback", "stylistFeedback", <DesktopOutlined />),
    getItem("Stylist Performance", "stylistPerformance", <UserOutlined />),
    getItem("Stylist Schedule", "stylistSchedule", <TeamOutlined />),
    getItem("Stylist Day Off", "stylistDayoff", <FileOutlined />),
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
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["stylistInfo"]}
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
            <Breadcrumb.Item>Stylist</Breadcrumb.Item>
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

export default StylistPage;

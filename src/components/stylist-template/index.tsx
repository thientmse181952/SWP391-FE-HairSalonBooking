import React, { useState, useEffect } from "react";
import {
  CalendarOutlined,
  CommentOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, message, theme, Avatar } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // Sử dụng UserContext để quản lý người dùng
import { useLocation } from "react-router-dom";

const { Content, Sider } = Layout;

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
  const [avatarUrl, setAvatarUrl] = useState(""); // State để lưu ảnh đại diện
  const { setUser } = useUser(); // Lấy hàm setUser từ UserContext để cập nhật trạng thái người dùng
  const navigate = useNavigate(); // Sử dụng hook navigate để điều hướng
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const currentCategory = location.pathname.split("/").pop();

  // Hàm gọi API để lấy ảnh đại diện
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch('/stylist/'${id}); // Thay thế bằng URL API của bạn
        const data = await response.json();
        setAvatarUrl(data.image); // Lưu URL ảnh từ phản hồi
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null); // Reset lại trạng thái người dùng
    message.success("Đăng xuất thành công!");
    navigate("/"); // Điều hướng về trang đăng nhập
  };

  const items = [
    getItem("Thông Tin Stylist", "stylistInfo", <UserOutlined />),
    getItem("Danh Sách Feedback", "stylistFeedback", <CommentOutlined />),
    getItem("Lịch Làm Việc", "stylistSchedule", <CalendarOutlined />),
    getItem("Lịch Nghỉ", "stylistDayoff", <ScheduleOutlined />),
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span onClick={handleLogout}>Logout</span>,
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
        <Avatar src={avatarUrl} size={64} style={{ margin: '16px' }} /> {/* Hiển thị ảnh đại diện */}
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
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Stylist</Breadcrumb.Item>
            <Breadcrumb.Item>{currentCategory}</Breadcrumb.Item>
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

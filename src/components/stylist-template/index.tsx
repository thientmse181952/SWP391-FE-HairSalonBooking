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
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";

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
    label: <Link to={`/stylistpage/${key}`}>{label}</Link>,
  };
}

const items = [
  getItem("Stylist Information", "stylistInfo", <PieChartOutlined />),
  getItem("Stylist Feedback", "stylistFeedback", <DesktopOutlined />),
  getItem("Stylist Performance", "stylistPerformance", <UserOutlined />),
  getItem("Stylist Schedule", "stylistSchedule", <TeamOutlined />),
  getItem("Stylist Day Off", "stylistDayoff", <FileOutlined />),
  getItem("Logout", "logout", <UploadOutlined />)
];

const StylistPage: React.FC = () => {
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
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
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
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default StylistPage;

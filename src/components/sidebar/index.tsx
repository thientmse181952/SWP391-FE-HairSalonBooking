import React, { useState } from "react";
import {
  InfoCircleOutlined,
  TeamOutlined,
  UserAddOutlined,
  DashboardOutlined,
  ScheduleOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom"; // Thêm NavLink
import "./index.scss";

const Sidebar: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>("info"); // Mặc định chọn "info"

  const options = [
    { id: "info", label: "Thông tin", icon: <InfoCircleOutlined />, path: "/adminpage/adminInfo" },
    { id: "team", label: "Tất cả nhân sự", icon: <TeamOutlined />, path: "/adminpage/adminPersonnelManagement" },
    { id: "register", label: "Đăng ký nhân viên", icon: <UserAddOutlined />, path: "/adminpage/adminEmployeeRegistration" },
    { id: "dashboard", label: "Dashboard", icon: <DashboardOutlined />, path: "/adminpage/adminDashboard" },
    { id: "schedule", label: "Xếp lịch Stylist", icon: <ScheduleOutlined />, path: "/adminpage/adminCalendarManagement" },
    { id: "services", label: "Quản lý dịch vụ", icon: <SettingOutlined />, path: "/adminpage/adminServiceManagement" },
    { id: "exit", label: "Đăng xuất", icon: <LogoutOutlined />, path: "/" }, // Thêm đường dẫn cho đăng xuất nếu cần
  ];

  const handleOptionClick = (id: string) => {
    setSelectedOption(id);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Logo%2Flogo.png?alt=media&token=ee1b9b13-5b44-48c4-9106-cc3fee3681a7"
          alt="Admin Logo"
        />
      </div>
      <ul className="options">
        {options.map((option) => (
          <li
            key={option.id}
            className={selectedOption === option.id ? "selected" : ""}
            onClick={() => handleOptionClick(option.id)}
          >
            <NavLink to={option.path} onClick={() => handleOptionClick(option.id)} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              {option.icon}
              <span>{option.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

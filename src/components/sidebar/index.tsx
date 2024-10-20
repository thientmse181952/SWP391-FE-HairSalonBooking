// import React, { useState } from "react";
// import {
//   InfoCircleOutlined,
//   TeamOutlined,
//   UserAddOutlined,
//   DashboardOutlined,
//   ScheduleOutlined,
//   SettingOutlined,
//   LogoutOutlined,
//   FolderOutlined,
// } from "@ant-design/icons";
// import { NavLink, useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng
// import { message } from "antd"; // Thêm message để hiển thị thông báo
// import "./index.scss";

// const Sidebar: React.FC = () => {
//   const [selectedOption, setSelectedOption] = useState<string | null>("info"); // Mặc định chọn "info"
//   const navigate = useNavigate(); // Sử dụng hook navigate để điều hướng

//   const handleLogout = () => {
//     localStorage.clear(); // Xóa toàn bộ dữ liệu trong localStorage
//     message.success("Đăng xuất thành công!"); // Hiển thị thông báo đăng xuất thành công
//     navigate("/"); // Điều hướng về trang đăng nhập
//   };

//   const options = [
//     {
//       id: "info",
//       label: "Thông tin",
//       icon: <InfoCircleOutlined />,
//       path: "/adminpage/adminInfo",
//     },
//     {
//       id: "team",
//       label: "Tất cả nhân sự",
//       icon: <TeamOutlined />,
//       path: "/adminpage/adminPersonnelManagement",
//     },
//     {
//       id: "register",
//       label: "Đăng ký nhân viên",
//       icon: <UserAddOutlined />,
//       path: "/adminpage/adminEmployeeRegistration",
//     },
//     {
//       id: "dashboard",
//       label: "Dashboard",
//       icon: <DashboardOutlined />,
//       path: "/adminpage/adminDashboard",
//     },
//     {
//       id: "schedule",
//       label: "Xếp lịch Stylist",
//       icon: <ScheduleOutlined />,
//       path: "/adminpage/adminCalendarManagement",
//     },
//     {
//       id: "services",
//       label: "Quản lý dịch vụ",
//       icon: <SettingOutlined />,
//       path: "/adminpage/adminServiceManagement",
//     },
//     {
//       id: "selection",
//       label: "Quản lý bộ sưu tập",
//       icon: <FolderOutlined />,
//       path: "/adminpage/AdminSelection",
//     },
//     {
//       id: "exit",
//       label: "Đăng xuất",
//       icon: <LogoutOutlined />,
//       path: "/",
//       onClick: handleLogout, // Thêm chức năng đăng xuất
//     },
//   ];

//   const handleOptionClick = (id: string) => {
//     setSelectedOption(id);
//   };

//   return (
//     <div className="sidebar">
//       <div className="logo">
//         <img
//           src="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Logo%2Flogo.png?alt=media&token=ee1b9b13-5b44-48c4-9106-cc3fee3681a7"
//           alt="Admin Logo"
//         />
//       </div>
//       <ul className="options">
//         {options.map((option) => (
//           <li
//             key={option.id}
//             className={selectedOption === option.id ? "selected" : ""}
//             onClick={() => handleOptionClick(option.id)}
//           >
//             <NavLink
//               to={option.path}
//               onClick={() => {
//                 handleOptionClick(option.id);
//                 if (option.id === "exit") {
//                   handleLogout(); // Gọi handleLogout khi click vào Đăng xuất
//                 }
//               }}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 textDecoration: "none",
//                 color: "inherit",
//               }}
//             >
//               {option.icon}
//               <span>{option.label}</span>
//             </NavLink>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

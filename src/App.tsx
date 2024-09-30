import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import AboutUs from "./pages/about-us";
import Login from "./pages/login";
import Register from "./pages/register";
import ResetPassword from "./pages/reset-password";
import CustomerInformation from "./pages/customer-information";
import AdminInfo from "./pages/admin/admin-info";
import LayoutPanel from "./components/layout-panel";
import AdminPersonnelManagement from "./pages/admin/admin-personnel-management"; // Import đúng các component
import AdminEmployeeRegistration from "./pages/admin/admin-employee-registration";
import AdminDashboard from "./pages/admin/admin-dashboard";
import AdminCalendarManagement from "./pages/admin/admin-calendar-management";
import AdminServiceManagement from "./pages/admin/admin-service-management";
import AdminCategory from "./components/admin-category"; // Thêm dấu phẩy ở đây
import AddSelection from "./pages/admin/addmin-add-selection";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [{ path: "", element: <Home /> }],
    },
    {
      path: "about-us",
      element: <Layout />,
      children: [{ path: "", element: <AboutUs /> }],
    },
    {
      path: "login",
      element: <Layout />,
      children: [{ path: "", element: <Login /> }],
    },
    {
      path: "register",
      element: <Layout />,
      children: [{ path: "", element: <Register /> }],
    },
    {
      path: "resetPassword",
      element: <Layout />,
      children: [{ path: "", element: <ResetPassword /> }],
    },
    {
      path: "customerInformation",
      element: <Layout />,
      children: [{ path: "", element: <CustomerInformation /> }],
    },
    {
      path: "adminpage",
      element: <AdminCategory />,
      children: [
        { path: "adminInfo", element: <AdminInfo /> }, // Đường dẫn cho admin thông tin
        { path: "adminPersonnelManagement", element: <AdminPersonnelManagement /> }, // Đường dẫn cho Tất cả nhân sự
        { path: "adminEmployeeRegistration", element: <AdminEmployeeRegistration /> }, // Đường dẫn cho Đăng ký nhân viên
        { path: "adminDashboard", element: <AdminDashboard /> }, // Đường dẫn cho Dashboard
        { path: "adminCalendarManagement", element: <AdminCalendarManagement /> }, // Đường dẫn cho Xếp lịch Stylist
        { path: "adminServiceManagement", element: <AdminServiceManagement /> }, 
        { path: "AddSelection", element: <AddSelection /> },// Đường dẫn cho Quản lý dịch vụ
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import AboutUs from "./pages/about-us";
import Login from "./pages/login";
import Register from "./pages/register";
import ResetPassword from "./pages/reset-password";
import CustomerInformation from "./pages/customer-information";
import AdminInfo from "./pages/admin/admin-info";
import AdminPersonnelManagement from "./pages/admin/admin-personnel-management"; // Import đúng các component
import AdminEmployeeRegistration from "./pages/admin/admin-employee-registration";
import AdminDashboard from "./pages/admin/admin-dashboard";
import AdminCalendarManagement from "./pages/admin/admin-calendar-management";
import AdminServiceManagement from "./pages/admin/admin-service-management";
import AdminSelection from "./pages/admin/admin-selection-manament";

import AdminCategory from "./components/admin-category"; // Thêm dấu phẩy ở đây
import AddSelection from "./pages/admin/addmin-add-selection";

import Collection from "./pages/collection";
import Services from "./pages/services/services-list";
import Brand from "./pages/brand";
import ServicesDetail from "./pages/services/services-detail"; // Import component ServicesDetail
import Booking from "./pages/booking";
import CategoryManagement from "./pages/admin/category-management";

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
      path: "reset-password",
      element: <Layout />,
      children: [{ path: "", element: <ResetPassword /> }],
    },
    {
      path: "customer-information",
      element: <Layout />,
      children: [{ path: "", element: <CustomerInformation /> }],
    },
    {
      path: "adminpage",
      element: <AdminCategory />,
      children: [
        { path: "adminInfo", element: <AdminInfo /> }, // Đường dẫn cho admin thông tin
        {
          path: "adminPersonnelManagement",
          element: <AdminPersonnelManagement />,
        }, // Đường dẫn cho Tất cả nhân sự
        {
          path: "adminEmployeeRegistration",
          element: <AdminEmployeeRegistration />,
        }, // Đường dẫn cho Đăng ký nhân viên
        { path: "adminDashboard", element: <AdminDashboard /> }, // Đường dẫn cho Dashboard
        {
          path: "adminCalendarManagement",
          element: <AdminCalendarManagement />,
        }, // Đường dẫn cho Xếp lịch Stylist
        { path: "adminSelection", element: <AdminSelection /> },
        { path: "adminServiceManagement", element: <AdminServiceManagement /> }, // Đường dẫn cho Quản lý dịch vụ
        { path: "AddSelection", element: <AddSelection /> }, // Đường dẫn cho Quản lý dịch vụ
        { path: "adminInfo", element: <AdminInfo /> },
        {
          path: "adminPersonnelManagement",
          element: <AdminPersonnelManagement />,
        },
        {
          path: "adminEmployeeRegistration",
          element: <AdminEmployeeRegistration />,
        },
        { path: "adminDashboard", element: <AdminDashboard /> },
        {
          path: "adminCalendarManagement",
          element: <AdminCalendarManagement />,
        },
        { path: "adminServiceManagement", element: <AdminServiceManagement /> },
        { path: "category-management", element: <CategoryManagement /> },
      ],
    },
    {
      path: "collection",
      element: <Layout />,
      children: [
        { path: "", element: <Collection /> },
        { path: ":categoryName", element: <Collection /> },
      ],
    },
    {
      path: "services",
      element: <Layout />,
      children: [
        { path: "", element: <Services /> },
        { path: "detail/:id", element: <ServicesDetail /> }, // Đường dẫn chi tiết dịch vụ có `id`
      ],
    },
    {
      path: "brand",
      element: <Layout />,
      children: [{ path: "", element: <Brand /> }],
    },
    {
      path: "booking",
      element: <Layout />,
      children: [{ path: "", element: <Booking /> }],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

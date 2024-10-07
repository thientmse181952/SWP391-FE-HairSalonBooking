import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import AboutUs from "./pages/about-us";
import Login from "./pages/login";
import Register from "./pages/register";
import ResetPassword from "./pages/reset-password";
import CustomerInformation from "./pages/customer-information";
import AdminInfo from "./pages/admin/admin-info";
import AdminPersonnelManagement from "./pages/admin/customer-list"; // Import đúng các component
import AdminEmployeeRegistration from "./pages/admin/stylist-management";
import AdminDashboard from "./pages/admin/admin-dashboard";
import AdminCalendarManagement from "./pages/admin/calendar-management";
import AdminServiceManagement from "./pages/admin/service-management";
import AdminSelection from "./pages/admin/collection-management";

import AdminCategory from "./components/admin-category";
import StylistCategory from "./components/stylist-template"; // Thêm dấu phẩy ở đây

import Collection from "./pages/collection";
import Services from "./pages/services/services-list";
import Brand from "./pages/brand";
import ServicesDetail from "./pages/services/services-detail"; // Import component ServicesDetail
import Booking from "./pages/booking";
import CategoryManagement from "./pages/admin/category-management";
import StylistInfo from "./pages/stylist-page/stylist-info";
import StylistFeedback from "./pages/stylist-page/stylist-feedback";
import StylistPerformance from "./pages/stylist-page/stylist-performance";
import StylistSchedule from "./pages/stylist-page/stylist-work-schedule";
import StylistDayoff from "./pages/stylist-page/stylist-dayoff";
import CollectionManagement from "./pages/admin/collection-management";
import ChangePassword from "./pages/change-password";
import ProtectedRoute from "./components/routes/ProtectedRoute"; // Import ProtectedRoute

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
      path: "change-password",
      element: <Layout />,
      children: [{ path: "", element: <ChangePassword /> }],
    },
    {
      path: "customer-information",
      element: <Layout />,
      children: [{ path: "", element: <CustomerInformation /> }],
    },
    {
      path: "adminpage",
      element: (
        <ProtectedRoute roleRequired="MANAGER">
          <AdminCategory />
        </ProtectedRoute>
      ),
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
        { path: "CollectionManagement", element: <CollectionManagement /> }, // Đường dẫn cho Quản lý dịch vụ
        { path: "category-management", element: <CategoryManagement /> },
      ],
    },
    {
      path: "stylistpage",
      element: <StylistCategory />,
      children: [
        { path: "stylistInfo", element: <StylistInfo /> }, // Đường dẫn cho admin thông tin
        {
          path: "stylistFeedback",
          element: <StylistFeedback />,
        }, // Đường dẫn cho Tất cả nhân sự
        {
          path: "stylistPerformance",
          element: <StylistPerformance />,
        }, // Đường dẫn cho Đăng ký nhân viên
        { path: "stylistSchedule", element: <StylistSchedule /> }, // Đường dẫn cho Dashboard
        {
          path: "StylistDayoff",
          element: <StylistDayoff />,
        },
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

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import AboutUs from "./pages/about-us";
import Login from "./pages/login";
import Register from "./pages/register";
import ResetPassword from "./pages/reset-password";
import CustomerInformation from "./pages/customer-information";
import ChangePassword from "./pages/change-password";
import AdminInfo from "./pages/admin/admin-info";
import AdminPersonnelManagement from "./pages/admin/customer-list";
import AdminEmployeeRegistration from "./pages/admin/stylist-management";
import AdminDashboard from "./pages/admin/admin-dashboard";
import AdminCalendarManagement from "./pages/admin/calendar-management";
import AdminServiceManagement from "./pages/admin/service-management";
import AdminSelection from "./pages/admin/collection-management";
import AdminCategory from "./components/admin-category";
import StylistCategory from "./components/stylist-template";
import LayoutCustomer from "./components/layout-customer"; // Import LayoutCustomer
import SidebarCustomer from "./components/sidebar-customer"; // Import SidebarCustomer
import Collection from "./pages/collection";
import Services from "./pages/services/services-list";
import Brand from "./pages/brand";
import ServicesDetail from "./pages/services/services-detail";
import Booking from "./pages/booking";
import CategoryManagement from "./pages/admin/category-management";
import StylistInfo from "./pages/stylist-page/stylist-info";
import StylistFeedback from "./pages/stylist-page/stylist-feedback";
import StylistPerformance from "./pages/stylist-page/stylist-performance";
import StylistSchedule from "./pages/stylist-page/stylist-work-schedule";
import StylistDayoff from "./pages/stylist-page/stylist-dayoff";
import CollectionManagement from "./pages/admin/collection-management";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import StylistAccountManagement from "./pages/admin/stylist-account";
import CustomerBookingList from "./pages/customer-booking";
import SuccessPage from "./pages/payment";
import StylistScheduleAdmin from "./pages/admin/stylist-schedule";
import CategoryCollectionManagement from "./pages/admin/category-collection-management";

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
      path: "success",
      children: [{ path: "", element: <SuccessPage /> }],
    },
    {
      path: "reset-password",
      element: <Layout />,
      children: [{ path: "", element: <ResetPassword /> }],
    },
    // Layout dành cho Customer với các trang như thông tin và đổi mật khẩu
    {
      path: "customer",
      element: <LayoutCustomer />, // Áp dụng LayoutCustomer cho customer
      children: [
        { path: "information", element: <CustomerInformation /> }, // Thông tin khách hàng
        { path: "change-password", element: <ChangePassword /> }, // Đổi mật khẩu
        { path: "bookings", element: <CustomerBookingList /> }, // Đổi mật khẩu
      ],
    },
    {
      path: "adminpage",
      element: (
        <ProtectedRoute roleRequired="MANAGER">
          <AdminCategory />
        </ProtectedRoute>
      ),
      children: [
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
        { path: "adminSelection", element: <AdminSelection /> },
        {
          path: "category-collection-management",
          element: <CategoryCollectionManagement />,
        },
        { path: "category-management", element: <CategoryManagement /> },
        { path: "collection-management", element: <CollectionManagement /> },
        {
          path: "create-stylist-account",
          element: <StylistAccountManagement />,
        },
        { path: "stylist-schedule", element: <StylistScheduleAdmin /> },
      ],
    },
    {
      path: "stylistpage",
      element: <StylistCategory />,
      children: [
        { path: "stylistInfo", element: <StylistInfo /> },
        { path: "stylistFeedback", element: <StylistFeedback /> },
        { path: "stylistPerformance", element: <StylistPerformance /> },
        { path: "stylistSchedule", element: <StylistSchedule /> },
        { path: "StylistDayoff", element: <StylistDayoff /> },
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
        { path: "detail/:id", element: <ServicesDetail /> },
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

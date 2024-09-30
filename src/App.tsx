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
import AdminPersonnelManagement from "./pages/admin/admin-personnel-management";
import AdminEmployeeRegistration from "./pages/admin/admin-employee-registration";
import AdminDashboard from "./pages/admin/admin-dashboard";
import AdminCalendarManagement from "./pages/admin/admin-calendar-management";
import AdminServiceManagement from "./pages/admin/admin-service-management";
import Collection from "./pages/collection";
import Services from "./pages/services/services-list";
import Brand from "./pages/brand";
import ServicesDetail from "./pages/services/services-detail";
import { Navigate } from "react-router-dom"; // Import Navigate

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
      element: <LayoutPanel />,
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
        { path: "detail", element: <ServicesDetail /> },
      ],
    },
    {
      path: "brand",
      element: <Layout />,
      children: [{ path: "", element: <Brand /> }],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import AboutUs from "./pages/about-us";
import Login from "./pages/login";
import Register from "./pages/register";
import ResetPassword from "./pages/reset-password";
import CustomerInformation from "./pages/customer-information";
import Collection from "./pages/collection";
import Services from "./pages/services";
import Brand from "./pages/brand";

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
      path: "collection",
      element: <Layout />,
      children: [{ path: "", element: <Collection /> }],
    },
    {
      path: "services",
      element: <Layout />,
      children: [{ path: "", element: <Services /> }],
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

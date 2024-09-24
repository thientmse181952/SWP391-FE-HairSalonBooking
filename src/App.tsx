import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import AboutUs from "./pages/about-us";
import Login from "./pages/login";
import Register from "./pages/register";
import ResetPassword from "./pages/reset-password";
import CustomerInformation from "./pages/customer-information";
import Collection from "./pages/collection";

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
      path: "collection",
      element: <Layout />,
      children: [{ path: "", element: <Collection /> }],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

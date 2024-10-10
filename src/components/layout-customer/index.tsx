import { Outlet } from "react-router-dom";
import SidebarCustomer from "../sidebar-customer";
import Header from "../header";
import Footer from "../footer";
import "./index.scss";

const LayoutCustomer: React.FC = () => {
  return (
    <div className="layout-customer">
      <Header />
      <div className="layout-body">
        <SidebarCustomer />
        <div className="customer-content-container">
          <Outlet /> {/* Nơi render nội dung trang customer */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LayoutCustomer;

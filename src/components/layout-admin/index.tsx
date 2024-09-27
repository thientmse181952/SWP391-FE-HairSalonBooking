import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar";
import './index.scss';

function LayoutAdmin() {
  return (
    <div className="layout-panel">
      <Sidebar />
      <div className="outlet-container">
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutAdmin;

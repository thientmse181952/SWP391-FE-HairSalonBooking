import { FaFacebookF, FaGoogle, FaUserCircle } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate và useLocation
import { useEffect, useState } from "react"; // Import hooks

function Header() {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const location = useLocation(); // Khởi tạo useLocation để lấy URL hiện tại
  const [userFullName, setUserFullName] = useState<string | null>(null); // Tạo state để lưu fullName người dùng
  const [token, setToken] = useState<string | null>(null); // Tạo state để lưu token

  useEffect(() => {
    // Kiểm tra localStorage xem người dùng đã đăng nhập hay chưa
    const fullName = localStorage.getItem("fullName"); // Lấy fullName từ localStorage
    const savedToken = localStorage.getItem("token"); // Lấy token từ localStorage

    // Kiểm tra và đặt lại các state nếu tìm thấy token và fullName
    if (fullName && savedToken) {
      setUserFullName(fullName); // Lưu fullName vào state
      setToken(savedToken); // Lưu token vào state
    } else {
      setUserFullName(null); // Đảm bảo reset lại nếu không tìm thấy
      setToken(null); // Reset token
    }
  }, [location]); // Theo dõi `location` để cập nhật khi điều hướng

  const handleLogoClick = () => {
    navigate("/"); // Điều hướng về trang chủ khi nhấp vào logo
  };

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi localStorage và chuyển hướng đến trang đăng nhập
    localStorage.removeItem("fullName");
    localStorage.removeItem("token"); // Xóa token khi đăng xuất
    setUserFullName(null); // Reset lại trạng thái userFullName
    setToken(null); // Reset lại trạng thái token
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

  // Kiểm tra nếu đường dẫn hiện tại khớp với một trong các mục, thêm class 'active'
  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <div className="header-wrapper">
      <div className="header-top">
        <div className="contact-info">
          <div className="icon-group">
            <SiZalo />
            <FaFacebookF />
            <FaGoogle />
            <span className="separator"></span>
          </div>
          <div className="phone-number">+ 028 3811 6666</div>
        </div>

        <div className="user-section">
          <span className="separator"></span>
          <FaUserCircle />
          {userFullName ? (
            <div>
              <span>Xin chào, {userFullName}</span>{" "}
              {/* Hiển thị tên đầy đủ khi người dùng đã đăng nhập */}
              <br />
              <button className="logout-button" onClick={handleLogout}>
                Đăng xuất
              </button>{" "}
              {/* Nút Đăng xuất */}
            </div>
          ) : (
            <span
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer" }}
            >
              Đăng nhập/Đăng ký
            </span>
          )}
        </div>
      </div>

      <div className="header-bottom">
        <div className="menu">
          <div className="logo">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Logo%2Flogo.png?alt=media&token=ee1b9b13-5b44-48c4-9106-cc3fee3681a7"
              alt="Kim Salon Logo"
              onClick={handleLogoClick} // Gắn sự kiện click vào logo
              style={{ cursor: "pointer" }} // Đặt con trỏ pointer khi hover vào logo
            />
          </div>
          <span className={isActive("/")} onClick={() => navigate("/")}>
            Trang Chủ
          </span>
          <span
            className={isActive("/about-us")}
            onClick={() => navigate("/about-us")}
          >
            Về Chúng Tôi
          </span>
          <span
            className={isActive("/services")}
            onClick={() => navigate("/services")}
          >
            Giá Dịch Vụ
          </span>
          <span
            className={isActive("/brand")}
            onClick={() => navigate("/brand")}
          >
            Thương Hiệu
          </span>
          <span
            className={isActive("/collection")}
            onClick={() => navigate("/collection")}
          >
            Bộ Sưu Tập
          </span>
          <span
            className={isActive("/booking")}
            onClick={() => navigate("/booking")}
          >
            Đặt Lịch
          </span>
        </div>
      </div>
    </div>
  );
}

export default Header;

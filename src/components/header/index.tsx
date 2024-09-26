import { FaFacebookF, FaGoogle, FaUserCircle } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import "./index.scss";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useEffect, useState } from "react"; // Import hooks

function Header() {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [userPhone, setUserPhone] = useState<string | null>(null); // Tạo state để lưu số điện thoại người dùng

  useEffect(() => {
    // Kiểm tra localStorage xem người dùng đã đăng nhập hay chưa
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserPhone(parsedData.phone); // Lưu số điện thoại vào state
    }
  }, []);

  const handleLogoClick = () => {
    navigate("/"); // Điều hướng về trang chủ khi nhấp vào logo
  };

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi localStorage và chuyển hướng đến trang đăng nhập
    localStorage.removeItem("userData");
    setUserPhone(null); // Reset lại trạng thái userPhone
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

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
          {userPhone ? (
            <div>
              <span>Xin chào, {userPhone}</span>{" "}
              {/* Hiển thị khi người dùng đã đăng nhập */}
              <br />
              <button className="logout-button" onClick={handleLogout}>
                Đăng xuất
              </button>{" "}
              {/* Nút Đăng xuất */}
            </div>
          ) : (
            <a href="login">Đăng nhập/Đăng ký</a> // Hiển thị khi người dùng chưa đăng nhập
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
          <span onClick={() => navigate("/")}>Trang Chủ</span>
          <span onClick={() => navigate("/about-us")}>Về Chúng Tôi</span>
          <span onClick={() => navigate("/services")}>Giá Dịch Vụ</span>
          <span onClick={() => navigate("/brand")}>Thương Hiệu</span>
          <span onClick={() => navigate("/collection")}>Bộ Sưu Tập</span>
          <span onClick={() => navigate("/booking")}>Đặt Lịch</span>
        </div>
      </div>
    </div>
  );
}

export default Header;

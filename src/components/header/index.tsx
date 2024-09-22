import { FaFacebookF, FaGoogle, FaUserCircle } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import "./index.scss";

function Header() {
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
          <a href="#">Đăng nhập/Đăng ký</a>
        </div>
      </div>

      <div className="header-bottom">
        <div className="menu">
          <div className="logo">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Logo%2Flogo.png?alt=media&token=ee1b9b13-5b44-48c4-9106-cc3fee3681a7"
              alt="Kim Salon Logo"
            />
          </div>
          <a href="#">Trang Chủ</a>
          <a href="#">Về Chúng Tôi</a>
          <a href="#">Giá Dịch Vụ</a>
          <a href="#">Thương Hiệu</a>
          <a href="#">Bộ Sưu Tập</a>
          <a href="#">Đặt Lịch</a>
        </div>
      </div>
    </div>
  );
}

export default Header;

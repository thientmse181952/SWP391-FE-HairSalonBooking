import React from "react";
import "./index.scss";

const AboutUs: React.FC = () => {
  return (
    <div className="about-us">
      <div className="about-us-header">
        <h3>Về Kim Hair Salon, Sứ Mệnh, Tầm Nhìn</h3>
      </div>
      <div className="about-us-content">
        <div className="about-us-text">
          <h1>KIM HAIR SALON</h1>
          <p>
            Kim Hair Salon tự hào là chuỗi salon chuyên gia, có uy tín trong
            ngành làm đẹp tại Việt Nam. Tóc đẹp mỗi ngày là lời cam kết của Kim
            Hair Salon với khách hàng và vẻ đẹp nghệ thuật không chỉ nằm ở sự
            hào nhoáng của vẻ ngoài, mà còn nằm ở tiêu chuẩn “vàng” của mỗi nhà
            sáng tạo. Một mái tóc đẹp, ngoài màu sắc xu hướng, kiểu dáng hợp
            thời trang mà còn phải toát lên nét đẹp từ sự khỏe mạnh của mái tóc
            từ bên trong.
          </p>
        </div>
        <div className="about-us-image">
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/AboutUs%2Fbanner1.png?alt=media&token=416e12a7-1280-4220-b661-5c6268137abc"
            }
            alt="Kim Hair Salon"
          />
        </div>
      </div>

      {/* Phần mới thêm vào */}
      <div className="mission-vision-section">
        <div className="mission-vision-image">
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/AboutUs%2Fbanner2.png?alt=media&token=cc57752f-a745-4446-9e78-a575eb45fc93"
            }
            alt="Mission and Vision"
          />
        </div>
        <div className="mission-vision-text">
          <div className="mission">
            <h2>SỨ MỆNH</h2>
            <p>
              Kim Hair Salon tôn vinh giá trị đẹp cho mái tóc Việt bằng đội ngũ
              nhân sự được đào tạo bài bản với quy chuẩn các giá trị bền vững,
              lan tỏa giá trị của sống đẹp, sống hạnh phúc bằng niềm đam mê nghệ
              thuật bất tận.
            </p>
          </div>
          <div className="vision">
            <h2>TẦM NHÌN</h2>
            <p>
              Trở thành chuỗi Salon xanh và bền vững được yêu thích nhất tại
              Việt Nam đạt chuẩn quốc tế.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

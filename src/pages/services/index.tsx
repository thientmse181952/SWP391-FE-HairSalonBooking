import React from "react";
import "./index.scss";

const ServiceItem = ({ imageSrc, title, price }) => (
  <div className="service-item">
    <img src={imageSrc} alt={title} />
    <div className="service-info">
      <h3>{title}</h3>
      <p>{price}</p>
    </div>
  </div>
);

const Services = () => {
  return (
    <div className="services-wrapper">
      <div className="services-header">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Services%2Fbanner.png?alt=media&token=6fc59bb2-b911-45ff-8514-2bfd2df7209d"
          alt="Banner"
        />
      </div>

      <div className="service-categories">
        <button className="active">Cắt - Gội - Sấy</button>
        <button>Uốn - Duỗi</button>
        <button>Nhuộm</button>
        <button>Phục Hồi - Nối Tóc</button>
        <button>Tóc Nam</button>
      </div>

      <div className="service-grid">
        <ServiceItem
          imageSrc="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Services%2Fcat-goi-say%2Fcat-toc-nu.png?alt=media&token=614acbce-56da-434a-a0a6-5b6ae00381c5"
          title="Cắt Tóc Nữ"
          price="300.000 - 600.000"
        />
        <ServiceItem
          imageSrc="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Services%2Fcat-goi-say%2Fgoi-dau-nu.png?alt=media&token=cfa119ae-afd2-4cf0-b97b-d40c8380674d"
          title="Gội Đầu Nữ"
          price="200.000 - 350.000"
        />
        <ServiceItem
          imageSrc="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Services%2Fcat-goi-say%2Fsay-tao-kieu.png?alt=media&token=7a0f7a02-215f-41c1-bc91-9ae85648eb3f"
          title="Sấy, Tạo Kiểu"
          price="100.000"
        />
        <ServiceItem
          imageSrc="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Services%2Fcat-goi-say%2Ftao-kieu-di-tiec.png?alt=media&token=55d176f6-fbf8-4233-9034-91e4883ef4e8"
          title="Tạo Kiểu Đi Tiệc"
          price="200.000"
        />
      </div>
    </div>
  );
};

export default Services;

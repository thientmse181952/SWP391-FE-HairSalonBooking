import React from "react";
import "./index.scss";
import { Image } from "antd";

const ServicesDetail = () => {
  return (
    <div className="services-detail-wrapper">
      <div className="service-image">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Services%2Fuon-duoi%2Fuon-toc-nu.png?alt=media&token=9a2e042c-6ac5-4f82-a23f-e68efa286120"
          alt="Uốn Tóc Nữ"
        />
      </div>

      <div className="service-info">
        <h2>Uốn Tóc Nữ</h2>
        <p className="price-range">
          <span className="price">1.100.000 - 1.400.000</span> VND
        </p>
        <p>Uốn/Duỗi Tóc Nữ cơ bản</p>
        <ul>
          <li>Tóc tém: 1.100.000 VND</li>
          <li>Tóc ngắn: 1.200.000 VND</li>
          <li>Tóc dài: 1.400.000 VND</li>
        </ul>
        <button className="book-now">Đặt Lịch Ngay</button>
      </div>
    </div>
  );
};

export default ServicesDetail;

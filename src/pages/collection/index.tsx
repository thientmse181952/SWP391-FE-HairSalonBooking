import React from "react";
import "./index.scss";
import { Image } from "antd";

const imageData = [
  {
    id: 1,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Collection%2Fmau-balayage-ombre%2F1.png?alt=media&token=f1bd5544-1101-470e-bdcd-67b146ce84ff",
    alt: "Hair Style 1",
  },
  {
    id: 2,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Collection%2Fmau-balayage-ombre%2F2.png?alt=media&token=e8d5d4fe-c9ea-4584-9e3f-0c9fe85d5820",
    alt: "Hair Style 2",
  },
  {
    id: 3,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Collection%2Fmau-balayage-ombre%2F3.png?alt=media&token=69a999fa-5d52-4146-b506-b8503ed5c69c",
    alt: "Hair Style 3",
  },
  {
    id: 4,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Collection%2Fmau-balayage-ombre%2F4.png?alt=media&token=62b22692-13ad-4b9e-8709-8aff5c8f8600",
    alt: "Hair Style 4",
  },
  {
    id: 5,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Collection%2Fmau-balayage-ombre%2F5.png?alt=media&token=b7ef2ae4-1935-4bd6-95ad-b8e8e8298af7",
    alt: "Hair Style 5",
  },
  {
    id: 6,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Collection%2Fmau-balayage-ombre%2F6.png?alt=media&token=9af30772-1759-49c2-895c-4129fd345f41",
    alt: "Hair Style 6",
  },
  {
    id: 7,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Collection%2Fmau-balayage-ombre%2F7.png?alt=media&token=ca4b9fbc-b629-42e9-bff4-9a38a2626a67",
    alt: "Hair Style 7",
  },
  {
    id: 8,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Collection%2Fmau-balayage-ombre%2F8.png?alt=media&token=3e54b6c6-087a-4db1-9bfd-e9ba93c23619",
    alt: "Hair Style 8",
  },
  {
    id: 9,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Collection%2Fmau-balayage-ombre%2F9.png?alt=media&token=b82c21e9-9227-48f4-904b-75e414569f21",
    alt: "Hair Style 9",
  },
];

const Collection: React.FC = () => {
  return (
    <div className="collection-wrapper">
      <div className="collection-header">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Collection%2Fbanner.png?alt=media&token=813fa013-8d1c-4b41-9257-aff291196736"
          alt="New Collection"
        />
      </div>

      <div className="collection-content">
        <div className="collection-sidebar">
          <h3>Bộ Sưu Tập</h3>
          <div className="sidebar-section">
            <h4>Tóc Nhuộm</h4>
            <ul>
              <li className="active">Màu Balayage, Ombre</li>
              <li>Màu nhuộm công sở</li>
              <li>Màu nhuộm thời trang</li>
            </ul>
          </div>
          <div className="sidebar-section">
            <h4>Cắt & Tạo Kiểu</h4>
            <ul>
              <li>Tóc bob</li>
              <li>Tóc dài</li>
              <li>Tóc ngắn</li>
              <li>Kiểu tóc xu hướng</li>
              <li>Tóc lỡ</li>
            </ul>
          </div>
          <div className="sidebar-section">
            <h4>Tóc Uốn - Duỗi</h4>
            <ul>
              <li>Tóc duỗi</li>
              <li>Tóc uốn xoăn</li>
              <li>Tóc uốn xoăn ngọn, dợn sóng lơi</li>
            </ul>
          </div>
          <div className="sidebar-section">
            <h4>Tóc Nam</h4>
          </div>
          <div className="sidebar-section">
            <h4>BST & Hairshow</h4>
          </div>
        </div>

        <div className="collection-gallery">
          <h2 className="collection-title">Màu Balayage, Ombre</h2>

          <div className="gallery-grid">
            {imageData.map((image) => (
              <div className="grid-item" key={image.id}>
                <Image src={image.src} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;

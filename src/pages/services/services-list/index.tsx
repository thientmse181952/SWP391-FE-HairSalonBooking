import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../../../config/axios";
import "./index.scss";

// Component hiển thị từng mục dịch vụ
const ServiceItem = ({ id, imageSrc, title, price, onClick }) => (
  <div className="service-item" onClick={() => onClick(id)}>
    {" "}
    {/* Gọi hàm onClick */}
    <img src={imageSrc} alt={title} />
    <div className="service-info">
      <h3>{title}</h3>
      <p>{price}</p>
    </div>
  </div>
);

const Services = () => {
  const [categories, setCategories] = useState([]); // State để lưu các danh mục
  const [services, setServices] = useState([]); // State để lưu tất cả các dịch vụ từ API
  const [filteredServices, setFilteredServices] = useState([]); // Dịch vụ được lọc theo category
  const [activeCategory, setActiveCategory] = useState(null); // Theo dõi category hiện tại
  const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng

  // Gọi API để lấy danh sách category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category/getCategory");
        setCategories(response.data);
        setActiveCategory(response.data[0]?.id);
        // Đặt category mặc định là category đầu tiên
      } catch (error) {
        console.error("Lỗi khi lấy danh sách category: ", error);
      }
    };

    fetchCategories();
  }, []);

  // Gọi API để lấy toàn bộ danh sách services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/service"); // Lấy toàn bộ dịch vụ
        console.log("Dịch vụ trả về từ API:", response.data); // Kiểm tra dữ liệu trả về từ API
        setServices(response.data); // Lưu toàn bộ dịch vụ vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách services: ", error);
      }
    };

    fetchServices();
  }, []);

  // Lọc dịch vụ theo activeCategory
  useEffect(() => {
    if (activeCategory && services.length > 0) {
      const filtered = services.filter(
        (service) => service.category == activeCategory // Kiểm tra category có khớp với activeCategory không
      );
      console.log("Dịch vụ được lọc:", filtered); // Kiểm tra danh sách dịch vụ sau khi lọc
      setFilteredServices(filtered); // Cập nhật danh sách dịch vụ đã lọc
    }
  }, [activeCategory, services]); // Chạy lại khi activeCategory hoặc danh sách services thay đổi

  // Hàm xử lý khi nhấp vào dịch vụ
  const handleServiceClick = (id) => {
    navigate(`/services/detail/${id}`); // Điều hướng đến trang chi tiết dịch vụ với `id`
  };

  return (
    <div className="services-wrapper">
      <div className="services-header">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Services%2Fbanner.png?alt=media&token=6fc59bb2-b911-45ff-8514-2bfd2df7209d"
          alt="Banner"
        />
      </div>

      {/* Hiển thị các category từ API */}
      <div className="service-categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={activeCategory === category.id ? "active" : ""}
            onClick={() => setActiveCategory(category.id)} // Thay đổi active category
          >
            {category.nameCategory}
          </button>
        ))}
      </div>

      {/* Hiển thị các dịch vụ tương ứng đã được lọc */}
      <div className="service-grid">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceItem
              key={service.id}
              id={service.id}
              imageSrc={service.serviceImage} // Hiển thị hình ảnh từ API
              title={service.name} // Hiển thị tên dịch vụ
              price={`Giá từ ${service.price.toLocaleString("vi-VN")} VND`} // Hiển thị giá dịch vụ với dấu chấm ngăn cách
              onClick={handleServiceClick} // Truyền hàm xử lý khi nhấp vào
            />
          ))
        ) : (
          <p>Không có dịch vụ nào cho danh mục này.</p>
        )}
      </div>
    </div>
  );
};

export default Services;

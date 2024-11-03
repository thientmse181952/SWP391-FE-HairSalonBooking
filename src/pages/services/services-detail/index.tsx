import React, { useEffect, useState } from "react";
import "./index.scss";
import { Image, Card, message } from "antd";
import { useParams, useNavigate } from "react-router-dom"; // Để lấy id từ URL và điều hướng
import api from "../../../config/axios"; // Sử dụng api để gọi dữ liệu

const ServicesDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate(); // Sử dụng để điều hướng
  const [serviceDetail, setServiceDetail] = useState(null); // Chi tiết dịch vụ
  const [similarServices, setSimilarServices] = useState([]); // Dịch vụ cùng loại

  // Cuộn lên đầu trang mỗi khi id thay đổi
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  // Gọi API để lấy chi tiết dịch vụ theo id
  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const response = await api.get("/service/getService"); // Lấy toàn bộ danh sách dịch vụ
        const selectedService = response.data.find(
          (service) => service.id === parseInt(id)
        ); // Tìm dịch vụ có id khớp với id từ URL
        setServiceDetail(selectedService); // Lưu thông tin chi tiết dịch vụ
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết dịch vụ: ", error);
      }
    };

    fetchServiceDetail();
  }, [id]);

  // Gọi API để lấy các dịch vụ tương tự (lọc dựa trên category của dịch vụ hiện tại)
  useEffect(() => {
    const fetchSimilarServices = async () => {
      try {
        const response = await api.get("/service/getService"); // Lấy toàn bộ dịch vụ
        setSimilarServices(
          response.data.filter(
            (service) =>
              service.category.id === serviceDetail.category.id && // Lọc dịch vụ có cùng category id
              service.id !== parseInt(id) // Loại bỏ dịch vụ hiện tại
          )
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ tương tự: ", error);
      }
    };

    if (serviceDetail) {
      fetchSimilarServices(); // Chỉ gọi khi đã có chi tiết dịch vụ
    }
  }, [serviceDetail, id]);

  // Hàm xử lý khi nhấn nút "Đặt Lịch Ngay"
  const handleBookingClick = () => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (token) {
      navigate("/booking"); // Nếu đã đăng nhập, điều hướng đến trang booking
    } else {
      message.error("Vui lòng đăng nhập để sử dụng dịch vụ!"); // Hiển thị thông báo yêu cầu đăng nhập
      navigate("/login"); // Điều hướng đến trang login nếu chưa đăng nhập
    }
  };

  // Hiển thị loading nếu chưa có dữ liệu
  if (!serviceDetail) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="services-detail-wrapper">
      <div className="service-main">
        <div className="service-image">
          <Image src={serviceDetail.serviceImage} alt={serviceDetail.name} />
        </div>

        <div className="service-info">
          <h2>{serviceDetail.name}</h2>
          <p className="price-range">
            <span className="price">
              Giá từ {serviceDetail.price.toLocaleString("vi-VN")}
            </span>{" "}
            VND
          </p>
    
          <button class="button">
            <h3> Thời lượng:{serviceDetail.duration} phút </h3>
            <div class="hoverEffect">
              <div></div>
            </div>
          </button>
          {/* Hiển thị description với định dạng HTML */}
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: serviceDetail.description }}
          />
          {/* Nút Đặt Lịch Ngay */}
          <button className="book-now" onClick={handleBookingClick}>
            Đặt Lịch Ngay
          </button>
        </div>
      </div>

      {/* Phần Dịch Vụ Cùng Loại */}
      <div className="similar-services-container">
        <h2 className="similar-services-title">Dịch Vụ Cùng Loại</h2>
        <div className="similar-services-list">
          {similarServices.length > 0 ? (
            similarServices.map((service) => (
              <Card
                key={service.id}
                hoverable
                cover={<img alt={service.name} src={service.serviceImage} />}
                className="similar-service-card"
                onClick={() => navigate(`/services/detail/${service.id}`)} // Điều hướng khi click vào dịch vụ
              >
                <Card.Meta
                  title={service.name}
                  description={`Giá từ ${service.price.toLocaleString(
                    "vi-VN"
                  )} VND`}
                />
              </Card>
            ))
          ) : (
            <p>Không có dịch vụ nào cho danh mục này.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesDetail;

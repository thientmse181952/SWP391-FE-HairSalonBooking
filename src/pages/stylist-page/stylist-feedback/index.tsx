import React, { useState, useEffect } from "react";
import { Table, Rate, message } from "antd";
import moment from "moment";
import api from "../../../config/axios";
import "./index.scss";

const StylistFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const stylistId = localStorage.getItem("stylistId"); // Lấy stylistId từ localStorage

  // Gọi API để lấy danh sách feedback, account, và service
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbackResponse = await api.get("/feedback/getAllFeedback");
        const allFeedbacks = feedbackResponse.data;

        // Lọc feedback theo stylistId
        const filteredFeedbacks = allFeedbacks
          .filter(
            (feedback: any) =>
              feedback.booking.stylist.id === parseInt(stylistId || "0")
          )
          .map((feedback: any) => {
            return {
              key: feedback.id, // hoặc feedback.feedbackId nếu `feedbackId` là thuộc tính chính xác
              customerId: feedback.booking.customer.id,
              bookingId: feedback.booking.id, // Cập nhật chỗ này để lấy booking.id thay vì booking.bookingId
              appointmentDate: feedback.booking.appointmentDate,
              startTime: feedback.booking.startTime,
              endTime: feedback.booking.endTime,
              feedback: feedback.comment,
              rating: parseFloat(feedback.rating_stylist),
            };
          });

        setFeedbacks(filteredFeedbacks);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách feedback:", error);
        message.error("Không thể tải danh sách feedback.");
      }
    };

    const fetchAccounts = async () => {
      try {
        const accountResponse = await api.get("/account");
        setAccounts(accountResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách account:", error);
        message.error("Không thể tải danh sách account.");
      }
    };

    const fetchServices = async () => {
      try {
        const serviceResponse = await api.get("/service/getService");
        console.log("Dữ liệu services từ API:", serviceResponse.data); // Kiểm tra dữ liệu services
        setServices(serviceResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách service:", error);
        message.error("Không thể tải danh sách service.");
      }
    };

    fetchFeedbacks();
    fetchAccounts();
    fetchServices();
  }, [stylistId]);

  // Hàm lấy tên dịch vụ theo bookingId
  const getServiceNamesByBookingId = (bookingId: number) => {
    // Lọc ra tất cả các dịch vụ có chứa bookingId này
    const relevantServices = services.filter((service: any) =>
      service.bookings.some((booking: any) => booking.id === bookingId)
    );
    console.log(
      "Dịch vụ tìm được cho bookingId",
      bookingId,
      "là:",
      relevantServices
    ); // Kiểm tra các dịch vụ tìm thấy
    return relevantServices.map((service: any) => service.name).join(", ");
  };

  const getCustomerName = (customerId: number) => {
    const account = accounts.find((account: any) =>
      account.customers.some((customer: any) => customer.id === customerId)
    );
    return account ? account.fullName : `Khách hàng ${customerId}`;
  };

  const columns = [
    {
      title: "Tên Khách Hàng",
      dataIndex: "customerId",
      key: "customerId",
      render: (customerId: number) => getCustomerName(customerId),
      width: "10%", // Giảm độ rộng cột "Tên Khách Hàng"
    },
    {
      title: "Dịch Vụ",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (bookingId: number) => getServiceNamesByBookingId(bookingId),
      width: "15%",
    },
    {
      title: "Ngày Làm",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date: string) => moment(date).format("DD-MM-YYYY"),
      width: "15%",
    },
    {
      title: "Thời Gian",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime: string, record: any) =>
        `${startTime} - ${record.endTime}`,
      width: "15%",
    },
    {
      title: "Đánh Giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <div className="feedback-container">
          <Rate allowHalf disabled defaultValue={rating} />
        </div>
      ),
      width: "10%",
    },
    {
      title: "Nội Dung Phản Hồi",
      dataIndex: "feedback",
      key: "feedback",
      width: "35%",
    },
  ];

  return <Table columns={columns} dataSource={feedbacks} rowKey="key" />;
};

export default StylistFeedback;

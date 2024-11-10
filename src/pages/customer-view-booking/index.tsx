import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Rate, message } from "antd";
import moment from "moment";
import api from "../../config/axios";
import "./index.scss";

const CustomerViewBooking: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [updatedBookings, setUpdatedBookings] = useState<any[]>([]);
  const customerId = localStorage.getItem("customerId");
  const [services, setServices] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);
  const [ratingStylist, setRatingStylist] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [currentFeedbackId, setCurrentFeedbackId] = useState<number | null>(null);

  const openFeedbackModal = (bookingId: number, feedbackId?: number, status?: string) => {
    if (status !== "Đã thanh toán") {
      message.warning("Chỉ có thể đánh giá khi dịch vụ đã được thanh toán.");
      return;
    }

    setCurrentBookingId(bookingId);

    if (feedbackId) {
      const existingFeedback = feedbacks.find((feedback: any) => feedback.id === feedbackId);
      if (existingFeedback) {
        setRatingStylist(parseFloat(existingFeedback.rating_stylist));
        setComment(existingFeedback.comment);
        setCurrentFeedbackId(existingFeedback.id);
      }
    } else {
      setRatingStylist(0);
      setComment("");
      setCurrentFeedbackId(null);
    }

    setIsModalVisible(true);
  };

  const closeFeedbackModal = () => {
    setIsModalVisible(false);
    setRatingStylist(0);
    setComment("");
  };

  const handleSubmitFeedback = async () => {
    if (!currentBookingId) {
      message.error("Không tìm thấy booking để đánh giá.");
      return;
    }

    try {
      const feedbackData = {
        rating_stylist: ratingStylist,
        comment,
        booking: { id: currentBookingId },
      };

      let response;
      if (currentFeedbackId) {
        response = await api.put(`/feedback/${currentFeedbackId}`, feedbackData);
      } else {
        response = await api.post("/feedback/createFeedback", feedbackData);
      }

      if (response.status === 200) {
        message.success(currentFeedbackId ? "Đánh giá đã được cập nhật!" : "Đánh giá đã được gửi!");
        const feedbackResponse = await api.get("/feedback/getAllFeedback");
        setFeedbacks(feedbackResponse.data);
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      message.error("Gửi đánh giá thất bại.");
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/getBooking");
        const allBookings = response.data;

        const customerBookings = allBookings
          .filter((booking) => booking.customer.id === parseInt(customerId || "0"))
          .sort((a, b) => b.id - a.id) // Sắp xếp theo ID giảm dần
          .slice(0, 2); // Lấy 2 booking đầu tiên

        setBookings(customerBookings);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách booking:", error);
      }
    };

    fetchBookings();
  }, [customerId]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await api.get("/feedback/getAllFeedback");
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách feedback:", error);
        message.error("Không thể tải danh sách feedback.");
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const fetchAccountsAndServices = async () => {
      try {
        const accountResponse = await api.get("/account");
        setAccounts(accountResponse.data);

        const serviceResponse = await api.get("/service/getService");
        setServices(serviceResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách account và service:", error);
      }
    };

    fetchAccountsAndServices();
  }, []);

  useEffect(() => {
    if (bookings.length > 0 && accounts.length > 0 && services.length > 0) {
      const latestBookings = bookings.map((booking) => {
        const stylistAccount = accounts.find((account: any) =>
          account.stylists.some((stylist: any) => stylist.id === booking.stylist.id)
        );

        const serviceNames = services
          .filter((service: any) =>
            service.bookings.some((book: any) => book.id === booking.id)
          )
          .map((service: any) => service.name)
          .join(", ");

        return {
          ...booking,
          stylistName: stylistAccount ? stylistAccount.fullName : "Stylist không xác định",
          serviceNames: serviceNames || "Không rõ dịch vụ",
        };
      });

      setUpdatedBookings(latestBookings); // Cập nhật state với booking mới nhất
    }
  }, [bookings, accounts, services]);

  return (
    <div className="booking-list">
      <div className="outer">
        <div className="dot"></div>
        <div className="card_view">
          <div className="ray"></div>
          <div className="text">
            <h2 style={{ fontSize: '36px' }}>KIM HAIRSALON</h2>
          </div>
          <div className="line topl"></div>
          <div className="line leftl"></div>
          <div className="line bottoml"></div>
          <div className="line rightl"></div>
        </div>
      </div>

      {updatedBookings.map((booking) => (
        <div className="plan" key={booking.id}>
          <div className="inner">
            <span className="pricing">
              <span>
                <h4 style={{ fontSize: '28px' }}>{booking.status}</h4>
              </span>
            </span>
            <p className="title" style={{ fontSize: '24px' }}>WELCOME TO KIM HAIRSALON</p>
            <div className="booking-card">
              <div className="notification">
                <div className="notiglow"></div>
                <div className="notiborderglow"></div>
                <div className="notititle" style={{ fontSize: '20px' }}>Hân hạnh được phục vụ</div>
                <div className="notibody">
                  <h4 style={{ fontSize: '20px' }}>Dịch vụ: {booking.serviceNames}</h4>
                </div>
              </div>
              <br />

              <div className="action-buttons">
                {booking.status === "Đã thanh toán" && (
                  <Button
                    type="primary"
                    size="large"
                    onClick={() =>
                      openFeedbackModal(
                        booking.id,
                        feedbacks.find((feedback) => feedback.booking.id === booking.id)?.id,
                        booking.status
                      )
                    }
                  >
                    {feedbacks.find((feedback) => feedback.booking.id === booking.id) ? "Sửa đánh giá" : "Đánh giá"}
                  </Button>
                )}
              </div>
            </div>

            <ul className="features">
              <li>
                <span className="icon">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                  </svg>
                </span>
                <span style={{ fontSize: '18px' }}>
                  <strong>Ngày đặt lịch:</strong> {moment(booking.appointmentDate).format("DD-MM-YYYY")}
                </span>
              </li>
              <li>
                <span className="icon">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                  </svg>
                </span>
                <span style={{ fontSize: '18px' }}>
                  <strong>Thời gian: </strong>
                  {booking.startTime} - {booking.endTime}
                </span>
              </li>
              <li>
                <span className="icon">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                  </svg>
                </span>
                <span style={{ fontSize: '18px' }}>
                  <strong>Stylist: </strong>
                  {booking.stylistName}
                </span>
              </li>
              <p className="info" style={{ fontSize: '18px', margin:'auto', padding:'10px'}}>
                Mong quý khách có mặt đúng hẹn và sớm gặp lại quý khách
              </p>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerViewBooking;

import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Rate, message, Popconfirm } from "antd";
import moment from "moment";
import api from "../../config/axios";
import "./index.scss";

const CustomerBookingList: React.FC = () => {
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
  const [currentFeedbackId, setCurrentFeedbackId] = useState<number | null>(
    null
  );

  const openFeedbackModal = (
    bookingId: number,
    feedbackId?: number,
    status?: string
  ) => {
    if (status !== "Đã thanh toán") {
      message.warning("Chỉ có thể đánh giá khi dịch vụ đã được thanh toán.");
      return;
    }

    setCurrentBookingId(bookingId);

    if (feedbackId) {
      const existingFeedback = feedbacks.find(
        (feedback: any) => feedback.id === feedbackId
      );
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
        response = await api.put(
          `/feedback/${currentFeedbackId}`,
          feedbackData
        );
      } else {
        response = await api.post("/feedback/createFeedback", feedbackData);
      }

      if (response.status === 200) {
        message.success(
          currentFeedbackId
            ? "Đánh giá đã được cập nhật!"
            : "Đánh giá đã được gửi!"
        );
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
          .filter(
            (booking) => booking.customer.id === parseInt(customerId || "0")
          )
          .sort(
            (a, b) =>
              new Date(b.appointmentDate).getTime() -
              new Date(a.appointmentDate).getTime()
          );

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
      const latestBooking = bookings[0]; // Lấy booking mới nhất

      const stylistAccount = accounts.find((account: any) =>
        account.stylists.some(
          (stylist: any) => stylist.id === latestBooking.stylist.id
        )
      );

      const serviceNames = services
        .filter((service: any) =>
          service.bookings.some((book: any) => book.id === latestBooking.id)
        )
        .map((service: any) => service.name)
        .join(", ");

      const updatedBooking = {
        ...latestBooking,
        stylistName: stylistAccount
          ? stylistAccount.fullName
          : "Stylist không xác định",
        serviceNames: serviceNames || "Không rõ dịch vụ",
      };

      setUpdatedBookings([updatedBooking]); // Cập nhật state với booking mới nhất
    }
  }, [bookings, accounts, services]);

  return (
    <div className="booking-list">
      <div class="outer">
        <div class="dot"></div>
        <div class="card_view">
          <div class="ray"></div>
          <div class="text">
            {" "}
            <h2>KIM HAIRSALON</h2>
          </div>

          <div class="line topl"></div>
          <div class="line leftl"></div>
          <div class="line bottoml"></div>
          <div class="line rightl"></div>
        </div>
      </div>

      {updatedBookings.map((booking) => (
        <div class="plan">
          <div class="inner">
            <span class="pricing">
              <span>
                <h4>{booking.status}</h4>
              </span>
            </span>
            <p class="title">WELCOME TO KIM HAIRSALON</p>
            <div className="booking-card" key={booking.id}>
              <div class="notification">
                <div class="notiglow"></div>
                <div class="notiborderglow"></div>
                <div class="notititle">Hân hạnh được phục vụ</div>
                <div class="notibody">
                  <h4>Dịch vụ: {booking.serviceNames}</h4>
                </div>
              </div>
              <br></br>

              <div className="action-buttons">
                {booking.status === "Đã thanh toán" && (
                  <Button
                    type="primary"
                    onClick={() =>
                      openFeedbackModal(
                        booking.id,
                        feedbacks.find(
                          (feedback) => feedback.booking.id === booking.id
                        )?.id,
                        booking.status
                      )
                    }
                  >
                    {feedbacks.find(
                      (feedback) => feedback.booking.id === booking.id
                    )
                      ? "Sửa đánh giá"
                      : "Đánh giá"}
                  </Button>
                )}
              </div>
            </div>

            <ul class="features">
              <li>
                <span class="icon">
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      fill="currentColor"
                      d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                    ></path>
                  </svg>
                </span>
                <span>
                  <strong>Ngày đặt lịch:</strong>{" "}
                  {moment(booking.appointmentDate).format("DD-MM-YYYY")}
                </span>
              </li>
              <li>
                <span class="icon">
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      fill="currentColor"
                      d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                    ></path>
                  </svg>
                </span>
                <span>
                  <strong>Thời gian: </strong>
                  {booking.startTime} - {booking.endTime}
                </span>
              </li>
              <li>
                <span class="icon">
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      fill="currentColor"
                      d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                    ></path>
                  </svg>
                </span>
                <span>
                  <strong>Stylist: </strong>
                  {booking.stylistName}
                </span>
              </li>
              <p class="info">
                Mong quý khách có mặt đúng hẹn và sớm gặp lại quý khách
              </p>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerBookingList;

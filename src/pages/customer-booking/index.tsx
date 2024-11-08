import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Popconfirm, Rate, Table, message } from "antd";
import moment from "moment";
import api from "../../config/axios";
import "./index.scss";

const CustomerBookingList: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [updatedBookings, setUpdatedBookings] = useState<any[]>([]);
  const customerId = localStorage.getItem("customerId");
  const [services, setServices] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]); // Thêm state feedbacks
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);
  const [ratingStylist, setRatingStylist] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [currentFeedbackId, setCurrentFeedbackId] = useState<number | null>(
    null
  );

  const columns = [
    {
      title: "Ngày đặt lịch",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date: string) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Thời gian",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime: string, record: any) =>
        `${startTime} - ${record.endTime}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => status,
    },
    {
      title: "Stylist",
      dataIndex: "stylistName",
      key: "stylist",
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceNames",
      key: "services",
    },
    {
      title: "Đánh giá",
      dataIndex: "feedback",
      key: "feedback",
      render: (text: any, record: any) => {
        const bookingFeedback = feedbacks.find(
          (feedback: any) => feedback.booking.id === record.id
        );
        return bookingFeedback ? (
          <div className="feedback-container" key={record.id}>
            <Rate
              disabled
              allowHalf
              value={parseFloat(bookingFeedback.rating_stylist)}
            />
            <div className="comment-text">
              Bình luận: {bookingFeedback.comment}
            </div>
          </div>
        ) : (
          <span key={record.id}>Chưa có đánh giá</span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text: any, record: any) => {
        // Chỉ hiển thị nút xóa khi trạng thái là "Đã xác nhận"
        const isConfirmed = record.status === "Đã xác nhận";
        const bookingFeedback = feedbacks.find(
          (feedback: any) => feedback.booking.id === record.id
        );

        return (
          <div>
            {isConfirmed && (
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa đặt lịch này không?"
                onConfirm={() => handleDeleteBooking(record.id)}
                okText="Có"
                cancelText="Không"
              >
                <Button type="link" danger>
                  Xóa
                </Button>
              </Popconfirm>
            )}
            {record.status === "Đã thanh toán" && (
              <Button
                type="primary"
                onClick={() =>
                  openFeedbackModal(
                    record.id,
                    bookingFeedback?.id,
                    record.status
                  )
                }
              >
                {bookingFeedback ? "Sửa" : "Đánh giá"}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      console.log("Deleting booking with ID:", bookingId);

      const response = await api.delete(`/bookings/${bookingId}`);
      if (response.status === 200) {
        message.success("Xóa đặt lịch thành công!");

        // Cập nhật lại danh sách booking sau khi xóa thành công
        setBookings((prevBookings) =>
          prevBookings
            .filter((booking) => booking.id !== bookingId)
            .sort((a, b) => b.id - a.id)
        );
      } else {
        message.error("Không thể xóa đặt lịch. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa đặt lịch:", error);
      message.error("Đã xảy ra lỗi khi xóa đặt lịch.");
    }
  };

  const openFeedbackModal = (
    bookingId: number,
    feedbackId?: number,
    status?: string
  ) => {
    // Chỉ cho phép feedback nếu status là "Đã thanh toán"
    if (status !== "Đã thanh toán") {
      message.warning("Chỉ có thể đánh giá khi dịch vụ đã được thanh toán.");
      return;
    }

    console.log("Đang mở modal với bookingId:", bookingId);
    console.log("feedbackId truyền vào:", feedbackId);

    setCurrentBookingId(bookingId);

    if (feedbackId) {
      const existingFeedback = feedbacks.find(
        (feedback: any) => feedback.id === feedbackId
      );
      console.log("existingFeedback tìm thấy:", existingFeedback);

      if (existingFeedback) {
        setRatingStylist(parseFloat(existingFeedback.rating_stylist));
        setComment(existingFeedback.comment);
        setCurrentFeedbackId(existingFeedback.id); // Set feedbackId cho việc chỉnh sửa
        console.log("Đã set rating và comment từ feedback hiện có");
      }
    } else {
      setRatingStylist(0);
      setComment("");
      setCurrentFeedbackId(null); // Reset feedbackId cho feedback mới
      console.log("Feedback mới, không có feedbackId");
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
        // PUT request để cập nhật feedback hiện có
        response = await api.put(
          `/feedback/${currentFeedbackId}`,
          feedbackData
        );
      } else {
        // POST request để tạo feedback mới
        response = await api.post("/feedback/createFeedback", feedbackData);
      }

      if (response.status === 200) {
        message.success(
          currentFeedbackId
            ? "Đánh giá đã được cập nhật!"
            : "Đánh giá đã được gửi!"
        );

        // Fetch lại feedbacks sau khi thêm/sửa thành công
        const feedbackResponse = await api.get("/feedback/getAllFeedback");
        setFeedbacks(feedbackResponse.data); // Cập nhật state feedbacks

        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      message.error("Gửi đánh giá thất bại.");
    }
  };

  useEffect(() => {
    console.log("Customer ID từ localStorage:", customerId);

    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/getBooking");
        const allBookings = response.data;

        const customerBookings = allBookings
          .filter(
            (booking: any) =>
              booking.customer.id === parseInt(customerId || "0")
          )
          .reverse();

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
      const newUpdatedBookings = bookings.map((booking: any) => {
        const stylistAccount = accounts.find((account: any) =>
          account.stylists.some(
            (stylist: any) => stylist.id === booking.stylist.id
          )
        );

        const serviceNames = services
          .filter((service: any) =>
            service.bookings.some((book: any) => book.id === booking.id)
          )
          .map((service: any) => service.name)
          .join(", ");

        return {
          ...booking,
          stylistName: stylistAccount
            ? stylistAccount.fullName
            : "Stylist không xác định",
          serviceNames: serviceNames || "Không rõ dịch vụ",
        };
      });

      setUpdatedBookings(newUpdatedBookings);
    }
  }, [bookings, accounts, services]);

  return (
    <div>
      <h2>Danh sách đặt lịch của bạn</h2>
      <Table
        columns={columns}
        dataSource={updatedBookings}
        rowKey="id"
        rowClassName={(record: any) => {
          const statusClass = record.status
            ? `booking-status-${record.status
                .replace(/\s+/g, "-")
                .toLowerCase()}`
            : "booking-status-default";
          return statusClass;
        }}
      />
      <Modal
        title="Đánh giá Stylist"
        visible={isModalVisible}
        onOk={handleSubmitFeedback}
        onCancel={closeFeedbackModal}
        okText={currentFeedbackId ? "Sửa" : "Gửi đánh giá"}
        cancelText="Hủy"
      >
        <div>
          <p>Đánh giá stylist:</p>
          <Rate
            allowHalf
            onChange={(value) => setRatingStylist(value)}
            value={ratingStylist}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <p>Bình luận:</p>
          <Input.TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập bình luận của bạn"
          />
        </div>
      </Modal>
    </div>
  );
};

export default CustomerBookingList;

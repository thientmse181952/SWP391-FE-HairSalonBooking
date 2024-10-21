import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../../../config/axios";
import { Modal, Button, message, InputNumber, DatePicker, Input } from "antd";

const localizer = momentLocalizer(moment);

const StylistSchedule: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]); // State to store bookings
  const [customerNames, setCustomerNames] = useState<{ [key: number]: string }>(
    {}
  ); // To store customer names

  // Get stylistId from localStorage
  const stylistId = localStorage.getItem("stylistId");
  const [services, setServices] = useState<any[]>([]);
  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0); // State to hold payment amount

  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");

  const getStatusInVietnamese = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Đã hoàn thành dịch vụ";
      case "paid":
        return "Thanh toán thành công";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không rõ";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return { backgroundColor: "#9fd3c7", color: "#084c61" }; // Màu xanh biển nhạt cho đã xác nhận
      case "completed":
        return { backgroundColor: "#ffe7b8", color: "#a24e1e" }; // Màu cam nhạt cho đã hoàn thành
      case "paid":
        return { backgroundColor: "#d4edda", color: "#155724" }; // Màu xanh lá nhạt cho thanh toán
      case "cancelled":
        return { backgroundColor: "#f8d7da", color: "#721c24" }; // Màu đỏ nhạt cho đã hủy
      default:
        return { backgroundColor: "#f5f5f5", color: "#6c757d" }; // Màu xám nhạt cho trạng thái mặc định
    }
  };

  const showSuccessModal = async (onSuccess: () => void) => {
    Modal.success({
      title: "Thanh toán thành công!",
      content: "Giao dịch đã được hoàn thành. Cảm ơn bạn!",
      onOk() {
        onSuccess(); // Thực hiện callback khi người dùng bấm OK
      },
    });
  };

  const handleRegisterLeave = async () => {
    try {
      if (!startTime || !endTime || !reason) {
        message.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      // Gọi API lấy danh sách schedule đã tồn tại
      const response = await api.get("/schedules");
      const existingSchedules = response.data;

      // Kiểm tra xem có lịch nghỉ nào trùng với stylistId và khoảng thời gian đã chọn không
      const hasConflict = existingSchedules.some((schedule: any) => {
        return (
          schedule.stylist.id === parseInt(stylistId) &&
          (moment(startTime).isBetween(
            schedule.startTime,
            schedule.endTime,
            undefined,
            "[]"
          ) ||
            moment(endTime).isBetween(
              schedule.startTime,
              schedule.endTime,
              undefined,
              "[]"
            ) ||
            moment(schedule.startTime).isBetween(
              startTime,
              endTime,
              undefined,
              "[]"
            ) ||
            moment(schedule.endTime).isBetween(
              startTime,
              endTime,
              undefined,
              "[]"
            ))
        );
      });

      if (hasConflict) {
        message.error("Đã đăng ký ngày này rồi.");
        return;
      }

      // Nếu không có trùng lặp, tiếp tục gọi API để tạo ngày nghỉ mới
      const data = {
        stylist_id: {
          id: stylistId,
        },
        reason,
        status: "pending",
        startTime,
        endTime,
      };

      await api.post("/schedules", data);
      message.success("Đăng ký ngày nghỉ thành công!");
      setIsLeaveModalVisible(false); // Đóng modal sau khi đăng ký thành công
    } catch (error) {
      console.error("Lỗi khi đăng ký ngày nghỉ:", error);
      message.error("Lỗi khi đăng ký ngày nghỉ, vui lòng thử lại.");
    }
  };

  const fetchBookings = async () => {
    try {
      if (!stylistId) {
        console.error("Không tìm thấy stylistId trong localStorage");
        return;
      }

      const response = await api.get("/bookings/getBooking");
      const allBookings = response.data;

      // Lọc các booking có stylistId khớp với tài khoản đăng nhập
      const stylistBookings = allBookings.filter(
        (booking: any) => booking.stylist.id === parseInt(stylistId)
      );

      // Fetch customer names for each booking
      const customerNamesMap: { [key: number]: string } = {};
      for (const booking of stylistBookings) {
        const customerId = booking.customer.id;
        if (!customerNamesMap[customerId]) {
          const customerResponse = await api.get(`/${customerId}`);
          customerNamesMap[customerId] = customerResponse.data.fullName;
        }
      }

      setCustomerNames(customerNamesMap);

      // Định dạng lại dữ liệu để hiển thị lên lịch
      const formattedBookings = stylistBookings.map((booking: any) => {
        // Tách appointmentDate thành các phần year, month, day
        const [year, month, day] = booking.appointmentDate
          .split("-")
          .map(Number);

        // Tách startTime và endTime thành giờ và phút
        const [startHour, startMinute] = booking.startTime
          .split(":")
          .map(Number);
        const [endHour, endMinute] = booking.endTime.split(":").map(Number);

        // Tạo các đối tượng Date
        const start = new Date(year, month - 1, day, startHour, startMinute); // month - 1 vì Date() trong JS bắt đầu từ 0 cho tháng
        const end = new Date(year, month - 1, day, endHour, endMinute);

        return {
          title: `Khách hàng: ${customerNamesMap[booking.customer.id]}`,
          start,
          end,
          bookingId: booking.bookingId,
          status: booking.status,
        };
      });

      setEvents(formattedBookings);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách booking:", error);
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      // Gọi API để thay đổi trạng thái booking
      await api.put(`/bookings/${bookingId}/status`, newStatus, {
        headers: {
          "Content-Type": "text/plain",
        },
      });

      // Sau khi thay đổi trạng thái thành công, fetch lại dữ liệu
      fetchBookings(); // Gọi lại hàm fetchBookings để cập nhật danh sách booking mới nhất

      message.success("Trạng thái đã được cập nhật thành công!");
    } catch (error) {
      message.error("Lỗi khi thay đổi trạng thái.");
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    const fetchServices = async () => {
      try {
        const response = await api.get("/service/getService"); // Gọi API để lấy tất cả dịch vụ
        setServices(response.data); // Lưu tất cả dịch vụ vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
        message.error("Không thể tải danh sách dịch vụ.");
      }
    };

    fetchServices();
  }, [stylistId]);

  useEffect(() => {
    if (selectedEvent) {
      console.log("Nội dung selectedEvent:", selectedEvent); // Kiểm tra nội dung của selectedEvent
      const bookingId = selectedEvent.bookingId;
      if (!bookingId) {
        console.error("Không tìm thấy bookingId trong selectedEvent!");
        return;
      }

      // Lọc dịch vụ dựa trên bookingId
      const relatedServices = services.filter((service) =>
        service.bookings.some((booking) => booking.bookingId === bookingId)
      );

      if (relatedServices.length > 0) {
        const serviceNamesList = relatedServices.map(
          (service: any) => service.name
        );
        setServiceNames(serviceNamesList); // Gán danh sách tên dịch vụ để hiển thị
        console.log("Dịch vụ tương ứng với bookingId:", serviceNamesList);
      } else {
        console.log("Không tìm thấy dịch vụ với bookingId:", bookingId);
      }
    }
  }, [selectedEvent, services]);

  useEffect(() => {
    if (isPaymentModalVisible && selectedEvent && services.length > 0) {
      const totalPrice = services
        .filter((service) =>
          service.bookings.some(
            (booking) => booking.bookingId === selectedEvent.bookingId
          )
        )
        .reduce((total, service) => total + Number(service.price), 0);

      // Gán giá trị mặc định cho paymentAmount nếu nó bằng 0
      if (paymentAmount === 0) {
        setPaymentAmount(totalPrice);
      }
    }
  }, [isPaymentModalVisible, selectedEvent, services]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSelectEvent = async (event: any) => {
    try {
      const bookingId = event.bookingId;
      // Gọi API để lấy chi tiết booking với đầy đủ thông tin bao gồm cả payments
      const response = await api.get(`/bookings/${bookingId}`);
      const bookingDetails = response.data; // Lấy thông tin chi tiết từ API

      // Cập nhật selectedEvent với đầy đủ thông tin bao gồm payments
      setSelectedEvent({
        ...event,
        payments: bookingDetails.payments, // Thêm thông tin payments từ API
      });

      showModal();
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết booking:", error);
    }
  };

  return (
    <div>
      <h2>Stylist Schedule</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
        selectable
        onSelectEvent={handleSelectEvent}
        eventPropGetter={(event) => {
          const backgroundColor = getStatusStyle(event.status).backgroundColor;
          const color = getStatusStyle(event.status).color;

          return {
            style: {
              backgroundColor,
              color,
              borderRadius: "8px",
              padding: "5px",
            },
          };
        }}
      />

      {/* Nút để mở modal đăng ký ngày nghỉ */}
      <Button
        type="primary"
        onClick={() => setIsLeaveModalVisible(true)} // Mở modal
      >
        Đăng ký ngày nghỉ
      </Button>

      {/* Modal đăng ký ngày nghỉ */}
      <Modal
        title="Đăng ký ngày nghỉ"
        visible={isLeaveModalVisible}
        onCancel={() => setIsLeaveModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsLeaveModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={async () => {
              await handleRegisterLeave(); // Gọi hàm đăng ký nghỉ
              setIsLeaveModalVisible(false); // Đóng modal sau khi đăng ký thành công
            }}
          >
            Đăng ký
          </Button>,
        ]}
      >
        <p>Chọn thời gian bắt đầu:</p>
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          onChange={(date, dateString) => setStartTime(dateString)}
        />

        <p>Chọn thời gian kết thúc:</p>
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          onChange={(date, dateString) => setEndTime(dateString)}
        />

        <p>Nhập lý do:</p>
        <Input
          placeholder="Nhập lý do nghỉ"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>

      <Modal
        title="Chi tiết dịch vụ"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedEvent && (
          <div>
            <p>
              <strong>Khách hàng:</strong>{" "}
              {selectedEvent.title.replace("Khách hàng: ", "")}
            </p>
            <p>
              <strong>Thời gian:</strong>{" "}
              {moment(selectedEvent.start).format("HH:mm")} -{" "}
              {moment(selectedEvent.end).format("HH:mm")}
            </p>
            <p>
              <strong>Dịch vụ:</strong>{" "}
              {serviceNames.length > 0
                ? serviceNames.join(", ")
                : "Không tìm thấy dịch vụ"}
            </p>
            <p>
              <strong>Tổng giá dịch vụ:</strong>{" "}
              {services.length > 0
                ? services
                    .filter((service) =>
                      service.bookings.some(
                        (booking) =>
                          booking.bookingId === selectedEvent.bookingId
                      )
                    )
                    .reduce(
                      (total, service) => total + Number(service.price),
                      0
                    )
                    .toLocaleString("vi-VN") + " VND"
                : "Không có thông tin giá dịch vụ"}
            </p>

            <p>
              <strong>Trạng thái:</strong>{" "}
              {getStatusInVietnamese(selectedEvent.status)}
            </p>

            {/* Thêm đoạn hiển thị thông tin thanh toán */}
            {selectedEvent.payments && selectedEvent.payments.length > 0 ? (
              <div>
                <p>
                  <strong>Số tiền thanh toán:</strong>{" "}
                  {new Intl.NumberFormat("vi-VN").format(
                    selectedEvent.payments[0].amount
                  )}{" "}
                  VND
                </p>

                <p>
                  <strong>Ngày thanh toán:</strong>{" "}
                  {moment(selectedEvent.payments[0].payment_date).format(
                    "DD/MM/YYYY"
                  )}
                </p>
                <p>
                  <strong>Phương thức thanh toán:</strong>{" "}
                  {selectedEvent.payments[0].payment_type}
                </p>
              </div>
            ) : (
              <p>Chưa có thông tin thanh toán.</p>
            )}

            {selectedEvent.status === "confirmed" && (
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    // Gọi API thay đổi trạng thái booking
                    await handleStatusChange(
                      selectedEvent.bookingId,
                      "completed"
                    );

                    // Cập nhật ngay lập tức trạng thái của selectedEvent trong UI
                    setSelectedEvent((prevEvent: any) => ({
                      ...prevEvent,
                      status: "completed",
                    }));
                  } catch (error) {
                    console.error("Lỗi khi hoàn thành dịch vụ:", error);
                    message.error("Lỗi khi hoàn thành dịch vụ.");
                  }
                }}
              >
                Hoàn thành dịch vụ
              </Button>
            )}

            {selectedEvent.status === "completed" && (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    setIsPaymentModalVisible(true); // Hiển thị modal thanh toán
                  }}
                >
                  Thanh toán
                </Button>

                <Modal
                  title="Chọn phương thức thanh toán"
                  visible={isPaymentModalVisible}
                  onCancel={() => setIsPaymentModalVisible(false)}
                  footer={null} // Không hiển thị footer mặc định
                >
                  <p>Nhập số tiền:</p>
                  <InputNumber
                    min={
                      services.length > 0
                        ? services
                            .filter((service) =>
                              service.bookings.some(
                                (booking) =>
                                  booking.bookingId === selectedEvent.bookingId
                              )
                            )
                            .reduce(
                              (total, service) => total + Number(service.price),
                              0
                            )
                        : 0
                    }
                    value={paymentAmount}
                    onChange={(value) => setPaymentAmount(value || 0)}
                    onBlur={() => {
                      // Nếu giá trị không được nhập, gán giá trị min vào paymentAmount
                      if (!paymentAmount) {
                        const totalPrice =
                          services.length > 0
                            ? services
                                .filter((service) =>
                                  service.bookings.some(
                                    (booking) =>
                                      booking.bookingId ===
                                      selectedEvent.bookingId
                                  )
                                )
                                .reduce(
                                  (total, service) =>
                                    total + Number(service.price),
                                  0
                                )
                            : 0;
                        setPaymentAmount(totalPrice);
                      }
                    }}
                  />

                  <Button
                    type="primary"
                    style={{ marginRight: "10px" }}
                    onClick={async () => {
                      // Tính tổng giá dịch vụ
                      const totalPrice =
                        services.length > 0
                          ? services
                              .filter((service) =>
                                service.bookings.some(
                                  (booking) =>
                                    booking.bookingId ===
                                    selectedEvent.bookingId
                                )
                              )
                              .reduce(
                                (total, service) =>
                                  total + Number(service.price),
                                0
                              )
                          : 0;

                      // Kiểm tra nếu số tiền nhập vào lớn hơn 3 lần tổng giá dịch vụ
                      if (paymentAmount > totalPrice * 3) {
                        message.error(
                          "Số tiền không được lớn hơn 3 lần giá dịch vụ gốc."
                        );
                        return; // Dừng lại nếu giá quá lớn
                      }

                      try {
                        const paymentDate = selectedEvent.start
                          .toISOString()
                          .split("T")[0];
                        const paymentType = "cash";
                        const bookingId = selectedEvent.bookingId;

                        console.log(
                          "Thanh toán bằng tiền mặt cho Booking ID:",
                          bookingId
                        );
                        console.log("Số tiền:", paymentAmount);

                        // Gọi API tạo payment trước khi thay đổi trạng thái của booking
                        await api.post("/payment/createPayment", {
                          amount: paymentAmount,
                          payment_date: paymentDate,
                          payment_type: paymentType,
                          bookingId: [bookingId],
                        });

                        handleStatusChange(selectedEvent.bookingId, "paid");

                        setIsPaymentModalVisible(false); // Đóng modal sau khi thanh toán
                      } catch (error) {
                        message.error("Lỗi khi thực hiện thanh toán.");
                        console.error("Lỗi:", error);
                      }
                    }}
                  >
                    Thanh toán bằng tiền mặt
                  </Button>

                  <Button
                    type="primary"
                    onClick={async () => {
                      try {
                        const paymentDate = new Date()
                          .toISOString()
                          .split("T")[0]; // Lấy ngày hiện tại
                        const paymentType = "transfer"; // Xác định loại thanh toán là chuyển khoản
                        const bookingId = selectedEvent.bookingId;

                        // Lưu thông tin vào localStorage
                        localStorage.setItem("paymentDate", paymentDate);
                        localStorage.setItem("paymentType", paymentType);
                        localStorage.setItem("bookingId", bookingId);

                        // Console log các giá trị đã lưu
                        console.log("Payment Date:", paymentDate);
                        console.log("Payment Type:", paymentType);
                        console.log("Booking ID:", bookingId);

                        // Lấy giá trị từ ô InputNumber
                        const amountToSend = paymentAmount; // Giả sử paymentAmount là state chứa giá trị từ ô InputNumber

                        console.log(
                          "Thanh toán chuyển khoản cho Booking ID:",
                          bookingId
                        );
                        console.log("Số tiền:", amountToSend);

                        // Gọi API tạo payment trước khi thay đổi trạng thái của booking
                        const response = await api.post(
                          "/payment/payment-vnpay",
                          null,
                          {
                            params: {
                              amount: amountToSend, // Gửi giá tiền vào parameter amount
                              orderInfo: bookingId, // Gửi bookingId vào parameter orderInfo
                            },
                          }
                        );

                        console.log("API Response:", response.data); // Log giá trị trả về từ API
                        window.open(response.data);
                      } catch (error) {
                        message.error("Lỗi khi thực hiện thanh toán.");
                        console.error("Lỗi:", error);
                      }
                    }}
                  >
                    Chuyển khoản
                  </Button>
                </Modal>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StylistSchedule;

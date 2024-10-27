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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Đã xác nhận":
        return { backgroundColor: "#9fd3c7", color: "#084c61" };
      case "Đã hoàn thành":
        return { backgroundColor: "#ffe7b8", color: "#a24e1e" };
      case "Đã thanh toán":
        return { backgroundColor: "#d4edda", color: "#155724" };
      case "Đã hủy":
        return { backgroundColor: "#f8d7da", color: "#721c24" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#6c757d" };
    }
  };

  // Đảm bảo fetchCustomerNames được gọi trước khi fetchEvents
  useEffect(() => {
    fetchCustomerNames().then(() => {
      fetchEvents();
    });
  }, []);

  const fetchCustomerNames = async () => {
    try {
      const response = await api.get("/account");
      const accounts: any[] = response.data;
      const namesMap: { [key: number]: string } = {};

      console.log("Dữ liệu từ API /account:", accounts); // Kiểm tra dữ liệu trả về từ API

      accounts.forEach((account: any) => {
        if (
          account.role === "CUSTOMER" &&
          account.customers &&
          account.customers.length > 0
        ) {
          account.customers.forEach((customer: any) => {
            console.log(
              `Mapping customer id ${customer.id} to name ${account.fullName}`
            );
            namesMap[customer.id] = account.fullName;
          });
        }
      });

      setCustomerNames(namesMap); // Cập nhật state
      console.log("Danh sách tên khách hàng sau khi ánh xạ:", namesMap); // Kiểm tra kết quả ánh xạ

      return namesMap; // Trả về danh sách tên khách hàng đã ánh xạ
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
      message.error("Không thể tải danh sách khách hàng.");
      return {}; // Trả về một object rỗng nếu xảy ra lỗi
    }
  };

  const handleRegisterLeave = async () => {
    try {
      if (!startTime || !endTime || !reason) {
        message.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      // Kiểm tra nếu endTime nằm trước startTime
      if (moment(endTime).isBefore(moment(startTime))) {
        message.error("Thời gian kết thúc phải sau thời gian bắt đầu!");
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

      // Gọi API lấy danh sách bookings
      const bookingsResponse = await api.get("/bookings/getBooking");
      const stylistBookings = bookingsResponse.data.filter(
        (booking: any) => booking.stylist.id === parseInt(stylistId)
      );

      // Kiểm tra xem có booking nào trùng với khoảng thời gian đăng ký nghỉ không
      const hasBookingConflict = stylistBookings.some((booking: any) => {
        const bookingStart = moment(
          `${booking.appointmentDate} ${booking.startTime}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        const bookingEnd = moment(
          `${booking.appointmentDate} ${booking.endTime}`,
          "YYYY-MM-DD HH:mm:ss"
        );

        return (
          moment(startTime).isBetween(
            bookingStart,
            bookingEnd,
            undefined,
            "[]"
          ) ||
          moment(endTime).isBetween(
            bookingStart,
            bookingEnd,
            undefined,
            "[]"
          ) ||
          bookingStart.isBetween(startTime, endTime, undefined, "[]") ||
          bookingEnd.isBetween(startTime, endTime, undefined, "[]")
        );
      });

      if (hasBookingConflict) {
        message.error(
          "Không thể đăng ký ngày nghỉ do đã có lịch booking trong thời gian này."
        );
        return;
      }

      // Nếu không có trùng lặp, tiếp tục gọi API để tạo ngày nghỉ mới
      const data = {
        stylist_id: {
          id: stylistId,
        },
        reason,
        status: "Đang chờ xác nhận",
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

  // Hàm để xử lý khi click vào sự kiện "Nghỉ"
  const handleSelectLeaveEvent = (event: any) => {
    if (event.title.includes("Nghỉ")) {
      Modal.info({
        title: "Thông tin lịch nghỉ",
        content: (
          <div>
            <p>
              <strong>Lý do nghỉ:</strong> {event.title.replace("Nghỉ: ", "")}
            </p>
            <p>
              <strong>Thời gian bắt đầu nghỉ:</strong>{" "}
              {moment(event.start).format("YYYY-MM-DD HH:mm")}
            </p>
            <p>
              <strong>Thời gian kết thúc nghỉ:</strong>{" "}
              {moment(event.end).format("YYYY-MM-DD HH:mm")}
            </p>
            <p>
              <strong>Trạng thái:</strong> {event.status}
            </p>
          </div>
        ),
        onOk() {},
      });
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      // Gọi API để thay đổi trạng thái booking, chỉ truyền chuỗi newStatus
      await api.put(`/bookings/${id}/status`, newStatus, {
        headers: {
          "Content-Type": "text/plain",
        },
      });

      // Sau khi thay đổi trạng thái thành công, fetch lại dữ liệu
      fetchEvents(); // Gọi lại hàm fetchEvents để cập nhật danh sách booking mới nhất

      message.success("Trạng thái đã được cập nhật thành công!");
    } catch (error) {
      message.error("Lỗi khi thay đổi trạng thái.");
      console.error("Lỗi:", error);
    }
  };

  const fetchEvents = async (namesMap: { [key: number]: string }) => {
    try {
      console.log(
        "Danh sách tên khách hàng khi fetchEvents bắt đầu:",
        namesMap
      ); // Kiểm tra `namesMap` trước khi sử dụng

      // Fetch bookings
      const bookingsResponse = await api.get("/bookings/getBooking");
      const allBookings: any[] = bookingsResponse.data;
      console.log("Dữ liệu từ API /bookings/getBooking:", allBookings); // Kiểm tra dữ liệu từ API bookings

      const stylistBookings = allBookings.filter(
        (booking: any) =>
          booking.stylist && booking.stylist.id === parseInt(stylistId || "0")
      );
      console.log("Danh sách bookings của stylist:", stylistBookings); // Kiểm tra danh sách bookings của stylist

      const formattedBookings = stylistBookings
        .map((booking: any) => {
          // Kiểm tra `undefined` cho `customer` và các trường `appointmentDate`, `startTime`, `endTime`
          if (!booking.customer || !booking.customer.id) {
            console.warn(
              "Booking không có customer hoặc customer ID:",
              booking
            );
            return null; // Bỏ qua các booking không có customer ID
          }

          if (
            !booking.appointmentDate ||
            !booking.startTime ||
            !booking.endTime
          ) {
            console.warn("Booking thiếu dữ liệu ngày giờ:", booking);
            return null; // Bỏ qua nếu thiếu bất kỳ thông tin ngày giờ nào
          }

          console.log("Giá trị của appointmentDate:", booking.appointmentDate); // Kiểm tra giá trị trước khi .split
          console.log("Giá trị của startTime:", booking.startTime); // Kiểm tra giá trị trước khi .split
          console.log("Giá trị của endTime:", booking.endTime); // Kiểm tra giá trị trước khi .split

          const [year, month, day] = booking.appointmentDate
            .split("-")
            .map(Number);
          const [startHour, startMinute] = booking.startTime
            .split(":")
            .map(Number);
          const [endHour, endMinute] = booking.endTime.split(":").map(Number);

          const start = new Date(year, month - 1, day, startHour, startMinute);
          const end = new Date(year, month - 1, day, endHour, endMinute);

          console.log(
            `Customer ID: ${booking.customer.id}, Tên khách hàng: ${
              namesMap[booking.customer.id]
            }`
          ); // Kiểm tra xem customer ID có ánh xạ đúng không

          return {
            title: `Khách hàng: ${
              namesMap[booking.customer.id] || "Không tìm thấy tên khách hàng"
            }`,
            start,
            end,
            id: booking.id,
            status: booking.status,
          };
        })
        .filter(Boolean); // Loại bỏ các giá trị null khỏi mảng

      // Fetch leaves
      const schedulesResponse = await api.get("/schedules");
      const allSchedules: any[] = schedulesResponse.data;
      console.log("Dữ liệu từ API /schedules:", allSchedules); // Kiểm tra dữ liệu từ API schedules

      const approvedLeaves = allSchedules.filter(
        (schedule: any) =>
          schedule.stylist &&
          schedule.stylist.id === parseInt(stylistId || "0") &&
          schedule.status === "Chấp nhận"
      );

      let formattedLeaves: any[] = [];
      approvedLeaves.forEach((leave: any) => {
        formattedLeaves = [
          ...formattedLeaves,
          ...splitLeaveIntoMultipleDays(leave),
        ];
      });

      // Kết hợp cả bookings và leaves
      const combinedEvents = [...formattedBookings, ...formattedLeaves];
      console.log("Combined Events (Bookings + Leaves):", combinedEvents);

      // Cập nhật `events`
      setEvents(combinedEvents);
    } catch (error) {
      console.error("Lỗi khi lấy lịch:", error);
    }
  };

  // Sử dụng useEffect để gọi fetchCustomerNames và fetchEvents tuần tự
  useEffect(() => {
    fetchCustomerNames().then((namesMap) => {
      fetchEvents(namesMap); // Truyền namesMap trực tiếp vào fetchEvents
    });
  }, []);

  const splitLeaveIntoMultipleDays = (leave: any) => {
    const events = [];
    const start = moment(leave.startTime);
    const end = moment(leave.endTime);

    // Lặp qua từng ngày từ start đến end
    while (start.isBefore(end, "day")) {
      events.push({
        title: `Nghỉ: ${leave.reason}`,
        start: new Date(start.format("YYYY-MM-DD 00:00:00")),
        end: new Date(start.format("YYYY-MM-DD 23:59:59")),
        status: leave.status,
      });
      start.add(1, "day");
    }

    events.push({
      title: `Nghỉ: ${leave.reason}`,
      start: new Date(start.format("YYYY-MM-DD 00:00:00")),
      end: new Date(end),
      status: leave.status,
    });

    return events;
  };

  // useEffect thứ nhất để fetch bookings và services
  useEffect(() => {
    fetchCustomerNames();
    fetchEvents();

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
  }, []); // Chạy một lần khi component mount

  useEffect(() => {
    if (selectedEvent) {
      console.log("Nội dung selectedEvent:", selectedEvent); // Kiểm tra nội dung của selectedEvent
      const bookingId = selectedEvent.id;
      if (!bookingId) {
        console.error("Không tìm thấy bookingId trong selectedEvent!");
        return;
      }

      // Lọc dịch vụ dựa trên bookingId
      const relatedServices = services.filter((service) =>
        service.bookings.some((booking) => booking.id === bookingId)
      );

      if (relatedServices.length > 0) {
        const serviceNamesList = relatedServices.map((service) => service.name);
        setServiceNames(serviceNamesList); // Gán danh sách tên dịch vụ để hiển thị

        // Tính tổng giá
        const totalServicePrice = relatedServices.reduce(
          (total, service) => total + Number(service.price || 0),
          0
        );
        setPaymentAmount(totalServicePrice); // Cập nhật tổng giá
        console.log("Dịch vụ tương ứng với bookingId:", serviceNamesList);
        console.log("Tổng giá dịch vụ:", totalServicePrice);
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

  useEffect(() => {
    console.log("Events before rendering Calendar:", events); // Log dữ liệu sự kiện trước khi truyền vào Calendar
  }, [events]);

  // Hàm xử lý khi click vào sự kiện trong lịch
  const handleSelectEvent = async (event: any) => {
    if (event.title.includes("Nghỉ")) {
      handleSelectLeaveEvent(event); // Gọi hàm xử lý lịch nghỉ
    } else {
      try {
        const bookingId = event.id; // Lấy 'id' chính xác của booking
        console.log("Booking ID:", bookingId);

        // Gọi API để lấy chi tiết booking
        const response = await api.get(`/bookings/${bookingId}`);
        const bookingDetails = response.data;

        // Cập nhật selectedEvent với thông tin booking và bookingId
        setSelectedEvent({
          ...event,
          payments: bookingDetails.payments, // Thêm thông tin payments
          bookingId: bookingId, // Đặt bookingId trực tiếp vào selectedEvent
        });

        showModal(); // Gọi modal hiển thị thông tin booking
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết booking:", error);
      }
    }
  };

  return (
    <div>
      <h2>Lịch Của Stylist</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
        selectable
        onSelectEvent={handleSelectEvent}
        eventPropGetter={(event) => {
          // Kiểm tra nếu là ngày nghỉ thì hiển thị với màu đen và các thuộc tính riêng
          if (event.title.includes("Nghỉ")) {
            return {
              style: {
                backgroundColor: "#ccc", // Màu nền đen cho ngày nghỉ
                color: "black", // Chữ màu trắng
                borderRadius: "8px",
                padding: "5px",
              },
            };
          } else {
            // Định dạng bình thường cho các sự kiện khác (ví dụ: booking)
            const backgroundColor = getStatusStyle(
              event.status
            ).backgroundColor;
            const color = getStatusStyle(event.status).color;

            return {
              style: {
                backgroundColor,
                color,
                borderRadius: "8px",
                padding: "5px",
              },
            };
          }
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
            {selectedEvent.title.includes("Nghỉ") ? (
              <>
                <p>
                  <strong>Thông tin:</strong> Ngày nghỉ
                </p>
                <p>
                  <strong>Thời gian nghỉ:</strong>{" "}
                  {moment(selectedEvent.start).format("HH:mm")} -{" "}
                  {moment(selectedEvent.end).format("HH:mm")}
                </p>
              </>
            ) : (
              <>
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
                  {selectedEvent && serviceNames.length > 0
                    ? paymentAmount.toLocaleString("vi-VN") + " VND"
                    : "Không có thông tin giá dịch vụ"}
                </p>

                <p>
                  <strong>Trạng thái:</strong> {selectedEvent.status}
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
              </>
            )}

            {selectedEvent.status === "Đã xác nhận" && (
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    // Gọi API thay đổi trạng thái booking
                    handleStatusChange(selectedEvent.id, "Đã hoàn thành");

                    // Cập nhật ngay lập tức trạng thái của selectedEvent trong UI
                    setSelectedEvent((prevEvent: any) => ({
                      ...prevEvent,
                      status: "Đã hoàn thành",
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

            {selectedEvent.status === "Đã hoàn thành" && (
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
                      // Tính tổng giá dịch vụ dựa trên selectedEvent
                      const totalPrice = services
                        .filter((service) =>
                          service.bookings.some(
                            (booking) => booking.id === selectedEvent.id // Chỉ dùng booking.id, không phải booking.bookingId
                          )
                        )
                        .reduce(
                          (total, service) => total + Number(service.price),
                          0
                        );

                      // Kiểm tra nếu số tiền nhập vào lớn hơn 3 lần tổng giá dịch vụ
                      if (paymentAmount > totalPrice * 3) {
                        message.error(
                          "Số tiền không được lớn hơn 3 lần giá dịch vụ gốc."
                        );
                        return; // Dừng lại nếu giá quá lớn
                      }

                      // Code tiếp theo cho thanh toán
                      try {
                        const paymentDate = selectedEvent.start
                          .toISOString()
                          .split("T")[0];
                        const paymentType = "Tiền mặt";
                        const bookingId = selectedEvent.id; // Sử dụng `selectedEvent.id`

                        console.log(
                          "Thanh toán bằng tiền mặt cho Booking ID:",
                          bookingId
                        );
                        console.log("Số tiền:", paymentAmount);

                        // Gọi API tạo payment
                        await api.post("/payment/createPayment", {
                          amount: paymentAmount,
                          payment_date: paymentDate,
                          payment_type: paymentType,
                          bookingId: [bookingId],
                        });

                        // Xử lý sau khi thanh toán thành công
                        handleStatusChange(selectedEvent.id, "Đã thanh toán");
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
                        const paymentType = "Chuyển khoản"; // Xác định loại thanh toán là chuyển khoản
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
                              payment_type: paymentType, // Gửi "Chuyển khoản" vào API
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

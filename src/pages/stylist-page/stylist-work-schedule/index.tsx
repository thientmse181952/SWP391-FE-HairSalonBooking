import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../../../config/axios";
import { Modal, Button, message } from "antd";

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

  useEffect(() => {
    // Fetch bookings for the stylist
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

    fetchBookings();
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    showModal();
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
              <strong>Trạng thái:</strong>{" "}
              {getStatusInVietnamese(selectedEvent.status)}
            </p>

            {selectedEvent.status === "confirmed" && (
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    console.log("Booking ID:", selectedEvent.bookingId);
                    console.log("Status being sent:", "completed");

                    await api.put(
                      `/bookings/${selectedEvent.bookingId}/status`,
                      "completed",
                      {
                        headers: {
                          "Content-Type": "text/plain",
                        },
                      }
                    );

                    message.success("Dịch vụ đã được hoàn thành!");

                    setSelectedEvent((prevEvent: any) => ({
                      ...prevEvent,
                      status: "completed",
                    }));
                  } catch (error) {
                    message.error("Lỗi khi hoàn thành dịch vụ.");
                    console.error("Lỗi:", error);
                  }
                }}
              >
                Hoàn thành dịch vụ
              </Button>
            )}

            {selectedEvent.status === "completed" && (
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    console.log("Booking ID:", selectedEvent.bookingId);
                    console.log("Status being sent:", "paid");

                    await api.put(
                      `/bookings/${selectedEvent.bookingId}/status`,
                      "paid",
                      {
                        headers: {
                          "Content-Type": "text/plain",
                        },
                      }
                    );

                    message.success("Thanh toán thành công!");

                    setSelectedEvent((prevEvent: any) => ({
                      ...prevEvent,
                      status: "paid",
                    }));
                  } catch (error) {
                    message.error("Lỗi khi thực hiện thanh toán.");
                    console.error("Lỗi:", error);
                  }
                }}
              >
                Thanh toán
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StylistSchedule;

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../../../config/axios";

const localizer = momentLocalizer(moment);

const StylistSchedule: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]); // State to store bookings
  const [customerNames, setCustomerNames] = useState<{ [key: number]: string }>(
    {}
  ); // To store customer names

  // Get stylistId from localStorage
  const stylistId = localStorage.getItem("stylistId");

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
          };
        });

        setEvents(formattedBookings);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách booking:", error);
      }
    };

    fetchBookings();
  }, [stylistId]);

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
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
      />

      {selectedEvent && (
        <div>
          <h3>Chi tiết đặt lịch</h3>
          <p>
            <strong>Khách hàng:</strong> {selectedEvent.title}
          </p>
          <p>
            <strong>Thời gian:</strong>{" "}
            {moment(selectedEvent.start).format("HH:mm")}
          </p>
        </div>
      )}
    </div>
  );
};

export default StylistSchedule;

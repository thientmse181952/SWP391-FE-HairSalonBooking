import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import {
  Select,
  Modal,
  Button,
  message,
  InputNumber,
  DatePicker,
  Input,
} from "antd";
import moment from "moment";
import api from "../../../config/axios";
import "react-big-calendar/lib/css/react-big-calendar.css";

const { Option } = Select;
const localizer = momentLocalizer(moment);

const CalendarManagement: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [stylists, setStylists] = useState<any[]>([]);
  const [selectedStylistId, setSelectedStylistId] = useState<number | null>(
    null
  );
  const [customerNames, setCustomerNames] = useState<{ [key: number]: string }>(
    {}
  );
  const [services, setServices] = useState<any[]>([]);
  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        return { backgroundColor: "#ccc", color: "#000" };
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await api.get("/account");
        const stylistAccounts = response.data.filter(
          (account: any) => account.role === "STYLIST"
        );

        const stylistsData = stylistAccounts.map((account: any) => ({
          id: account.stylists[0].id,
          fullName: account.fullName,
        }));

        setStylists(stylistsData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách stylist:", error);
        message.error("Không thể tải danh sách stylist.");
      }
    };

    fetchStylists();
  }, []);

  const fetchCustomerNames = async () => {
    try {
      const response = await api.get("/account");
      const accounts = response.data;
      const customerNamesMap: { [key: number]: string } = {};

      accounts.forEach((account: any) => {
        if (account.role === "CUSTOMER") {
          account.customers.forEach((customer: any) => {
            customerNamesMap[customer.id] = account.fullName;
          });
        }
      });

      setCustomerNames(customerNamesMap);
      return customerNamesMap;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);
      message.error("Không thể tải danh sách tài khoản.");
      return {};
    }
  };

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

  const fetchBookingsAndLeaves = async (stylistId: number) => {
    try {
      const [bookingsResponse, schedulesResponse] = await Promise.all([
        api.get("/bookings/getBooking"),
        api.get("/schedules"),
      ]);

      const stylistBookings = bookingsResponse.data.filter(
        (booking: any) => booking.stylist.id === stylistId
      );

      await fetchCustomerNames(stylistBookings); // Fetch và set tên khách hàng trước khi format

      const stylistSchedules = schedulesResponse.data.filter(
        (schedule: any) =>
          schedule.stylist.id === stylistId && schedule.status === "Chấp nhận"
      );

      // Định dạng dữ liệu bookings của stylist
      const formattedBookings = stylistBookings.map((booking: any) => ({
        title: `Khách hàng: ${
          customerNames[booking.customer.id] || "Chưa xác định"
        }`,
        start: new Date(`${booking.appointmentDate} ${booking.startTime}`),
        end: new Date(`${booking.appointmentDate} ${booking.endTime}`),
        bookingId: booking.id,
        status: booking.status,
      }));

      // Định dạng dữ liệu lịch nghỉ của stylist và tách ra nếu là multi-day event
      const formattedLeaves = stylistSchedules.flatMap((schedule: any) =>
        splitLeaveIntoMultipleDays(schedule)
      );

      // Kết hợp cả bookings và schedules vào `events`
      setEvents([...formattedBookings, ...formattedLeaves]);
    } catch (error) {
      console.error("Lỗi khi lấy lịch:", error);
      message.error("Không thể tải lịch.");
    }
  };

  useEffect(() => {
    if (selectedStylistId) {
      fetchBookingsAndLeaves(selectedStylistId);
    }
  }, [selectedStylistId]);

  const handleSelectEvent = async (event: any) => {
    try {
      const bookingId = event.id;

      if (bookingId) {
        const response = await api.get(`/bookings/${bookingId}`);
        const bookingDetails = response.data;

        const servicesResponse = await api.get("/service/getService");
        const allServices = servicesResponse.data;

        const relatedServices = allServices.filter((service: any) =>
          service.bookings.some((booking: any) => booking.id === bookingId)
        );

        const serviceNamesList = relatedServices.map(
          (service: any) => service.name
        );

        const totalPrice = relatedServices.reduce(
          (total, service) => total + Number(service.price),
          0
        );

        setServiceNames(serviceNamesList);
        setSelectedEvent({
          ...event,
          payments: bookingDetails.payments,
          serviceNames: serviceNamesList,
          totalPrice: totalPrice.toLocaleString("vi-VN") + " VND",
          status: bookingDetails.status,
        });
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết booking:", error);
    }
  };

  return (
    <div>
      <h2>Quản Lý Lịch Stylist</h2>
      <Select
        placeholder="Chọn Stylist"
        style={{ width: 200, marginBottom: 20 }}
        onChange={(value) => setSelectedStylistId(value)}
        allowClear
      >
        {stylists.map((stylist) => (
          <Option key={stylist.id} value={stylist.id}>
            {stylist.fullName}
          </Option>
        ))}
      </Select>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={(event) => {
          const style = getStatusStyle(event.status);
          return { style };
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
                  {selectedEvent.totalPrice
                    ? selectedEvent.totalPrice
                    : "Không có thông tin giá dịch vụ"}
                </p>
                <p>
                  <strong>Trạng thái:</strong> {selectedEvent.status}
                </p>

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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarManagement;

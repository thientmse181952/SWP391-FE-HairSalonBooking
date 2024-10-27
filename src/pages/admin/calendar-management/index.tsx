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
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Fetch stylist list with full names from accounts API on mount
  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await api.get("/account");
        const stylistAccounts = response.data.filter(
          (account: any) => account.role === "STYLIST"
        );

        // Map stylist data with full names
        const stylistsData = stylistAccounts.map((account: any) => ({
          id: account.stylists[0].id,
          fullName: account.fullName,
        }));

        console.log("Fetched stylists:", stylistsData);
        setStylists(stylistsData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách stylist:", error);
        message.error("Không thể tải danh sách stylist.");
      }
    };

    fetchStylists();
  }, []);

  // Fetch customer names for each booking
  const fetchCustomerNames = async (bookings: any[]) => {
    try {
      const response = await api.get("/account");
      const accounts = response.data;
      const customerNamesMap: { [key: number]: string } = {};

      // Duyệt qua các tài khoản để lấy fullName cho customerID
      accounts.forEach((account: any) => {
        if (account.role === "CUSTOMER") {
          account.customers.forEach((customer: any) => {
            customerNamesMap[customer.id] = account.fullName;
          });
        }
      });

      // Cập nhật `customerNames` trước khi sử dụng trong `formattedBookings`
      setCustomerNames(customerNamesMap);

      // Sau khi cập nhật `customerNames`, format `formattedBookings`
      const formattedBookings = bookings.map((booking: any) => ({
        title: `Khách hàng: ${
          customerNamesMap[booking.customer.id] || "Chưa xác định"
        }`,
        start: new Date(`${booking.appointmentDate} ${booking.startTime}`),
        end: new Date(`${booking.appointmentDate} ${booking.endTime}`),
        bookingId: booking.bookingId,
        status: booking.status,
      }));

      setEvents((prevEvents) => [...prevEvents, ...formattedBookings]);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);
      message.error("Không thể tải danh sách tài khoản.");
    }
  };

  // Hàm để lấy danh sách dịch vụ cho một booking cụ thể
  const fetchServicesForBooking = async (bookingId: number) => {
    try {
      // Gọi API để lấy toàn bộ danh sách dịch vụ
      const response = await api.get("/service/getService");
      const services = response.data;

      // Lọc ra các dịch vụ có `bookingId` trùng với bookingId đã chọn
      const servicesForBooking = services.filter((service: any) =>
        service.bookings.some((booking: any) => booking.bookingId === bookingId)
      );

      // Lấy tên của các dịch vụ cho booking này
      const serviceNamesList = servicesForBooking.map(
        (service: any) => service.name
      );

      // Cập nhật `serviceNames` để hiển thị trong modal chi tiết
      setServiceNames(serviceNamesList);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      message.error("Không thể tải danh sách dịch vụ.");
    }
  };

  // Fetch bookings and leaves for the selected stylist
  useEffect(() => {
    if (selectedStylistId) {
      fetchBookingsAndLeaves(selectedStylistId);
    }
  }, [selectedStylistId]);

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
          schedule.stylist.id === stylistId && schedule.status === "approved"
      );

      // Định dạng dữ liệu bookings của stylist
      const formattedBookings = stylistBookings.map((booking: any) => ({
        title: `Khách hàng: ${
          customerNames[booking.customer.id] || "Chưa xác định"
        }`,
        start: new Date(`${booking.appointmentDate} ${booking.startTime}`),
        end: new Date(`${booking.appointmentDate} ${booking.endTime}`),
        bookingId: booking.bookingId,
        status: booking.status,
      }));

      // Định dạng dữ liệu lịch nghỉ của stylist
      const formattedLeaves = stylistSchedules.map((schedule: any) => ({
        title: `Nghỉ: ${schedule.reason}`,
        start: new Date(schedule.startTime),
        end: new Date(schedule.endTime),
        status: schedule.status,
      }));

      // Cập nhật `events` chỉ với các sự kiện của stylist hiện tại
      setEvents([...formattedBookings, ...formattedLeaves]);
    } catch (error) {
      console.error("Lỗi khi lấy lịch:", error);
      message.error("Không thể tải lịch.");
    }
  };

  const handleSelectEvent = async (event: any) => {
    try {
      const bookingId = event.bookingId;

      if (bookingId) {
        // Fetch detailed service information for the booking
        const response = await api.get(`/bookings/${bookingId}`);
        const bookingDetails = response.data;

        console.log("Booking details:", bookingDetails);

        // Gọi API để lấy toàn bộ danh sách dịch vụ
        const servicesResponse = await api.get("/service/getService");
        const allServices = servicesResponse.data;

        // Lọc ra các dịch vụ liên quan đến booking hiện tại
        const relatedServices = allServices.filter((service: any) =>
          service.bookings.some(
            (booking: any) => booking.bookingId === bookingId
          )
        );

        console.log("Related services:", relatedServices);

        // Lấy tên của các dịch vụ cho booking này
        const serviceNamesList = relatedServices.map(
          (service: any) => service.name
        );

        // Tính tổng giá của các dịch vụ (chuyển `price` thành số)
        const totalPrice = relatedServices.reduce(
          (total, service) => total + Number(service.price), // Chuyển price từ string sang number
          0
        );

        setServiceNames(serviceNamesList);
        setSelectedEvent({
          ...event,
          payments: bookingDetails.payments, // Include payments if available
          serviceNames: serviceNamesList,
          totalPrice: totalPrice.toLocaleString("vi-VN") + " VND", // Định dạng tổng giá tiền
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
      {/* Dropdown chọn stylist */}
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
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarManagement;

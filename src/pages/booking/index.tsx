import React, { useState, useEffect } from "react";
import "./index.scss";
import { DatePicker, Button, Select, message } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import api from "../../config/axios"; // Thêm axios để gọi API
dayjs.extend(isBetween);
const { Option } = Select;

const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedServices, setSelectedServices] = useState<number[]>([]); // Chọn nhiều service
  const [selectedStylist, setSelectedStylist] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [stylists, setStylists] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [serviceDurations, setServiceDurations] = useState<number[]>([]); // Lưu trữ duration của nhiều service
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showAllSlots, setShowAllSlots] = useState(false);

  useEffect(() => {
    const accountId = localStorage.getItem("accountId"); // Lấy accountId từ localStorage
    console.log("AccountId:", accountId);
    if (!accountId) {
      // Nếu không có accountId, hiển thị thông báo yêu cầu đăng nhập
      message.error("Vui lòng đăng nhập để sử dụng dịch vụ");
      return;
    }

    const fetchCustomerId = async () => {
      try {
        const response = await api.get("/customer");
        setCustomerId(response.data[0].id);
      } catch (error) {
        console.error("Lỗi khi lấy customer_id:", error);
        message.error("Không thể lấy thông tin khách hàng.");
      }
    };
    fetchCustomerId();

    const fetchServices = async () => {
      try {
        const response = await api.get("/service/getService");
        setServices(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
        message.error("Không thể tải danh sách dịch vụ.");
      }
    };
    fetchServices();

    const fetchStylists = async () => {
      try {
        const response = await api.get("/account");
        const stylistAccounts = response.data.filter(
          (account: any) => account.role === "STYLIST"
        );
        setStylists(stylistAccounts);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách stylist:", error);
        message.error("Không thể tải danh sách stylist.");
      }
    };
    fetchStylists();
  }, []); // Chạy một lần khi vào trang

  const [timeSlots, setTimeSlots] = useState([
    { time: "9:00 AM", status: "available" },
    { time: "10:00 AM", status: "available" },
    { time: "11:00 AM", status: "available" },
    { time: "12:00 PM", status: "available" },
    { time: "13:00 PM", status: "available" },
    { time: "14:00 PM", status: "available" },
    { time: "15:00 PM", status: "available" },
    { time: "16:00 PM", status: "available" },
    { time: "17:00 PM", status: "available" },
    { time: "18:00 PM", status: "available" },
    { time: "19:00 PM", status: "available" },
  ]);

  const toggleSlotVisibility = () => {
    setShowAllSlots(!showAllSlots); // Đảo ngược trạng thái hiển thị
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const handleServiceChange = async (values: number[]) => {
    setSelectedServices(values);

    // Tính tổng duration từ các dịch vụ đã chọn
    const selectedDurations = values.map((id) => {
      const selectedService = services.find((service) => service.id === id);
      return selectedService ? selectedService.duration : 0;
    });
    setServiceDurations(selectedDurations);

    // Logic tính toán thời gian dự kiến và giá dự kiến
    const estimatedDuration = values.reduce((acc, id) => {
      const service = services.find((s) => s.id === id);
      return acc + (service ? parseInt(service.duration) : 0); // Đảm bảo duration là số nguyên
    }, 0);

    const estimatedPrice = values.reduce((acc, id) => {
      const service = services.find((s) => s.id === id);
      return acc + (service ? parseInt(service.price) : 0); // Đảm bảo price là số nguyên
    }, 0);

    console.log("Estimated duration:", estimatedDuration, "minutes");
    console.log("Estimated price:", estimatedPrice, "VND");

    // Cập nhật thời gian dự kiến và giá dự kiến
    setEstimatedDuration(estimatedDuration);
    setEstimatedPrice(estimatedPrice);

    let commonStylistIds: number[] = [];

    console.log("Selected Service IDs:", values); // Log các service được chọn

    try {
      // Duyệt qua từng dịch vụ được chọn và gọi API để lấy stylist có thể làm dịch vụ
      for (const serviceId of values) {
        const response = await api.get(`/service/${serviceId}`);
        const serviceData = response.data;

        console.log(`Service Data for Service ID ${serviceId}:`, serviceData); // Log dữ liệu dịch vụ trả về từ API

        // Lấy danh sách stylist account_id từ mỗi dịch vụ trả về
        const stylistIdsForService = serviceData.stylists.map(
          (stylist: any) => stylist.id // Lấy stylist ID
        );
        console.log(
          `Stylist IDs for Service ID ${serviceId}:`,
          stylistIdsForService
        ); // Log danh sách stylist ID cho mỗi service

        if (commonStylistIds.length === 0) {
          // Gán danh sách stylist của dịch vụ đầu tiên vào commonStylistIds
          commonStylistIds = stylistIdsForService;
        } else {
          // Lọc những stylist xuất hiện trong tất cả các dịch vụ đã chọn
          commonStylistIds = commonStylistIds.filter((id) =>
            stylistIdsForService.includes(id)
          );
        }
      }

      console.log("Common Stylist IDs after filtering:", commonStylistIds); // Log danh sách stylist sau khi lọc

      // Nếu stylist hiện tại không nằm trong danh sách stylist có thể thực hiện các dịch vụ đã chọn, xóa stylist đã chọn
      if (selectedStylist && !commonStylistIds.includes(selectedStylist)) {
        setSelectedStylist(null);
        message.info(
          "Stylist hiện tại không thực hiện được tất cả dịch vụ đã chọn."
        );
      }

      // Gọi API /api/account để lấy danh sách tất cả account
      const accountResponse = await api.get(`/account`);
      const allAccounts = accountResponse.data;

      console.log("All Accounts:", allAccounts);

      // Tìm fullName từ danh sách account dựa trên commonStylistIds và account_id
      const availableStylists = commonStylistIds
        .map((stylistId) => {
          const account = allAccounts.find((acc: any) =>
            acc.stylists.some((stylist: any) => stylist.id === stylistId)
          );
          return account
            ? { id: account.id, fullName: account.fullName }
            : null;
        })
        .filter(Boolean); // Loại bỏ stylist null nếu không tìm thấy

      console.log("Render based on Common Stylist IDs:", availableStylists);

      // Cập nhật danh sách stylist để render ra
      setStylists(availableStylists);
    } catch (error) {
      console.error("Lỗi khi lọc stylist:", error);
      message.error("Không thể lọc stylist.");
    }
  };

  const handleStylistChange = async (value: number) => {
    setSelectedStylist(value); // `value` là `accountID`
    console.log("Account được chọn (accountID):", value); // Log ra accountID

    try {
      // Gọi API để lấy thông tin stylist dựa trên accountID
      const response = await api.get(`/${value}`);
      const selectedStylistData = response.data;

      // Lấy stylistId từ account đã chọn
      const stylistID = selectedStylistData.stylists[0]?.id; // Đảm bảo stylistID được lấy đúng
      console.log("StylistID tương ứng với account đã chọn:", stylistID);

      if (!stylistID) {
        message.error("Không thể tìm thấy stylist ID cho tài khoản này.");
        return;
      }

      // Gọi API để lấy tất cả các booking của stylist này
      const bookingsResponse = await api.get("/bookings/getBooking");
      const allBookings = bookingsResponse.data;

      // Lọc các booking có stylistID khớp với stylist được chọn
      const stylistBookings = allBookings.filter(
        (booking: any) => booking.stylist.id === stylistID
      );

      console.log("Booking của stylist đã chọn:", stylistBookings);

      // Duyệt qua từng slot thời gian và kiểm tra nếu nó đã được đặt
      const updatedTimeSlots = timeSlots.map((slot) => {
        const slotStart = dayjs(
          `${selectedDate.format("YYYY-MM-DD")} ${slot.time}`,
          ["YYYY-MM-DD h:mm A"]
        );

        // Kiểm tra xem slotStart có phải là đối tượng dayjs hợp lệ không
        if (!dayjs.isDayjs(slotStart)) {
          console.error(
            "slotStart không phải là đối tượng dayjs hợp lệ:",
            slotStart
          );
          return slot; // Bỏ qua nếu slotStart không hợp lệ
        }

        // Kiểm tra xem slot có trùng với thời gian của bất kỳ booking nào không
        const isBooked = stylistBookings.some((booking: any) => {
          const bookingStart = dayjs(
            `${booking.appointmentDate} ${booking.startTime}`,
            "YYYY-MM-DD HH:mm:ss"
          );
          const bookingEnd = dayjs(
            `${booking.appointmentDate} ${booking.endTime}`,
            "YYYY-MM-DD HH:mm:ss"
          );
          // Kiểm tra nếu slotStart nằm giữa bookingStart và bookingEnd hoặc trùng với bookingStart
          return (
            slotStart.isSame(bookingStart) ||
            slotStart.isBetween(bookingStart, bookingEnd, null, "[)")
          );
        });

        return {
          ...slot,
          status: isBooked ? "unavailable" : "available", // Đánh dấu slot là unavailable nếu nó đã được đặt
        };
      });

      // Cập nhật lại state của timeSlots để giao diện cập nhật
      setTimeSlots(updatedTimeSlots);

      console.log("Updated time slots with booking status:", updatedTimeSlots);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách booking:", error);
      message.error("Không thể tải danh sách booking.");
    }
  };

  const handleTimeSlotChange = (time: string) => {
    setSelectedTimeSlot(time);
  };

  const handleSubmit = async () => {
    if (
      !selectedTimeSlot ||
      selectedServices.length === 0 ||
      selectedStylist === null ||
      !localStorage.getItem("customerId") // Kiểm tra xem có customerId trong localStorage không
    ) {
      message.error("Vui lòng chọn đầy đủ các thông tin!");
      return;
    }

    try {
      const customerIdFromLocalStorage = localStorage.getItem("customerId"); // Lấy customerId từ localStorage

      console.log(
        "Customer ID đang được truyền vào API:",
        customerIdFromLocalStorage
      );
      let commonStylistIds: number[] = [];

      // Duyệt qua từng dịch vụ được chọn và lấy stylist ID từ mỗi dịch vụ
      for (const serviceId of selectedServices) {
        const response = await api.get(`/service/${serviceId}`);
        const serviceData = response.data;

        // Lấy danh sách stylist ID cho dịch vụ này
        const stylistIdsForService = serviceData.stylists.map(
          (stylist: any) => stylist.id
        );

        if (commonStylistIds.length === 0) {
          // Gán danh sách stylist của dịch vụ đầu tiên vào commonStylistIds
          commonStylistIds = stylistIdsForService;
        } else {
          // Lọc những stylist xuất hiện trong tất cả các dịch vụ đã chọn
          commonStylistIds = commonStylistIds.filter((id) =>
            stylistIdsForService.includes(id)
          );
        }
      }

      console.log("Common Stylist IDs after filtering:", commonStylistIds);

      // Xác định stylist ID dựa trên selectedStylist (accountID)
      const stylistResponse = await api.get(`/${selectedStylist}`);
      const stylistID = stylistResponse.data.stylists[0]?.id; // Lấy đúng stylistID từ stylist đã chọn

      if (!stylistID) {
        message.error("Không tìm thấy stylist ID.");
        return;
      }

      // Gọi API để lấy thông tin từng dịch vụ đã chọn
      const selectedDurations = await Promise.all(
        selectedServices.map(async (serviceId) => {
          const response = await api.get(`/service/${serviceId}`);
          const serviceData = response.data;

          return parseInt(serviceData.duration); // Trả về duration của dịch vụ dưới dạng số nguyên
        })
      );

      // Tính tổng thời gian endTime dựa trên tổng duration của tất cả các service
      const totalDuration = selectedDurations.reduce(
        (acc, duration) => acc + duration,
        0
      );

      // Định dạng thời gian bắt đầu theo yêu cầu
      const appointmentDate = selectedDate.format("YYYY-MM-DD");
      const startTime = dayjs(`${appointmentDate} ${selectedTimeSlot}`, [
        "YYYY-MM-DD h:mm A",
      ]); // Tạo startTime chính xác

      // Tính toán endTime bằng cách thêm tổng thời lượng vào startTime, giữ nguyên giờ và phút
      const endTime = startTime.add(totalDuration, "minute").format("HH:mm:ss"); // Định dạng endTime

      console.log("Start time:", startTime.format("HH:mm:ss"));
      console.log("End time:", endTime);
      console.log("Customer ID:", customerIdFromLocalStorage);
      console.log("Stylist ID:", stylistID);
      console.log("Selected Services:", selectedServices);

      // **THÊM MỚI: Lấy danh sách booking đã có cho stylist được chọn**
      const bookingsResponse = await api.get("/bookings/getBooking");
      const stylistBookings = bookingsResponse.data.filter(
        (booking: any) => booking.stylist.id === stylistID
      );

      // Kiểm tra xem thời gian đặt mới có trùng với bất kỳ khoảng thời gian nào đã được đặt trước đó không
      const isOverlapping = stylistBookings.some((booking: any) => {
        const bookingStart = dayjs(
          `${booking.appointmentDate} ${booking.startTime}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        const bookingEnd = dayjs(
          `${booking.appointmentDate} ${booking.endTime}`,
          "YYYY-MM-DD HH:mm:ss"
        );

        // Chuyển startTime và endTime thành đối tượng dayjs
        const formattedStartTime = dayjs(startTime, "HH:mm:ss");
        const formattedEndTime = dayjs(endTime, "HH:mm:ss");

        // Kiểm tra nếu thời gian của booking mới đè lên bất kỳ thời gian booking nào đã có
        return (
          formattedStartTime.isBefore(bookingEnd) &&
          formattedEndTime.isAfter(bookingStart)
        );
      });

      if (isOverlapping) {
        message.error("Thời gian đã chọn trùng với lịch đặt khác!");
        return;
      }

      // Kiểm tra nếu endTime quá 20h
      const closingTime = dayjs(
        `${appointmentDate} 20:00:00`,
        "YYYY-MM-DD HH:mm:ss"
      );
      if (dayjs(endTime, "HH:mm:ss").isAfter(closingTime)) {
        message.error("Không được đặt dịch vụ quá 20h");
        return; // Dừng việc gửi yêu cầu đặt lịch nếu endTime vượt quá 20h
      }

      // Chuẩn bị dữ liệu để gửi lên API
      const bookingData = {
        service_id: selectedServices, // Truyền trực tiếp các service IDs
        stylist: {
          id: stylistID, // Truyền đúng stylistID từ danh sách stylist có thể thực hiện dịch vụ
        },
        customer: {
          id: customerIdFromLocalStorage, // Truyền customer ID từ localStorage
        },
        appointmentDate: appointmentDate, // Ngày đặt lịch
        startTime: startTime.format("HH:mm:ss"), // Chỉ giờ, phút, giây cho thời gian bắt đầu
        endTime: endTime, // Chỉ giờ, phút, giây cho thời gian kết thúc
        status: "confirmed", // Trạng thái ban đầu
      };

      console.log("Booking data to be sent:", bookingData);

      // Gửi dữ liệu lên API
      const response = await api.post("/bookings/createBooking", bookingData);

      if (response.status === 200) {
        message.success("Đặt lịch thành công!");

        // **THÊM LOGIC RESET FORM SAU KHI ĐẶT LỊCH THÀNH CÔNG**
        setSelectedDate(dayjs()); // Reset lại ngày
        setSelectedServices([]); // Reset lại dịch vụ đã chọn
        setSelectedStylist(null); // Reset stylist đã chọn
        setSelectedTimeSlot(null); // Reset slot thời gian
        setEstimatedDuration(0); // Reset thời gian dự kiến
        setEstimatedPrice(0); // Reset giá dự kiến
        setShowAllSlots(false); // Ẩn các khung giờ nếu đang hiển thị
      }
    } catch (error) {
      console.error("Lỗi khi tạo đặt lịch:", error);
      message.error("Đặt lịch không thành công, vui lòng thử lại.");
    }
  };

  // Logic để vô hiệu hóa ngày trong quá khứ
  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <div className="booking-wrapper">
      <h1>Đặt Lịch</h1>

      <div className="form-group">
        <label>Thời gian đặt lịch</label>
        <div className="date-picker">
          <DatePicker
            value={selectedDate}
            format="MM/DD/YYYY"
            onChange={handleDateChange}
            disabledDate={disabledDate}
          />
          <span className="day-of-week">
            {selectedDate.format("dddd, MM/DD/YYYY")}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label>Chọn dịch vụ</label>
        <Select
          mode="multiple" // Thêm chế độ multiple
          style={{ width: "100%" }}
          placeholder="Chọn dịch vụ"
          value={selectedServices}
          onChange={handleServiceChange}
        >
          {services.map((service) => (
            <Option key={service.id} value={service.id}>
              {service.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Hiển thị thời gian dự kiến và giá dự kiến */}
      <div className="estimated-info">
        <p>
          Thời gian dự kiến:{" "}
          {estimatedDuration >= 60
            ? `${Math.floor(estimatedDuration / 60)} giờ ${
                estimatedDuration % 60
              } phút`
            : `${estimatedDuration} phút`}
        </p>
        <p>Giá dự kiến: {estimatedPrice.toLocaleString()} VND</p>
      </div>

      <div className="form-group">
        <label>Chọn Hair Stylist</label>
        <Select
          value={selectedStylist}
          onChange={handleStylistChange}
          placeholder="Chọn Hair Stylist"
          className="stylist-select"
        >
          {stylists.map((stylist) => (
            <Option value={stylist.id} key={stylist.id}>
              {stylist.fullName}
            </Option>
          ))}
        </Select>
      </div>

      <div className="form-group">
        <Button
          onClick={toggleSlotVisibility}
          type="primary"
          className="submit-button view-slots-button"
          size="large"
        >
          {showAllSlots ? "Ẩn khung giờ" : "Xem khung giờ phục vụ"}
        </Button>

        {/* Hiển thị tất cả các slot nếu showAllSlots là true */}
        {showAllSlots && (
          <div className="time-slot-wrapper">
            {timeSlots.map((slot) => (
              <div
                key={slot.time}
                className={`time-slot ${slot.status} ${
                  selectedTimeSlot === slot.time ? "selected" : ""
                }`}
                onClick={() =>
                  slot.status === "available" && handleTimeSlotChange(slot.time)
                }
              >
                <span>{slot.time}</span>
                <span>
                  {slot.status === "available" ? " Còn chỗ" : " Hết chỗ"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hiển thị slot chỉ sau khi đã chọn stylist */}
      {selectedStylist && (
        <div className="form-group">
          <label>Chọn khung giờ phục vụ</label>
          <div className="time-slot-wrapper">
            {timeSlots
              .filter((slot) => slot.status === "available") // Chỉ hiển thị slot còn chỗ
              .map((slot) => (
                <div
                  key={slot.time}
                  className={`time-slot ${slot.status} ${
                    selectedTimeSlot === slot.time ? "selected" : ""
                  }`}
                  onClick={() =>
                    slot.status === "available" &&
                    handleTimeSlotChange(slot.time)
                  }
                >
                  <span>{slot.time}</span>
                  <span>
                    {slot.status === "available" ? " Còn chỗ" : " Hết chỗ"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      <Button
        type="primary"
        className="submit-button"
        onClick={handleSubmit}
        size="large"
      >
        Đặt lịch ngay
      </Button>
    </div>
  );
};

export default Booking;

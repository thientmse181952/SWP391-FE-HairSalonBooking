import React, { useState, useEffect } from "react";
import "./index.scss";
import { DatePicker, Button, Select, message } from "antd";
import dayjs from "dayjs";
import api from "../../config/axios"; // Thêm axios để gọi API

const { Option } = Select;

const timeSlots = [
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
];

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

  const handleStylistChange = (value: number) => {
    setSelectedStylist(value);
  };

  const handleTimeSlotChange = (time: string) => {
    setSelectedTimeSlot(time);
  };

  const handleSubmit = async () => {
    if (
      !selectedTimeSlot ||
      selectedServices.length === 0 ||
      selectedStylist === null || // Chắc chắn rằng bạn lấy đúng selectedStylist
      customerId === null
    ) {
      message.error("Vui lòng chọn đầy đủ các thông tin!");
      return;
    }

    try {
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

      // Xác định stylist ID để truyền vào bookingData
      const stylistID =
        selectedStylist && commonStylistIds.includes(selectedStylist)
          ? selectedStylist
          : commonStylistIds.length > 0
          ? commonStylistIds[0]
          : null;

      if (!stylistID) {
        message.error("Không có stylist nào phù hợp với dịch vụ đã chọn.");
        return;
      }

      // Gọi API để lấy thông tin từng dịch vụ đã chọn
      const selectedDurations = await Promise.all(
        selectedServices.map(async (serviceId) => {
          const response = await api.get(`/service/${serviceId}`);
          const serviceData = response.data;

          // Log duration của từng dịch vụ
          console.log(
            `Service ID: ${serviceId}, Duration: ${serviceData.duration}`
          );

          return parseInt(serviceData.duration); // Trả về duration của dịch vụ dưới dạng số nguyên
        })
      );

      console.log("All selected service durations:", selectedDurations); // Console log tất cả durations

      // Tính tổng thời gian endTime dựa trên tổng duration của tất cả các service
      const totalDuration = selectedDurations.reduce(
        (acc, duration) => acc + duration,
        0
      );

      console.log("Total duration (minutes):", totalDuration); // Log tổng duration

      // Định dạng thời gian bắt đầu theo yêu cầu
      const appointmentDate = selectedDate.format("YYYY-MM-DD");
      const startTime = dayjs(`${appointmentDate} ${selectedTimeSlot}`, [
        "YYYY-MM-DD h:mm A",
      ]); // Tạo startTime chính xác

      console.log("Start time:", startTime.format("HH:mm:ss")); // Log thời gian bắt đầu chỉ với giờ, phút và giây

      // Tính toán endTime bằng cách thêm tổng thời lượng vào startTime, giữ nguyên giờ và phút
      const endTime = startTime
        .add(totalDuration, "minute") // Cộng thêm tổng thời lượng vào startTime
        .format("HH:mm:ss"); // Định dạng endTime để chỉ truyền giờ, phút và giây

      console.log("End time:", endTime); // Log thời gian kết thúc

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
          id: customerId, // Truyền customer ID
        },
        appointmentDate: appointmentDate, // Ngày đặt lịch
        startTime: startTime.format("HH:mm:ss"), // Chỉ giờ, phút, giây cho thời gian bắt đầu
        endTime: endTime, // Chỉ giờ, phút, giây cho thời gian kết thúc
        status: "Pending", // Trạng thái ban đầu
      };

      // Console log dữ liệu để kiểm tra trước khi gửi
      console.log("Booking data to be sent:", bookingData);

      // Gửi dữ liệu lên API
      const response = await api.post("/bookings/createBooking", bookingData);

      if (response.status === 200) {
        message.success("Đặt lịch thành công!");
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
        <p>Thời gian dự kiến: {estimatedDuration} phút</p>
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
        <label>Chọn khung giờ phục vụ</label>
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
              <span>{slot.status === "available" ? "Còn chỗ" : "Hết chỗ"}</span>
            </div>
          ))}
        </div>
      </div>

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

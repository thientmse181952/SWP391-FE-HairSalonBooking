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

  // Gọi API để lấy customer_id từ API /api/customer
  useEffect(() => {
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
  }, []);

  // Gọi API để lấy danh sách dịch vụ từ API GET /service
  useEffect(() => {
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
  }, []);

  // Gọi API để lấy danh sách stylist từ API GET /account với role là STYLIST
  useEffect(() => {
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
  }, []);

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
          console.log(
            `Checking account with stylist ID ${stylistId}:`,
            account
          ); // Log từng account đang được kiểm tra
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
      selectedStylist === null ||
      customerId === null
    ) {
      message.error("Vui lòng chọn đầy đủ các thông tin!");
      return;
    }

    // Định dạng thời gian bắt đầu theo yêu cầu
    const appointmentDate = selectedDate.format("YYYY-MM-DD");
    const startTime = `${appointmentDate} ${dayjs(selectedTimeSlot, [
      "h:mm A",
    ]).format("HH:mm:ss")}`;

    // Tính tổng thời gian endTime dựa trên tổng duration của tất cả các service
    const totalDuration = serviceDurations.reduce(
      (acc, duration) => acc + duration,
      0
    );
    const endTime = dayjs(startTime)
      .add(totalDuration, "minute") // Cộng thêm tổng thời lượng vào startTime
      .format("YYYY-MM-DD HH:mm:ss"); // Thêm định dạng ngày vào endTime

    // Chuẩn bị dữ liệu để gửi lên API
    const bookingData = {
      service_id: selectedServices, // Truyền trực tiếp các service IDs
      stylist: {
        id: selectedStylist, // Truyền stylist ID
      },
      customer: {
        id: customerId, // Truyền customer ID
      },
      appointmentDate: appointmentDate, // Ngày đặt lịch
      startTime: startTime, // Thời gian bắt đầu
      endTime: endTime, // Thời gian kết thúc
      status: "Pending", // Trạng thái ban đầu
    };

    // Console log dữ liệu để kiểm tra trước khi gửi
    console.log("Booking data to be sent:", bookingData);

    try {
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

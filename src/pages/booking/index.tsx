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
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [stylists, setStylists] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [serviceDuration, setServiceDuration] = useState<number | null>(null); // Thêm state để lưu duration

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

  const handleServiceChange = async (value: number) => {
    setSelectedService(value);

    // Gọi API để lấy duration của dịch vụ đã chọn
    try {
      const selectedService = services.find((service) => service.id === value);
      setServiceDuration(selectedService?.duration || null); // Lưu duration vào state
    } catch (error) {
      console.error("Lỗi khi lấy thông tin duration:", error);
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
      selectedService === null ||
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

    // Tính toán endTime dựa trên duration và thêm cả ngày
    const endTime = dayjs(startTime)
      .add(serviceDuration || 0, "minute") // Cộng thêm duration vào startTime
      .format("YYYY-MM-DD HH:mm:ss"); // Thêm định dạng ngày vào endTime

    try {
      const response = await api.post("/bookings/createBooking", {
        stylist: {
          id: selectedStylist,
        },
        serviceofHair: {
          id: selectedService,
        },
        customer: {
          id: customerId,
        },
        appointmentDate: appointmentDate,
        startTime: startTime,
        endTime: endTime, // Truyền endTime có ngày và giờ
        status: "Pending",
      });

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
          style={{ width: "100%" }}
          placeholder="Chọn dịch vụ"
          value={selectedService}
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

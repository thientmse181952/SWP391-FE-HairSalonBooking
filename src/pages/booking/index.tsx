import React, { useState } from "react";
import "./index.scss";
import { DatePicker, Button, Checkbox, Select, message } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const services = [
  { label: "Cắt tóc", value: "haircut" },
  { label: "Uốn tóc", value: "perm" },
  // Thêm các dịch vụ khác
];

const hairStylists = [
  { name: "Stylist Lê Hiếu", value: "le-hieu" },
  { name: "Stylist Nam Anh", value: "nam-anh" },
  // Thêm stylist khác
];

const timeSlots = [
  { time: "9:00 AM", status: "available" },
  { time: "10:00 AM", status: "unavailable" },
  { time: "11:00 AM", status: "unavailable" },
  { time: "12:00 AM", status: "available" },
  { time: "13:00 PM", status: "available" },
  { time: "14:00 PM", status: "available" },
  { time: "15:00 PM", status: "available" },
  { time: "16:00 PM", status: "available" },
  { time: "17:00 PM", status: "available" },
  { time: "18:00 PM", status: "available" },
  { time: "19:00 PM", status: "available" },
];

const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Sử dụng dayjs để thay thế cho moment
  const [selectedService, setSelectedService] = useState<string[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const handleServiceChange = (checkedValue: string[]) => {
    setSelectedService(checkedValue);
  };

  const handleStylistChange = (value: string) => {
    setSelectedStylist(value);
  };

  const handleTimeSlotChange = (time: string) => {
    setSelectedTimeSlot(time);
  };

  const handleSubmit = () => {
    if (!selectedTimeSlot || !selectedService.length || !selectedStylist) {
      message.error("Vui lòng chọn đầy đủ các thông tin!");
      return;
    }

    message.success("Đặt lịch thành công!");
    // Xử lý logic đặt lịch tại đây
  };

  // Logic để vô hiệu hóa ngày trong quá khứ
  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf("day"); // Vô hiệu hóa tất cả các ngày trước hôm nay
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
            disabledDate={disabledDate} // Thêm thuộc tính disabledDate để ngăn chọn ngày quá khứ
          />
          <span className="day-of-week">
            {selectedDate.format("dddd, MM/DD/YYYY")}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label>Chọn dịch vụ</label>
        <Checkbox.Group
          options={services}
          onChange={handleServiceChange}
          value={selectedService}
        />
      </div>

      <div className="form-group">
        <label>Chọn Hair Stylist</label>
        <Select
          value={selectedStylist}
          onChange={handleStylistChange}
          placeholder="Chọn Hair Stylist"
          className="stylist-select"
        >
          {hairStylists.map((stylist) => (
            <Option value={stylist.value} key={stylist.value}>
              {stylist.name}
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

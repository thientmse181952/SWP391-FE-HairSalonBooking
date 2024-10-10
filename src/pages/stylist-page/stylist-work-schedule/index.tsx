import React, { useState } from "react";
import { Table, Select, Modal, Button, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";

const { Option } = Select;

const timeSlots = Array.from({ length: 6 }, (_, index) => ({
  key: index,
  time: `${8 + Math.floor(index / 3) * 2}:00 - ${10 + Math.floor(index / 3) * 2}:00`
}));

const generateRandomBooking = () => {
  const names = ["Đức Cống", "Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D"];
  const services = ["Cắt tóc nam", "Nhuộm tóc", "Gội đầu", "Uốn tóc", "Duỗi tóc"];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomService = services[Math.floor(Math.random() * services.length)];
  return { name: randomName, service: randomService };
};

const StylistSchedule: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(moment().week());
  const [dayOff, setDayOff] = useState<number>(5); // Thứ 6
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{ name: string; service: string } | null>(null);

  const startOfWeek = moment().week(selectedWeek).startOf('isoWeek');
  const days = [startOfWeek.clone().add(1, 'days'), startOfWeek.clone().add(6, 'days')]; // Thứ 2 và Chủ nhật

  // Dữ liệu booking
  const bookings = {
    "2-0": generateRandomBooking(), // Thứ 2, Slot 1
    "2-1": generateRandomBooking(), // Thứ 2, Slot 2
    "2-5": generateRandomBooking(), // Thứ 2, Slot 6
    "3-2": generateRandomBooking(), // Thứ 3, Slot 3
    "5-3": generateRandomBooking(), // Thứ 5, Slot 4
    "7-4": generateRandomBooking(), // Chủ nhật, Slot 5
    "7-0": generateRandomBooking(), // Chủ nhật, Slot 1
    "7-1": generateRandomBooking(), // Chủ nhật, Slot 2
  };

  const handleSelectWeek = (week: number) => {
    setSelectedWeek(week);
  };

  const handleBookingClick = (day: number, slot: number) => {
    const booking = bookings[`${day}-${slot}`];
    if (booking) {
      setSelectedBooking(booking);
      setModalVisible(true);
    }
  };

  const handleOffClick = () => {
    Popconfirm({
      title: "Yêu cầu của bạn sẽ được gửi tới quản lý. Vui lòng đợi phản hồi từ quản lý!",
      onConfirm: () => {
        console.log(`Ngày nghỉ đã được đăng ký cho ngày: ${dayOff}`);
      },
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: "Slot",
      dataIndex: "slot",
      render: (_, __, index) => (
        <div>{timeSlots[index].time}</div>
      ),
    },
    ...days.map((day, dayIndex) => ({
      title: day.format("dddd") + ` (${day.format("DD/MM/YYYY")})`,
      dataIndex: dayIndex,
      render: (_, __, slotIndex) => {
        const booking = bookings[`${dayIndex + 1}-${slotIndex}`];
        const isOff = dayIndex + 1 === dayOff;

        return (
          <div
            style={{
              backgroundColor: isOff ? "yellow" : booking ? "orange" : "lightblue",
              color: "black",
              padding: "10px",
              textAlign: "center",
              cursor: "pointer"
            }}
            onClick={() => booking && handleBookingClick(dayIndex + 1, slotIndex)}
          >
            {isOff ? "OFF" : booking ? `${booking.name}: ${booking.service}` : "Đi làm"}
          </div>
        );
      },
    })),
  ];

  return (
    <div>
      <h1>SẮP XẾP LỊCH LÀM</h1>
      <Select defaultValue={selectedWeek} onChange={handleSelectWeek} style={{ width: 200 }}>
        {Array.from({ length: 52 }, (_, index) => (
          <Option key={index} value={index + 1}>
            Tuần {index + 1}
          </Option>
        ))}
      </Select>
      <Table columns={columns} dataSource={timeSlots.map((_, index) => ({ slot: index }))} pagination={false} />
      <Button 
        style={{ marginTop: 10 }} 
        onClick={handleOffClick}
      >
        CHỌN NGÀY NGHỈ
      </Button>

      <Modal
        title="Thông tin booking"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedBooking && (
          <div>
            <p>Tên: {selectedBooking.name}</p>
            <p>Dịch vụ: {selectedBooking.service}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StylistSchedule;

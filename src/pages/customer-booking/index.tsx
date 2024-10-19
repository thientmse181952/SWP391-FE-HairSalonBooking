import React, { useState, useEffect } from "react";
import { Table } from "antd";
import moment from "moment";
import api from "../../config/axios";

const CustomerBookingList: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const customerId = localStorage.getItem("customerId");

  const columns = [
    {
      title: "Ngày đặt lịch",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date: string) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Thời gian",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime: string, record: any) =>
        `${startTime} - ${record.endTime}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusInVietnamese(status),
    },
    {
      title: "Stylist",
      dataIndex: ["stylist", "id"],
      key: "stylist",
      render: (stylistId: number, record: any) =>
        `Stylist #${record.stylist.id}`,
    },
  ];

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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/getBooking");
        const allBookings = response.data;

        // Lọc các booking theo customerId
        const customerBookings = allBookings.filter(
          (booking: any) => booking.customer.id === parseInt(customerId || "0")
        );

        setBookings(customerBookings);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách booking:", error);
      }
    };

    fetchBookings();
  }, [customerId]);

  return (
    <div>
      <h2>Danh sách đặt lịch của bạn</h2>
      <Table columns={columns} dataSource={bookings} rowKey="bookingId" />
    </div>
  );
};

export default CustomerBookingList;

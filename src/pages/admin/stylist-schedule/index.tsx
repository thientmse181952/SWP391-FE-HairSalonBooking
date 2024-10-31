import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import api from "../../../config/axios";
import moment from "moment";
import "./index.scss";

interface Schedule {
  id: number;
  reason: string;
  status: string;
  startTime: string;
  endTime: string;
  stylist: {
    id: number;
    fullName?: string;
  };
}

interface Account {
  id: number;
  fullName: string;
  stylists: { id: number }[];
}

function StylistScheduleAdmin() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  // const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);

  useEffect(() => {
    const fetchSchedulesAndAccounts = async () => {
      try {
        // Lấy danh sách lịch nghỉ
        const response = await api.get("/schedules");
        const allSchedules = response.data;
        console.log("Schedules data:", allSchedules);

        // Lấy danh sách tài khoản
        const accountsResponse = await api.get("/account");
        const allAccounts = accountsResponse.data;

        // Gán fullName vào stylist dựa trên stylistID
        const schedulesWithNames = allSchedules
          .map((schedule: Schedule) => {
            const stylistAccount = allAccounts.find((account: Account) =>
              account.stylists.some(
                (stylist) => stylist.id === schedule.stylist.id
              )
            );
            return {
              ...schedule,
              stylist: {
                ...schedule.stylist,
                fullName: stylistAccount ? stylistAccount.fullName : "Unknown",
              },
            };
          })
          .sort((a, b) => b.id - a.id);

        setSchedules(schedulesWithNames);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchSchedulesAndAccounts();
  }, []);

  // Hàm xử lý cập nhật trạng thái
  const handleApproval = async (id: number, status: string) => {
    try {
      // Kiểm tra booking của stylist trước khi "chấp nhận"
      if (status === "chấp nhận") {
        const bookingsResponse = await api.get("/bookings/getBooking");
        const allBookings = bookingsResponse.data;

        // Tìm lịch nghỉ được phê duyệt
        const scheduleToApprove = schedules.find(
          (schedule) => schedule.id === id
        );

        console.log("Schedule cần phê duyệt:", scheduleToApprove);
        console.log("Danh sách tất cả bookings:", allBookings);

        const hasConflictingBooking = allBookings.some((booking: any) => {
          const isSameStylist =
            booking.stylist.id === scheduleToApprove?.stylist.id;
          const isTimeConflict =
            moment(scheduleToApprove?.startTime).isBefore(
              moment(`${booking.appointmentDate} ${booking.endTime}`)
            ) &&
            moment(scheduleToApprove?.endTime).isAfter(
              moment(`${booking.appointmentDate} ${booking.startTime}`)
            );

          console.log("Kiểm tra booking:", booking);
          console.log("Stylist trùng:", isSameStylist);
          console.log("Thời gian trùng:", isTimeConflict);

          // Kiểm tra xem stylist có booking với thời gian trùng không
          return (
            isSameStylist && isTimeConflict && booking.status === "Đã xác nhận"
          );
        });

        if (hasConflictingBooking) {
          message.warning(
            "Stylist này hiện có booking trùng với lịch nghỉ, không thể duyệt lịch nghỉ."
          );
          console.log("Có booking trùng thời gian, không cho phép duyệt.");
          return;
        }
      }

      const statusPayload = status === "chấp nhận" ? "Chấp nhận" : "Từ chối";
      await api.put(`/schedules/${id}/status`, statusPayload, {
        headers: {
          "Content-Type": "text/plain",
        },
      });

      message.success(
        `Lịch đã được cập nhật thành công với trạng thái: ${status}`
      );

      const [schedulesResponse, accountsResponse] = await Promise.all([
        api.get("/schedules"),
        api.get("/account"),
      ]);

      const allSchedules = schedulesResponse.data;
      const allAccounts = accountsResponse.data;

      const schedulesWithNames = allSchedules.map((schedule: Schedule) => {
        const stylistAccount = allAccounts.find((account: Account) =>
          account.stylists.some((stylist) => stylist.id === schedule.stylist.id)
        );
        return {
          ...schedule,
          stylist: {
            ...schedule.stylist,
            fullName: stylistAccount ? stylistAccount.fullName : "Unknown",
          },
        };
      });

      schedulesWithNames.sort((a: Schedule, b: Schedule) => b.id - a.id);

      setSchedules(schedulesWithNames);
      setEditingRow(null);
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái lịch!");
      console.error("Chi tiết lỗi:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên Stylist",
      dataIndex: "stylistFullName",
      key: "stylistFullName",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      render: (text: string) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      render: (text: string) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        return <span>{status}</span>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (schedule: Schedule) => {
        const { id, status } = schedule;
        const isEditing = editingRow === id;

        if (isEditing || status === "Đang chờ xác nhận") {
          return (
            <div>
              <Button
                type="primary"
                onClick={() => handleApproval(id, "chấp nhận")}
                style={{ marginRight: 8 }}
              >
                Chấp nhận
              </Button>
              <Button danger onClick={() => handleApproval(id, "từ chối")}>
                Từ chối
              </Button>
            </div>
          );
        }

        if (status === "Từ chối" || status === "Chấp nhận") {
          return <Button onClick={() => setEditingRow(id)}>Sửa</Button>;
        }

        return null;
      },
    },
  ];

  return (
    <div>
      <h2>Quản lý lịch nghỉ của Stylist</h2>
      <Table
        columns={columns}
        dataSource={schedules.map((schedule) => ({
          key: schedule.id,
          id: schedule.id,
          stylistFullName: schedule.stylist.fullName,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          reason: schedule.reason,
          status: schedule.status,
        }))}
        rowClassName={(record) => {
          switch (record.status) {
            case "Đang chờ xác nhận":
              return "status-pending";
            case "Chấp nhận":
              return "status-approved";
            case "Từ chối":
              return "status-rejected";
            default:
              return "status-default";
          }
        }}
        pagination={false}
      />
    </div>
  );
}

export default StylistScheduleAdmin;

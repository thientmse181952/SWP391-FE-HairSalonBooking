import React, { useEffect, useState } from "react";
import { Table } from "antd";
import api from "../../../config/axios";
import moment from "moment";

interface Schedule {
  scheduleID: number;
  reason: string;
  status: string;
  startTime: string;
  endTime: string;
  stylist: {
    id: number;
    fullName?: string; // Thêm fullName để hiển thị tên stylist
  };
}

interface Account {
  id: number;
  fullName: string;
  stylists: { id: number }[]; // Array chứa stylistID của stylist
}

function StylistScheduleAdmin() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]); // Lưu danh sách tài khoản

  useEffect(() => {
    const fetchSchedulesAndAccounts = async () => {
      try {
        // Lấy danh sách lịch nghỉ
        const response = await api.get("/schedules");
        const allSchedules = response.data;
        console.log("Dữ liệu lấy được từ API schedules:", allSchedules);

        // Lấy danh sách tài khoản
        const accountsResponse = await api.get("/account");
        const allAccounts = accountsResponse.data;
        console.log("Dữ liệu lấy được từ API accounts:", allAccounts);

        // Gán fullName vào stylist dựa trên stylistID
        const schedulesWithNames = allSchedules.map((schedule: Schedule) => {
          const stylistAccount = allAccounts.find((account: Account) =>
            account.stylists.some(
              (stylist) => stylist.id === schedule.stylist.id
            )
          );
          // Log từng stylist tìm thấy để kiểm tra
          console.log("Stylist Account found:", stylistAccount);

          return {
            ...schedule,
            stylist: {
              ...schedule.stylist,
              fullName: stylistAccount ? stylistAccount.fullName : "Unknown",
            },
          };
        });

        // Log toàn bộ danh sách lịch nghỉ sau khi đã có tên stylist
        console.log("Lịch nghỉ với tên đầy đủ stylist:", schedulesWithNames);

        setSchedules(schedulesWithNames); // Lưu lịch với tên stylist đầy đủ
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchSchedulesAndAccounts();
  }, []);

  // Cột của bảng
  const columns = [
    {
      title: "Tên Stylist",
      dataIndex: "stylistFullName", // Hiển thị tên stylist
      key: "fullName",
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
    },
  ];

  return (
    <div>
      <h2>Quản lý lịch nghỉ của Stylist</h2>
      <Table
        columns={columns}
        dataSource={schedules.map((schedule) => ({
          key: schedule.scheduleID,
          stylistFullName: schedule.stylist.fullName,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          reason: schedule.reason,
          status: schedule.status,
        }))}
        pagination={false} // Tắt phân trang nếu không cần
      />
    </div>
  );
}

export default StylistScheduleAdmin;

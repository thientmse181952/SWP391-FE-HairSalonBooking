import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);

  useEffect(() => {
    const fetchSchedulesAndAccounts = async () => {
      try {
        // Lấy danh sách lịch nghỉ
        const response = await api.get("/schedules");
        const allSchedules = response.data;

        // Lấy danh sách tài khoản
        const accountsResponse = await api.get("/account");
        const allAccounts = accountsResponse.data;

        // Gán fullName vào stylist dựa trên stylistID
        const schedulesWithNames = allSchedules.map((schedule: Schedule) => {
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
        });

        setSchedules(schedulesWithNames);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchSchedulesAndAccounts();
  }, []);

  // Hàm xử lý cập nhật trạng thái
  const handleApproval = async (scheduleID: number, status: string) => {
    try {
      const statusPayload = status === "chấp nhận" ? "approved" : "cancel";

      await api.put(`/schedules/${scheduleID}/status`, statusPayload, {
        headers: {
          "Content-Type": "text/plain",
        },
      });

      message.success(
        `Lịch đã được cập nhật thành công với trạng thái: ${status}`
      );

      // Sau khi cập nhật, lấy lại danh sách schedules và accounts để gán lại fullName
      const [schedulesResponse, accountsResponse] = await Promise.all([
        api.get("/schedules"),
        api.get("/account"),
      ]);

      const allSchedules = schedulesResponse.data;
      const allAccounts = accountsResponse.data;

      // Gán fullName vào stylist dựa trên stylistID sau khi cập nhật
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

      setSchedules(schedulesWithNames); // Cập nhật lại danh sách lịch với tên stylist đầy đủ
      setEditingRow(null); // Ẩn chế độ chỉnh sửa sau khi cập nhật
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái lịch!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "scheduleID",
      key: "scheduleID",
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
    },
    {
      title: "Hành động",
      key: "action",
      render: (schedule: Schedule) => {
        const { scheduleID, status } = schedule;
        const isEditing = editingRow === scheduleID;

        if (isEditing || status === "pending") {
          return (
            <div>
              <Button
                type="primary"
                onClick={() => handleApproval(scheduleID, "chấp nhận")}
                style={{ marginRight: 8 }}
              >
                Chấp nhận
              </Button>
              <Button
                danger
                onClick={() => handleApproval(scheduleID, "từ chối")}
              >
                Từ chối
              </Button>
            </div>
          );
        }

        if (status === "cancel" || status === "approved") {
          return <Button onClick={() => setEditingRow(scheduleID)}>Sửa</Button>;
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
          key: schedule.scheduleID,
          scheduleID: schedule.scheduleID,
          stylistFullName: schedule.stylist.fullName, // Đảm bảo tên stylist được hiển thị
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          reason: schedule.reason,
          status: schedule.status,
        }))}
        pagination={false}
      />
    </div>
  );
}

export default StylistScheduleAdmin;

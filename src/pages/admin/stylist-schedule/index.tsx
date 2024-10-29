import React, { useEffect, useState } from "react";
import { Table, Button, message, Select } from "antd";
import api from "../../../config/axios";
import moment from "moment";
import "./index.scss";

const { Option } = Select;

interface Schedule {
  id: number;
  reason: string;
  status: string;
  startTime: string;
  endTime: string;
  stylist: {
    id: number;
    image: string;
    rating: string;
    fullName?: string;
  };
}

function StylistScheduleAdmin() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedStylist, setSelectedStylist] = useState("All");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get("http://localhost:8080/api/schedules");
        const allSchedules = response.data;

        const filteredSchedules = selectedStylist === "All"
          ? allSchedules
          : allSchedules.filter(schedule => schedule.stylist.id === selectedStylist);

        setSchedules(filteredSchedules);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchSchedules();
  }, [selectedStylist]);

  // Hàm xử lý cập nhật trạng thái
  const handleApproval = async (id: number, status: string) => {
    try {
      const statusPayload = status === "chấp nhận" ? "Chấp nhận" : "Từ chối";

      await api.put(`/schedules/${id}/status`, statusPayload, {
        headers: {
          "Content-Type": "text/plain",
        },
      });

      message.success(`Lịch đã được cập nhật thành công với trạng thái: ${status}`);

      const response = await api.get("http://localhost:8080/api/schedules");
      setSchedules(response.data);
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái lịch!");
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
      dataIndex: "stylist",
      render: (stylist: any) => (
        <div>
          <img src={stylist.image} alt="stylist" style={{ width: 50, height: 50, borderRadius: "50%" }} />
          <span>{stylist.fullName || "Unknown"}</span>
        </div>
      ),
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
      render: (status: string) => <span>{status}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (schedule: Schedule) => {
        const { id, status } = schedule;

        function setEditingRow(id: number): void {
          throw new Error("Function not implemented.");
        }

        return (
          <div>
            {status === "Đang chờ xác nhận" && (
              <>
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
              </>
            )}
            {status === "Từ chối" || status === "Chấp nhận" ? (
              <Button onClick={() => setEditingRow(id)}>Sửa</Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h2>Quản lý lịch của Stylist</h2>
      <Select
        defaultValue="All"
        style={{ width: 200, marginBottom: 20 }}
        onChange={(value) => setSelectedStylist(value)}
      >
        <Option value="All">Tất cả</Option>
        {schedules.map(schedule => (
          <Option key={schedule.stylist.id} value={schedule.stylist.id}>
            {schedule.stylist.fullName || "Unknown"}
          </Option>
        ))}
      </Select>
      <Table
        columns={columns}
        dataSource={schedules.map((schedule) => ({
          key: schedule.id,
          id: schedule.id,
          stylist: schedule.stylist,
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

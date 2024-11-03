import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";

const FeedbackManagement: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState([]); // Trạng thái lưu phản hồi

  // Gọi API để lấy danh sách phản hồi
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/feedback/getAllFeedback");
        setFeedbacks(response.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi lấy phản hồi:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  // Cấu trúc cột của bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ảnh đại diện Stylist",
      key: "stylistImage",
      render: (text, record) => {
        const stylist = record.booking?.stylist; // Kiểm tra sự tồn tại của booking và stylist
        return stylist ? <img src={stylist.image} alt="Stylist" style={{ width: 50, height: 50 }} /> : null;
      },
    },
    {
      title: "Feedback",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Rating Stylist",
      dataIndex: "rating_stylist",
      key: "ratingStylist",
    },
  ];

  return (
    <div className="card">
      <h1>Quản Lý Phản Hồi</h1>
      {/* Hiển thị bảng chứa phản hồi */}
      <Table
        columns={columns}
        dataSource={feedbacks}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default FeedbackManagement;

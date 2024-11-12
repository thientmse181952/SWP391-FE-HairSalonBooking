import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";

const FeedbackManagement: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState([]); // Trạng thái lưu phản hồi
  const [accounts, setAccounts] = useState([]); // Trạng thái lưu tài khoản (stylist và customer)

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

  // Gọi API để lấy danh sách tài khoản
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/account");
        setAccounts(response.data); // Lưu danh sách tài khoản
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tài khoản:", error);
      }
    };

    fetchAccounts();
  }, []);

  // Cấu trúc cột của bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => b.id - a.id, // Sắp xếp theo ID giảm dần
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
      title: "Tên Khách Hàng",
      key: "customerName",
      render: (text, record) => {
        const customerId = record.booking?.customer?.id; // Lấy ID khách hàng từ booking
        const customer = accounts.find(account => account.customers.some(c => c.id === customerId) && account.role === "CUSTOMER"); // Tìm khách hàng dựa trên ID
        return customer ? customer.fullName : "Không có tên";
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
        pagination={{ defaultPageSize: 5 }} // Có thể chỉnh sửa số lượng phản hồi trên mỗi trang
      />
    </div>
  );
};

export default FeedbackManagement;

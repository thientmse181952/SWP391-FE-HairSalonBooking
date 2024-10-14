/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Radio,
} from "antd";
import api from "../../../config/axios"; // Sử dụng api để gọi API

const StylistAccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState([]); // Trạng thái lưu danh sách stylist
  const [loading, setLoading] = useState(true); // Trạng thái loading khi gọi API
  const [openModal, setOpenModal] = useState(false); // Trạng thái modal thêm/sửa stylist
  const [editingAccount, setEditingAccount] = useState(null); // Trạng thái chỉnh sửa stylist
  const [form] = Form.useForm(); // Sử dụng form của Ant Design

  // Gọi API để lấy danh sách stylist từ server
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get("/account"); // Gọi API lấy danh sách tài khoản stylist
        const stylists = response.data.filter(
          (account: any) => account.role === "STYLIST"
        );
        setAccounts(stylists); // Lưu dữ liệu stylist vào state
        setLoading(false); // Tắt loading sau khi lấy dữ liệu xong
      } catch (error) {
        console.error("Lỗi khi lấy danh sách stylist:", error);
      }
    };

    fetchAccounts();
  }, []);

  // Xử lý khi form được submit để thêm hoặc sửa stylist
  const onFinish = async (values: any) => {
    try {
      if (editingAccount) {
        // Nếu đang trong trạng thái chỉnh sửa, gọi API PUT
        await api.put(`/account/${editingAccount.id}`, {
          ...editingAccount,
          ...values,
        });
        message.success("Cập nhật stylist thành công!");
      } else {
        // Nếu là thêm mới, gọi API POST
        await api.post("/register", {
          ...values,
          role: "STYLIST",
          enabled: true,
        });
        message.success("Thêm stylist thành công!");
      }

      // Fetch lại danh sách ngay lập tức sau khi thêm hoặc cập nhật thành công
      const response = await api.get("/account");
      const stylists = response.data.filter(
        (account: any) => account.role === "STYLIST"
      );
      setAccounts(stylists); // Cập nhật danh sách stylist mới

      setOpenModal(false); // Đóng modal ngay lập tức sau khi API thành công
      form.resetFields(); // Reset form ngay sau khi API thành công
      setEditingAccount(null); // Reset trạng thái chỉnh sửa
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật stylist:", error);
      message.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  // Xử lý khi nhấn nút "Sửa", mở modal và điền thông tin stylist vào form
  const handleEdit = (account: any) => {
    setEditingAccount(account);
    form.setFieldsValue(account);
    setOpenModal(true);
  };

  // Xử lý khi nhấn nút "Xóa", gọi API DELETE
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/account/${id}`);
      message.success("Xóa stylist thành công!");
      // Fetch lại danh sách sau khi xóa thành công
      const response = await api.get("/account");
      const stylists = response.data.filter(
        (account: any) => account.role === "STYLIST"
      );
      setAccounts(stylists);
    } catch (error) {
      message.error("Lỗi khi xóa stylist!");
    }
  };

  // Cấu trúc cột của bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên stylist",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Hành động",
      key: "action",
      render: (account: any) => (
        <>
          <Button
            type="link"
            onClick={() => handleEdit(account)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa stylist này không?"
            onConfirm={() => handleDelete(account.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="card">
      <h1>Quản Lý Tài Khoản Stylist</h1>
      <Button type="primary" onClick={() => setOpenModal(true)}>
        Thêm Stylist
      </Button>
      {/* Hiển thị bảng chứa danh sách stylist */}
      <Table
        columns={columns}
        dataSource={accounts}
        rowKey="id"
        loading={loading}
        style={{ marginTop: 20 }}
      />
      {/* Modal thêm/sửa stylist */}
      <Modal
        title={editingAccount ? "Chỉnh sửa stylist" : "Thêm stylist mới"}
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingAccount(null); // Đặt lại trạng thái
        }}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          {/* Tên stylist */}
          <Form.Item
            label="Tên stylist"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên stylist!" }]}
          >
            <Input />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập email hợp lệ!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Số điện thoại */}
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Mật khẩu */}
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          {/* Nhập lại mật khẩu */}
          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Giới tính */}
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Radio.Group>
              <Radio value="Male">Nam</Radio>
              <Radio value="Female">Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Nút thêm/sửa */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingAccount ? "Cập nhật" : "Thêm stylist"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StylistAccountManagement;

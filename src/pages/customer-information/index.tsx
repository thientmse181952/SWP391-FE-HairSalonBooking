import React, { useState, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import api from "../../config/axios"; // Sử dụng api đã cấu hình
import "./index.scss";

interface Customer {
  fullName: string;
  phone: string;
  email: string;
}

const CustomerInformation: React.FC = () => {
  const [form] = Form.useForm();
  const [customer, setCustomer] = useState<Customer>({
    fullName: "",
    phone: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchCustomerInformation = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const loggedInPhone = localStorage.getItem("phone"); // Lấy số điện thoại đã lưu khi đăng nhập

        const response = await api.get("account", {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token để lấy thông tin tài khoản
          },
        });

        // Tìm tài khoản hiện tại dựa trên số điện thoại đã lưu khi đăng nhập
        const currentUser = response.data.find(
          (account) => account.phone === loggedInPhone
        );

        if (currentUser) {
          setCustomer({
            fullName: currentUser.fullName,
            phone: currentUser.phone,
            email: currentUser.email,
          });

          // Set giá trị form với dữ liệu người dùng hiện tại
          form.setFieldsValue({
            fullName: currentUser.fullName,
            phone: currentUser.phone,
            email: currentUser.email,
          });
        } else {
          message.error("Không tìm thấy thông tin tài khoản hiện tại!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
        message.error("Không thể tải thông tin khách hàng!");
      }
    };

    fetchCustomerInformation(); // Gọi hàm khi component được mount
  }, [form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (values: Customer) => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await api.put(
        "account",
        {
          email: values.email,
          phone: values.phone,
          fullName: values.fullName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token để cập nhật thông tin
          },
        }
      );

      if (response.status === 200) {
        message.success("Cập nhật thông tin thành công!");
        setIsEditing(false); // Quay lại trạng thái không chỉnh sửa sau khi lưu
      } else {
        message.error("Cập nhật thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin khách hàng:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  const onFinishFailed = (errorInfo: any): void => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="customer-content">
      <h1>Thông tin khách hàng</h1>
      <Form
        form={form}
        labelCol={{ span: 24 }}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        className="customer-form"
      >
        <Form.Item
          label="Tên của bạn"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
        >
          {isEditing ? <Input /> : <span>{customer.fullName}</span>}
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại của bạn!" },
            { pattern: /^[0-9]+$/, message: "Số điện thoại phải là chữ số!" },
            { len: 10, message: "Số điện thoại phải đúng 10 chữ số!" },
          ]}
        >
          {isEditing ? <Input /> : <span>{customer.phone}</span>}
        </Form.Item>

        <Form.Item
          label="Email của bạn"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email của bạn!" },
            { type: "email", message: "Vui lòng nhập địa chỉ email hợp lệ!" },
          ]}
        >
          {isEditing ? <Input /> : <span>{customer.email}</span>}
        </Form.Item>

        <Form.Item className="submit-button">
          {isEditing ? (
            <Button type="primary" htmlType="submit">
              Cập Nhật Thông Tin
            </Button>
          ) : (
            <Button type="default" onClick={handleEdit}>
              Sửa thông tin
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomerInformation;

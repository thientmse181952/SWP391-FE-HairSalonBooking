import React from "react";
import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./index.scss";
import api from "../../config/axios";

const ChangePassword: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Hàm xử lý khi hoàn thành form
  const onFinish = async (values: any): Promise<void> => {
    const { oldPassword, newPassword } = values; // Lấy giá trị từ form
    try {
      const requestData = {
        currentPassword: String(oldPassword),
        newPassword: String(newPassword),
        confirmPassword: String(newPassword),
      };

      console.log("Dữ liệu gửi đi:", requestData);

      const response = await api.put("/password", requestData);

      if (response.status === 200) {
        message.success("Đổi mật khẩu thành công!");
        navigate("/customer/information"); // Điều hướng đến trang thông tin khách hàng
      } else {
        message.error("Đổi mật khẩu thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  // Hàm xử lý khi form bị lỗi
  const onFinishFailed = (errorInfo: any): void => {
    console.log("Failed:", errorInfo);
    message.error("Đã xảy ra lỗi, vui lòng thử lại!");
  };

  return (
    <div className="customer-content">
      <h1>Đổi Mật Khẩu</h1>
      <Form
        form={form}
        labelCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="customer-form" // Thêm class cho form
      >
        <Form.Item
          label="Mật khẩu cũ"
          name="oldPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu cũ của bạn!" },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Nhập lại mật khẩu mới"
          name="confirmPassword"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Vui lòng xác nhận mật khẩu mới của bạn!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Hai mật khẩu không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item className="submit-button">
          <Button type="primary" htmlType="submit">
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;

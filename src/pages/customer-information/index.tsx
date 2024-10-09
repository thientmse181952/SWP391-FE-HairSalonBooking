import React from "react";
import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";
import "./index.scss";

const CustomerInformation: React.FC = () => {
  const [form] = useForm();

  const customerInformation = async (values: any) => {
    try {
      const response = await axios.post("http://localhost:8080/api/register", {
        email: values.email,
        phone: values.phone,
        password: values.password,
        gender: values.gender,
      });

      if (response.status === 201 || response.status === 200) {
        message.success("Cập nhật thông tin thành công!");
        window.location.href = "/login";
      } else {
        message.error("Cập nhật thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  const onFinish = (values: any): void => {
    customerInformation(values);
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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="customer-form"
      >
        <Form.Item
          label="Tên của bạn"
          name="fullname"
          rules={[{ required: false, message: "Vui lòng nhập tên của bạn!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại của bạn!",
            },
            { pattern: /^[0-9]+$/, message: "Số điện thoại phải là chữ số!" },
            { len: 10, message: "Số điện thoại phải đúng 10 chữ số!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email của bạn"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email của bạn!" },
            { type: "email", message: "Vui lòng nhập địa chỉ email hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật Khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item className="submit-button">
          <Button type="primary" htmlType="submit">
            Cập Nhật Thông Tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomerInformation;

import React from "react";
import { Button, Form, Input, message } from "antd";
import AuthenTemplate from "../../components/authen-template";
import { useForm } from "antd/lib/form/Form";
import "./index.scss";

const ChangePassword: React.FC = () => {
  const [form] = useForm();

  // Hàm xử lý khi hoàn thành form
  const onFinish = (values: any): void => {
    console.log("Success:", values);
    // Thêm logic để xử lý khi người dùng thay đổi mật khẩu
    message.success("Đổi mật khẩu thành công!");
  };

  // Hàm xử lý khi form bị lỗi
  const onFinishFailed = (errorInfo: any): void => {
    console.log("Failed:", errorInfo);
    message.error("Đã xảy ra lỗi, vui lòng thử lại!");
  };

  return (
    <AuthenTemplate>
      <h1>Đổi Mật Khẩu</h1>
      <Form
        form={form}
        labelCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
    </AuthenTemplate>
  );
};

export default ChangePassword;

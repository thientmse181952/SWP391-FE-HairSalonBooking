import React from "react";
import { Button, Form, Input, message } from "antd";
import AuthenTemplate from "../../components/authen-template";
import { useForm } from "antd/lib/form/Form"; // Thêm hook này để tạo form instance
import { RuleObject } from "rc-field-form/lib/interface"; // Kiểu cho custom validator
import { Store } from "antd/lib/form/interface"; // Kiểu cho giá trị form
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import axios from "axios"; // Import axios
import "./index.scss";

const ResetPassword: React.FC = () => {
  const [form] = useForm(); // Khởi tạo form

  // Hàm gửi yêu cầu đăng ký
  const resetPassword = async (values: Store) => {
    try {
      const response = await axios.post("http://localhost:8080/api/register", {
        // fullname: values.fullname,
        email: values.email,
        phone: values.phone,

        password: values.password,
        gender: values.gender,
      });

      // Kiểm tra phản hồi API
      if (response.status === 201 || response.status === 200) {
        message.success("Đăng ký thành công!");
        // Chuyển hướng đến trang đăng nhập hoặc trang chính
        window.location.href = "/login";
      } else {
        message.error("Đăng ký thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đăng ký:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  const onFinish = (values: Store): void => {
    console.log("Success:", values);
    resetPassword(values); // Gọi hàm đăng ký sau khi form hợp lệ
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity): void => {
    console.log("Failed:", errorInfo);
  };

  return (
    <AuthenTemplate>
      <h1>Lấy Lại Mật Khẩu</h1>
      <Form
        form={form}
        labelCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại của bạn!" },
            { pattern: /^[0-9]+$/, message: "Số điện thoại phải là chữ số!" },
            { len: 10, message: "Số điện thoại phải đúng 10 chữ số!" },
          ]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item
          label="Tên của bạn"
          name="fullname"
          rules={[{ required: false, message: "Vui lòng nhập tên của bạn!" }]}
        >
          <Input />
        </Form.Item> */}

        <Form.Item
          label="Nhập Mã OTP"
          name="OTP"
          rules={[
            { required: true, message: "Vui lòng nhập mã OTP đã gửi !" },
            { pattern: /^[0-9]+$/, message: "OTP gửi qua số điện thoại là 6 chữ số!" },
            { len: 6, message: "OTP nhập sai, vui lòng thử lại" },
          ]}
        >
          <Input />
        </Form.Item>

        

        <Form.Item
          label="Mật Khẩu Mới"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Nhập lại mật khẩu"
          name="rePassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu của bạn!" },
            ({ getFieldValue }) => ({
              validator(_: RuleObject, value: string) {
                if (!value || getFieldValue("password") === value) {
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

export default ResetPassword;

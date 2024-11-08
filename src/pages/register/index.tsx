import React, { useState } from "react";
import { Button, Form, Input, Checkbox, Radio, message } from "antd";
import AuthenTemplate from "../../components/authen-template";
import { useForm } from "antd/lib/form/Form";
import { RuleObject } from "rc-field-form/lib/interface";
import { Store } from "antd/lib/form/interface";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import Loading from "../../components/loading";

const Register: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Hàm gửi yêu cầu đăng ký
  const registerUser = async (values: Store) => {
    setLoading(true); // Bắt đầu hiệu ứng loading
    try {
      const registerResponse = await api.post("/register", {
        fullName: values.fullname,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: "CUSTOMER",
        gender: values.gender,
      });

      if (registerResponse.status === 201 || registerResponse.status === 200) {
        message.success("Đăng ký thành công!");
        navigate("/login");
      } else {
        message.error("Đăng ký thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đăng ký:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    } finally {
      setLoading(false); // Kết thúc hiệu ứng loading
    }
  };

  const onFinish = (values: Store): void => {
    console.log("Success:", values);
    registerUser(values);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity): void => {
    console.log("Failed:", errorInfo);
  };

  return (
    <AuthenTemplate>
      <h1>Đăng ký</h1>
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

        <Form.Item
          label="Tên của bạn"
          name="fullname"
          rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
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
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Radio.Group>
            <Radio value="Male">Nam</Radio>
            <Radio value="Female">Nữ</Radio>
          </Radio.Group>
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

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Vui lòng đồng ý với điều khoản")),
            },
          ]}
        >
          <Checkbox>
            Tôi đồng ý với điều khoản và điều kiện của KimHair
          </Checkbox>
        </Form.Item>

        <Form.Item className="submit-button">
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo tài khoản
          </Button>
        </Form.Item>

        <Form.Item className="login-link">
          <span onClick={() => navigate("/login")}>
            Đã có tài khoản? Đăng nhập
          </span>
        </Form.Item>
      </Form>

      {loading && <Loading />} {/* Sử dụng component Loading */}
    </AuthenTemplate>
  );
};

export default Register;

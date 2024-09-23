import React from "react";
import { Button, Form, Input } from "antd";
import AuthenTemplate from "../../components/authen-template";
import { useForm } from "antd/lib/form/Form"; // Thêm hook này để tạo form instance
import { RuleObject } from "rc-field-form/lib/interface"; // Kiểu cho custom validator
import { Store } from "antd/lib/form/interface"; // Kiểu cho giá trị form
import { ValidateErrorEntity } from "rc-field-form/lib/interface"; 

const Register: React.FC = () => {
  const [form] = useForm(); // Khởi tạo form

  const onFinish = (values: Store): void => {
    console.log("Success:", values);
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
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Please input your username!" },
            { min: 3, message: "Username must be at least 3 characters long!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters long!" },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Re-Password"
          name="rePassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_: RuleObject, value: string) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Fullname"
          name="fullname"
          rules={[{ required: true, message: "Please input your fullname!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
            { pattern: /^[0-9]+$/, message: "Phone number must be numeric!" },
            { len: 10, message: "Phone number must be exactly 10 digits!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: false, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </AuthenTemplate>
  );
};

export default Register;

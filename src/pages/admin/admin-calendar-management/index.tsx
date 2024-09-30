import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/lib/form/Form"; 
import { RuleObject } from "rc-field-form/lib/interface"; 
import { Store } from "antd/lib/form/interface"; 
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import axios from "axios"; 
import { Outlet } from "react-router-dom"; // Import Outlet

const AdminCalendarManagement: React.FC = () => {
  const [form] = useForm();

  const fetchAdminInfo = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin-info"); 
      if (response.status === 200) {
        form.setFieldsValue({
          fullname: response.data.fullname,
          phone: response.data.phone,
          email: response.data.email,
        });
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi lấy thông tin admin:", error);
      message.error("Không thể lấy thông tin, vui lòng thử lại sau!");
    }
  };

  const updateUser = async (values: Store) => {
    try {
      const response = await axios.put(
        "http://localhost:8080/api/update-admin",
        {
          fullname: values.fullname,
          email: values.email,
          phone: values.phone,
          password: values.password,
        }
      );

      if (response.status === 200) {
        message.success("Cập nhật thành công!");
      } else {
        message.error("Cập nhật thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi cập nhật thông tin:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  const onFinish = (values: Store): void => {
    console.log("Success:", values);
    updateUser(values);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity): void => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  return (
    <div className="card"> {/* Thêm lớp card ở đây */}
      <Form
        form={form}
        labelCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <h1>calendar management</h1>
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
            { required: true, message: "Vui lòng nhập số điện thoại của bạn!" },
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
            { required: false, message: "Vui lòng nhập email của bạn!" },
            { type: "email", message: "Vui lòng nhập địa chỉ email hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật Khẩu"
          name="password"
          rules={[
            { required: false, message: "Vui lòng nhập mật khẩu của bạn!" },
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
            { required: false, message: "Vui lòng xác nhận mật khẩu của bạn!" },
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
            Cập Nhật
          </Button>
        </Form.Item>
      </Form>
      
      {/* Thêm Outlet ở đây */}
      <Outlet />
    </div>
  );
};

export default AdminCalendarManagement;

import React from "react";
import { Button, Form, Input, Checkbox, Radio, message } from "antd";
import { useForm } from "antd/lib/form/Form"; // Thêm hook này để tạo form instance
import { RuleObject } from "rc-field-form/lib/interface"; // Kiểu cho custom validator
import { Store } from "antd/lib/form/interface"; // Kiểu cho giá trị form
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import axios from "axios"; // Import axios
import "./index.scss";
import { useNavigate } from "react-router-dom";

const AdminSelection: React.FC = () => {
  const [form] = useForm(); // Khởi tạo form\
  const navigate = useNavigate();

  // Hàm gửi yêu cầu đăng ký
  const AdminSelectionUser = async (values: Store) => {
    try {
      const response = await axios.post("http://localhost:8080/api/AdminSelection", {
        id: values.Id,
        category: values.category,
        Image: values.Image,
        
      });

      // Kiểm tra phản hồi API
      if (response.status === 201 || response.status === 200) {
        message.success("Đăng ký thành công!");
        // Chuyển hướng đến trang đăng nhập hoặc trang chính
        navigate("/login");
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
    AdminSelectionUser(values); // Gọi hàm đăng ký sau khi form hợp lệ
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity): void => {
    console.log("Failed:", errorInfo);
  };

  return (
      
      <Form
        form={form}
        labelCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        
        <Form.Item
          label="Id"
          name="id"
          rules={[
            { required: true, message: "Vui lòng nhập id!" },
            { pattern: /^[0-9]+$/, message: "id phải là chữ số!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="phân loại của bạn"
          name="category"
          rules={[{ required: true, message: "Vui lòng nhập phân loại của ảnh!" }]}
        >
          <Input />
        </Form.Item>

        
        <Form.Item className="submit-button">
          <Button type="primary" htmlType="submit">
            Tạo tài khoản
          </Button>
        </Form.Item>

        <Form.Item className="login-link">
          <span onClick={() => navigate("/login")}>
            Đã có tài khoản? Đăng nhập
          </span>
        </Form.Item>
      </Form>
  );
};

export default AdminSelection;

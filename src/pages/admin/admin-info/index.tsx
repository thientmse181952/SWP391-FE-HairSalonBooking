import React, { useState, useEffect } from "react"; // Thêm useEffect
import { Form, Input, Button } from "antd";
import api from "../../../config/axios";

interface Stylist {
  name: string;
  age: number;
  phone: string;
  avatarUrl: string;
  role: string;
  password: string;
  confirmPassword: string;
  email: string; // Thêm email vào kiểu dữ liệu
}

const AdminInfo: React.FC = () => {
  const [stylist, setStylist] = useState<Stylist>({
    name: "",
    age: 0, // Đổi thành 0 cho kiểu number
    phone: "",
    avatarUrl: "",
    role: "",
    password: "",
    confirmPassword: "",
    email: "", // Khởi tạo email
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await api.get("account", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const adminData = response.data.find(
          (account) => account.role === "MANAGER"
        ); // Lọc account với role "MANAGER"

        if (adminData) {
          setStylist({
            name: adminData.fullName,
            age: adminData.age, // Cập nhật tuổi
            phone: adminData.phone,
            avatarUrl: adminData.avatarUrl || "", // Nếu có
            role: adminData.role || "", // Nếu có
            password: "",
            confirmPassword: "",
            email: adminData.email, // Cập nhật email
          });
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };

    fetchAdminInfo(); // Gọi hàm khi component được mount
  }, []);

  const handleChange = (changedValues: any) => {
    setStylist((prev) => ({ ...prev, ...changedValues }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = (values: Stylist) => {
    if (values.password !== values.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    console.log("Cập nhật stylist:", values);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity): void => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h1>Thông tin Admin</h1>
      <br />
      <Form
        layout="vertical"
        initialValues={stylist}
        onValuesChange={handleChange}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          {isEditing ? <Input /> : <span>{stylist.name}</span>}
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          {isEditing ? <Input /> : <span>{stylist.email}</span>}
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          {isEditing ? <Input /> : <span>{stylist.phone}</span>}
        </Form.Item>

        {isEditing && (
          <>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}

        <Form.Item>
          {isEditing ? (
            <Button type="primary" htmlType="submit">
              Lưu thông tin
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

export default AdminInfo;

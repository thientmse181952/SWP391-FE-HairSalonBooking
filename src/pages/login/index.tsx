import React, { useState } from "react";
import { Button, Input, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // Sử dụng UserContext để lưu trạng thái
import api from "../../config/axios";
import Loading from "../../components/loading"; // Import component Loading
import "./index.scss"; // Thêm file CSS cho Login

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUser } = useUser(); // Dùng setUser để lưu thông tin người dùng vào UserContext
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      console.log("Đang đăng nhập với:", values);

      const response = await api.post("login", {
        username: values.username,
        password: values.password,
      });

      console.log("Kết quả đăng nhập:", response.data);

      if (response.status === 200) {
        const { token, fullName } = response.data;
        const phone = values.username; // Sử dụng số điện thoại (username) để tìm tài khoản

        // Kiểm tra xem token có được trả về hay không
        if (!token) {
          throw new Error("Không có token từ API!");
        }

        // Lưu thông tin vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("phone", phone);

        // Lấy tất cả thông tin tài khoản
        const accountResponse = await api.get("account", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Tất cả tài khoản từ API:", accountResponse.data);

        // Duyệt qua tất cả các tài khoản để tìm tài khoản hiện tại dựa trên số điện thoại
        const currentUser = accountResponse.data.find((user: any) => user.phone === phone);

        if (currentUser) {
          // Cập nhật thông tin người dùng vào UserContext và lưu accountId
          setUser({
            id: currentUser.id,
            role: currentUser.role,
            name: currentUser.fullName,
            token: token,
          });

          localStorage.setItem("accountId", currentUser.id);

          // Kiểm tra vai trò và xử lý tương ứng
          if (currentUser.role === "CUSTOMER") {
            await handleCustomerLogin(currentUser, token);
          } else if (currentUser.role === "STYLIST") {
            await handleStylistLogin(currentUser, token);
          } else if (currentUser.role === "MANAGER") {
            message.success("Đăng nhập thành công!");
            navigate("/adminpage/adminInfo");
          } else {
            console.log("Điều hướng đến trang chủ");
            navigate("/");
          }
        } else {
          message.error("Không tìm thấy tài khoản người dùng hiện tại!");
        }
      } else {
        message.error("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        if (error.response.data === "Username or password invalid!") {
          message.error("Tài khoản hoặc mật khẩu sai.");
        }
      } else {
        message.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: { username: string; password: string }) => {
    handleLogin(values);
  };

  return (
    <div className="authen-template">
      {loading ? (
        <Loading /> // Hiển thị component Loading khi đang loading
      ) : (
        <div className="authen-template__form">
          <h1 className="title">Đăng nhập</h1>
          <Form
            form={form}
            labelCol={{ span: 24 }}
            className="form"
            onFinish={onFinish}
          >
            <Form.Item
              label="Số điện thoại"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" className="login-button" htmlType="submit" loading={loading}>
                Đăng nhập
              </Button>
            </Form.Item>

            <Form.Item className="register-link">
              <span onClick={() => navigate("/register")}>
                Chưa có tài khoản? Đăng ký tại đây
              </span>
            </Form.Item>

            <Form.Item className="forgot-password-link">
              <span onClick={() => navigate("/reset-password")}>
                Quên mật khẩu?
              </span>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Login;

import React from "react";
import { Button, Input, Form, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axios from "axios";
import "./index.scss";
import { googleProvider } from "../../config/firebase.ts";

import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        username: values.username,
        password: values.password,
      });

      if (response.status === 200) {
        message.success("Đăng nhập thành công!");

        // Lấy token và fullName từ response
        const token = response.data.token;
        const fullName = response.data.fullName;
        const email = response.data.email; // Giả sử email của người dùng hiện tại cũng được trả về

        // Lưu token và fullName vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("fullName", fullName);

        // Lưu thông tin tài khoản vào localStorage
        localStorage.setItem("userData", JSON.stringify(response.data));

        // Gọi API /api/account để lấy tất cả thông tin tài khoản
        try {
          const accountResponse = await axios.get(
            "http://localhost:8080/api/account",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Duyệt qua tất cả các tài khoản để tìm tài khoản hiện tại dựa trên email
          const currentUser = accountResponse.data.find(
            (user) => user.email === email // So sánh email từ response với danh sách tài khoản
          );

          if (currentUser) {
            // Kiểm tra vai trò của tài khoản hiện tại
            if (currentUser.role === "MANAGER") {
              navigate("/adminpage");
            } else {
              navigate("/");
            }
          } else {
            message.error("Không tìm thấy tài khoản người dùng hiện tại!");
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin tài khoản:", error);
          message.error("Đã xảy ra lỗi khi lấy thông tin tài khoản!");
        }
      } else {
        message.error("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  const handleLoginGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // Nhận token từ Google
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        // Lưu token và fullName vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("fullName", user.displayName);

        // Chuyển hướng người dùng đến trang chủ hoặc trang chính
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFinish = (values: { username: string; password: string }) => {
    handleLogin(values);
  };

  return (
    <div className="authen-template">
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
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
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
            <Button type="primary" className="login-button" htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>

          <Form.Item className="google-button">
            <Button
              icon={<GoogleOutlined />}
              className="google-btn"
              onClick={handleLoginGoogle}
            >
              Đăng nhập bằng Google
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
    </div>
  );
};

export default Login;

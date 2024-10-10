import React from "react";
import { Button, Input, Form, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axios from "axios";
import "./index.scss";
import { googleProvider } from "../../config/firebase.ts";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useUser } from "../../context/UserContext"; // Sử dụng UserContext để lưu trạng thái

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUser } = useUser(); // Dùng setUser để lưu thông tin người dùng vào UserContext

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      console.log("Đang đăng nhập với:", values); // Log thông tin đăng nhập

      const response = await axios.post("http://localhost:8080/api/login", {
        username: values.username,
        password: values.password,
      });

      console.log("Kết quả đăng nhập:", response.data); // Log kết quả từ API đăng nhập

      if (response.status === 200) {
        message.success("Đăng nhập thành công!");

        // Lấy token, fullName và số điện thoại từ response
        const token = response.data.token;
        const fullName = response.data.fullName;
        const phone = values.username; // Sử dụng số điện thoại (username) để tìm tài khoản

        console.log("Token và số điện thoại:", { token, phone }); // Log token và số điện thoại

        // Kiểm tra xem token có được trả về hay không
        if (!token) {
          throw new Error("Không có token từ API!");
        }

        // Lưu token và fullName vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("phone", phone);

        // Gọi API /api/account để lấy tất cả thông tin tài khoản
        try {
          const accountResponse = await axios.get(
            "http://localhost:8080/api/account",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Sử dụng token để lấy thông tin tài khoản
              },
            }
          );

          console.log("Tất cả tài khoản từ API:", accountResponse.data); // Log tất cả tài khoản

          // Duyệt qua tất cả các tài khoản để tìm tài khoản hiện tại dựa trên số điện thoại
          const currentUser = accountResponse.data.find(
            (user) => user.phone === phone // So sánh số điện thoại từ response với danh sách tài khoản
          );

          console.log("Tài khoản hiện tại:", currentUser); // Log tài khoản hiện tại

          if (currentUser) {
            // Cập nhật thông tin người dùng vào UserContext
            setUser({
              role: currentUser.role, // Cập nhật role từ danh sách tài khoản
              name: currentUser.fullName,
              token: token,
            });

            // Kiểm tra vai trò của tài khoản hiện tại
            if (currentUser.role === "MANAGER") {
              console.log("Điều hướng đến trang admin");
              navigate("/adminpage");
            } else {
              console.log("Điều hướng đến trang chủ");
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

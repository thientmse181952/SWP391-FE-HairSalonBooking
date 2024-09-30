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

        // Lưu thông tin tài khoản vào localStorage
        localStorage.setItem("userData", JSON.stringify(response.data));

        // Chuyển hướng người dùng đến trang chủ hoặc trang chính
        navigate("/");
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
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
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
        </Form>
      </div>
    </div>
  );
};

export default Login;

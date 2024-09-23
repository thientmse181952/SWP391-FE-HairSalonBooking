import React from "react";
import Form from "antd/es/form/Form";
import AuthenTemplate from "../../components/authen-template";
import { Button, Input } from "antd";
import { getAuth, signInWithPopup, GoogleAuthProvider, UserCredential } from "firebase/auth";
import { GoogleOutlined } from "@ant-design/icons";
import './index.scss';

const Login: React.FC = () => {
  const handleLoginGoogle = async (): Promise<void> => {
    const auth = getAuth();
    try {
      const result: UserCredential = await signInWithPopup(auth, GoogleAuthProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      console.log(user);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error("Error during Google login:", errorMessage);
    }
  };

  const handleLogin = (): void => {
    // Logic for regular login
  };

  return (
    <AuthenTemplate>
      <h1 className="title">Đăng nhập</h1>
      <Form
        labelCol={{
          span: 24,
        }}
        className="form"
      >
        <Form.Item label="Tên đăng nhập" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="Mật khẩu" name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" className="login-button" onClick={handleLogin}>
            Đăng nhập
          </Button>
        </Form.Item>

        <Form.Item className="google-button">
          <Button onClick={handleLoginGoogle} icon={<GoogleOutlined />} className="google-btn">
            Đăng nhập bằng Google
          </Button>
        </Form.Item>
      </Form>
    </AuthenTemplate>
  );
};

export default Login;

import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import AuthenTemplate from "../../components/authen-template";
import { useForm } from "antd/lib/form/Form";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import "./index.scss";

const ResetPassword: React.FC = () => {
  const [form] = useForm();
  const [otpSent, setOtpSent] = useState(false); // State để theo dõi tình trạng gửi OTP
  const [sendingOtp, setSendingOtp] = useState(false); // Để theo dõi trạng thái gửi mã
  const [verificationId, setVerificationId] = useState<string | null>(null); // Để lưu verificationId

  const auth = getAuth();

  // Hàm thiết lập Recaptcha
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible", // Hiển thị Recaptcha vô hình
          callback: (response: any) => {
            console.log("Recaptcha resolved");
          },
        },
        auth
      );
    }
  };

  // Hàm gửi mã OTP qua Firebase
  const sendOTP = async (phone: string) => {
    setupRecaptcha(); // Thiết lập recaptcha trước khi gửi OTP
    const appVerifier = window.recaptchaVerifier;
    try {
      setSendingOtp(true); // Bắt đầu trạng thái đang gửi mã OTP
      const formattedPhone = `+84${phone.slice(1)}`; // Định dạng lại số điện thoại cho Firebase (thêm mã quốc gia)
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      setVerificationId(confirmationResult.verificationId); // Lưu verificationId để sử dụng cho việc xác minh OTP
      setOtpSent(true);
      message.success("Mã OTP đã được gửi!");
    } catch (error) {
      console.error("Lỗi khi gửi mã OTP:", error);
      message.error("Đã xảy ra lỗi khi gửi mã OTP!");
    } finally {
      setSendingOtp(false); // Kết thúc trạng thái gửi mã OTP
    }
  };

  const onFinish = (values: any): void => {
    console.log("Success:", values);
    // Thêm logic để xử lý khi người dùng xác nhận OTP và đặt lại mật khẩu
  };

  return (
    <AuthenTemplate>
      <h1>Lấy Lại Mật Khẩu</h1>
      <Form form={form} labelCol={{ span: 24 }} onFinish={onFinish}>
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
          label="Nhập Mã OTP"
          name="OTP"
          rules={[
            { required: true, message: "Vui lòng nhập mã OTP đã gửi!" },
            { pattern: /^[0-9]+$/, message: "OTP phải là số!" },
            { len: 6, message: "OTP phải có đúng 6 chữ số!" },
          ]}
        >
          <Input
            addonAfter={
              <Button
                type="link"
                disabled={otpSent || sendingOtp}
                onClick={() => {
                  const phone = form.getFieldValue("phone");
                  if (phone) {
                    sendOTP(phone); // Gọi hàm gửi OTP khi nhấn vào nút "Gửi mã"
                  } else {
                    message.error(
                      "Vui lòng nhập số điện thoại trước khi gửi OTP!"
                    );
                  }
                }}
              >
                {sendingOtp ? "Đang gửi..." : "Gửi mã"}
              </Button>
            }
          />
        </Form.Item>

        <Form.Item
          label="Mật Khẩu Mới"
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
              validator(_, value) {
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
            Xác nhận
          </Button>
        </Form.Item>

        {/* Recaptcha container */}
        <div id="recaptcha-container"></div>
      </Form>
    </AuthenTemplate>
  );
};

export default ResetPassword;

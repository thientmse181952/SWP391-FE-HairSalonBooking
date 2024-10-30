import React from "react";
import { Button, Input, Form, message } from "antd";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // Sử dụng UserContext để lưu trạng thái
import api from "../../config/axios.ts";

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUser } = useUser(); // Dùng setUser để lưu thông tin người dùng vào UserContext

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      console.log("Đang đăng nhập với:", values);

      // Gọi API đăng nhập
      const response = await api.post("login", {
        username: values.username,
        password: values.password,
      });

      console.log("Kết quả đăng nhập:", response.data);

      if (response.status === 200) {
        message.success("Đăng nhập thành công!");

        // Lấy token, fullName và số điện thoại từ response
        const token = response.data.token;
        const fullName = response.data.fullName;
        const phone = values.username; // Sử dụng số điện thoại (username) để tìm tài khoản

        console.log("Token và số điện thoại:", { token, phone });

        // Kiểm tra xem token có được trả về hay không
        if (!token) {
          throw new Error("Không có token từ API!");
        }

        // Lưu token và thông tin vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("phone", phone);

        // Gọi API /api/account để lấy tất cả thông tin tài khoản
        try {
          const accountResponse = await api.get("account", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Tất cả tài khoản từ API:", accountResponse.data);

          // Duyệt qua tất cả các tài khoản để tìm tài khoản hiện tại dựa trên số điện thoại
          const currentUser = accountResponse.data.find(
            (user) => user.phone === phone
          );

          console.log("Tài khoản hiện tại:", currentUser);

          if (currentUser) {
            // Cập nhật thông tin người dùng vào UserContext và lưu accountId
            setUser({
              id: currentUser.id, // Lưu accountId
              role: currentUser.role,
              name: currentUser.fullName,
              token: token,
            });

            // Lưu accountId vào localStorage
            localStorage.setItem("accountId", currentUser.id); // Lưu accountId vào localStorage

            // Nếu role là CUSTOMER thì kiểm tra và gọi API tạo thông tin khách hàng nếu cần
            if (currentUser.role === "CUSTOMER") {
              // Gọi API /api/{accountId} để kiểm tra thông tin khách hàng
              const accountDetails = await api.get(`/${currentUser.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              // Kiểm tra xem "customers" có trống hay không
              if (accountDetails.data.customers.length === 0) {
                // Gọi API POST /customer nếu "customers" trống
                const customerResponse = await api.post(
                  "/customer",
                  { id: 0 },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (
                  customerResponse.status === 201 ||
                  customerResponse.status === 200
                ) {
                  message.success("Tạo thông tin khách hàng thành công!");

                  // Lưu customerId vào localStorage
                  localStorage.setItem("customerId", customerResponse.data.id);
                  console.log(
                    "Customer ID đã được tạo và lưu:",
                    customerResponse.data.id
                  );
                } else {
                  message.error("Tạo thông tin khách hàng thất bại!");
                }
              } else {
                // Nếu đã có customerId thì lưu vào localStorage
                const customerId = accountDetails.data.customers[0]?.id;
                if (customerId) {
                  localStorage.setItem("customerId", customerId);
                  console.log(
                    "Customer ID đã tồn tại và được lưu:",
                    customerId
                  );
                } else {
                  console.error("Không tìm thấy customerId.");
                }
              }

              console.log("Điều hướng đến trang chủ");
              navigate("/");
            }

            // Nếu role là STYLIST, kiểm tra thông tin stylist
            // After checking the role of the current user is "STYLIST"
            if (currentUser.role === "STYLIST") {
              // Kiểm tra nếu stylists array tồn tại và stylist đã có ID
              if (currentUser.stylists.length > 0) {
                const stylistId = currentUser.stylists[0].id;
                localStorage.setItem("stylistId", stylistId); // Lưu stylistId vào localStorage
                console.log("Stylist ID saved to localStorage:", stylistId);
              } else {
                // Nếu không có stylist nào tồn tại, gọi API tạo stylist mới
                const newStylist = {
                  rating: "",
                  image: "",
                  service_id: [],
                };

                try {
                  const stylistResponse = await api.post(
                    "/stylist",
                    newStylist,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  if (
                    stylistResponse.status === 201 ||
                    stylistResponse.status === 200
                  ) {
                    const newStylistId = stylistResponse.data.id;
                    localStorage.setItem("stylistId", newStylistId);
                    console.log(
                      "New Stylist ID created and saved:",
                      newStylistId
                    );
                  } else {
                    console.error("Lỗi khi tạo stylist mới:", stylistResponse);
                    message.error("Không thể tạo stylist mới.");
                  }
                } catch (error) {
                  console.error("Lỗi khi gọi API tạo stylist mới:", error);
                  message.error("Có lỗi khi tạo stylist.");
                }
              }
              navigate("/stylistpage/stylistInfo");
            } else if (currentUser.role === "MANAGER") {
              console.log("Điều hướng đến trang admin");
              navigate("/adminpage/adminInfo");
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

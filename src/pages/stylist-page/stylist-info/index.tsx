import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Col, Row, Select } from "antd";
import api from "../../../config/axios";
import { useUser } from "../../../context/UserContext";

interface Service {
  id: number;
  name: string;
}

interface Stylist {
  id: number;
  fullName: string;
  gender: string;
  email: string;
  phone: string;
  image: string;
  rating: string;
  service_id: number[];
}

const StylistInfo: React.FC = () => {
  const { user } = useUser(); // Lấy thông tin người dùng từ UserContext
  const [stylist, setStylist] = useState<Stylist | null>(null);
  const [services, setServices] = useState<Service[]>([]); // Danh sách dịch vụ
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Lấy danh sách dịch vụ từ API
        const responseServices = await api.get("service/getService");
        setServices(responseServices.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error.message);
        message.error("Lỗi khi lấy danh sách dịch vụ: " + error.message);
      }
    };

    const fetchStylist = async () => {
      try {
        // Bước 1: Lấy thông tin từ bảng account
        const responseAccount = await api.get("account"); // Không cần /api/

        const currentUser = responseAccount.data.find(
          (account) => account.fullName === user.name
        );

        if (currentUser) {
          const accountId = currentUser.id;

          // Kiểm tra nếu stylist có tồn tại trong tài khoản
          if (currentUser.stylists && currentUser.stylists.length > 0) {
            const stylistData = currentUser.stylists[0]; // Lấy stylist đầu tiên (hoặc bạn có thể điều chỉnh logic)

            setStylist({
              id: currentUser.id,
              fullName: currentUser.fullName,
              gender: currentUser.gender || "",
              email: currentUser.email || "",
              phone: currentUser.phone || "",
              image: stylistData.image || "", // Lấy từ stylist
              rating: stylistData.rating || "", // Lấy từ stylist
              service_id: stylistData.service_id || [], // Nếu có service_id
            });

            // Set giá trị cho form
            form.setFieldsValue({
              fullName: currentUser.fullName,
              gender: currentUser.gender || "",
              email: currentUser.email || "",
              phone: currentUser.phone || "",
              image: stylistData.image || "",
              rating: stylistData.rating || "",
              service_id: stylistData.service_id || [],
            });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin stylist:", error.message);
        message.error("Lỗi khi lấy thông tin stylist: " + error.message);
      }
    };

    fetchServices(); // Gọi hàm lấy dịch vụ
    fetchStylist(); // Gọi hàm lấy stylist
  }, [user, form]);

  const onFinish = async (values: Stylist) => {
    try {
      const accountId = stylist?.id; // Lấy account ID từ stylist

      // PUT request để cập nhật thông tin từ bảng account
      if (accountId) {
        const putResponse = await api.put(
          `${accountId}`, // Không cần thêm /api/
          {
            fullName: values.fullName,
            email: values.email,
            gender: values.gender,
          }
        );

        // POST request để cập nhật thêm image và service_id vào bảng stylist
        const postResponse = await api.post(
          "stylist", // Không cần thêm /api/
          {
            image: values.image, // Dữ liệu image từ form
            rating: values.rating, // Dữ liệu rating từ form
            service_id: values.service_id, // Dữ liệu service_id từ form
          }
        );

        if (putResponse.status === 200 && postResponse.status === 200) {
          message.success("Cập nhật thông tin stylist thành công!");
          // Cập nhật lại thông tin stylist sau khi lưu
          setStylist({
            ...stylist,
            fullName: values.fullName,
            phone: stylist.phone, // Giữ nguyên số điện thoại
            email: values.email,
            gender: values.gender,
            image: values.image,
            rating: values.rating,
            service_id: values.service_id,
          });
        } else {
          message.error("Cập nhật thất bại, vui lòng thử lại!");
        }
      } else {
        message.error("Không thể xác định ID tài khoản!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin tài khoản:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang tải dữ liệu
  }

  return (
    <Row gutter={16}>
      <Col span={24}>
        <h1>Thông Tin Stylist</h1>
        {stylist && (
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              label="Tên của bạn"
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập tên của bạn!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại của bạn!",
                },
                {
                  pattern: /^[0-9]+$/,
                  message: "Số điện thoại phải là chữ số!",
                },
                { len: 10, message: "Số điện thoại phải đúng 10 chữ số!" },
              ]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Email của bạn"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email của bạn!" },
                {
                  type: "email",
                  message: "Vui lòng nhập địa chỉ email hợp lệ!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Giới tính của bạn"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select>
                <Select.Option value="Male">Nam</Select.Option>
                <Select.Option value="Female">Nữ</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Hình ảnh"
              name="image"
              rules={[{ required: true, message: "Vui lòng nhập hình ảnh!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: "Vui lòng nhập đánh giá!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Dịch vụ"
              name="service_id"
              rules={[{ required: true, message: "Vui lòng chọn dịch vụ!" }]}
            >
              <Select mode="multiple" placeholder="Chọn dịch vụ">
                {services.map((service) => (
                  <Select.Option key={service.id} value={service.id}>
                    {service.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cập Nhật Thông Tin
              </Button>
            </Form.Item>
          </Form>
        )}
      </Col>
    </Row>
  );
};

export default StylistInfo;

import React, { useEffect, useState } from "react";
import { Form, Input, message, Col, Row, Select, Button } from "antd";
import api from "../../../config/axios";

interface Service {
  id: number;
  name: string;
  stylists: { id: number }[];
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
  const [stylist, setStylist] = useState<Stylist | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]); // Toàn bộ dịch vụ
  const [filteredServices, setFilteredServices] = useState<number[]>([]); // ID của dịch vụ stylist đã làm
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false); // Điều khiển trạng thái editable
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchAccountAndServices = async () => {
      try {
        const accountId = localStorage.getItem("accountId");

        if (!accountId) {
          throw new Error("Không tìm thấy accountId.");
        }

        const responseAccount = await api.get(`/${accountId}`);
        console.log("Current User Data:", responseAccount.data);

        const currentUser = responseAccount.data;

        if (currentUser && currentUser.role === "STYLIST") {
          const stylistID = currentUser.stylists[0].id;

          // Gọi API để lấy toàn bộ dịch vụ
          const responseAllServices = await api.get("/service/getService");
          setAllServices(responseAllServices.data);

          // Lọc những dịch vụ stylist đã làm
          const servicesForStylist = responseAllServices.data.filter(
            (service: Service) =>
              service.stylists.some((stylist) => stylist.id === stylistID)
          );

          // Lưu ID của các dịch vụ mà stylist đã làm
          const selectedServiceIds = servicesForStylist.map(
            (service) => service.id
          );

          setFilteredServices(selectedServiceIds);

          form.setFieldsValue({
            fullName: currentUser.fullName,
            gender: currentUser.gender || "",
            email: currentUser.email || "",
            phone: currentUser.phone || "",
            image: currentUser.stylists[0].image || "",
            rating: currentUser.stylists[0].rating || "",
            service_id: selectedServiceIds,
          });

          setStylist({
            id: currentUser.id,
            fullName: currentUser.fullName,
            gender: currentUser.gender || "",
            email: currentUser.email || "",
            phone: currentUser.phone || "",
            image: currentUser.stylists[0].image || "",
            rating: currentUser.stylists[0].rating || "",
            service_id: selectedServiceIds,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin tài khoản và dịch vụ:",
          error.message
        );
        message.error(
          "Lỗi khi lấy thông tin tài khoản và dịch vụ: " + error.message
        );
      }
    };

    fetchAccountAndServices();
  }, [form]);

  const handleEditClick = () => {
    setEditable(true); // Chỉ kích hoạt chỉnh sửa, không gửi API
  };

  const onFinish = async (values: Stylist) => {
    try {
      const accountId = stylist?.id;
      const stylistID = stylist?.id;

      // PUT request cho fullName, email, gender
      await api.put(`/${accountId}`, {
        fullName: values.fullName,
        email: values.email,
        gender: values.gender,
      });

      // PUT request cho hình ảnh và rating
      await api.put(`/stylist/${stylistID}`, {
        id: stylistID,
        rating: values.rating,
        image: values.image,
        service_id: values.service_id, // Truyền dưới dạng mảng số nguyên
      });

      message.success("Cập nhật thông tin stylist thành công!");
      setEditable(false); // Sau khi cập nhật, ngừng chế độ chỉnh sửa
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      message.error("Cập nhật thông tin thất bại, vui lòng thử lại sau.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Row gutter={16}>
      <Col span={24}>
        <h1>Thông Tin Stylist</h1>
        {stylist && (
          <Form form={form} onFinish={onFinish}>
            <Form.Item label="Tên của bạn" name="fullName">
              <Input disabled={!editable} />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Email của bạn" name="email">
              <Input disabled={!editable} />
            </Form.Item>

            <Form.Item label="Giới tính của bạn" name="gender">
              <Select disabled={!editable}>
                <Select.Option value="Male">Nam</Select.Option>
                <Select.Option value="Female">Nữ</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Hình ảnh" name="image">
              <Input disabled={!editable} />
            </Form.Item>

            <Form.Item label="Rating" name="rating">
              <Input disabled={!editable} />
            </Form.Item>

            {/* Dịch vụ - Hiển thị tất cả và chọn các dịch vụ stylist đã làm */}
            <Form.Item label="Dịch vụ" name="service_id">
              <Select
                mode="multiple"
                disabled={!editable}
                placeholder="Chọn dịch vụ"
              >
                {allServices.map((service) => (
                  <Select.Option key={service.id} value={service.id}>
                    {service.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Nút để kích hoạt chế độ chỉnh sửa */}
            {!editable && (
              <Button type="primary" onClick={handleEditClick}>
                Sửa thông tin
              </Button>
            )}

            {/* Nút cập nhật chỉ hiển thị khi chế độ chỉnh sửa được bật */}
            {editable && (
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập Nhật Thông Tin
                </Button>
              </Form.Item>
            )}
          </Form>
        )}
      </Col>
    </Row>
  );
};

export default StylistInfo;

import React, { useEffect, useState } from "react";
import { Form, Input, message, Col, Row, Select } from "antd";
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
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
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

          const responseServices = await api.get("/service/getService");

          const servicesForStylist = responseServices.data.filter(
            (service: Service) =>
              service.stylists.some((stylist) => stylist.id === stylistID)
          );

          setServices(responseServices.data);
          setFilteredServices(servicesForStylist);

          const selectedServiceIds = servicesForStylist.map(
            (service) => service.id
          );

          console.log("Form Values Before SetFieldsValue:", {
            fullName: currentUser.fullName,
            gender: currentUser.gender || "",
            email: currentUser.email || "",
            phone: currentUser.phone || "",
            image: currentUser.stylists[0].image || "",
            rating: currentUser.stylists[0].rating || "",
            service_id: selectedServiceIds,
          });

          // Đảm bảo gán giá trị cho form đúng cách
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
  }, [form]); // Sử dụng dependency form

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Row gutter={16}>
      <Col span={24}>
        <h1>Thông Tin Stylist</h1>
        {stylist && (
          <Form form={form}>
            <Form.Item label="Tên của bạn" name="fullName">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Email của bạn" name="email">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Giới tính của bạn" name="gender">
              <Select disabled>
                <Select.Option value="Male">Nam</Select.Option>
                <Select.Option value="Female">Nữ</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Hình ảnh" name="image">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Rating" name="rating">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Dịch vụ" name="service_id">
              <Select mode="multiple" disabled placeholder="Chọn dịch vụ">
                {filteredServices.map((service) => (
                  <Select.Option key={service.id} value={service.id}>
                    {service.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        )}
      </Col>
    </Row>
  );
};

export default StylistInfo;

import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Col,
  Row,
} from "antd";
import api from "../../../config/axios";

interface Stylist {
  id: number;
  name: string;
  rating: string;
  image: string;
  gender: string;
  email?: string;
  phone?: string;
}

const StylistInfo: React.FC = () => {
  const [stylist, setStylist] = useState<Stylist | null>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchStylist = async () => {
      try {
        const response = await api.get("/stylists/1"); // Giả sử lấy stylist với ID = 1
        setStylist(response.data);
        form.setFieldsValue(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin stylist:", error);
      }
    };
    fetchStylist();
  }, []);

  const onFinish = async (values: Stylist) => {
    try {
      if (stylist) {
        await api.put(`/stylists/${stylist.id}`, values);
        message.success("Cập nhật thông tin stylist thành công!");
        setStylist(values); // Cập nhật stylist trong state
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin stylist:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang tải dữ liệu
  }

  return (
    <Row gutter={16}>
      <Col span={24}>
        <h1>Chỉnh Sửa Thông Tin Stylist</h1>
        {stylist && (
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Đánh giá"
              name="rating"
              rules={[{ required: true, message: "Vui lòng nhập đánh giá!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Hình ảnh"
              name="image"
              rules={[{ required: true, message: "Vui lòng nhập hình ảnh!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng nhập giới tính!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        )}
      </Col>
    </Row>
  );
};

export default StylistInfo;

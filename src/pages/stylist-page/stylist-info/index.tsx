/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Col,
  Row,
} from "antd";
import api from "../../../config/axios";

const StylistInfo: React.FC = () => {
  const [stylists, setStylists] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [openModal, setOpenModal] = useState(false); 
  const [editingStylist, setEditingStylist] = useState<any>(null); 
  const [form] = Form.useForm(); 

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await api.get("/stylists");
        setStylists(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin stylist:", error);
      }
    };
    fetchStylists();
  }, []);

  const onFinish = async (values: any) => {
    try {
      if (editingStylist) {
        await api.put(`/stylists/${editingStylist.id}`, values);
        message.success("Cập nhật thông tin stylist thành công!");
      }
      setOpenModal(false);
      form.resetFields();
      const response = await api.get("/stylists");
      setStylists(response.data);
      setEditingStylist(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin stylist:", error);
    }
  };

  const handleEdit = (stylist: any) => {
    setEditingStylist(stylist);
    form.setFieldsValue({
      ...stylist,
    });
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/stylists/${id}`);
      message.success("Xóa stylist thành công!");
      const response = await api.get("/stylists");
      setStylists(response.data);
    } catch (error) {
      message.error("Lỗi khi xóa stylist!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Hành động",
      key: "action",
      render: (stylist: any) => (
        <>
          <Button
            type="link"
            onClick={() => handleEdit(stylist)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa stylist này không?"
            onConfirm={() => handleDelete(stylist.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Row gutter={16}>
      <Col span={24}>
        <h1>Thông Tin Stylist</h1>
        <Button type="primary" onClick={() => setOpenModal(true)} style={{ marginBottom: 16 }}>
          Thêm Stylist
        </Button>
        <Table
          columns={columns}
          dataSource={stylists}
          rowKey="id"
          loading={loading}
          style={{ marginTop: 20 }}
        />
      </Col>
      <Modal
        title={editingStylist ? "Chỉnh sửa thông tin stylist" : "Thêm stylist mới"}
        visible={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingStylist(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingStylist ? "Cập nhật" : "Thêm stylist"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default StylistInfo;

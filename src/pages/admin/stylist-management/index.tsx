/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Upload,
  Popconfirm,
  message,
  Checkbox,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../utils/file";
import "./index.scss";
import api from "../../../config/axios";

const { TextArea } = Input;

const servicesList = [
  { id: 1, name: "Dịch vụ 1" },
  { id: 2, name: "Dịch vụ 2" },
  { id: 3, name: "Dịch vụ 3" },
  { id: 4, name: "Dịch vụ 4" },
  { id: 5, name: "Dịch vụ 5" },
];

const adminEmployeeRegistration: React.FC = () => {
  const [stylists, setStylists] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingStylist, setEditingStylist] = useState<any>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await api.get("http://localhost:8080/api/stylist/getAllStylist");
        setStylists(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách stylist:", error);
      }
    };
    fetchStylists();
  }, []);

  const handleEdit = (stylist: any) => {
    setEditingStylist(stylist);
    form.setFieldsValue({
      ...stylist,
      services: stylist.services ? stylist.services.map((service: any) => service.id) : [],
    });
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/stylists/${id}`);
      message.success("Xóa stylist thành công!");
      const response = await api.get("http://localhost:8080/api/stylist/getAllStylist");
      setStylists(response.data);
    } catch (error) {
      message.error("Lỗi khi xóa stylist!");
    }
  };

  const handleChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const onFinish = async (values: any) => {
    try {
      let imageUrl = "";
      if (fileList.length > 0) {
        const file = fileList[0];
        imageUrl = await uploadFile(file.originFileObj);
      }

      const stylistData = {
        ...values,
        avatar: imageUrl || editingStylist?.avatar || "",
        services: values.services || [],
      };

      if (editingStylist) {
        await api.put(`/stylists/${editingStylist.id}`, stylistData);
        message.success("Cập nhật stylist thành công!");
      } else {
        await api.post("/stylists", stylistData);
        message.success("Thêm stylist thành công!");
      }

      setOpenModal(false);
      form.resetFields();
      const response = await api.get("http://localhost:8080/api/stylist/getAllStylist");
      setStylists(response.data);
      setEditingStylist(null);
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật stylist:", error);
    }
  };

  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: "image",
      render: (text: string) => (
        <img src={text} alt="avatar" style={{ borderRadius: "50%", width: 50, height: 50 }} />
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      render: (rating: any) => rating || "Chưa có đánh giá",
    },
    {
      title: "Hành động",
      render: (stylist: any) => (
        <>
          <Button type="link" onClick={() => handleEdit(stylist)}>
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
    <div className="card">
      <h1>Quản Lý Stylist</h1>
      <Button type="primary" onClick={() => setOpenModal(true)}>
        Thêm Stylist
      </Button>
      <Table
        columns={columns}
        dataSource={stylists}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
      <Modal
        title={editingStylist ? "Chỉnh sửa Stylist" : "Thêm Stylist"}
        visible={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingStylist(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} labelCol={{ span: 24 }}>
          <Form.Item
            label="Ảnh đại diện"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e.fileList}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mật khẩu mới" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Xác nhận mật khẩu mới" name="confirmPassword">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Dịch vụ đảm nhiệm" name="services">
            <Checkbox.Group>
              {servicesList.map((service) => (
                <Checkbox key={service.id} value={service.id}>
                  {service.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingStylist ? "Cập nhật" : "Xác nhận thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default adminEmployeeRegistration;

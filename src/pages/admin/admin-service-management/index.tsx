import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import "./index.scss";
import uploadFile from "../../../utils/file";

const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const AdminServiceManagement: React.FC = () => {
  const [services, setServices] = useState([]); 
  // Trạng thái lưu danh sách dịch vụ
  const [categories, setCategories] = useState([]); 
  // Trạng thái lưu danh sách danh mục
  const [fileList, setFileList] = useState([]); 
  // Trạng thái lưu danh sách file upload
  const [loading, setLoading] = useState(true); 
  // Trạng thái loading
  const [openModal, setOpenModal] = useState(false); 
  // Trạng thái mở modal thêm/sửa
  const [editingService, setEditingService] = useState<any>(null); // Trạng thái lưu dịch vụ đang chỉnh sửa
  const [form] = Form.useForm(); // Sử dụng form của Ant Design

  // Fetch danh sách dịch vụ và danh mục từ API
  useEffect(() => {
    const fetchServicesAndCategories = async () => {
      try {
        const [serviceResponse, categoryResponse] = await Promise.all([
          api.get("/service"),
          api.get("/category"),
        ]);
        setServices(serviceResponse.data);
        setCategories(categoryResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục hoặc dịch vụ:", error);
      }
    };
    fetchServicesAndCategories();
  }, []);

  // Tạo một map từ categoryId đến nameCategory để tra cứu nhanh
  const categoryMap = categories.reduce((map: any, category: any) => {
    map[category.id] = category.nameCategory;
    return map;
  }, {});

  // Xử lý khi form được submit để thêm hoặc sửa dịch vụ
  const onFinish = async (values: any) => {
    try {
      let imageUrl = "";
      if (fileList.length > 0) {
        const file = fileList[0];
        imageUrl = await uploadFile(file.originFileObj); // Upload ảnh và nhận URL
      }

      const serviceData = {
        ...values,
        category: values.categoryId, // Đảm bảo category được gửi dưới dạng ID
        serviceImage: imageUrl || editingService?.serviceImage || "", // Thêm URL ảnh vào dữ liệu
        deleted: false,
      };

      if (editingService) {
        // Cập nhật dịch vụ
        await api.put(`/service/${editingService.id}`, serviceData);
        message.success("Cập nhật dịch vụ thành công!");
      } else {
        // Thêm mới dịch vụ
        await api.post("/service", serviceData);
        message.success("Thêm dịch vụ thành công!");
      }

      // Đóng modal và reset form
      setOpenModal(false);
      form.resetFields();
      // Fetch lại danh sách dịch vụ sau khi thêm hoặc cập nhật
      const response = await api.get("/service");
      setServices(response.data);
      setEditingService(null); // Reset trạng thái chỉnh sửa
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật dịch vụ:", error);
    }
  };

  // Xử lý khi nhấn nút "Sửa", mở modal và điền thông tin dịch vụ vào form
  const handleEdit = (service: any) => {
    setEditingService(service);
    form.setFieldsValue({
      ...service,
      categoryId: service.category, 
      // Gán categoryId từ dữ liệu dịch vụ khi chỉnh sửa
    });
    setOpenModal(true);
  };

  // Xử lý khi nhấn nút "Xóa", gọi API DELETE
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/service/${id}`);
      message.success("Xóa dịch vụ thành công!");
      // Fetch lại danh sách sau khi xóa
      const response = await api.get("/service");
      setServices(response.data);
    } catch (error) {
      message.error("Lỗi khi xóa dịch vụ!");
    }
  };

  const handleChange = ({ fileList: newFileList }: any) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  // Cấu trúc cột của bảng dịch vụ
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Thời lượng (phút)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Danh mục",
      dataIndex: "category", // Sử dụng categoryId để lấy tên danh mục
      key: "category",
      render: (categoryId: number) => categoryMap[categoryId] || "N/A", // Hiển thị tên danh mục thay vì ID
    },
    {
      title: "Hành động",
      key: "action",
      render: (service: any) => (
        <>
          <Button
            type="link"
            onClick={() => handleEdit(service)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa dịch vụ này không?"
            onConfirm={() => handleDelete(service.id)}
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
      <h1>Quản Lý Dịch Vụ</h1>
      <Button type="primary" onClick={() => setOpenModal(true)}>
        Thêm Dịch Vụ
      </Button>
      {/* Hiển thị bảng chứa dịch vụ */}
      <Table
        columns={columns}
        dataSource={services}
        rowKey="id"
        loading={loading}
        style={{ marginTop: 20 }}
      />
      {/* Modal thêm/sửa dịch vụ */}
      <Modal
        title={editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        visible={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingService(null); // Đặt lại trạng thái
        }}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          {/* Tên dịch vụ */}
          <Form.Item
            label="Tên dịch vụ"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
          >
            <Input />
          </Form.Item>
          {/* Mô tả dịch vụ */}
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả dịch vụ!" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          {/* Giá dịch vụ */}
          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá dịch vụ!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          {/* Thời lượng dịch vụ */}
          <Form.Item
            label="Thời lượng (phút)"
            name="duration"
            rules={[
              { required: true, message: "Vui lòng nhập thời lượng dịch vụ!" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          {/* Stylist */}
          <Form.Item
            label="Stylist"
            name="stylist"
            rules={[{ required: true, message: "Vui lòng chọn stylist!" }]}
          >
            <Select placeholder="Chọn stylist">
              <Select.Option value="1">Stylist 1</Select.Option>
              <Select.Option value="2">Stylist 2</Select.Option>
            </Select>
          </Form.Item>
          {/* Danh mục dịch vụ */}
          <Form.Item
            label="Danh mục"
            name="categoryId"
            rules={[
              { required: true, message: "Vui lòng chọn danh mục dịch vụ!" },
            ]}
          >
            <Select placeholder="Chọn danh mục dịch vụ">
              {categories.map((category: any) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.nameCategory}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {/* Upload ảnh dịch vụ */}
          <Form.Item
            label="Upload Ảnh"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "Vui lòng upload ảnh dịch vụ!" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          {/* Nút thêm/sửa */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingService ? "Cập nhật" : "Thêm dịch vụ"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminServiceManagement;

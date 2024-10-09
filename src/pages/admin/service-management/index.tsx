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
  Col,
  Card,
  Row,
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
  const [categories, setCategories] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm
  const [form] = Form.useForm();

  // Fetch danh sách dịch vụ và danh mục từ API
  useEffect(() => {
    const fetchServicesAndCategories = async () => {
      try {
        const [serviceResponse, categoryResponse] = await Promise.all([
          api.get("/service/getService"),
          api.get("/category/getCategory"),
        ]);

        const sortedServices = serviceResponse.data.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setServices(sortedServices);
        setFilteredServices(sortedServices); // Đặt dịch vụ đã được sắp xếp vào state
        setCategories(categoryResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục hoặc dịch vụ:", error);
      }
    };

    fetchServicesAndCategories();
  }, []);

  const categoryMap = categories.reduce((map: any, category: any) => {
    map[category.id] = category.nameCategory;
    return map;
  }, {});

  // Hàm lọc dịch vụ theo danh mục
  const handleCategoryFilter = (value: number | undefined) => {
    setSelectedCategory(value);
    let filtered = services;

    if (value) {
      filtered = filtered.filter(
        (service) => service.category === value.toString()
      );
    }

    // Lọc dịch vụ theo từ khóa tìm kiếm nếu có
    if (searchTerm) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  // Hàm xử lý tìm kiếm theo tên dịch vụ
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    let filtered = services;

    // Lọc dịch vụ theo từ khóa tìm kiếm
    if (term) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Lọc theo danh mục hiện tại nếu có
    if (selectedCategory) {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory.toString()
      );
    }

    setFilteredServices(filtered);
  };

  const handleView = (service: any) => {
    setSelectedService(service);
  };

  const onFinish = async (values: any) => {
    try {
      let imageUrl = "";
      if (fileList.length > 0) {
        const file = fileList[0];
        imageUrl = await uploadFile(file.originFileObj);
      }

      const currentDate = formatDate(new Date());

      const serviceData = {
        ...values,
        price: values.price.toString(), // Chuyển đổi price thành chuỗi
        duration: values.duration.toString(), // Chuyển đổi duration thành chuỗi
        category: values.categoryId.toString(), // Chuyển đổi categoryId thành chuỗi
        serviceImage: imageUrl || editingService?.serviceImage || "",
        date: currentDate, // Thêm thời gian hiện tại
      };

      if (editingService) {
        await api.put(`/service/${editingService.id}`, serviceData);
        message.success("Cập nhật dịch vụ thành công!");
      } else {
        await api.post("/service", serviceData);
        message.success("Thêm dịch vụ thành công!");
      }

      setOpenModal(false);
      form.resetFields();
      const response = await api.get("/service/getService");
      const sortedServices = response.data.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setServices(sortedServices);
      setFilteredServices(sortedServices);
      setEditingService(null);
    } catch (error) {
      console.error(
        "Lỗi khi tạo/cập nhật dịch vụ:",
        error.response?.data || error.message
      );
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    form.setFieldsValue({
      ...service,
      categoryId: service.category,
    });
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/service/${id}`);
      message.success("Xóa dịch vụ thành công!");
      const response = await api.get("/service/getService");
      const sortedServices = response.data.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setServices(sortedServices);
      setFilteredServices(sortedServices);
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

  // Hàm định dạng ngày giờ
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

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
      dataIndex: "category",
      key: "categoryId",
      render: (categoryId: number) => categoryMap[categoryId] || "N/A",
    },
    {
      title: "Ngày tạo", // Cột 'date' mới
      dataIndex: "date",
      key: "date",
      render: (date: string) => (date ? date.split("T")[0] : "Chưa có ngày"), // Hiển thị ngày
    },
    {
      title: "Hình ảnh",
      dataIndex: "serviceImage",
      key: "serviceImage",
      render: (imageUrl: string, service: any) => (
        <img
          src={imageUrl}
          alt="Service"
          style={{ width: 50, height: 50, cursor: "pointer" }}
          onClick={() => handleView(service)}
        />
      ),
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
    <Row gutter={16}>
      <Col span={16}>
        <h1>Quản Lý Dịch Vụ</h1>
        <div style={{ display: "flex", marginBottom: 16 }}>
          <Input
            className="custom-search-input"
            placeholder="Tìm kiếm dịch vụ"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 200, marginRight: 16 }}
          />
          <Select
            placeholder="Chọn danh mục"
            style={{ width: 200, marginRight: 16 }}
            onChange={handleCategoryFilter}
            allowClear
          >
            {categories.map((category: any) => (
              <Select.Option key={category.id} value={category.id}>
                {category.nameCategory}
              </Select.Option>
            ))}
          </Select>

          <Button type="primary" onClick={() => setOpenModal(true)}>
            Thêm Dịch Vụ
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredServices}
          rowKey="id"
          loading={loading}
          style={{ marginTop: 20 }}
        />
      </Col>
      <Col span={8}>
        {selectedService && (
          <Card title="Thông tin dịch vụ" style={{ width: "100%" }}>
            <img
              src={selectedService.serviceImage}
              alt="Service"
              style={{ width: "100%", height: "auto", marginBottom: 16 }}
            />
            <p>
              <strong>Tên dịch vụ:</strong> {selectedService.name}
            </p>
            <p>
              <strong>Danh mục:</strong> {categoryMap[selectedService.category]}
            </p>
            <p>
              <strong>Giá:</strong> {selectedService.price}
            </p>
            <p>
              <strong>Thời lượng:</strong> {selectedService.duration} phút
            </p>
            <p>
              <strong>Ngày tạo:</strong> {selectedService.date || "Chưa có"}
            </p>
          </Card>
        )}
      </Col>
      <Modal
        title={editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        visible={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingService(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label="Tên dịch vụ"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả dịch vụ!" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá dịch vụ!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Thời lượng (phút)"
            name="duration"
            rules={[
              { required: true, message: "Vui lòng nhập thời lượng dịch vụ!" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingService ? "Cập nhật" : "Thêm dịch vụ"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default AdminServiceManagement;

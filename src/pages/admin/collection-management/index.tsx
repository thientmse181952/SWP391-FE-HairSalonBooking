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
  Select,
  Col,
  Row,
  Card,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import "./index.scss";
import uploadFile from "../../../utils/file";

const { Option } = Select;

const CollectionManagement: React.FC = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [form] = Form.useForm();

  // Fetch dữ liệu bộ sưu tập và danh mục
  useEffect(() => {
    const fetchCollectionsAndCategories = async () => {
      try {
        const [collectionResponse, categoryResponse] = await Promise.all([
          api.get("/collection/getCollection"),
          api.get("/category-collection/getCollection"),
        ]);

        // Sắp xếp các collection theo thứ tự thời gian giảm dần
        const sortedCollections = collectionResponse.data.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setCollections(sortedCollections);
        setFilteredCollections(sortedCollections);
        setCategories(categoryResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy bộ sưu tập hoặc danh mục:", error);
      }
    };
    fetchCollectionsAndCategories();
  }, []);

  // Lọc bộ sưu tập theo danh mục
  // Lọc bộ sưu tập theo danh mục
  const handleCategoryFilter = (value: string) => {
    setSelectedCategory(value);
    if (value) {
      // Kiểm tra sự tồn tại của categoryCollection trước khi lọc
      setFilteredCollections(
        collections.filter(
          (collection: any) =>
            collection.categoryCollection &&
            collection.categoryCollection.nameCategory === value
        )
      );
    } else {
      setFilteredCollections(collections); // Hiển thị tất cả nếu không chọn danh mục
    }
  };

  // Hàm định dạng thời gian
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Thêm hoặc cập nhật bộ sưu tập
  const onFinish = async (values: any) => {
    try {
      let imageUrl = "";
      if (fileList.length > 0) {
        const file = fileList[0];
        imageUrl = await uploadFile(file.originFileObj);
      }

      const currentDate = formatDate(new Date());

      const collectionData = {
        ...values,
        collectionImage: imageUrl || editingCollection?.collectionImage || "",
        deleted: false,
        date: currentDate,
      };

      if (editingCollection) {
        await api.put(`/collection/${editingCollection.id}`, collectionData);
        message.success("Cập nhật bộ sưu tập thành công!");
      } else {
        await api.post("/collection", collectionData);
        message.success("Thêm bộ sưu tập thành công!");
      }

      setOpenModal(false);
      form.resetFields();

      // Lấy lại dữ liệu mới nhất sau khi thêm hoặc cập nhật
      const response = await api.get("/collection/getCollection");
      const sortedCollections = response.data.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setCollections(sortedCollections);
      setFilteredCollections(sortedCollections);
      setEditingCollection(null);
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật bộ sưu tập:", error);
    }
  };

  // Chỉnh sửa bộ sưu tập
  const handleEdit = (collection: any) => {
    setEditingCollection(collection);
    form.setFieldsValue({
      ...collection,
    });
    setOpenModal(true);
  };

  // Xóa bộ sưu tập
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/collection/${id}`);
      message.success("Xóa bộ sưu tập thành công!");
      const response = await api.get("/collection/getCollection");
      const sortedCollections = response.data.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setCollections(sortedCollections);
      setFilteredCollections(sortedCollections);
    } catch (error) {
      message.error("Lỗi khi xóa bộ sưu tập!");
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

  // Cấu trúc bảng hiển thị bộ sưu tập
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Danh mục",
      dataIndex: ["categoryCollection", "nameCategory"], // Sửa lại để lấy đúng nameCategory từ categoryCollection
      key: "categoryCollection",
    },
    {
      title: "Hình ảnh",
      dataIndex: "collectionImage",
      key: "collectionImage",
      render: (imageUrl: string) => (
        <img
          src={imageUrl}
          alt="Collection"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      title: "Ngày tạo", // Cột 'date' mới
      dataIndex: "date",
      key: "date",
      render: (date: string) => (date ? date.split("T")[0] : "Chưa có ngày"), // Hiển thị ngày (bỏ phần giờ)
    },
    {
      title: "Hành động",
      key: "action",
      render: (collection: any) => (
        <>
          <Button
            type="link"
            onClick={() => handleEdit(collection)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bộ sưu tập này không?"
            onConfirm={() => handleDelete(collection.id)}
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
        <h1>Quản Lý Bộ Sưu Tập</h1>
        <Select
          placeholder="Chọn danh mục"
          style={{ width: 200, marginBottom: 16 }}
          onChange={handleCategoryFilter}
          allowClear
        >
          {categories.map((category: any) => (
            <Option key={category.id} value={category.nameCategory}>
              {category.nameCategory}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={() => setOpenModal(true)}
          style={{ marginBottom: 16 }}
        >
          Thêm Bộ Sưu Tập
        </Button>
        <Table
          columns={columns}
          dataSource={filteredCollections}
          rowKey="id"
          loading={loading}
          onRow={(record) => ({
            onClick: () => setSelectedCollection(record),
          })}
          style={{ marginTop: 20 }}
        />
      </Col>
      <Col span={8}>
        {selectedCollection && (
          <Card title="Thông tin bộ sưu tập" style={{ width: "100%" }}>
            <img
              src={selectedCollection.collectionImage}
              alt="Collection"
              style={{ width: "100%", height: "auto", marginBottom: 16 }}
            />
            <p>
              <strong>Danh mục:</strong>{" "}
              {selectedCollection.categoryCollection
                ? selectedCollection.categoryCollection.nameCategory
                : "Không có danh mục"}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {selectedCollection.date || "Chưa có"}
            </p>
          </Card>
        )}
      </Col>
      <Modal
        title={
          editingCollection ? "Chỉnh sửa bộ sưu tập" : "Thêm bộ sưu tập mới"
        }
        visible={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingCollection(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label="Danh mục"
            name="categoryCollection" // Sửa lại tên trường
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục" allowClear>
              {categories.map((category: any) => (
                <Option key={category.id} value={category.nameCategory}>
                  {category.nameCategory}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Upload Ảnh"
            valuePropName="fileList"
            getValueFromEvent={(e: any) =>
              Array.isArray(e) ? e : e && e.fileList
            }
            rules={[
              { required: true, message: "Vui lòng upload ảnh bộ sưu tập!" },
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
              {editingCollection ? "Cập nhật" : "Thêm bộ sưu tập"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default CollectionManagement;

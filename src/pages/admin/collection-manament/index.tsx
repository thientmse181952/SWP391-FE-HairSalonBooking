/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [form] = Form.useForm(); 

  useEffect(() => {
    const fetchCollectionsAndCategories = async () => {
      try {
        const [collectionResponse, categoryResponse] = await Promise.all([
          api.get("/collection"),
          api.get("/category"),
        ]);
        setCollections(collectionResponse.data);
        setFilteredCollections(collectionResponse.data);
        setCategories(categoryResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy bộ sưu tập hoặc danh mục:", error);
      }
    };
    fetchCollectionsAndCategories();
  }, []);

  const handleCategoryFilter = (value: string) => {
    setSelectedCategory(value);
    if (value) {
      setFilteredCollections(collections.filter(collection => collection.category === value));
    } else {
      setFilteredCollections(collections);
    }
  };

  const onFinish = async (values: any) => {
    try {
      let imageUrl = "";
      if (fileList.length > 0) {
        const file = fileList[0];
        imageUrl = await uploadFile(file.originFileObj); 
      }

      const collectionData = {
        ...values,
        collectionImage: imageUrl || editingCollection?.collectionImage || "", 
        deleted: false,
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
      const response = await api.get("/collection");
      setCollections(response.data);
      setFilteredCollections(response.data);
      setEditingCollection(null);
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật bộ sưu tập:", error);
    }
  };

  const handleEdit = (collection: any) => {
    setEditingCollection(collection);
    form.setFieldsValue({
      ...collection,
    });
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/collection/${id}`);
      message.success("Xóa bộ sưu tập thành công!");
      const response = await api.get("/collection");
      setCollections(response.data);
      setFilteredCollections(response.data);
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Ảnh bộ sưu tập",
      dataIndex: "collectionImage",
      key: "collectionImage",
      render: (imageUrl: string) => (
        <img src={imageUrl} alt="Collection" style={{ width: 50, height: 50 }} />
      ),
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

  const handleView = (collection: any) => {
    setSelectedCollection(collection);
  };

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
        <Button type="primary" onClick={() => setOpenModal(true)} style={{ marginBottom: 16 }}>
          Thêm Bộ Sưu Tập
        </Button>
        <Table
          columns={columns}
          dataSource={filteredCollections}
          rowKey="id"
          loading={loading}
          onRow={(record) => ({
            onClick: () => handleView(record),
          })}
          style={{ marginTop: 20 }}
        />
      </Col>
      <Col span={8}>
        {selectedCollection && (
          <Card title="Thông tin bộ sưu tập" style={{ width: '100%' }}>
            <img
              src={selectedCollection.collectionImage}
              alt="Collection"
              style={{ width: '100%', height: 'auto', marginBottom: 16 }}
            />
            <p><strong>Danh mục:</strong> {selectedCollection.category}</p>
          </Card>
        )}
      </Col>
      <Modal
        title={editingCollection ? "Chỉnh sửa bộ sưu tập" : "Thêm bộ sưu tập mới"}
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
            name="category"
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
            getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e && e.fileList)}
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

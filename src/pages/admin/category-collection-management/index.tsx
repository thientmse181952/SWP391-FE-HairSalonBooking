import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form, Input, Popconfirm, message } from "antd";
import api from "../../../config/axios"; // Sử dụng axios để gọi API

const CategoryCollectionManagement: React.FC = () => {
  const [categoryCollections, setCategoryCollections] = useState([]); // Trạng thái lưu danh sách danh mục collection
  const [loading, setLoading] = useState(true); // Trạng thái loading khi gọi API
  const [openModal, setOpenModal] = useState(false); // Trạng thái modal thêm/sửa danh mục collection
  const [editingCategoryCollection, setEditingCategoryCollection] =
    useState<any>(null); // Trạng thái chỉnh sửa danh mục collection
  const [form] = Form.useForm(); // Sử dụng form của Ant Design

  // Gọi API để lấy danh sách từ server
  useEffect(() => {
    const fetchCategoryCollections = async () => {
      try {
        const response = await api.get("/category-collection/getCollection");
        // Sắp xếp theo ID giảm dần
        const sortedCollections = response.data.sort(
          (a: any, b: any) => b.id - a.id
        );
        setCategoryCollections(sortedCollections); // Lưu dữ liệu vào state
        setLoading(false); // Tắt loading sau khi lấy dữ liệu xong
      } catch (error) {
        console.error("Lỗi khi lấy danh mục collection:", error);
      }
    };

    fetchCategoryCollections();
  }, []);

  // Xử lý khi form được submit để thêm hoặc sửa danh mục collection
  const onFinish = async (values: any) => {
    try {
      if (editingCategoryCollection) {
        // Nếu đang trong trạng thái chỉnh sửa, gọi API PUT
        await api.put(`/category-collection/${editingCategoryCollection.id}`, {
          ...editingCategoryCollection,
          ...values,
        });
        message.success("Cập nhật danh mục collection thành công!");
      } else {
        // Nếu là thêm mới, gọi API POST
        await api.post("/category-collection", { ...values, deleted: false });
        message.success("Thêm danh mục collection thành công!");
      }
      setOpenModal(false); // Đóng modal sau khi thành công
      form.resetFields(); // Reset form

      // Fetch lại danh sách sau khi thêm hoặc cập nhật thành công
      const response = await api.get("/category-collection/getCollection");

      // Sắp xếp lại danh sách theo ID giảm dần sau khi fetch dữ liệu mới
      const sortedCollections = response.data.sort(
        (a: any, b: any) => b.id - a.id
      );
      setCategoryCollections(sortedCollections);

      setEditingCategoryCollection(null); // Reset trạng thái chỉnh sửa
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật danh mục collection:", error);
    }
  };

  // Xử lý khi nhấn nút "Sửa", mở modal và điền thông tin vào form
  const handleEdit = (categoryCollection: any) => {
    setEditingCategoryCollection(categoryCollection);
    form.setFieldsValue(categoryCollection);
    setOpenModal(true);
  };

  // Xử lý khi nhấn nút "Xóa", gọi API DELETE
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/category-collection/${id}`);
      message.success("Xóa danh mục collection thành công!");
      // Fetch lại danh sách sau khi xóa thành công
      const response = await api.get("/category-collection/getCollection");
      setCategoryCollections(response.data);
    } catch (error) {
      message.error("Lỗi khi xóa danh mục collection!");
    }
  };

  // Cấu trúc cột của bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên danh mục collection",
      dataIndex: "nameCategory",
      key: "nameCategory",
    },
    {
      title: "Hành động",
      key: "action",
      render: (categoryCollection: any) => (
        <>
          <Button
            type="link"
            onClick={() => handleEdit(categoryCollection)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này không?"
            onConfirm={() => handleDelete(categoryCollection.id)}
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
      <h1>Quản Lý Danh Mục BST</h1>
      <Button type="primary" onClick={() => setOpenModal(true)}>
        Thêm Category Collection
      </Button>
      {/* Hiển thị bảng chứa danh mục collection */}
      <Table
        columns={columns}
        dataSource={categoryCollections}
        rowKey="id"
        loading={loading}
        style={{ marginTop: 20 }}
      />
      {/* Modal thêm/sửa danh mục collection */}
      <Modal
        title={
          editingCategoryCollection
            ? "Chỉnh sửa danh mục collection"
            : "Thêm danh mục collection mới"
        }
        visible={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingCategoryCollection(null); // Đặt lại trạng thái
        }}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          {/* Tên danh mục collection */}
          <Form.Item
            label="Tên danh mục collection"
            name="nameCategory"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên danh mục collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Nút thêm/sửa */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategoryCollection ? "Cập nhật" : "Thêm danh mục"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryCollectionManagement;

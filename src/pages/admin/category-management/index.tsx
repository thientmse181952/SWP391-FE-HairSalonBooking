/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form, Input, Popconfirm, message } from "antd";
import api from "../../../config/axios"; // Sử dụng axios để gọi API

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState([]); // Trạng thái lưu danh sách danh mục
  const [loading, setLoading] = useState(true); // Trạng thái loading khi gọi API
  const [openModal, setOpenModal] = useState(false); // Trạng thái modal thêm/sửa danh mục
  const [editingCategory, setEditingCategory] = useState(null); // Trạng thái chỉnh sửa danh mục
  const [form] = Form.useForm(); // Sử dụng form của Ant Design

  // Gọi API để lấy danh mục từ server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category/getCategory");
        setCategories(response.data); // Lưu dữ liệu danh mục vào state
        setLoading(false); // Tắt loading sau khi lấy dữ liệu xong
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý khi form được submit để thêm hoặc sửa danh mục
  const onFinish = async (values: any) => {
    try {
      if (editingCategory) {
        // Nếu đang trong trạng thái chỉnh sửa, gọi API PUT
        await api.put(`/category/${editingCategory.id}`, {
          ...editingCategory,
          ...values,
        });
        message.success("Cập nhật danh mục thành công!");
      } else {
        // Nếu là thêm mới, gọi API POST
        await api.post("/category", { ...values, deleted: false });
        message.success("Thêm danh mục thành công!");
      }
      setOpenModal(false); // Đóng modal sau khi thành công
      form.resetFields(); // Reset form
      // Fetch lại danh sách sau khi thêm hoặc cập nhật thành công
      const response = await api.get("/category/getCategory");
      setCategories(response.data);
      setEditingCategory(null); // Reset trạng thái chỉnh sửa
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật danh mục:", error);
    }
  };

  // Xử lý khi nhấn nút "Sửa", mở modal và điền thông tin danh mục vào form
  const handleEdit = (category: any) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setOpenModal(true);
  };

  // Xử lý khi nhấn nút "Xóa", gọi API DELETE
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/category/${id}`);
      message.success("Xóa danh mục thành công!");
      // Fetch lại danh sách sau khi xóa thành công
      const response = await api.get("/category/getCategory");
      setCategories(response.data);
    } catch (error) {
      message.error("Lỗi khi xóa danh mục!");
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
      title: "Tên danh mục",
      dataIndex: "nameCategory",
      key: "nameCategory",
    },
    {
      title: "Hành động",
      key: "action",
      render: (category: any) => (
        <>
          <Button
            type="link"
            onClick={() => handleEdit(category)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này không?"
            onConfirm={() => handleDelete(category.id)}
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
      <h1>Quản Lý Danh Mục</h1>
      <Button type="primary" onClick={() => setOpenModal(true)}>
        Thêm Category
      </Button>
      {/* Hiển thị bảng chứa danh mục */}
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        style={{ marginTop: 20 }}
      />
      {/* Modal thêm/sửa danh mục */}
      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        visible={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingCategory(null); // Đặt lại trạng thái
        }}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          {/* Tên danh mục */}
          <Form.Item
            label="Tên danh mục"
            name="nameCategory"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input />
          </Form.Item>

          {/* Nút thêm/sửa */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? "Cập nhật" : "Thêm danh mục"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;

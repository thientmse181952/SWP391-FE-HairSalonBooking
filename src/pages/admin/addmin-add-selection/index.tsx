import { Descriptions, Form, Input, Modal, Table, Button, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';

function AddSelection() {
  const [datas, setDatas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // GET data
  const fetchData = async () => {
    try {
      const response = await api.get("category");
      setDatas(response.data);
    
    } catch (error) {
    //   toast.error(error.response.data);
    }
  };

  // CREATE or UPDATE
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await api.post("category", values);
    //   toast.success("Successfully saved!");
      fetchData();
      form.resetFields();
      setShowModal(false);
    } catch (error) {
      const errorMessage = error.response ? error.response.data : "An unexpected error occurred.";
    //   toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // DELETE (chưa triển khai)
  const handleDelete = (id) => {};

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>Add</Button>

      <Table dataSource={datas} rowKey="id" />

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)} // Sử dụng onCancel
        title="Category"
        onOk={() => form.submit()} // Gọi hàm submit
        confirmLoading={loading}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input category name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please input description",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="image"
            label="Upload Image"
            valuePropName="fileList"
            getValueFromEvent={({ fileList }) => fileList}
            rules={[
              {
                required: true,
                message: "Please upload an image",
              },
            ]}
          >
            <Upload
              name="image"
              listType="picture"
              beforeUpload={() => false} // Ngăn không cho tự động upload
              maxCount={1} // Giới hạn số lượng file upload
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddSelection;

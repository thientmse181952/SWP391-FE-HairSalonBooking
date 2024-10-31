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
    
  ];

  return (
    <div className="card">
      <h1>Quản Lý Stylist</h1>
    
      <Table
        columns={columns}
        dataSource={stylists}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
      
    </div>
  );
};

export default adminEmployeeRegistration;

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Table, Form, message } from "antd";
import uploadFile from "../../../utils/file";
import "./index.scss";
import api from "../../../config/axios";
import Loading from "../../../components/loading";

const AdminEmployeeRegistration: React.FC = () => {
  const [stylists, setStylists] = useState([]);
  const [editingStylist, setEditingStylist] = useState<any>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [services, setServices] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("http://localhost:8080/api/service/getService");
        setServices(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await api.get("http://localhost:8080/api/stylist/getAllStylist");
        const sortedStylists = response.data.sort((a: any, b: any) => b.id - a.id);
        setStylists(sortedStylists);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách stylist:", error);
      }
    };
    fetchStylists();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get("http://localhost:8080/api/account");
        setAccounts(response.data); // Lưu danh sách tài khoản
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thông tin:", error);
      }
    };
    fetchAccounts();
  }, []);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
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

      form.resetFields();
      const response = await api.get("http://localhost:8080/api/stylist/getAllStylist");
      setStylists(response.data);
      setEditingStylist(null);
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật stylist:", error);
    } finally{
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "image",
      render: (text: string) => (
        <img
          src={text}
          alt="avatar"
          style={{ borderRadius: "50%", width: 50, height: 50 }}
        />
      ),
    },
    {
      title: "Tên Stylist",
      dataIndex: "id",
      render: (stylistId: number) => {
        const stylistAccount = accounts.find((account: any) =>
          account.stylists.some((stylist: any) => stylist.id === stylistId)
        );
        return stylistAccount ? stylistAccount.fullName : "Không có tên";
      },
    },
    
    {
      title: "Đánh giá",
      dataIndex: "rating",
      render: (rating: any) => rating || "Chưa có đánh giá",
    },
    {
      title: "Các dịch vụ đảm nhiệm",
      dataIndex: "id",
      render: (stylistId: number) => {
        const stylistServices = services.filter((service) =>
          service.stylists.some((stylist) => stylist.id === stylistId)
        );

        return stylistServices.length > 0
          ? stylistServices.map((service) => service.name).join(", ")
          : "Không có dịch vụ";
      },
    },
  ];

  return (

    <div>
    {loading ? (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loading /> {/* Hiển thị component Loading khi đang loading */}
      </div>
    ) : (
    <div className="card">
      <h1>Quản Lý Stylist</h1>
      <Table
        columns={columns}
        dataSource={stylists}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
    </div>
    )}</div>
  );
};

export default AdminEmployeeRegistration;

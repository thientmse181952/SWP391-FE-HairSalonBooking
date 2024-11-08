import { Card, Col, Row, Statistic as AntStatistic, Table, Select } from "antd";
import { ScissorOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import {
  CalendarOutlined,
  UserOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import "./index.scss";

const { Option } = Select;

interface RevenueData {
  totalRevenue: number;
  month: number;
  year: number;
}

interface DataType {
  totalbookings: number;
  customercount: number;
  serviceofstylistcount: number;
  topStylists: Array<{ stylistName: string; bookingCount: number }>;
  top5services: Array<{ serviceName: string; bookingCount: number }>;
}

function DashboardStatistic() {
  const [data, setData] = useState<DataType | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // Mặc định tháng 10
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [eliteCustomers, setEliteCustomers] = useState<any[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any[]>([]); // Dữ liệu doanh thu hàng tháng

  const fetchData = async () => {
    try {
      const response = await api.get<DataType>("/dashboard/stats");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRevenueData = async (month: number, year: number) => {
    try {
      const response = await api.get<RevenueData>(
        `/dashboard/revenue/${month}/${year}`
      );
      setRevenueData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMonthlyRevenueData = async () => {
    try {
      const response = await api.get<{ monthsWithRevenue: any[] }>(
        "/dashboard/revenue/months"
      );
      setMonthlyRevenueData(response.data.monthsWithRevenue);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEliteCustomers = async () => {
    try {
      const response = await api.get<any[]>("/dashboard/customers");
      setEliteCustomers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRevenueData(selectedMonth, 2024); // Gọi dữ liệu doanh thu cho năm 2024
    fetchMonthlyRevenueData(); // Gọi dữ liệu doanh thu hàng tháng
    fetchEliteCustomers(); // Gọi dữ liệu khách hàng ưu tú
  }, [selectedMonth]);

  const handleMonthChange = (value: number) => {
    setSelectedMonth(value);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <div className="box">
            <div className="content">
              <div className="booking-title">Số lượng Booking</div>
              <div className="booking-content">
                {data?.totalbookings?.toLocaleString() || "0"}
                <span>
                  <CalendarOutlined />
                </span>
              </div>
              <div className="booking-unit">Lượt Đặt lịch</div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="box">
            <div className="content">
              <div className="booking-title">Số lượng Khách Hàng</div>
              <div className="booking-content">
                {data?.customercount?.toLocaleString() || "0"}
                <span>
                  <UserOutlined />
                </span>
              </div>
              <div className="booking-unit">Khách hàng</div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="box">
            <div className="content">
              <div className="booking-title">Số lượng Stylist</div>
              <div className="booking-content">
                {data?.stylistcount?.toLocaleString() || "0"}
                <span>
                  <ScissorOutlined />
                </span>
              </div>
              <div className="booking-unit">Dày dạn kinh nghiệm</div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="box">
            <div className="content">
              <div className="booking-title">Số lượng Dịch Vụ</div>
              <div className="booking-content">
                {data?.serviceofstylistcount || "0"}
                <span>
                  <AppstoreAddOutlined />
                </span>
              </div>
              <div className="booking-unit">Sẵn sàng phục vụ quý khách</div>
            </div>
          </div>
        </Col>
      </Row>

      <Card title="Top Khách Hàng tiềm năng Nhất" style={{ marginTop: 16 }}>
        <Table
          columns={[
            {
              title: "Khách Hàng",
              dataIndex: "fullName",
              key: "fullName",
            },
          ]}
          dataSource={eliteCustomers}
          rowKey="fullName"
          pagination={false}
        />
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="Top 3 Stylist có lượng booking cao nhất"
            style={{ marginTop: 16 }}
          >
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={
                    data?.topStylists?.map((stylist, index) => ({
                      name: stylist.stylistName,
                      value: stylist.bookingCount,
                      fill: `hsl(${
                        (index * 360) / data.topStylists.length
                      }, 80%, 50%)`,
                    })) || []
                  }
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                />
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Top 5 Dịch vụ được quan tâm" style={{ marginTop: 16 }}>
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={
                    data?.top5services?.map((service, index) => ({
                      name: service.serviceName,
                      value: service.bookingCount,
                      fill: `hsl(${
                        (index * 360) / data.top5services.length
                      }, 90%, 50%)`,
                    })) || []
                  }
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                />
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Doanh Thu Theo Tháng" style={{ marginTop: 16 }}>
        <Select
          defaultValue={selectedMonth}
          onChange={handleMonthChange}
          style={{ width: 120 }}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <Option key={index + 1} value={index + 1}>
              Tháng {index + 1}
            </Option>
          ))}
        </Select>
        <div style={{ marginTop: 16 }}>
          <h3>
            Tổng Doanh Thu:{" "}
            {revenueData?.totalRevenue
              ? Number(revenueData.totalRevenue).toLocaleString()
              : "0"}{" "}
            VNĐ
          </h3>
          <p>
            Tháng: {revenueData?.month}, Năm: {revenueData?.year}
          </p>
        </div>
      </Card>

      <Card title="Biểu Đồ Doanh Thu 12 Tháng" style={{ marginTop: 16 }}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

export default DashboardStatistic;

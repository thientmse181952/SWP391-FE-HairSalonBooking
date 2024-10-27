/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Statistic as AntStatistic, Table, Select } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { Pie, PieChart } from "recharts";

const { Option } = Select;

function DashboardStatistic() {
  const [data, setData] = useState<any>({});
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // Mặc định tháng 10
  const [revenueData, setRevenueData] = useState<any>({});
  const [eliteCustomers, setEliteCustomers] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRevenueData = async (month: number, year: number) => {
    try {
      const response = await api.get(`/dashboard/revenue/${month}/${year}`);
      setRevenueData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEliteCustomers = async () => {
    try {
      const response = await api.get("/dashboard/customers");
      setEliteCustomers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRevenueData(selectedMonth, 2024); // Gọi dữ liệu doanh thu cho năm 2024
    fetchEliteCustomers(); // Gọi dữ liệu khách hàng ưu tú
  }, [selectedMonth]);

  const handleMonthChange = (value: number) => {
    setSelectedMonth(value);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false}>
            <AntStatistic
              title="Total Bookings"
              value={data?.totalbookings}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix=" bookings"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <AntStatistic
              title="Customer Count"
              value={data?.customercount}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix=" customers"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <AntStatistic
              title="Stylist Count"
              value={data?.stylistcount}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix=" stylists"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <AntStatistic
              title="Service of Stylist Count"
              value={data?.serviceofstylistcount}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix=" services"
            />
          </Card>
        </Col>
      </Row>

      <PieChart width={730} height={250}>
        <Pie data={data?.top5services?.map(service => ({
          name: service.serviceName,
          value: service.bookingCount,
        })) || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
        <Pie data={data?.topStylists?.map(stylist => ({
          name: stylist.stylistName,
          value: stylist.bookingCount,
        })) || []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
      </PieChart>

      <Card title="Top 5 Services" style={{ marginTop: 16 }}>
        <Table
          columns={[
            {
              title: 'Service Name',
              dataIndex: 'serviceName',
              key: 'serviceName',
            },
            {
              title: 'Booking Count',
              dataIndex: 'bookingCount',
              key: 'bookingCount',
            },
          ]}
          dataSource={data?.top5services}
          rowKey="serviceId"
          pagination={false}
        />
      </Card>

      <Card title="Top Stylists" style={{ marginTop: 16 }}>
        <Table
          columns={[
            {
              title: 'Stylist Name',
              dataIndex: 'stylistName',
              key: 'stylistName',
            },
            {
              title: 'Booking Count',
              dataIndex: 'bookingCount',
              key: 'bookingCount',
            },
          ]}
          dataSource={data?.topStylists}
          rowKey="stylistId"
          pagination={false}
        />
      </Card>

      <Card title="Doanh Thu Theo Tháng" style={{ marginTop: 16 }}>
        <Select defaultValue={selectedMonth} onChange={handleMonthChange} style={{ width: 120 }}>
          {Array.from({ length: 12 }, (_, index) => (
            <Option key={index + 1} value={index + 1}>
              Tháng {index + 1}
            </Option>
          ))}
        </Select>
        <div style={{ marginTop: 16 }}>
          <h3>Tổng Doanh Thu: {revenueData?.totalRevenue || "0"} VNĐ</h3>
          <p>Tháng: {revenueData?.month}, Năm: {revenueData?.year}</p>
        </div>
      </Card>

      <Card title="Khách Hàng Ưu Tú Nhất" style={{ marginTop: 16 }}>
        <Table
          columns={[
            {
              title: 'Khách Hàng',
              dataIndex: 'fullName',
              key: 'fullName',
            },
          ]}
          dataSource={eliteCustomers}
          rowKey="fullName"
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default DashboardStatistic;

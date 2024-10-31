/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Statistic as AntStatistic, Table, Select } from "antd";
import { ArrowUpOutlined, ScissorOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { CalendarOutlined, UserOutlined, AppstoreAddOutlined, CustomerServiceOutlined } from '@ant-design/icons';
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
import { Value } from "sass";

const { Option } = Select;

function DashboardStatistic() {
  const [data, setData] = useState<any>({});
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // Mặc định tháng 10
  const [revenueData, setRevenueData] = useState<any>({});
  const [eliteCustomers, setEliteCustomers] = useState<any[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any[]>([]); // Dữ liệu doanh thu hàng tháng

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

  const fetchMonthlyRevenueData = async () => {
    try {
      const response = await api.get("/dashboard/revenue/months");
      console.log(response.data);
      setMonthlyRevenueData(response.data.monthsWithRevenue);
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
    fetchMonthlyRevenueData(); // Gọi dữ liệu doanh thu hàng tháng
    fetchEliteCustomers(); // Gọi dữ liệu khách hàng ưu tú
  }, [selectedMonth]);

  const handleMonthChange = (value: number) => {
    setSelectedMonth(value);
  };

  return (
    <div>
      <Row gutter={16}>
        {/* <Col span={8}>
          <Card bordered={false}>
            <AntStatistic
              title="Total Bookings"
              value={data?.totalbookings}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix=" bookings"
            />
          </Card>
        </Col> */}
        <Col span={6}>
          <div className="box">
            <span></span>

            <div className="content">
              <div class="booking-title">Số lượng Booking</div>
              <div class="booking-content">
              {data?.totalbookings}
                <span>
                <CalendarOutlined />

                  
                </span>
              </div>
              <div class="booking-unit">Lượt Đặt lịch</div>
            </div>
          </div>
        </Col>
        {/* <Col span={8}>
          <Card bordered={false}>
            <AntStatistic
              title="Customer Count"
              value={data?.customercount}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix=" customers"
            />
          </Card>
        </Col> */}
        <Col span={6}>
          <div className="box">
            <span></span>

            <div className="content">
              <div class="booking-title">Số lượng Khách Hàng</div>
              <div class="booking-content">
              {data?.customercount}
                <span>
                <UserOutlined />
                  
                </span>
              </div>
              <div class="booking-unit">Khách hàng</div>
            </div>
          </div>
        </Col>

        {/* <Col span={8}>
          <Card bordered={false}>
            <AntStatistic
              title="Stylist Count"
              value={data?.stylistcount}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix=" stylists"
            />
          </Card>
        </Col> */}

        <Col span={6}>
          <div className="box">
            <span></span>

            <div className="content">
              <div class="booking-title">Số lượng Stylist</div>
              <div class="booking-content">
              {data?.stylistcount}
                <span>
                <ScissorOutlined />
                  
                </span>
              </div>
              <div class="booking-unit">Dày dặn kinh nghiệm</div>
            </div>
          </div>
        </Col>


        {/* <Col span={8}>
          <Card bordered={false}>
            <AntStatistic
              title="Service of Stylist Count"
              value={data?.serviceofstylistcount}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix=" services"
            />
          </Card>
        </Col> */}

        <Col span={6}>
          <div className="box">
            <span></span>

            <div className="content">
              <div class="booking-title">Số lượng Dịch Vụ</div>
              <div class="booking-content">
              {data?.stylistcount}
                <span>
                <AppstoreAddOutlined />
                  
                </span>
              </div>
              <div class="booking-unit">Sẵn sàng phục vụ quý khách</div>
            </div>
          </div>
        </Col>
      </Row>

      {/* <Card title="Top 3 Stylists" style={{ marginTop: 16 }}>
        <Table
          columns={[
            {
              title: "Stylist Name",
              dataIndex: "stylistName",
              key: "stylistName",
            },
            {
              title: "Booking Count",
              dataIndex: "bookingCount",
              key: "bookingCount",
            },
          ]}
          dataSource={data?.topStylists}
          rowKey="stylistId"
          pagination={false}
        />
      </Card> */}
      
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
      <Card title="Top 3 Stylist có lượng booking cao nhất" style={{ marginTop: 16 }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={
                data?.topStylists?.map((stylist, index) => ({
                  name: stylist.stylistName,
                  value: stylist.bookingCount,
                  fill: `hsl(${
                    (index * 360) / data.topStylists.length
                  }, 55%, 50%)`, // Tạo màu sắc khác nhau cho mỗi stylist
                })) || []
              }
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            />
            <Legend/>
            <Tooltip />
          </PieChart>
          
        </ResponsiveContainer>


      </Card>



      </Col>

      
      {/* <Card title="Top 5 Services" style={{ marginTop: 16 }}>
        <Table
          columns={[
            {
              title: "Service Name",
              dataIndex: "serviceName",
              key: "serviceName",
            },
            {
              title: "Booking Count",
              dataIndex: "bookingCount",
              key: "bookingCount",
            },
          ]}
          dataSource={data?.top5services}
          rowKey="serviceId"
          pagination={false}
        />
      </Card> */}

        <Col span={12}>
        <Card title="Top 5 Dịch vụ được quan tâm" style={{ marginTop: 16 }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={
                data?.top5services?.map((service, index) => ({
                  name: service.serviceName,
                  value: service.bookingCount,
                  fill: `hsl(${
                    (index * 360) / data.top5services.length
                  }, 60%, 50%)`, // Tạo màu sắc khác nhau cho mỗi stylist
                })) || []
              }
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            />
            <Legend/>
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
          <h3>Tổng Doanh Thu: {revenueData?.totalRevenue || "0"} VNĐ</h3>
          <p>
            Tháng: {revenueData?.month}, Năm: {revenueData?.year}
          </p>
        </div>
      </Card>

      <Card title="Biểu Đồ Doanh Thu 12 Tháng" style={{ marginTop: 16 }}>
        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalRevenue" fill="#3f8600" />
          </BarChart>

        </ResponsiveContainer>
      </Card>

    </div>
  );
}

export default DashboardStatistic;
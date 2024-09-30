<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select, Typography, Calendar } from "antd";
import { useForm } from "antd/lib/form/Form"; 
import { RuleObject } from "rc-field-form/lib/interface"; 
import { Store } from "antd/lib/form/interface"; 
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import axios from "axios"; 
import { Outlet } from "react-router-dom"; 

import { DatePicker, Space } from "antd";

const { RangePicker } = DatePicker;

const { Option } = Select;
const { Title } = Typography;

const AdminCalendarManagement: React.FC = () => {
  const [form] = useForm();
  const [selectedStylist, setSelectedStylist] = useState<string | undefined>(undefined);
  const stylistOptions = [
    { id: '1', name: 'Stylist 1' },
    { id: '2', name: 'Stylist 2' },
    { id: '3', name: 'Stylist 3' },
  ];

  const onFinish = (values: Store): void => {
    console.log("Success:", values);
    updateUser(values);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity): void => {
    console.log("Failed:", errorInfo);
  };

  const handleStylistChange = (value: string) => {
    setSelectedStylist(value);
  };

  const onDateSelect = (date: any) => {
    console.log("Ngày đã chọn:", date.format("YYYY-MM-DD"));
  };



  return (
    <div className="card">
      <Title level={2}>Quản Lý Lịch Stylist</Title>
      <Form>
      
        <Form.Item label="Chọn Stylist">
          <Select
            placeholder="Chọn Stylist"
            style={{ width: 200 }}
            onChange={handleStylistChange}
          >
            {stylistOptions.map(stylist => (
              <Option key={stylist.id} value={stylist.name}>
                {stylist.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        
      </Form>

      <div style={{ marginTop: '20px' }}>
        <Calendar onSelect={onDateSelect} />
      </div>

      <div style={{ marginTop: '20px' }}>
        {selectedStylist && <Title level={4}>Stylist đã chọn: {selectedStylist}</Title>}
      </div>

      
  <Space direction="vertical" size={12}>
    <RangePicker />
    <RangePicker showTime />
    <RangePicker picker="week" />
    <RangePicker picker="month" />
    <RangePicker picker="quarter" />
    <RangePicker
      picker="year"
      id={{
        start: 'startInput',
        end: 'endInput',
      }}
      onFocus={(_, info) => {
        console.log('Focus:', info.range);
      }}
      onBlur={(_, info) => {
        console.log('Blur:', info.range);
      }}
    />
  </Space>

      <Form.Item className="submit-button">
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
    </div>
  );
=======
import React from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'Category 1',
        value: 'Category 1',
        children: [
          {
            text: 'Yellow',
            value: 'Yellow',
          },
          {
            text: 'Pink',
            value: 'Pink',
          },
        ],
      },
      {
        text: 'Category 2',
        value: 'Category 2',
        children: [
          {
            text: 'Green',
            value: 'Green',
          },
          {
            text: 'Black',
            value: 'Black',
          },
        ],
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.name.includes(value as string),
    width: '30%',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filters: [
      {
        text: 'London',
        value: 'London',
      },
      {
        text: 'New York',
        value: 'New York',
      },
    ],
    onFilter: (value, record) => record.address.startsWith(value as string),
    filterSearch: true,
    width: '40%',
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
>>>>>>> admin-panel
};

const App: React.FC = () => (
  <Table<DataType> columns={columns} dataSource={data} onChange={onChange} />
);

export default App;
import React from "react";
import { Button, Form, Input } from "antd";
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { 
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from 'antd';
import "./index.scss"

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const AdminServiceManagement: React.FC = () => {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);

  return (
    <>
    <div className="card">

      <h1>THÊM DỊCH VỤ MỚI</h1>
      <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        disabled={componentDisabled}
        style={{ maxWidth: 600 }}
      >
        
      
        <Form.Item label="Fullname">
          <Input />
        </Form.Item>
        <Form.Item label="Gender">
          <Radio.Group>
            <Radio value="apple"> Male </Radio>
            <Radio value="pear"> Female </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Select">
          <Select>
            <Select.Option value="demo">Stylist</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Dịch vụ">
          <TreeSelect
            treeData={[
              { title: 'Cắt tóc', value: 'light', children: [{ title: 'Nam', value: 'nữ' }] },
            ]}
          />
        </Form.Item>
        <Form.Item label="Dịch vụ khác" name="disabled" valuePropName="checked">
          <Checkbox>Cắt tóc kiểu</Checkbox>
          <Checkbox>Uốn tóc</Checkbox>
          <Checkbox>Dưỡng tóc</Checkbox>
          <Checkbox>Gội đầu thư giản</Checkbox>
          <Checkbox>Nhuộm thời trang</Checkbox>
          <Checkbox>Hấp dầu</Checkbox>

        </Form.Item>
        <Form.Item label="Cascader">
          <Cascader
            options={[
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                  {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                  },
                ],
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="DatePicker">
          <DatePicker />
        </Form.Item>
        <Form.Item label="RangePicker">
          <RangePicker />
        </Form.Item>
        <Form.Item label="tuổi">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Ghi chú">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Chính thức" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Upload Ảnh đại diện" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload action="/upload.do" listType="picture-card">
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button>Đăng Ký Stylist</Button>
        </Form.Item>
        {/* <Form.Item label="Slider">
          <Slider />
        </Form.Item> */}
        {/* <Form.Item label="ColorPicker">
          <ColorPicker />
        </Form.Item> */}
        {/* <Form.Item label="Rate">
          <Rate />
        </Form.Item> */}
      </Form>
      </div>
    </>
  );
};

export default () => <AdminServiceManagement />;

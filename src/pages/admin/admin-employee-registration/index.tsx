import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Image,
  Modal,
  Upload,
  Radio,
  InputNumber,
  Checkbox,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Stylist {
  name: string;
  age: number;
  phone: string;
  avatarUrl: string;
  role: string;
  password: string;
  confirmPassword: string;
}

const AdminAddStylist: React.FC = () => {
  const [stylist, setStylist] = useState<Stylist>({
    name: "",
    age: "",
    phone: "",
    avatarUrl: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [showModal, setShowmodal] = useState<boolean>(false);

  const handleChange = (changedValues: any) => {
    setStylist((prev) => ({ ...prev, ...changedValues }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = (values: Stylist) => {
    if (values.password !== values.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    console.log("Thêm stylist:", values);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity): void => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h1>QUẢN LÝ STYLIST</h1>
      <br />
      <Form
        layout="vertical"
        initialValues={stylist}
        onValuesChange={handleChange}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          {isEditing ? <Input /> : <span>{stylist.name}</span>}
        </Form.Item>

        <Form.Item
          label="Tuổi"
          name="age"
          rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
        >
          {isEditing ? <Input type="number" /> : <span>{stylist.age}</span>}
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          {isEditing ? <Input /> : <span>{stylist.phone}</span>}
        </Form.Item>

        <Form.Item
          label="Ảnh đại diện"
          name="avatarUrl"
          rules={[{ required: true, message: "Vui lòng nhập URL ảnh!" }]}
        >
          {isEditing ? <Input /> : <Image src={stylist.avatarUrl} width={50} />}
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          {isEditing ? (
            <Select>
              <Select.Option value="option1">Cắt tóc</Select.Option>
              <Select.Option value="option2">Uốn tóc</Select.Option>
              <Select.Option value="option3">Dưỡng tóc</Select.Option>
            </Select>
          ) : (
            <span>{stylist.role}</span>
          )}
        </Form.Item>

        {isEditing && (
          <>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}

        <Form.Item>
          {isEditing ? (
            <Button type="primary" htmlType="submit">
              Lưu thông tin
            </Button>
          ) : (
            <Button type="default" onClick={handleEdit}>
              Sửa thông tin
            </Button>
          )}
        </Form.Item>
      </Form>

      <Button
        type="primary"
        htmlType="submit"
        style={{ marginLeft: "8px" }}
        onClick={() => setShowmodal(true)}
      >
        Thêm Stylist
      </Button>

      <Modal
        open={showModal}
        onCancel={() => {
          setShowmodal(false);
        }}
      >
        <Form 
        labelCol={{ span: 24 }}
        onFinishFailed={onFinishFailed}
        >
          <h1>THÊM THÔNG TIN STYLIST MỚI</h1>
          <br />
          <Form.Item
            label="Họ và Tên của Stylist"
            name="fullname"
            rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tuổi"
            name="age"
            rules={[
              { required: true, message: "Vui lòng nhập tuổi!" },
              { min: 20 }
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Radio.Group>
              <Radio value="Male">Nam</Radio>
              <Radio value="Female">Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Email của stylist"
            name="email"
            rules={[
              { required: false, message: "Vui lòng nhập email của bạn!" },
              { type: "email", message: "Vui lòng nhập địa chỉ email hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Dịch vụ khác"
            name="disabled"
            valuePropName="checked"
          >
            <Checkbox>Cắt tóc kiểu</Checkbox>
            <Checkbox>Uốn tóc</Checkbox>
            <Checkbox>Dưỡng tóc</Checkbox>
            <Checkbox>Gội đầu thư giản</Checkbox>
            <Checkbox>Nhuộm thời trang</Checkbox>
            <Checkbox>Hấp dầu</Checkbox>
          </Form.Item>

          <Form.Item label="Upload Ảnh đại diện" valuePropName="fileList">
            <Upload action="/upload.do" listType="picture-card">
              <button style={{ border: 0, background: "none" }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </Form.Item>

          <br />
          <h1>TẠO TÀI KHOẢN CHO STYLIST</h1>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại của bạn!",
              },
              { pattern: /^[0-9]+$/, message: "Số điện thoại phải là chữ số!" },
              { len: 10, message: "Số điện thoại phải đúng 10 chữ số!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật Khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="rePassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu của bạn!",
              },
              ({ getFieldValue }) => ({
                validator(_: RuleObject, value: string) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Hai mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          
        </Form>
      </Modal>
    </div>
  );
};

export default AdminAddStylist;

import React, { useState } from "react";
import { Table, Rate, DatePicker } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import moment from "moment";

interface FeedbackType {
  key: React.Key;
  name: string; // Thêm trường để lưu tên
  phoneNumber: string;
  serviceName: string;
  appointmentDate: string; // Thêm trường để lưu thời điểm cắt
  feedback: string;
  rating: number;
}

const StylistFeedback: React.FC = () => {
  const [filteredDate, setFilteredDate] = useState<moment.Moment | null>(null);

  const handleDateChange = (date: moment.Moment | null) => {
    setFilteredDate(date);
  };

  const columns: TableColumnsType<FeedbackType> = [
    {
      title: "Tên",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "SĐT Khách Hàng",
      dataIndex: "phoneNumber",
      filterSearch: true,
      onFilter: (value, record) => record.phoneNumber.includes(value as string),
      width: "20%",
    },
    {
      title: "Tên Dịch Vụ",
      dataIndex: "serviceName",
      filters: [
        { text: "Cắt Tóc", value: "Cắt Tóc" },
        { text: "Nhuộm Tóc", value: "Nhuộm Tóc" },
        { text: "Gội Đầu", value: "Gội Đầu" },
        { text: "Tạo Kiểu", value: "Tạo Kiểu" },
      ],
      onFilter: (value, record) => record.serviceName.includes(value as string),
      width: "20%",
    },
    {
      title: "Thời Điểm Cắt",
      dataIndex: "appointmentDate",
      render: (date: string) => moment(date).format("DD/MM/YYYY"),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <DatePicker
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            style={{ marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      onFilter: (value, record) => {
        if (!filteredDate) return true;
        return moment(record.appointmentDate).isSame(filteredDate, 'day');
      },
      width: "20%",
    },
    {
      title: "Nội Dung Phản Hồi",
      dataIndex: "feedback",
      width: "30%",
    },
    {
      title: "Đánh Giá",
      dataIndex: "rating",
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
      width: "10%",
    },
  ];

  const data: FeedbackType[] = [
    {
      key: "1",
      name: "Nguyễn Văn A",
      phoneNumber: "0123456789",
      serviceName: "Cắt Tóc",
      appointmentDate: "2024-10-01",
      feedback: "Dịch vụ rất tốt, nhân viên thân thiện.",
      rating: 5,
    },
    {
      key: "2",
      name: "Trần Thị B",
      phoneNumber: "0987654321",
      serviceName: "Nhuộm Tóc",
      appointmentDate: "2024-10-02",
      feedback: "Màu nhuộm rất đẹp nhưng hơi lâu.",
      rating: 4,
    },
    {
      key: "3",
      name: "Lê Văn C",
      phoneNumber: "0912345678",
      serviceName: "Gội Đầu",
      appointmentDate: "2024-10-03",
      feedback: "Gội đầu rất nhẹ nhàng và thư giãn.",
      rating: 5,
    },
    {
      key: "4",
      name: "Phạm Thị D",
      phoneNumber: "0934567890",
      serviceName: "Tạo Kiểu",
      appointmentDate: "2024-10-04",
      feedback: "Kiểu tóc rất đẹp, tôi rất hài lòng.",
      rating: 5,
    },
    // 10 đánh giá khác nhau với số sao ít hơn
    {
      key: "5",
      name: "Nguyễn Văn E",
      phoneNumber: "0123456780",
      serviceName: "Cắt Tóc",
      appointmentDate: "2024-10-05",
      feedback: "Dịch vụ khá tốt nhưng thời gian chờ hơi lâu.",
      rating: 3,
    },
    {
      key: "6",
      name: "Trần Thị F",
      phoneNumber: "0987654320",
      serviceName: "Nhuộm Tóc",
      appointmentDate: "2024-10-06",
      feedback: "Màu nhuộm không như mong đợi.",
      rating: 2,
    },
    {
      key: "7",
      name: "Lê Văn G",
      phoneNumber: "0912345679",
      serviceName: "Gội Đầu",
      appointmentDate: "2024-10-07",
      feedback: "Gội đầu bình thường, không có gì đặc biệt.",
      rating: 3,
    },
    {
      key: "8",
      name: "Phạm Thị H",
      phoneNumber: "0934567891",
      serviceName: "Tạo Kiểu",
      appointmentDate: "2024-10-08",
      feedback: "Kiểu tóc không phù hợp với tôi.",
      rating: 2,
    },
    {
      key: "9",
      name: "Nguyễn Văn I",
      phoneNumber: "0123456781",
      serviceName: "Cắt Tóc",
      appointmentDate: "2024-10-09",
      feedback: "Dịch vụ tốt nhưng giá hơi cao.",
      rating: 3,
    },
    {
      key: "10",
      name: "Trần Thị J",
      phoneNumber: "0987654322",
      serviceName: "Nhuộm Tóc",
      appointmentDate: "2024-10-10",
      feedback: "Màu nhuộm nhanh phai.",
      rating: 2,
    },
    {
      key: "11",
      name: "Lê Văn K",
      phoneNumber: "0912345680",
      serviceName: "Gội Đầu",
      appointmentDate: "2024-10-11",
      feedback: "Gội đầu không được sạch.",
      rating: 3,
    },
    {
      key: "12",
      name: "Phạm Thị L",
      phoneNumber: "0934567892",
      serviceName: "Tạo Kiểu",
      appointmentDate: "2024-10-12",
      feedback: "Kiểu tóc không như hình mẫu.",
      rating: 2,
    },
  ];

  const onChange: TableProps<FeedbackType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <Table<FeedbackType> columns={columns} dataSource={data} onChange={onChange} />
  );
};

export default StylistFeedback;

import { Button, Result, Typography } from "antd";
import api from "../../config/axios";
import { useEffect } from "react";
import useGetParams from "../../hooks/useGetParams";
import { useNavigate } from "react-router-dom";

const { Paragraph, Text } = Typography;

function PaymentPage() {
  const params = useGetParams();
  const navigate = useNavigate();
  const vnp_OrderInfo: string | null = params("vnp_OrderInfo"); // Lấy bookingId từ vnp_OrderInfo
  const vnp_TransactionStatus: string | null = params("vnp_TransactionStatus");
  const vnp_Amount: string | null = params("vnp_Amount"); // Lấy số tiền
  const paymentDate = new Date().toISOString().split("T")[0]; // Ngày thanh toán hiện tại
  const paymentType = "transfer"; // Loại thanh toán

  console.log("Booking ID:", vnp_OrderInfo);
  console.log("Status: ", vnp_TransactionStatus);
  console.log("Amount:", vnp_Amount);
  console.log("Payment Date:", paymentDate);
  console.log("Payment Type:", paymentType);

  useEffect(() => {
    if (vnp_TransactionStatus === "00" && vnp_OrderInfo) {
      // Nếu trạng thái giao dịch thành công
      const paymentData = {
        paymentId: 0, // Hoặc giá trị ID thực tế nếu có
        amount: vnp_Amount / 100, // Số tiền (chia 100 để lấy giá trị thực)
        payment_date: paymentDate, // Ngày thanh toán
        payment_type: paymentType, // Loại thanh toán
        bookingId: [vnp_OrderInfo], // Lấy từ vnp_OrderInfo
      };

      // Log dữ liệu gửi về API
      console.log("Data sent to API:", paymentData);

      // Gọi API để lưu thông tin thanh toán
      api
        .post("/payment/createPayment", paymentData)
        .then(async (response) => {
          console.log("Response:", response.data); // Log phản hồi từ API

          // Gọi API để cập nhật trạng thái của booking
          try {
            await api.put(
              `/bookings/${vnp_OrderInfo}/status`, // Sử dụng vnp_OrderInfo làm bookingId
              "paid",
              {
                headers: {
                  "Content-Type": "text/plain",
                },
              }
            );
            console.log("Booking status updated to paid.");
          } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái booking:", error);
          }
        })
        .catch((e) => {
          console.error("Lỗi khi gửi thông tin thanh toán:", e);
        });
    } else {
      // Chuyển đến trang thanh toán thất bại (thêm logic ở đây nếu cần)
    }
  }, [vnp_TransactionStatus, vnp_OrderInfo]); // Thêm vnp_OrderInfo vào mảng phụ thuộc

  if (vnp_TransactionStatus === "00") {
    // Nếu giao dịch thành công
    return (
      <div>
        <Result
          status="success"
          title="Thanh Toán Thành Công!"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => navigate("/stylistpage/stylistSchedule")}
            >
              Quay về danh sách lịch
            </Button>,
          ]}
        />
      </div>
    );
  } else if (vnp_TransactionStatus === "02") {
    // Nếu giao dịch thất bại
    return (
      <div>
        <Result
          status="error"
          title="Thanh Toán Thất Bại"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => navigate("/stylistpage/stylistSchedule")}
            >
              Quay về danh sách lịch
            </Button>,
          ]}
        ></Result>
      </div>
    );
  } else {
    return <div>Invalid transaction status.</div>;
  }
}

export default PaymentPage;

import React, { useState, useEffect, useRef } from "react";
import "./index.scss";
import { DatePicker, Button, Select, message } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import api from "../../config/axios";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const { Option } = Select;

const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedServices, setSelectedServices] = useState<number[]>([]); // Chọn nhiều service
  const [selectedStylist, setSelectedStylist] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [serviceDurations, setServiceDurations] = useState<number[]>([]); // Lưu trữ duration của nhiều service
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [availableStylists, setAvailableStylists] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState([
    { time: "9:00 AM", status: "available" },
    { time: "10:00 AM", status: "available" },
    { time: "11:00 AM", status: "available" },
    { time: "12:00 PM", status: "available" },
    { time: "13:00 PM", status: "available" },
    { time: "14:00 PM", status: "available" },
    { time: "15:00 PM", status: "available" },
    { time: "16:00 PM", status: "available" },
    { time: "17:00 PM", status: "available" },
    { time: "18:00 PM", status: "available" },
    { time: "19:00 PM", status: "available" },
  ]);

  const stylistsRef = useRef<any[]>([]);

  useEffect(() => {
    const accountId = localStorage.getItem("accountId"); // Lấy accountId từ localStorage
    console.log("AccountId:", accountId);
    if (!accountId) {
      // Nếu không có accountId, hiển thị thông báo yêu cầu đăng nhập
      message.error("Vui lòng đăng nhập để sử dụng dịch vụ");
      return;
    }

    const fetchCustomerId = async () => {
      try {
        const response = await api.get("/customer");
        setCustomerId(response.data[0].id);
      } catch (error) {
        console.error("Lỗi khi lấy customer_id:", error);
        message.error("Không thể lấy thông tin khách hàng.");
      }
    };
    fetchCustomerId();

    const fetchServices = async () => {
      try {
        const response = await api.get("/service/getService");
        setServices(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
        message.error("Không thể tải danh sách dịch vụ.");
      }
    };
    fetchServices();
  }, []); // Chạy một lần khi vào trang

  // useEffect để tính toán stylist khi thay đổi dịch vụ hoặc ngày
  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await api.get("/account");
        const stylistAccounts = response.data.filter(
          (account: any) => account.role === "STYLIST"
        );

        const bookingsResponse = await api.get("/bookings/getBooking");
        const schedulesResponse = await api.get("/schedules");

        const updatedAvailableStylists = stylistAccounts.filter(
          (stylist: any) => {
            // Thực hiện logic để kiểm tra stylist có slot khả dụng hay không
            // Sau đó trả về stylist có slot khả dụng
            return true; // Giả sử stylist này có slot khả dụng
          }
        );

        // Lưu danh sách stylist vào stylistsRef
        stylistsRef.current = updatedAvailableStylists;

        // Cập nhật state để hiển thị danh sách stylist
        setAvailableStylists([...updatedAvailableStylists]);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách stylist:", error);
        message.error("Không thể tải danh sách stylist.");
      }
    };

    fetchStylists();
  }, [selectedDate, selectedServices]);

  // Thêm selectedDate và timeSlots làm dependencies để load lại khi thay đổi

  const toggleSlotVisibility = () => {
    setShowAllSlots(!showAllSlots); // Đảo ngược trạng thái hiển thị
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  // Logic kiểm tra stylist và ánh xạ đúng lịch nghỉ
  const handleServiceChange = async (values: number[]) => {
    setSelectedServices(values);

    // Tính tổng duration từ các dịch vụ đã chọn
    const selectedDurations = values.map((id) => {
      const selectedService = services.find((service) => service.id === id);
      return selectedService ? selectedService.duration : 0;
    });
    setServiceDurations(selectedDurations);

    // Logic tính toán thời gian dự kiến và giá dự kiến
    const estimatedDuration = values.reduce((acc, id) => {
      const service = services.find((s) => s.id === id);
      return acc + (service ? parseInt(service.duration) : 0); // Đảm bảo duration là số nguyên
    }, 0);

    const estimatedPrice = values.reduce((acc, id) => {
      const service = services.find((s) => s.id === id);
      return acc + (service ? parseInt(service.price) : 0); // Đảm bảo price là số nguyên
    }, 0);

    console.log("Estimated duration:", estimatedDuration, "minutes");
    console.log("Estimated price:", estimatedPrice, "VND");

    setEstimatedDuration(estimatedDuration);
    setEstimatedPrice(estimatedPrice);

    let commonStylistIds = [];

    console.log("Selected Service IDs:", values); // Log các service được chọn

    try {
      // Duyệt qua từng dịch vụ được chọn và gọi API để lấy stylist có thể làm dịch vụ
      for (const serviceId of values) {
        const response = await api.get(`/service/${serviceId}`);
        const serviceData = response.data;

        console.log(`Service Data for Service ID ${serviceId}:`, serviceData); // Log dữ liệu dịch vụ trả về từ API

        // Lấy danh sách stylist account_id từ mỗi dịch vụ trả về
        const stylistIdsForService = serviceData.stylists.map(
          (stylist) => stylist.id // Lấy stylist ID
        );
        console.log(
          `Stylist IDs for Service ID ${serviceId}:`,
          stylistIdsForService
        ); // Log danh sách stylist ID cho mỗi service

        if (commonStylistIds.length === 0) {
          // Gán danh sách stylist của dịch vụ đầu tiên vào commonStylistIds
          commonStylistIds = stylistIdsForService;
        } else {
          // Lọc những stylist xuất hiện trong tất cả các dịch vụ đã chọn
          commonStylistIds = commonStylistIds.filter((id) =>
            stylistIdsForService.includes(id)
          );
        }
      }

      console.log("Common Stylist IDs after filtering:", commonStylistIds); // Log danh sách stylist sau khi lọc

      // Gọi API /api/account để lấy danh sách tất cả account
      const accountResponse = await api.get(`/account`);
      const allAccounts = accountResponse.data;

      console.log("All Accounts:", allAccounts);

      // **Đây là phần ánh xạ lại stylistID đúng với accountID và fullName**
      let availableStylists = commonStylistIds
        .map((stylistId) => {
          // Tìm account theo stylistId
          const account = allAccounts.find((acc) =>
            acc.stylists.some((stylist) => stylist.id === stylistId)
          );
          console.log(
            `Stylist ID ${stylistId} ánh xạ với account ID: ${
              account ? account.id : "Không tìm thấy"
            }, FullName: ${account ? account.fullName : "Không tìm thấy"}`
          ); // Log việc ánh xạ stylistId và accountId

          return account
            ? {
                id: stylistId,
                accountId: account.id,
                fullName: account.fullName,
              } // Ở đây sử dụng stylistId, không phải accountId
            : null;
        })
        .filter(Boolean); // Loại bỏ stylist null nếu không tìm thấy

      console.log("Render based on Common Stylist IDs:", availableStylists);

      // **New Logic: Kiểm tra stylist có slot khả dụng**
      const updatedAvailableStylists = [];
      for (const stylist of availableStylists) {
        const stylistId = stylist.id;

        // Gọi API để lấy booking và lịch nghỉ của stylist
        const bookingsResponse = await api.get("/bookings/getBooking");
        const stylistBookings = bookingsResponse.data.filter(
          (booking) => booking.stylist.id === stylistId
        );

        const schedulesResponse = await api.get("/schedules");
        const approvedLeaves = schedulesResponse.data.filter(
          (schedule) =>
            schedule.stylist.id === stylistId && schedule.status === "approved"
        );

        console.log(
          `Lịch nghỉ của stylist ${stylist.fullName}:`,
          approvedLeaves
        );

        // Kiểm tra nếu stylist còn slot nào khả dụng trong ngày được chọn
        let hasAvailableSlot = false;
        timeSlots.forEach((slot) => {
          const slotStart = dayjs(
            `${selectedDate.format("YYYY-MM-DD")} ${slot.time}`,
            ["YYYY-MM-DD h:mm A"]
          );

          const isOnLeave = approvedLeaves.some((leave) => {
            const leaveStart = dayjs(leave.startTime);
            const leaveEnd = dayjs(leave.endTime);
            console.log(
              `Checking leave for stylist ${stylist.fullName}: slotStart: ${slotStart}, leaveStart: ${leaveStart}, leaveEnd: ${leaveEnd}`
            );
            return (
              slotStart.isBetween(leaveStart, leaveEnd, null, "[)") ||
              slotStart.isSame(leaveStart)
            );
          });

          const isBooked = stylistBookings.some((booking) => {
            const bookingStart = dayjs(
              `${booking.appointmentDate} ${booking.startTime}`,
              "YYYY-MM-DD HH:mm:ss"
            );
            const bookingEnd = dayjs(
              `${booking.appointmentDate} ${booking.endTime}`,
              "YYYY-MM-DD HH:mm:ss"
            );
            return (
              slotStart.isSame(bookingStart) ||
              slotStart.isBetween(bookingStart, bookingEnd, null, "[)")
            );
          });

          console.log(
            `Slot: ${slot.time}, Booked: ${isBooked}, On Leave: ${isOnLeave}`
          ); // Log trạng thái của từng slot

          if (!isBooked && !isOnLeave) {
            hasAvailableSlot = true;
          }
        });

        console.log(
          `Stylist: ${stylist.fullName}, Has Available Slot: ${hasAvailableSlot}`
        ); // Log xem stylist này có slot nào khả dụng không

        // Nếu stylist có ít nhất 1 slot khả dụng, thêm vào danh sách
        if (hasAvailableSlot) {
          updatedAvailableStylists.push(stylist);
        }
      }

      console.log("Updated available stylists:", updatedAvailableStylists);

      // Cập nhật danh sách stylist để render ra
      setAvailableStylists(updatedAvailableStylists);
    } catch (error) {
      console.error("Lỗi khi lọc stylist:", error);
      message.error("Không thể lọc stylist.");
    }
  };

  const handleStylistChange = async (stylistID: number) => {
    setSelectedStylist(stylistID); // `stylistID` là stylist id
    console.log("Stylist được chọn (stylistID):", stylistID); // Log ra stylistID

    try {
      // Gọi API để lấy thông tin stylist dựa trên stylistID
      const response = await api.get(`/stylist/${stylistID}`);
      const selectedStylistData = response.data;

      // Log thông tin stylist để kiểm tra
      console.log("Thông tin stylist đã chọn:", selectedStylistData);

      if (!stylistID) {
        message.error("Không thể tìm thấy stylist ID cho stylist này.");
        return;
      }

      // Gọi API để lấy tất cả các booking của stylist này
      const bookingsResponse = await api.get("/bookings/getBooking");
      const allBookings = bookingsResponse.data;

      // Lọc các booking có stylistID khớp với stylist được chọn
      const stylistBookings = allBookings.filter(
        (booking: any) => booking.stylist.id === stylistID
      );

      console.log("Booking của stylist đã chọn:", stylistBookings);

      // **Thêm chức năng kiểm tra ngày nghỉ của stylist**
      const schedulesResponse = await api.get("/schedules");
      const approvedLeaves = schedulesResponse.data.filter(
        (schedule: any) =>
          schedule.stylist.id === stylistID && schedule.status === "approved"
      );

      console.log("Ngày nghỉ đã duyệt của stylist:", approvedLeaves);

      // **Bổ sung logic kiểm tra ngày nghỉ**
      const isOnLeave = approvedLeaves.some((leave: any) => {
        const leaveStart = dayjs(leave.startTime);
        const leaveEnd = dayjs(leave.endTime);
        console.log(
          `Kiểm tra ngày nghỉ từ ${leaveStart} đến ${leaveEnd} với ngày được chọn: ${selectedDate}`
        );
        return dayjs(selectedDate).isBetween(leaveStart, leaveEnd, null, "[)");
      });

      if (isOnLeave) {
        message.error("Stylist này đang nghỉ trong ngày đã chọn.");
        console.log("Stylist đang nghỉ, dừng xử lý.");
        return;
      }

      // **Bổ sung logic kiểm tra stylist có thể thực hiện dịch vụ**
      const serviceResponse = await Promise.all(
        selectedServices.map((serviceId) => api.get(`/service/${serviceId}`))
      );

      const availableForService = serviceResponse.every((service) =>
        service.data.stylists.some((stylist: any) => stylist.id === stylistID)
      );

      console.log(
        `Stylist có thể thực hiện dịch vụ đã chọn: ${availableForService}`
      );

      if (!availableForService) {
        message.error(
          "Stylist này không thể thực hiện tất cả các dịch vụ đã chọn."
        );
        console.log("Stylist không thể thực hiện tất cả dịch vụ, dừng xử lý.");
        return;
      }

      // **Log thông tin lọc stylist sau khi chọn stylist**
      console.log(
        "Stylist sau khi chọn (Kiểm tra ngày nghỉ và dịch vụ):",
        stylistID
      );

      // Duyệt qua từng slot thời gian và kiểm tra nếu nó đã được đặt hoặc trùng với lịch nghỉ
      const updatedTimeSlots = timeSlots.map((slot) => {
        const slotStart = dayjs(
          `${selectedDate.format("YYYY-MM-DD")} ${slot.time}`,
          ["YYYY-MM-DD h:mm A"]
        );

        // Kiểm tra nếu slotStart có phải là đối tượng dayjs hợp lệ không
        if (!dayjs.isDayjs(slotStart)) {
          console.error(
            "slotStart không phải là đối tượng dayjs hợp lệ:",
            slotStart
          );
          return slot; // Bỏ qua nếu slotStart không hợp lệ
        }

        // Kiểm tra nếu slot trùng với lịch nghỉ đã được approved
        const isOnLeave = approvedLeaves.some((leave: any) => {
          const leaveStart = dayjs(leave.startTime); // Convert lại leave startTime đúng với format
          const leaveEnd = dayjs(leave.endTime); // Convert lại leave endTime đúng với format

          console.log(
            `Kiểm tra slot ${slot.time} với ngày nghỉ từ ${leaveStart} đến ${leaveEnd}`
          );

          // Kiểm tra nếu slot nằm trong khoảng thời gian nghỉ
          return (
            slotStart.isBetween(leaveStart, leaveEnd, null, "[)") ||
            slotStart.isSame(leaveStart)
          );
        });

        // Kiểm tra xem slot có trùng với thời gian của bất kỳ booking nào không
        const isBooked = stylistBookings.some((booking: any) => {
          const bookingStart = dayjs(
            `${booking.appointmentDate} ${booking.startTime}`,
            "YYYY-MM-DD HH:mm:ss"
          );
          const bookingEnd = dayjs(
            `${booking.appointmentDate} ${booking.endTime}`,
            "YYYY-MM-DD HH:mm:ss"
          );

          // Kiểm tra nếu slotStart nằm giữa bookingStart và bookingEnd hoặc trùng với bookingStart
          console.log(
            `Kiểm tra slot ${slot.time} với booking từ ${bookingStart} đến ${bookingEnd}`
          );

          return (
            slotStart.isSame(bookingStart) ||
            slotStart.isBetween(bookingStart, bookingEnd, null, "[)")
          );
        });

        return {
          ...slot,
          status: isBooked || isOnLeave ? "unavailable" : "available", // Đánh dấu slot là unavailable nếu nó đã được đặt hoặc trùng với lịch nghỉ
        };
      });

      // Cập nhật lại state của timeSlots để giao diện cập nhật
      setTimeSlots(updatedTimeSlots);

      console.log(
        "Updated time slots with booking and leave status:",
        updatedTimeSlots
      );
    } catch (error) {
      console.error("Lỗi khi lấy danh sách booking hoặc lịch nghỉ:", error);
      message.error("Không thể tải danh sách booking hoặc lịch nghỉ.");
    }
  };

  const handleStylistClick = async (stylistID: number) => {
    setSelectedStylist(stylistID);
    console.log("Stylist được chọn:", stylistID);

    // Xử lý chỉ cần cập nhật timeSlots mà không làm thay đổi danh sách stylist
    try {
      const bookingsResponse = await api.get("/bookings/getBooking");
      const stylistBookings = bookingsResponse.data.filter(
        (booking: any) => booking.stylist.id === stylistID
      );

      const schedulesResponse = await api.get("/schedules");
      const approvedLeaves = schedulesResponse.data.filter(
        (schedule: any) =>
          schedule.stylist.id === stylistID && schedule.status === "approved"
      );

      // Cập nhật trạng thái các slot
      const updatedTimeSlots = timeSlots.map((slot) => {
        const slotStart = dayjs(
          `${selectedDate.format("YYYY-MM-DD")} ${slot.time}`,
          ["YYYY-MM-DD h:mm A"]
        );

        const isOnLeaveSlot = approvedLeaves.some((leave: any) => {
          const leaveStart = dayjs(leave.startTime);
          const leaveEnd = dayjs(leave.endTime);
          return (
            slotStart.isBetween(leaveStart, leaveEnd, null, "[)") ||
            slotStart.isSame(leaveStart)
          );
        });

        const isBooked = stylistBookings.some((booking: any) => {
          const bookingStart = dayjs(
            `${booking.appointmentDate} ${booking.startTime}`,
            "YYYY-MM-DD HH:mm:ss"
          );
          const bookingEnd = dayjs(
            `${booking.appointmentDate} ${booking.endTime}`,
            "YYYY-MM-DD HH:mm:ss"
          );
          return (
            slotStart.isSame(bookingStart) ||
            slotStart.isBetween(bookingStart, bookingEnd, null, "[)")
          );
        });

        return {
          ...slot,
          status: isBooked || isOnLeaveSlot ? "unavailable" : "available",
        };
      });

      setTimeSlots(updatedTimeSlots);
      console.log("Updated time slots:", updatedTimeSlots);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách booking hoặc lịch nghỉ:", error);
      message.error("Không thể tải danh sách booking hoặc lịch nghỉ.");
    }
  };

  const handleTimeSlotChange = (time: string) => {
    setSelectedTimeSlot(time);
  };

  const handleSubmit = async () => {
    if (
      !selectedTimeSlot ||
      selectedServices.length === 0 ||
      selectedStylist === null ||
      !localStorage.getItem("customerId") // Kiểm tra xem có customerId trong localStorage không
    ) {
      message.error("Vui lòng chọn đầy đủ các thông tin!");
      return;
    }

    try {
      const customerIdFromLocalStorage = localStorage.getItem("customerId"); // Lấy customerId từ localStorage

      console.log(
        "Customer ID đang được truyền vào API:",
        customerIdFromLocalStorage
      );
      let commonStylistIds = [];

      for (const serviceId of selectedServices) {
        const response = await api.get(`/service/${serviceId}`);
        const serviceData = response.data;

        const stylistIdsForService = serviceData.stylists.map(
          (stylist) => stylist.id
        );

        if (commonStylistIds.length === 0) {
          commonStylistIds = stylistIdsForService;
        } else {
          commonStylistIds = commonStylistIds.filter((id) =>
            stylistIdsForService.includes(id)
          );
        }
      }

      console.log("Common Stylist IDs after filtering:", commonStylistIds);

      const stylistID = selectedStylist;

      if (!stylistID) {
        message.error("Không tìm thấy stylist ID.");
        return;
      }

      const selectedDurations = await Promise.all(
        selectedServices.map(async (serviceId) => {
          const response = await api.get(`/service/${serviceId}`);
          const serviceData = response.data;

          return parseInt(serviceData.duration);
        })
      );

      const totalDuration = selectedDurations.reduce(
        (acc, duration) => acc + duration,
        0
      );

      const appointmentDate = selectedDate.format("YYYY-MM-DD");
      const startTime = dayjs(`${appointmentDate} ${selectedTimeSlot}`, [
        "YYYY-MM-DD h:mm A",
      ]);

      const endTime = startTime.add(totalDuration, "minute");

      console.log("Start time:", startTime.format("HH:mm:ss"));
      console.log("End time:", endTime.format("HH:mm:ss"));
      console.log("Customer ID:", customerIdFromLocalStorage);
      console.log("Stylist ID:", stylistID);
      console.log("Selected Services:", selectedServices);

      const bookingsResponse = await api.get("/bookings/getBooking");
      const stylistBookings = bookingsResponse.data.filter(
        (booking) =>
          booking.stylist.id === stylistID &&
          booking.appointmentDate === appointmentDate
      );

      console.log("Danh sách lịch đã đặt cho stylist:", stylistBookings);

      const isOverlapping = stylistBookings.some((booking) => {
        const bookingStart = dayjs(
          `${booking.appointmentDate} ${booking.startTime}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        const bookingEnd = dayjs(
          `${booking.appointmentDate} ${booking.endTime}`,
          "YYYY-MM-DD HH:mm:ss"
        );

        console.log(
          "Lịch cũ - Start:",
          bookingStart.format("HH:mm:ss"),
          "End:",
          bookingEnd.format("HH:mm:ss")
        );
        console.log(
          "Lịch mới - Start:",
          startTime.format("HH:mm:ss"),
          "End:",
          endTime.format("HH:mm:ss")
        );

        // Sử dụng isSameOrAfter và isSameOrBefore để kiểm tra chính xác hơn
        const isOverlap =
          (startTime.isSameOrAfter(bookingStart) &&
            startTime.isSameOrBefore(bookingEnd)) ||
          (endTime.isSameOrAfter(bookingStart) &&
            endTime.isSameOrBefore(bookingEnd)) ||
          (startTime.isBefore(bookingStart) && endTime.isAfter(bookingEnd));

        if (isOverlap) {
          console.log("Trùng lịch với booking:", booking);
        }

        return isOverlap;
      });

      if (isOverlapping) {
        message.error("Thời gian đã chọn trùng với lịch đặt khác!");
        return;
      }

      const closingTime = dayjs(
        `${appointmentDate} 20:00:00`,
        "YYYY-MM-DD HH:mm:ss"
      );
      if (endTime.isAfter(closingTime)) {
        message.error("Không được đặt dịch vụ quá 20h");
        return;
      }

      const bookingData = {
        service_id: selectedServices,
        stylist_id: { id: stylistID },
        customer_id: { id: customerIdFromLocalStorage },
        appointmentDate: appointmentDate,
        startTime: startTime.format("HH:mm:ss"),
        endTime: endTime.format("HH:mm:ss"),
        status: "confirmed",
      };

      console.log("Booking data to be sent:", bookingData);

      const response = await api.post("/bookings/createBooking", bookingData);

      if (response.status === 200) {
        message.success("Đặt lịch thành công!");

        setSelectedDate(dayjs());
        setSelectedServices([]);
        setSelectedStylist(null);
        setSelectedTimeSlot(null);
        setEstimatedDuration(0);
        setEstimatedPrice(0);
        setShowAllSlots(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo đặt lịch:", error);
      message.error("Đặt lịch không thành công, vui lòng thử lại.");
    }
  };

  // Logic để vô hiệu hóa ngày trong quá khứ
  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <div className="booking-wrapper">
      <h1>Đặt Lịch</h1>

      <div className="form-group">
        <label>Thời gian đặt lịch</label>
        <div className="date-picker">
          <DatePicker
            value={selectedDate}
            format="MM/DD/YYYY"
            onChange={handleDateChange}
            disabledDate={disabledDate}
            allowClear={false}
          />
          <span className="day-of-week">
            {selectedDate.format("dddd, MM/DD/YYYY")}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label>Chọn dịch vụ</label>
        <Select
          mode="multiple" // Thêm chế độ multiple
          style={{ width: "100%" }}
          placeholder="Chọn dịch vụ"
          value={selectedServices}
          onChange={handleServiceChange}
        >
          {services.map((service) => (
            <Option key={service.id} value={service.id}>
              {service.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Hiển thị thời gian dự kiến và giá dự kiến */}
      <div className="estimated-info">
        <p>
          Thời gian dự kiến:{" "}
          {estimatedDuration >= 60
            ? `${Math.floor(estimatedDuration / 60)} giờ ${
                estimatedDuration % 60
              } phút`
            : `${estimatedDuration} phút`}
        </p>
        <p>Giá dự kiến: {estimatedPrice.toLocaleString()} VND</p>
      </div>

      <div className="form-group">
        <label>Chọn Hair Stylist</label>
        {(() => {
          console.log("Available Stylists for rendering:", availableStylists);
          return null; // Bạn cần trả về một giá trị hợp lệ trong JSX
        })()}
        <Select
          value={selectedStylist}
          onChange={handleStylistClick}
          placeholder="Chọn Hair Stylist"
          className="stylist-select"
        >
          {availableStylists.map((stylist) => (
            <Option value={stylist.id} key={stylist.id}>
              {stylist.fullName}
            </Option>
          ))}
        </Select>
      </div>

      <div className="form-group">
        <Button
          onClick={toggleSlotVisibility}
          type="primary"
          className="submit-button view-slots-button"
          size="large"
        >
          {showAllSlots ? "Ẩn khung giờ" : "Xem khung giờ phục vụ"}
        </Button>

        {/* Hiển thị tất cả các slot nếu showAllSlots là true */}
        {showAllSlots && (
          <div className="time-slot-wrapper">
            {timeSlots.map((slot) => (
              <div
                key={slot.time}
                className={`time-slot ${slot.status} ${
                  selectedTimeSlot === slot.time ? "selected" : ""
                }`}
                onClick={() =>
                  slot.status === "available" && handleTimeSlotChange(slot.time)
                }
              >
                <span>{slot.time}</span>
                <span>
                  {slot.status === "available" ? " Còn chỗ" : " Hết chỗ"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hiển thị slot chỉ sau khi đã chọn stylist */}
      {selectedStylist && (
        <div className="form-group">
          <label>Chọn khung giờ phục vụ</label>
          <div className="time-slot-wrapper">
            {timeSlots
              .filter((slot) => slot.status === "available") // Chỉ hiển thị slot còn chỗ
              .map((slot) => (
                <div
                  key={slot.time}
                  className={`time-slot ${slot.status} ${
                    selectedTimeSlot === slot.time ? "selected" : ""
                  }`}
                  onClick={() =>
                    slot.status === "available" &&
                    handleTimeSlotChange(slot.time)
                  }
                >
                  <span>{slot.time}</span>
                  <span>
                    {slot.status === "available" ? " Còn chỗ" : " Hết chỗ"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      <Button
        type="primary"
        className="submit-button"
        onClick={handleSubmit}
        size="large"
      >
        Đặt lịch ngay
      </Button>
    </div>
  );
};

export default Booking;

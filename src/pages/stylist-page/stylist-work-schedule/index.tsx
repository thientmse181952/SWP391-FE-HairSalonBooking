import React, { useEffect, useState } from "react";
import { Calendar, Badge, Modal } from "antd";
import './index.scss';

interface Appointment {
  date: string;
  customerName: string;
  service: string;
  time: string; // Thêm thuộc tính thời gian
}

const generateRandomAppointments = (num: number): Appointment[] => {
  const customers = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Nguyễn Văn E", "Lê Văn Hiếu"];
  const services = ["Gội đầu", "Cắt tóc", "Nhuộm tóc", "Tạo kiểu", "Massage đầu"];
  
  const appointments: Appointment[] = [];
  const timeSlots = ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", 
                     "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", 
                     "18:00-19:00", "19:00-20:00"];

  for (let i = 0; i < num; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30)); // Tạo ngày trong tháng tới
    const formattedDate = randomDate.toISOString().split('T')[0]; // Định dạng ngày

    const appointment: Appointment = {
      date: formattedDate,
      customerName: customers[Math.floor(Math.random() * customers.length)],
      service: services[Math.floor(Math.random() * services.length)],
      time: timeSlots[Math.floor(Math.random() * timeSlots.length)], // Thêm thời gian ngẫu nhiên
    };

    appointments.push(appointment);
  }

  // Thêm 5 ngày có nhiều hơn 2 người book
  for (let i = 0; i < 5; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30)); // Tạo ngày trong tháng tới
    const formattedDate = randomDate.toISOString().split('T')[0]; // Định dạng ngày

    const extraAppointments = [
      {
        date: formattedDate,
        customerName: "Nguyễn Văn A",
        service: "Cắt tóc",
        time: "10:00-12:00",
      },
      {
        date: formattedDate,
        customerName: "Trần Thị B",
        service: "Gội đầu",
        time: "12:00-14:00",
      },
      {
        date: formattedDate,
        customerName: "Lê Văn C",
        service: "Tạo kiểu",
        time: "14:00-16:00",
      },
    ];

    appointments.push(...extraAppointments);
  }

  return appointments;
};

const StylistSchedule: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const generatedAppointments = generateRandomAppointments(15);
    setAppointments(generatedAppointments);
  }, []);

  const dateCellRender = (value: any) => {
    const dateString = value.format('YYYY-MM-DD');
    const currentAppointments = appointments.filter(appointment => appointment.date === dateString);
    
    const hasAppointments = currentAppointments.length > 0;

    return (
      <div 
        className={`appointment-cell ${hasAppointments ? 'has-appointments' : ''}`}
        onClick={() => {
          if (hasAppointments) {
            setSelectedDate(dateString);
            setVisible(true);
          }
        }}
      >
        {currentAppointments.map((appointment, index) => (
          <Badge key={index} status="success" text={`${appointment.customerName} - ${appointment.service}`} />
        ))}
      </div>
    );
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedDate(null);
  };

  return (
    <div className="stylist-schedule">
      <h1>LỊCH LÀM</h1>
      <Calendar dateCellRender={dateCellRender} />
      <Modal
        title={`Thông tin cuộc hẹn cho ngày ${selectedDate}`}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        {appointments.filter(appointment => appointment.date === selectedDate).map((appointment, index) => (
          <div key={index}>
            <p>{`${appointment.time} - ${appointment.customerName} - ${appointment.service}`}</p>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default StylistSchedule;

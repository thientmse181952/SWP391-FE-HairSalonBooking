/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// Giả lập dữ liệu lịch từ API
const events = [
    {
        title: 'Nguyễn Thị An: Cắt tóc, uốn tóc, duỗi',
        start: new Date(2024, 9, 17, 14, 30),
        end: new Date(2024, 9, 17, 15, 30),
    },
    {
        title: 'Trần Văn B: Nhuộm tóc',
        start: new Date(2024, 9, 17, 10, 0),
        end: new Date(2024, 9, 17, 11, 0),
    },
    {
        title: 'Lê Thị C: Gội đầu',
        start: new Date(2024, 9, 18, 9, 0),
        end: new Date(2024, 9, 18, 10, 0),
    },
    {
        title: 'Nguyễn Văn D: Cắt tóc',
        start: new Date(2024, 9, 18, 11, 0),
        end: new Date(2024, 9, 18, 12, 0),
    },
    {
        title: 'Phạm Thị E: Uốn tóc',
        start: new Date(2024, 9, 18, 13, 30),
        end: new Date(2024, 9, 18, 14, 30),
    },
    // Thêm 30 sự kiện khác nhau
    {
        title: 'Nguyễn Văn F: Duỗi tóc',
        start: new Date(2024, 9, 19, 15, 0),
        end: new Date(2024, 9, 19, 16, 0),
    },
    {
        title: 'Lê Văn G: Cắt tóc',
        start: new Date(2024, 9, 20, 10, 0),
        end: new Date(2024, 9, 20, 11, 0),
    },
    {
        title: 'Trần Thị H: Nhuộm tóc',
        start: new Date(2024, 9, 20, 12, 0),
        end: new Date(2024, 9, 20, 13, 0),
    },
    {
        title: 'Nguyễn Thị I: Gội đầu',
        start: new Date(2024, 9, 21, 9, 0),
        end: new Date(2024, 9, 21, 10, 0),
    },
    {
        title: 'Lê Văn K: Uốn tóc',
        start: new Date(2024, 9, 22, 14, 0),
        end: new Date(2024, 9, 22, 15, 0),
    },
    {
        title: 'Trần Văn M: Cắt tóc',
        start: new Date(2024, 9, 23, 11, 0),
        end: new Date(2024, 9, 23, 12, 0),
    },
    {
        title: 'Nguyễn Thị N: Duỗi tóc',
        start: new Date(2024, 9, 24, 13, 0),
        end: new Date(2024, 9, 24, 14, 0),
    },
    {
        title: 'Lê Thị O: Nhuộm tóc',
        start: new Date(2024, 9, 25, 15, 0),
        end: new Date(2024, 9, 25, 16, 0),
    },
    {
        title: 'Nguyễn Văn P: Gội đầu',
        start: new Date(2024, 9, 26, 10, 0),
        end: new Date(2024, 9, 26, 11, 0),
    },
    {
        title: 'Trần Thị Q: Cắt tóc',
        start: new Date(2024, 9, 27, 12, 0),
        end: new Date(2024, 9, 27, 13, 0),
    },
    {
        title: 'Nguyễn Văn R: Uốn tóc',
        start: new Date(2024, 9, 28, 14, 0),
        end: new Date(2024, 9, 28, 15, 0),
    },
    {
        title: 'Lê Thị S: Duỗi tóc',
        start: new Date(2024, 9, 29, 9, 0),
        end: new Date(2024, 9, 29, 10, 0),
    },
    {
        title: 'Trần Văn T: Nhuộm tóc',
        start: new Date(2024, 9, 30, 11, 0),
        end: new Date(2024, 9, 30, 12, 0),
    },
    {
        title: 'Nguyễn Thị U: Gội đầu',
        start: new Date(2024, 9, 31, 13, 0),
        end: new Date(2024, 9, 31, 14, 0),
    },
    {
        title: 'Lê Văn V: Cắt tóc',
        start: new Date(2024, 9, 17, 16, 0),
        end: new Date(2024, 9, 17, 17, 0),
    },
    {
        title: 'Trần Thị W: Uốn tóc',
        start: new Date(2024, 9, 18, 15, 0),
        end: new Date(2024, 9, 18, 16, 0),
    },
    {
        title: 'Nguyễn Văn X: Duỗi tóc',
        start: new Date(2024, 9, 19, 10, 0),
        end: new Date(2024, 9, 19, 11, 0),
    },
    {
        title: 'Lê Thị Y: Nhuộm tóc',
        start: new Date(2024, 9, 20, 12, 0),
        end: new Date(2024, 9, 20, 13, 0),
    },
    {
        title: 'Nguyễn Thị Z: Gội đầu',
        start: new Date(2024, 9, 21, 14, 0),
        end: new Date(2024, 9, 21, 15, 0),
    },
    {
        title: 'Trần Văn AA: Cắt tóc',
        start: new Date(2024, 9, 22, 9, 0),
        end: new Date(2024, 9, 22, 10, 0),
    },
    {
        title: 'Nguyễn Thị AB: Uốn tóc',
        start: new Date(2024, 9, 23, 11, 0),
        end: new Date(2024, 9, 23, 12, 0),
    },
    {
        title: 'Lê Văn AC: Duỗi tóc',
        start: new Date(2024, 9, 24, 13, 0),
        end: new Date(2024, 9, 24, 14, 0),
    },
    {
        title: 'Trần Thị AD: Nhuộm tóc',
        start: new Date(2024, 9, 25, 15, 0),
        end: new Date(2024, 9, 25, 16, 0),
    },
    {
        title: 'Nguyễn Văn AE: Gội đầu',
        start: new Date(2024, 9, 26, 10, 0),
        end: new Date(2024, 9, 26, 11, 0),
    },
    {
        title: 'Lê Thị AF: Cắt tóc',
        start: new Date(2024, 9, 27, 12, 0),
        end: new Date(2024, 9, 27, 13, 0),
    },
    {
        title: 'Nguyễn Văn AG: Uốn tóc',
        start: new Date(2024, 9, 28, 14, 0),
        end: new Date(2024, 9, 28, 15, 0),
    },
    {
        title: 'Trần Thị AH: Duỗi tóc',
        start: new Date(2024, 9, 29, 9, 0),
        end: new Date(2024, 9, 29, 10, 0),
    },
    {
        title: 'Nguyễn Thị AI: Nhuộm tóc',
        start: new Date(2024, 9, 30, 11, 0),
        end: new Date(2024, 9, 30, 12, 0),
    },
    {
        title: 'Lê Văn AJ: Gội đầu',
        start: new Date(2024, 9, 31, 13, 0),
        end: new Date(2024, 9, 31, 14, 0),
    },
];

const StylistSchedule: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    const handleSelectEvent = (event: any) => {
        setSelectedEvent(event);
    };

    return (
        <div>
            <h2>Stylist Schedule</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: '50px' }}
                selectable
                onSelectEvent={handleSelectEvent}
            />

            {selectedEvent && (
                <div>
                    <h3>Chi tiết đặt lịch</h3>
                    <p><strong>Dịch vụ:</strong> {selectedEvent.title}</p>
                    <p><strong>Thời gian:</strong> {moment(selectedEvent.start).format('HH:mm')}</p>
                </div>
            )}
        </div>
    );
};

export default StylistSchedule;

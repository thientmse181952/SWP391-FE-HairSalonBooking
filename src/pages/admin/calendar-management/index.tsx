/* eslint-disable @typescript-eslint/no-unused-vars */
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
        stylist: 'Nguyễn Thị An',
    },
    {
        title: 'Trần Văn B: Nhuộm tóc',
        start: new Date(2024, 9, 17, 10, 0),
        end: new Date(2024, 9, 17, 11, 0),
        stylist: 'Trần Văn B',
    },
    {
        title: 'Lê Thị C: Gội đầu',
        start: new Date(2024, 9, 18, 9, 0),
        end: new Date(2024, 9, 18, 10, 0),
        stylist: 'Lê Thị C',
    },
    {
        title: 'Nguyễn Văn D: Cắt tóc',
        start: new Date(2024, 9, 18, 11, 0),
        end: new Date(2024, 9, 18, 12, 0),
        stylist: 'Nguyễn Văn D',
    },
    {
        title: 'Phạm Thị E: Uốn tóc',
        start: new Date(2024, 9, 19, 15, 0),
        end: new Date(2024, 9, 19, 16, 0),
        stylist: 'Phạm Thị E',
    },
    {
        title: 'Nguyễn Văn F: Duỗi tóc',
        start: new Date(2024, 9, 20, 10, 0),
        end: new Date(2024, 9, 20, 11, 0),
        stylist: 'Nguyễn Văn F',
    },
    {
        title: 'Lê Thị G: Nhuộm tóc',
        start: new Date(2024, 9, 21, 12, 0),
        end: new Date(2024, 9, 21, 13, 0),
        stylist: 'Lê Thị G',
    },
    {
        title: 'Trần Văn H: Gội đầu',
        start: new Date(2024, 9, 22, 14, 0),
        end: new Date(2024, 9, 22, 15, 0),
        stylist: 'Trần Văn H',
    },
];

const CalendarManagement: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    const handleSelectEvent = (event: any) => {
        setSelectedEvent(event);
    };

    const eventStyleGetter = (event: any) => {
        return {
            style: {
                backgroundColor: '#f0f0f0',
                border: 'none',
                color: 'black',
            },
        };
    };

    return (
        <div>
            <h2>Quản Lý Lịch Stylist</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: '50px' }}
                selectable
                onSelectEvent={handleSelectEvent}
                components={{
                    month: {
                        event: ({ event }) => (
                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                {event.stylist}
                            </span>
                        ),
                    },
                }}
                eventPropGetter={eventStyleGetter}
            />

            {selectedEvent && (
                <div>
                    <h3>Chi tiết đặt lịch</h3>
                    <p><strong>Dịch vụ:</strong> {selectedEvent.title}</p>
                    <p><strong>Stylist:</strong> {selectedEvent.stylist}</p>
                    <p><strong>Thời gian:</strong> {moment(selectedEvent.start).format('HH:mm')}</p>
                </div>
            )}
        </div>
    );
};

export default CalendarManagement;

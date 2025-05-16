import React, { useState } from 'react';

function LiveLogs() {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const [selectedDate, setSelectedDate] = useState(today);

    const logs = [
        {
            log_id: 36,
            staff_id: 'I0215',
            date: '15-05-2025',
            IN1: '08:23:45',
            OUT1: '11:15:00',
            IN2: '13:22:00',
            OUT2: '16:30:00',
            IN3: null,
            OUT3: null,
            late_mins: 0,
            attendance: 'P'
        },
        {
            log_id: 37,
            staff_id: 'I0216',
            date: '15-05-2025',
            IN1: '09:00:00',
            OUT1: '12:00:00',
            IN2: '13:00:00',
            OUT2: '17:00:00',
            IN3: null,
            OUT3: null,
            late_mins: 15,
            attendance: 'L'
        },
        {
            log_id: 38,
            staff_id: 'I0217',
            date: '15-05-2025',
            IN1: '08:45:00',
            OUT1: '11:30:00',
            IN2: '13:30:00',
            OUT2: '17:15:00',
            IN3: null,
            OUT3: null,
            late_mins: 5,
            attendance: 'P'
        }
    ];

    // Later, filter logs from backend by selectedDate

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Live Attendance Logs</h2>
                <div className="form-group mb-0">
                    <label htmlFor="date" className="form-label me-2">Select Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>Log ID</th>
                        <th>Staff ID</th>
                        <th>Date</th>
                        <th>IN1</th>
                        <th>OUT1</th>
                        <th>IN2</th>
                        <th>OUT2</th>
                        <th>IN3</th>
                        <th>OUT3</th>
                        <th>Late (mins)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.log_id}>
                            <td>{log.log_id}</td>
                            <td>{log.staff_id}</td>
                            <td>{log.date}</td>
                            <td>{log.IN1 || '-'}</td>
                            <td>{log.OUT1 || '-'}</td>
                            <td>{log.IN2 || '-'}</td>
                            <td>{log.OUT2 || '-'}</td>
                            <td>{log.IN3 || '-'}</td>
                            <td>{log.OUT3 || '-'}</td>
                            <td>{log.late_mins}</td>
                            <td>{log.attendance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LiveLogs;

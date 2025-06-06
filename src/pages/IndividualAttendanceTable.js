import React, { useState } from 'react';
import axios from 'axios';

function IndividualAttendanceTable() {
    const [formData, setFormData] = useState({ startDate: '', endDate: '', employeeId: '' });
    const [submitted, setSubmitted] = useState(false);
    const [employeeInfo, setEmployeeInfo] = useState({ name: '', category: '', designation: '',total_late_mins:'',marked_days:'' });
    const [records, setRecords] = useState([]);
    const [columnsToShow, setColumnsToShow] = useState([]);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitted(false);

        try {
            const res = await axios.post('/individual_data', {
                start_date: formData.startDate,
                end_date: formData.endDate,
                id: formData.employeeId
            });

            const { data, timing } = res.data;

            const employee = data[0] || {};

            setEmployeeInfo({
                name: employee.name,
                category: employee.category,
                designation: employee.dept,
                total_late_mins: employee.total_late_mins || 0,
                marked_days: employee.marked || 0
            });


            
            const allColumns = ['IN1', 'OUT1', 'IN2', 'OUT2', 'IN3', 'OUT3'];
            const visibleCols = allColumns.filter(col => timing.some(row => row[col]));

            setColumnsToShow(visibleCols);
            setRecords(timing);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch data.');
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-3">Individual Attendance</h3>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Start Date</label>
                        <input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <label className="form-label">End Date</label>
                        <input type="date" className="form-control" name="endDate" value={formData.endDate} onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <label className="form-label">Employee ID</label>
                        <input type="text" className="form-control" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Get Records</button>
            </form>

            {error && <div className="alert alert-danger">{error}</div>}

            {submitted && (
                <>
                    <h4 className="mb-3">Attendance Records for {employeeInfo.name}</h4>
                    <p><strong>Category:</strong> {employeeInfo.category}</p>
                    <p><strong>Designation:</strong> {employeeInfo.designation}</p>
                    <p><strong>Total Late Minutes:</strong> {employeeInfo.total_late_mins}</p>
                    <p><strong>Marked Days:</strong> {employeeInfo.marked_days}</p>
                    
                    <table className="table table-bordered table-striped mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th>S.No</th>
                                <th>Date</th>
                                {columnsToShow.map((col, i) => (
                                    <th key={i}>{col}</th>
                                ))}
                                <th>Late Minutes</th>
                                <th>Working Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((rec, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{rec.date}</td>
                                    {columnsToShow.map((col, i) => (
                                        <td key={i}>{rec[col] || '-'}</td>
                                    ))}
                                    <td>{rec.late_mins}</td>
                                    <td>{rec.working_hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default IndividualAttendanceTable;

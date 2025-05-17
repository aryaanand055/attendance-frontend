import React, { useState } from 'react';

function IndividualAttendanceTable() {
    const [formData, setFormData] = useState({ startDate: '', endDate: '', employeeId: '' });
    const [submitted, setSubmitted] = useState(false);
    const [employeeInfo, setEmployeeInfo] = useState({ name: '', category: '', designation: '' });
    const [records, setRecords] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate backend call
        const dummyData = {
            name: 'John Doe',
            category: 'Staff',
            designation: 'Engineer',
            records: [
                { punchdate: '15-05-2025', punchtime: '08:30' },
                { punchdate: '16-05-2025', punchtime: '08:45' },
                { punchdate: '17-05-2025', punchtime: '08:50' },
                { punchdate: '18-05-2025', punchtime: '08:40' },
                { punchdate: '19-05-2025', punchtime: '08:35' },
                { punchdate: '20-05-2025', punchtime: '08:25' },
                { punchdate: '21-05-2025', punchtime: '08:20' },
                { punchdate: '22-05-2025', punchtime: '08:15' },
                { punchdate: '23-05-2025', punchtime: '08:10' },
                { punchdate: '24-05-2025', punchtime: '08:05' },
                { punchdate: '25-05-2025', punchtime: '08:00' },
                { punchdate: '26-05-2025', punchtime: '07:55' }
            ]
        };

        setEmployeeInfo({ name: dummyData.name, category: dummyData.category, designation: dummyData.designation });
        setRecords(dummyData.records);
        setSubmitted(true);
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-3">Individual Attendance Lookup</h3>
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

            {submitted && (
                <>
                    <h4 className="mb-3">Attendance Records for {employeeInfo.name}</h4>
                    <p><strong>Category:</strong> {employeeInfo.category}</p>
                    <p><strong>Designation:</strong> {employeeInfo.designation}</p>

                    <table className="table table-bordered table-striped mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th>S.No</th>
                                <th>Punch Date</th>
                                <th>Punch Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((rec, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{rec.punchdate}</td>
                                    <td>{rec.punchtime}</td>
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

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
                { punchdate: '15-05-2025', punchin: '08:30', punchout: '16:30', workingduration: 480 },
                { punchdate: '16-05-2025', punchin: '08:45', punchout: '16:15', workingduration: 450 }
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
                                <th>Punch In</th>
                                <th>Punch Out</th>
                                <th>Working Duration (mins)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((rec, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{rec.punchdate}</td>
                                    <td>{rec.punchin}</td>
                                    <td>{rec.punchout}</td>
                                    <td>{rec.workingduration}</td>
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

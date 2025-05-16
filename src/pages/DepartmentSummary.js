import React, { useState } from 'react';

function DepartmentSummary() {
    const [selectedDept, setSelectedDept] = useState('');
    const [summaryData, setSummaryData] = useState([]);

    const departments = ['Admin', 'Tech', 'HR', 'Finance'];

    const dummySummaries = {
        Admin: [
            {
                name: 'Arya A.',
                id: 'I001',
                summary: 5,
                leaves: 1
            },
            {
                name: 'Samyuktha',
                id: 'I002',
                summary: 2,
                leaves: 0
            }
        ],
        Tech: [
            {
                name: 'Madhav',
                id: 'I003',
                summary: 8,
                leaves: 2
            }
        ]
    };

    const handleSelect = (e) => {
        const dept = e.target.value;
        setSelectedDept(dept);
        setSummaryData(dummySummaries[dept] || []);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Department-wise Summary</h2>

            <div className="form-group">
                <label htmlFor="departmentSelect">Select Department:</label>
                <select
                    id="departmentSelect"
                    className="form-control"
                    onChange={handleSelect}
                    value={selectedDept}
                >
                    <option value="">-- Select --</option>
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>

            {selectedDept && (
                <>
                    <h3 className="mt-4">{selectedDept} Department</h3>

                    <table className="table table-bordered table-striped mt-3">
                        <thead className="thead-dark">
                            <tr>
                                <th>Employee Name</th>
                                <th>Employee ID</th>
                                <th>Cumulative Summary</th>
                                <th>Leaves Detected</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summaryData.map((emp) => (
                                <tr key={emp.id}>
                                    <td>{emp.name}</td>
                                    <td>{emp.id}</td>
                                    <td>{emp.summary}</td>
                                    <td>{emp.leaves}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default DepartmentSummary;
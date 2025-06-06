import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function DepartmentSummary() {
    const [selectedDept, setSelectedDept] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [summaryData, setSummaryData] = useState({});

    const departments = ["ALL", "CSE", "Mechanical", "ECE"]; 

    const deptSummaries = useCallback(async () => {
        if (!selectedDept || !fromDate || !toDate) return;

        try {
            console.log('Sending:', { selectedDept, fromDate, toDate });

            const response = await axios.post('/dept_summary', {
                dept: selectedDept,
                start_date: fromDate,
                end_date: toDate,
            });
            setSummaryData(response.data || {});
        } catch (error) {
            console.error('Error fetching department summary:', error);
            setSummaryData({});
        }
    }, [selectedDept, fromDate, toDate]);

    useEffect(() => {
        deptSummaries();
    }, [deptSummaries]);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Department-wise Summary</h2>

            <div className="row mb-3">
                <div className="col-md-4 mb-2">
                    <label>Department:</label>
                    <select
                        className="form-control"
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                    >
                        <option value="">-- Select Department --</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4 mb-2">
                    <label>From Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>

                <div className="col-md-4 mb-2">
                    <label>To Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
            </div>

            {selectedDept && fromDate && toDate && Object.keys(summaryData).length > 0 && (
                <>
                    {Object.entries(summaryData).map(([deptName, employees]) => (
                        <div key={deptName} className="mt-4">
                            <h3>{deptName} Department</h3>
                            <table className="table table-bordered table-striped mt-2">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Employee Name</th>
                                        <th>Employee ID</th>
                                        <th>Cumulative Summary</th>
                                        <th>Leaves Detected</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((emp, index) => (
                                        <tr key={`${emp.staff_id}-${index}`}>
                                            <td>{emp.name}</td>
                                            <td>{emp.staff_id}</td>
                                            <td>{emp.summary}</td>
                                            <td>{emp.leaves}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default DepartmentSummary;

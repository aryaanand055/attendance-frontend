import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axios';

function DepartmentSummary() {
    const [selectedDept, setSelectedDept] = useState('');
    const [summaryData, setSummaryData] = useState({});
    const [date, setDate] = useState({}); 
    const departments = ["ALL", "CSE", "Mechanical", "ECE"]; 

    const fetchDeptSummary = useCallback(async () => {
        if (!selectedDept) return;

        try {
            console.log('Requesting summary for:', selectedDept);
            const response = await axios.post('/dept_summary', {
                dept: selectedDept
            });

            setSummaryData(response.data.data || {});
            setDate(response.data.date || {});

        } catch (error) {
            console.error('Error fetching department summary:', error);
            setSummaryData({});
        }
    }, [selectedDept]);

    useEffect(() => {
        fetchDeptSummary();
    }, [fetchDeptSummary]);

    const renderTable = (deptName, employees) => (
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
    );

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Department-wise Summary</h2>

            <div className="row mb-3">
                <div className="col-md-4 mb-2">
                    <label htmlFor="departmentSelect">Department:</label>
                    <select
                        id="departmentSelect"
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
                
            </div>
            
           
            {selectedDept && Object.keys(summaryData).length > 0 ? (
                
                <>
                   <div className="col-md-4 mb-2">
                            <div className="date-range-container d-flex align-items-center gap-2">
                                <label className="date-label">From:</label>
                                <input
                                    type="text"
                                    id="dateDisplay1"
                                    className="form-control date-input"
                                    value={date[0]?.slice(0, 10) || 'No date'}
                                    readOnly
                                />
                                <label className="date-label">To:</label>
                                <input
                                    type="text"
                                    id="dateDisplay2"
                                    className="form-control date-input"
                                    value={date[1]?.slice(0, 10) || 'No date'}
                                    readOnly
                                />
                            </div>
                        </div>

                       
                            {Object.entries(summaryData).map(([deptName, employees]) =>
                                renderTable(deptName, employees)
                            )}

                </>
            ) : selectedDept && Object.keys(summaryData).length === 0 ? (
                <div className="alert alert-info mt-3">
                    No data available for the selected department.
                </div>
            ) : null}
        </div>
    );
}

export default DepartmentSummary;

import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function DepartmentSummary() {
    const [selectedDept, setSelectedDept] = useState('');
    const [summaryData, setSummaryData] = useState({});
    const [date, setDate] = useState([]);

    const departments = ["ALL", "Teaching Staff", "Non Teaching Staff", "CSE", "MECH", "ECE"];

    useEffect(() => {
        setSelectedDept("ALL");
    }, []);

    const fetchDeptSummary = useCallback(async () => {
        if (!selectedDept) return;
        try {
            const response = await axios.post('/dept_summary', {
                dept: selectedDept
            });
            setSummaryData(response.data.data || {});
            setDate(response.data.date || []);
        } catch (error) {
            setSummaryData({});
        }
    }, [selectedDept]);

    useEffect(() => {
        fetchDeptSummary();
    }, [fetchDeptSummary]);

    const handleSaveAsPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Department-wise Summary', 14, 16);
        doc.setFontSize(12);
        doc.text(`Department: ${selectedDept}`, 14, 26);
        doc.text(`From: ${date[0] || 'No date'}`, 14, 34);
        doc.text(`To: ${date[1] || 'No date'}`, 14, 42);
        let startY = 50;

        if (selectedDept === "ALL") {
            Object.entries(summaryData).forEach(([category, depts]) => {
                doc.setFontSize(14);
                doc.text(`${category}`, 14, startY);
                startY += 6;
                Object.entries(depts).forEach(([deptName, employees]) => {
                    doc.setFontSize(12);
                    doc.text(`${deptName} Department`, 18, startY);
                    const tableColumn = ['Employee Name', 'Employee ID', 'Late Minutes', 'Leaves Detected'];
                    const tableRows = Array.isArray(employees)
                        ? employees.map(emp => [emp.name, emp.staff_id, emp.summary, emp.leaves])
                        : [];
                    autoTable(doc, {
                        head: [tableColumn],
                        body: tableRows,
                        startY: startY + 4,
                        styles: { fontSize: 10 },
                        headStyles: { fillColor: [49, 58, 98] },
                        margin: { left: 18 }
                    });
                    startY = doc.lastAutoTable.finalY + 10;
                });
                startY += 6;
            });
        } else {
            Object.entries(summaryData).forEach(([deptName, employees]) => {
                doc.text(`${deptName} Department`, 14, startY);
                const tableColumn = ['Employee Name', 'Employee ID', 'Late Minutes', 'Leaves Detected'];
                const tableRows = Array.isArray(employees)
                    ? employees.map(emp => [emp.name, emp.staff_id, emp.summary, emp.leaves])
                    : [];
                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: startY + 4,
                    styles: { fontSize: 10 },
                    headStyles: { fillColor: [49, 58, 98] },
                });
                startY = doc.lastAutoTable.finalY + 10;
            });
        }
        doc.save(`dept_summary_${selectedDept}.pdf`);
    };

    const renderTable = (deptName, employees) => (
        <div key={deptName} className="mt-4 ms-4">
            <h5>{deptName} Department</h5>
            <table className="table table-bordered table-striped mt-2">
                <thead className="thead-dark">
                    <tr>
                        <th>Employee Name</th>
                        <th>Employee ID</th>
                        <th>Late Minutes</th>
                        <th>Leaves Detected</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(employees) && employees.length > 0 ? (
                        employees.map((emp, index) => (
                            <tr key={`${emp.staff_id}-${index}`}>
                                <td>{emp.name}</td>
                                <td>{emp.staff_id}</td>
                                <td>{emp.summary}</td>
                                <td>{emp.leaves}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center">No employees found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderCategory = (categoryName, departments) => (
        <div key={categoryName} className="mt-4">
            <h3>{categoryName}</h3>
            {Object.entries(departments).map(([deptName, employees]) =>
                renderTable(deptName, employees)
            )}
        </div>
    );

    return (
        <div className="container mt-5 mb-5 p-4 rounded-4 shadow-lg bg-white bg-opacity-75">
            <h2 className="mb-4 fw-bold text-c-primary text-center">Department-wise Summary</h2>
            <button className="btn btn-outline-secondary mb-3" onClick={handleSaveAsPDF}>
                Save as PDF
            </button>

            <div className="row mb-3">
                <div className="col-md-4 mb-2">
                    <div className="mb-2">
                        <label htmlFor="departmentSelect">Department:</label>
                    </div>
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
                                value={date[0] || 'No date'}
                                readOnly
                            />
                            <label className="date-label">To:</label>
                            <input
                                type="text"
                                id="dateDisplay2"
                                className="form-control date-input"
                                value={date[1] || 'No date'}
                                readOnly
                            />
                        </div>
                    </div>

                    {selectedDept === "ALL"
                        ? Object.entries(summaryData).map(([categoryName, departments]) =>
                            renderCategory(categoryName, departments)
                        )
                        : Object.entries(summaryData).map(([deptName, employees]) =>
                            renderTable(deptName, employees)
                        )
                    }
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
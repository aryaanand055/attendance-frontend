import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageWrapper from '../components/PageWrapper';

function DepartmentSummary() {
    const [mainCategory, setMainCategory] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [summaryData, setSummaryData] = useState({});
    const [date, setDate] = useState([]);

    const allDepartments = ["CSE", "ECE", "MECH"];
    const nonTeachingDepartments = ["ADMIN", "LIBRARY", "ECE", "CSE"];
    const departments = [
        "ALL",
        "Teaching Staff",
        "Non Teaching Staff",
        "Department Wise"
    ];

    const getSubDepartments = () => {
        if (mainCategory === 'Teaching Staff') return allDepartments;
        if (mainCategory === 'Non Teaching Staff') return nonTeachingDepartments;
        if (mainCategory === 'Department Wise') return allDepartments;
        return [];
    };

    const fetchDeptSummary = useCallback(async () => {
        if (!mainCategory || (mainCategory !== "ALL" && mainCategory !== "Department Wise" && selectedDept === "")) return;

        let categoryToSend = mainCategory;
        let deptToSend = "";

        if (mainCategory === "Department Wise" && selectedDept) {
            deptToSend = selectedDept;
            categoryToSend = "";
        } else if (
            (mainCategory === "Teaching Staff" || mainCategory === "Non Teaching Staff") &&
            selectedDept && selectedDept !== "ALL"
        ) {
            deptToSend = selectedDept;
        } else if (mainCategory === "ALL") {
            categoryToSend = "ALL";
        }

        try {
            const response = await axios.post('/dept_summary', {
                category: categoryToSend,
                dept: deptToSend
            });
            setSummaryData(response.data.data || {});
            setDate(response.data.date || []);
        } catch (error) {
            console.error("Error fetching summary:", error);
            setSummaryData({});
        }
    }, [mainCategory, selectedDept]);

    useEffect(() => {
        fetchDeptSummary();
    }, [fetchDeptSummary]);

    const handleSaveAsPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Department-wise Summary', 14, 16);
        doc.setFontSize(12);
        doc.text(
            `Department: ${mainCategory === 'ALL'
                ? 'ALL'
                : (mainCategory === "Department Wise"
                    ? selectedDept
                    : (selectedDept === 'ALL' ? mainCategory : selectedDept)
                )}`,
            14, 26
        );
        doc.text(`From: ${date[0] || 'No date'}`, 14, 34);
        doc.text(`To: ${date[1] || 'No date'}`, 14, 42);
        let startY = 50;

        const generateTable = (deptName, employees) => {
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
        };

        if (mainCategory === "ALL") {
            Object.entries(summaryData).forEach(([category, depts]) => {
                doc.setFontSize(14);
                doc.text(`${category}`, 14, startY);
                startY += 6;
                Object.entries(depts).forEach(([deptName, employees]) => {
                    doc.setFontSize(12);
                    generateTable(deptName, employees);
                });
                startY += 6;
            });
        } else {
            Object.entries(summaryData).forEach(([deptName, employees]) => {
                generateTable(deptName, employees);
            });
        }

        doc.save(`dept_summary_${mainCategory}_${selectedDept || 'ALL'}.pdf`);
    };

    const renderTable = (deptName, employees) => {
        const empArray = Array.isArray(employees) ? employees : [];
        return (
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
                        {empArray.length > 0 ? (
                            empArray.map((emp, index) => (
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
    };

    const renderCategory = (categoryName, departments) => (
        <div key={categoryName} className="mt-4">
            <h3>{categoryName}</h3>
            {Object.entries(departments).map(([deptName, employees]) =>
                renderTable(deptName, employees)
            )}
        </div>
    );

    return (
        <PageWrapper title="Department-wise Summary">
            <button className="btn btn-outline-secondary mb-3" onClick={handleSaveAsPDF}>
                Save as PDF
            </button>

            <div className="row mb-3">
                <div className="col-md-4 mb-1">
                    <label className='mb-2'>&nbsp;Category:</label>
                    <select
                        className="form-control"
                        value={mainCategory}
                        onChange={(e) => {
                            setMainCategory(e.target.value);
                            setSelectedDept('');
                        }}
                    >
                        <option value="">Choose Category</option>
                        {departments.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {(mainCategory === 'Teaching Staff' ||
                    mainCategory === 'Non Teaching Staff' ||
                    mainCategory === 'Department Wise') && (
                        <div className="col-md-4 mb-2">
                            <label className='mb-2'>Department:</label>
                            <select
                                className="form-control"
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                            >
                                <option value="">Choose a department</option>
                                {mainCategory !== 'Department Wise' && (
                                    <option value="ALL">ALL</option>
                                )}
                                {getSubDepartments().map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    )}
            </div>

            {mainCategory && ((mainCategory === "ALL") || (selectedDept !== "")) && Object.keys(summaryData).length > 0 ? (
                <>
                    <div className="col-md-4 mb-2">
                        <div className="date-range-container d-flex align-items-center gap-2">
                            <label className="me-2">From:</label>
                            <input
                                type="text"
                                className="form-control me-3"
                                value={date[0] || 'No date'}
                                readOnly
                            />
                            <label className="me-2">To:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={date[1] || 'No date'}
                                readOnly
                            />
                        </div>
                    </div>

                    {mainCategory === "ALL"
                        ? Object.entries(summaryData).map(([categoryName, departments]) =>
                            renderCategory(categoryName, departments)
                        )
                        : Object.entries(summaryData).map(([deptName, employees]) =>
                            renderTable(deptName, employees)
                        )}
                </>
            ) : mainCategory === "" ? (
                <div className="alert alert-info mt-3">Please select a category to view the summary.</div>
            ) : (mainCategory !== "ALL" && selectedDept === "") ? (
                <div className="alert alert-info mt-3">Please choose a department.</div>
            ) : (
                <div className="alert alert-info mt-3">No data available for the selected department.</div>
            )}
        </PageWrapper >
    );
}

export default DepartmentSummary;
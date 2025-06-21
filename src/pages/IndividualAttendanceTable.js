import React, { useState, useEffect } from 'react';
import axios from '../axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageWrapper from '../components/PageWrapper';

function IndividualAttendanceTable() {
    const [formData, setFormData] = useState({ startDate: '', endDate: '', employeeId: '' });
    const [submitted, setSubmitted] = useState(false);
    const [employeeInfo, setEmployeeInfo] = useState({ name: '', category: '', department: '' });
    const [records, setRecords] = useState([]);
    const [columnsToShow, setColumnsToShow] = useState([]);
    const [error, setError] = useState('');
    const [totalLateMins, setTotalLateMins] = useState(0);
    const [filteredLateMins, setFilteredLateMins] = useState(0);
    const [markedDays, setMarkedDays] = useState(0);

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

            const { absent_marked, total_late_mins, data, timing, filtered_late_mins } = res.data;

            const employee = (data && data[0]) || {};

            setEmployeeInfo({
                name: employee.name || '',
                category: employee.category || '',
                department: employee.dept || employee.department || '',
            });

            const allColumns = ['IN1', 'OUT1', 'IN2', 'OUT2', 'IN3', 'OUT3'];
            const visibleCols = allColumns.filter(col => (timing || []).some(row => row[col]));
            setMarkedDays(absent_marked || 0);
            setTotalLateMins(total_late_mins || 0);
            setFilteredLateMins(filtered_late_mins || 0);
            setColumnsToShow(visibleCols);
            setRecords(timing || []);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch data.');
            setSubmitted(false);
            setRecords([]);
        }
    };

    const handleSaveAsPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Individual Attendance Report', 14, 16);
        doc.setFontSize(12);
        doc.text(`Name: ${employeeInfo.name || ''}`, 14, 26);
        doc.text(`Category: ${employeeInfo.category || ''}`, 14, 34);
        doc.text(`Department: ${employeeInfo.department || ''}`, 14, 42);
        doc.text(`Total Late Mins: ${totalLateMins}`, 14, 50);
        doc.text(`Marked Days: ${markedDays}`, 14, 58);

        const tableColumn = ['S.No', 'Date', ...columnsToShow, 'Late Mins', 'Working Hours'];
        const tableRows = records.map((rec, idx) => [
            idx + 1,
            rec.date,
            ...columnsToShow.map(col => rec[col] || '-'),
            rec.late_mins,
            rec.working_hours
        ]);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 65,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [49, 58, 98] },
        });
        doc.save(`attendance_${employeeInfo.name || 'employee'}.pdf`);
    };

    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const startDate = `${yyyy}-${mm}-01`;
        const lastDay = new Date(yyyy, today.getMonth() + 1, 0).getDate();
        const endDate = `${yyyy}-${mm}-${String(lastDay).padStart(2, '0')}`;
        setFormData(prev => ({
            ...prev,
            startDate,
            endDate
        }));
    }, []);

    // Auto-submit when any input changes and all fields are filled
    React.useEffect(() => {
        if (formData.startDate && formData.endDate && formData.employeeId) {
            handleSubmit({ preventDefault: () => { } });
        }
        // eslint-disable-next-line
    }, [formData.startDate, formData.endDate, formData.employeeId]);

    return (
        <PageWrapper title="Individual Attendance">
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
            </form>

            {error && <div className="alert alert-danger">{error}</div>}

            {submitted && (
                <>
                    <h4 className="mb-3">Attendance Records for {employeeInfo.name}</h4>
                    <p><strong>Category:</strong> {employeeInfo.category}</p>
                    <p><strong>Department:</strong> {employeeInfo.department}</p>
                    <p><strong>Total Late Mins(Since prev. reset): </strong>{totalLateMins}</p>
                    <p><strong>Late minutes per filter: </strong>{filteredLateMins}</p>
                    <p><strong>Marked Days:</strong> {markedDays}</p>
                    <button className="btn btn-outline-secondary mb-3" onClick={handleSaveAsPDF}>
                        Save as PDF
                    </button>
                    <table className="table table-c mt-3">
                        <thead className="table-secondary">
                            <tr>
                                <th>S.No</th>
                                <th>Date</th>
                                {columnsToShow.map((col, i) => (
                                    <th key={i}>{col}</th>
                                ))}
                                <th>Late Mins</th>
                                <th>Working Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={2 + columnsToShow.length + 2} className="text-center">No records found.</td>
                                </tr>
                            ) : (
                                records.map((rec, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{rec.date}</td>
                                        {columnsToShow.map((col, i) => (
                                            <td key={i}>{rec[col] || '-'}</td>
                                        ))}
                                        <td>{rec.late_mins}</td>
                                        <td>{rec.working_hours}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </PageWrapper>
    );
}

export default IndividualAttendanceTable;
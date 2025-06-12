import React, { useState } from 'react';
import axios from '../axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../auth/authProvider';

function IndividualAttendanceTable() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ startDate: '', endDate: '', employeeId: '' });
    const [submitted, setSubmitted] = useState(false);
    const [staffInfo, setstaffInfo] = useState({ name: '', category: '', department: '', total_late_mins: '', marked_days: '' });
    const [records, setRecords] = useState([]);
    const [columnsToShow, setColumnsToShow] = useState([]);
    const [error, setError] = useState('');
    const [total_late_mins, setTotalLateMins] = useState(0);
    const [marked_days, setMarkedDays] = useState(0);

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

            const { absent_marked, total_late_mins, data, timing } = res.data;

            const employee = data[0] || {};

            setstaffInfo({
                name: employee.name,
                category: employee.category,
                department: employee.dept,
            });
            const allColumns = ['IN1', 'OUT1', 'IN2', 'OUT2', 'IN3', 'OUT3'];
            const visibleCols = allColumns.filter(col => timing.some(row => row[col]));
            setMarkedDays(absent_marked);
            setTotalLateMins(total_late_mins);
            setColumnsToShow(visibleCols);
            setRecords(timing);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch data.');
        }
    };

    const handleSaveAsPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Individual Attendance Report', 14, 16);
        doc.setFontSize(12);
        doc.text(`Name: ${staffInfo.name || ''}`, 14, 26);
        doc.text(`Department: ${staffInfo.department || ''}`, 14, 42);
        doc.text(`Total Late Mins: ${total_late_mins}`, 14, 50);
        doc.text(`Marked Days: ${marked_days}`, 14, 58);

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
        doc.save(`attendance_${staffInfo.name || 'employee'}.pdf`);
    };

    React.useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const startDate = `${yyyy}-${mm}-01`;
        const lastDay = new Date(yyyy, today.getMonth() + 1, 0).getDate();
        const endDate = `${yyyy}-${mm}-${String(lastDay).padStart(2, '0')}`;
        const empId = user.staffId || '';
        setFormData(prev => ({
            ...prev,
            startDate,
            endDate,
            employeeId: empId
        }));
    }, [user]);

    React.useEffect(() => {
        if (formData.startDate && formData.endDate && formData.employeeId) {
            handleSubmit({ preventDefault: () => {} });
        }
    // eslint-disable-next-line 
    }, [formData.startDate, formData.endDate, formData.employeeId]);

    return (
        <div className="container mt-4">
            <h3 className="mb-3">Attendance Report for {staffInfo.name}</h3>
            <form className="mb-4">
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Start Date</label>
                        <input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <label className="form-label">End Date</label>
                        <input type="date" className="form-control" name="endDate" value={formData.endDate} onChange={handleChange} required />
                    </div>
                </div>
            </form>

            {error && <div className="alert alert-danger">{error}</div>}

            {submitted && (
                <>
                    <p><strong>Department:</strong> {staffInfo.department}</p>
                    <h5 className="mt-4 mb-3">Details since previous Reset: </h5>
                    <p>
                        <strong>Total Late Mins:</strong> {total_late_mins}
                        <span style={{ display: 'inline-block', width: '2em' }}></span>
                        <strong>Marked Days:</strong> {marked_days}
                    </p>
                    <button className="btn btn-outline-secondary mb-3 mt-3" onClick={handleSaveAsPDF}>
                        Save as PDF
                    </button>
                    <h4 className="mt-4 mb-3">Attendance Details for the filtered date:</h4>
                    <table className="table table-bordered table-striped mt-3">
                        <thead className="table-dark">
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

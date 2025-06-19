import React, { useState, useEffect, useRef } from 'react';
import axios from '../axios';
import { useAlert } from '../components/AlertProvider';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function HRExcemptions() {
    const { showAlert } = useAlert();
    const todayDate = new Date().toISOString().split('T')[0];

    const [selectedSessions, setSelectedSessions] = useState([]);
    const [exemptions, setExemptions] = useState([]);
    const [filteredExemptions, setFilteredExemptions] = useState([]);
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const [staffId, setStaffId] = useState('');

    const [formData, setFormData] = useState({
        staffId: '',
        exemptionType: 'day',
        exemptionSession: [],
        exemptionDate: todayDate,
        exemptionReason: '',
        otherReason: '',
        start_time: '',
        end_time: ''
    });

    useEffect(() => {
        const fetchExemptions = async () => {
            try {
                const res = await axios.get("/hr_exemptions_all");
                if (res.data.message === "Exemptions fetched successfully") {
                    setExemptions(res.data.exemptions);
                } else {
                    showAlert('Failed to fetch exemptions', 'error');
                }
            } catch (error) {
                showAlert('Failed to fetch exemptions', 'error');
                console.error("Error fetching exemptions:", error);
            }
        };
        fetchExemptions();
    }, [showAlert]);

    useEffect(() => {
        let filtered = exemptions;
        if (date) {
            filtered = filtered.filter(exemption => exemption.exemptionDate === date);
        }
        if (status) {
            filtered = filtered.filter(exemption => exemption.exemptionStatus === status);
        }
        if (staffId) {
            filtered = filtered.filter(exemption => exemption.staffId === staffId);
        }
        setFilteredExemptions(filtered);
    }, [date, status, staffId, exemptions]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/hr_exemptions", {
                ...formData,
                exemptionSession: formData.exemptionType === 'session' ? selectedSessions : []
            });
            if (res.data.message === "Exemption added successfully") {
                showAlert('Exemption added successfully!', 'success');
                setFormData({
                    staffId: '',
                    exemptionType: 'day',
                    exemptionSession: [],
                    exemptionDate: todayDate,
                    exemptionReason: '',
                    otherReason: '',
                    start_time: '',
                    end_time: ''
                });
                setSelectedSessions([]);
            } else {
                showAlert('Failed to add exemption', 'error');
            }
        } catch (error) {
            showAlert('Submission failed!', 'error');
            console.error("Error submitting exemption:", error);
        }
    };

    const sessionOptions = [
        { value: "1", label: "8:30 - 9:20" },
        { value: "2", label: "9:20 - 10:10" },
        { value: "3", label: "10:25 - 11:15" },
        { value: "4", label: "11:15 - 12:05" },
        { value: "5", label: "13:10 - 14:00" },
        { value: "6", label: "14:00 - 14:50" },
        { value: "7", label: "15:05 - 15:55" },
        { value: "8", label: "15:55 - 16:45" }
    ];

    const handleSessionCheckbox = (e) => {
        const value = e.target.value;
        setSelectedSessions(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
        setFormData(prev => ({
            ...prev,
            exemptionSession: prev.exemptionSession.includes(value)
                ? prev.exemptionSession.filter(v => v !== value)
                : [...prev.exemptionSession, value]
        }));
    };

    const modifyExemption = async (index, action) => {
        const updated = [...exemptions];
        if (action === "approve") {
            const res = await axios.post("/hr_exemptions/approve", { staffId: updated[index].staffId, date: updated[index].exemptionDate, selectedSessions: updated[index].exemptionSession });
            if (res.data.message !== "Exemption approved successfully") {
                showAlert('Failed to approve exemption', 'error');
                return;
            }
            showAlert('Exemption approved successfully!', 'success');
            updated[index].exemptionStatus = 'approved';
        } else {
            const res = await axios.post("/hr_exemptions/reject", { staffId: updated[index].staffId, date: updated[index].exemptionDate, selectedSessions: updated[index].exemptionSession });
            if (res.data.message !== "Exemption rejected successfully") {
                showAlert('Failed to reject exemption', 'error');
                return;
            }
            showAlert('Exemption rejected successfully!', 'success');
            updated[index].exemptionStatus = 'rejected';
        }
        setExemptions(updated);
    };

    
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Exemptions", 14, 16);
        autoTable(doc, {
            startY: 22,
            head: [[
                "Staff ID",
                "Type",
                "Date",
                "Session(s)",
                "Time",
                "Reason",
                "Status"
            ]],
            body: filteredExemptions.map(exemption => [
                exemption.staffId,
                exemption.exemptionType,
                exemption.exemptionDate,
                exemption.exemptionSession || "-",
                (exemption.start_time && exemption.end_time)
                    ? `${exemption.start_time} - ${exemption.end_time}`
                    : "-",
                exemption.exemptionReason === 'Other' ? `Other: ${exemption.otherReason}` : exemption.exemptionReason,
                exemption.exemptionStatus
            ]),
        });
        doc.save("exemptions.pdf");
    };

    return (
        <div className="container mt-5 mb-5 p-4 rounded-4 shadow-lg bg-white bg-opacity-75">
            <h2 className="mb-4 fw-bold text-c-primary text-center">Exemptions</h2>
            <hr className='hr w-75 m-auto my-4 '></hr>

            <div className="mb-5 p-4 rounded-3 bg-light border">
                <h4 className="mb-3 text-secondary">View Exemptions</h4>
                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                    <input type="date" className="form-control" style={{ maxWidth: 180 }} onChange={(e) => setDate(e.target.value)} />
                    <select className="form-select" style={{ maxWidth: 180 }} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                    </select>
                    <input
                        type="text"
                        className="form-control"
                        style={{ maxWidth: 180 }}
                        placeholder="Enter Staff ID"
                        onChange={(e) => setStaffId(e.target.value)}
                    />
                    <button className="btn btn-outline-primary ms-auto" onClick={downloadPDF} type="button">
                        Download PDF
                    </button>
                </div>
                <div className="table-responsive rounded-3 border">
                    <table className='table table-c align-middle mb-0'>
                        <thead className="table-secondary">
                            <tr>
                                <th>Staff ID</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Session(s)</th>
                                <th>Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExemptions.length === 0 ? (
                                <tr><td colSpan="8" className="text-center">No exemptions found</td></tr>
                            ) : (
                                filteredExemptions.map((exemption, index) => {
                                    return (
                                        <tr key={index} className="exemption-row">
                                            <td>{exemption.staffId}</td>
                                            <td>{exemption.exemptionType}</td>
                                            <td>{exemption.exemptionDate}</td>
                                            <td>{exemption.exemptionSession || <span className="text-muted">-</span>}</td>
                                            <td>
                                                {(exemption.start_time && exemption.end_time)
                                                    ? `${exemption.start_time} - ${exemption.end_time}`
                                                    : <span className="text-muted">-</span>
                                                }
                                            </td>
                                            <td>{exemption.exemptionReason === 'Other' ? <span className="fst-italic">Other</span> : exemption.exemptionReason}</td>
                                            <td>
                                                {exemption.exemptionStatus === 'approved' ? (
                                                    <span className="badge bg-success">Approved</span>
                                                ) : (exemption.exemptionStatus === 'rejected') ? (
                                                    <span className="badge bg-danger">Rejected</span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark">Pending</span>
                                                )}
                                            </td>
                                            <td style={{ width: "0px" }}>
                                                {exemption.exemptionStatus === 'pending' && (
                                                    <div className='btn-group' role='group'>
                                                        <button
                                                            className="btn btn-sm btn-outline-success approve-btn py-0 px-2"
                                                            onClick={() => modifyExemption(index, "approve")}
                                                            tabIndex={-1}
                                                            type="button"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger reject-btn py-0 px-2"
                                                            onClick={() => modifyExemption(index, "reject")}
                                                            tabIndex={-1}
                                                            type="button"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
           
            <div className="p-4 rounded-3 bg-light border">
                <h4 className="mb-3 text-secondary">Add a new exemption</h4>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <label htmlFor="userSelect" className="form-label fw-medium">User (Staff ID)</label>
                        <input
                            type="text"
                            className="form-control"
                            name="staffId"
                            value={formData.staffId}
                            onChange={handleChange}
                            placeholder="Enter Staff ID"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="exemptionType" className="form-label fw-medium">Exemption Type</label>
                        <select className="form-select" id="exemptionType" name="exemptionType" value={formData.exemptionType} onChange={e => {
                            setFormData(prev => ({ ...prev, exemptionType: e.target.value }));
                            setSelectedSessions([]);
                        }} required>
                            <option value="time">Time</option>
                            <option value="day">Day</option>
                            <option value="session">Session</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="exemptionDate" className="form-label fw-medium">Date</label>
                        <input type="date" className="form-control" id="exemptionDate" name="exemptionDate" value={formData.exemptionDate} onChange={handleChange} required />
                    </div>
                    {formData.exemptionType === 'session' && (
                        <div className="col-12">
                            <label className="form-label fw-medium">Session(s)</label>
                            <div className="d-flex flex-wrap gap-3">
                                {sessionOptions.map(opt => (
                                    <div key={opt.value} className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`session${opt.value}`}
                                            value={opt.value}
                                            checked={selectedSessions.includes(opt.value)}
                                            onChange={handleSessionCheckbox}
                                        />
                                        <label className="form-check-label" htmlFor={`session${opt.value}`}>
                                            {opt.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {formData.exemptionType === 'time' && (
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-6">
                                    <label className="form-label fw-medium">Start Time</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label fw-medium">End Time</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="col-md-6">
                        <label htmlFor="exemptionReason" className="form-label fw-medium">Reason</label>
                        <select className="form-select" id="exemptionReason" name="exemptionReason" value={formData.exemptionReason} onChange={handleChange} required>
                            <option value="">Select Reason</option>
                            <option value="medical">Medical</option>
                            <option value="personal">Personal</option>
                            <option value="family">Family Emergency</option>
                            <option value="Other">Other</option>
                        </select>
                        {formData.exemptionReason === 'Other' && (
                            <div className='exemption-reason-details mt-2'>
                                <input
                                    type='text'
                                    className="form-control"
                                    name="otherReason"
                                    value={formData.otherReason}
                                    onChange={handleChange}
                                    placeholder="Enter reason..."
                                    required
                                />
                            </div>
                        )}
                    </div>
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-c-primary px-4 py-2" type="submit">Add Exemption</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default HRExcemptions;
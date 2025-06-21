import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useAlert } from '../components/AlertProvider';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageWrapper from '../components/PageWrapper';

function HRExcemptions() {
    const { showAlert } = useAlert();
    const todayDate = new Date().toISOString().split('T')[0];

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const [selectedSessions, setSelectedSessions] = useState([]);
    const [exemptions, setExemptions] = useState([]);
    const [filteredExemptions, setFilteredExemptions] = useState([]);
    const [status, setStatus] = useState('');
    const [staffId, setStaffId] = useState('');
    const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(lastDay.toISOString().split('T')[0]);
    const [staffName, setStaffName] = useState('');

    const [formData, setFormData] = useState({
        staffId: '',
        exemptionType: 'day',
        exemptionSession: [],
        exemptionDate: todayDate,
        exemptionReason: '',
        otherReason: null,
        start_time: null,
        end_time: null
    });

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
    useEffect(() => {
        const fetchStaffName = async () => {
            if (formData.staffId && formData.staffId.length > 2) {
                try {
                    const res = await axios.post('/search/getuser', { staffId: formData.staffId });
                    if (res.data && res.data.staff && res.data.staff.name) {
                        setStaffName(res.data.staff.name);
                    } else {
                        setStaffName('');
                    }
                } catch (err) {
                    setStaffName('');
                }
            } else {
                setStaffName('');
            }
        };
        fetchStaffName();
    }, [formData.staffId]);

    useEffect(() => {
        fetchExemptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAlert]);

    useEffect(() => {
        let filtered = exemptions;
        if (startDate && endDate) {
            filtered = filtered.filter(exemption => {
                return exemption.exemptionDate >= startDate && exemption.exemptionDate <= endDate;
            });
        } else if (startDate) {
            filtered = filtered.filter(exemption => exemption.exemptionDate >= startDate);
        } else if (endDate) {
            filtered = filtered.filter(exemption => exemption.exemptionDate <= endDate);
        }
        if (status) {
            filtered = filtered.filter(exemption => exemption.exemptionStatus === status);
        }
        if (staffId) {
            filtered = filtered.filter(exemption =>
                exemption.staffId && exemption.staffId.toLowerCase().includes(staffId.toLowerCase())
            );
        }
        setFilteredExemptions(filtered);
    }, [startDate, endDate, status, staffId, exemptions]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/applyExemption", {
                ...formData,
                exemptionStatus: 'approved',
                exemptionSession: formData.exemptionType === 'Session' ? selectedSessions : []
            });
            if (res.data.message === "Exemption added successfully") {
                showAlert('Exemption added successfully!', 'success');
                setFormData({
                    staffId: '',
                    exemptionType: 'Day',
                    exemptionSession: [],
                    exemptionDate: todayDate,
                    exemptionReason: '',
                    otherReason: null,
                    start_time: null,
                    end_time: null,

                });
                setSelectedSessions([]);
                fetchExemptions();
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
        const exemptionId = updated[index].exemptionId;
        console.log(`Exemption ID: ${exemptionId}, Action: ${action}`);
        if (action === "approve") {
            const res = await axios.post("/hr_exemptions/approve", { exemptionId });
            if (res.data.message !== "Exemption approved successfully") {
                showAlert('Failed to approve exemption', 'error');
                return;
            }
            showAlert('Exemption approved successfully!', 'success');
            updated[index].exemptionStatus = 'approved';
        } else {
            const res = await axios.post("/hr_exemptions/reject", { exemptionId });
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
        <PageWrapper title="Exemptions">
            <div className="mb-5 p-4 rounded-3 bg-light border">
                <div className="w-100 d-flex justify-content-between">
                    <h4 className="mb-3 text-secondary">View Exemptions</h4>
                    <button className="btn btn-outline-primary float-end" onClick={downloadPDF} type="button">
                        Download PDF
                    </button>
                </div>
                <div className="col-auto">
                    <label className="form-label fw-bold ">Filter by:</label>
                </div>
                <div className="row g-3 align-items-end mb-4">
                    <div className="col-md-3 col-6">
                        <label className='form-label mb-1'>From Date:</label>
                        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="col-md-3 col-6">
                        <label className='form-label mb-1'>To Date:</label>
                        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="col-md-3 col-6">
                        <label className="form-label mb-1">Status:</label>
                        <select className="form-select" onChange={(e) => setStatus(e.target.value)}>
                            <option value="">All</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <div className="col-md-3 col-6">
                        <label className="form-label mb-1">Staff ID:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Staff ID"
                            onChange={(e) => setStaffId(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive rounded-3">
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
                                        <tr key={index} className="exemption-row" id={`${exemption.exemptionId}`}>
                                            <td>{exemption.staffId}</td>
                                            <td>{exemption.exemptionType}</td>
                                            <td>{exemption.exemptionDate}</td>
                                            <td>{exemption.exemptionSession || <span className="text-muted">-------</span>}</td>
                                            <td>
                                                {(exemption.start_time && exemption.end_time)
                                                    ? `${exemption.start_time} - ${exemption.end_time}`
                                                    : <span className="text-muted">-----</span>
                                                }
                                            </td>
                                            <td>{exemption.exemptionReason === 'Other' ? <span className="fst-italic">{exemption.otherReason}</span> : exemption.exemptionReason}</td>
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

            {/* Add Exemption */}
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
                        {staffName && (
                            <div className="mt-1 text-primary small">{staffName}</div>
                        )}
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="exemptionType" className="form-label fw-medium">Exemption Type</label>
                        <select className="form-select" id="exemptionType" name="exemptionType" value={formData.exemptionType} onChange={e => {
                            setFormData(prev => ({ ...prev, exemptionType: e.target.value }));
                            setSelectedSessions([]);
                        }} required>
                            <option value="Time">Time</option>
                            <option value="Day">Day</option>
                            <option value="Session">Session</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="exemptionDate" className="form-label fw-medium">Date</label>
                        <input type="date" className="form-control" id="exemptionDate" name="exemptionDate" value={formData.exemptionDate} onChange={handleChange} required />
                    </div>
                    {formData.exemptionType === 'Session' && (
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
                    {formData.exemptionType === 'Time' && (
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
                            <option value="Medical">Medical</option>
                            <option value="Personal">Personal</option>
                            <option value="Family">Family Emergency</option>
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
        </PageWrapper>
    );
}
export default HRExcemptions;
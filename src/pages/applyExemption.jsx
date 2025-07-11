import React, { useState, useEffect } from 'react';
import axios from '../axios';
import PageWrapper from '../components/PageWrapper';
import { useAlert } from '../components/AlertProvider';
import { useAuth } from '../auth/authProvider';

function ApplyExemption() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const [selectedSessions, setSelectedSessions] = useState([]);
    const [exemptions, setExemptions] = useState([]);
    const [filteredExemptions, setFilteredExemptions] = useState([]);
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(lastDay.toISOString().split('T')[0]);
    const { showAlert } = useAlert();
    const todayDate = new Date().toISOString().split('T')[0];
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        exemptionType: 'Day',
        staffId: '',
        exemptionSession: [],
        exemptionDate: todayDate,
        exemptionReason: '',
        otherReason: null,
        start_time: null,
        end_time: null,
        exemptionStatus: 'pending'
    });

    const fetchExemptions = async () => {
        if (!user || !user.staffId) return;
        try {
            const res = await axios.get(`/staff_exemptions/${user.staffId}`);
            showAlert('Exemptions fetched successfully', 'success');
            if (res.data && Array.isArray(res.data.exemptions)) {
                setExemptions(res.data.exemptions);
            } else {
                setExemptions([]);
            }
        } catch (error) {
            showAlert('Failed to fetch your exemptions', 'error');
        }
    };

    useEffect(() => {
        if (user && user.staffId) {
            setFormData(prev => ({ ...prev, staffId: user.staffId }));
            fetchExemptions();
        }
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        let filtered = exemptions;
        if (startDate && endDate) {
            filtered = filtered.filter(exemption =>
                exemption.exemptionDate >= startDate && exemption.exemptionDate <= endDate
            );
        } else if (startDate) {
            filtered = filtered.filter(exemption => exemption.exemptionDate >= startDate);
        } else if (endDate) {
            filtered = filtered.filter(exemption => exemption.exemptionDate <= endDate);
        }
        if (status) {
            filtered = filtered.filter(exemption => exemption.exemptionStatus === status);
        }
        setFilteredExemptions(filtered);
    }, [startDate, endDate, status, exemptions]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/applyExemption", formData);
            if (res.data.message === "Exemption added successfully") {
                showAlert('Exemption added successfully!', 'success');
                setFormData({
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
                throw new Error("Failed to add exemption");
            }
        } catch (error) {
            showAlert('Submission failed!', 'error');
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

    return (
        <PageWrapper title="Exemptions">
            <div className="p-4 rounded-3 bg-light border mb-4">
                <h4 className="mb-3 text-secondary">Applied Exemptions</h4>
                <div className="col-auto">
                    <label className="form-label fw-bold ">Filter by:</label>
                </div>
                <div className="row g-3 align-items-end mb-4">
                    <div className="col-md-4 col-6">
                        <label className='form-label mb-1'>From Date:</label>
                        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="col-md-4 col-6">
                        <label className='form-label mb-1'>To Date:</label>
                        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="col-md-4 col-6">
                        <label className="form-label mb-1">Status:</label>
                        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">All</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
                <div className="table-responsive rounded-3 border">
                    <table className='table table-c align-middle mb-0'>
                        <thead className="table-secondary">
                            <tr>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Session(s)</th>
                                <th>Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExemptions.length === 0 ? (
                                <tr><td colSpan="6" className="text-center">No exemptions found</td></tr>
                            ) : (
                                filteredExemptions.map((exemption, index) => (
                                    <tr key={index} className="exemption-row">
                                        <td>{exemption.exemptionType}</td>
                                        <td>{exemption.exemptionDate}</td>
                                        <td>{exemption.exemptionSession && exemption.exemptionSession.length > 0 ? exemption.exemptionSession : <span className="text-muted">-------</span>}</td>
                                        <td>{(exemption.start_time && exemption.end_time) ? `${exemption.start_time} - ${exemption.end_time}` : <span className="text-muted">-----</span>}</td>
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
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-4 rounded-3 bg-light border">
                <h4 className="mb-3 text-secondary">Apply exemption</h4>
                <p className='text-muted'>You can apply for exemptions for specific dates and times.</p>
                <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-md-4">
                        <label htmlFor="userSelect" className="form-label fw-medium">User</label>
                        <input
                            type="text"
                            className="form-control"
                            id="staffId"
                            name="staffId"
                            value={formData.staffId}
                            onChange={handleChange}
                            required
                            readOnly
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="exemptionType" className="form-label fw-medium">Exemption Type</label>
                        <select
                            className="form-select"
                            id="exemptionType"
                            name="exemptionType"
                            value={formData.exemptionType}
                            onChange={handleChange}
                            required
                        >
                            <option value="Day">Day</option>
                            <option value="Session">Session</option>
                            <option value="Time">Time</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="exemptionDate" className="form-label fw-medium">Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="exemptionDate"
                            name="exemptionDate"
                            value={formData.exemptionDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {formData.exemptionType === 'Session' && (
                        <div className="col-12">
                            <label className="form-label fw-medium">Session(s)</label>
                            <div className="row">
                                {sessionOptions.map(opt => (
                                    <div key={opt.value} className="col-6 col-md-3">
                                        <div className="form-check">
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
                        <select
                            className="form-select"
                            id="exemptionReason"
                            name="exemptionReason"
                            value={formData.exemptionReason}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Reason</option>
                            <option value="Official">Official</option>
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
                        <button className="btn btn-c-primary px-4 py-2" type="submit">Apply Exemption</button>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
}
export default ApplyExemption;
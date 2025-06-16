import React, { useState } from 'react';
import axios from 'axios';

import { useAlert } from '../components/AlertProvider';


function HRExcemptions() {
    const { showAlert } = useAlert();
    const todayDate = new Date().toISOString().split('T')[0];
    const dummyUserData = [
        { staffId: 'I001', name: 'User 1' },
        { staffId: 'I002', name: 'User 2' },
        { staffId: 'I003', name: 'User 3' },
        { staffId: 'I004', name: 'User 4' }
    ];
    const [selectedSessions, setSelectedSessions] = useState([]);


    const [exemptions, setExemptions] = useState([
        { staffId: 'I001', name: 'User 1', type: 'Day', date: todayDate, reason: 'medical', status: 'approved' },
        { staffId: 'I002', name: 'User 2', type: 'Session', date: todayDate, sessions: '1,2', reason: 'personal', status: 'pending' },
        { staffId: 'I003', name: 'User 3', type: 'Day', date: '2025-06-10', reason: 'family', status: 'rejected' },
        { staffId: 'I004', name: 'User 4', type: 'Session', date: '2025-06-12', sessions: '3,4', reason: 'Other', status: 'approved' }
    ]);
    const [filteredExemptions, setFilteredExemptions] = useState(exemptions);
    React.useEffect(() => {
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

    const [formData, setFormData] = useState({
        exemptionType: 'Day',
        exemptionSession: '',
        exemptionDate: todayDate,
        exemptionReason: '',
        otherReason: ''
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/hr_exemptions", formData);
            if (res.data.message === "Exemption added successfully") {
                showAlert('Exemption added successfully!', 'success');
            } else {
                showAlert('Failed to add exemption', 'error');
                throw new Error("Failed to add exemption");
            }

        } catch (error) {
            showAlert('Submission failed!', 'error');
            console.error("Error submitting exemption:", error);
        }
    };


    const handleSessionChange = (e) => {
        const options = Array.from(e.target.options);
        const values = options.filter(opt => opt.selected).map(opt => opt.value);
        setSelectedSessions(values);
        setFormData(prev => ({
            ...prev,
            exemptionSession: values
        }));
    };

    const modifyExemption = (index, action) => {
        const updated = [...exemptions];
        if (action === "approve") {
            const res = axios.post("/hr_exemptions/approve", { staffId: updated[index].staffId, date: updated[index].date, selectedSessions: updated[index].sessions });
            if (res.data.message !== "Exemption approved successfully") {
                showAlert('Failed to approve exemption', 'error');
                return;
            }
            showAlert('Exemption approved successfully!', 'success');
            updated[index].status = 'approved';
        } else {
            const res = axios.post("/hr_exemptions/reject", { staffId: updated[index].staffId, date: updated[index].date, selectedSessions: updated[index].sessions });
            if (res.data.message !== "Exemption rejected successfully") {
                showAlert('Failed to reject exemption', 'error');
                return;
            }
            showAlert('Exemption rejected successfully!', 'success');
            updated[index].status = 'rejected';
        }
        setExemptions(updated);
    };
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const [staffId, setStaffId] = useState('');

    React.useEffect(() => {
        let filtered = exemptions;
        if (date) {
            filtered = filtered.filter(exemption => exemption.date === date);
        }
        if (status) {
            filtered = filtered.filter(exemption => exemption.status === status);
        }
        if (staffId) {
            filtered = filtered.filter(exemption => exemption.staffId === staffId);
        }
        setFilteredExemptions(filtered);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, status, staffId]);

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
                    <select className="form-select" style={{ maxWidth: 180 }} onChange={(e) => setStaffId(e.target.value)}>
                        <option value="">All Staff</option>
                        {dummyUserData.map(user => (
                            <option key={user.staffId} value={user.staffId}>
                                {user.name} ({user.staffId})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="table-responsive rounded-3 border">
                    <table className='table table-c align-middle mb-0'>
                        <thead className="table-secondary">
                            <tr>
                                <th>Staff ID</th>
                                <th>Staff Name</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Session(s)</th>
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExemptions.length === 0 ? (
                                <tr><td colSpan="7" className="text-center">No exemptions found</td></tr>
                            ) : (
                                filteredExemptions.map((exemption, index) => {
                                    return (
                                        <tr key={index} className="exemption-row">
                                            <td>{exemption.staffId}</td>
                                            <td>{exemption.name}</td>
                                            <td>{exemption.type}</td>
                                            <td>{exemption.date}</td>
                                            <td>{exemption.sessions || <span className="text-muted">-</span>}</td>
                                            <td>{exemption.reason === 'Other' ? <span className="fst-italic">Other</span> : exemption.reason}</td>
                                            <td style={{ width: "0px" }}>
                                                {exemption.status === 'approved' ? (
                                                    <span className="badge bg-success">Approved</span>
                                                ) : (exemption.status === 'rejected') ? (
                                                    <span className="badge bg-danger">Rejected</span>
                                                ) : (
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
            {/* Add exemptions */}
            <div className="p-4 rounded-3 bg-light border">
                <h4 className="mb-3 text-secondary">Add a new exemption</h4>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <label htmlFor="userSelect" className="form-label fw-medium">User</label>
                        <select className="form-select" name="staffId" value={formData.staffId} onChange={handleChange} required>
                            <option value="">Select User</option>
                            {dummyUserData.map(user => (
                                <option key={user.staffId} value={user.staffId}>
                                    {user.name} ({user.staffId})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="exemptionType" className="form-label fw-medium">Exemption Type</label>
                        <select className="form-select" id="exemptionType" name="exemptionType" value={formData.exemptionType} onChange={handleChange} required>
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
                            <label htmlFor="exemptionSession" className="form-label fw-medium">Session(s)</label>
                            <select
                                className="form-select"
                                id="exemptionSession"
                                name="exemptionSession"
                                multiple
                                value={selectedSessions}
                                onChange={handleSessionChange}
                                size={8}
                                required
                            >
                                <option value="1">8:30 - 9:20</option>
                                <option value="2">9:20 - 10:10</option>
                                <option value="3">10:25 - 11:15</option>
                                <option value="4">11:15 - 12:05</option>
                                <option value="5">13:10 - 14:00</option>
                                <option value="6">14:00 - 14:50</option>
                                <option value="7">15:05 - 15:55</option>
                                <option value="8">15:55 - 16:45</option>
                            </select>
                            <small className="text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple sessions.</small>
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
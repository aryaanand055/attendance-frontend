import React, { useState } from 'react';
import axios from '../axios';

import { useAlert } from '../components/AlertProvider';
import { useAuth } from '../auth/authProvider';

function ApplyExemption() {
    const { showAlert } = useAlert();
    const todayDate = new Date().toISOString().split('T')[0];

    const [selectedSessions, setSelectedSessions] = useState([]);
    const [formData, setFormData] = useState({
        exemptionType: 'day',
        staffId: '',
        exemptionSession: [],
        exemptionDate: todayDate,
        exemptionReason: '',
        otherReason: '',
        start_time: '',
        end_time: ''
    });
    const { user } = useAuth();
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, staffId: user.staffId }));
        }
    }, [user]);

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
        <div className="container mt-5 mb-5 p-4 rounded-4 shadow-lg bg-white bg-opacity-75">
            <h2 className="mb-4 fw-bold text-c-primary text-center">Exemptions</h2>
            <hr className='hr w-75 m-auto my-4 '></hr>

            <div className="p-4 rounded-3 bg-light border">
                <h4 className="mb-3 text-secondary">Apply exemption</h4>
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
                            <option value="day">Day</option>
                            <option value="session">Session</option>
                            <option value="time">Time</option>
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

                    {formData.exemptionType === 'session' && (
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
                        <select
                            className="form-select"
                            id="exemptionReason"
                            name="exemptionReason"
                            value={formData.exemptionReason}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Reason</option>
                            <option value="official">Official</option>
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
                        <button className="btn btn-c-primary px-4 py-2" type="submit">Apply Exemption</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default ApplyExemption;
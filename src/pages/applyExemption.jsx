import React, { useState } from 'react';
import axios from 'axios';

import { useAlert } from '../components/AlertProvider';
import { useAuth } from '../auth/authProvider';

function ApplyExemption() {
    const { showAlert } = useAlert();
    const todayDate = new Date().toISOString().split('T')[0];

    const [selectedSessions, setSelectedSessions] = useState([]);

    const [formData, setFormData] = useState({
        exemptionType: 'Day',
        exemptionStaffName: '',
        exemptionSession: '',
        exemptionDate: todayDate,
        exemptionReason: '',
        otherReason: '',
        exemptionStatus: 'pending'
    });
    const { user } = useAuth();
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, exemptionStaffName: user.staffId }));
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

    return (
        <div className="container mt-5 mb-5 p-4 rounded-4 shadow-lg bg-white bg-opacity-75">
            <h2 className="mb-4 fw-bold text-c-primary text-center">Exemptions</h2>
            <hr className='hr w-75 m-auto my-4 '></hr>

            <div className="p-4 rounded-3 bg-light border">
                <h4 className="mb-3 text-secondary">Apply exemption</h4>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <label htmlFor="userSelect" className="form-label fw-medium">User</label>
                        <input type="text" className="form-control disabled" id="exemptionStaffName" name="exemptionStaffName" value={formData.exemptionStaffName} onChange={handleChange} required readOnly />
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
                        <button className="btn btn-c-primary px-4 py-2" type="submit">Apply Exemption</button>
                    </div>
                </form>
            </div>
        </div>

    );
}
export default ApplyExemption;
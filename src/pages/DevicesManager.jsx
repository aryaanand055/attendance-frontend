import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';

function DeviceManager() {
    const [devices, setDevices] = useState([
        {
            name: "Device 1",
            ip: "192.168.1.1",
            location: "CSE Block",
            photo: "https://5.imimg.com/data5/SELLER/Default/2021/8/YO/BR/DA/5651309/essl-ai-face-venus-face-attendance-system-with-artificial-intelligence-500x500.jpg"
        },
        {
            name: "Device 2",
            ip: "192.168.1.2",
            location: "Admin Office",
            photo: "https://5.imimg.com/data5/SELLER/Default/2021/8/YO/BR/DA/5651309/essl-ai-face-venus-face-attendance-system-with-artificial-intelligence-500x500.jpg"
        },
        {
            name: "Device 3",
            ip: "192.168.1.3",
            location: "Architecture Block",
            photo: "https://5.imimg.com/data5/SELLER/Default/2021/8/YO/BR/DA/5651309/essl-ai-face-venus-face-attendance-system-with-artificial-intelligence-500x500.jpg"
        }
    ]);

    const [editingIdx, setEditingIdx] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', ip: '', location: '', photo: '' });

    // Add device form state
    const [addForm, setAddForm] = useState({ name: '', ip: '', location: '', photo: '' });

    const handleEditClick = (idx) => {
        setEditingIdx(idx);
        setEditForm(devices[idx]);
    };

    const handleFormChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const updatedDevices = [...devices];
        updatedDevices[editingIdx] = { ...editForm };
        setDevices(updatedDevices);
        setEditingIdx(null);
    };

    const handleCancel = () => {
        setEditingIdx(null);
    };

    // Add device handlers
    const handleAddFormChange = (e) => {
        setAddForm({ ...addForm, [e.target.name]: e.target.value });
    };

    const handleAddDevice = (e) => {
        e.preventDefault();
        setDevices([...devices, { ...addForm }]);
        setAddForm({ name: '', ip: '', location: '', photo: '' });
    };

    return (
        <PageWrapper title="Device Manager">
            {/* Devices View Section */}
            <div className='mb-5 p-4 rounded-3 bg-light border'>
                <h4 className="mb-3 text-c-primary fw-bold">Devices</h4>
                <div className="d-flex gap-3 flex-wrap mb-3">
                    {devices.map((device, idx) => (
                        <div key={idx} className="card shadow-sm position-relative" style={{ width: 180 }}>
                            {/* Edit button */}
                            <button
                                className="position-absolute edit-c-btn"
                                onClick={() => handleEditClick(idx)}
                                aria-label="Edit"
                            >
                                <span role="img" aria-label="edit"><i className="bi bi-pencil-fill"></i></span>
                            </button>
                            <img
                                src={device.photo}
                                alt={device.name}
                                className="card-img-top"
                                style={{ objectFit: "cover", height: 80, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                            />
                            <div className="card-body p-2">
                                {editingIdx === idx ? (
                                    <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                                        <input
                                            className="form-control form-control-sm mb-1"
                                            name="name"
                                            value={editForm.name}
                                            onChange={handleFormChange}
                                            placeholder="Name"
                                            required
                                        />
                                        <input
                                            className="form-control form-control-sm mb-1"
                                            name="ip"
                                            value={editForm.ip}
                                            onChange={handleFormChange}
                                            placeholder="IP"
                                            required
                                        />
                                        <input
                                            className="form-control form-control-sm mb-1"
                                            name="location"
                                            value={editForm.location}
                                            onChange={handleFormChange}
                                            placeholder="Location"
                                            required
                                        />
                                        <input
                                            className="form-control form-control-sm mb-2"
                                            name="photo"
                                            value={editForm.photo}
                                            onChange={handleFormChange}
                                            placeholder="Photo URL"
                                        />
                                        <div className="d-flex gap-1">
                                            <button type="submit" className="btn btn-primary btn-sm">Save</button>
                                            <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <h6 className="card-title mb-1">{device.name}</h6>
                                        <div className="small text-muted">{device.ip}</div>
                                        <div className="small">{device.location}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Add Device Section */}
            <div className='mb-5 p-4 rounded-3 bg-light border'>
                <h4 className="mb-3 text-c-primary fw-bold">Add New Device</h4>
                <form className="d-flex gap-2 flex-wrap align-items-end" onSubmit={handleAddDevice}>
                    <input
                        className="form-control form-control-sm"
                        style={{ maxWidth: 150 }}
                        name="name"
                        value={addForm.name}
                        onChange={handleAddFormChange}
                        placeholder="Name"
                        required
                    />
                    <input
                        className="form-control form-control-sm"
                        style={{ maxWidth: 130 }}
                        name="ip"
                        value={addForm.ip}
                        onChange={handleAddFormChange}
                        placeholder="IP"
                        required
                    />
                    <input
                        className="form-control form-control-sm"
                        style={{ maxWidth: 180 }}
                        name="location"
                        value={addForm.location}
                        onChange={handleAddFormChange}
                        placeholder="Location"
                        required
                    />
                    <input
                        className="form-control form-control-sm"
                        style={{ maxWidth: 220 }}
                        name="photo"
                        value={addForm.photo}
                        onChange={handleAddFormChange}
                        placeholder="Photo URL"
                    />
                    <button type="submit" className="btn btn-success btn-sm">Add</button>
                </form>
            </div>
        </PageWrapper>
    );
}

export default DeviceManager;
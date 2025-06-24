import React, { useState, useEffect } from 'react';
import axios from '../axios';

import { useAlert } from '../components/AlertProvider';
import PageWrapper from '../components/PageWrapper';

function DeviceManager() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingIdx, setEditingIdx] = useState(null);
    const [editForm, setEditForm] = useState({ device_id: '', device_name: '', ip_address: '', device_location: '', image_url: '' });
    const [addForm, setAddForm] = useState({ device_id: '', device_name: '', ip_address: '', device_location: '', image_url: '' });

    const { showAlert } = useAlert();

    // Fetch devices from backend

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const res = await axios.get("/devices");
                if (res.data.success) {
                    setDevices(res.data.devices);
                    setLoading(false);
                } else {
                    showAlert('Failed to fetch devices', 'error');
                }
            } catch (error) {
                showAlert('Failed to fetch devices', 'error');
                console.error("Error fetching devices:", error);
            }
        };
        fetchDevices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditClick = (deviceId) => {
        const device = devices.find((d) => d.device_id === deviceId);
        setEditingIdx(deviceId);
        setEditForm({ ...device });
    };

    const handleFormChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const payload = {
                id: editForm.device_id,
                ip_address: editForm.ip_address,
                device_name: editForm.device_name,
                device_location: editForm.device_location,
                image_url: editForm.image_url,
            };
            const res = await axios.post('/devices/update', payload);
            if (res.data.success) {
                const updatedDevices = devices.map((device) =>
                    device.device_id === editForm.device_id ? { ...editForm } : device
                );
                setDevices(updatedDevices);
                showAlert('Device updated successfully', 'success');
            } else {
                showAlert('Failed to update device', 'error');
            }
        } catch (error) {
            showAlert('Failed to update device', 'error');
            console.error('Error updating device:', error);
        }
        setEditingIdx(null);
    };

    const handleCancel = () => {
        setEditingIdx(null);
    };

    const handleAddFormChange = (e) => {
        setAddForm({ ...addForm, [e.target.name]: e.target.value });
    };

    const handleAddDevice = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/devices/add', addForm);
            if (res.data.success && res.data.device) {
                setDevices([...devices, res.data.device]);
            } else {
                setDevices([...devices, addForm]); // fallback if backend doesn't return device
            }
            setAddForm({ device_id: '', device_name: '', ip_address: '', device_location: '', image_url: '' });
        } catch (error) {
            showAlert('Failed to add device', 'error');
            console.error("Error adding device:", error);
        }
    };

    return (
        <PageWrapper title="Device Manager">
            <div className='mb-5 p-4 rounded-3 bg-light border'>
                <h4 className="mb-3 text-c-primary fw-bold">Devices</h4>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="d-flex gap-3 flex-wrap mb-3">
                        {devices.map((device, idx) => (
                            <div key={device.device_id} className="card shadow-sm position-relative" style={{ width: 180 }}>
                                <button
                                    className="position-absolute edit-c-btn"
                                    onClick={() => handleEditClick(device.device_id)}
                                    aria-label="Edit"
                                >
                                    <span role="img" aria-label="edit"><i className="bi bi-pencil-fill"></i></span>
                                </button>
                                <img
                                    src={device.image_url}
                                    alt={device.device_name}
                                    className="card-img-top"
                                    style={{ objectFit: "cover", height: 80, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                                />
                                <div className="card-body p-2">
                                    {editingIdx === device.device_id ? (
                                        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                                            <input
                                                className="form-control form-control-sm mb-1"
                                                name="device_name"
                                                value={editForm.device_name}
                                                onChange={handleFormChange}
                                                placeholder="Name"
                                                required
                                            />
                                            <input
                                                className="form-control form-control-sm mb-1"
                                                name="ip_address"
                                                value={editForm.ip_address}
                                                onChange={handleFormChange}
                                                placeholder="IP"
                                                required
                                            />
                                            <input
                                                className="form-control form-control-sm mb-1"
                                                name="device_location"
                                                value={editForm.device_location}
                                                onChange={handleFormChange}
                                                placeholder="Location"
                                                required
                                            />
                                            <input
                                                className="form-control form-control-sm mb-2"
                                                name="image_url"
                                                value={editForm.image_url}
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
                                            <h6 className="card-title mb-1">{device.device_name}</h6>
                                            <div className="small text-muted">{device.ip_address}</div>
                                            <div className="small">{device.device_location}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className='mb-5 p-4 rounded-3 bg-light border'>
                <h4 className="mb-3 text-c-primary fw-bold">Add New Device</h4>
                <form className="d-flex gap-2 flex-wrap align-items-end" onSubmit={handleAddDevice}>
                    <input
                        className="form-control form-control-sm"
                        style={{ maxWidth: 150 }}
                        name="device_name"
                        value={addForm.device_name}
                        onChange={handleAddFormChange}
                        placeholder="Name"
                        required
                    />
                    <input
                        className="form-control form-control-sm"
                        style={{ maxWidth: 130 }}
                        name="ip_address"
                        value={addForm.ip_address}
                        onChange={handleAddFormChange}
                        placeholder="IP"
                        required
                    />
                    <input
                        className="form-control form-control-sm"
                        style={{ maxWidth: 180 }}
                        name="device_location"
                        value={addForm.device_location}
                        onChange={handleAddFormChange}
                        placeholder="Location"
                        required
                    />
                    <input
                        className="form-control form-control-sm"
                        style={{ maxWidth: 220 }}
                        name="image_url"
                        value={addForm.image_url}
                        onChange={handleAddFormChange}
                        placeholder="Image URL"
                    />
                    <button type="submit" className="btn btn-success btn-sm">Add</button>
                </form>
            </div>
        </PageWrapper>
    );
}

export default DeviceManager;

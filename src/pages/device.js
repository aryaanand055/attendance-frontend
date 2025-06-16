import React, { useState, useEffect } from 'react';
import axios from '../axios';

function DeviceManager() {
  const TeachingStaff = ['CSE', 'ECE', 'MECH'];
  const NonTeachingStaff = ['ADMIN', 'LIBRARY'];

  const [addUser, setAddUser] = useState({
    id: '',
    name: '',
    dept: '',
    designation: '',
    staff_type: '',
    working_type: '',
    intime: '',
    outtime: '',
    breakmins: '',
    breakin: '',
    breakout: '',
  });

  const [addUserMsg, setAddUserMsg] = useState({ message: '', type: '' });
  const [deleteId, setDeleteId] = useState('');
  const [deleteUserMsg, setDeleteUserMsg] = useState({ message: '', type: '' });
  const [deleteLogsMsg, setDeleteLogsMsg] = useState({ message: '', type: '' });


  const clearMessage = (setMsg) => {
    setTimeout(() => {
      setMsg({ message: '', type: '' });
    }, 5000);
  };

  const handleWorkingTypeChange = (e) => {
    const working_type = e.target.value;
    if (working_type === 'fixed') {
      setAddUser({
        ...addUser,
        working_type,
        outtime: '',
        breakmins: '',
      });
    } else if (working_type === 'hrs') {
      setAddUser({
        ...addUser,
        working_type,
        intime: '',
        breakin: '',
        breakout: '',
      });
    } else {
      setAddUser({
        ...addUser,
        working_type,
        intime: '',
        outtime: '',
        breakmins: '',
        breakin: '',
        breakout: '',
      });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserMsg({ message: '', type: '' });
    if (!/^[A-Za-z]\d+$/.test(addUser.id)) {
      setAddUserMsg({ message: 'Invalid ID format', type: 'danger' });
      clearMessage(setAddUserMsg);
      return;
    }
    try {
      const res = await axios.post('/add_user', addUser);
      setAddUserMsg({ message: res.data.message, type: 'success' });
      setAddUser({
        id: '',
        name: '',
        dept: '',
        designation: '',
        staff_type: '',
        working_type: '',
        intime: '',
        outtime: '',
        breakmins: '',
        breakin: '',
        breakout: '',
      });
      clearMessage(setAddUserMsg);
    } catch (err) {
      setAddUserMsg({ message: err.response?.data?.error || 'Add user failed', type: 'danger' });
      setAddUser({
        id: '',
        name: '',
        dept: '',
        designation: '',
        staff_type: '',
        working_type: '',
        intime: '',
        outtime: '',
        breakmins: '',
        breakin: '',
        breakout: '',
      });
      clearMessage(setAddUserMsg);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setDeleteUserMsg({ message: '', type: '' });
    if (!/^[A-Za-z]\d+$/.test(deleteId)) {
      setDeleteUserMsg({ message: 'Invalid ID format', type: 'danger' });
      clearMessage(setDeleteUserMsg);
      return;
    }
    try {
      const res = await axios.post('/delete_user', { id: deleteId });
      setDeleteUserMsg({ message: res.data.message, type: 'success' });
      setDeleteId('');
      clearMessage(setDeleteUserMsg);
    } catch (err) {
      setDeleteUserMsg({ message: err.response?.data?.error || 'Delete user failed', type: 'danger' });
      setDeleteId('');
      clearMessage(setDeleteUserMsg);
    }
  };

  const handleDeleteLogs = async () => {
    setDeleteLogsMsg({ message: '', type: '' });
    try {
      const res = await axios.post('/delete_logs');
      setDeleteLogsMsg({ message: res.data.message, type: 'success' });
      clearMessage(setDeleteLogsMsg);
    } catch (err) {
      setDeleteLogsMsg({ message: err.response?.data?.error || 'Delete logs failed', type: 'danger' });
      clearMessage(setDeleteLogsMsg);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Device Manager</h2>

     
      <div className="card mb-4">
        <div className="card-header">Add User</div>
        <div className="card-body">
          <form onSubmit={handleAddUser}>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Staff ID (e.g., S123)"
                value={addUser.id}
                onChange={(e) => setAddUser({ ...addUser, id: e.target.value })}
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={addUser.name}
                onChange={(e) => setAddUser({ ...addUser, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-2">
              <select
                className="form-control"
                value={addUser.staff_type}
                onChange={(e) => setAddUser({ ...addUser, staff_type: e.target.value, dept: '' })}
                required
              >
                <option value="">Choose Staff Type</option>
                <option value="Teaching Staff">Teaching Staff</option>
                <option value="Non-Teaching Staff">Non-Teaching Staff</option>
              </select>
            </div>
            <div className="mb-2">
              <select
                className="form-control"
                value={addUser.dept}
                onChange={(e) => setAddUser({ ...addUser, dept: e.target.value })}
                required
                disabled={!addUser.staff_type}
              >
                <option value="">Choose Department</option>
                {addUser.staff_type === 'Teaching Staff' &&
                  TeachingStaff.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                {addUser.staff_type === 'Non-Teaching Staff' &&
                  NonTeachingStaff.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
              </select>
            </div>
            <select
              className="form-control mb-2"
              value={addUser.designation}
              onChange={(e) => setAddUser({ ...addUser, designation: e.target.value })}
              required
            >
              <option value="">Choose Designation</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Professor">Professor</option>
              <option value="HOD">HOD</option>
            </select>
          
            <div className="mb-2">
              <select
                className="form-control"
                value={addUser.working_type}
                onChange={handleWorkingTypeChange}
                required
              >
                <option value="">Choose Working Type</option>
                <option value="fixed">Fixed Timing</option>
                <option value="hrs">Hourly Based</option>
              </select>
            </div>
            {addUser.working_type === 'fixed' && (
              <>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="In time (e.g., 09:00)"
                    pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                    value={addUser.intime}
                    onChange={(e) => setAddUser({ ...addUser, intime: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Out time (e.g., 17:30)"
                    pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                    value={addUser.outtime}
                    onChange={(e) => setAddUser({ ...addUser, outtime: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Break Minutes (e.g., 30)"
                    value={addUser.breakmins}
                    onChange={(e) => setAddUser({ ...addUser, breakmins: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Break in (e.g., 13:00)"
                    pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                    value={addUser.breakin}
                    onChange={(e) => setAddUser({ ...addUser, breakin: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Break out (e.g., 13:30)"
                    pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                    value={addUser.breakout}
                    onChange={(e) => setAddUser({ ...addUser, breakout: e.target.value })}
                    required
                  />
                </div>
              </>
            )}
            {addUser.working_type === 'hrs' && (
              <>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Working Hours (e.g., 08:30)"
                    pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                    value={addUser.outtime}
                    onChange={(e) => setAddUser({ ...addUser, outtime: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Break Minutes"
                    value={addUser.breakmins}
                    onChange={(e) => setAddUser({ ...addUser, breakmins: e.target.value })}
                  />
                </div>
              </>
            )}
            <button className="btn btn-primary" type="submit">
              Add User
            </button>
          </form>
          {addUserMsg.message && (
            <div className={`mt-2 alert alert-${addUserMsg.type}`}>
              {addUserMsg.message}
            </div>
          )}
        </div>
      </div>

      {/* Delete User Section */}
      <div className="card mb-4">
        <div className="card-header">Delete User</div>
        <div className="card-body">
          <form onSubmit={handleDeleteUser}>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Staff ID (e.g., S123)"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-danger" type="submit">
              Delete User
            </button>
            {deleteUserMsg.message && (
              <div className={`mt-2 alert alert-${deleteUserMsg.type}`}>
                {deleteUserMsg.message}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Delete Logs Section */}
      <div className="card mb-4">
        <div className="card-header">Delete Logs</div>
        <div className="card-body">
          <button className="btn btn-warning" onClick={handleDeleteLogs}>
            Delete Logs
          </button>
          {deleteLogsMsg.message && (
            <div className={`mt-2 alert alert-${deleteLogsMsg.type}`}>
              {deleteLogsMsg.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeviceManager;
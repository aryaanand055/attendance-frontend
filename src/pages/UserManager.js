import React, { useState } from 'react';
import axios from '../axios';

import PageWrapper from '../components/PageWrapper';
import { useAlert } from '../components/AlertProvider';

function UserManager() {

  const { showAlert } = useAlert();
  const TeachingStaff = ['CSE', 'ECE', 'MECH'];
  const NonTeachingStaff = ['ADMIN', 'LIBRARY'];
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

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
  const [deleteId, setDeleteId] = useState('');

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
    if (!/^[A-Za-z]\d+$/.test(addUser.id)) {
      console.error("Error adding user: ")
      showAlert("Invalid ID format", "danger");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/add_user', addUser);
      if (res.data.success === true && res.data.message === 'User added successfully') {
        showAlert(res.data.message, "success");
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

      }
    } catch (err) {
      console.error("Error in adding user: ", err.response?.data?.error || 'Add user failed')
      showAlert('Add user failed', "danger")
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    if (!/^[A-Za-z]\d+$/.test(deleteId)) {
      showAlert('Invalid ID format', 'danger')
      return;
    }
    setLoading1(true)
    try {
      const res = await axios.post('/delete_user', { id: deleteId });
      showAlert(res.data.message, 'success')
      setDeleteId('');
    } catch (err) {
      showAlert('User deletion failed', "danger");
      console.error(err.response?.data?.error || "User deleteion failed for unknown reason")
      setDeleteId('');
    } finally {
      setLoading1(false)
    }
  };


  return (
    <PageWrapper title="User Manager">

      {/* Add User Section */}
      <div className="mb-5 p-4 rounded-4 border bg-light">
        <h4 className="mb-4 text-c-primary fw-bold">Add User</h4>
        <form onSubmit={handleAddUser}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Staff ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., S123"
                value={addUser.id}
                onChange={(e) => setAddUser({ ...addUser, id: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={addUser.name}
                onChange={(e) => setAddUser({ ...addUser, name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Staff Type</label>
              <select
                className="form-select"
                value={addUser.staff_type}
                onChange={(e) => setAddUser({ ...addUser, staff_type: e.target.value, dept: '' })}
                required
              >
                <option value="">Choose Staff Type</option>
                <option value="Teaching Staff">Teaching Staff</option>
                <option value="Non-Teaching Staff">Non-Teaching Staff</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={addUser.dept}
                onChange={(e) => setAddUser({ ...addUser, dept: e.target.value })}
                required
                disabled={!addUser.staff_type}
              >
                <option value="">Choose Department</option>
                {(addUser.staff_type === 'Teaching Staff' ? TeachingStaff : NonTeachingStaff).map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Designation</label>
              <select
                className="form-select"
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
            </div>
            <div className="col-md-6">
              <label className="form-label">Working Type</label>
              <select
                className="form-select"
                value={addUser.working_type}
                onChange={handleWorkingTypeChange}
                required
              >
                <option value="">Choose Working Type</option>
                <option value="fixed">Fixed Timing</option>
                <option value="hrs">Hourly Based</option>
              </select>
            </div>

            {/* Fixed Working Type Inputs */}
            {addUser.working_type === 'fixed' && (
              <>
                <div className="col-md-4">
                  <label className="form-label">In Time</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="HH:MM"
                    pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                    value={addUser.intime}
                    onChange={(e) => setAddUser({ ...addUser, intime: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Out Time</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="HH:MM"
                    pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                    value={addUser.outtime}
                    onChange={(e) => setAddUser({ ...addUser, outtime: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Break Minutes</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g., 30"
                    value={addUser.breakmins}
                    onChange={(e) => setAddUser({ ...addUser, breakmins: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Break In</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="HH:MM"
                    pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                    value={addUser.breakin}
                    onChange={(e) => setAddUser({ ...addUser, breakin: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Break Out</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="HH:MM"
                    pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                    value={addUser.breakout}
                    onChange={(e) => setAddUser({ ...addUser, breakout: e.target.value })}
                    required
                  />
                </div>
              </>
            )}

            {/* Hourly Working Type Inputs */}
            {addUser.working_type === 'hrs' && (
              <>
                <div className="col-md-6">
                  <label className="form-label">Working Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="HH:MM"
                    pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                    value={addUser.outtime}
                    onChange={(e) => setAddUser({ ...addUser, outtime: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Break Minutes</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g., 30"
                    value={addUser.breakmins}
                    onChange={(e) => setAddUser({ ...addUser, breakmins: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-c-primary px-5" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding...
                </>
              ) : (
                "Add User"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Edit User section */}
      < div className='mb-5 p-4 rounded-3 bg-light border' >
        <h4 className="mb-3 text-c-primary fw-bold">Edit User</h4>
        <div className="">This section is under construction... Please check back later</div>
      </div >

      {/* Delete User Section */}
      < div className="mb-5 p-4 rounded-3 bg-light border" >
        <h4 className="text-c-primary mb-3 fw-bold">Delete User</h4>
        <div className="">
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
            <button className="btn btn-c-secondary" type="submit" disabled={loading1}>
              {loading1 ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}

            </button>

          </form>
        </div>
      </div >


    </PageWrapper >
  );
}

export default UserManager;
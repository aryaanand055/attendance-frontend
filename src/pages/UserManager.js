import React, { useState, useEffect, useMemo } from 'react';
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
    category: '',
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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        if (res.data.success) {
          setCategories(res.data.categories);

        } else {
          showAlert('Failed to fetch categories', 'error');
        }
      } catch (error) {
        showAlert('Failed to fetch categories', 'error');
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    console.log(val)
    if (val !== 'custom') {
      setAddUser(prev => ({
        ...prev,
        staff_type: '',
        working_type: '',
        intime: '',
        outtime: '',
        breakmins: '',
        breakin: '',
        breakout: ''
      }));
    }
  };


  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!/^[A-Za-z]\d+$/.test(addUser.id)) {
      showAlert("Invalid ID format", "danger");
      return;
    }

    const payload =
      selectedCategory === 'custom'
        ? { ...addUser, category: -1 }
        : {
          id: addUser.id,
          name: addUser.name,
          dept: addUser.dept,
          designation: addUser.designation,
          category: selectedCategory,
        };

    setLoading(true);
    try {
      const res = await axios.post('/add_user', payload);
      if (res.data.success === true && res.data.message === 'User added successfully') {
        showAlert(res.data.message, "success");
        setAddUser({
          id: '',
          name: '',
          dept: '',
          category: '',
          designation: '',
          staff_type: '',
          working_type: '',
          intime: '',
          outtime: '',
          breakmins: '',
          breakin: '',
          breakout: '',
        });
        setSelectedCategory('');
      }
    } catch (err) {
      console.error("Error in adding user: ", err.response.data || 'Add user failed');
      showAlert('Add user failed', "danger");
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
  const formatTime = (timeStr) => {
    if (timeStr === "0" || !timeStr) return "—";
    const [hh, mm] = timeStr.split(':');
    return `${hh}:${mm}`;
  };

  const categoryStaffType = useMemo(() => {
    // eslint-disable-next-line eqeqeq
    const selectedCategoryObj = categories.find(cat => toString(cat.category_no) == toString(selectedCategory));
    if (!selectedCategoryObj) return '';

    const desc = selectedCategoryObj.category_description.toLowerCase();
    if (desc.includes('teaching')) {
      return desc.includes('non') ? 'Non-Teaching Staff' : 'Teaching Staff';
    }
    return '';
  }, [categories, selectedCategory]);


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

            <div className='col-md-12'>
              <label className='form-label'>Category</label>
              <select
                className='form-select'
                value={selectedCategory}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Choose Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.category_no}>
                    {cat.category_no} - {cat.category_description} - {formatTime(cat.in_time)} - {formatTime(cat.break_in)} - {formatTime(cat.break_out)} - {formatTime(cat.out_time)} - {cat.break_time_mins}
                  </option>
                ))}
                <option value="custom">Custom</option>
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
            {selectedCategory === 'custom' && (
              <>
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
              </>
            )}

            <div className="col-md-6">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={addUser.dept}
                onChange={(e) => setAddUser({ ...addUser, dept: e.target.value })}
                required
                disabled={!selectedCategory}
              >
                <option value="">Choose Department</option>
                {(
                  selectedCategory === 'custom'
                    ? (addUser.staff_type === 'Teaching Staff'
                      ? TeachingStaff
                      : addUser.staff_type === 'Non-Teaching Staff'
                        ? NonTeachingStaff
                        : [])
                    : (categoryStaffType === 'Teaching Staff'
                      ? TeachingStaff
                      : categoryStaffType === 'Non-Teaching Staff'
                        ? NonTeachingStaff
                        : [])
                ).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}

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
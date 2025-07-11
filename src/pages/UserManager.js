import React, { useState, useEffect } from 'react';
import axios from '../axios';
import PageWrapper from '../components/PageWrapper';
import { useAlert } from '../components/AlertProvider';

function UserManager() {
  const { showAlert } = useAlert();
  const Departments = ['CSE', 'ECE', 'MECH', 'ADMIN', 'LIBRARY'];


  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [addUser, setAddUser] = useState({
    id: '',
    name: '',
    dept: '',
    designation: '',
  });

  const [editUser, setEditUser] = useState(null);
  const [editSearchId, setEditSearchId] = useState('');

  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        if (res.data.success) setCategories(res.data.categories);
        else showAlert('Failed to fetch categories', 'error');
      } catch (err) {
        console.error(err);
        showAlert('Error fetching categories', 'danger');
      }
    };
    fetchCategories();
  }, []);

  const formatTime = (timeStr) => {
    if (timeStr === "0" || !timeStr) return "—";
    const [hh, mm] = timeStr.split(':');
    return `${hh}:${mm}`;
  };



  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    setAddUser(prev => ({ ...prev, dept: '' }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!/^[A-Za-z]\d+$/.test(addUser.id)) {
      showAlert("Invalid ID format", "danger");
      return;
    }

    const payload = {
      ...addUser,
      category: Number(selectedCategory)
    };

    setLoading(true);
    try {
      const res = await axios.post('/add_user', payload);
      if (res.data.success) {
        showAlert(res.data.message, 'success');
        setAddUser({ id: '', name: '', dept: '', designation: '' });
        setSelectedCategory('');
      }
    } catch (err) {
      showAlert("Add user failed", 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchEditUser = async () => {
    if (!editSearchId.trim()) return;
    try {
      const res = await axios.get(`/get_user/${editSearchId}`);
      if (res.data.success) {
        const user = res.data.user;
        console.log('Fetched user:', user);
        setEditUser({
          id: user.staff_id,
          name: user.name,
          dept: user.dept,
          designation: user.designation,
          category: user.category.toString(),
        });
      } else {
        showAlert(res.data.message, 'danger');
        setEditUser(null);
      }
    } catch (err) {
      console.error(err);
      showAlert('Fetch user failed', 'danger');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const payload = {
      id: editUser.id,
      name: editUser.name,
      dept: editUser.dept,
      designation: editUser.designation,
      category: Number(editUser.category),
    };

    setEditLoading(true);
    try {
      const res = await axios.post('/edit_user', payload);
      if (res.data.success) {
        showAlert(res.data.message, 'success');
        setEditUser(null);
        setEditSearchId('');
      } else {
        showAlert(res.data.message || 'Update failed', 'danger');
      }
    } catch (err) {
      console.error(err);
      showAlert('Update failed', 'danger');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    if (!/^[A-Za-z]\d+$/.test(deleteId)) {
      showAlert('Invalid ID format', 'danger');
      return;
    }
    setLoading1(true);
    try {
      const res = await axios.post('/delete_user', { id: deleteId });
      showAlert(res.data.message, 'success');
      setDeleteId('');
    } catch (err) {
      showAlert('User deletion failed', 'danger');
    } finally {
      setLoading1(false);
    }
  };

  return (
    <PageWrapper title="User Manager">

      {/* Add User */}
      <div className="mb-5 p-4 rounded-4 border bg-light">
        <h4 className="mb-4 text-c-primary fw-bold">Add User</h4>
        <form onSubmit={handleAddUser}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Staff ID</label>
              <input type="text" className="form-control" value={addUser.id} onChange={(e) => setAddUser({ ...addUser, id: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" value={addUser.name} onChange={(e) => setAddUser({ ...addUser, name: e.target.value })} required />
            </div>
            <div className="col-md-12">
              <label className="form-label">Category</label>
              <select className="form-select" value={selectedCategory} onChange={handleCategoryChange} required>
                <option value="">Choose Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat.category_no}>
                    {cat.category_no} - {cat.category_description} - {formatTime(cat.in_time)} - {formatTime(cat.break_in)} - {formatTime(cat.break_out)} - {formatTime(cat.out_time)} - {cat.break_time_mins}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Designation</label>
              <select className="form-select" value={addUser.designation} onChange={(e) => setAddUser({ ...addUser, designation: e.target.value })} required>
                <option value="">Choose Designation</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
                <option value="HOD">HOD</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Department</label>
              <select className="form-select" value={addUser.dept} onChange={(e) => setAddUser({ ...addUser, dept: e.target.value })} required>
                <option value="">Choose Department</option>
                {Departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-c-primary px-5" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>

      {/* Edit User */}
      <div className="mb-5 p-4 rounded-3 bg-light border">
        <h4 className="mb-3 text-c-primary fw-bold">Edit User</h4>
        <div className="mb-3 d-flex gap-2">
          <input className="form-control" placeholder="Enter Staff ID" value={editSearchId} onChange={(e) => setEditSearchId(e.target.value)} />
          <button className="btn btn-outline-primary" onClick={handleSearchEditUser}>Search</button>
        </div>
        {editUser && (
          <form onSubmit={handleEditUser}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Designation</label>
                <select className="form-select" value={editUser.designation} onChange={(e) => setEditUser({ ...editUser, designation: e.target.value })} required>
                  <option value="">Choose Designation</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Professor">Professor</option>
                  <option value="HOD">HOD</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Department</label>
                <select className="form-select" value={editUser.dept} onChange={(e) => setEditUser({ ...editUser, dept: e.target.value })} required>
                  <option value="">Choose Department</option>
                  {Departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select className="form-select" value={editUser.category} onChange={(e) => setEditUser({ ...editUser, category: e.target.value })} required>
                  <option value="">Choose Category</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat.category_no}>
                      {cat.category_no} - {cat.category_description} - {formatTime(cat.in_time)} - {formatTime(cat.break_in)} - {formatTime(cat.break_out)} - {formatTime(cat.out_time)} - {cat.break_time_mins}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary px-5" disabled={loading}>
                {loading ? 'Editing...' : 'Edit User'}
              </button>

            </div>
          </form>
        )}
      </div>


      <div className="mb-5 p-4 rounded-3 bg-light border">
        <h4 className="text-c-primary mb-3 fw-bold">Delete User</h4>
        <form onSubmit={handleDeleteUser}>
          <div className="mb-2">
            <input type="text" className="form-control" placeholder="Staff ID (e.g., S123)" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} required />
          </div>
          <button className="btn btn-c-secondary" type="submit" disabled={loading1}>
            {loading1 ? 'Deleting...' : 'Delete User'}
          </button>
        </form>
      </div>

    </PageWrapper>
  );
}

export default UserManager;

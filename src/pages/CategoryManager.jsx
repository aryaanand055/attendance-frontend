import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useAlert } from '../components/AlertProvider';
import PageWrapper from '../components/PageWrapper';

function CategoryManagerPage() {
    const { showAlert } = useAlert();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        category_description: '',
        type: 'fixed',
        in_time: '',
        break_in: '',
        break_out: '',
        out_time: '',
        break_time_mins: '',
      
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

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

    const formatTime = (timeStr) => {
        if (timeStr === "0" || !timeStr) return "—";
        const [hh, mm] = timeStr.split(':');
        return `${hh}:${mm}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        
        const payload = {
            category_description: form.category_description,
            type: form.type,
            in_time: form.type === 'fixed' ? form.in_time : '',
            break_in: form.type === 'fixed' ? form.break_in : '',
            break_out: form.type === 'fixed' ? form.break_out : '',
            out_time: form.out_time ,
            break_time_mins: form.break_time_mins,
           
        };
        try {
            const res = await axios.post("/add_categories", payload);
            if (res.data.success) {
                showAlert(res.data.message, 'success');
                setForm({
                    category_description: '',
                    type: 'fixed',
                    in_time: '',
                    break_in: '',
                    break_out: '',
                    out_time: '',
                    break_time_mins: '',
                    working_hrs: ''
                });
                fetchCategories();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                showAlert(err.response.data.message, 'error');
            } else {
                showAlert('Failed to add category', 'error');
            }
        }
        setLoading(false);
    };

    const downloadPDF = () => {
        console.log("Downloading pdf")
    };

    return (
        <PageWrapper title="Manage Categories">
            {/* View Categories */}
            <div className="mb-5 p-4 rounded-3 bg-light border">
                <div className="w-100 d-flex justify-content-between mb-4">
                    <h4 className="mb-3 text-secondary">View Categories</h4>
                    <button className="btn btn-outline-primary float-end" onClick={downloadPDF} type="button">
                        Download PDF
                    </button>
                </div>
                {categories.length === 0 ? (
                    <p>No categories found.</p>
                ) : (
                    <div className="table-responsive rounded-3">
                        <table className="table table-c">
                            <thead className="table-secondary">
                                <tr>
                                    <th>#</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>In Time</th>
                                    <th>Break In</th>
                                    <th>Break Out</th>
                                    <th>Out Time</th>
                                    <th>Working Hrs</th>
                                    <th>Break (mins)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, index) => (
                                    <tr key={index}>
                                        <td>{cat.category_no}</td>
                                        <td>{cat.category_description}</td>
                                        <td>{cat.type || 'fixed'}</td>
                                        <td>{formatTime(cat.in_time)}</td>
                                        <td>{formatTime(cat.break_in)}</td>
                                        <td>{formatTime(cat.break_out)}</td>
                                        <td>{formatTime(cat.out_time)}</td>
                                        <td>{cat.working_hrs || '—'}</td>
                                        <td>{cat.break_time_mins}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Category */}
            <div className="mb-5 p-4 rounded-3 bg-light border">
                <h4 className="mb-3 text-secondary">Add Category</h4>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Description</label>
                        <select
                            className="form-control"
                            name="category_description"
                            value={form.category_description}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Teaching Staff">Teaching Staff</option>
                            <option value="Non Teaching Staff">Non Teaching Staff</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Type</label>
                        <select
                            className="form-control"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="fixed">Fixed</option>
                            <option value="hrs">Hrs</option>
                        </select>
                    </div>
                    {form.type === 'fixed' ? (
                        <>
                            <div className="col-md-2">
                                <label className="form-label">In Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="in_time"
                                    value={form.in_time}
                                    onChange={handleChange}
                                    required={form.type === 'fixed'}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Break In</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="break_in"
                                    value={form.break_in}
                                    onChange={handleChange}
                                    required={form.type === 'fixed'}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Break Out</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="break_out"
                                    value={form.break_out}
                                    onChange={handleChange}
                                    required={form.type === 'fixed'}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Out Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="out_time"
                                    value={form.out_time}
                                    onChange={handleChange}
                                    required={form.type === 'fixed'}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="col-md-2">
                            <label className="form-label">Working Hrs</label>
                            <input
                                type="time"
                                className="form-control"
                                name="out_time"
                                value={form.out_time}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 08:00"
                            />
                        </div>
                    )}
                    <div className="col-md-2">
                        <label className="form-label">Break (mins)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="break_time_mins"
                            value={form.break_time_mins}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Adding..." : "Add Category"}
                        </button>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
}

export default CategoryManagerPage;
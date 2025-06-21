import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useAlert } from '../components/AlertProvider';
import PageWrapper from '../components/PageWrapper';


function CategoryManagerPage() {
    const { showAlert } = useAlert();
    const [categories, setCategories] = useState([]);

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

    const formatTime = (timeStr) => {
        if (timeStr === "0" || !timeStr) return "—";
        const [hh, mm] = timeStr.split(':');
        return `${hh}:${mm}`;
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
                                    <th>In Time</th>
                                    <th>Break In</th>
                                    <th>Break Out</th>
                                    <th>Out Time</th>
                                    <th>Break (mins)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, index) => (
                                    <tr key={index}>
                                        <td>{cat.category_no}</td>
                                        <td>{cat.category_description}</td>
                                        <td>{formatTime(cat.in_time)}</td>
                                        <td>{formatTime(cat.break_in)}</td>
                                        <td>{formatTime(cat.break_out)}</td>
                                        <td>{formatTime(cat.out_time)}</td>
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
                <h6>Page under construction... Check Back later</h6>
            </div>
        </PageWrapper>
    );
}

export default CategoryManagerPage;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ employeeId: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/view'; // fallback to /view if none

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate login and token return
    const dummyToken = 'dummy-jwt-token';
    onLogin(dummyToken);

    // Redirect to the original route
    navigate(from, { replace: true });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4">Employee Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Employee ID</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;

import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../auth/authProvider';
import { useAlert } from '../components/AlertProvider';

function LoginPage() {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const navigate = useNavigate();
  // const location = useLocation();
  const { login } = useAuth();
  const { showAlert } = useAlert();

  // const from = location.state?.from?.pathname || '/view';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData);
      console.log('Login result:', result);
      if (result.success) {
        showAlert('Login successful!', 'success');
        if (result.designation === 'HR') {
          // navigate(from || '/view', { replace: true });
          navigate('/view', { replace: true });
        } else if (result.designation) {
          navigate('/staffIndividualReport', { replace: true });
        } else {
          showAlert('Unknown designation. Redirecting to dashboard.', 'warning');
        }
      } else if (result.reason === 'invalid_credentials') {
        showAlert('Invalid User ID or Password', 'error');
      } else {
        showAlert('An error occurred during login. Please try again.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred during login. Please try again.', 'error');
    }
  };

  return (
    <div className="w-50 m-auto">

      <PageWrapper title="Login">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">User ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 btn-c-primary">Login</button>
        </form>
      </PageWrapper>
    </div>

  );
}

export default LoginPage;
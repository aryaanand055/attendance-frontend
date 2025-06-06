import axios from 'axios';
import React, {  useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/view'; 


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/login', formData)
      .then((response) => {
        console.log('Login response:', response.data);
        if (response.data.message === 'Logged in successfully') {
         
          navigate(from, { replace: true });
        } else {
          alert('Login failed');
        }
      })
      .catch((error) => {
        alert('An error occurred during login. Please try again.');
      });

  };

  

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4">Employee Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">User ID</label>
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

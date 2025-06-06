import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import AttendanceViewer from './pages/AttendanceViewer';
import DepartmentSummary from './pages/DepartmentSummary';
import IndividualAttendanceTable from './pages/IndividualAttendanceTable';
import LoginPage from './pages/LoginPage';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;

function RequireAuth({ isAuthenticated, children }) {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
     
      try {
        const res = await axios.get('/check_session');
        if(res.data.message = 'Valid token'){
        
          setIsAuthenticated(true);
        }
        else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Session check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
   
    checkSession();
  }, []);

  const handleLogout = () => {
    axios.post('/logout')
      .then(() => {
        setIsAuthenticated(false);
      })
      .catch((err) => {
        console.error('Logout error:', err);
      });
  };

  if (loading) return <div className="text-center mt-5">Checking session...</div>;

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <a className="navbar-brand" href="/">Attendance App</a>
          {isAuthenticated && (
            <div className="navbar-nav">
              <Link className="nav-link" to="/view">Live Records</Link>
              <Link className="nav-link" to="/summary">Department Summary</Link>
              <Link className="nav-link" to="/individual">Individual Data</Link>
              <button className="btn btn-sm btn-outline-light ms-3" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/view"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <AttendanceViewer />
              </RequireAuth>
            }
          />
          <Route
            path="/summary"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <DepartmentSummary />
              </RequireAuth>
            }
          />
          <Route
            path="/individual"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <IndividualAttendanceTable />
              </RequireAuth>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <Navigate to="/view" replace />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

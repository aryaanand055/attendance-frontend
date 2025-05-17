import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import AttendanceViewer from './pages/AttendanceViewer';
import DepartmentSummary from './pages/DepartmentSummary';
import IndividualAttendanceTable from './pages/IndividualAttendanceTable';
import LoginPage from './pages/LoginPage';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

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
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/view"
            element={
              <RequireAuth>
                <AttendanceViewer />
              </RequireAuth>
            }
          />
          <Route
            path="/summary"
            element={
              <RequireAuth>
                <DepartmentSummary />
              </RequireAuth>
            }
          />
          <Route
            path="/individual"
            element={
              <RequireAuth>
                <IndividualAttendanceTable />
              </RequireAuth>
            }
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/view" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

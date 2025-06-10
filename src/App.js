import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import AttendanceViewer from './pages/AttendanceViewer';
import DepartmentSummary from './pages/DepartmentSummary';
import IndividualAttendanceTable from './pages/IndividualAttendanceTable';
import LoginPage from './pages/LoginPage';
import { useAuth, AuthProvider } from './auth/authProvider'; 

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth(); 
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppContent() {
  const { isAuthenticated, logout } = useAuth(); 

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
              <button className="btn btn-sm btn-outline-light ms-3" onClick={logout}>Logout</button>
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
            element={
              <RequireAuth>
                <Navigate to="/view" replace />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
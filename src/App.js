import React from 'react';

import {
BrowserRouter as Router,
Routes,
Route,
Link,
Navigate,
useLocation
}

from 'react-router-dom';
import AttendanceViewer from './pages/AttendanceViewer';
import DepartmentSummary from './pages/DepartmentSummary';
import IndividualAttendanceTable from './pages/IndividualAttendanceTable';
import LoginPage from './pages/LoginPage';

import {
useAuth,
AuthProvider
}

from './auth/authProvider';

import {
AlertProvider
}

from './components/AlertProvider';

function RequireAuth({
children
}

) {
const {
isAuthenticated
}

= useAuth();
const location = useLocation();

if (!isAuthenticated) {

return <Navigate to="/login" state={ { from: location } } replace />;
}

return children;
}

function AppContent() {
const {
isAuthenticated,
logout
}

= useAuth();

return (
  <Router>
    <div className="glassy-navbar-wrapper d-flex justify-content-center mt-3">
      <nav className="navbar navbar-expand-lg glassy-navbar">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold mx-3" href="/" title="Dashboard">Attendance App</a>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {isAuthenticated &&
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
                <li className="nav-item">
                  <Link className="nav-link" to="/view">Live Records</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/summary">Department Summary</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/individual">Individual Data</Link>
                </li>
              </ul>
            }

            {isAuthenticated ? (
              <button className="nav-link d-flex align-items-center btn btn-link" onClick={logout} title="Logout">
                <i className="bi bi-box-arrow-right fs-4"></i>
              </button>
            ) : (
              <div className="ms-auto">
                <Link className="nav-link d-flex align-items-center" to="/login" title="Login">
                  <i className="bi bi-box-arrow-in-right fs-4"></i>
                </Link>
              </div>
            )}

          </div>
        </div>
      </nav>
    </div>
    <div className="container m-large">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/view" element={
          <RequireAuth>
            <AttendanceViewer />
          </RequireAuth>
        } />
        <Route path="/summary" element={
          <RequireAuth>
            <DepartmentSummary />
          </RequireAuth>
        } />
        <Route path="/individual" element={
          <RequireAuth>
            <IndividualAttendanceTable />
          </RequireAuth>
        } />
        <Route path="/" element={
          <RequireAuth>
            <Navigate to="/view" replace />
          </RequireAuth>
        } />
      </Routes>
    </div>
  </Router>
);
}

function App() {
return (<AuthProvider>
  <AlertProvider>
    <AppContent />
  </AlertProvider>
</AuthProvider>);
}

export default App;
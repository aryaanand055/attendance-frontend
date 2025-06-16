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
import IndividualStaffReport from './pages/IndividualStaffReport';
import LoginPage from './pages/LoginPage';
import HRExcemptions from './pages/HRExcemptions';
import DeviceManager from './pages/device';
import {
  useAuth,
  AuthProvider
}

  from './auth/authProvider';

import {
  AlertProvider
}

  from './components/AlertProvider';

function RequireHR({ children }) {
  const { isAuthenticated, designation } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (designation !== "HR") {
    return <Navigate to="/staffIndividualReport" replace />;
  }
  return children;
}

function RequireStaff({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppContent() {
  const {
    isAuthenticated,
    logout,
    designation
  } = useAuth();

  return (
    <Router>
      <div className="glassy-navbar-wrapper d-flex justify-content-center">
        <nav className="navbar navbar-expand-lg glassy-navbar">
          <div className="container-fluid">
            <a className="navbar-brand d-flex align-items-center fw-bold mx-3" href="/" title="Dashboard">
              <img src="https://psgitech.ac.in/assets/images/favicon.png" alt="Logo" style={{ height: '32px', width: '32px', marginRight: '10px' }} />
              Attendance App
            </a>
            <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              {isAuthenticated && designation === "HR" &&
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
                  <li className="nav-item">
                    <Link className="nav-link" to="/exemptions">Exemptions</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/device">Device Manager</Link> 
                  </li>
                </ul>
              }
              {isAuthenticated && designation !== "HR" &&
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
                  <li className="nav-item">
                    <Link className="nav-link" to="/staffIndividualReport">Attendance Report</Link>
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
            <RequireHR>
              <AttendanceViewer />
            </RequireHR>
          } />
          <Route path="/summary" element={
            <RequireHR>
              <DepartmentSummary />
            </RequireHR>
          } />
          <Route path="/individual" element={
            <RequireHR>
              <IndividualAttendanceTable />
            </RequireHR>
          } />
          <Route path="/staffIndividualReport" element={
            <RequireStaff>
              <IndividualStaffReport />
            </RequireStaff>
          } />
          <Route path="/exemptions" element={
            <RequireHR>
              <HRExcemptions />
            </RequireHR>
          } />
          <Route path="/device" element={
            <RequireHR>
              <DeviceManager />
            </RequireHR>
          } />
         
          <Route path="/" element={
            isAuthenticated
              ? (designation === "HR"
                ? <Navigate to="/view" replace />
                : <Navigate to="/staffIndividualReport" replace />)
              : <Navigate to="/login" replace />
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
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AttendanceViewer from './pages/AttendanceViewer';
import DepartmentSummary from './pages/DepartmentSummary';
import IndividualAttendanceTable from './pages/IndividualAttendanceTable';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <a className="navbar-brand" href="/">Attendance App</a>
          <div className="navbar-nav">
            <Link className="nav-link" to="/view">Live Records</Link>
            <Link className="nav-link" to="/summary">Department Summary</Link>
            <Link className="nav-link" to="/individual">Individual Data</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/view" element={<AttendanceViewer />} />
          <Route path="/summary" element={<DepartmentSummary />} />
          <Route path="/individual" element={<IndividualAttendanceTable name="John Doe" category="Staff" designation="Engineer" records={[{ punchdate: '15-05-2025', punchin: '08:30', punchout: '16:30', workingduration: 480 }]} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
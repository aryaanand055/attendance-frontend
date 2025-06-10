import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axios';

function AttendanceViewer() {
  const [selectedDate, setSelectedDate] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [columnsToShow, setColumnsToShow] = useState([]);

  const getLogs = useCallback(async (date) => {
    if (!date) return;
  
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/attendance_viewer', { date });
      const fetchedLogs = response.data || [];
      setLogs(fetchedLogs);
  
      const allColumns = ['IN1', 'OUT1', 'IN2', 'OUT2', 'IN3', 'OUT3'];
      const visibleCols = allColumns.filter(col => 
        fetchedLogs.some(row => row[col])
      );
      setColumnsToShow(visibleCols);
  
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError("Failed to load attendance data");
      setLogs([]);
      setColumnsToShow([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    getLogs(selectedDate);
  }, [selectedDate, getLogs]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Live Attendance Logs</h2>
        <div className="form-group mb-0">
          <label htmlFor="date" className="form-label me-2">Select Date:</label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="text-center my-4">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
        <tr>
            <th>Staff ID</th>
            <th>Name</th>
            {columnsToShow.map((col, i) => (
                                    <th key={i}>{col}</th>
                                ))}
            </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
                <tr key={log.staff_id}>
                  <td>{log.staff_id}</td>
                  <td>{log.name}</td>
                 
                  {columnsToShow.map((col, i) => (
                                        <td key={i}>{log[col] || '-'}</td>
                                    ))}
                   
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                {selectedDate ? "No records found" : "Please select a date"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceViewer;

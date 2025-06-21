import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageWrapper from '../components/PageWrapper';

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

  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Live Attendance Logs', 14, 16);
    doc.setFontSize(12);
    doc.text(`Date: ${selectedDate}`, 14, 26);
    const tableColumn = ['Staff ID', 'Name', ...columnsToShow];
    const tableRows = logs.map((log) => [
      log.staff_id,
      log.name,
      ...columnsToShow.map(col => log[col] || '-')
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [49, 58, 98] },
    });
    doc.save(`attendance_logs_${selectedDate}.pdf`);
  };

  return (
    <PageWrapper title="Live Logs">
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
      <hr className='hr w-75 m-auto my-4 '></hr>

      <button className="btn btn-outline-secondary mb-3" onClick={handleSaveAsPDF}>
        Save as PDF
      </button>

      {loading && <div className="text-center my-4">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-c">
        <thead className="table-secondary">
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

    </PageWrapper >
  );
}

export default AttendanceViewer;

import React from 'react';
import './CustomAlert.css';

function CustomAlert({ message, type = 'error', show, onClose }) {
  return (
    <div className={`custom-alert ${type} ${show ? 'show' : ''}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>&times;</button>
    </div>
  );
}

export default CustomAlert;
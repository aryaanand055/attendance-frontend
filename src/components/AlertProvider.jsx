import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomAlert from './Alert';

const AlertContext = createContext();

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });

  const showAlert = useCallback((message, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type }), 3000);
  }, []);

  const closeAlert = () => setAlert({ ...alert, show: false });

  return (
    <AlertContext.Provider value={{ showAlert }}>
      <CustomAlert
        message={alert.message}
        type={alert.type}
        show={alert.show}
        onClose={closeAlert}
      />
      {children}
    </AlertContext.Provider>
  );
}

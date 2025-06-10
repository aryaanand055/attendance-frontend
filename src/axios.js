import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => response, 
  (error) => {
    console.error('Axios error:', error.response || error.message); // Log the error for debugging
    return Promise.reject(error);
  }
);


export default instance;

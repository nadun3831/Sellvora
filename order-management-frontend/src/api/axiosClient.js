import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'An unexpected error occurred';
    return Promise.reject({ status: err.response?.status, message, raw: err.response?.data });
  }
);

export default api;

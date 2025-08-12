// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Keep global error handler simple — don't redirect here!
api.interceptors.response.use(
  res => res,
  err => Promise.reject(err) // Let the component/context handle 401
);

export default api;

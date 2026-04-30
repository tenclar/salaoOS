import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Optionally add interceptors for auth tokens here

export default api;

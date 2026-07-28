import api from './axios.js';

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const addDemoFunds = () => api.post('/auth/add-demo-funds');

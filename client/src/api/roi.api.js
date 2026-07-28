import api from './axios.js';

export const getROIHistory = (params) => api.get('/roi/history', { params });

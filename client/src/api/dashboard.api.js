import api from './axios.js';

export const getDashboardSummary = () => api.get('/dashboard/summary');
export const getEarnings = (params) => api.get('/dashboard/earnings', { params });

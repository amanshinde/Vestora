import api from './axios.js';

export const createInvestment = (data) => api.post('/investments', data);
export const getInvestments = (params) => api.get('/investments', { params });
export const getInvestmentById = (id) => api.get(`/investments/${id}`);

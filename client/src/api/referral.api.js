import api from './axios.js';

export const getDirectReferrals = () => api.get('/referrals/direct');
export const getReferralTree = () => api.get('/referrals/tree');
export const getReferralIncome = (params) => api.get('/referrals/income', { params });

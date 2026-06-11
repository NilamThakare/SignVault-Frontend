import api from './axiosInstance';

export const getAuditLog = (contractId) => api.get(`/api/audit/${contractId}/log`);
import api from './axiosInstance';

export const getInbox = () => api.get('/api/mailbox/inbox');
export const getOutbox = () => api.get('/api/mailbox/outbox');
export const markAsRead = (contractId) => api.put(`/api/mailbox/${contractId}/mark-read`);
import api from './axiosInstance';

// POST /api/contracts [Auth Required] — multipart/form-data
// Part 1: 'data' (JSON) — title, receiverEmail, periodType, periodValue, periodFrom
// Part 2: 'file' (PDF file)
export const createAndSendContract = (formData) => api.post('/api/contracts', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// GET /api/contracts/{contractId} [Auth Required]
export const getContract = (contractId) => api.get('/api/contracts/' + contractId);

// GET /api/contracts/verify/{contractId} [PUBLIC — No Auth]
export const verifyContract = (contractId) => api.get('/api/contracts/verify/' + contractId);

// PUT /api/contracts/{contractId}/cancel [Auth Required] — SENDER only, PENDING status only
export const cancelContract = (contractId) => api.put('/api/contracts/' + contractId + '/cancel');

// PUT /api/contracts/{contractId}/reject [Auth Required] — RECEIVER only
export const rejectContract = (contractId) => api.put('/api/contracts/' + contractId + '/reject');

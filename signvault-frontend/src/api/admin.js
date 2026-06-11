import api from './axiosInstance';

// ── User Management ──────────────────────────────────────────
// GET /api/admin/users — ADMIN + SUPERADMIN
export const getUsers = () => api.get('/api/admin/users');

// GET /api/admin/users/{id} — ADMIN + SUPERADMIN
export const getUserById = (id) => api.get('/api/admin/users/' + id);

// PUT /api/admin/users/{id}/deactivate — ADMIN + SUPERADMIN
export const deactivateUser = (id) => api.put('/api/admin/users/' + id + '/deactivate');

// PUT /api/admin/users/{id}/promote — SUPERADMIN only
export const promoteUser = (id) => api.put('/api/admin/users/' + id + '/promote');

// PUT /api/admin/users/{id}/demote — SUPERADMIN only
export const demoteUser = (id) => api.put('/api/admin/users/' + id + '/demote');

// ── Contract Management ───────────────────────────────────────
// GET /api/admin/contracts — ADMIN + SUPERADMIN
export const getAllContracts = () => api.get('/api/admin/contracts');

// GET /api/admin/contracts/flagged — ADMIN + SUPERADMIN
export const getFlaggedContracts = () => api.get('/api/admin/contracts/flagged');

// PUT /api/admin/contracts/{contractId}/flag — ADMIN + SUPERADMIN
export const flagContract = (contractId) => api.put('/api/admin/contracts/' + contractId + '/flag');

// PUT /api/admin/contracts/{contractId}/unflag — SUPERADMIN only
export const unflagContract = (contractId) => api.put('/api/admin/contracts/' + contractId + '/unflag');

// PUT /api/admin/contracts/{contractId}/cancel — SUPERADMIN only
export const adminCancelContract = (contractId) => api.put('/api/admin/contracts/' + contractId + '/cancel');

// ── Audit Logs ────────────────────────────────────────────────
// GET /api/admin/audit-logs — ADMIN + SUPERADMIN
export const getAuditLogs = () => api.get('/api/admin/audit-logs');

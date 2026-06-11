import api from './axiosInstance';

// GET /api/users/profile — returns full profile of logged in user
export const getProfile = () => api.get('/api/users/profile');

// PUT /api/users/profile — update profile details
// fullName: String (required), phone: String (optional), age: Integer (optional, min 18)
export const updateProfile = (data) => api.put('/api/users/profile', data);

// DELETE /api/users/deactivate — deactivate logged in user account
export const deactivateAccount = () => api.delete('/api/users/deactivate');

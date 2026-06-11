import api from './axiosInstance';

// POST /api/auth/register
export const register = (data) => api.post('/api/auth/register', data);

// POST /api/auth/login
export const login = (data) => api.post('/api/auth/login', data);

// POST /api/auth/send-email-otp
export const sendEmailOtp = (email) => api.post('/api/auth/send-email-otp', { email });

// POST /api/auth/verify-email-otp
export const verifyEmailOtp = (email, otp) => api.post('/api/auth/verify-email-otp', { email, otp });

// POST /api/auth/send-phone-otp [Auth Required]
export const sendPhoneOtp = (phone) => api.post('/api/auth/send-phone-otp', { phone });

// POST /api/auth/verify-phone-otp [Auth Required]
export const verifyPhoneOtp = (phone, otp) => api.post('/api/auth/verify-phone-otp', { phone, otp });

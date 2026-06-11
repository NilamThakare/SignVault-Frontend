import api from './axiosInstance';

// GET /api/notifications — all notifications, newest first
export const getNotifications = () => api.get('/api/notifications');

// GET /api/notifications/unread-count — returns { data: number }
export const getUnreadCount = () => api.get('/api/notifications/unread-count');

// PUT /api/notifications/{id}/read — mark single notification as read
export const markNotificationRead = (id) => api.put('/api/notifications/' + id + '/read');

// PUT /api/notifications/read-all — mark all as read
export const markAllNotificationsRead = () => api.put('/api/notifications/read-all');

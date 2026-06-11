import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Loader2, CheckCheck, FileText } from 'lucide-react';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../api/notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      const data = res.data;
      if (Array.isArray(data)) {
        setNotifications(data);
      } else if (data && Array.isArray(data.content)) {
        setNotifications(data.content);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAll = async () => {
    setMarking(true);
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      // handle silently
    } finally {
      setMarking(false);
    }
  };

  const handleClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationRead(notification.id);
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
      } catch (err) {
        // handle silently
      }
    }
    if (notification.contractId) {
      navigate('/contracts/' + notification.contractId);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            All your in-app notifications in one place.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={marking}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 self-start sm:self-auto"
          >
            {marking
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <CheckCheck className="w-4 h-4" />
            }
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-slate-400 dark:text-slate-600" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg mb-1">
            No notifications yet
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            You will be notified when someone sends you a contract or signs one.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-white/5">
          {notifications.map((notification, index) => (
            <div
              key={notification.id || index}
              onClick={() => handleClick(notification)}
              className={[
                'flex items-start gap-4 px-6 py-4 transition',
                notification.contractId ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5' : '',
                !notification.read ? 'bg-blue-50/40 dark:bg-blue-500/5' : ''
              ].join(' ')}
            >
              <div className={[
                'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                !notification.read
                  ? 'bg-blue-100 dark:bg-blue-500/20'
                  : 'bg-slate-100 dark:bg-white/5'
              ].join(' ')}>
                <FileText className={[
                  'w-5 h-5',
                  !notification.read
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 dark:text-slate-500'
                ].join(' ')} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={[
                  'text-sm',
                  !notification.read
                    ? 'font-semibold text-slate-900 dark:text-white'
                    : 'font-medium text-slate-700 dark:text-slate-300'
                ].join(' ')}>
                  {notification.message}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {dayjs(notification.createdAt).fromNow()}
                </p>
              </div>

              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

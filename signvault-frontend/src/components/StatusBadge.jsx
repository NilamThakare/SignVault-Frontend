const statusConfig = {
  PENDING: {
    label: 'Pending',
    color: 'bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-500/30'
  },
  SENDER_SIGNED: {
    label: 'Awaiting Sign',
    color: 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
  },
  FULLY_SIGNED: {
    label: 'Fully Signed',
    color: 'bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30'
  },
  EXPIRED: {
    label: 'Expired',
    color: 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30'
  },
  RENEWED: {
    label: 'Renewed',
    color: 'bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30'
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30'
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30'
  },
};

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.PENDING;
  return (
    <span className={'text-xs font-semibold px-2.5 py-1 rounded-full border ' + cfg.color}>
      {cfg.label}
    </span>
  );
}

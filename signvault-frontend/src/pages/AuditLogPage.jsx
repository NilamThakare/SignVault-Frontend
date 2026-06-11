import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuditLogs } from '../api/admin';
import {
  ArrowLeft, Loader2, ClipboardList,
  FileText, CheckCircle, XCircle,
  Flag, FlagOff, Ban, AlertTriangle
} from 'lucide-react';
import dayjs from 'dayjs';

const actionConfig = {
  CONTRACT_CREATED: {
    label: 'Contract Created',
    icon: FileText,
    color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
  },
  CONTRACT_SIGNED: {
    label: 'Contract Signed',
    icon: CheckCircle,
    color: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20'
  },
  CONTRACT_FLAGGED: {
    label: 'Contract Flagged',
    icon: Flag,
    color: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20'
  },
  CONTRACT_UNFLAGGED: {
    label: 'Contract Unflagged',
    icon: FlagOff,
    color: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20'
  },
  CONTRACT_CANCELLED: {
    label: 'Contract Cancelled',
    icon: Ban,
    color: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
  },
  CONTRACT_CANCELLED_BY_SUPERADMIN: {
    label: 'Cancelled by SuperAdmin',
    icon: Ban,
    color: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
  },
  CONTRACT_REJECTED: {
    label: 'Contract Rejected',
    icon: XCircle,
    color: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
  },
};

export default function AuditLogPage() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await getAuditLogs();
        const data = res.data?.data || res.data;
        const allLogs = Array.isArray(data) ? data : [];
        const filtered = contractId
          ? allLogs.filter(l => l.contractId === contractId)
          : allLogs;
        setLogs(filtered);
      } catch (err) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [contractId]);

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit Log</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {contractId
            ? 'Activity history for contract ' + contractId
            : 'Complete platform audit trail'
          }
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-slate-400 dark:text-slate-600" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg mb-1">
            No audit logs yet
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            Activity will be recorded here as actions are taken.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {logs.length + ' events recorded'}
            </p>
          </div>
          <div className="p-6">
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-white/10" />
              <div className="space-y-6">
                {logs.map((log, index) => {
                  const config = actionConfig[log.action] || {
                    label: log.action,
                    icon: AlertTriangle,
                    color: 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                  };
                  const Icon = config.icon;
                  return (
                    <div key={log.id || index} className="flex gap-4 relative">
                      <div className={['w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 z-10', config.color].join(' ')}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {config.label}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                            {dayjs(log.createdAt).format('DD MMM YYYY, hh:mm A')}
                          </p>
                        </div>
                        {log.contractTitle && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            {log.contractTitle}
                          </p>
                        )}
                        {log.userFullname && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {'By: ' + log.userFullname + ' (' + (log.userRole || '') + ')'}
                          </p>
                        )}
                        {log.ipAddress && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                            {'IP: ' + log.ipAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

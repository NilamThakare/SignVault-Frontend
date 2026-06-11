import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Loader2, ArrowRight,
  Vault, CheckCircle, Clock, ArrowUpRight,
  Inbox, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getVault } from '../api/vault';
import StatusBadge from '../components/StatusBadge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vaultContracts, setVaultContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVault();
        const data = res.data?.data || res.data;
        setVaultContracts(Array.isArray(data) ? data : []);
      } catch (err) {
        setVaultContracts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentContracts = [...vaultContracts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* Profile card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
        <div className="h-14 bg-slate-100 dark:bg-slate-800" />
        <div className="px-4 sm:px-5 pb-4">
          <div className="flex items-end justify-between -mt-6 mb-3">
            <div className="w-14 h-14 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold text-xl border-2 border-white dark:border-slate-900 flex-shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white">
            {user?.fullName || 'User'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {user?.email || ''}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {vaultContracts.length + ' signed contract' + (vaultContracts.length !== 1 ? 's' : '') + ' in vault'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left — main content */}
        <div className="lg:col-span-2 space-y-4">

          {/* Recent Contracts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-white/[0.06]">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Recent Contracts
              </h2>
              <button
                onClick={() => navigate('/vault')}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                See all
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : recentContracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                  No contracts yet
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                  Create and sign your first contract.
                </p>
                <button
                  onClick={() => navigate('/contracts/create')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Create a contract
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                {recentContracts.map((contract, index) => (
                  <div
                    key={contract.id || index}
                    onClick={() => navigate('/contracts/' + contract.contractId)}
                    className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer transition group"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {contract.title}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {contract.senderName + ' · ' + dayjs(contract.createdAt).fromNow()}
                      </p>
                    </div>
                    <StatusBadge status={contract.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right sidebar */}
        <div className="space-y-4">

          {/* Vault summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-white/[0.06]">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Vault Summary
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              <div className="flex items-center justify-between px-4 sm:px-5 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Fully Signed</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {vaultContracts.length}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 sm:px-5 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Pending</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">—</span>
              </div>
              <div className="flex items-center justify-between px-4 sm:px-5 py-3">
                <div className="flex items-center gap-2">
                  <Vault className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Total</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {vaultContracts.length}
                </span>
              </div>
            </div>
            <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-white/[0.06]">
              <button
                onClick={() => navigate('/vault')}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Open Vault
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Mailbox */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-white/[0.06]">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Mailbox
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              <button
                onClick={() => navigate('/mailbox/inbox')}
                className="flex items-center justify-between w-full px-4 sm:px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    Inbox
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition" />
              </button>
              <button
                onClick={() => navigate('/mailbox/outbox')}
                className="flex items-center justify-between w-full px-4 sm:px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    Outbox
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

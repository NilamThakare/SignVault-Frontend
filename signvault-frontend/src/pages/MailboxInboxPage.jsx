import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, Loader2, Mail, MailOpen, ArrowRight } from 'lucide-react';
import { getVault } from '../api/vault';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function MailboxInboxPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      setLoading(true);
      try {
        const res = await getVault();
        const data = res.data?.data || res.data;
        const all = Array.isArray(data) ? data : [];
        const received = all.filter(c => c.receiverName === user?.fullName);
        setContracts(received);
      } catch (err) {
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inbox</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Contracts received and signed by you.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-1">
          <button className="flex-1 py-2 px-4 text-sm font-semibold rounded-lg bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm">
            Inbox
          </button>
          <button
            onClick={() => navigate('/mailbox/outbox')}
            className="flex-1 py-2 px-4 text-sm font-semibold rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            Outbox
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-600" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg mb-1">
            Inbox is empty
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            Fully signed contracts you received will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-white/5">
          {contracts.map((contract, index) => (
            <div
              key={contract.id || index}
              onClick={() => navigate('/contracts/' + contract.contractId)}
              className="flex items-center justify-between px-6 py-4 cursor-pointer transition group hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <MailOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {contract.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {'From: ' + (contract.senderName || 'Unknown') + ' · ' + dayjs(contract.createdAt).fromNow()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <StatusBadge status={contract.status} />
                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

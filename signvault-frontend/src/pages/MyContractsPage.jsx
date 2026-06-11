import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Loader2, Plus, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { getVault } from '../api/vault';
import StatusBadge from '../components/StatusBadge';
import dayjs from 'dayjs';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'SENDER_SIGNED', 'FULLY_SIGNED', 'EXPIRED', 'RENEWED', 'CANCELLED', 'REJECTED'];

export default function MyContractsPage() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await getVault();
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) {
          setContracts(data);
        } else if (data && Array.isArray(data.content)) {
          setContracts(data.content);
        } else {
          setContracts([]);
        }
      } catch (err) {
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = contracts.filter(c => {
    const matchSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.senderName?.toLowerCase().includes(search.toLowerCase()) ||
      c.receiverName?.toLowerCase().includes(search.toLowerCase()) ||
      c.contractId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Contracts</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            All your signed contracts from the vault.
          </p>
        </div>
        <button
          onClick={() => navigate('/contracts/create')}
          className="flex items-center gap-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Contract</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, name or contract ID..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-6 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm appearance-none"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s} className="bg-white dark:bg-slate-800">
                {s === 'ALL' ? 'All Status' : s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-slate-400 dark:text-slate-600" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg mb-1">
            No contracts found
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm mb-6">
            {search || statusFilter !== 'ALL'
              ? 'Try adjusting your search or filter.'
              : 'Your fully signed contracts will appear here.'
            }
          </p>
          {!search && statusFilter === 'ALL' && (
            <button
              onClick={() => navigate('/contracts/create')}
              className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              Create your first contract
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((contract, index) => (
            <div
              key={contract.id || index}
              onClick={() => navigate('/contracts/' + contract.contractId)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md dark:hover:shadow-none group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {contract.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {contract.senderName + ' → ' + contract.receiverName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={contract.status} />
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition hidden sm:block" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400 dark:text-slate-500">
                <span>{'Created: ' + dayjs(contract.createdAt).format('DD MMM YYYY')}</span>
                {contract.periodTo && !contract.permanent && (
                  <span>{'Expires: ' + dayjs(contract.periodTo).format('DD MMM YYYY')}</span>
                )}
                {contract.permanent && <span>Permanent</span>}
                <span className="font-mono">{contract.contractId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

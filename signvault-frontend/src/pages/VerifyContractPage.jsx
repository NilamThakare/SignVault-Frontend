import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Search, CheckCircle, XCircle,
  Loader2, Moon, Sun, FileText, Calendar
} from 'lucide-react';
import { verifyContract } from '../api/contracts';
import StatusBadge from '../components/StatusBadge';
import useThemeStore from '../store/themeStore';
import dayjs from 'dayjs';

export default function VerifyContractPage() {
  const { contractId: paramId } = useParams();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const [contractId, setContractId] = useState(paramId || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    if (!contractId.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await verifyContract(contractId.trim());
      const data = res.data?.data || res.data;
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Contract not found or invalid ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">

      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <ShieldCheck className="text-blue-600 dark:text-blue-400 w-6 h-6" />
          <span className="font-bold text-slate-900 dark:text-white text-lg">SignVault</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition text-slate-500"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-semibold border border-slate-300 dark:border-white/20 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition text-slate-700 dark:text-white"
          >
            Login
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl space-y-6">

          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Verify Contract
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enter a contract ID to verify its authenticity. Format: SV-2026-XXXXXX
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Contract ID
              </label>
              <input
                value={contractId}
                onChange={e => setContractId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                placeholder="e.g. SV-2026-XXXXXX"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={loading || !contractId.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Verifying...</span></>
                : <><Search className="w-4 h-4" /><span>Verify Contract</span></>
              }
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl px-5 py-4">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">

              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-white/10 bg-green-50 dark:bg-green-500/10">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-green-700 dark:text-green-400">
                    Contract Verified
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                    This contract exists in the SignVault system.
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white">{result.title}</h3>
                  <StatusBadge status={result.status} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400 w-24 flex-shrink-0">Contract ID</span>
                    <span className="font-medium text-slate-900 dark:text-white font-mono truncate">
                      {result.contractId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400 w-24 flex-shrink-0">Created</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {dayjs(result.createdAt).format('DD MMM YYYY')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

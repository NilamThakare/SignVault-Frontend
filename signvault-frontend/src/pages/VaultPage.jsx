import { useEffect, useState } from 'react';
import { FileText, Download, Loader2, Search, Lock } from 'lucide-react';
import { getVault, downloadContract } from '../api/vault';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export default function VaultPage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const fetchVault = async () => {
      setLoading(true);
      try {
        const res = await getVault();
        const data = res.data;
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
    fetchVault();
  }, []);

  const handleDownload = async (contractId, title) => {
    setDownloading(contractId);
    try {
      const res = await downloadContract(contractId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', title + '.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Contract downloaded!');
    } catch (err) {
      toast.error('Download failed. Try again.');
    } finally {
      setDownloading(null);
    }
  };

  const filtered = contracts.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.sender?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.receiver?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Vault</h1>
            <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200 dark:border-green-500/20">
              {contracts.length + ' contracts'}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            All your fully signed contracts. Immutable and permanent.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-2 rounded-xl">
          <Lock className="w-4 h-4" />
          <span>Read Only</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search contracts..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
        />
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
            {search ? 'No contracts found' : 'Vault is empty'}
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            {search
              ? 'Try adjusting your search.'
              : 'Fully signed contracts will appear here automatically.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((contract, index) => (
            <div
              key={contract.id || index}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md dark:hover:shadow-none transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {contract.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono truncate">
                    {contract.contractId || contract.id}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-slate-500">Sender</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {contract.sender?.fullName || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-slate-500">Receiver</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {contract.receiver?.fullName || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-slate-500">Signed On</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {contract.signedAt
                      ? dayjs(contract.signedAt).format('DD MMM YYYY')
                      : contract.updatedAt
                        ? dayjs(contract.updatedAt).format('DD MMM YYYY')
                        : 'N/A'
                    }
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(contract.id, contract.title)}
                disabled={downloading === contract.id}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-semibold transition shadow-sm shadow-green-500/20"
              >
                {downloading === contract.id
                  ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Downloading...</span></>
                  : <><Download className="w-4 h-4" /><span>Download PDF</span></>
                }
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
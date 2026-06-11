import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContract, cancelContract, rejectContract } from '../api/contracts';
import { signContract } from '../api/signatures';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import {
  FileText, CheckCircle, Clock, Fingerprint,
  AlertTriangle, ClipboardList, XCircle,
  Loader2, ArrowLeft, Shield, Ban, ThumbsDown
} from 'lucide-react';

export default function ContractDetailPage() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    fetchContract();
  }, [contractId]);

  const fetchContract = async () => {
    setLoading(true);
    try {
      const res = await getContract(contractId);
      const data = res.data?.data || res.data;
      setContract(data);
    } catch (err) {
      toast.error('Failed to load contract.');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    setSigning(true);
    try {
      const biometric = await simulateFingerprintScan();
      await signContract(contractId, biometric);
      toast.success('Contract signed successfully!');
      fetchContract();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signing failed.');
    } finally {
      setSigning(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this contract?')) return;
    setCancelling(true);
    try {
      await cancelContract(contractId);
      toast.success('Contract cancelled.');
      fetchContract();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this contract?')) return;
    setRejecting(true);
    try {
      await rejectContract(contractId);
      toast.success('Contract rejected.');
      fetchContract();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed.');
    } finally {
      setRejecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">Contract not found</p>
        <button
          onClick={() => navigate('/contracts')}
          className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          Back to contracts
        </button>
      </div>
    );
  }

  const isSender = contract.senderName === user?.fullName;
  const isReceiver = contract.receiverName === user?.fullName;

  const daysUntilExpiry = contract.expiresAt
    ? dayjs(contract.expiresAt).diff(dayjs(), 'day')
    : null;

  const canSign = isReceiver && contract.status === 'SENDER_SIGNED';
  const canCancel = isSender && contract.status === 'PENDING';
  const canReject = isReceiver &&
    (contract.status === 'PENDING' || contract.status === 'SENDER_SIGNED');

  const isTerminal = ['CANCELLED', 'REJECTED', 'FULLY_SIGNED', 'EXPIRED'].includes(contract.status);

  let expiryClass = 'mt-4 flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ';
  if (daysUntilExpiry !== null && daysUntilExpiry <= 2) {
    expiryClass += 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400';
  } else {
    expiryClass += 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-600 dark:text-yellow-400';
  }

  let senderSignedClass = 'flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border ';
  if (contract.status === 'SENDER_SIGNED' || contract.status === 'FULLY_SIGNED') {
    senderSignedClass += 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20';
  } else {
    senderSignedClass += 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10';
  }

  let receiverSignedClass = 'flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border ';
  if (contract.status === 'FULLY_SIGNED') {
    receiverSignedClass += 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20';
  } else {
    receiverSignedClass += 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10';
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                {contract.title}
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                {contract.contractId}
              </p>
            </div>
          </div>
          <StatusBadge status={contract.status} />
        </div>

        {daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry >= 0 && (
          <div className={expiryClass}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              {daysUntilExpiry === 0
                ? 'Expires today!'
                : 'Expires in ' + daysUntilExpiry + (daysUntilExpiry > 1 ? ' days' : ' day')
              }
            </span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10">
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm">
            Contract Information
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          <div className="flex justify-between items-center px-6 py-3.5 gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">Created</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {dayjs(contract.createdAt).format('DD MMM YYYY, hh:mm A')}
            </span>
          </div>
          <div className="flex justify-between items-center px-6 py-3.5 gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">Start Date</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {contract.periodFrom ? dayjs(contract.periodFrom).format('DD MMM YYYY') : 'Not set'}
            </span>
          </div>
          <div className="flex justify-between items-center px-6 py-3.5 gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">Expiry Date</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {contract.permanent ? 'Permanent' : contract.periodTo ? dayjs(contract.periodTo).format('DD MMM YYYY') : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center px-6 py-3.5 gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">Period</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {contract.permanent
                ? 'Permanent'
                : (contract.periodValue || '') + ' ' + (contract.periodType ? contract.periodType.toLowerCase() : '')
              }
            </span>
          </div>
          {contract.renewal && contract.parentContractId && (
            <div className="flex justify-between items-center px-6 py-3.5 gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Renewed From</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white font-mono">
                {contract.parentContractId}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-4">
            Sender
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
              {contract.senderName?.charAt(0) || 'S'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {contract.senderName || 'Unknown'}
              </p>
            </div>
          </div>
          <div className={senderSignedClass}>
            {contract.status === 'SENDER_SIGNED' || contract.status === 'FULLY_SIGNED'
              ? <><CheckCircle className="w-3.5 h-3.5" /><span>Signed</span></>
              : <><Clock className="w-3.5 h-3.5" /><span>Pending</span></>
            }
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-4">
            Receiver
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600 dark:bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {contract.receiverName?.charAt(0) || 'R'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {contract.receiverName || 'Unknown'}
              </p>
            </div>
          </div>
          <div className={receiverSignedClass}>
            {contract.status === 'FULLY_SIGNED'
              ? <><CheckCircle className="w-3.5 h-3.5" /><span>Signed</span></>
              : <><Clock className="w-3.5 h-3.5" /><span>Pending</span></>
            }
          </div>
        </div>
      </div>

      {!isTerminal && (
        <div className="flex flex-col sm:flex-row gap-3">

          {canSign && (
            <button
              onClick={handleSign}
              disabled={signing}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold text-sm transition shadow-lg shadow-green-500/20"
            >
              {signing
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing...</span></>
                : <><Fingerprint className="w-4 h-4" /><span>Sign Contract</span></>
              }
            </button>
          )}

          {canReject && (
            <button
              onClick={handleReject}
              disabled={rejecting}
              className="flex items-center justify-center gap-2 px-5 py-3 border border-orange-200 dark:border-orange-500/20 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl text-sm font-medium transition disabled:opacity-50"
            >
              {rejecting
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Rejecting...</span></>
                : <><ThumbsDown className="w-4 h-4" /><span>Reject</span></>
              }
            </button>
          )}

          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex items-center justify-center gap-2 px-5 py-3 border border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium transition disabled:opacity-50"
            >
              {cancelling
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Cancelling...</span></>
                : <><Ban className="w-4 h-4" /><span>Cancel</span></>
              }
            </button>
          )}

          <button
            onClick={() => navigate('/contracts/' + contractId + '/audit')}
            className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Audit Log</span>
          </button>

        </div>
      )}

      {isTerminal && (
        <button
          onClick={() => navigate('/contracts/' + contractId + '/audit')}
          className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition w-full sm:w-auto"
        >
          <ClipboardList className="w-4 h-4" />
          <span>View Audit Log</span>
        </button>
      )}

      {contract.status === 'FULLY_SIGNED' && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl px-5 py-4">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
            This contract is fully signed and saved to both parties vaults permanently.
          </p>
        </div>
      )}

      {contract.status === 'CANCELLED' && (
        <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl px-5 py-4">
          <Ban className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
          <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">
            This contract has been cancelled.
          </p>
        </div>
      )}

      {contract.status === 'REJECTED' && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl px-5 py-4">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            This contract was rejected by the receiver.
          </p>
        </div>
      )}

    </div>
  );
}

async function simulateFingerprintScan() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('BIO_' + Math.random().toString(36).substring(2, 18).toUpperCase());
    }, 2000);
  });
}

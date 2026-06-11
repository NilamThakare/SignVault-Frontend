import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, Loader2, Search, UserX,
  ArrowUpCircle, ArrowDownCircle, Flag, FlagOff, Ban, FileText
} from 'lucide-react';
import {
  getUsers, promoteUser, demoteUser, deactivateUser,
  getFlaggedContracts, unflagContract, adminCancelContract
} from '../api/admin';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function SuperAdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [flaggedContracts, setFlaggedContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersRes, flaggedRes] = await Promise.all([
        getUsers(),
        getFlaggedContracts(),
      ]);
      const usersData = usersRes.data?.data || usersRes.data;
      const flaggedData = flaggedRes.data?.data || flaggedRes.data;
      setUsers(Array.isArray(usersData) ? usersData : []);
      setFlaggedContracts(Array.isArray(flaggedData) ? flaggedData : []);
    } catch (err) {
      setUsers([]);
      setFlaggedContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userId, userName) => {
    setActionLoading(userId + '_promote');
    try {
      await promoteUser(userId);
      toast.success(userName + ' promoted to Admin!');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Promotion failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemote = async (userId, userName) => {
    setActionLoading(userId + '_demote');
    try {
      await demoteUser(userId);
      toast.success(userName + ' demoted to User!');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Demotion failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (userId, userName) => {
    if (!window.confirm('Are you sure you want to deactivate ' + userName + '?')) return;
    setActionLoading(userId + '_deactivate');
    try {
      await deactivateUser(userId);
      toast.success(userName + ' has been deactivated.');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deactivation failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnflag = async (contractId) => {
    setActionLoading(contractId + '_unflag');
    try {
      await unflagContract(contractId);
      toast.success('Contract unflagged — cleared as legitimate.');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unflag failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAdminCancel = async (contractId) => {
    if (!window.confirm('Cancel this contract? This cannot be undone.')) return;
    setActionLoading(contractId + '_cancel');
    try {
      await adminCancelContract(contractId);
      toast.success('Contract cancelled by SuperAdmin.');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleClass = (role) => {
    if (role === 'ROLE_SUPERADMIN') return 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20';
    if (role === 'ROLE_ADMIN') return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
    return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
  };

  const getRoleLabel = (role) => {
    if (role === 'ROLE_SUPERADMIN') return 'Super Admin';
    if (role === 'ROLE_ADMIN') return 'Admin';
    return 'User';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-600/20 dark:to-red-700/20 dark:border dark:border-red-500/20 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7" />
          <h1 className="text-2xl font-bold">Super Admin Panel</h1>
        </div>
        <p className="text-red-100 dark:text-slate-400 text-sm">
          Full platform control. Promote/demote admins, deactivate accounts, unflag or cancel any contract.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{users.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admins</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {users.filter(u => u.role === 'ROLE_ADMIN' || u.role === 'ROLE_SUPERADMIN').length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inactive</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
              <UserX className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {users.filter(u => u.active === false).length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Flagged</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
              <Flag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{flaggedContracts.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex bg-slate-100 dark:bg-white/5 rounded-xl p-1">
            <button
              onClick={() => { setActiveTab('users'); setSearch(''); }}
              className={[
                'px-4 py-2 text-sm font-semibold rounded-lg transition',
                activeTab === 'users'
                  ? 'bg-white dark:bg-red-600 text-red-600 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ].join(' ')}
            >
              {'Users (' + users.length + ')'}
            </button>
            <button
              onClick={() => { setActiveTab('flagged'); setSearch(''); }}
              className={[
                'px-4 py-2 text-sm font-semibold rounded-lg transition',
                activeTab === 'flagged'
                  ? 'bg-white dark:bg-red-600 text-red-600 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ].join(' ')}
            >
              {'Flagged (' + flaggedContracts.length + ')'}
            </button>
          </div>
          <div className="relative sm:ml-auto">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full sm:w-64 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : activeTab === 'users' ? (
          filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredUsers.map((u, index) => (
                <div key={u.id || index} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {u.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{u.fullName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={['text-xs font-semibold px-2.5 py-1 rounded-full border', getRoleClass(u.role)].join(' ')}>
                      {getRoleLabel(u.role)}
                    </span>
                    <span className={[
                      'text-xs font-semibold px-2.5 py-1 rounded-full border',
                      u.active !== false
                        ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                        : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                    ].join(' ')}>
                      {u.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {u.role === 'ROLE_USER' && (
                      <button
                        onClick={() => handlePromote(u.id, u.fullName)}
                        disabled={actionLoading === u.id + '_promote'}
                        className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                      >
                        {actionLoading === u.id + '_promote'
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <ArrowUpCircle className="w-3 h-3" />
                        }
                        <span>Promote</span>
                      </button>
                    )}

                    {u.role === 'ROLE_ADMIN' && (
                      <button
                        onClick={() => handleDemote(u.id, u.fullName)}
                        disabled={actionLoading === u.id + '_demote'}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                      >
                        {actionLoading === u.id + '_demote'
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <ArrowDownCircle className="w-3 h-3" />
                        }
                        <span>Demote</span>
                      </button>
                    )}

                    {u.role !== 'ROLE_SUPERADMIN' && u.active !== false && (
                      <button
                        onClick={() => handleDeactivate(u.id, u.fullName)}
                        disabled={actionLoading === u.id + '_deactivate'}
                        className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                      >
                        {actionLoading === u.id + '_deactivate'
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <UserX className="w-3 h-3" />
                        }
                        <span>Deactivate</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          flaggedContracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Flag className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No flagged contracts</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">All contracts are clean</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {flaggedContracts.map((c, index) => (
                <div key={c.id || index} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition">
                  <div
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate('/contracts/' + c.contractId)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{c.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{c.contractId}</p>
                    </div>
                  </div>

                  <StatusBadge status={c.status} />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUnflag(c.contractId)}
                      disabled={actionLoading === c.contractId + '_unflag'}
                      className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                    >
                      {actionLoading === c.contractId + '_unflag'
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <FlagOff className="w-3 h-3" />
                      }
                      <span>Unflag</span>
                    </button>

                    <button
                      onClick={() => handleAdminCancel(c.contractId)}
                      disabled={actionLoading === c.contractId + '_cancel'}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                    >
                      {actionLoading === c.contractId + '_cancel'
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <Ban className="w-3 h-3" />
                      }
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

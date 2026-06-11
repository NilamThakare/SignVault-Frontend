import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Shield, Loader2, CheckCircle, Camera } from 'lucide-react';
import { getProfile, updateProfile } from '../api/user';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number').optional().or(z.literal('')),
  age: z.string().optional(),
});

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getProfile();
        const data = res.data?.data || res.data;
        setProfileData(data);
        reset({
          fullName: data.fullName || '',
          phone: data.phone || '',
          age: data.age ? String(data.age) : '',
        });
      } catch (err) {
        if (user) {
          reset({
            fullName: user.fullName || '',
            phone: user.phone || '',
            age: '',
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await updateProfile({
        fullName: data.fullName,
        phone: data.phone || undefined,
        age: data.age ? parseInt(data.age) : undefined,
      });
      const updated = res.data?.data || res.data;
      setProfileData(updated);
      setUser(prev => ({ ...prev, fullName: updated.fullName }));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const displayData = profileData || user;
  const initial = displayData?.fullName?.charAt(0)?.toUpperCase() || 'U';

  let roleBadgeClass = 'text-xs font-bold px-3 py-1 rounded-full border ';
  if (displayData?.role === 'ROLE_SUPERADMIN') {
    roleBadgeClass += 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20';
  } else if (displayData?.role === 'ROLE_ADMIN') {
    roleBadgeClass += 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
  } else {
    roleBadgeClass += 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
  }

  let roleLabel = 'User';
  if (displayData?.role === 'ROLE_SUPERADMIN') roleLabel = 'Super Admin';
  else if (displayData?.role === 'ROLE_ADMIN') roleLabel = 'Admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {initial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {displayData?.fullName || 'User'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              {displayData?.email || ''}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
              <span className={roleBadgeClass}>{roleLabel}</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10">
                {displayData?.authProvider || 'LOCAL'}
              </span>
              {displayData?.active !== false && (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white mb-5">Personal Information</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Full Name
              </span>
            </label>
            <input
              {...register('fullName')}
              placeholder="John Doe"
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                Email Address
                <span className="text-xs text-slate-400 font-normal">(cannot be changed)</span>
              </span>
            </label>
            <input
              value={displayData?.email || ''}
              disabled
              className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-400 dark:text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                Phone Number
              </span>
            </label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="+91 9876543210"
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Age <span className="text-slate-400 font-normal">(optional, min 18)</span>
            </label>
            <input
              {...register('age')}
              type="number"
              min="18"
              placeholder="25"
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl px-8 py-3 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20"
            >
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></>
                : <><CheckCircle className="w-4 h-4" /><span>Save Changes</span></>
              }
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Account Security</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Email Verified</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your email is verified</p>
              </div>
            </div>
            {displayData?.emailVerified
              ? <CheckCircle className="w-5 h-5 text-green-500" />
              : <span className="text-xs text-red-500 font-medium">Not verified</span>
            }
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Phone Verified</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your phone number is verified</p>
              </div>
            </div>
            {displayData?.phoneVerified
              ? <CheckCircle className="w-5 h-5 text-green-500" />
              : <span className="text-xs text-red-500 font-medium">Not verified</span>
            }
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Profile Complete</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">All required information filled</p>
              </div>
            </div>
            {displayData?.profileComplete
              ? <CheckCircle className="w-5 h-5 text-green-500" />
              : <span className="text-xs text-yellow-500 font-medium">Incomplete</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

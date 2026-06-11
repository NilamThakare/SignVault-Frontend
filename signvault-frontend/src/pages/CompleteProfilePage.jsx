import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, Loader2, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateProfile } from '../api/user';
import { useAuth } from '../context/AuthContext';
import useThemeStore from '../store/themeStore';

const schema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  phoneNumber: z.string().min(10, 'Valid phone number required'),
  age: z.string().optional(),
});

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useThemeStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: user?.fullName || '' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile({
        fullName: data.fullName,
        phone: data.phoneNumber || data.phone,
        age: data.age ? parseInt(data.age) : undefined,
      });
      toast.success('Profile saved!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-600 dark:text-blue-400 w-5 h-5" />
          <span className="font-bold text-slate-900 dark:text-white">SignVault</span>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition text-slate-500">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Google badge */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            <span className="text-sm text-slate-500 dark:text-slate-400">Signed in with Google</span>
          </div>

          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Complete your Profile
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
              A few more details needed before you can start using SignVault.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
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
                  Phone Number
                </label>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Age <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  {...register('age')}
                  type="number"
                  placeholder="25"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20 mt-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Saving...' : 'Save and Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
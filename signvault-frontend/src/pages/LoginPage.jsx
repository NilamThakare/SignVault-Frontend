import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, Eye, EyeOff, Loader2, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { login as loginUser } from '../api/auth';
import useThemeStore from '../store/themeStore';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginUser(data);
      const responseData = res.data?.data || res.data;
      login({
        fullName: responseData.fullName,
        email: responseData.email,
        role: responseData.role,
        profileComplete: responseData.profileComplete,
      }, responseData.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_API_BASE_URL + '/oauth2/authorization/google';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">

      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 dark:bg-slate-900 border-r border-blue-700 dark:border-white/10 flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-white w-8 h-8" />
          <span className="text-white text-2xl font-bold">SignVault</span>
        </div>
        <div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-6">
            Welcome back to your secure contract vault.
          </h2>
          <div className="space-y-4">
            {[
              'View all your signed contracts',
              'Send and receive contracts',
              'Download from your vault anytime',
              'Track contract status in real-time',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <p className="text-blue-100 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-200 text-sm">2025 SignVault. All rights reserved.</p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">

        <div className="flex items-center justify-between mb-10 lg:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600 dark:text-blue-400 w-6 h-6" />
            <span className="font-bold text-lg text-slate-900 dark:text-white">SignVault</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="hidden lg:flex justify-end mb-6">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition text-slate-500">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Login to access your contracts and vault.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className="w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  className="w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white transition">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/25"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            <span className="text-slate-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-white rounded-xl py-3 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-white/10 transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 text-center transition-colors duration-300">

      <div className="flex items-center gap-2 mb-12">
        <ShieldCheck className="text-blue-600 dark:text-blue-400 w-7 h-7" />
        <span className="text-xl font-bold text-slate-900 dark:text-white">SignVault</span>
      </div>

      <div className="relative mb-8">
        <p className="text-8xl sm:text-9xl font-black text-slate-200 dark:text-white/5 select-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
        Page Not Found
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md mb-10">
        The page you are looking for does not exist or has been moved. Let us take you back to safety.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 dark:border-white/20 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-500/20"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}

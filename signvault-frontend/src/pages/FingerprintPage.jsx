import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Fingerprint, CheckCircle, XCircle, Loader2, Moon, Sun, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import useThemeStore from '../store/themeStore';

export default function FingerprintPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const [status, setStatus] = useState('idle');

  const handleScan = async () => {
    setStatus('scanning');
    try {
      const biometricString = await simulateFingerprintScan();
      // TODO: call real fingerprint API when available
      setStatus('success');
      toast.success('Fingerprint registered!');
    } catch (err) {
      setStatus('failed');
      toast.error('Registration failed. Try again.');
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">

      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => navigate('/verify/phone')}
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

          {/* Progress */}
          <div className="flex items-center gap-2 mb-10">
            {['Email', 'Phone', 'Fingerprint'].map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-1.5 ${i === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2
                    ${i === 2 ? 'border-blue-500 bg-blue-500 text-white' : 'border-green-500 bg-green-500 text-white'}`}>
                    {i < 2 ? '✓' : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s}</span>
                </div>
                {i < 2 && <div className="flex-1 h-px bg-green-500" />}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm text-center">

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Register Fingerprint
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-10">
              Your fingerprint is used to sign contracts securely. This is a one-time setup.
            </p>

            {/* Scanner */}
            <div className="flex justify-center mb-8">
              <div className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-500
                ${status === 'idle' ? 'border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5' : ''}
                ${status === 'scanning' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 animate-pulse' : ''}
                ${status === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-500/10' : ''}
                ${status === 'failed' ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : ''}
              `}>
                {status === 'idle' && <Fingerprint className="w-20 h-20 text-slate-400 dark:text-slate-600" />}
                {status === 'scanning' && (
                  <>
                    <Fingerprint className="w-20 h-20 text-blue-600 dark:text-blue-400" />
                    <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin absolute bottom-6" />
                  </>
                )}
                {status === 'success' && <CheckCircle className="w-20 h-20 text-green-600 dark:text-green-400" />}
                {status === 'failed' && <XCircle className="w-20 h-20 text-red-600 dark:text-red-400" />}
              </div>
            </div>

            {/* Status text */}
            <div className="mb-8 min-h-[40px]">
              {status === 'idle' && (
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Tap the button below to scan your fingerprint.
                </p>
              )}
              {status === 'scanning' && (
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium animate-pulse">
                  Scanning... please hold still.
                </p>
              )}
              {status === 'success' && (
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                  Fingerprint registered successfully!
                </p>
              )}
              {status === 'failed' && (
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                  Scan failed. Please try again.
                </p>
              )}
            </div>

            {status === 'idle' && (
              <button
                onClick={handleScan}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20"
              >
                <Fingerprint className="w-5 h-5" /> Scan Fingerprint
              </button>
            )}
            {status === 'scanning' && (
              <button disabled className="w-full bg-blue-400 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                <Loader2 className="w-5 h-5 animate-spin" /> Scanning...
              </button>
            )}
            {status === 'success' && (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-green-500/20"
              >
                <CheckCircle className="w-5 h-5" /> Continue to Dashboard
              </button>
            )}
            {status === 'failed' && (
              <button
                onClick={() => setStatus('idle')}
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                <Fingerprint className="w-5 h-5" /> Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

async function simulateFingerprintScan() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('BIO_' + Math.random().toString(36).substring(2, 18).toUpperCase());
    }, 2500);
  });
}
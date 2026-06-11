import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone, Loader2, Moon, Sun, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendPhoneOtp, verifyPhoneOtp } from '../api/auth';
import useThemeStore from '../store/themeStore';

export default function PhoneOtpPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const rawPhone = sessionStorage.getItem('verify_phone') || '';
  const maskedPhone = rawPhone
    ? '*'.repeat(Math.max(0, rawPhone.length - 4)) + rawPhone.slice(-4)
    : 'your phone';

  useEffect(() => {
    if (rawPhone) {
      sendPhoneOtp(rawPhone).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) { toast.error('Please enter the complete 6-digit OTP'); return; }
    setLoading(true);
    try {
      await verifyPhoneOtp(rawPhone, otpString);
      toast.success('Phone verified successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await sendPhoneOtp(rawPhone);
      toast.success('OTP resent to your phone!');
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error('Failed to resend OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">

      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900">
        <button
          onClick={() => navigate('/verify/email')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
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

          <div className="flex items-center gap-2 mb-10">
            {['Email', 'Phone'].map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className={[
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2',
                    i === 0
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-blue-500 bg-blue-500 text-white'
                  ].join(' ')}>
                    {i === 0 ? '✓' : '2'}
                  </div>
                  <span className={[
                    'text-xs font-medium hidden sm:block',
                    i === 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                  ].join(' ')}>
                    {s}
                  </span>
                </div>
                {i < 1 && <div className="flex-1 h-px bg-green-400" />}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 flex items-center justify-center">
                <Phone className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
              Verify your Phone
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-1">
              We sent a 6-digit OTP to
            </p>
            <p className="text-green-600 dark:text-green-400 text-sm font-semibold text-center mb-8">
              {maskedPhone}
            </p>

            <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className={[
                    'w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none transition-all duration-200',
                    digit
                      ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                      : 'border-slate-300 dark:border-white/20',
                    'focus:border-green-500'
                  ].join(' ')}
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length < 6}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-green-500/20 mb-4"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Verifying...' : 'Verify Phone'}
            </button>

            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium flex items-center justify-center gap-2 mx-auto"
                >
                  {resendLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                  Resend OTP
                </button>
              ) : (
                <p className="text-slate-400 dark:text-slate-500 text-sm">
                  Resend OTP in <span className="text-green-600 dark:text-green-400 font-semibold">{countdown}s</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

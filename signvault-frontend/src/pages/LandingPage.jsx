import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Fingerprint, Lock, ArrowRight, CheckCircle, Moon, Sun } from 'lucide-react';
import useThemeStore from '../store/themeStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-white/10 px-6 md:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-600 dark:text-blue-400 w-7 h-7" />
          <span className="text-xl font-bold tracking-tight">SignVault</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium border border-slate-300 dark:border-white/20 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24 md:py-36">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-8">
          <ShieldCheck className="w-4 h-4" />
          Legally Binding Digital Contracts
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl mb-6 tracking-tight">
          Sign Contracts{' '}
          <span className="text-blue-600 dark:text-blue-400">Securely.</span>
          <br />Anywhere.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          SignVault lets two parties sign legally binding contracts virtually — with biometric verification, OTP security, and tamper-proof vault storage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 rounded-2xl font-semibold text-base transition shadow-lg shadow-blue-500/25"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 px-8 py-4 border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl font-semibold text-base transition"
          >
            Login to Account
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 pt-16 border-t border-slate-200 dark:border-white/10 w-full max-w-2xl">
          {[
            { value: '100%', label: 'Secure & Encrypted' },
            { value: '2-Party', label: 'Verified Signing' },
            { value: 'Instant', label: 'Contract Delivery' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{s.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-16 py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why SignVault?</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Everything you need to sign contracts digitally with complete security and legal validity.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Fingerprint className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                bg: 'bg-blue-50 dark:bg-blue-500/10',
                title: 'Biometric Signing',
                desc: 'Sign contracts using your unique fingerprint. No forgery possible.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />,
                bg: 'bg-green-50 dark:bg-green-500/10',
                title: 'OTP Verification',
                desc: 'Every action verified via email and phone OTP for maximum security.',
              },
              {
                icon: <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
                bg: 'bg-purple-50 dark:bg-purple-500/10',
                title: 'Tamper-Proof Vault',
                desc: 'Signed contracts are immutable. Stored permanently in your vault.',
              },
              {
                icon: <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
                bg: 'bg-orange-50 dark:bg-orange-500/10',
                title: 'PDF Contracts',
                desc: 'Upload any PDF contract and send it to the other party digitally.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-500 dark:text-slate-400">Three simple steps to sign your contract.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
                title: 'Upload & Send',
                desc: 'Upload your PDF contract, fill in the details, and send it to the receiver\'s registered email.',
              },
              {
                step: '02',
                color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30',
                title: 'Verify & Sign',
                desc: 'Both parties verify their identity via OTP and sign the contract with their fingerprint.',
              },
              {
                step: '03',
                color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
                title: 'Stored Forever',
                desc: 'The fully signed contract is saved permanently to both parties\' vaults for download anytime.',
              },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-bold text-xl mb-5 ${s.color}`}>
                  {s.step}
                </div>
                <h3 className="font-semibold text-xl mb-3">{s.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-blue-600 dark:bg-blue-600/20 dark:border-y dark:border-blue-500/20">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-14 h-14 text-white dark:text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-4">
            Ready to sign your first contract?
          </h2>
          <p className="text-blue-100 dark:text-slate-400 mb-8 text-lg">
            Join SignVault today. Free to register. Secure forever.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white dark:bg-blue-500 text-blue-600 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-600 rounded-2xl font-bold text-base transition shadow-xl"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 py-8 text-center text-slate-400 dark:text-slate-600 text-sm px-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="text-blue-600 dark:text-blue-400 w-5 h-5" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">SignVault</span>
        </div>
        © 2025 SignVault. All rights reserved. | Confidential — Internal Use Only
      </footer>
    </div>
  );
}
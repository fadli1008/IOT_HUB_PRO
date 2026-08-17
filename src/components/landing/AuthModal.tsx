import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Github,
  CheckCircle2,
  Sparkles,
  Loader2,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, verifyOtp, socialLogin, pendingEmail, pendingOtp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'oauth_google' | 'oauth_github'>(initialMode);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [customSocialEmail, setCustomSocialEmail] = useState('');
  const [customGithubUser, setCustomGithubUser] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email) throw new Error('Silakan masukkan alamat email.');
        if (!password) throw new Error('Silakan masukkan password akun Anda.');
        await login(email, password);
        onClose();
      } else if (mode === 'register') {
        if (!name || !email || !password) throw new Error('Semua kolom (Nama, Email, Password) wajib diisi.');
        if (password.length < 6) throw new Error('Password minimal harus 6 karakter.');
        const res = await register(name, email, password);
        if (res.requiresOtp) {
          setMode('otp');
        }
      } else if (mode === 'otp') {
        if (otpCode.length < 6) throw new Error('Silakan masukkan 6 digit kode OTP yang valid.');
        const success = await verifyOtp(otpCode);
        if (success) {
          onClose();
        } else {
          throw new Error('Kode OTP tidak valid.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Proses autentikasi gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthConfirm = async (provider: 'google' | 'github', selectedEmail: string) => {
    if (!selectedEmail) {
      setError('Silakan masukkan alamat email atau username Anda.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // Simulate authentic OAuth network handshake
      await new Promise(resolve => setTimeout(resolve, 800));
      await socialLogin(provider, selectedEmail);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Otorisasi OAuth gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mode Switcher Tabs (Sign In vs Sign Up) */}
        {mode !== 'otp' && mode !== 'oauth_google' && mode !== 'oauth_github' && (
          <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800 mb-6">
            <button
              onClick={() => {
                setError('');
                setMode('login');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                mode === 'login'
                  ? 'bg-brand-500 text-black shadow-md glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In (Masuk)
            </button>
            <button
              onClick={() => {
                setError('');
                setMode('register');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                mode === 'register'
                  ? 'bg-brand-500 text-black shadow-md glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up (Daftar Akun)
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 1: GOOGLE OAUTH LOGIN MODAL */}
        {/* ============================================================== */}
        {mode === 'oauth_google' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/10 mb-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold font-heading text-white">Login dengan Google</h2>
              <p className="text-xs text-slate-400 mt-1">Masukkan alamat akun Google Anda yang sudah terdaftar</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/15 border border-red-500/40 text-red-300 text-xs rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Email Google Anda</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="nama.anda@gmail.com"
                    value={customSocialEmail}
                    onChange={e => setCustomSocialEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <button
                disabled={isLoading}
                onClick={() => handleOAuthConfirm('google', customSocialEmail)}
                className="w-full py-3 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition flex items-center justify-center space-x-2 font-mono"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Akun Google...</span>
                  </>
                ) : (
                  <>
                    <span>Lanjutkan Masuk dengan Google</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setError('');
                  setMode('login');
                }}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                ← Batal & Kembali ke Form Login
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: GITHUB OAUTH LOGIN MODAL */}
        {/* ============================================================== */}
        {mode === 'oauth_github' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-800 mb-2 text-white">
                <Github className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold font-heading text-white">Login dengan GitHub</h2>
              <p className="text-xs text-slate-400 mt-1">Masukkan username atau email GitHub Anda yang sudah terdaftar</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/15 border border-red-500/40 text-red-300 text-xs rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Email atau Username GitHub</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. username@github.com"
                    value={customGithubUser}
                    onChange={e => setCustomGithubUser(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <button
                disabled={isLoading}
                onClick={() => {
                  const emailOrUser = customGithubUser.includes('@') ? customGithubUser : `${customGithubUser}@github.com`;
                  handleOAuthConfirm('github', emailOrUser);
                }}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg glow-green transition flex items-center justify-center space-x-2 font-mono"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Akun GitHub...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4" />
                    <span>Masuk dengan GitHub</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setError('');
                  setMode('login');
                }}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                ← Batal & Kembali ke Form Login
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: STANDARD LOGIN / REGISTER / OTP FORM */}
        {/* ============================================================== */}
        {mode !== 'oauth_google' && mode !== 'oauth_github' && (
          <>
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-500/10 text-brand-400 mb-3 glow-cyan">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'register' && 'Daftar Akun IoT Hub'}
                {mode === 'otp' && 'Verifikasi Email Anda'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'login' && 'Masuk dengan email dan password akun Anda yang sudah terdaftar'}
                {mode === 'register' && 'Gratis 5 perangkat IoT, visual dashboard lengkap, dan API Key instan'}
                {mode === 'otp' && `Kode OTP 6-digit dikirimkan untuk mengamankan akun ${pendingEmail || email || ''}`}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/15 border border-red-500/40 text-red-300 text-xs rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="text-[11px] text-slate-300 font-medium block mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-500 font-sans"
                    />
                  </div>
                </div>
              )}

              {mode !== 'otp' && (
                <>
                  <div>
                    <label className="text-[11px] text-slate-300 font-medium block mb-1">Alamat Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="nama@perusahaan.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-500 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] text-slate-300 font-medium">Password</label>
                      {mode === 'register' && (
                        <span className="text-[10px] text-slate-500 font-mono">Min. 6 Karakter</span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-500 font-sans"
                      />
                    </div>
                  </div>
                </>
              )}

              {mode === 'otp' && (
                <div className="space-y-4">
                  <div className="flex justify-center my-4">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      placeholder="123456"
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-48 text-center tracking-[0.5em] font-mono text-2xl font-bold bg-slate-950 border-2 border-brand-500 text-brand-400 rounded-2xl py-3 focus:outline-none shadow-lg glow-cyan"
                    />
                  </div>
                  <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-center">
                    <span className="text-[11px] text-brand-300 font-mono">
                      📩 Kode OTP Anda: <strong className="text-white bg-brand-500/20 px-2 py-0.5 rounded border border-brand-500/40 text-sm tracking-widest">{pendingOtp || '123456'}</strong>
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition flex items-center justify-center space-x-2 mt-2 font-mono"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In to Platform'}
                      {mode === 'register' && 'Lanjutkan & Verifikasi OTP'}
                      {mode === 'otp' && 'Verifikasi & Masuk ke Dashboard'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Logins */}
            {mode !== 'otp' && (
              <>
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
                  <span className="relative bg-slate-900 px-3 text-[11px] text-slate-500 font-mono">ATAU MASUK DENGAN</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setError('');
                      setMode('oauth_google');
                    }}
                    className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    onClick={() => {
                      setError('');
                      setMode('oauth_github');
                    }}
                    className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

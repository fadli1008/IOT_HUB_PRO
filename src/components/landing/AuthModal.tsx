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
  ChevronRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'register' }) => {
  const { login, register, verifyOtp, pendingEmail } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'oauth_google' | 'oauth_github'>(initialMode);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [customSocialEmail, setCustomSocialEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email) throw new Error('Please enter your email');
        await login(email, password);
        onClose();
      } else if (mode === 'register') {
        if (!name || !email) throw new Error('Please fill in all fields');
        const res = await register(name, email, password);
        if (res.requiresOtp) {
          setMode('otp');
        }
      } else if (mode === 'otp') {
        if (otpCode.length < 6) throw new Error('Please enter a valid 6-digit OTP');
        const success = await verifyOtp(otpCode);
        if (success) {
          onClose();
        } else {
          throw new Error('Invalid OTP code. Please enter 6 digits.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthConfirm = async (selectedEmail: string, selectedName: string) => {
    setIsLoading(true);
    setError('');
    try {
      // Simulate real OAuth network handshake
      await new Promise(resolve => setTimeout(resolve, 800));
      await login(selectedEmail, 'oauth_social_token');
      onClose();
    } catch (err: any) {
      setError(err.message || 'OAuth authorization failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ============================================================== */}
        {/* VIEW 1: GOOGLE OAUTH 2.0 CONSENT SCREEN */}
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
              <h2 className="text-xl font-bold font-heading text-white">Masuk dengan Google</h2>
              <p className="text-xs text-gray-400 mt-1">Pilih akun Google Anda untuk melanjutkan ke <strong>IoT Hub Pro</strong></p>
            </div>

            <div className="space-y-2.5">
              {/* Account 1: Muhamad Fadli */}
              <button
                disabled={isLoading}
                onClick={() => handleOAuthConfirm('muhamad.fadli@gmail.com', 'Muhamad Fadli')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-950/80 hover:bg-gray-800 border border-gray-800 transition text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-blue-600 flex items-center justify-center text-black font-bold text-sm">
                    MF
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-brand-400 transition">Muhamad Fadli</div>
                    <div className="text-[11px] text-gray-400 font-mono">muhamad.fadli@gmail.com</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
              </button>

              {/* Custom Google Email Input */}
              <div className="p-3.5 rounded-2xl bg-gray-950/50 border border-gray-800/80 space-y-2">
                <label className="text-[11px] text-gray-400 font-medium block">Gunakan Akun Google Lain:</label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="nama.anda@gmail.com"
                    value={customSocialEmail}
                    onChange={e => setCustomSocialEmail(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 font-mono"
                  />
                  <button
                    disabled={isLoading || !customSocialEmail}
                    onClick={() => handleOAuthConfirm(customSocialEmail, customSocialEmail.split('@')[0])}
                    className="px-3.5 py-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-black font-bold text-xs rounded-xl transition"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Pilih'}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/40 border border-gray-800 text-[11px] text-gray-500 space-y-1">
              <p>🔒 <strong>Izin Akses:</strong> IoT Hub Pro akan melihat nama, alamat email, dan setelan bahasa akun Google Anda.</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                onClick={() => setMode('login')}
                className="text-gray-400 hover:text-white transition"
              >
                ← Batal & Kembali
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: GITHUB OAUTH 2.0 AUTHORIZATION SCREEN */}
        {/* ============================================================== */}
        {mode === 'oauth_github' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gray-800 mb-2 text-white">
                <Github className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold font-heading text-white">Authorize IoT Hub Pro</h2>
              <p className="text-xs text-gray-400 mt-1">oleh <strong>Muhamad Fadli (@fadli1008)</strong></p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-3">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-800">
                <img
                  src="https://avatars.githubusercontent.com/u/fadli1008"
                  onError={(e) => {
                    (e.target as any).src = 'https://api.dicebear.com/7.x/identicon/svg?seed=fadli1008';
                  }}
                  alt="GitHub Profile"
                  className="w-10 h-10 rounded-full border border-gray-700 bg-gray-800"
                />
                <div>
                  <div className="text-xs font-bold text-white">Muhamad Fadli</div>
                  <div className="text-[11px] text-brand-400 font-mono">@fadli1008 (GitHub)</div>
                </div>
              </div>

              <div className="text-xs text-gray-300 space-y-2">
                <div className="text-[11px] text-gray-400 font-semibold uppercase">Izin yang Diminta (OAuth Scopes):</div>
                <ul className="space-y-1.5 text-[11px] text-gray-400 list-disc list-inside">
                  <li>Akses data profil publik pengguna</li>
                  <li>Verifikasi alamat email utama (<code>user:email</code>)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                disabled={isLoading}
                onClick={() => handleOAuthConfirm('fadli@github.com', 'Muhamad Fadli (@fadli1008)')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg glow-green transition flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghubungkan ke GitHub...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4" />
                    <span>Authorize & Masuk sebagai @fadli1008</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setMode('login')}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition text-center"
              >
                Batal
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
                {mode === 'register' && 'Create Your IoT Hub Account'}
                {mode === 'otp' && 'Verify Your Email'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {mode === 'login' && 'Sign in to access your devices and custom dashboards'}
                {mode === 'register' && 'Get 5 free devices, unlimited dashboards, and full API access'}
                {mode === 'otp' && `We sent a 6-digit verification code to ${pendingEmail || email || 'your email'}`}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="text-[11px] text-gray-400 font-medium block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhamad Fadli"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 text-gray-100 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-500 font-sans"
                    />
                  </div>
                </div>
              )}

              {mode !== 'otp' && (
                <>
                  <div>
                    <label className="text-[11px] text-gray-400 font-medium block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 text-gray-100 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-500 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] text-gray-400 font-medium">Password</label>
                      {mode === 'login' && (
                        <a href="#forgot" className="text-[11px] text-brand-400 hover:underline">
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 text-gray-100 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-500 font-sans"
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
                      className="w-48 text-center tracking-[0.5em] font-mono text-2xl font-bold bg-gray-950 border-2 border-brand-500 text-brand-400 rounded-2xl py-3 focus:outline-none shadow-lg glow-cyan"
                    />
                  </div>
                  <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-center">
                    <span className="text-[11px] text-brand-300 font-mono">
                      💡 Demo Mode: Enter any 6-digit number (e.g. <strong>123456</strong>)
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition flex items-center justify-center space-x-2 mt-2"
              >
                <span>
                  {mode === 'login' && 'Sign In to Platform'}
                  {mode === 'register' && 'Create Free Account'}
                  {mode === 'otp' && 'Verify & Continue to Workspace'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Social Logins */}
            {mode !== 'otp' && (
              <>
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800" /></div>
                  <span className="relative bg-gray-900 px-3 text-[11px] text-gray-500 font-mono">OR CONTINUE WITH</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode('oauth_google')}
                    className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-950 hover:bg-gray-800 border border-gray-800 rounded-xl text-xs font-semibold text-gray-200 transition"
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
                    onClick={() => setMode('oauth_github')}
                    className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-950 hover:bg-gray-800 border border-gray-800 rounded-xl text-xs font-semibold text-gray-200 transition"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </button>
                </div>
              </>
            )}

            {/* Super Admin Quick Login Card */}
            <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-brand-500/10 to-purple-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  👑
                </div>
                <div>
                  <div className="text-[11px] font-bold text-amber-300">Super Admin Mode (Muhamad Fadli)</div>
                  <div className="text-[10px] text-gray-400 font-mono">admin@iothub.local</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  login('admin@iothub.local', 'admin123');
                  onClose();
                }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-[11px] rounded-xl shadow-md glow-amber transition font-mono"
              >
                1-Click Login
              </button>
            </div>

            {/* Footer switch */}
            <div className="mt-5 text-center text-xs text-gray-400">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => setMode('register')} className="text-brand-400 font-bold hover:underline">
                    Sign Up for Free
                  </button>
                </p>
              ) : mode === 'register' ? (
                <p>
                  Already registered?{' '}
                  <button onClick={() => setMode('login')} className="text-brand-400 font-bold hover:underline">
                    Sign In
                  </button>
                </p>
              ) : (
                <button onClick={() => setMode('register')} className="text-gray-400 hover:text-white">
                  ← Back to Registration
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

type Mode = 'login' | 'otp';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) { toast.error('Enter email and password'); return; }
    setLoading(true);
    try {
      const user = await authService.signInWithPassword(email.trim(), password);
      login(user);
      navigate('/');
    } catch (e: any) {
      toast.error(e.message || 'Login failed');
      setLoading(false);
    }
  }

  async function handleSendOtp() {
    if (!email.trim()) { toast.error('Enter your email address'); return; }
    setLoading(true);
    try {
      await authService.sendOtp(email.trim());
      setMode('otp');
      toast.success('OTP sent to ' + email);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpLogin() {
    if (!otp.trim()) { toast.error('Enter OTP code'); return; }
    setLoading(true);
    try {
      // Use verifyOtp for passwordless login
      const { data, error } = await (await import('@/lib/supabase')).supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email',
      });
      if (error) throw error;
      const u = data.user;
      if (!u) throw new Error('Verification failed');
      login({
        id: u.id,
        email: u.email!,
        username: u.user_metadata?.username || u.email!.split('@')[0],
      });
      navigate('/');
    } catch (e: any) {
      toast.error(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* BG gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, #0088ff 0%, transparent 50%), radial-gradient(circle at 80% 70%, #00ccff 0%, transparent 50%)'
      }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Card */}
        <div className="glass rounded-2xl shadow-2xl overflow-hidden border border-blue-200/40">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-cyan-600 px-6 py-6 text-center">
            <div className="font-digital text-glow-white text-3xl mb-1">IQMAIL</div>
            <div className="text-blue-200 text-sm">Sign in to your account</div>
            <div className="font-urdu text-blue-100 text-xs mt-1">بسم اللّٰہ الرحمٰن الرحیم</div>
          </div>

          <div className="p-6 space-y-4">
            {/* Email field */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address</label>
              <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-3 py-2.5 bg-white/60 focus-within:border-blue-400 transition-colors">
                <Mail className="w-3.5 h-3.5 text-blue-400 flex-none" strokeWidth={2} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@iqmail.online"
                  className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-300"
                  onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleOtpLogin())}
                  disabled={mode === 'otp'}
                />
              </div>
            </div>

            {mode === 'login' && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Password</label>
                <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-3 py-2.5 bg-white/60 focus-within:border-blue-400 transition-colors">
                  <Lock className="w-3.5 h-3.5 text-blue-400 flex-none" strokeWidth={2} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-300"
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  />
                  <button onClick={() => setShowPass(s => !s)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <EyeOff className="w-3.5 h-3.5" strokeWidth={2} /> : <Eye className="w-3.5 h-3.5" strokeWidth={2} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'otp' && (
              <div className="animate-fade-in-up">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  OTP Code (4 digits — check your email)
                </label>
                <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-3 py-2.5 bg-white/60 focus-within:border-blue-400 transition-colors">
                  <Shield className="w-3.5 h-3.5 text-cyan-500 flex-none" strokeWidth={2} />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-300 tracking-widest font-mono"
                    onKeyDown={e => e.key === 'Enter' && handleOtpLogin()}
                  />
                </div>
                <button
                  onClick={() => { setMode('login'); setOtp(''); }}
                  className="text-xs text-blue-500 mt-1.5 hover:underline"
                >
                  ← Use password instead
                </button>
              </div>
            )}

            {mode === 'login' && (
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg hover:shadow-blue-300/40 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in...' : (
                  <>Sign In <ArrowRight className="w-4 h-4" strokeWidth={2.5} /></>
                )}
              </button>
            )}

            {mode === 'login' && (
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors disabled:opacity-60"
              >
                Sign in with OTP (passwordless)
              </button>
            )}

            {mode === 'otp' && (
              <button
                onClick={handleOtpLogin}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Sign In'}
              </button>
            )}

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-blue-100" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-blue-100" />
            </div>

            <button
              onClick={() => navigate('/register')}
              className="w-full py-2.5 rounded-xl border border-cyan-200 text-cyan-600 font-semibold text-sm hover:bg-cyan-50 transition-colors"
            >
              Create New Account
            </button>
          </div>
        </div>

        <div className="text-center mt-4 text-xs text-gray-400">
          <button onClick={() => navigate('/legal')} className="hover:text-blue-500 transition-colors">
            Privacy Policy · Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
}

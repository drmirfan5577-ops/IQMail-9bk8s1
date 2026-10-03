import { useState } from 'react';
import { Mail, User, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, Globe, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { useCreateEmailAccount } from '@/hooks/useEmailData';

const DOMAIN_OPTIONS = ['iqmail.online'];

const passwordChecks = [
  { label: 'At least 6 characters', check: (p: string) => p.length >= 6 },
  { label: 'Contains uppercase letter', check: (p: string) => /[A-Z]/.test(p) },
  { label: 'Contains number', check: (p: string) => /\d/.test(p) },
];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const createAccount = useCreateEmailAccount();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    domain: 'iqmail.online',
    password: '',
    confirmPassword: '',
    phone: '',
    recoveryEmail: '',
    otp: '',
    agreeTerms: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
  }

  const emailAddress = `${form.username}@${form.domain}`;

  function handleStep1() {
    if (!form.firstName.trim() || !form.lastName.trim()) { toast.error('Please enter your full name'); return; }
    if (!form.username.trim()) { toast.error('Please choose a username'); return; }
    if (!/^[a-zA-Z0-9._-]+$/.test(form.username)) { toast.error('Username: letters, numbers, dots, underscores, hyphens only'); return; }
    setStep(2);
  }

  function handleStep2() {
    const allPass = passwordChecks.every(c => c.check(form.password));
    if (!allPass) { toast.error('Password does not meet requirements'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setStep(3);
  }

  async function handleSendOtp() {
    if (!form.agreeTerms) { toast.error('Please agree to Terms of Service'); return; }
    setLoading(true);
    try {
      await authService.sendOtp(emailAddress);
      setStep(4);
      toast.success('OTP sent to ' + emailAddress);
    } catch (e: any) {
      toast.error(e.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyAndCreate() {
    if (!form.otp.trim()) { toast.error('Enter OTP code'); return; }
    setLoading(true);
    try {
      const username = `${form.firstName} ${form.lastName}`;
      const user = await authService.verifyOtpAndSetPassword(emailAddress, form.otp, form.password, username);
      // Create the email account in DB
      await createAccount.mutateAsync({
        username: form.username,
        domain: form.domain,
        display_name: username,
        is_primary: true,
      });
      login(user);
      toast.success(`Welcome! ${emailAddress} is ready.`);
      navigate('/');
    } catch (e: any) {
      toast.error(e.message || 'Verification failed');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, #0088ff 0%, transparent 50%), radial-gradient(circle at 80% 70%, #00ccff 0%, transparent 50%)'
      }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-2xl shadow-2xl overflow-hidden border border-blue-200/40">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-cyan-600 px-6 py-5">
            <button onClick={() => navigate('/login')} className="flex items-center gap-1.5 text-blue-200 text-xs mb-3 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> Back to Login
            </button>
            <div className="font-digital text-glow-white text-2xl">IQMAIL</div>
            <div className="text-blue-100 text-sm mt-0.5">Create Your Free Email Account</div>
            <div className="flex items-center gap-2 mt-3">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={cn('flex-1 h-1 rounded-full transition-all', s <= step ? 'bg-white' : 'bg-white/30')} />
              ))}
            </div>
            <div className="text-blue-200 text-xs mt-1.5">Step {step} of 4</div>
          </div>

          <div className="p-6">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in-up">
                <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { f: 'firstName', label: 'First Name' },
                    { f: 'lastName', label: 'Last Name' },
                  ].map(({ f, label }) => (
                    <div key={f}>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">{label} *</label>
                      <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-3 py-2.5 bg-white/60 focus-within:border-blue-400 transition-colors">
                        <User className="w-3.5 h-3.5 text-blue-400 flex-none" strokeWidth={2} />
                        <input value={(form as any)[f]} onChange={e => update(f, e.target.value)}
                          placeholder={label} className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-300" />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Choose Email Address *</label>
                  <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-3 py-2.5 bg-white/60 focus-within:border-blue-400 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-blue-400 flex-none" strokeWidth={2} />
                    <input value={form.username} onChange={e => update('username', e.target.value.toLowerCase())}
                      placeholder="username" className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-300 min-w-0" />
                    <span className="text-gray-400 text-sm flex-none">@</span>
                    <select value={form.domain} onChange={e => update('domain', e.target.value)}
                      className="text-sm text-blue-600 font-semibold bg-transparent focus:outline-none flex-none">
                      {DOMAIN_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  {form.username && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Globe className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 font-semibold">{emailAddress}</span>
                    </div>
                  )}
                </div>
                <button onClick={handleStep1}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg hover:shadow-blue-300/40 transition-all">
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in-up">
                <h2 className="text-lg font-bold text-gray-800">Secure Your Account</h2>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Password *</label>
                  <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-3 py-2.5 bg-white/60 focus-within:border-blue-400 transition-colors">
                    <Lock className="w-3.5 h-3.5 text-blue-400 flex-none" strokeWidth={2} />
                    <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                      placeholder="Create password" className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-300" />
                    <button onClick={() => setShowPass(s => !s)} className="text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="w-3.5 h-3.5" strokeWidth={2} /> : <Eye className="w-3.5 h-3.5" strokeWidth={2} />}
                    </button>
                  </div>
                  <div className="mt-2 space-y-1">
                    {passwordChecks.map(c => (
                      <div key={c.label} className={cn('flex items-center gap-1.5 text-xs transition-colors', c.check(form.password) ? 'text-green-600' : 'text-gray-400')}>
                        <CheckCircle className="w-3 h-3" strokeWidth={2} />
                        {c.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Confirm Password *</label>
                  <div className={cn('flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-white/60 focus-within:border-blue-400 transition-colors',
                    form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-300' : 'border-blue-200')}>
                    <Lock className="w-3.5 h-3.5 text-blue-400 flex-none" strokeWidth={2} />
                    <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                      placeholder="Confirm password" className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-300" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition-colors">← Back</button>
                  <button onClick={handleStep2} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg transition-all">Continue →</button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm + Terms */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in-up">
                <h2 className="text-lg font-bold text-gray-800">Review & Confirm</h2>
                <div className="glass rounded-xl p-4 space-y-2">
                  {[
                    ['Email', emailAddress],
                    ['Name', `${form.firstName} ${form.lastName}`],
                    ['Domain', form.domain],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm border-b border-blue-50 pb-2 last:border-0">
                      <span className="text-gray-500">{k}</span>
                      <span className="text-blue-700 font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.agreeTerms} onChange={e => update('agreeTerms', e.target.checked)}
                    className="mt-0.5 accent-blue-600 w-4 h-4 flex-none" />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I agree to IQMAIL <a href="/legal" className="text-blue-600 font-semibold hover:underline">Terms of Service</a> and <a href="/legal" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>.
                  </span>
                </label>
                <div className="text-xs text-blue-600 bg-blue-50 rounded-xl p-3 flex gap-2">
                  <Shield className="w-4 h-4 flex-none mt-0.5" strokeWidth={2} />
                  <span>We'll send a 4-digit OTP to <strong>{emailAddress}</strong> to verify your account.</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition-colors">← Back</button>
                  <button onClick={handleSendOtp} disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg transition-all disabled:opacity-60">
                    {loading ? 'Sending...' : 'Send OTP →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: OTP Verification */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in-up">
                <h2 className="text-lg font-bold text-gray-800">Verify Your Email</h2>
                <p className="text-sm text-gray-600">Enter the 4-digit OTP sent to <strong className="text-blue-600">{emailAddress}</strong></p>
                <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-4 py-3 bg-white/60 focus-within:border-blue-400 transition-colors">
                  <Shield className="w-4 h-4 text-cyan-500 flex-none" strokeWidth={2} />
                  <input
                    type="text"
                    maxLength={6}
                    value={form.otp}
                    onChange={e => update('otp', e.target.value)}
                    placeholder="1234"
                    className="flex-1 text-lg text-center bg-transparent focus:outline-none placeholder-gray-300 tracking-[0.5em] font-mono font-bold text-blue-700"
                    onKeyDown={e => e.key === 'Enter' && handleVerifyAndCreate()}
                  />
                </div>
                <button onClick={handleVerifyAndCreate} disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold shadow-lg transition-all disabled:opacity-60">
                  {loading ? 'Creating Account...' : '✓ Verify & Create Account'}
                </button>
                <button onClick={() => { setStep(3); update('otp', ''); }} className="w-full text-xs text-blue-500 hover:underline">
                  ← Resend OTP
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-4 text-xs text-gray-500">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">Sign In</button>
        </div>
      </div>
    </div>
  );
}

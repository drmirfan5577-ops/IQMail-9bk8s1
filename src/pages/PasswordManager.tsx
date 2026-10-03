import { useState } from 'react';
import { Shield, Lock, Mail, Phone, Eye, EyeOff, X, Key, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePasswordVault, useUpsertPasswordVault, useSecurityReports, useRunSecurityScan } from '@/hooks/useEmailData';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Tab = 'vault' | 'password' | 'security';

export default function PasswordManager({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const vault = usePasswordVault();
  const upsert = useUpsertPasswordVault();
  const reports = useSecurityReports();
  const runScan = useRunSecurityScan();

  const [tab, setTab] = useState<Tab>('vault');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [secQuestion, setSecQuestion] = useState('');
  const [twoFa, setTwoFa] = useState(false);

  // Password change
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPasses, setShowPasses] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const v = vault.data;

  async function saveVault() {
    try {
      await upsert.mutateAsync({
        recovery_email: recoveryEmail || v?.recovery_email,
        recovery_phone: recoveryPhone || v?.recovery_phone,
        security_question: secQuestion || v?.security_question,
        two_fa_enabled: twoFa ?? v?.two_fa_enabled,
      });
      toast.success('Security settings saved');
    } catch (e: any) { toast.error(e.message); }
  }

  async function changePassword() {
    if (!newPass || !confirmPass) { toast.error('Enter new password'); return; }
    if (newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (newPass !== confirmPass) { toast.error('Passwords do not match'); return; }
    setChangingPass(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) throw error;
      await upsert.mutateAsync({ last_password_change: new Date().toISOString() } as any);
      toast.success('Password changed successfully');
      setCurrentPass(''); setNewPass(''); setConfirmPass('');
    } catch (e: any) {
      toast.error(e.message);
    } finally { setChangingPass(false); }
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'vault', label: 'Recovery Methods', icon: Key },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'security', label: 'Security Reports', icon: Shield },
  ];

  const latestReport = reports.data?.[0];

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-blue-200/40 flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-600 px-5 py-3.5 flex items-center gap-3 flex-none">
          <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span className="text-white font-bold text-base">Password & Security</span>
          <div className="flex-1" />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-4 h-4 text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-blue-100/60 bg-white/40 flex-none">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 flex-1 justify-center',
                tab === t.id ? 'text-indigo-700 border-indigo-500 bg-indigo-50/60' : 'text-gray-500 border-transparent hover:text-indigo-600')}>
              <t.icon className="w-4 h-4" strokeWidth={2} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* ── Recovery Methods ── */}
          {tab === 'vault' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Set up multiple ways to recover your account if you lose access.</p>
              {vault.isLoading ? <div className="text-center py-6 text-gray-400">Loading...</div> : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-500" /> Recovery Email
                    </label>
                    <input value={recoveryEmail || v?.recovery_email || ''} onChange={e => setRecoveryEmail(e.target.value)}
                      placeholder="backup@gmail.com" className="w-full px-3 py-2.5 rounded-xl border border-blue-200 text-sm bg-white/70 focus:outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-green-500" /> Recovery Phone
                    </label>
                    <input value={recoveryPhone || v?.recovery_phone || ''} onChange={e => setRecoveryPhone(e.target.value)}
                      placeholder="+92-300-0000000" className="w-full px-3 py-2.5 rounded-xl border border-blue-200 text-sm bg-white/70 focus:outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-orange-500" /> Security Question
                    </label>
                    <input value={secQuestion || v?.security_question || ''} onChange={e => setSecQuestion(e.target.value)}
                      placeholder="e.g., Your childhood city?" className="w-full px-3 py-2.5 rounded-xl border border-blue-200 text-sm bg-white/70 focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-3 p-4 glass rounded-xl">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800">Two-Factor Authentication (2FA)</div>
                      <div className="text-xs text-gray-500 mt-0.5">Adds extra security to your account</div>
                    </div>
                    <button onClick={() => setTwoFa(t => !t)}
                      className={cn('w-12 h-6 rounded-full transition-all relative flex-none', (twoFa ?? v?.two_fa_enabled) ? 'bg-blue-600' : 'bg-gray-200')}>
                      <div className={cn('w-4.5 h-4.5 rounded-full bg-white shadow absolute top-0.5 transition-all', (twoFa ?? v?.two_fa_enabled) ? 'right-0.5' : 'left-0.5')} style={{ width: '20px', height: '20px' }} />
                    </button>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs font-semibold text-gray-600 mb-2">Current Status</div>
                    {[
                      { label: 'Recovery Email', value: v?.recovery_email || 'Not set', ok: !!v?.recovery_email },
                      { label: 'Recovery Phone', value: v?.recovery_phone || 'Not set', ok: !!v?.recovery_phone },
                      { label: '2FA', value: v?.two_fa_enabled ? 'Enabled' : 'Disabled', ok: !!v?.two_fa_enabled },
                      { label: 'Password Strength', value: v?.password_strength || 'Unknown', ok: true },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between py-1.5 border-b border-blue-50 last:border-0">
                        <span className="text-xs text-gray-500">{row.label}</span>
                        <div className="flex items-center gap-1.5">
                          {row.ok ? <CheckCircle className="w-3 h-3 text-green-500" strokeWidth={2.5} /> : <AlertTriangle className="w-3 h-3 text-orange-400" strokeWidth={2.5} />}
                          <span className="text-xs font-semibold text-gray-700">{row.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={saveVault} disabled={upsert.isPending}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg transition-all disabled:opacity-60">
                    {upsert.isPending ? 'Saving...' : 'Save Security Settings'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Change Password ── */}
          {tab === 'password' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Update your account password. You'll remain logged in after changing.</p>
              <div className="text-xs text-blue-600 bg-blue-50 rounded-xl p-3 flex gap-2">
                <Shield className="w-4 h-4 flex-none mt-0.5" strokeWidth={2} />
                <span>Signed in as <strong>{user?.email}</strong>. No current password required — just set a new one.</span>
              </div>
              {[
                { label: 'New Password', val: newPass, set: setNewPass },
                { label: 'Confirm New Password', val: confirmPass, set: setConfirmPass },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
                  <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-3 py-2.5 bg-white/60 focus-within:border-blue-400 transition-colors">
                    <Lock className="w-3.5 h-3.5 text-indigo-400 flex-none" strokeWidth={2} />
                    <input type={showPasses ? 'text' : 'password'} value={f.val} onChange={e => f.set(e.target.value)}
                      className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-300" />
                    <button onClick={() => setShowPasses(s => !s)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showPasses ? <EyeOff className="w-3.5 h-3.5" strokeWidth={2} /> : <Eye className="w-3.5 h-3.5" strokeWidth={2} />}
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={changePassword} disabled={changingPass}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg transition-all disabled:opacity-60">
                {changingPass ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          )}

          {/* ── Security Reports ── */}
          {tab === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Security Scan Reports</span>
                <button onClick={() => runScan.mutate(false)} disabled={runScan.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60">
                  <Shield className="w-3.5 h-3.5" strokeWidth={2.5} />
                  {runScan.isPending ? 'Scanning...' : 'Run Scan Now'}
                </button>
              </div>
              {latestReport && (
                <div className={cn('rounded-2xl p-5 text-white', latestReport.overall_score >= 80 ? 'bg-gradient-to-br from-green-600 to-teal-600' : latestReport.overall_score >= 60 ? 'bg-gradient-to-br from-orange-500 to-yellow-500' : 'bg-gradient-to-br from-red-600 to-orange-500')}>
                  <div className="text-4xl font-black">{latestReport.overall_score}/100</div>
                  <div className="text-sm opacity-90 mt-0.5">Security Score</div>
                  <div className="flex gap-4 mt-3 text-xs opacity-90">
                    <span>🔴 {latestReport.critical_count} Critical</span>
                    <span>🟡 {latestReport.warnings_count} Warnings</span>
                    <span>🔵 {latestReport.info_count} Info</span>
                  </div>
                  <div className="text-xs opacity-75 mt-2">
                    Last scan: {new Date(latestReport.scanned_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              )}
              {reports.isLoading ? (
                <div className="text-center py-6 text-gray-400">Loading reports...</div>
              ) : reports.data?.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Shield className="w-10 h-10 opacity-20 mx-auto mb-2" />
                  <div className="text-sm">No scan reports yet. Run a scan to check your security.</div>
                </div>
              ) : (
                reports.data?.map(r => {
                  const issues = (r.report_data as any)?.issues || [];
                  return (
                    <div key={r.id} className="glass rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-800">
                          Score: <span className={cn('font-black', r.overall_score >= 80 ? 'text-green-600' : r.overall_score >= 60 ? 'text-orange-500' : 'text-red-500')}>{r.overall_score}/100</span>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(r.scanned_at).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div className="text-xs text-gray-500">{r.remediation_notes}</div>
                      {issues.slice(0, 3).map((issue: any, i: number) => (
                        <div key={i} className={cn('flex gap-2 text-xs p-2 rounded-lg', issue.severity === 'critical' ? 'bg-red-50 text-red-700' : issue.severity === 'warning' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700')}>
                          <span className="flex-none">
                            {issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵'}
                          </span>
                          <span>{issue.message}</span>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

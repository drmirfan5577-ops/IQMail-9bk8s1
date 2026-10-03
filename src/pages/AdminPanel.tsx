import { useState } from 'react';
import {
  Shield, Eye, EyeOff, Lock, X, Users, Mail, Globe, Settings,
  BarChart3, Server, AlertTriangle, Plug, RefreshCw, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useIntegrations, useUserIntegrations, useToggleIntegration, useRunSecurityScan } from '@/hooks/useEmailData';

const ADMIN_PASSWORD = '1122#';

interface Props {
  onClose: () => void;
}

type AdminTab = 'dashboard' | 'users' | 'domains' | 'integrations' | 'security' | 'settings';

const CATEGORY_COLORS: Record<string, string> = {
  email: 'bg-blue-100 text-blue-700',
  notifications: 'bg-yellow-100 text-yellow-700',
  storage: 'bg-green-100 text-green-700',
  automation: 'bg-purple-100 text-purple-700',
  crm: 'bg-pink-100 text-pink-700',
  productivity: 'bg-orange-100 text-orange-700',
  developer: 'bg-gray-100 text-gray-700',
  marketing: 'bg-rose-100 text-rose-700',
  finance: 'bg-teal-100 text-teal-700',
  ai: 'bg-indigo-100 text-indigo-700',
};

const stats = [
  { label: 'Total Users', value: '–', change: 'Live data', color: 'from-blue-500 to-cyan-400' },
  { label: 'Emails Today', value: '–', change: 'Real-time', color: 'from-green-500 to-teal-400' },
  { label: 'Active Domains', value: '1', change: 'iqmail.online', color: 'from-purple-500 to-pink-400' },
  { label: 'Integrations', value: '30+', change: 'Available', color: 'from-red-500 to-orange-400' },
];

export default function AdminPanel({ onClose }: Props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loginError, setLoginError] = useState('');
  const [apiKeyInputs, setApiKeyInputs] = useState<Record<string, string>>({});

  const integrations = useIntegrations();
  const userIntegrations = useUserIntegrations();
  const toggleIntegration = useToggleIntegration();
  const runScan = useRunSecurityScan();

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setLoginError('');
      toast.success('Welcome, Administrator');
    } else {
      setLoginError('Invalid admin password');
      toast.error('Access denied');
    }
  }

  function getConnected(integrationId: string) {
    return userIntegrations.data?.find(ui => ui.integration_id === integrationId);
  }

  async function toggleConnect(integrationId: string, requiresKey: boolean) {
    const existing = getConnected(integrationId);
    const apiKey = apiKeyInputs[integrationId];
    if (requiresKey && !existing && !apiKey) {
      toast.error('Enter API key first');
      return;
    }
    try {
      await toggleIntegration.mutateAsync({
        integrationId,
        apiKey,
        isActive: !existing?.is_active,
        existingId: existing?.id,
      });
      toast.success(existing ? 'Integration updated' : 'Integration connected!');
    } catch (e: any) { toast.error(e.message); }
  }

  // Group integrations by category
  const byCategory: Record<string, typeof integrations.data> = {};
  integrations.data?.forEach(i => {
    if (!byCategory[i.category]) byCategory[i.category] = [];
    byCategory[i.category]!.push(i);
  });

  const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'domains', label: 'Domains', icon: Globe },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in-up border border-blue-200/40 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-600 px-6 py-4 flex items-center gap-3 flex-none">
          <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span className="text-white font-bold text-lg">IQMAIL Admin Panel</span>
          <span className="text-red-200 text-xs ml-2">Protected • Enterprise</span>
          <div className="flex-1" />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-4 h-4 text-white" strokeWidth={2.5} />
          </button>
        </div>

        {!authenticated ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Lock className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Admin Authentication</h2>
                <p className="text-sm text-gray-500 mt-1">Enter admin password to access</p>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Admin password"
                  className={cn('w-full px-4 py-3 pr-12 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white/70',
                    loginError ? 'border-red-300 focus:ring-red-200' : 'border-blue-200 focus:ring-blue-200')} />
                <button onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                </button>
              </div>
              {loginError && <p className="text-xs text-red-500 text-center">{loginError}</p>}
              <button onClick={handleLogin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold shadow-lg hover:shadow-red-300/40 transition-all">
                Access Admin Panel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-44 flex-none border-r border-blue-100/60 bg-white/30 overflow-y-auto">
              <div className="p-3 space-y-1 pt-4">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={cn('w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      activeTab === tab.id ? 'bg-red-100/80 text-red-700 font-semibold' : 'text-gray-600 hover:bg-red-50/50')}>
                    <tab.icon className={cn('w-4 h-4', activeTab === tab.id ? 'text-red-500' : 'text-gray-400')} strokeWidth={2} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'dashboard' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-800">System Dashboard</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {stats.map(s => (
                      <div key={s.label} className={`rounded-xl p-4 bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                        <div className="text-2xl font-black">{s.value}</div>
                        <div className="text-xs font-semibold opacity-90 mt-0.5">{s.label}</div>
                        <div className="text-[10px] opacity-75 mt-1">{s.change}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-xl p-4">
                      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5"><Server className="w-4 h-4 text-blue-500" /> Service Status</h3>
                      {[
                        ['Cloudflare Email', '🟢 Routing Active'],
                        ['Resend API', '🟢 Sending Active'],
                        ['OnSpace Cloud', '🟢 Database Ready'],
                        ['Edge Functions', '🟢 Deployed'],
                        ['SSL Certificate', '🟢 Valid'],
                        ['Wildcard DNS', '🟢 *.iqmail.online'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1.5 border-b border-blue-50 last:border-0 text-xs">
                          <span className="text-gray-500">{k}</span>
                          <span className="font-semibold text-gray-700">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="glass rounded-xl p-4">
                      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5"><Mail className="w-4 h-4 text-green-500" /> Configuration</h3>
                      {[
                        ['Domain', 'iqmail.online'],
                        ['Webhook URL', '/functions/v1/email-webhook'],
                        ['Send Function', '/functions/v1/send-email'],
                        ['Security Scanner', '/functions/v1/security-scan'],
                        ['Admin Password', '@1122# (replaceable)'],
                        ['Auth Mode', 'OTP + Password'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1.5 border-b border-blue-50 last:border-0 text-xs">
                          <span className="text-gray-500">{k}</span>
                          <span className="font-semibold text-blue-700 truncate max-w-[60%] text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'domains' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-800">Domain Management</h2>
                  {[
                    { domain: 'iqmail.online', status: 'Primary', ssl: 'Valid', wildcard: true, mx: 'route1.mx.cloudflare.net' },
                    { domain: '*.iqmail.online', status: 'Wildcard', ssl: 'Valid', wildcard: true, mx: 'Auto-inherit' },
                    { domain: 'mail.iqmail.online', status: 'MX Record', ssl: 'Valid', wildcard: false, mx: 'Cloudflare MX' },
                  ].map(d => (
                    <div key={d.domain} className="glass rounded-xl p-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <div className="font-bold text-gray-900 font-mono text-sm">{d.domain}</div>
                          <div className="text-xs text-gray-500 mt-0.5">MX: {d.mx} · SSL: {d.ssl}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {d.wildcard && <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Wildcard ✓</span>}
                          <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{d.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="glass rounded-xl p-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-2">Cloudflare Webhook Setup</h3>
                    <p className="text-xs text-gray-600 mb-3">Configure Cloudflare Email Routing to forward to this webhook URL:</p>
                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 break-all">
                      {import.meta.env.VITE_SUPABASE_URL}/functions/v1/email-webhook
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Set this as your Cloudflare Email Worker destination for incoming emails.</p>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-800">Integrations ({integrations.data?.length || 0} available)</h2>
                  {integrations.isLoading ? (
                    <div className="text-center py-8 text-gray-400">Loading integrations...</div>
                  ) : (
                    Object.entries(byCategory).map(([cat, items]) => (
                      <div key={cat}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full capitalize', CATEGORY_COLORS[cat] || 'bg-gray-100 text-gray-700')}>{cat}</span>
                        </div>
                        <div className="space-y-2">
                          {items!.map(integration => {
                            const connected = getConnected(integration.id);
                            return (
                              <div key={integration.id} className="glass rounded-xl p-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-blue-600 flex-none font-bold text-xs">
                                  {integration.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-semibold text-gray-800">{integration.name}</div>
                                  <div className="text-xs text-gray-500 truncate">{integration.description}</div>
                                </div>
                                {integration.requires_api_key && !connected && (
                                  <input
                                    value={apiKeyInputs[integration.id] || ''}
                                    onChange={e => setApiKeyInputs(k => ({ ...k, [integration.id]: e.target.value }))}
                                    placeholder="API Key"
                                    className="w-24 px-2 py-1 rounded-lg border border-blue-200 text-xs bg-white/70 focus:outline-none focus:border-blue-400"
                                  />
                                )}
                                <button
                                  onClick={() => toggleConnect(integration.id, integration.requires_api_key)}
                                  disabled={toggleIntegration.isPending}
                                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-none',
                                    connected?.is_active
                                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200')}
                                >
                                  {connected?.is_active ? <><Check className="w-3 h-3" strokeWidth={2.5} /> Connected</> : 'Connect'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Global Security Scanner</h2>
                    <button onClick={() => runScan.mutate(true)} disabled={runScan.isPending}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-60">
                      <RefreshCw className={cn('w-3.5 h-3.5', runScan.isPending && 'animate-spin')} strokeWidth={2.5} />
                      {runScan.isPending ? 'Scanning...' : 'Run Global Scan'}
                    </button>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-sm text-gray-600">Global security scans run automatically every 24 hours. They check:</p>
                    <ul className="mt-2 space-y-1">
                      {['API keys configuration', 'Database connectivity', 'SSL/TLS certificates', 'Spam detection rates', 'Account security status', 'Edge Function health'].map(item => (
                        <li key={item} className="text-xs text-gray-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-none" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">User Management</h2>
                    <span className="text-xs text-gray-500">Real users via OnSpace Cloud Auth</span>
                  </div>
                  <div className="glass rounded-xl p-4 text-sm text-gray-600">
                    <p>User data is managed through <strong>OnSpace Cloud</strong>. To view and manage registered users:</p>
                    <ol className="mt-2 space-y-1 list-decimal list-inside text-xs text-gray-500">
                      <li>Click the Cloud button in the top-right</li>
                      <li>Go to Users tab</li>
                      <li>View, suspend, or delete user accounts</li>
                    </ol>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-800">System Settings</h2>
                  <div className="glass rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-bold text-gray-700">Admin Password</h3>
                    <p className="text-xs text-gray-500">Current: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-600 font-mono">@1122#</code></p>
                    <p className="text-xs text-gray-500">To change the admin password, update the <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">ADMIN_PASSWORD</code> constant in <code className="bg-gray-100 px-1 py-0.5 rounded">AdminPanel.tsx</code>.</p>
                  </div>
                  <div className="glass rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" /> Cloudflare Setup Instructions
                    </h3>
                    <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside">
                      <li>Go to Cloudflare Dashboard → Email → Email Routing</li>
                      <li>Add a Custom Address or Wildcard rule (*@iqmail.online)</li>
                      <li>Set Action to "Send to Worker"</li>
                      <li>Create an Email Worker that forwards to:<br />
                        <code className="bg-gray-900 text-green-400 px-2 py-0.5 rounded block mt-1 break-all">
                          {import.meta.env.VITE_SUPABASE_URL}/functions/v1/email-webhook
                        </code>
                      </li>
                      <li>The webhook accepts POST with from, to, subject, text, html fields</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

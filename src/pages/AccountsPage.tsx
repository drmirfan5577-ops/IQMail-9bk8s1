import { useState } from 'react';
import { Plus, Mail, Globe, GitBranch, Trash2, RefreshCw, X, Copy, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  useEmailAccounts, useSubdomains, useAliases,
  useCreateEmailAccount, useCreateSubdomain, useDeleteSubdomain,
  useCreateAlias, useDeleteAlias, useSigninHistory,
} from '@/hooks/useEmailData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Tab = 'accounts' | 'subdomains' | 'aliases' | 'history';

export default function AccountsPage({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('accounts');
  const [copied, setCopied] = useState('');

  const accounts = useEmailAccounts();
  const subdomains = useSubdomains();
  const aliases = useAliases();
  const history = useSigninHistory();
  const createAccount = useCreateEmailAccount();
  const createSubdomain = useCreateSubdomain();
  const deleteSubdomain = useDeleteSubdomain();
  const createAlias = useCreateAlias();
  const deleteAlias = useDeleteAlias();

  // Forms
  const [newAccount, setNewAccount] = useState({ username: '', domain: 'iqmail.online', display: '' });
  const [newSub, setNewSub] = useState({ subdomain: '', parent: 'iqmail.online' });
  const [newAlias, setNewAlias] = useState({ alias: '', forwards: '' });
  const [showForm, setShowForm] = useState(false);

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  }

  async function addAccount() {
    if (!newAccount.username.trim()) { toast.error('Enter username'); return; }
    try {
      await createAccount.mutateAsync({
        username: newAccount.username.trim(),
        domain: newAccount.domain,
        display_name: newAccount.display || undefined,
      });
      setNewAccount({ username: '', domain: 'iqmail.online', display: '' });
      setShowForm(false);
      toast.success('Account created!');
    } catch (e: any) { toast.error(e.message); }
  }

  async function addSubdomain() {
    if (!newSub.subdomain.trim()) { toast.error('Enter subdomain'); return; }
    if (!/^[a-z0-9-]+$/.test(newSub.subdomain)) { toast.error('Lowercase letters, numbers and hyphens only'); return; }
    try {
      await createSubdomain.mutateAsync({ subdomain: newSub.subdomain.trim(), parent: newSub.parent });
      setNewSub({ subdomain: '', parent: 'iqmail.online' });
      setShowForm(false);
      toast.success('Subdomain registered!');
    } catch (e: any) { toast.error(e.message); }
  }

  async function addAlias() {
    if (!newAlias.alias.trim() || !newAlias.forwards.trim()) { toast.error('Fill all alias fields'); return; }
    try {
      await createAlias.mutateAsync({ alias_address: newAlias.alias.trim(), forwards_to: newAlias.forwards.trim() });
      setNewAlias({ alias: '', forwards: '' });
      setShowForm(false);
      toast.success('Alias created!');
    } catch (e: any) { toast.error(e.message); }
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'accounts', label: 'Email Accounts', icon: Mail, count: accounts.data?.length },
    { id: 'subdomains', label: 'Sub Domains', icon: Globe, count: subdomains.data?.length },
    { id: 'aliases', label: 'Aliases', icon: GitBranch, count: aliases.data?.length },
    { id: 'history', label: 'Sign-in History', icon: RefreshCw, count: history.data?.length },
  ];

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-4xl max-h-[88vh] overflow-hidden shadow-2xl border border-blue-200/40 flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-cyan-600 px-5 py-3.5 flex items-center gap-3 flex-none">
          <Mail className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span className="text-white font-bold text-base">Account Management</span>
          <span className="text-blue-200 text-xs">{user?.email}</span>
          <div className="flex-1" />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-4 h-4 text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-blue-100/60 bg-white/40 flex-none overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setShowForm(false); }}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2',
                tab === t.id ? 'text-blue-700 border-blue-500 bg-blue-50/60' : 'text-gray-500 border-transparent hover:text-blue-600'
              )}
            >
              <t.icon className="w-4 h-4" strokeWidth={2} />
              {t.label}
              {t.count !== undefined && (
                <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* ── Email Accounts ── */}
          {tab === 'accounts' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Your Email Accounts</span>
                <button onClick={() => setShowForm(s => !s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Add Account
                </button>
              </div>
              {showForm && (
                <div className="glass rounded-xl p-4 space-y-3 border border-blue-200/50 animate-fade-in-up">
                  <div className="grid grid-cols-2 gap-3">
                    <input value={newAccount.username} onChange={e => setNewAccount(a => ({ ...a, username: e.target.value.toLowerCase() }))}
                      placeholder="username" className="px-3 py-2 rounded-lg border border-blue-200 text-sm bg-white/70 focus:outline-none focus:border-blue-400" />
                    <select value={newAccount.domain} onChange={e => setNewAccount(a => ({ ...a, domain: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-blue-200 text-sm bg-white/70 focus:outline-none text-blue-700 font-semibold">
                      <option value="iqmail.online">@iqmail.online</option>
                    </select>
                  </div>
                  <input value={newAccount.display} onChange={e => setNewAccount(a => ({ ...a, display: e.target.value }))}
                    placeholder="Display name (optional)" className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm bg-white/70 focus:outline-none focus:border-blue-400" />
                  <div className="flex gap-2">
                    <button onClick={addAccount} disabled={createAccount.isPending}
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
                      {createAccount.isPending ? 'Creating...' : 'Create'}
                    </button>
                    <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </div>
              )}
              {accounts.isLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Loading accounts...</div>
              ) : accounts.data?.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No email accounts yet</div>
              ) : (
                accounts.data?.map(a => (
                  <div key={a.id} className="glass rounded-xl p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-none">
                      {a.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{a.address}</div>
                      <div className="text-xs text-gray-500 flex gap-3 mt-0.5">
                        <span>{a.display_name || 'No display name'}</span>
                        {a.is_primary && <span className="text-blue-600 font-semibold">Primary</span>}
                      </div>
                    </div>
                    <button onClick={() => copy(a.address)} className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      {copied === a.address ? <Check className="w-3.5 h-3.5 text-green-500" strokeWidth={2.5} /> : <Copy className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />}
                    </button>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold', a.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500')}>
                      {a.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Subdomains ── */}
          {tab === 'subdomains' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Registered Subdomains</span>
                <button onClick={() => setShowForm(s => !s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors">
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Add Subdomain
                </button>
              </div>
              {showForm && (
                <div className="glass rounded-xl p-4 space-y-3 border border-purple-200/50 animate-fade-in-up">
                  <div className="flex items-center gap-2">
                    <input value={newSub.subdomain} onChange={e => setNewSub(s => ({ ...s, subdomain: e.target.value.toLowerCase() }))}
                      placeholder="subdomain" className="flex-1 px-3 py-2 rounded-lg border border-blue-200 text-sm bg-white/70 focus:outline-none focus:border-blue-400" />
                    <span className="text-gray-500 font-semibold text-sm flex-none">.iqmail.online</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addSubdomain} disabled={createSubdomain.isPending}
                      className="flex-1 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-60">
                      {createSubdomain.isPending ? 'Registering...' : 'Register'}
                    </button>
                    <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </div>
              )}
              {subdomains.isLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
              ) : subdomains.data?.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No subdomains registered yet</div>
              ) : (
                subdomains.data?.map(s => (
                  <div key={s.id} className="glass rounded-xl p-3.5 flex items-center gap-3">
                    <Globe className="w-5 h-5 text-purple-600 flex-none" strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 font-mono">{s.full_domain}</div>
                      <div className="text-xs text-gray-500 mt-0.5">MX: {s.mx_record || 'pending'} · DNS: {s.dns_verified ? '✓ Verified' : 'Pending'}</div>
                    </div>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold', s.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600')}>
                      {s.status}
                    </span>
                    <button onClick={() => deleteSubdomain.mutate(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" strokeWidth={2} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Aliases ── */}
          {tab === 'aliases' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Email Aliases & Forwarding</span>
                <button onClick={() => setShowForm(s => !s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors">
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Add Alias
                </button>
              </div>
              {showForm && (
                <div className="glass rounded-xl p-4 space-y-3 border border-teal-200/50 animate-fade-in-up">
                  <input value={newAlias.alias} onChange={e => setNewAlias(a => ({ ...a, alias: e.target.value }))}
                    placeholder="alias@iqmail.online" className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm bg-white/70 focus:outline-none focus:border-blue-400" />
                  <input value={newAlias.forwards} onChange={e => setNewAlias(a => ({ ...a, forwards: e.target.value }))}
                    placeholder="forwards-to@gmail.com" className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm bg-white/70 focus:outline-none focus:border-blue-400" />
                  <div className="flex gap-2">
                    <button onClick={addAlias} disabled={createAlias.isPending}
                      className="flex-1 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors disabled:opacity-60">
                      {createAlias.isPending ? 'Creating...' : 'Create Alias'}
                    </button>
                    <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </div>
              )}
              {aliases.isLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
              ) : aliases.data?.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No aliases yet</div>
              ) : (
                aliases.data?.map(a => (
                  <div key={a.id} className="glass rounded-xl p-3.5 flex items-center gap-3">
                    <GitBranch className="w-5 h-5 text-teal-600 flex-none" strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900">{a.alias_address}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <span>→</span> <span className="text-teal-600">{a.forwards_to}</span>
                        {a.catch_all && <span className="ml-2 bg-yellow-100 text-yellow-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">Catch-All</span>}
                      </div>
                    </div>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold', a.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500')}>
                      {a.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button onClick={() => deleteAlias.mutate(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" strokeWidth={2} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Sign-in History ── */}
          {tab === 'history' && (
            <div className="space-y-3">
              <span className="text-sm font-semibold text-gray-700">Sign-in History (Last 50)</span>
              {history.isLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
              ) : history.data?.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No sign-in history</div>
              ) : (
                history.data?.map(h => (
                  <div key={h.id} className="glass rounded-xl p-3.5 flex items-center gap-3">
                    <div className={cn('w-2.5 h-2.5 rounded-full flex-none', h.status === 'success' ? 'bg-green-400' : 'bg-red-400')} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800">
                        {h.status === 'success' ? '✓ Successful sign-in' : '✗ Failed attempt'}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {h.city && `${h.city}, `}{h.country || 'Unknown location'} · {h.device_type || 'Unknown device'}
                      </div>
                      <div className="text-xs text-gray-400">{h.ip_address || 'IP hidden'}</div>
                    </div>
                    <div className="text-right flex-none">
                      <div className="text-xs text-gray-500">
                        {new Date(h.signed_in_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                      {h.signed_out_at && (
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          Out: {new Date(h.signed_out_at).toLocaleTimeString('en-GB', { timeStyle: 'short' })}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

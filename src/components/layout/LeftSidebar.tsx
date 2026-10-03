import { useState } from 'react';
import {
  Inbox, Send, FileText, Trash2, AlertTriangle,
  Star, Tag, Settings, PenSquare, Phone,
  ChevronDown, ChevronRight, Users, Shield,
  HelpCircle, BarChart3, LogOut, Lock, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  color?: string;
}

const navItems: NavItem[] = [
  { id: 'inbox',     label: 'Inbox',      icon: Inbox,         color: 'text-blue-600' },
  { id: 'starred',   label: 'Starred',    icon: Star,          color: 'text-yellow-500' },
  { id: 'sent',      label: 'Sent',       icon: Send,          color: 'text-green-600' },
  { id: 'drafts',    label: 'Drafts',     icon: FileText,      color: 'text-orange-500' },
  { id: 'voicemail', label: 'Voice Mail', icon: Phone,         color: 'text-purple-600' },
  { id: 'spam',      label: 'Spam',       icon: AlertTriangle, color: 'text-red-500' },
  { id: 'trash',     label: 'Trash',      icon: Trash2,        color: 'text-gray-500' },
];

const labelItems = [
  { id: 'work',     label: 'Work',     color: 'bg-blue-500' },
  { id: 'personal', label: 'Personal', color: 'bg-green-500' },
  { id: 'finance',  label: 'Finance',  color: 'bg-yellow-500' },
  { id: 'promo',    label: 'Promo',    color: 'bg-pink-500' },
];

interface Props {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
  onCompose: () => void;
  onNavigate?: (page: string) => void;
  counts?: Record<string, number>;
  user?: { email: string; username: string } | null;
  onLogout?: () => void;
}

export default function LeftSidebar({ activeFolder, onFolderChange, onCompose, onNavigate, counts = {}, user, onLogout }: Props) {
  const [labelsOpen, setLabelsOpen] = useState(true);

  return (
    <div className="h-full flex flex-col overflow-y-auto px-2 py-3 gap-1">
      {/* User info */}
      {user && (
        <div className="px-2 py-2 mb-1 rounded-xl bg-blue-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs flex-none">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-blue-800 truncate">{user.username}</div>
              <div className="text-[9px] text-blue-500 truncate">{user.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* Compose button */}
      <button onClick={onCompose}
        className="w-full mb-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-blue-300/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
        <PenSquare className="w-4 h-4" strokeWidth={2.5} />
        Compose
      </button>

      {/* Mailbox nav */}
      <div className="space-y-0.5">
        {navItems.map(item => {
          const count = counts[item.id] || 0;
          return (
            <button key={item.id} onClick={() => onFolderChange(item.id)}
              className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                activeFolder === item.id ? 'bg-blue-100/80 text-blue-700 shadow-sm font-semibold' : 'text-gray-700 hover:bg-blue-50/60')}>
              <item.icon className={cn('w-4 h-4', item.color)} strokeWidth={2} />
              <span className="flex-1 text-left">{item.label}</span>
              {count > 0 && (
                <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center',
                  activeFolder === item.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600')}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="my-2 h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />

      {/* Labels */}
      <div>
        <button onClick={() => setLabelsOpen(o => !o)}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-blue-600 transition-colors">
          <Tag className="w-3 h-3" />
          Labels
          {labelsOpen ? <ChevronDown className="w-3 h-3 ml-auto" /> : <ChevronRight className="w-3 h-3 ml-auto" />}
        </button>
        {labelsOpen && (
          <div className="pl-3 space-y-0.5 mt-1">
            {labelItems.map(l => (
              <button key={l.id} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-blue-50/60 transition-colors">
                <span className={cn('w-2.5 h-2.5 rounded-full', l.color)} />
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="my-2 h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />

      {/* Quick links */}
      <div className="space-y-0.5">
        {[
          { id: 'admin',     label: 'Admin Panel',    icon: Shield,    color: 'text-red-500' },
          { id: 'accounts',  label: 'My Accounts',    icon: Mail,      color: 'text-blue-500' },
          { id: 'passwords', label: 'Security Mgmt',  icon: Lock,      color: 'text-indigo-500' },
          { id: 'stats',     label: 'Statistics',     icon: BarChart3, color: 'text-teal-500' },
          { id: 'contacts',  label: 'Contacts',       icon: Users,     color: 'text-teal-500' },
          { id: 'settings',  label: 'Settings',       icon: Settings,  color: 'text-gray-500' },
          { id: 'help',      label: 'Help & Support', icon: HelpCircle,color: 'text-blue-400' },
        ].map(item => (
          <button key={item.id} onClick={() => onNavigate?.(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50/60 transition-colors">
            <item.icon className={cn('w-4 h-4', item.color)} strokeWidth={2} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Storage bar */}
      <div className="mt-auto pt-3 px-2">
        <div className="text-[10px] text-gray-500 mb-1 flex justify-between">
          <span>Storage</span>
          <span className="font-semibold text-blue-600">2.1 / 15 GB</span>
        </div>
        <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: '14%' }} />
        </div>
      </div>

      {/* Logout */}
      {onLogout && (
        <button onClick={onLogout}
          className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50/60 transition-colors">
          <LogOut className="w-4 h-4" strokeWidth={2} />
          Sign Out
        </button>
      )}
    </div>
  );
}

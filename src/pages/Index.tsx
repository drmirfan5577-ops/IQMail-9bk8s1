import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Bell, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

import BackgroundEffects from '@/components/features/BackgroundEffects';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import EmailList from '@/components/features/EmailList';
import EmailView from '@/components/features/EmailView';
import VoiceMailPanel from '@/components/features/VoiceMailPanel';
import ComposeEmail from '@/components/features/ComposeEmail';
import AdminPanel from '@/pages/AdminPanel';
import AccountsPage from '@/pages/AccountsPage';
import PasswordManager from '@/pages/PasswordManager';

import { useAuth } from '@/hooks/useAuth';
import {
  useEmails, useMarkRead, useToggleStar,
  useMoveEmail, useEmailCounts,
} from '@/hooks/useEmailData';
import { FilterSettings } from '@/types/email';
import { toast } from 'sonner';

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100, contrast: 100, saturation: 100, blur: 0, opacity: 100,
  hue: 0, sepia: 0, invert: 0, warmth: 0, coolness: 0, glow: 20, sparkle: 15,
  vignette: 0, sharpness: 50, grain: 0, bloom: 10, fade: 0, clarity: 60,
  vibrance: 30, tint: 0, exposure: 0, gamma: 100, shadows: 0, highlights: 0,
  midtones: 0, redChannel: 100, greenChannel: 100, blueChannel: 100,
  crystallize: 0, glitch: 0, neon: 0,
};

type Modal = 'none' | 'compose' | 'admin' | 'accounts' | 'passwords';

export default function Index() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [modal, setModal] = useState<Modal>('none');
  const [selectedTune, setSelectedTune] = useState('t01');
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTERS);

  // Real data
  const { data: emails = [], isLoading, refetch } = useEmails(activeFolder);
  const { data: counts = {} } = useEmailCounts();
  const markRead = useMarkRead();
  const toggleStar = useToggleStar();
  const moveEmail = useMoveEmail();

  const cssFilter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur * 0.1}px) hue-rotate(${filters.hue}deg) sepia(${filters.sepia}%) invert(${filters.invert}%) opacity(${filters.opacity}%)`;

  function handleFilterChange(key: keyof FilterSettings, value: number) {
    setFilters(f => ({ ...f, [key]: value }));
  }

  const displayEmails = useMemo(() => {
    let result = [...emails];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.subject?.toLowerCase().includes(q) ||
        e.from_name?.toLowerCase().includes(q) ||
        e.from_address?.toLowerCase().includes(q) ||
        e.body_text?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [emails, searchQuery]);

  const selectedEmail = displayEmails.find(e => e.id === selectedEmailId) || null;

  function handleSelectEmail(email: any) {
    setSelectedEmailId(email.id);
    if (!email.is_read) markRead.mutate(email.id);
  }

  function handleToggleStar(id: string) {
    const email = emails.find(e => e.id === id);
    if (email) toggleStar.mutate({ id, starred: email.is_starred });
  }

  function handleDelete(id: string) {
    moveEmail.mutate({ id, folder: 'trash' });
    if (selectedEmailId === id) setSelectedEmailId(null);
    toast.success('Moved to Trash');
  }

  function handleRefresh() {
    refetch();
    toast.success('Inbox refreshed');
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  function handleNavigate(page: string) {
    if (page === 'admin') setModal('admin');
    else if (page === 'accounts') setModal('accounts');
    else if (page === 'passwords') setModal('passwords');
    else if (page === 'help') navigate('/legal');
    else toast.info(`${page} coming soon`);
  }

  const folderLabel = activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1);
  const unreadInbox = counts['inbox'] || 0;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ filter: cssFilter }}>
      <BackgroundEffects />

      <Header />

      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR STAR */}
        <button
          onClick={() => setLeftOpen(o => !o)}
          className="star-btn absolute z-30 w-7 h-7 flex items-center justify-center text-yellow-300 text-lg"
          style={{ top: '8px', left: leftOpen ? '192px' : '4px', transition: 'left 0.3s ease' }}
          title={leftOpen ? 'Close sidebar' : 'Open sidebar'}
        >⭐</button>

        {/* RIGHT SIDEBAR STAR */}
        <button
          onClick={() => setRightOpen(o => !o)}
          className="star-btn absolute z-30 w-7 h-7 flex items-center justify-center text-yellow-300 text-lg"
          style={{ top: '8px', right: rightOpen ? '192px' : '4px', transition: 'right 0.3s ease' }}
          title={rightOpen ? 'Close panel' : 'Open panel'}
        >⭐</button>

        {/* LEFT SIDEBAR */}
        <div className={cn('flex-none glass border-r border-white/40 overflow-hidden transition-all duration-300', leftOpen ? 'w-48' : 'w-0')}>
          {leftOpen && (
            <LeftSidebar
              activeFolder={activeFolder}
              onFolderChange={f => { setActiveFolder(f); setSelectedEmailId(null); }}
              onCompose={() => setModal('compose')}
              onNavigate={handleNavigate}
              counts={counts}
              user={user}
              onLogout={handleLogout}
            />
          )}
        </div>

        {/* CENTER PANEL */}
        <div className="flex-1 flex overflow-hidden min-w-0">
          {/* Email list */}
          <div className={cn('flex flex-col glass border-r border-white/40 transition-all duration-300', selectedEmail ? 'w-72 flex-none' : 'flex-1')}>
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-blue-100/60 bg-white/30 flex-none">
              <div className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                {folderLabel}
                {unreadInbox > 0 && activeFolder === 'inbox' && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadInbox}</span>
                )}
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-1.5 bg-white/60 border border-blue-100 rounded-lg px-2.5 py-1.5 flex-1 max-w-[180px]">
                <Search className="w-3 h-3 text-gray-400 flex-none" strokeWidth={2} />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search..." className="flex-1 text-xs bg-transparent focus:outline-none placeholder-gray-400 text-gray-700 min-w-0" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 text-gray-400 hover:text-red-400" strokeWidth={2} /></button>
                )}
              </div>
              <button onClick={handleRefresh} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-gray-500">
                <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} strokeWidth={2} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-gray-500 relative">
                <Bell className="w-3.5 h-3.5" strokeWidth={2} />
                {unreadInbox > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500" title="Sign Out">
                <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>

            {activeFolder === 'voicemail' ? (
              <VoiceMailPanel />
            ) : (
              <EmailList
                emails={displayEmails}
                selectedId={selectedEmailId}
                onSelect={handleSelectEmail}
                onToggleStar={handleToggleStar}
                folder={folderLabel}
                loading={isLoading}
              />
            )}
          </div>

          {/* Email detail */}
          {selectedEmail && activeFolder !== 'voicemail' && (
            <div className="flex-1 glass overflow-hidden animate-fade-in-up">
              <EmailView
                email={selectedEmail}
                onBack={() => setSelectedEmailId(null)}
                onDelete={handleDelete}
                onToggleStar={handleToggleStar}
              />
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className={cn('flex-none glass border-l border-white/40 overflow-hidden transition-all duration-300', rightOpen ? 'w-48' : 'w-0')}>
          {rightOpen && (
            <RightSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              selectedTune={selectedTune}
              onTuneSelect={setSelectedTune}
            />
          )}
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {modal === 'compose' && <ComposeEmail onClose={() => setModal('none')} />}
      {modal === 'admin' && <AdminPanel onClose={() => setModal('none')} />}
      {modal === 'accounts' && <AccountsPage onClose={() => setModal('none')} />}
      {modal === 'passwords' && <PasswordManager onClose={() => setModal('none')} />}
    </div>
  );
}

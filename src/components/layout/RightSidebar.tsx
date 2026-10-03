import { useState } from 'react';
import { Bell, Sliders, User, Globe, Clock, Shield } from 'lucide-react';
import { notificationTunes, playTune } from '@/lib/notificationTunes';
import { FilterSettings } from '@/types/email';
import { cn } from '@/lib/utils';

interface Props {
  filters: FilterSettings;
  onFilterChange: (key: keyof FilterSettings, value: number) => void;
  selectedTune: string;
  onTuneSelect: (id: string) => void;
}

type RightTab = 'tunes' | 'filters' | 'account' | 'quick';

const filterDefs: { key: keyof FilterSettings; label: string; min: number; max: number; default: number }[] = [
  { key: 'brightness', label: 'Brightness', min: 50, max: 200, default: 100 },
  { key: 'contrast', label: 'Contrast', min: 50, max: 200, default: 100 },
  { key: 'saturation', label: 'Saturation', min: 0, max: 300, default: 100 },
  { key: 'blur', label: 'Blur', min: 0, max: 20, default: 0 },
  { key: 'opacity', label: 'Opacity', min: 20, max: 100, default: 100 },
  { key: 'hue', label: 'Hue Rotate', min: 0, max: 360, default: 0 },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100, default: 0 },
  { key: 'invert', label: 'Invert', min: 0, max: 100, default: 0 },
  { key: 'warmth', label: 'Warmth', min: 0, max: 100, default: 0 },
  { key: 'coolness', label: 'Coolness', min: 0, max: 100, default: 0 },
  { key: 'glow', label: 'Glow', min: 0, max: 100, default: 20 },
  { key: 'sparkle', label: 'Sparkle', min: 0, max: 100, default: 15 },
  { key: 'vignette', label: 'Vignette', min: 0, max: 100, default: 0 },
  { key: 'sharpness', label: 'Sharpness', min: 0, max: 100, default: 50 },
  { key: 'grain', label: 'Grain', min: 0, max: 100, default: 0 },
  { key: 'bloom', label: 'Bloom', min: 0, max: 100, default: 10 },
  { key: 'fade', label: 'Fade', min: 0, max: 100, default: 0 },
  { key: 'clarity', label: 'Clarity', min: 0, max: 100, default: 60 },
  { key: 'vibrance', label: 'Vibrance', min: 0, max: 100, default: 30 },
  { key: 'tint', label: 'Tint', min: -100, max: 100, default: 0 },
  { key: 'exposure', label: 'Exposure', min: -100, max: 100, default: 0 },
  { key: 'gamma', label: 'Gamma', min: 50, max: 200, default: 100 },
  { key: 'shadows', label: 'Shadows', min: -100, max: 100, default: 0 },
  { key: 'highlights', label: 'Highlights', min: -100, max: 100, default: 0 },
  { key: 'midtones', label: 'Midtones', min: -100, max: 100, default: 0 },
  { key: 'redChannel', label: 'Red', min: 0, max: 200, default: 100 },
  { key: 'greenChannel', label: 'Green', min: 0, max: 200, default: 100 },
  { key: 'blueChannel', label: 'Blue', min: 0, max: 200, default: 100 },
  { key: 'crystallize', label: 'Crystallize', min: 0, max: 100, default: 0 },
  { key: 'glitch', label: 'Glitch', min: 0, max: 100, default: 0 },
  { key: 'neon', label: 'Neon', min: 0, max: 100, default: 0 },
];

const tabs: { id: RightTab; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string }[] = [
  { id: 'tunes', icon: Bell, label: 'Tunes' },
  { id: 'filters', icon: Sliders, label: 'Filters' },
  { id: 'account', icon: User, label: 'Account' },
  { id: 'quick', icon: Globe, label: 'Quick' },
];

const tuneCategories = ['All', 'Bell', 'Nature', 'Digital', 'Calm'];

export default function RightSidebar({ filters, onFilterChange, selectedTune, onTuneSelect }: Props) {
  const [activeTab, setActiveTab] = useState<RightTab>('tunes');
  const [tuneCat, setTuneCat] = useState('All');

  const filteredTunes = tuneCat === 'All' ? notificationTunes : notificationTunes.filter(t => t.category === tuneCat);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-blue-100/60 bg-white/40 flex-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 py-2 text-[9px] font-semibold transition-all',
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50/60'
                : 'text-gray-500 hover:text-blue-500'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" strokeWidth={2} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {/* Tunes panel */}
        {activeTab === 'tunes' && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
              <Bell className="w-3 h-3" /> Notification Tunes ({notificationTunes.length})
            </div>
            {/* Category filter */}
            <div className="flex flex-wrap gap-1 mb-2">
              {tuneCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setTuneCat(cat)}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[9px] font-semibold border transition-colors',
                    tuneCat === cat
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            {filteredTunes.map(tune => (
              <button
                key={tune.id}
                onClick={() => { onTuneSelect(tune.id); playTune(tune); }}
                className={cn(
                  'w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all text-xs border',
                  selectedTune === tune.id
                    ? 'bg-blue-100 border-blue-400 text-blue-700 shadow-sm'
                    : 'border-blue-50 hover:bg-blue-50/50 text-gray-700 hover:border-blue-200'
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center flex-none text-[9px] font-bold',
                  selectedTune === tune.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                )}>
                  ♪
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[11px] truncate">{tune.name}</div>
                  <div className="text-[9px] text-gray-400">{tune.category}</div>
                </div>
                {selectedTune === tune.id && <div className="notif-dot flex-none" />}
              </button>
            ))}
          </div>
        )}

        {/* Filters panel */}
        {activeTab === 'filters' && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
              <Sliders className="w-3 h-3" /> Visual Filters ({filterDefs.length} Properties)
            </div>
            {filterDefs.map(f => (
              <div key={f.key} className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-medium text-gray-600">{f.label}</span>
                  <span className="text-[10px] font-bold text-blue-600 min-w-[28px] text-right">
                    {filters[f.key]}
                  </span>
                </div>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  value={filters[f.key]}
                  onChange={e => onFilterChange(f.key, Number(e.target.value))}
                  className="w-full h-1.5 rounded-full accent-blue-600 cursor-pointer"
                />
              </div>
            ))}
            <button
              onClick={() => filterDefs.forEach(f => onFilterChange(f.key, f.default))}
              className="w-full mt-2 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Account panel */}
        {activeTab === 'account' && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
              <User className="w-3 h-3" /> Account Info
            </div>
            <div className="glass rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">IQ</div>
                <div>
                  <div className="text-xs font-bold text-blue-800">IQMAIL Admin</div>
                  <div className="text-[10px] text-blue-500">admin@iqmail.online</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[
                  ['Role', 'Admin'],
                  ['Domain', 'iqmail.online'],
                  ['Status', '🟢 Active'],
                  ['Plan', 'Enterprise'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-blue-50/70 rounded-lg px-2 py-1.5">
                    <div className="text-[9px] text-gray-400">{k}</div>
                    <div className="text-[10px] font-semibold text-blue-700">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-[10px] font-semibold text-gray-600 mb-2 flex items-center gap-1"><Shield className="w-3 h-3 text-green-500" /> Security</div>
              {[
                ['2FA', 'Enabled'],
                ['Last Login', 'Today, 9:30 AM'],
                ['Sessions', '2 Active'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-blue-50 last:border-0">
                  <span className="text-[10px] text-gray-500">{k}</span>
                  <span className="text-[10px] font-semibold text-blue-700">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick access panel */}
        {activeTab === 'quick' && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Quick Access
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-[10px] font-semibold text-gray-500 mb-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Recent</div>
              {['john@iqmail.online', 'sarah@iqmail.online', 'team@cloudflare.com'].map(email => (
                <div key={email} className="text-[10px] text-blue-600 py-1 border-b border-blue-50 last:border-0 truncate hover:text-blue-800 cursor-pointer transition-colors">
                  {email}
                </div>
              ))}
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-[10px] font-semibold text-gray-500 mb-2">Domain Stats</div>
              {[
                ['Total Accounts', '247'],
                ['Active Today', '89'],
                ['Emails Sent', '1,204'],
                ['Received', '3,891'],
                ['Blocked Spam', '432'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-blue-50 last:border-0">
                  <span className="text-[10px] text-gray-500">{k}</span>
                  <span className="text-[10px] font-bold text-blue-600">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Star, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  emails: any[];
  selectedId: string | null;
  onSelect: (email: any) => void;
  onToggleStar: (id: string) => void;
  folder: string;
  loading?: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function EmailList({ emails, selectedId, onSelect, onToggleStar, folder, loading }: Props) {
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin" />
        <div className="text-sm">Loading emails...</div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 select-none">
        <div className="text-5xl mb-3 opacity-30">📭</div>
        <div className="text-sm font-medium">No emails in {folder}</div>
        <div className="text-xs mt-1 opacity-60">Enjoy the peace!</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {emails.map(email => (
        <div
          key={email.id}
          onClick={() => onSelect(email)}
          className={cn(
            'email-item flex items-start gap-3 px-3 py-3 cursor-pointer border-b border-blue-50/70',
            !email.is_read && 'unread bg-blue-50/30',
            selectedId === email.id && 'bg-blue-100/60 border-l-2 border-l-blue-500'
          )}
        >
          {/* Avatar */}
          <div className="flex-none w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold mt-0.5">
            {(email.from_name || email.from_address || '?').charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className={cn('text-xs truncate', !email.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700')}>
                {email.from_name || email.from_address}
              </span>
              <span className="text-[10px] text-gray-400 flex-none">
                {timeAgo(email.received_at || email.created_at)}
              </span>
            </div>
            <div className={cn('text-[11px] truncate mb-0.5', !email.is_read ? 'font-semibold text-gray-800' : 'text-gray-600')}>
              {email.subject || '(no subject)'}
            </div>
            <div className="text-[10px] text-gray-400 truncate leading-tight">
              {(email.body_text || '').slice(0, 80)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-1 flex-none">
            <button
              onClick={e => { e.stopPropagation(); onToggleStar(email.id); }}
              className="p-0.5 rounded hover:bg-yellow-50 transition-colors"
            >
              <Star
                className={cn('w-3.5 h-3.5', email.is_starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400')}
                strokeWidth={2}
              />
            </button>
            {email.has_attachments && (
              <Paperclip className="w-3 h-3 text-gray-300" strokeWidth={2} />
            )}
            {!email.is_read && <div className="notif-dot" />}
          </div>
        </div>
      ))}
    </div>
  );
}

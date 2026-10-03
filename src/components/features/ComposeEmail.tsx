import { useState } from 'react';
import { X, Send, Paperclip, Minimize2, AtSign } from 'lucide-react';
import { toast } from 'sonner';
import { useSendEmail } from '@/hooks/useEmailData';
import { useEmailAccounts } from '@/hooks/useEmailData';

interface Props {
  onClose: () => void;
  defaultTo?: string;
  defaultSubject?: string;
  defaultBody?: string;
}

export default function ComposeEmail({ onClose, defaultTo = '', defaultSubject = '', defaultBody = '' }: Props) {
  const [to, setTo] = useState(defaultTo);
  const [cc, setCC] = useState('');
  const [bcc, setBCC] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [showCC, setShowCC] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [fromAccount, setFromAccount] = useState('');

  const sendEmail = useSendEmail();
  const accounts = useEmailAccounts();
  const primaryAccount = accounts.data?.find(a => a.is_primary) || accounts.data?.[0];

  async function handleSend() {
    if (!to.trim()) { toast.error('Please enter recipient address'); return; }
    if (!subject.trim()) { toast.error('Subject is required'); return; }
    if (!body.trim()) { toast.error('Message body cannot be empty'); return; }
    try {
      await sendEmail.mutateAsync({
        to: to.trim(),
        cc: cc.trim() || undefined,
        bcc: bcc.trim() || undefined,
        subject: subject.trim(),
        text: body,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;white-space:pre-wrap;">${body}</div>`,
        from_address: fromAccount || primaryAccount?.address,
      });
      toast.success('Email sent via Resend ✅');
      onClose();
    } catch (e: any) {
      toast.error(e.message || 'Send failed');
    }
  }

  if (minimized) {
    return (
      <div onClick={() => setMinimized(false)}
        className="fixed bottom-12 right-6 z-50 glass rounded-t-xl px-4 py-2 flex items-center gap-3 cursor-pointer shadow-lg border border-blue-200/50 hover:bg-blue-50/60 transition-colors">
        <span className="text-sm font-semibold text-blue-700 truncate max-w-[180px]">{subject || 'New Message'}</span>
        <Minimize2 className="w-3.5 h-3.5 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-12 right-6 z-50 w-[480px] max-w-[95vw] glass rounded-2xl shadow-2xl border border-blue-200/50 animate-fade-in-up overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-cyan-600 px-4 py-3 flex items-center gap-2">
        <span className="flex-1 text-white font-semibold text-sm">New Message</span>
        <span className="text-xs text-blue-200 flex items-center gap-1">
          <AtSign className="w-3 h-3" /> via Resend
        </span>
        <button onClick={() => setMinimized(true)} className="p-1 rounded hover:bg-white/20 transition-colors">
          <Minimize2 className="w-3.5 h-3.5 text-white" strokeWidth={2} />
        </button>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/20 transition-colors">
          <X className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-4 space-y-2">
        {/* From selector */}
        {accounts.data && accounts.data.length > 0 && (
          <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
            <span className="text-xs font-medium text-gray-500 w-14 flex-none">From</span>
            <select
              value={fromAccount || primaryAccount?.address || ''}
              onChange={e => setFromAccount(e.target.value)}
              className="flex-1 text-sm text-blue-700 font-medium bg-transparent focus:outline-none"
            >
              {accounts.data.map(a => (
                <option key={a.id} value={a.address}>{a.address}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
          <span className="text-xs font-medium text-gray-500 w-14 flex-none">To</span>
          <input value={to} onChange={e => setTo(e.target.value)}
            placeholder="recipient@email.com"
            className="flex-1 text-sm text-gray-800 bg-transparent focus:outline-none placeholder-gray-300" />
          <button onClick={() => setShowCC(c => !c)} className="text-[10px] text-blue-500 font-semibold hover:underline">CC/BCC</button>
        </div>

        {showCC && (
          <>
            {[
              { label: 'CC', val: cc, set: setCC },
              { label: 'BCC', val: bcc, set: setBCC },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-2 border-b border-blue-100 pb-2">
                <span className="text-xs font-medium text-gray-500 w-14 flex-none">{f.label}</span>
                <input value={f.val} onChange={e => f.set(e.target.value)}
                  placeholder={`${f.label.toLowerCase()}@email.com`}
                  className="flex-1 text-sm text-gray-800 bg-transparent focus:outline-none placeholder-gray-300" />
              </div>
            ))}
          </>
        )}

        <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
          <span className="text-xs font-medium text-gray-500 w-14 flex-none">Subject</span>
          <input value={subject} onChange={e => setSubject(e.target.value)}
            placeholder="Email subject..."
            className="flex-1 text-sm text-gray-800 bg-transparent focus:outline-none placeholder-gray-300" />
        </div>

        <textarea value={body} onChange={e => setBody(e.target.value)}
          placeholder="Write your message..."
          rows={8}
          className="w-full text-sm text-gray-800 bg-transparent focus:outline-none placeholder-gray-300 resize-none" />

        <div className="text-xs text-gray-400 border-t border-blue-50 pt-2 italic">
          — Sent via IQMAIL | {primaryAccount?.address || 'iqmail.online'}
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center gap-2">
        <button onClick={handleSend} disabled={sendEmail.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow-lg hover:shadow-blue-300/40 transition-all disabled:opacity-60">
          <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
          {sendEmail.isPending ? 'Sending...' : 'Send'}
        </button>
        <button className="p-2 rounded-xl hover:bg-blue-50 transition-colors text-gray-500">
          <Paperclip className="w-4 h-4" strokeWidth={2} />
        </button>
        <div className="flex-1" />
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-red-50 transition-colors text-red-400">
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

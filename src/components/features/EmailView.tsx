import { useState } from 'react';
import {
  ArrowLeft, Reply, Forward, Trash2, Star,
  MoreHorizontal, Send, X, Paperclip, AtSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSendEmail } from '@/hooks/useEmailData';

interface Props {
  email: any;
  onBack: () => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export default function EmailView({ email, onBack, onDelete, onToggleStar }: Props) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [forwardTo, setForwardTo] = useState('');
  const [forwardCC, setForwardCC] = useState('');

  const sendEmail = useSendEmail();

  async function sendReply() {
    if (!replyText.trim()) { toast.error('Please enter reply text'); return; }
    try {
      await sendEmail.mutateAsync({
        to: email.from_address,
        subject: email.subject?.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
        text: replyText,
        html: `<div style="font-family:Arial,sans-serif;white-space:pre-wrap;">${replyText}</div><br/><hr/><p style="color:#666;font-size:12px;">On ${new Date(email.received_at).toLocaleString()}, ${email.from_name} wrote:<br/>${email.body_text || ''}</p>`,
      });
      setReplyOpen(false);
      setReplyText('');
      toast.success('Reply sent via Resend ✅');
    } catch (e: any) { toast.error(e.message || 'Send failed'); }
  }

  async function sendForward() {
    if (!forwardTo.trim()) { toast.error('Please enter forward address'); return; }
    try {
      await sendEmail.mutateAsync({
        to: forwardTo.trim(),
        cc: forwardCC.trim() || undefined,
        subject: email.subject?.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
        text: `---------- Forwarded Message ----------\nFrom: ${email.from_address}\nSubject: ${email.subject}\n\n${email.body_text || ''}`,
        html: `<p>---------- Forwarded Message ----------</p><p>From: ${email.from_address}<br/>Subject: ${email.subject}</p><hr/>${email.body_html || email.body_text || ''}`,
      });
      setForwardOpen(false);
      setForwardTo('');
      setForwardCC('');
      toast.success('Email forwarded ✅');
    } catch (e: any) { toast.error(e.message || 'Forward failed'); }
  }

  const displayBody = email.body_html
    ? null
    : email.body_text || '(no content)';

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-blue-100/60 bg-white/30 flex-none">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors">
          <ArrowLeft className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
        </button>
        <div className="flex-1 font-semibold text-gray-800 text-sm truncate">{email.subject || '(no subject)'}</div>
        <div className="flex items-center gap-1">
          {[
            { icon: Reply, title: 'Reply', color: 'text-blue-600', onClick: () => { setReplyOpen(true); setForwardOpen(false); } },
            { icon: Forward, title: 'Forward', color: 'text-green-600', onClick: () => { setForwardOpen(true); setReplyOpen(false); } },
          ].map(btn => (
            <button key={btn.title} onClick={btn.onClick} title={btn.title}
              className={`p-1.5 rounded-lg hover:bg-blue-50 transition-colors ${btn.color}`}>
              <btn.icon className="w-4 h-4" strokeWidth={2} />
            </button>
          ))}
          <button onClick={() => onToggleStar(email.id)} title="Star"
            className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors">
            <Star className={cn('w-4 h-4', email.is_starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400')} strokeWidth={2} />
          </button>
          <button onClick={() => onDelete(email.id)} title="Delete"
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-500">
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
            <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Sender card */}
        <div className="glass rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-none">
              {(email.from_name || email.from_address || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-semibold text-gray-900 text-sm">{email.from_name || email.from_address}</span>
                <span className="text-xs text-gray-400">
                  {new Date(email.received_at || email.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <div className="text-xs text-blue-500 mt-0.5">&lt;{email.from_address}&gt;</div>
              <div className="text-xs text-gray-400 mt-0.5">To: {email.to_address}</div>
              {email.cc_address && <div className="text-xs text-gray-400">CC: {email.cc_address}</div>}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="glass rounded-xl p-4 mb-4">
          {email.body_html ? (
            <div
              className="text-sm text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: email.body_html }}
            />
          ) : (
            <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-[Inter]">
              {displayBody}
            </div>
          )}
        </div>

        {/* Reply panel */}
        {replyOpen && (
          <div className="glass rounded-xl p-4 mb-4 animate-fade-in-up border border-blue-200/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <Reply className="w-4 h-4" strokeWidth={2.5} />
                Reply to {email.from_name || email.from_address}
              </div>
              <button onClick={() => setReplyOpen(false)} className="p-1 rounded hover:bg-red-50 transition-colors">
                <X className="w-4 h-4 text-gray-400" strokeWidth={2} />
              </button>
            </div>
            <div className="text-xs text-gray-400 mb-2 bg-blue-50/50 rounded px-2 py-1">
              To: {email.from_address} · Via Resend API
            </div>
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
              placeholder="Write your reply..." rows={5}
              className="w-full text-sm text-gray-800 p-3 rounded-lg border border-blue-100 bg-white/70 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
            <div className="flex items-center gap-2 mt-3">
              <button onClick={sendReply} disabled={sendEmail.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow hover:shadow-blue-300/40 transition-all disabled:opacity-60">
                <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
                {sendEmail.isPending ? 'Sending...' : 'Send Reply'}
              </button>
              <button className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-500">
                <Paperclip className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* Forward panel */}
        {forwardOpen && (
          <div className="glass rounded-xl p-4 mb-4 animate-fade-in-up border border-green-200/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                <Forward className="w-4 h-4" strokeWidth={2.5} />
                Forward / Send To
              </div>
              <button onClick={() => setForwardOpen(false)} className="p-1 rounded hover:bg-red-50 transition-colors">
                <X className="w-4 h-4 text-gray-400" strokeWidth={2} />
              </button>
            </div>
            <div className="space-y-2 mb-3">
              {[
                { label: 'To', val: forwardTo, set: setForwardTo, placeholder: 'recipient@email.com' },
                { label: 'CC', val: forwardCC, set: setForwardCC, placeholder: 'cc@email.com (optional)' },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-2 border border-blue-100 rounded-lg bg-white/70 px-3 py-2">
                  <AtSign className="w-3.5 h-3.5 text-blue-400 flex-none" strokeWidth={2} />
                  <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                    className="flex-1 text-sm text-gray-800 bg-transparent focus:outline-none placeholder-gray-400" />
                </div>
              ))}
            </div>
            <div className="bg-blue-50/60 rounded-lg p-3 mb-3 text-xs text-gray-500 leading-relaxed border border-blue-100/50">
              <div className="font-semibold text-blue-600 mb-1">--- Forwarded Message ---</div>
              <div><strong>From:</strong> {email.from_address}</div>
              <div><strong>Subject:</strong> {email.subject}</div>
              <div className="mt-1 truncate">{(email.body_text || '').slice(0, 120)}...</div>
            </div>
            <button onClick={sendForward} disabled={sendEmail.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-500 text-white text-sm font-semibold shadow transition-all disabled:opacity-60">
              <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
              {sendEmail.isPending ? 'Forwarding...' : 'Forward Email'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import DigitalClock from '@/components/features/DigitalClock';
import { Mail } from 'lucide-react';

const TOP_TICKER_TEXT = [
  '✦ بسم اللّٰہ الرحمٰن الرحیم ✦  In the name of Allah, the Most Gracious, the Most Merciful  ✦',
  '  IQMAIL — Enterprise Email Platform  ✦  Powered by Cloudflare + Resend  ✦',
  '  iqmail.online — Your Trusted Digital Mailbox  ✦  Secure • Fast • Reliable  ✦',
  '  الرحمٰن الرحیم ✦  اللّٰہ کے نام سے ✦  جو بڑا مہربان اور رحم والا ہے  ✦',
  '  © 2026 IQMAIL — All Rights Reserved  ✦  Worldwide Email Services  ✦',
].join('     ');

export default function Header() {
  return (
    <header className="flex-none z-40">
      {/* Bismillah ticker strip */}
      <div className="bismillah-strip w-full overflow-hidden py-1.5 border-b border-blue-400/30 relative">
        {/* Glowing border line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        <div className="ticker-strip">
          <span className="ticker-content text-white text-xs font-medium tracking-wider font-urdu">
            {TOP_TICKER_TEXT}&nbsp;&nbsp;&nbsp;{TOP_TICKER_TEXT}
          </span>
        </div>
      </div>

      {/* Main header bar */}
      <div className="glass border-b border-white/50 px-3 py-2 flex items-center gap-3 relative">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <Mail className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white animate-pulse" />
          </div>
          <div>
            <div className="font-digital text-glow-cyan text-lg leading-none tracking-widest">IQ<span className="text-blue-700">MAIL</span></div>
            <div className="text-[9px] text-blue-500 tracking-widest font-medium">@iqmail.online</div>
          </div>
        </div>

        {/* Center: Bismillah text */}
        <div className="flex-1 text-center">
          <div className="font-urdu text-base text-blue-900 leading-relaxed font-semibold">
            بسم اللّٰہ الرحمٰن الرحیم
          </div>
          <div className="text-[10px] text-blue-600 tracking-wide italic">
            In the name of Allah, the Most Gracious, the Most Merciful
          </div>
        </div>

        {/* Right: Clock */}
        <div className="flex items-center gap-3">
          <DigitalClock />
        </div>
      </div>
    </header>
  );
}

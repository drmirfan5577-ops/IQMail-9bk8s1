const BOTTOM_TICKER = [
  '🌐 iqmail.online — Enterprise Email Services  ✦',
  '  📧 Cloudflare Routing + Resend API  ✦',
  '  🔒 256-bit SSL Encryption  ✦',
  '  ✅ GDPR Compliant  ✦',
  '  🌍 Serving 190+ Countries  ✦',
  '  ☪ Halal Digital Services  ✦',
  '  📱 PWA Enabled — Works Offline  ✦',
  '  🚀 Wildcard Subdomains  ✦  Auto Routing  ✦',
  '  © 2026 IQMAIL All Rights Reserved  ✦',
  '  Version 1.0.0 Enterprise  ✦',
  '  support@iqmail.online  ✦',
].join('     ');

export default function Footer() {
  return (
    <footer className="flex-none z-40">
      {/* Bottom ticker strip */}
      <div className="bottom-ticker-strip w-full overflow-hidden py-1.5 border-t border-blue-500/30 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
        <div className="ticker-strip">
          <span
            className="ticker-content text-cyan-200 text-[10px] tracking-wider"
            style={{ animationDuration: '50s', animationDirection: 'reverse' }}
          >
            {BOTTOM_TICKER}&nbsp;&nbsp;&nbsp;{BOTTOM_TICKER}
          </span>
        </div>
      </div>

      {/* Footer bar */}
      <div className="glass border-t border-white/40 px-4 py-1.5 flex items-center justify-between">
        <div className="text-[10px] text-blue-600 opacity-80">
          © 2026 <strong>IQMAIL</strong> — Enterprise Email Platform | iqmail.online
        </div>
        <div className="flex items-center gap-3 text-[10px] text-blue-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
            All Systems Operational
          </span>
          <span>•</span>
          <span>v1.0.0</span>
          <span>•</span>
          <span>PWA Ready</span>
        </div>
      </div>
    </footer>
  );
}

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Legal() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back to IQMAIL
        </button>

        <div className="glass rounded-2xl p-8 space-y-8 border border-blue-200/40 shadow-xl">
          <div className="text-center border-b border-blue-100 pb-6">
            <div className="font-digital text-3xl gradient-text-blue mb-1">IQMAIL</div>
            <div className="font-urdu text-lg text-blue-800">بسم اللّٰہ الرحمٰن الرحیم</div>
            <div className="text-xs text-blue-500 italic">In the name of Allah, the Most Gracious, the Most Merciful</div>
            <div className="text-sm text-gray-500 mt-2">Legal Information & Policies — Last Updated: September 2026</div>
          </div>

          {[
            {
              title: '📋 Terms of Service',
              content: `By using IQMAIL services, you agree to these terms. IQMAIL provides email hosting, routing, and communication services via iqmail.online domain. Users must be 13+ years of age. Accounts are non-transferable. We reserve the right to suspend accounts that violate our policies.`
            },
            {
              title: '🔒 Privacy Policy',
              content: `IQMAIL collects only necessary data to provide email services. We do not sell, share, or monetize your personal data or email content. All data is encrypted in transit and at rest using industry-standard AES-256 encryption. You retain full ownership of your data. We comply with GDPR, CCPA, and applicable data protection laws.`
            },
            {
              title: '🌐 Community Guidelines',
              content: `IQMAIL is a professional communication platform. Users must not use IQMAIL for spam, phishing, harassment, illegal activities, or content that violates Islamic values or general ethical standards. We maintain a zero-tolerance policy for abuse. Violations result in immediate account suspension.`
            },
            {
              title: '⚠️ Disclaimer',
              content: `IQMAIL services are provided "as is" without warranty of any kind. While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. IQMAIL is not liable for any loss of data, business interruption, or indirect damages arising from use of our services. Email delivery depends on third-party providers (Cloudflare, Resend).`
            },
            {
              title: '©️ Copyright',
              content: `All content, design, code, and intellectual property of IQMAIL is © 2026 IQMAIL. All rights reserved. Unauthorized reproduction, distribution, or use of IQMAIL's intellectual property is strictly prohibited. IQMAIL™ is a registered trademark.`
            },
            {
              title: '🎯 Vision & Mission',
              content: `Vision: To provide the Muslim world and beyond with a dignified, secure, and reliable email communication platform built on Islamic values of trust, honesty, and service.\n\nMission: Delivering enterprise-grade email infrastructure to individuals and businesses worldwide through iqmail.online, powered by cutting-edge technology and guided by ethical principles.`
            },
            {
              title: 'ℹ️ About IQMAIL',
              content: `IQMAIL (iqmail.online) is a Pakistan-based email service provider offering custom domain email addresses, enterprise routing via Cloudflare, and reliable email delivery through Resend API. Founded in 2026, IQMAIL serves users across 190+ countries with a focus on security, privacy, and professional communication.`
            },
          ].map(section => (
            <div key={section.title} className="space-y-2">
              <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}

          <div className="border-t border-blue-100 pt-6 text-center">
            <div className="text-xs text-gray-500">
              For legal inquiries: <a href="mailto:legal@iqmail.online" className="text-blue-600 font-semibold">legal@iqmail.online</a>
              <span className="mx-3">|</span>
              Support: <a href="mailto:support@iqmail.online" className="text-blue-600 font-semibold">support@iqmail.online</a>
            </div>
            <div className="text-xs text-gray-400 mt-2">© 2026 IQMAIL — iqmail.online | All Rights Reserved</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Email, VoiceMailEntry } from '@/types/email';

export const mockEmails: Email[] = [
  {
    id: '1',
    from: 'team@cloudflare.com',
    fromName: 'Cloudflare Team',
    to: 'admin@iqmail.online',
    subject: 'Your Email Routing is Active ✅',
    body: `Dear IQMAIL Administrator,

Your Cloudflare Email Routing has been successfully configured for iqmail.online.

All incoming emails to your domain will now be routed according to your rules.

Key Details:
• Domain: iqmail.online
• Status: Active & Verified
• Routing Rules: 5 Active
• Wildcard: Enabled

Your email infrastructure is now live and processing messages worldwide.

Best regards,
Cloudflare Email Routing Team`,
    date: '2026-09-23T09:30:00Z',
    read: false,
    starred: true,
    folder: 'inbox',
  },
  {
    id: '2',
    from: 'support@resend.com',
    fromName: 'Resend Support',
    to: 'admin@iqmail.online',
    subject: 'Resend API Key Verified - Ready to Send',
    body: `Hello,

Your Resend integration is now active and verified.

Configuration:
• API Status: Active
• Domain: iqmail.online
• Daily Limit: 100 emails (free tier)
• DKIM: Configured

You can now send emails programmatically through your IQMAIL application.

Support Team
Resend`,
    date: '2026-09-23T08:15:00Z',
    read: false,
    starred: false,
    folder: 'inbox',
  },
  {
    id: '3',
    from: 'no-reply@github.com',
    fromName: 'GitHub',
    to: 'dev@iqmail.online',
    subject: 'New repository activity on IQMAIL',
    body: `You have new activity on your IQMAIL repository.

3 new pull requests are waiting for your review.
12 issues have been updated.

View your repository dashboard for full details.

GitHub Team`,
    date: '2026-09-22T14:45:00Z',
    read: true,
    starred: false,
    folder: 'inbox',
  },
  {
    id: '4',
    from: 'billing@vercel.com',
    fromName: 'Vercel Billing',
    to: 'finance@iqmail.online',
    subject: 'Invoice #INV-2026-0923 - IQMAIL Platform',
    body: `Invoice Details:

Invoice Number: INV-2026-0923
Date: September 23, 2026
Due: October 23, 2026

Services:
• Pro Plan - $20.00/month
• Bandwidth Overage - $2.50
• Edge Functions - $0.00

Total Due: $22.50 USD

Thank you for your business.`,
    date: '2026-09-22T10:00:00Z',
    read: true,
    starred: true,
    folder: 'inbox',
  },
  {
    id: '5',
    from: 'security@google.com',
    fromName: 'Google Security',
    to: 'security@iqmail.online',
    subject: 'Security Alert: New sign-in detected',
    body: `A new sign-in was detected on your account.

Time: September 22, 2026, 6:30 AM
Location: Karachi, Pakistan
Device: Chrome on Windows

If this was you, no action is needed.
If you don't recognize this activity, secure your account immediately.

Google Security Team`,
    date: '2026-09-22T06:30:00Z',
    read: true,
    starred: false,
    folder: 'inbox',
  },
  {
    id: '6',
    from: 'newsletter@producthunt.com',
    fromName: 'Product Hunt',
    to: 'info@iqmail.online',
    subject: "Today's Top Products - September 22",
    body: `Today's trending products on Product Hunt:

1. AI Email Assistant Pro - #1 Product of the Day
2. CloudMail Enterprise - #2
3. VoiceDrop - Voice messaging platform
4. FilterMaster Pro - Photo editing suite

Check out all trending products at producthunt.com`,
    date: '2026-09-22T05:00:00Z',
    read: false,
    starred: false,
    folder: 'inbox',
  },
  {
    id: '7',
    from: 'admin@iqmail.online',
    fromName: 'IQMAIL Admin',
    to: 'team@iqmail.online',
    subject: 'Platform Launch Announcement',
    body: `Dear Team,

I am pleased to announce the official launch of IQMAIL platform.

Our email service is now live and accepting new registrations worldwide.

Key Features Active:
• Custom domain emails @iqmail.online
• Cloudflare routing integration
• Resend API for outbound
• Voice mail system
• PWA mobile support

Please test all features and report any issues.

Best regards,
IQMAIL Administration`,
    date: '2026-09-21T12:00:00Z',
    read: true,
    starred: true,
    folder: 'sent',
  },
  {
    id: '8',
    from: 'spam@unknown.xyz',
    fromName: 'Unknown Sender',
    to: 'info@iqmail.online',
    subject: 'You have won $1,000,000!!!',
    body: `Congratulations! You have been selected...`,
    date: '2026-09-20T00:00:00Z',
    read: false,
    starred: false,
    folder: 'spam',
  },
];

export const mockVoiceMails: VoiceMailEntry[] = [
  {
    id: 'vm1',
    from: '+92-300-1234567',
    fromName: 'Ahmed Khan',
    duration: '1:23',
    date: '2026-09-23T11:00:00Z',
    transcription: "Assalamu Alaikum, I wanted to discuss the new IQMAIL features with you. Please call me back when you get a chance.",
    listened: false,
  },
  {
    id: 'vm2',
    from: '+92-321-9876543',
    fromName: 'Sara Malik',
    duration: '0:45',
    date: '2026-09-23T09:15:00Z',
    transcription: "Hi, just confirming our meeting tomorrow at 3 PM. Looking forward to it!",
    listened: true,
  },
  {
    id: 'vm3',
    from: '+1-555-0123',
    fromName: 'John Smith',
    duration: '2:10',
    date: '2026-09-22T16:30:00Z',
    transcription: "Hello, this is John from the technical team. We have completed the server migration. Everything is running smoothly now.",
    listened: false,
  },
];

export const mockUser = {
  id: 'usr_001',
  name: 'IQMAIL Admin',
  email: 'admin@iqmail.online',
  domain: 'iqmail.online',
  role: 'admin' as const,
  avatar: '',
};

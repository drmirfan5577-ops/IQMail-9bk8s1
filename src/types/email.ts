export interface Email {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'voicemail';
  attachments?: Attachment[];
  cc?: string;
  bcc?: string;
  replyTo?: string;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface VoiceMailEntry {
  id: string;
  from: string;
  fromName: string;
  duration: string;
  date: string;
  transcription?: string;
  listened: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  domain: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface NotificationTune {
  id: string;
  name: string;
  category: string;
  frequency: number;
  duration: number;
  waveType: OscillatorType;
}

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  opacity: number;
  hue: number;
  sepia: number;
  invert: number;
  warmth: number;
  coolness: number;
  glow: number;
  sparkle: number;
  vignette: number;
  sharpness: number;
  grain: number;
  bloom: number;
  fade: number;
  clarity: number;
  vibrance: number;
  tint: number;
  exposure: number;
  gamma: number;
  shadows: number;
  highlights: number;
  midtones: number;
  redChannel: number;
  greenChannel: number;
  blueChannel: number;
  crystallize: number;
  glitch: number;
  neon: number;
}

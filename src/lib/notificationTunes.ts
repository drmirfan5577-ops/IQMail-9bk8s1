import { NotificationTune } from '@/types/email';

export const notificationTunes: NotificationTune[] = [
  { id: 't01', name: 'Crystal Bell', category: 'Bell', frequency: 880, duration: 0.8, waveType: 'sine' },
  { id: 't02', name: 'Soft Chime', category: 'Bell', frequency: 659, duration: 1.0, waveType: 'sine' },
  { id: 't03', name: 'Morning Dew', category: 'Nature', frequency: 523, duration: 0.6, waveType: 'sine' },
  { id: 't04', name: 'Digital Ping', category: 'Digital', frequency: 1047, duration: 0.3, waveType: 'square' },
  { id: 't05', name: 'Gentle Knock', category: 'Calm', frequency: 440, duration: 0.5, waveType: 'triangle' },
  { id: 't06', name: 'Water Drop', category: 'Nature', frequency: 784, duration: 0.7, waveType: 'sine' },
  { id: 't07', name: 'Wind Chime', category: 'Nature', frequency: 698, duration: 1.2, waveType: 'sine' },
  { id: 't08', name: 'Tech Alert', category: 'Digital', frequency: 1175, duration: 0.4, waveType: 'square' },
  { id: 't09', name: 'Soft Ding', category: 'Bell', frequency: 587, duration: 0.9, waveType: 'sine' },
  { id: 't10', name: 'Ocean Wave', category: 'Nature', frequency: 349, duration: 1.5, waveType: 'sine' },
  { id: 't11', name: 'Cloud Bell', category: 'Bell', frequency: 932, duration: 0.8, waveType: 'sine' },
  { id: 't12', name: 'Pixel Pop', category: 'Digital', frequency: 1319, duration: 0.2, waveType: 'square' },
  { id: 't13', name: 'Meadow Breeze', category: 'Nature', frequency: 494, duration: 1.0, waveType: 'sine' },
  { id: 't14', name: 'Calm Alert', category: 'Calm', frequency: 392, duration: 0.7, waveType: 'triangle' },
  { id: 't15', name: 'Silver Bell', category: 'Bell', frequency: 1046, duration: 0.6, waveType: 'sine' },
  { id: 't16', name: 'Neon Buzz', category: 'Digital', frequency: 220, duration: 0.5, waveType: 'sawtooth' },
  { id: 't17', name: 'Raindrop', category: 'Nature', frequency: 622, duration: 0.8, waveType: 'sine' },
  { id: 't18', name: 'Zen Gong', category: 'Calm', frequency: 174, duration: 2.0, waveType: 'sine' },
  { id: 't19', name: 'Star Twinkle', category: 'Bell', frequency: 1568, duration: 0.4, waveType: 'sine' },
  { id: 't20', name: 'Soft Pulse', category: 'Calm', frequency: 330, duration: 0.6, waveType: 'triangle' },
  { id: 't21', name: 'Electric Tap', category: 'Digital', frequency: 880, duration: 0.3, waveType: 'square' },
  { id: 't22', name: 'Forest Echo', category: 'Nature', frequency: 415, duration: 1.3, waveType: 'sine' },
  { id: 't23', name: 'Moonlight', category: 'Calm', frequency: 277, duration: 1.8, waveType: 'sine' },
  { id: 't24', name: 'Quartz Chime', category: 'Bell', frequency: 740, duration: 0.9, waveType: 'sine' },
  { id: 't25', name: 'Byte Click', category: 'Digital', frequency: 1760, duration: 0.15, waveType: 'square' },
  { id: 't26', name: 'Petal Fall', category: 'Nature', frequency: 554, duration: 1.1, waveType: 'sine' },
  { id: 't27', name: 'Ice Crystal', category: 'Calm', frequency: 1174, duration: 0.7, waveType: 'sine' },
  { id: 't28', name: 'Jade Bell', category: 'Bell', frequency: 831, duration: 0.8, waveType: 'sine' },
  { id: 't29', name: 'Cyber Tone', category: 'Digital', frequency: 659, duration: 0.5, waveType: 'sawtooth' },
  { id: 't30', name: 'Lotus Bloom', category: 'Nature', frequency: 466, duration: 1.4, waveType: 'sine' },
  { id: 't31', name: 'Pure Tone', category: 'Calm', frequency: 528, duration: 1.0, waveType: 'sine' },
  { id: 't32', name: 'Diamond Ring', category: 'Bell', frequency: 1244, duration: 0.6, waveType: 'sine' },
];

export function playTune(tune: NotificationTune): void {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = tune.waveType;
  oscillator.frequency.setValueAtTime(tune.frequency, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + tune.duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + tune.duration);
}

import { useState } from 'react';
import { Phone, Play, Pause, Trash2, Download, Mic, MicOff } from 'lucide-react';
import { VoiceMailEntry } from '@/types/email';
import { mockVoiceMails } from '@/data/mockEmails';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function VoiceMailPanel() {
  const [voiceMails, setVoiceMails] = useState<VoiceMailEntry[]>(mockVoiceMails);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function togglePlay(id: string) {
    if (playingId === id) {
      setPlayingId(null);
      toast.info('Playback stopped');
    } else {
      setPlayingId(id);
      setVoiceMails(vms => vms.map(vm => vm.id === id ? { ...vm, listened: true } : vm));
      toast.success('Playing voice message...');
      setTimeout(() => setPlayingId(null), 3000);
    }
  }

  function deleteVM(id: string) {
    setVoiceMails(vms => vms.filter(vm => vm.id !== id));
    if (selectedId === id) setSelectedId(null);
    toast.success('Voice message deleted');
  }

  function toggleRecord() {
    if (recording) {
      setRecording(false);
      toast.success('Voice message recorded (mocked)');
    } else {
      setRecording(true);
      toast.info('Recording started...');
      setTimeout(() => setRecording(false), 5000);
    }
  }

  const selected = voiceMails.find(vm => vm.id === selectedId);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-blue-100/60 bg-white/30 flex items-center justify-between flex-none">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
          <span className="font-semibold text-gray-800 text-sm">Voice Mail</span>
          <span className="text-xs bg-purple-100 text-purple-600 rounded-full px-2 py-0.5 font-bold">
            {voiceMails.filter(v => !v.listened).length} new
          </span>
        </div>
        <button
          onClick={toggleRecord}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
            recording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          )}
        >
          {recording ? <MicOff className="w-3.5 h-3.5" strokeWidth={2.5} /> : <Mic className="w-3.5 h-3.5" strokeWidth={2.5} />}
          {recording ? 'Stop Recording' : 'Record'}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* List */}
        <div className="w-[200px] flex-none border-r border-blue-100/60 overflow-y-auto">
          {voiceMails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs gap-2">
              <Phone className="w-8 h-8 opacity-20" />
              <span>No voice mails</span>
            </div>
          ) : (
            voiceMails.map(vm => (
              <div
                key={vm.id}
                onClick={() => setSelectedId(vm.id)}
                className={cn(
                  'px-3 py-3 cursor-pointer border-b border-blue-50 transition-colors',
                  selectedId === vm.id ? 'bg-purple-50/80' : 'hover:bg-purple-50/40',
                  !vm.listened && 'border-l-2 border-l-purple-500'
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-none">
                    {vm.fromName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className={cn('text-xs truncate', !vm.listened ? 'font-bold text-gray-900' : 'font-medium text-gray-700')}>
                      {vm.fromName}
                    </div>
                    <div className="text-[10px] text-gray-400">{vm.duration}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="flex-1 overflow-y-auto">
          {selected ? (
            <div className="p-4 space-y-4 animate-fade-in-up">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {selected.fromName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{selected.fromName}</div>
                    <div className="text-xs text-gray-500">{selected.from}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(selected.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>

                {/* Playback */}
                <div className="flex items-center gap-3 bg-purple-50/60 rounded-xl p-3">
                  <button
                    onClick={() => togglePlay(selected.id)}
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all',
                      playingId === selected.id
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gradient-to-br from-purple-600 to-pink-500 hover:scale-105'
                    )}
                  >
                    {playingId === selected.id
                      ? <Pause className="w-4 h-4" strokeWidth={2.5} />
                      : <Play className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
                    }
                  </button>

                  <div className="flex-1">
                    <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-300', playingId === selected.id && 'animate-pulse')}
                        style={{ width: playingId === selected.id ? '65%' : '0%' }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-gray-400">Duration: {selected.duration}</span>
                      <span className="text-[10px] text-purple-500 font-semibold">
                        {selected.listened ? '✓ Listened' : '• New'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selected.transcription && (
                <div className="glass rounded-xl p-4">
                  <div className="text-xs font-semibold text-purple-600 mb-2 flex items-center gap-1">
                    📝 AI Transcription
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    "{selected.transcription}"
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => deleteVM(selected.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                  Delete
                </button>
                <button
                  onClick={() => toast.success('Download started (mocked)')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={2} />
                  Download
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 select-none">
              <Phone className="w-12 h-12 opacity-20 mb-3" />
              <div className="text-sm">Select a voice mail</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

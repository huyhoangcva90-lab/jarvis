import { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/soundManager.js';

const AI_RESPONSES = [
  'I understand. Let me check the relevant systems.',
  'Analyzing your request across the Six Realm Gates...',
  'Processing. I will route this through the appropriate domain.',
  'Noted. I have created a mission for this task.',
  'All systems nominal. What would you like to focus on?',
  'Understood. Delegating to the appropriate Realm module.',
  'Running diagnostics across all connected nodes...',
  'I have reviewed the current mission parameters. Here is my assessment.',
];

const VOICE_COMMANDS = [
  "Check Space Realm latency status.",
  "Deploy a new workforce mission.",
  "Check mood and energy indexes.",
  "System diagnostics run please."
];

export default function HermesChat({ data, addLog, onClose }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Jarvis online. How can I assist you today, ${data?.username || 'Operator'}?`,
    timestamp: Date.now(),
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isRecording]);

  const streamReply = (replyText) => {
    setIsTyping(false);
    
    // Add empty assistant bubble
    setMessages((prev) => [...prev, {
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    }]);

    let currentText = '';
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < replyText.length) {
        currentText += replyText[idx];
        idx++;
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last && last.role === 'assistant') {
            last.content = currentText;
          }
          return copy;
        });
        
        // Play very quiet sound tick for cyber typing feel
        if (idx % 2 === 0) {
          soundManager.play('click');
        }
      } else {
        clearInterval(interval);
        soundManager.play('success');
      }
    }, 30 + Math.random() * 15);
  };

  const handleSend = (forcedText) => {
    const text = (forcedText || input).trim();
    if (!text) return;

    soundManager.play('click');
    setMessages((prev) => [...prev, { role: 'user', content: text, timestamp: Date.now() }]);
    setInput('');
    setIsTyping(true);

    if (addLog) addLog(`Hermes chat: "${text.substring(0, 30)}..."`);

    window.setTimeout(() => {
      const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      streamReply(randomResponse);
    }, 1000 + Math.random() * 500);
  };

  const startRecording = (e) => {
    e.preventDefault();
    soundManager.play('beep');
    setIsRecording(true);
  };

  const stopRecording = (e) => {
    e.preventDefault();
    if (!isRecording) return;
    soundManager.play('success');
    setIsRecording(false);
    
    // Pick a random command to simulate speech-to-text
    const randomCommand = VOICE_COMMANDS[Math.floor(Math.random() * VOICE_COMMANDS.length)];
    setInput(randomCommand);
    
    // Auto send the speech result after brief delay
    setTimeout(() => {
      handleSend(randomCommand);
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-30 flex w-full flex-col border-l border-cyan-300/20 bg-slate-950/95 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md sm:w-[400px]">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-300/20 bg-void/80 p-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-pulseCore rounded-full bg-cyanCore" />
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-cyanCore">Hermes Link</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            soundManager.play('click');
            onClose();
          }}
          className="rounded p-1 text-cyan-100/50 transition-colors hover:bg-cyan-300/10 hover:text-cyan-50"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages flex-1 p-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={`msg-${i}`} className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble-ai animate-pulse font-mono">
            ···
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Waveform display */}
      {isRecording && (
        <div className="flex flex-col items-center justify-center bg-slate-950/95 border-t border-cyan-300/15 p-4 animate-fadeIn">
          <p className="font-mono text-[10px] text-dangerCore animate-pulse uppercase tracking-wider mb-2">
            SYSTEM RECORDING AUDIO INPUT...
          </p>
          <div className="flex items-end justify-center gap-1 h-8">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-cyanCore rounded-full animate-waveform origin-bottom"
                style={{
                  height: '100%',
                  animationDelay: `${i * 0.08}s`,
                  animationDuration: `${0.4 + Math.random() * 0.4}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 border-t border-cyan-300/20 bg-void/80 p-3">
        <button
          type="button"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`hud-button shrink-0 px-3 flex items-center justify-center text-sm ${
            isRecording ? 'danger border-red-500/50 bg-red-500/20 animate-pulse' : 'border-cyan-300/20 hover:bg-cyanCore/10'
          }`}
          title="Giữ chuột/chạm để nói (Push-to-Talk)"
        >
          MIC
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isRecording ? "Listening..." : "Type a command..."}
          disabled={isRecording}
          className="hud-input flex-1 font-mono text-sm"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={isRecording}
          className="hud-button primary shrink-0 px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
}

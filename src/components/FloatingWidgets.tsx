import { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle, Send, X } from 'lucide-react';
import { useStore } from '../store';

export default function FloatingWidgets() {
  const toasts = useStore().toasts;
  const [showTop, setShowTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: 'Hi! Welcome to CrazyFeb. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: 'Thanks for your message! One of our style advisors will follow up shortly. Meanwhile, explore our New Arrivals.' }]);
    }, 800);
  };

  return (
    <>
      {/* Live chat */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-[340px] max-w-[90vw] overflow-hidden rounded-2xl glass-strong shadow-lift animate-scale-in">
            <div className="flex items-center justify-between bg-ink-900 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gold-400 text-ink-900 font-bold">P</div>
                <div>
                  <div className="text-sm font-semibold">CrazyFeb Concierge</div>
                  <div className="text-[10px] text-white/70">Typically replies in minutes</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-72 space-y-3 overflow-y-auto bg-white/40 dark:bg-ink-900/40 p-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === 'user' ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900' : 'bg-ink-100/80 dark:bg-ink-800/80 text-ink-800 dark:text-ink-100'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-black/5 dark:border-white/10 bg-white/40 dark:bg-ink-900/40 p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type a message…" className="flex-1 rounded-full bg-ink-100 dark:bg-ink-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold-400/40" />
              <button onClick={send} aria-label="Send" className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-white dark:bg-white dark:text-ink-900 hover:bg-gold-400 hover:text-ink-900">
                <Send size={15} />
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setChatOpen((v) => !v)}
          aria-label="Live chat"
          className="grid h-14 w-14 place-items-center rounded-full bg-ink-900 text-white shadow-lift transition-all hover:scale-105 hover:bg-gold-400 hover:text-ink-900 dark:bg-white dark:text-ink-900 animate-float"
        >
          {chatOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </button>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 left-6 z-40 grid h-12 w-12 place-items-center rounded-full glass-strong shadow-soft transition-all duration-300 hover:bg-gold-400 hover:text-ink-900 ${showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
      >
        <ArrowUp size={18} />
      </button>

      {/* Toasts */}
      <div className="fixed left-1/2 top-20 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => {
          const lower = t.message.toLowerCase();
          const isSuccess = t.message.startsWith('✓') || t.message.startsWith('✅') || lower.includes('sent') || lower.includes('added') || lower.includes('removed') || lower.includes('welcome') || lower.includes('saved') || lower.includes('updated') || lower.includes('success');
          const isError = t.message.startsWith('❌') || lower.includes('unable') || lower.includes('could not') || lower.includes('error') || lower.includes('fail') || lower.includes('try again');
          let bgClass = 'glass-strong text-ink-900 dark:text-white border-white/30 dark:border-white/10';
          if (isSuccess) {
            bgClass = 'bg-emerald-500/80 backdrop-blur-md text-white border-emerald-400/20';
          } else if (isError) {
            bgClass = 'bg-red-500/80 backdrop-blur-md text-white border-red-400/20';
          }
          return (
            <div key={t.id} className={`animate-fade-up rounded-full border px-6 py-2.5 text-sm font-semibold shadow-lift flex items-center gap-2 ${bgClass}`}>
              {t.message}
            </div>
          );
        })}
      </div>
    </>
  );
}

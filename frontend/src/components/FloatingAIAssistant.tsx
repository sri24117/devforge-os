import React, { useEffect, useState } from 'react';
import { Bot, Send, X, Sparkles, Wand2 } from 'lucide-react';
import { askAssistant, getEntitlements } from '../services/apiService';

type Msg = { role: 'user' | 'assistant'; text: string };

export default function FloatingAIAssistant({ activeTab }: { activeTab: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'quick' | 'balanced' | 'deep'>('quick');
  const [selectedText, setSelectedText] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', text: 'Hi, I am DevForge AI. Highlight code/question and ask me for a hint, complexity, project explanation, or resume improvement.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('free');

  useEffect(() => {
    const handler = () => setSelectedText(window.getSelection()?.toString().slice(0, 4000) || '');
    document.addEventListener('selectionchange', handler);
    getEntitlements().then((e: any) => setPlan(e.plan)).catch(() => {});
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  const submit = async () => {
    const text = input.trim() || (selectedText ? 'Explain the highlighted text/code in interview-ready way.' : 'Give me my next best action.');
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await askAssistant({ message: text, context: activeTab, selected_text: selectedText, mode });
      setMessages(prev => [...prev, { role: 'assistant', text: `${res.response}\n\nModel: ${res.model}${res.remaining_today !== undefined ? ` · Remaining today: ${res.remaining_today}` : ''}` }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: e.message || 'AI assistant failed. Check OpenRouter key or plan limits.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 rounded-full bg-brand-primary text-brand-secondary px-4 py-3 shadow-2xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all">
          <div className="relative h-9 w-9 rounded-full bg-brand-accent grid place-items-center overflow-hidden">
            <Bot size={20} />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black">Ask AI</div>
            <div className="text-[10px] opacity-60">Gemma/OpenRouter ready</div>
          </div>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl bg-white border border-brand-primary/10 shadow-2xl overflow-hidden">
          <div className="p-4 bg-brand-primary text-brand-secondary flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-accent grid place-items-center"><Sparkles size={18}/></div>
              <div>
                <div className="font-black text-sm">DevForge AI Coach</div>
                <div className="text-[10px] opacity-60 uppercase tracking-widest">{plan} plan · highlight-aware</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={16}/></button>
          </div>

          <div className="p-3 flex gap-2 border-b border-brand-primary/10 bg-brand-secondary/40">
            {(['quick','balanced','deep'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase ${mode === m ? 'bg-brand-primary text-brand-secondary' : 'bg-white text-brand-primary/50'}`}>{m}</button>
            ))}
          </div>

          {selectedText && <div className="px-4 py-2 text-[11px] bg-brand-accent/10 text-brand-primary/70 border-b border-brand-primary/10 flex gap-2"><Wand2 size={14}/> Highlight captured: {selectedText.slice(0, 80)}...</div>}

          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`rounded-2xl p-3 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-brand-primary text-brand-secondary ml-8' : 'bg-brand-secondary text-brand-primary mr-8'}`}>{m.text}</div>
            ))}
            {loading && <div className="text-xs opacity-50">Thinking...</div>}
          </div>

          <div className="p-3 border-t border-brand-primary/10 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Ask for hint, complexity, project answer..." className="flex-1 px-4 py-3 rounded-2xl bg-brand-secondary/70 outline-none text-sm" />
            <button onClick={submit} className="h-12 w-12 rounded-2xl bg-brand-accent text-white grid place-items-center"><Send size={17}/></button>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, Box, ArrowRight, Loader2, CheckCircle2, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { aiWorkflowPrep } from '../services/apiService';

export default function AIWorkflowView() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ architecture: string; model: string } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const data = await aiWorkflowPrep(goal);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
       navigator.clipboard.writeText(result.architecture);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] mb-2">
            <Sparkles size={14} />
            Experimental: Gemma 4 Engine
        </div>
        <h1 className="text-4xl font-black tracking-tighter">AI WORKFLOW DESIGNER</h1>
        <p className="text-brand-primary/50 font-serif italic text-lg">
          Architect complex automations with the world's most capable open-weight model.
        </p>
      </div>

      <div className="bg-white/50 backdrop-blur-xl border border-brand-primary/10 rounded-3xl p-8 shadow-xl">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-brand-primary/70 uppercase tracking-widest ml-1">
              What are we automating today?
            </label>
            <div className="relative">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Automated LinkedIn outreach with personalized AI comments via n8n"
                className="w-full pl-6 pr-12 py-4 bg-white border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm font-medium shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !goal.trim()}
                className="absolute right-2 top-2 p-2 bg-brand-primary text-brand-secondary rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
              </button>
            </div>
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                 <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Model: {result.model}
                 </div>
              </div>
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary/40 hover:text-brand-primary transition-colors"
              >
                <Copy size={14} />
                Copy Logic
              </button>
            </div>

            <div className="bg-brand-primary text-brand-secondary rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Terminal size={140} />
               </div>
               
               <div className="relative prose prose-invert prose-brand max-w-none prose-sm sm:prose-base font-medium leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.architecture}
                  </ReactMarkdown>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 { icon: <Box className="text-blue-500" />, label: "n8n Ready", desc: "Native node suggestions included" },
                 { icon: <Sparkles className="text-amber-500" />, label: "PET Prompting", desc: "Optimized for LLM chain logic" },
                 { icon: <CheckCircle2 className="text-emerald-500" />, label: "Logic Validated", desc: "Gemma 4 high-reasoning check" }
               ].map((item, i) => (
                 <div key={i} className="p-4 bg-white/40 border border-brand-primary/5 rounded-2xl flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-brand-primary/5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary">{item.label}</div>
                      <div className="text-[11px] text-brand-primary/50 font-medium">{item.desc}</div>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

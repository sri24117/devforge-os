import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Brain, 
  Loader2, 
  Save, 
  Layout, 
  Database, 
  Zap, 
  Shield, 
  Server,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { aiEvaluateSystemDesign, saveSystemDesignSession } from '../services/apiService';

const COMPONENT_TYPES = [
  { id: 'api', label: 'API Gateway', icon: Shield, color: 'text-rose-500' },
  { id: 'lb', label: 'Load Balancer', icon: Server, color: 'text-blue-500' },
  { id: 'cache', label: 'Redis Cache', icon: Zap, color: 'text-amber-500' },
  { id: 'db', label: 'PostgreSQL', icon: Database, color: 'text-emerald-500' },
  { id: 'worker', label: 'Background Worker', icon: Layout, color: 'text-indigo-500' },
];

export default function SystemDesignView() {
  const [topic, setTopic] = useState('URL Shortener');
  const [components, setComponents] = useState<any[]>([]);
  const [explanation, setExplanation] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const addComponent = (type: string) => {
    const comp = COMPONENT_TYPES.find(c => c.id === type);
    if (comp) {
      setComponents([...components, { ...comp, id: Date.now() }]);
    }
  };

  const removeComponent = (id: number) => {
    setComponents(components.filter(c => c.id !== id));
  };

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const { response } = await aiEvaluateSystemDesign(topic, components, explanation);
      
      let evaluation;
      try {
        evaluation = JSON.parse(response);
      } catch {
        evaluation = { 
          score: 5, 
          feedback: response, 
          improvements: ["Structure the response in JSON next time"] 
        };
      }
      
      setResult(evaluation);
      
      // Save to DB
      await saveSystemDesignSession({
        topic,
        components: JSON.stringify(components),
        explanation,
        ai_feedback: evaluation.feedback
      });
    } catch (error) {
      console.error("System design evaluation failed", error);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">System Design Playground</h2>
          <p className="text-brand-primary/50 font-serif italic">Architect high-scale systems. Get AI architectural review.</p>
        </div>
        <div className="flex gap-2">
          <input 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="px-4 py-2 bg-white border border-brand-primary/10 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-accent"
            placeholder="System Topic..."
          />
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-brand-primary/5 min-h-[400px] flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent/20" />
            
            <div className="flex flex-wrap gap-4">
              {components.map(comp => (
                <motion.div 
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={comp.id} 
                  className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl flex items-center gap-3 group"
                >
                  <comp.icon size={20} className={comp.color} />
                  <span className="text-sm font-bold">{comp.label}</span>
                  <button 
                    onClick={() => removeComponent(comp.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
              {components.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20">
                  <Sparkles size={48} className="mb-4" />
                  <p className="font-serif italic">Add components to start designing your architecture.</p>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">System Flow & Logic</label>
              <textarea 
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                placeholder="Explain the data flow, database choices, and how you handle scale..."
                className="flex-1 p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl resize-none focus:outline-none focus:border-brand-accent font-serif text-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {COMPONENT_TYPES.map(type => (
                <button 
                  key={type.id}
                  onClick={() => addComponent(type.id)}
                  className="px-4 py-2 bg-white border border-brand-primary/10 rounded-xl text-xs font-bold flex items-center gap-2 hover:border-brand-accent transition-colors"
                >
                  <type.icon size={14} className={type.color} />
                  {type.label}
                </button>
              ))}
            </div>
            <button 
              onClick={handleEvaluate}
              disabled={evaluating || !explanation}
              className="px-8 py-4 bg-brand-primary text-brand-secondary font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 hover:scale-[1.05] transition-transform disabled:opacity-50"
            >
              {evaluating ? <Loader2 className="animate-spin" /> : <Brain size={20} />}
              Evaluate Design
            </button>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-brand-primary text-brand-secondary p-8 rounded-3xl space-y-6 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tight">AI Review</h3>
                  <div className="text-3xl font-black text-brand-accent">{result.score}<span className="text-sm opacity-40">/10</span></div>
                </div>
                
                <div className="space-y-4">
                  <div className="prose prose-invert prose-sm opacity-80">
                    {result.feedback}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Key Improvements</h4>
                    <ul className="space-y-2">
                      {result.improvements.map((imp: string, i: number) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <ArrowRight size={12} className="mt-0.5 text-brand-accent" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={() => setResult(null)}
                  className="w-full py-3 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  New Design
                </button>
              </motion.div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-brand-primary/5 space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight">Design Tips</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Scalability', desc: 'Think about horizontal vs vertical scaling.' },
                    { title: 'Availability', desc: 'How do you handle single points of failure?' },
                    { title: 'Consistency', desc: 'Eventual vs Strong consistency trade-offs.' }
                  ].map((tip, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-xs font-bold text-brand-accent uppercase tracking-widest">{tip.title}</div>
                      <p className="text-sm opacity-50">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

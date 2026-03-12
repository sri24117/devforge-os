import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  CheckCircle2, 
  Circle, 
  Timer, 
  Brain, 
  MessageSquare, 
  ArrowRight, 
  Loader2, 
  Code, 
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { DSAProblem } from '../types';
import { explainDSAPattern, evaluateExplanation, getHint } from '../services/geminiService';

export default function PracticeView() {
  const [problems, setProblems] = useState<DSAProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<DSAProblem | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [time, setTime] = useState(0);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  
  const [code, setCode] = useState('# Write your solution here\n\ndef solve():\n    pass');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  
  const [showExplain, setShowExplain] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [evaluatingExplanation, setEvaluatingExplanation] = useState(false);
  const [explanationFeedback, setExplanationFeedback] = useState<any>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    fetch('/api/dsa')
      .then(res => res.json())
      .then(setProblems);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isSolving) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isSolving]);

  const fetchAiInsight = async (pattern: string) => {
    setLoadingInsight(true);
    try {
      const insight = await explainDSAPattern(pattern);
      setAiInsight(insight || "No insight available.");
    } catch (error) {
      setAiInsight("Failed to fetch AI insight.");
    } finally {
      setLoadingInsight(false);
    }
  };

  useEffect(() => {
    if (selectedProblem) {
      fetchAiInsight(selectedProblem.pattern);
    } else {
      setAiInsight(null);
    }
  }, [selectedProblem]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExecute = async () => {
    setExecuting(true);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: 'python' })
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (error) {
      setExecutionResult({ stderr: "Execution failed" });
    } finally {
      setExecuting(false);
    }
  };

  const handleEvaluateExplanation = async () => {
    if (!selectedProblem) return;
    setEvaluatingExplanation(true);
    try {
      const feedback = await evaluateExplanation(selectedProblem.title, explanation);
      setExplanationFeedback(feedback);
    } catch (error) {
      console.error(error);
    } finally {
      setEvaluatingExplanation(false);
    }
  };

  const handleGetHint = async () => {
    if (!selectedProblem) return;
    setLoadingHint(true);
    try {
      const h = await getHint(selectedProblem.title, code);
      setHint(h || "No hint available.");
    } catch (error) {
      setHint("Failed to fetch hint.");
    } finally {
      setLoadingHint(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedProblem) return;
    await fetch(`/api/dsa/${selectedProblem.id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        time_taken: time,
        confidence: 4,
        reflection: explanation
      })
    });
    setIsSolving(false);
    setSelectedProblem(null);
    setTime(0);
    setExplanation('');
    setExplanationFeedback(null);
    setShowExplain(false);
    // Refresh list
    fetch('/api/dsa').then(res => res.json()).then(setProblems);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Practice Engine</h2>
          <p className="text-brand-primary/50 font-serif italic">Master DSA patterns using the 7-step framework.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-brand-primary text-brand-secondary rounded-full text-xs font-bold uppercase tracking-widest">DSA Problems</button>
          <button className="px-4 py-2 bg-white border border-brand-primary/10 rounded-full text-xs font-bold uppercase tracking-widest opacity-50">Interview Q&A</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-16rem)] overflow-hidden">
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
          {selectedProblem && isSolving ? (
            <div className="bg-brand-primary text-brand-secondary rounded-2xl shadow-2xl flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-brand-accent font-black">Active Session</span>
                  <h3 className="text-xl font-black tracking-tight">{selectedProblem.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-mono font-black text-brand-accent">{formatTime(time)}</div>
                  <button 
                    onClick={handleExecute}
                    disabled={executing}
                    className="px-4 py-1.5 bg-brand-accent text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2"
                  >
                    {executing ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                    Run Code
                  </button>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                <div className="border-r border-white/10 flex flex-col overflow-hidden">
                  <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={code}
                    onChange={v => setCode(v || '')}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      padding: { top: 20 }
                    }}
                  />
                </div>
                <div className="flex flex-col overflow-hidden bg-black/20">
                  <div className="p-4 border-b border-white/5 text-[10px] font-black uppercase tracking-widest opacity-40">Execution Output</div>
                  <div className="flex-1 p-6 font-mono text-sm overflow-y-auto">
                    {executionResult ? (
                      <div className="space-y-4">
                        {executionResult.stdout && <div className="text-emerald-400">{executionResult.stdout}</div>}
                        {executionResult.stderr && <div className="text-rose-400">{executionResult.stderr}</div>}
                      </div>
                    ) : (
                      <div className="opacity-20 italic">Run your code to see output...</div>
                    )}
                  </div>
                  <div className="p-4 border-t border-white/5">
                    <button 
                      onClick={() => setShowExplain(true)}
                      className="w-full py-3 bg-white text-brand-primary font-black uppercase tracking-widest rounded-xl hover:bg-brand-accent transition-colors"
                    >
                      Submit & Explain
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-brand-primary/5 overflow-hidden flex-1 flex flex-col">
              <div className="grid grid-cols-12 p-4 border-b border-brand-primary/5 text-[10px] font-black uppercase tracking-widest opacity-40">
                <div className="col-span-6">Problem</div>
                <div className="col-span-3">Pattern</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-1"></div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-brand-primary/5">
                {problems.map((p) => (
                  <div key={p.id} className="grid grid-cols-12 p-4 items-center hover:bg-brand-primary/5 transition-colors group">
                    <div className="col-span-6 flex items-center gap-3">
                      {p.completed ? <CheckCircle2 size={18} className="text-brand-accent" /> : <Circle size={18} className="opacity-20" />}
                      <span className={`font-bold ${p.completed ? 'opacity-40 line-through' : ''}`}>{p.title}</span>
                    </div>
                    <div className="col-span-3 text-xs opacity-60">{p.pattern}</div>
                    <div className="col-span-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        p.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.difficulty}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {!p.completed && (
                        <button 
                          onClick={() => { setSelectedProblem(p); setIsSolving(true); }}
                          className="h-8 w-8 rounded-full bg-brand-primary text-brand-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Play size={14} fill="currentColor" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto">
          <div className="bg-white p-6 rounded-2xl border border-brand-primary/5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest">AI Assistant</h4>
            <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/5 space-y-3">
              <div className="flex items-center gap-2 text-brand-accent">
                <Brain size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Pattern Insight</span>
              </div>
              {loadingInsight ? (
                <div className="flex items-center gap-2 text-xs opacity-40 italic">
                  <Loader2 size={12} className="animate-spin" /> Analyzing pattern...
                </div>
              ) : (
                <p className="text-xs leading-relaxed opacity-70 italic whitespace-pre-wrap">
                  {aiInsight || "Select a problem to get AI-powered pattern insights."}
                </p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/5 space-y-3">
              <div className="flex items-center gap-2 text-brand-accent">
                <MessageSquare size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Hint</span>
              </div>
              {loadingHint ? (
                <div className="flex items-center gap-2 text-xs opacity-40 italic">
                  <Loader2 size={12} className="animate-spin" /> Thinking...
                </div>
              ) : (
                <p className="text-xs leading-relaxed opacity-70 italic whitespace-pre-wrap">
                  {hint || "Stuck? Ask the AI for a subtle nudge."}
                </p>
              )}
            </div>
            <button 
              onClick={handleGetHint}
              disabled={loadingHint || !selectedProblem || !isSolving}
              className="w-full py-3 border border-brand-primary/10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-brand-secondary transition-colors disabled:opacity-50"
            >
              <MessageSquare size={14} /> {loadingHint ? 'Thinking...' : 'Ask AI for Hint'}
            </button>
          </div>

          <div className="bg-brand-accent/10 p-6 rounded-2xl border border-brand-accent/20 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest text-brand-accent">7-Step Mastery</h4>
              <span className="text-[10px] opacity-40">Framework Progress</span>
            </div>
            <div className="space-y-2">
              {['Understand', 'Constraints', 'Visualize', 'Brute Force', 'Optimize', 'Code', 'Dry Run'].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase opacity-60">
                  <div className={`h-1.5 w-1.5 rounded-full ${i < 6 ? 'bg-brand-accent' : 'bg-brand-primary/10'}`} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Explain Mode Modal */}
      <AnimatePresence>
        {showExplain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExplain(false)}
              className="absolute inset-0 bg-brand-primary/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <header className="p-6 border-b border-brand-primary/5 flex items-center justify-between bg-brand-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-brand-accent/20 text-brand-accent rounded-full flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Explain Like Interviewer</span>
                    <h3 className="text-xl font-black tracking-tight uppercase">Explain Your Solution</h3>
                  </div>
                </div>
                <button onClick={() => setShowExplain(false)} className="h-8 w-8 rounded-full hover:bg-brand-primary/5 flex items-center justify-center">
                  <X size={20} />
                </button>
              </header>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Your Explanation</label>
                  <textarea 
                    value={explanation}
                    onChange={e => setExplanation(e.target.value)}
                    placeholder="How does your solution work? Why did you choose this pattern? What is the complexity?"
                    className="w-full h-48 p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl resize-none focus:outline-none focus:border-brand-accent font-serif text-lg"
                  />
                </div>

                {explanationFeedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-brand-primary text-brand-secondary rounded-2xl space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-black uppercase tracking-widest text-brand-accent">Interviewer Feedback</div>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-xl font-black text-brand-accent">{explanationFeedback.clarity}</div>
                          <div className="text-[8px] uppercase opacity-40">Clarity</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-black text-brand-accent">{explanationFeedback.structure}</div>
                          <div className="text-[8px] uppercase opacity-40">Structure</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm opacity-80 italic">"{explanationFeedback.feedback}"</p>
                    {explanationFeedback.missing_points.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Missing Points</div>
                        <ul className="space-y-1">
                          {explanationFeedback.missing_points.map((p: string, i: number) => (
                            <li key={i} className="text-xs flex items-center gap-2">
                              <ChevronRight size={12} className="text-brand-accent" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <footer className="p-6 border-t border-brand-primary/5 bg-brand-secondary/30 flex gap-3">
                <button 
                  onClick={handleEvaluateExplanation}
                  disabled={evaluatingExplanation || !explanation}
                  className="flex-1 py-4 bg-brand-primary text-brand-secondary font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {evaluatingExplanation ? <Loader2 className="animate-spin" /> : <Brain size={18} />}
                  Evaluate Explanation
                </button>
                <button 
                  onClick={handleComplete}
                  className="px-8 py-4 bg-brand-accent text-brand-primary font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform"
                >
                  Complete Problem
                </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

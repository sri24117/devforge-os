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
  Building2, 
  Clock, 
  Target,
  Trophy,
  AlertCircle
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { createInterviewSession, aiEvaluateInterview } from '../services/apiService';

export default function SimulatorView() {
  const [isStarted, setIsStarted] = useState(false);
  const [config, setConfig] = useState({ company: 'Amazon', duration: 45, round: 'Coding' });
  const [step, setStep] = useState(0); // 0: Coding, 1: Backend, 2: Behavioral
  const [time, setTime] = useState(config.duration * 60);
  const [code, setCode] = useState('# Write your solution here\n\ndef solve():\n    pass');
  const [explanation, setExplanation] = useState('');
  const [behavioral, setBehavioral] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    let interval: any;
    if (isStarted && time > 0 && !evaluating) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, time, evaluating]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (step < 2) setStep(s => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setEvaluating(true);
    try {
      const interviewData = {
        coding: code,
        backend: explanation,
        behavioral: behavioral
      };
      const { response } = await aiEvaluateInterview(config.round, interviewData);
      
      let evaluation;
      try {
        evaluation = JSON.parse(response);
      } catch {
        evaluation = { 
          scores: { coding: 5, backend: 5, behavioral: 5 }, 
          feedback: response 
        };
      }
      
      setResult(evaluation);
      
      // Save to DB
      await createInterviewSession({
        company: config.company,
        duration: config.duration,
        round: config.round,
        coding_score: evaluation.scores.coding,
        backend_score: evaluation.scores.backend,
        behavioral_score: evaluation.scores.behavioral,
        feedback: evaluation.feedback
      });
    } catch (error) {
      console.error("Simulation submission failed", error);
    } finally {
      setEvaluating(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <header className="text-center space-y-4">
          <div className="h-20 w-20 bg-brand-accent/20 text-brand-accent rounded-full flex items-center justify-center mx-auto">
            <Trophy size={40} />
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Interview Complete</h2>
          <p className="text-brand-primary/50 font-serif italic">Evaluation for {config.company} - {config.round} Round</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Coding', score: result.scores.coding },
            { label: 'Backend', score: result.scores.backend },
            { label: 'Behavioral', score: result.scores.behavioral }
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-brand-primary/5 text-center">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{s.label}</div>
              <div className="text-5xl font-black text-brand-accent">{s.score}<span className="text-xl opacity-20">/10</span></div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-2xl border border-brand-primary/5 space-y-6">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Brain size={24} className="text-brand-accent" />
            Interviewer Feedback
          </h3>
          <div className="prose prose-brand max-w-none opacity-80 whitespace-pre-wrap">
            {result.feedback}
          </div>
          <button 
            onClick={() => { setIsStarted(false); setResult(null); setStep(0); setTime(config.duration * 60); }}
            className="w-full py-4 bg-brand-primary text-brand-secondary font-black uppercase tracking-widest rounded-xl"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <header className="text-center">
          <h2 className="text-4xl font-black tracking-tighter uppercase">Interview Simulator</h2>
          <p className="text-brand-primary/50 font-serif italic">Performance under pressure. Real scenarios, AI feedback.</p>
        </header>

        <div className="bg-white p-8 rounded-3xl border border-brand-primary/5 shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Company Target</label>
              <select 
                value={config.company}
                onChange={e => setConfig({...config, company: e.target.value})}
                className="w-full p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-sm font-bold"
              >
                <option>Amazon</option>
                <option>Google</option>
                <option>Fintech Startup</option>
                <option>Razorpay</option>
                <option>Turing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Interview Type</label>
              <select 
                value={config.round}
                onChange={e => setConfig({...config, round: e.target.value})}
                className="w-full p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-sm font-bold"
              >
                <option>Coding</option>
                <option>Backend Design</option>
                <option>System Design</option>
                <option>Behavioral</option>
              </select>
            </div>
          </div>

          <div className="p-6 bg-brand-accent/5 border border-brand-accent/10 rounded-2xl space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-brand-accent flex items-center gap-2">
              <AlertCircle size={14} /> Session Flow
            </h4>
            <ul className="space-y-2">
              {[
                '1 Coding Problem (30 min)',
                '1 Backend Architecture Question (10 min)',
                '1 Behavioral Scenario (5 min)'
              ].map((item, i) => (
                <li key={i} className="text-sm font-medium flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => setIsStarted(true)}
            className="w-full py-5 bg-brand-primary text-brand-secondary font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-transform shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3"
          >
            <Play size={20} fill="currentColor" /> Start Simulation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-brand-accent">
            <Building2 size={20} />
            <span className="text-xl font-black tracking-tighter uppercase">{config.company}</span>
          </div>
          <div className="h-6 w-px bg-brand-primary/10" />
          <div className="flex items-center gap-2">
            <Target size={18} className="opacity-40" />
            <span className="text-sm font-bold opacity-60">{config.round} Round</span>
          </div>
        </div>
        <div className={`flex items-center gap-3 px-6 py-2 rounded-full font-mono font-black text-xl ${time < 300 ? 'bg-rose-500 text-white animate-pulse' : 'bg-brand-primary text-brand-secondary'}`}>
          <Clock size={20} />
          {formatTime(time)}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
        <div className="col-span-8 flex flex-col gap-4 overflow-hidden">
          <div className="bg-white rounded-2xl border border-brand-primary/5 flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-brand-primary/5 flex items-center justify-between">
              <div className="flex gap-4">
                {['Coding', 'Backend', 'Behavioral'].map((s, i) => (
                  <div key={i} className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${step === i ? 'bg-brand-accent text-brand-primary' : 'bg-brand-primary/5 opacity-40'}`}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
              {step === 0 && (
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
              )}
              {step === 1 && (
                <div className="p-8 h-full flex flex-col gap-4">
                  <h3 className="text-xl font-bold">Backend Architecture: Explain how you would implement a Rate Limiter for a high-traffic API.</h3>
                  <textarea 
                    value={explanation}
                    onChange={e => setExplanation(e.target.value)}
                    placeholder="Describe your approach, database choices, and trade-offs..."
                    className="flex-1 p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl resize-none focus:outline-none focus:border-brand-accent font-serif"
                  />
                </div>
              )}
              {step === 2 && (
                <div className="p-8 h-full flex flex-col gap-4">
                  <h3 className="text-xl font-bold">Behavioral: Tell me about a time you had to handle a critical production failure.</h3>
                  <textarea 
                    value={behavioral}
                    onChange={e => setBehavioral(e.target.value)}
                    placeholder="Use the STAR method (Situation, Task, Action, Result)..."
                    className="flex-1 p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl resize-none focus:outline-none focus:border-brand-accent font-serif"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-brand-primary/5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest">Problem Statement</h4>
            <div className="prose prose-sm opacity-70">
              <p className="font-bold">Longest Substring Without Repeating Characters</p>
              <p>Given a string s, find the length of the longest substring without repeating characters.</p>
              <p>Example: "abcabcbb" {"->"} 3 ("abc")</p>
            </div>
          </div>

          <div className="flex-1" />

          <div className="space-y-3">
            <button 
              onClick={handleNext}
              disabled={evaluating}
              className="w-full py-4 bg-brand-accent text-brand-primary font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {evaluating ? <Loader2 className="animate-spin" /> : step < 2 ? 'Next Section' : 'Submit Interview'}
            </button>
            <button 
              onClick={() => setIsStarted(false)}
              className="w-full py-3 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
            >
              Quit Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

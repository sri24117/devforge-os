import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles, Brain, Loader2, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { aiEvaluateBehavioral } from '../services/apiService';

const QUESTIONS = [
  "Tell me about a challenging bug you solved recently.",
  "Describe a time you had to handle a critical production failure.",
  "Tell me about a time you disagreed with a technical decision.",
  "How do you handle tight deadlines and shifting priorities?",
  "Describe a project where you had to learn a new technology quickly."
];

export default function BehavioralTrainer() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleEvaluate = async () => {
    if (!answer) return;
    setEvaluating(true);
    try {
      const { response } = await aiEvaluateBehavioral(QUESTIONS[currentQuestion], answer);
      try {
        setFeedback(JSON.parse(response));
      } catch {
        setFeedback({
          score: 5,
          feedback: response,
          strengths: ["Attempted STAR method"],
          improvements: ["Structure the response in JSON next time"]
        });
      }
    } catch (error) {
      console.error("Behavioral evaluation failed", error);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setAnswer('');
    setCurrentQuestion((prev) => (prev + 1) % QUESTIONS.length);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="text-center">
        <h2 className="text-4xl font-black tracking-tighter uppercase">Behavioral Trainer</h2>
        <p className="text-brand-primary/50 font-serif italic">Master the STAR method. AI-powered feedback on your stories.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-brand-primary/5 shadow-xl space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                <button onClick={handleNext} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Skip Question</button>
              </div>
              <h3 className="text-2xl font-black tracking-tight leading-tight">{QUESTIONS[currentQuestion]}</h3>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Your Answer (STAR Method)</label>
              <textarea 
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Situation: Set the scene...\nTask: What was your responsibility?\nAction: What did YOU do?\nResult: What was the outcome (metrics)?"
                className="w-full h-64 p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl resize-none focus:outline-none focus:border-brand-accent font-serif text-lg leading-relaxed"
              />
            </div>

            <button 
              onClick={handleEvaluate}
              disabled={evaluating || !answer}
              className="w-full py-5 bg-brand-primary text-brand-secondary font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-transform shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {evaluating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              Evaluate My Story
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {feedback ? (
              <motion.div 
                key="feedback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-brand-primary text-brand-secondary p-8 rounded-3xl shadow-2xl space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 bg-brand-accent/20 text-brand-accent rounded-full flex items-center justify-center">
                    <Brain size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-brand-accent">{feedback.score}<span className="text-sm opacity-40">/10</span></div>
                    <div className="text-[10px] uppercase tracking-widest opacity-40">Impact Score</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-xs font-black uppercase tracking-widest text-brand-accent">Interviewer Insight</div>
                  <p className="text-sm leading-relaxed opacity-80 italic">"{feedback.feedback}"</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 size={12} /> Strengths
                    </div>
                    <ul className="space-y-1">
                      {feedback.strengths.map((s: string, i: number) => (
                        <li key={i} className="text-[10px] opacity-70 flex items-start gap-2">
                          <ChevronRight size={10} className="mt-0.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-accent flex items-center gap-2">
                      <AlertCircle size={12} /> Improvements
                    </div>
                    <ul className="space-y-1">
                      {feedback.improvements.map((s: string, i: number) => (
                        <li key={i} className="text-[10px] opacity-70 flex items-start gap-2">
                          <ChevronRight size={10} className="mt-0.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full py-3 bg-brand-accent text-brand-primary font-black uppercase tracking-widest rounded-xl text-xs"
                >
                  Next Question
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-8 rounded-3xl border border-brand-primary/5 space-y-6 opacity-40 grayscale"
              >
                <div className="h-12 w-12 bg-brand-primary/5 rounded-full flex items-center justify-center">
                  <MessageSquare size={24} />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-brand-primary/10 rounded" />
                  <div className="h-4 w-1/2 bg-brand-primary/10 rounded" />
                </div>
                <p className="text-sm font-serif italic">Submit your answer to receive AI-powered feedback on technical depth and business impact.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Pro Tip: The STAR Method</h4>
            <div className="space-y-3">
              {[
                { s: 'S', l: 'Situation', d: 'Set the context briefly.' },
                { s: 'T', l: 'Task', d: 'What was the specific challenge?' },
                { s: 'A', l: 'Action', d: 'What steps did YOU take?' },
                { s: 'R', l: 'Result', d: 'Concrete outcome with metrics.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-6 w-6 rounded bg-brand-primary text-brand-secondary flex items-center justify-center text-[10px] font-black shrink-0">{item.s}</div>
                  <div>
                    <div className="text-[10px] font-black uppercase">{item.l}</div>
                    <div className="text-[10px] opacity-60">{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

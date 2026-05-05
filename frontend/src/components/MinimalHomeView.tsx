import React from 'react';
import { ArrowRight, BrainCircuit, Code2, FileSearch, Target, Timer, TrendingUp } from 'lucide-react';

export default function MinimalHomeView({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const missions = [
    { title: 'Solve 2 DSA problems', desc: 'One HashMap + one Stack pattern', tab: 'practice', icon: Code2 },
    { title: 'Run timed Python tests', desc: 'Keep Easy problems under 20 minutes', tab: 'python-lab', icon: Timer },
    { title: 'Refine project explanation', desc: 'Prepare DevForge 60-second story', tab: 'project-trainer', icon: BrainCircuit },
    { title: 'Improve resume match', desc: 'Paste one JD and fix top gaps', tab: 'resume-match', icon: FileSearch },
  ];
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-brand-primary text-brand-secondary p-8 relative overflow-hidden">
        <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-brand-accent/30 blur-2xl" />
        <p className="text-xs font-black uppercase tracking-[0.25em] opacity-50">Daily Mission Hub</p>
        <h2 className="text-4xl font-black tracking-tighter mt-3 max-w-2xl">Today, become 1% more interview-ready.</h2>
        <p className="text-brand-secondary/60 max-w-xl mt-3">Minimal workspace. No feature fatigue. Finish the mission, log the timer, ask AI only when you are stuck.</p>
        <button onClick={() => onNavigate('practice')} className="mt-6 bg-brand-accent text-white rounded-2xl px-5 py-3 font-black inline-flex items-center gap-2">Start Practice <ArrowRight size={16}/></button>
      </section>
      <div className="grid md:grid-cols-2 gap-4">
        {missions.map(m => <button key={m.title} onClick={() => onNavigate(m.tab)} className="text-left p-5 rounded-3xl bg-white/70 border border-brand-primary/10 hover:border-brand-accent/50 hover:shadow-xl transition-all">
          <m.icon className="text-brand-accent" />
          <h3 className="font-black text-lg mt-4">{m.title}</h3>
          <p className="text-sm opacity-55 mt-1">{m.desc}</p>
        </button>)}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white/60 border border-brand-primary/10"><Target/><div className="font-black mt-3">Goal</div><p className="text-sm opacity-50">Python/AI Backend role readiness</p></div>
        <div className="p-5 rounded-3xl bg-white/60 border border-brand-primary/10"><TrendingUp/><div className="font-black mt-3">Metric</div><p className="text-sm opacity-50">Speed + confidence + consistency</p></div>
        <div className="p-5 rounded-3xl bg-white/60 border border-brand-primary/10"><BrainCircuit/><div className="font-black mt-3">Coach</div><p className="text-sm opacity-50">OpenRouter/Gemma assistant</p></div>
      </div>
    </div>
  );
}

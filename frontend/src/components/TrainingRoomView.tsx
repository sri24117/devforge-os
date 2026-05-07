import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Timer, FileText, Code2, Github, Building2, ArrowRight, Flame, Sparkles } from 'lucide-react';
import { getGymRoomPlan } from '../services/apiService';

type Props = { onNavigate: (tab: string) => void };

const routeByCta: Record<string, string> = {
  'Open Resume Lab': 'resume-lab',
  'Open Practice': 'practice',
  'Open Company Pack': 'company-packs',
  'Open GitHub Lab': 'github-lab',
};

export default function TrainingRoomView({ onNavigate }: Props) {
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    getGymRoomPlan().then(setPlan).catch(() => setPlan(null));
  }, []);

  const blocks = plan?.today_blocks || [
    { zone: 'Warm-up', task: 'Scan resume against one target JD', minutes: 8, cta: 'Open Resume Lab' },
    { zone: 'Strength', task: 'Solve one timed Python problem', minutes: 25, cta: 'Open Practice' },
    { zone: 'Skill', task: 'Study one company pack', minutes: 15, cta: 'Open Company Pack' },
    { zone: 'Proof', task: 'Improve one GitHub project proof', minutes: 12, cta: 'Open GitHub Lab' },
  ];

  const targets = plan?.weekly_targets || [
    { metric: 'DSA reps', target: 15 },
    { metric: 'Mock answers', target: 10 },
    { metric: 'Resume/JD scans', target: 5 },
    { metric: 'Applications', target: 35 },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-brand-primary text-brand-secondary p-8 md:p-10 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-accent/20 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-brand-accent">
              <Dumbbell size={14} /> DevForge Training Room
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Train like a backend athlete.
            </h1>
            <p className="text-brand-secondary/70 text-lg max-w-xl">
              One screen, one mission, timed reps, AI coach, and proof-building. No feature fatigue — just today’s work.
            </p>
          </div>
          <div className="rounded-3xl bg-white/10 border border-white/10 p-5 min-w-[220px]">
            <div className="flex items-center gap-2 text-brand-accent text-xs font-black uppercase tracking-widest"><Flame size={16}/> Today Intensity</div>
            <div className="text-5xl font-black mt-3">60<span className="text-base opacity-50"> min</span></div>
            <p className="text-xs opacity-50 mt-2">Complete the circuit and log your pace.</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {blocks.map((b: any, i: number) => {
          const icons = [FileText, Code2, Building2, Github];
          const Icon = icons[i] || Sparkles;
          return (
            <motion.button
              key={b.zone}
              whileHover={{ y: -4 }}
              onClick={() => onNavigate(routeByCta[b.cta] || 'practice')}
              className="group text-left bg-white rounded-3xl border border-brand-primary/10 p-6 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-brand-primary text-brand-secondary flex items-center justify-center"><Icon size={20}/></div>
                <div className="flex items-center gap-1 text-xs font-black text-brand-accent"><Timer size={14}/> {b.minutes}m</div>
              </div>
              <div className="mt-6 text-[10px] uppercase tracking-widest font-black opacity-40">{b.zone}</div>
              <h3 className="mt-1 font-black text-lg leading-tight">{b.task}</h3>
              <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-accent group-hover:gap-3 transition-all">
                {b.cta} <ArrowRight size={14}/>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-brand-primary/10 p-8">
          <h2 className="text-2xl font-black tracking-tight">Weekly Scoreboard</h2>
          <p className="text-sm opacity-50 mt-1">Clear targets make the app addictive and useful.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {targets.map((t: any) => (
              <div key={t.metric} className="rounded-2xl bg-brand-primary/5 p-5 border border-brand-primary/5">
                <div className="text-3xl font-black">{t.target}</div>
                <div className="text-[10px] uppercase tracking-widest font-black opacity-50 mt-1">{t.metric}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-brand-accent/10 rounded-[2rem] border border-brand-accent/20 p-8">
          <h2 className="text-xl font-black tracking-tight text-brand-accent">Paying-user hooks</h2>
          <ul className="mt-5 space-y-3">
            {(plan?.upgrade_hooks || [
              'Find why your resume is not getting callbacks in 2 minutes.',
              'Turn every project into a confident interview story.',
              'Stop random LeetCode grinding; train by role and speed bottleneck.',
            ]).map((h: string) => (
              <li key={h} className="text-sm font-semibold leading-relaxed flex gap-2"><Sparkles size={15} className="text-brand-accent mt-1 shrink-0"/> {h}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

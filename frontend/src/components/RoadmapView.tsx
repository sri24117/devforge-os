import React, { useState, useEffect } from 'react';
import { Lock, Unlock, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { RoadmapPhase } from '../types';

import { 
  getRoadmap 
} from '../services/apiService';

export default function RoadmapView() {
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);

  useEffect(() => {
    getRoadmap()
      .then(setPhases)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-black tracking-tighter uppercase">Preparation Roadmap</h2>
        <p className="text-brand-primary/50 font-serif italic">Your 60-day path to backend interview readiness.</p>
      </header>

      <div className="space-y-4">
        {phases.map((phase, i) => (
          <div 
            key={phase.id} 
            className={`p-8 rounded-2xl border transition-all ${
              phase.status === 'In Progress' 
                ? 'bg-white border-brand-accent shadow-lg shadow-brand-accent/5' 
                : 'bg-white/50 border-brand-primary/5 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-6">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl font-black ${
                  phase.status === 'In Progress' ? 'bg-brand-accent text-brand-primary' : 'bg-brand-primary/10 text-brand-primary/40'
                }`}>
                  0{i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold tracking-tight">{phase.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      phase.status === 'In Progress' ? 'bg-brand-accent/20 text-brand-accent' : 'bg-brand-primary/10 text-brand-primary/40'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                  <p className="text-sm opacity-50 max-w-md">
                    {i === 0 && "Foundations: Clean Architecture, Logging, Error Handling, and Basic DSA Patterns."}
                    {i === 1 && "The Capstone: Building a high-scale Smart Attendance System with JWT & RBAC."}
                    {i === 2 && "Advanced Backend: Docker, CI/CD, Query Optimization, and Complex DSA."}
                    {i === 3 && "Interview Ready: Mock interviews, storytelling, and active job applications."}
                  </p>
                </div>
              </div>
              {phase.status === 'Locked' ? <Lock size={20} className="opacity-20" /> : <ChevronRight size={24} className="text-brand-accent" />}
            </div>

            {phase.status === 'In Progress' && (
              <div className="mt-8 pt-8 border-t border-brand-primary/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Clean Architecture', '14-20 DSA Problems', 'Logging & Errors', 'Pagination'].map((task, j) => (
                  <div key={j} className="flex items-center gap-3 p-3 rounded-lg bg-brand-primary/5 border border-brand-primary/5">
                    <CheckCircle2 size={16} className="text-brand-accent" />
                    <span className="text-xs font-bold">{task}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, Circle, Plus, Github, ArrowUpRight } from 'lucide-react';
import { ProjectTask } from '../types';

export default function ProjectView() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);

  useEffect(() => {
    fetch('/api/project')
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const toggleTask = async (id: number) => {
    await fetch(`/api/project/${id}/toggle`, { method: 'POST' });
    fetch('/api/project').then(res => res.json()).then(setTasks);
  };

  const backendTasks = tasks.filter(t => t.category === 'Backend');
  const frontendTasks = tasks.filter(t => t.category === 'Frontend');

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Capstone Project</h2>
          <p className="text-brand-primary/50 font-serif italic">Smart Attendance Intelligence System.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-primary/10 rounded-full text-xs font-bold">
            <Github size={16} />
            <span>Last Commit: 2h ago</span>
          </div>
          <button className="h-10 w-10 rounded-full bg-brand-primary text-brand-secondary flex items-center justify-center">
            <Plus size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
              Backend Architecture
            </h3>
            <span className="text-[10px] opacity-40">{backendTasks.filter(t => t.completed).length}/{backendTasks.length} Done</span>
          </div>
          <div className="bg-white rounded-2xl border border-brand-primary/5 divide-y divide-brand-primary/5">
            {backendTasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className="p-5 flex items-center justify-between group cursor-pointer hover:bg-brand-primary/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {task.completed ? <CheckCircle2 size={20} className="text-brand-accent" /> : <Circle size={20} className="opacity-20" />}
                  <span className={`font-bold ${task.completed ? 'opacity-40 line-through' : ''}`}>{task.title}</span>
                </div>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Frontend Interface
            </h3>
            <span className="text-[10px] opacity-40">{frontendTasks.filter(t => t.completed).length}/{frontendTasks.length} Done</span>
          </div>
          <div className="bg-white rounded-2xl border border-brand-primary/5 divide-y divide-brand-primary/5">
            {frontendTasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className="p-5 flex items-center justify-between group cursor-pointer hover:bg-brand-primary/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {task.completed ? <CheckCircle2 size={20} className="text-brand-accent" /> : <Circle size={20} className="opacity-20" />}
                  <span className={`font-bold ${task.completed ? 'opacity-40 line-through' : ''}`}>{task.title}</span>
                </div>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-brand-primary text-brand-secondary p-8 rounded-2xl flex items-center justify-between">
        <div className="space-y-2">
          <h4 className="text-2xl font-black tracking-tight">Daily Commit Streak</h4>
          <p className="text-sm opacity-50">You've committed code for 15 consecutive days. Keep the momentum!</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className={`h-8 w-8 rounded ${i < 12 ? 'bg-brand-accent' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

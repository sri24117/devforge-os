import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Timer, Code2, Terminal, Briefcase, ArrowRight, BrainCircuit, Github, CheckCircle2, Loader2, Trophy } from 'lucide-react';
import { DashboardStats } from '../types';
import { getGithubAuthUrl, importLeetcode } from '../services/apiService';

export default function DashboardView({ stats }: { stats: DashboardStats | null }) {
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [importingLeetcode, setImportingLeetcode] = useState(false);

  if (!stats) return null;

  const handleImportLeetcode = async () => {
    if (!leetcodeUsername) return;
    setImportingLeetcode(true);
    try {
      await importLeetcode(leetcodeUsername);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setImportingLeetcode(false);
    }
  };

  const dsaPercent = Math.round((stats.dsa.completed / stats.dsa.total) * 100) || 0;
  const projectPercent = Math.round((stats.project.completed / stats.project.total) * 100) || 0;

  const handleConnectGithub = async () => {
    const { url } = await getGithubAuthUrl();
    window.open(url, 'github_oauth', 'width=600,height=700');
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">GOOD MORNING, SRI</h2>
          <p className="text-brand-primary/50 font-serif italic">Your 2-hour session is ready for execution.</p>
        </div>
        {stats.github ? (
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20">
            <Github size={18} />
            <span className="text-xs font-bold">@{stats.github.username} connected</span>
            <CheckCircle2 size={14} />
          </div>
        ) : (
          <button 
            onClick={handleConnectGithub}
            className="flex items-center gap-3 px-4 py-2 bg-brand-primary text-brand-secondary rounded-full hover:scale-[1.05] transition-transform"
          >
            <Github size={18} />
            <span className="text-xs font-bold">Connect GitHub</span>
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-brand-primary text-brand-secondary p-6 rounded-2xl shadow-xl flex flex-col justify-between aspect-square md:aspect-auto md:h-64">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Timer size={24} className="text-brand-accent" />
              <span className="text-[10px] uppercase tracking-widest opacity-50">Session Control</span>
            </div>
            <h3 className="text-2xl font-bold leading-tight">Today's Training<br />(120 Minutes)</h3>
          </div>
          <button className="w-full py-4 bg-brand-accent text-brand-primary font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
            Start Session <ArrowRight size={18} />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-primary/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <BrainCircuit size={24} className="text-brand-accent" />
              <span className="text-[10px] uppercase tracking-widest opacity-50">LeetCode Import</span>
            </div>
            <div className="space-y-3">
              <input 
                type="text"
                placeholder="LeetCode Username"
                value={leetcodeUsername}
                onChange={e => setLeetcodeUsername(e.target.value)}
                className="w-full p-2 bg-brand-primary/5 border border-brand-primary/10 rounded-lg text-xs focus:outline-none focus:border-brand-accent"
              />
              <button 
                onClick={handleImportLeetcode}
                disabled={importingLeetcode || !leetcodeUsername}
                className="w-full py-2 bg-brand-primary text-brand-secondary text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {importingLeetcode ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
                Import Profile
              </button>
            </div>
          </div>
          <div className="text-[8px] uppercase opacity-40 tracking-widest mt-4">Analyzes patterns & difficulty</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-primary/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Trophy size={24} className="text-brand-accent" />
              <span className="text-[10px] uppercase tracking-widest opacity-50">Readiness Score</span>
            </div>
            <div className="text-5xl font-black tracking-tighter mb-1">{stats.readinessScore}%</div>
            <div className="text-xs font-medium opacity-50 uppercase tracking-wider">Interview Ready</div>
          </div>
          <div className="w-full bg-brand-primary/5 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.readinessScore}%` }}
              className="h-full bg-brand-accent"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-primary/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Code2 size={24} className="text-brand-primary/40" />
              <span className="text-[10px] uppercase tracking-widest opacity-50">DSA Progress</span>
            </div>
            <div className="text-5xl font-black tracking-tighter mb-1">{dsaPercent}%</div>
            <div className="text-xs font-medium opacity-50 uppercase tracking-wider">{stats.dsa.completed} / {stats.dsa.total} Problems</div>
          </div>
          <div className="w-full bg-brand-primary/5 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${dsaPercent}%` }}
              className="h-full bg-brand-primary"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-primary/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Terminal size={24} className="text-brand-primary/40" />
              <span className="text-[10px] uppercase tracking-widest opacity-50">Project Build</span>
            </div>
            <div className="text-5xl font-black tracking-tighter mb-1">{projectPercent}%</div>
            <div className="text-xs font-medium opacity-50 uppercase tracking-wider">{stats.project.completed} / {stats.project.total} Tasks</div>
          </div>
          <div className="w-full bg-brand-primary/5 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${projectPercent}%` }}
              className="h-full bg-brand-accent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-[0.2em]">Pattern Mastery</h4>
            <span className="text-[10px] opacity-40">Interview Readiness</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-brand-primary/5 space-y-4">
            {stats.patterns.map((p, i) => {
              const mastery = Math.round((p.completed / p.total) * 100);
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="opacity-60">{p.pattern}</span>
                    <span className="text-brand-accent">{mastery}%</span>
                  </div>
                  <div className="w-full bg-brand-primary/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${mastery}%` }}
                      className="h-full bg-brand-primary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-[0.2em]">Weakness Radar</h4>
            <span className="text-[10px] opacity-40">AI Identified</span>
          </div>
          <div className="bg-brand-primary text-brand-secondary p-6 rounded-2xl space-y-4">
            <div className="flex flex-wrap gap-2">
              {stats.weaknesses.map((w, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  {w}
                </span>
              ))}
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-[10px] uppercase tracking-widest opacity-50 mb-2">Recommended Next Steps</div>
              <ul className="space-y-2">
                <li className="text-xs flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-brand-accent" />
                  Solve 3 "Medium" {stats.weaknesses[0]} problems
                </li>
                <li className="text-xs flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-brand-accent" />
                  Review Concurrency patterns in Backend
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

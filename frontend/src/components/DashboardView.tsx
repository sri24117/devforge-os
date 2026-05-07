import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, Code2, Terminal, Briefcase, 
  ArrowRight, BrainCircuit, Github, 
  CheckCircle2, Loader2, Trophy, 
  ChevronRight, Circle, Play,
  Sparkles, Zap, Layers, Target
} from 'lucide-react';
import { DashboardStats, DailyPlan } from '../types';
import { getGithubAuthUrl, importLeetcode, getTodayPlan } from '../services/apiService';

export default function DashboardView({ stats, userProfile }: { stats: DashboardStats | null, userProfile: any }) {
  const [todayPlan, setTodayPlan] = useState<DailyPlan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [importingLeetcode, setImportingLeetcode] = useState(false);

  useEffect(() => {
    async function loadPlan() {
      try {
        const plan = await getTodayPlan();
        setTodayPlan(plan);
      } catch (error) {
        console.error("Failed to load today's plan:", error);
      } finally {
        setLoadingPlan(false);
      }
    }
    loadPlan();
  }, []);

  if (!stats) return null;

  const dsaPercent = Math.round((stats.dsa.completed / stats.dsa.total) * 100) || 0;
  
  const handleConnectGithub = async () => {
    const { url } = await getGithubAuthUrl();
    window.open(url, 'github_oauth', 'width=600,height=700');
  };

  return (
    <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ─── PREMIUM HEADER ─── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
           <div className="flex items-center gap-3 text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] mb-2">
             <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
             Active Session: Internal Readiness
           </div>
           <h2 className="text-6xl font-black tracking-tighter uppercase leading-[0.8] gradient-text">
             DAY {todayPlan?.day || 1}<br/>
             <span className="text-3xl opacity-80">{todayPlan?.topic?.split(':')[0] || 'SYSTEM READY'}</span>
           </h2>
           <p className="text-brand-primary/40 font-medium text-lg mt-4 max-w-md leading-snug">
             Authentication successful. <span className="text-brand-primary font-bold">{userProfile?.name?.split(' ')[0]}</span>, your trajectory towards <span className="text-brand-accent font-black">L6 Senior</span> is {stats.readinessScore}% optimized.
           </p>
        </div>
        
        <div className="flex flex-col items-end gap-4">
           <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                 {[...Array(7)].map((_, i) => (
                   <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className={`w-10 h-10 rounded-2xl border-4 border-brand-secondary flex items-center justify-center text-xs shadow-sm transition-transform hover:scale-110 ${i < stats.streak ? 'accent-gradient text-brand-primary' : 'bg-white text-brand-primary/10'}`}
                   >
                      {i < stats.streak ? '🔥' : ''}
                   </motion.div>
                 ))}
              </div>
           </div>
           <div className="px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-widest text-brand-primary/50 flex items-center gap-2">
             <Trophy size={12} className="text-brand-accent" />
             Protocol Streak: <span className="text-brand-primary">{stats.streak} Days</span>
           </div>
        </div>
      </header>

      {/* ─── COMMAND CENTER ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* HERO: MISSION CONTROL */}
        <div className="lg:col-span-8 glass-dark text-brand-secondary p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute -top-24 -right-24 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110">
              <Zap size={400} />
           </div>
           
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-8">
                   <div className="px-5 py-2 bg-brand-accent text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-brand-accent/20">
                      Primary Objective
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                     <Timer size={14} /> 120min remaining
                   </div>
                </div>
                <h3 className="text-4xl font-black mb-6 leading-tight tracking-tight">
                  {todayPlan?.topic || 'Synchronizing with global roadmap...'}
                </h3>
                <p className="text-white/50 text-lg max-w-xl leading-relaxed mb-10 font-medium">
                  {todayPlan?.description || 'Your custom roadmap is being optimized for current market trends and algorithmic complexity.'}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                   {loadingPlan ? (
                     [1,2,3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-2xl border border-white/5" />)
                   ) : (
                     todayPlan?.problems.map((p, i) => (
                       <motion.div 
                        whileHover={{ x: 5 }}
                        key={i} 
                        className="group/item flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all cursor-pointer backdrop-blur-sm"
                       >
                          <div className="h-6 w-6 rounded-lg bg-brand-accent/20 flex items-center justify-center">
                            <Circle size={10} className="text-brand-accent" />
                          </div>
                          <span className="text-xs font-bold tracking-tight">{p}</span>
                       </motion.div>
                     ))
                   )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 px-10 py-6 accent-gradient text-brand-primary font-black uppercase tracking-[0.25em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 shadow-xl shadow-brand-accent/20 text-sm">
                  Launch Protocol <Play size={20} fill="currentColor" />
                </button>
                <button className="px-10 py-6 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-[0.25em] rounded-2xl transition-all text-sm backdrop-blur-md border border-white/10">
                  Reschedule
                </button>
              </div>
           </div>
        </div>

        {/* SIDEBAR: ANALYTICS HUB */}
        <div className="lg:col-span-4 space-y-8">
           {/* READINESS RADAR (Conceptual) */}
           <div className="glass p-10 rounded-[3rem] shadow-sm relative overflow-hidden group border-white/40">
              <div className="flex items-center justify-between mb-8">
                 <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Skill Mastery</div>
                 <BrainCircuit size={20} className="text-brand-accent" />
              </div>
              
              {/* Simple SVG Radar Placeholder */}
              <div className="aspect-square w-full relative flex items-center justify-center mb-8">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-20 absolute rotate-12">
                  <polygon points="50,5 95,35 75,95 25,95 5,35" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <polygon points="50,15 85,40 70,85 30,85 15,40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="50" y2="5" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="95" y2="35" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="50" x2="75" y2="95" stroke="currentColor" strokeWidth="0.5" />
                </svg>
                <div className="text-center relative z-10">
                  <div className="text-8xl font-black tracking-tighter leading-none gradient-text drop-shadow-sm">
                    {stats.readinessScore}
                  </div>
                  <div className="text-[10px] font-black text-emerald-500 mt-2 uppercase tracking-[0.2em] flex items-center justify-center gap-1">
                    <Zap size={10} fill="currentColor" /> Readiness Rank
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
                  <span>Progress</span>
                  <span>{stats.readinessScore}%</span>
                </div>
                <div className="w-full bg-brand-primary/5 h-2 rounded-full overflow-hidden">
                  <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.readinessScore}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full accent-gradient shadow-[0_0_20px_rgba(242,125,38,0.4)]"
                  />
                </div>
              </div>
           </div>

           {/* WEAKNESS ALERT */}
           <div className="bg-red-500 p-10 rounded-[3rem] shadow-xl shadow-red-500/10 text-white group overflow-hidden relative">
              <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <Target size={120} />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                 <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Active Weakness</div>
                 <div className="h-2.5 w-2.5 rounded-full bg-white animate-ping" />
              </div>
              <div className="text-2xl font-black uppercase tracking-tight mb-6 relative z-10 leading-tight">
                {stats.weaknesses[0].split('—')[0]}
              </div>
              <button 
                onClick={() => window.location.hash = '#practice'}
                className="w-full py-4 bg-white/20 hover:bg-white text-white hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all relative z-10 border border-white/20"
              >
                Eliminate Weakness <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </div>

      {/* ─── SYSTEM DRILLDOWN ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: "DSA Mastery", val: dsaPercent, sub: `${stats.dsa.completed}/${stats.dsa.total} units`, icon: <Code2 /> },
           { label: "System Architecture", val: stats.system_design.count, sub: "deployments", icon: <Layers size={20} />, raw: true },
           { label: "Interview Simulation", val: stats.interviews.count, sub: "authorized sessions", icon: <Briefcase size={20} />, raw: true },
           { label: "Pipeline Status", val: stats.applications.count, sub: "active tracking", icon: <Terminal size={20} />, raw: true }
         ].map((stat, i) => (
           <motion.div 
            whileHover={{ y: -8 }}
            key={i} 
            className="glass p-8 rounded-[2.5rem] shadow-sm group border-white/60 transition-all hover:shadow-xl hover:shadow-brand-primary/5"
           >
              <div className="flex items-center justify-between mb-6">
                 <div className="h-12 w-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary/40 group-hover:accent-gradient group-hover:text-brand-primary transition-all duration-500 shadow-inner">
                    {stat.icon}
                 </div>
                 <div className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary/30">{stat.label}</div>
              </div>
              <div className="text-5xl font-black tracking-tighter mb-2 gradient-text">
                {stat.val}{!stat.raw && '%'}
              </div>
              <div className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/40" />
                {stat.sub}
              </div>
           </motion.div>
         ))}
      </div>

      {/* ─── UTILITY FOOTER ─── */}
      <footer className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-brand-primary/5">
        <div className="flex items-center gap-6">
          {stats.github ? (
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/5 text-emerald-600 rounded-2xl border border-emerald-500/10 text-xs font-black uppercase tracking-widest">
              <Github size={18} /> @{stats.github.username} Linked
            </div>
          ) : (
            <button 
              onClick={handleConnectGithub}
              className="flex items-center gap-4 px-8 py-4 bg-brand-primary text-brand-secondary rounded-2xl hover:scale-[1.03] transition-all text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/30 active:scale-95"
            >
              <Github size={18} /> Connect Profile
            </button>
          )}
          <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.3em]">
             Authorized System v7.0.0
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary/30 hover:text-brand-primary transition-colors">Documentation</button>
          <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary/30 hover:text-brand-primary transition-colors">API Access</button>
        </div>
      </footer>
    </div>
  );
}

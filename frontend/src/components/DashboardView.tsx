import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, Code2, Terminal, Briefcase, 
  ArrowRight, BrainCircuit, Github, 
  CheckCircle2, Loader2, Trophy, 
  ChevronRight, Circle, Play,
  Sparkles, Zap, Layers
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
    <div className="space-y-10 pb-12">
      {/* ─── ENHANCED HEADER ─── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] mb-1">
             <div className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             Live Readiness Protocol
           </div>
           <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
             DAY {todayPlan?.day || 1}: {todayPlan?.topic?.split(':')[0].toUpperCase() || 'LOADING...'}
           </h2>
           <p className="text-brand-primary/40 font-serif italic text-lg mt-2">
             Welcome back, {userProfile?.name?.split(' ')[0]}. Your FAANG objective is {stats.readinessScore}% complete.
           </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-brand-secondary flex items-center justify-center text-[10px] font-bold ${i < stats.streak ? 'bg-brand-accent text-brand-primary' : 'bg-brand-primary/5 text-brand-primary/20'}`}>
                   {i < stats.streak ? '🔥' : ''}
                </div>
              ))}
           </div>
           <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
             Current Streak: <span className="text-brand-primary">{stats.streak} Days</span>
           </div>
        </div>
      </header>

      {/* ─── JOURNEY COMMAND CENTER (HERO) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DAILY MISSION CARD */}
        <div className="lg:col-span-2 bg-brand-primary text-brand-secondary p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={200} />
           </div>
           
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                   <div className="px-4 py-1.5 bg-brand-accent text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                      Priority Target
                   </div>
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                     Est. Time: 120min
                   </div>
                </div>
                <h3 className="text-3xl font-black mb-4 leading-tight">
                  {todayPlan?.topic || 'Parsing daily protocol...'}
                </h3>
                <p className="text-white/60 text-sm max-w-xl leading-relaxed mb-8">
                  {todayPlan?.description || 'Your custom roadmap is being synchronized with the global FAANG problem bank.'}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                   {loadingPlan ? (
                     [1,2,3].map(i => <div key={i} className="h-12 bg-white/5 animate-pulse rounded-2xl" />)
                   ) : (
                     todayPlan?.problems.map((p, i) => (
                       <div key={i} className="group/item flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all cursor-pointer">
                          <Circle size={14} className="text-brand-accent" />
                          <span className="text-xs font-bold truncate">{p}</span>
                       </div>
                     ))
                   )}
                </div>
              </div>

              <button className="w-full sm:w-auto px-10 py-5 bg-brand-accent text-brand-primary font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4">
                Execute Day {todayPlan?.day || 1} <Play size={20} fill="currentColor" />
              </button>
           </div>
        </div>

        {/* STATS RADAR */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-brand-primary/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Readiness Score</div>
                 <Sparkles size={18} className="text-brand-accent" />
              </div>
              <div className="flex items-end gap-2 mb-4">
                 <div className="text-7xl font-black tracking-tighter leading-none">{stats.readinessScore}%</div>
                 <div className="text-xs font-bold text-emerald-500 mb-1">+2.4%</div>
              </div>
              <div className="w-full bg-brand-primary/5 h-3 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.readinessScore}%` }}
                    className="h-full bg-brand-accent shadow-[0_0_20px_rgba(255,200,0,0.5)]"
                 />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-brand-primary/5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Active Weakness</div>
                 <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <div className="text-xl font-black uppercase tracking-tight mb-4">
                {stats.weaknesses[0]}
              </div>
              <button 
                onClick={() => window.location.hash = '#practice'}
                className="w-full py-3 bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-brand-secondary transition-all"
              >
                Eliminate Now <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </div>

      {/* ─── DETAILED DRILLDOWN ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "DSA Mastery", val: dsaPercent, sub: `${stats.dsa.completed}/${stats.dsa.total} problems`, icon: <Code2 /> },
           { label: "System Design", val: stats.system_design.count, sub: "architectures built", icon: <Layers size={20} />, raw: true },
           { label: "Interviews", val: stats.interviews.count, sub: "sessions logged", icon: <Briefcase size={20} />, raw: true },
           { label: "Applications", val: stats.applications.count, sub: "active tracking", icon: <Terminal size={20} />, raw: true }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-brand-primary/5 shadow-sm group hover:border-brand-accent/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                 <div className="h-10 w-10 bg-brand-primary/5 rounded-xl flex items-center justify-center text-brand-primary/40 group-hover:text-brand-accent transition-colors">
                    {stat.icon}
                 </div>
                 <div className="text-[9px] font-black uppercase tracking-widest text-brand-primary/30">{stat.label}</div>
              </div>
              <div className="text-4xl font-black tracking-tighter mb-1">
                {stat.val}{!stat.raw && '%'}
              </div>
              <div className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">
                {stat.sub}
              </div>
           </div>
         ))}
      </div>

      {/* ─── FOOTER TOOLS ─── */}
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="flex items-center gap-4 bg-white/40 p-2 rounded-2xl">
          {stats.github ? (
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/20 w-fit">
              <Github size={18} />
              <span className="text-xs font-bold">@{stats.github.username} Syncing</span>
            </div>
          ) : (
            <button 
              onClick={handleConnectGithub}
              className="flex items-center gap-3 px-6 py-3 bg-brand-primary text-brand-secondary rounded-xl hover:scale-[1.02] transition-all text-xs font-bold shadow-lg"
            >
              <Github size={18} />
              Connect GitHub Logic
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

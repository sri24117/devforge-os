import React, { useState } from 'react';
import { FileSearch, Loader2, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { analyzeResumeGap } from '../services/apiService';

export default function ResumeLabView() {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [role, setRole] = useState('Python Backend Developer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const run = async () => {
    setLoading(true); setError('');
    try {
      const data = await analyzeResumeGap({ resume_text: resume, job_description: jd, target_role: role });
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Resume analysis failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest font-black text-brand-accent">2-minute aha moment</div>
          <h2 className="text-4xl font-black tracking-tighter">Resume Gap Lab</h2>
          <p className="text-sm opacity-50">Paste resume + JD. Get score, blockers, and a 7-day fix plan.</p>
        </div>
        <div className="hidden md:flex h-14 w-14 rounded-2xl bg-brand-primary text-brand-secondary items-center justify-center"><FileSearch /></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <input value={role} onChange={e=>setRole(e.target.value)} className="w-full rounded-2xl border border-brand-primary/10 p-4 font-bold" />
          <textarea value={resume} onChange={e=>setResume(e.target.value)} placeholder="Paste your resume text here..." className="w-full h-80 rounded-3xl border border-brand-primary/10 p-5 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
        </div>
        <textarea value={jd} onChange={e=>setJd(e.target.value)} placeholder="Paste target job description here..." className="w-full h-[25rem] rounded-3xl border border-brand-primary/10 p-5 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
      </div>
      <button onClick={run} disabled={loading || resume.length < 20 || jd.length < 20} className="px-6 py-4 rounded-2xl bg-brand-primary text-brand-secondary font-black uppercase tracking-widest disabled:opacity-40 flex items-center gap-2">
        {loading ? <Loader2 className="animate-spin"/> : <Sparkles/>} Analyze Gap
      </button>
      {error && <div className="p-4 rounded-2xl bg-red-50 text-red-600 font-bold">{error}</div>}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-brand-primary text-brand-secondary rounded-[2rem] p-8">
            <div className="text-[10px] uppercase tracking-widest font-black text-brand-accent">Match Score</div>
            <div className="text-7xl font-black mt-3">{result.match_score}</div>
            <div className="text-xl font-black mt-2">{result.readiness_label}</div>
            <p className="text-xs opacity-60 mt-4">{result.paid_hook}</p>
          </div>
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-[2rem] border border-brand-primary/10 p-6">
              <h3 className="font-black flex items-center gap-2"><AlertTriangle className="text-brand-accent"/> Top blockers</h3>
              <ul className="mt-4 space-y-2">{result.top_blockers.map((b:string)=><li key={b} className="text-sm font-semibold">• {b}</li>)}</ul>
            </div>
            <div className="bg-white rounded-[2rem] border border-brand-primary/10 p-6">
              <h3 className="font-black flex items-center gap-2"><CheckCircle2 className="text-emerald-500"/> 7-day fix plan</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">{result.seven_day_plan.map((d:any)=><div key={d.day} className="rounded-2xl bg-brand-primary/5 p-4"><div className="text-[10px] font-black uppercase tracking-widest text-brand-accent">{d.day}</div><div className="font-bold text-sm mt-1">{d.task}</div><div className="text-xs opacity-50 mt-1">Output: {d.output}</div></div>)}</div>
            </div>
            <div className="bg-white rounded-[2rem] border border-brand-primary/10 p-6">
              <h3 className="font-black">Improved headline</h3>
              <p className="mt-3 rounded-2xl bg-brand-accent/10 p-4 font-bold text-sm">{result.improved_headline}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

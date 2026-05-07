import React, { useState } from 'react';
import { UploadCloud, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { uploadResumePdf } from '../services/apiService';

export default function ResumeUploadView() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState('Python Backend Developer');
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!file) return setError('Upload your resume PDF first.');
    setLoading(true); setError('');
    try { setResult(await uploadResumePdf(file, role, jd)); }
    catch (e:any) { setError(e.message || 'Resume upload failed'); }
    finally { setLoading(false); }
  };

  const analysis = result?.analysis;
  return <div className="max-w-6xl mx-auto p-8 space-y-6">
    <div className="rounded-3xl bg-white border border-brand-primary/10 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-2"><UploadCloud className="text-brand-accent"/><h2 className="text-3xl font-black tracking-tight">Resume PDF Lab</h2></div>
      <p className="text-brand-primary/50 max-w-2xl">Upload a text-based PDF resume, paste a target JD, and get the 2-minute callback diagnosis: score, missing keywords, blockers, and a 7-day fix plan.</p>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-3xl bg-white p-6 border border-brand-primary/10 space-y-4">
        <label className="block text-xs font-black uppercase tracking-widest opacity-50">Target role</label>
        <input value={role} onChange={e=>setRole(e.target.value)} className="w-full rounded-xl border p-3 bg-brand-secondary/40" />
        <label className="block text-xs font-black uppercase tracking-widest opacity-50">Resume PDF</label>
        <input type="file" accept="application/pdf,text/plain" onChange={e=>setFile(e.target.files?.[0] || null)} className="w-full rounded-xl border p-3" />
        <label className="block text-xs font-black uppercase tracking-widest opacity-50">Job description</label>
        <textarea value={jd} onChange={e=>setJd(e.target.value)} rows={8} className="w-full rounded-xl border p-3 bg-brand-secondary/40" placeholder="Paste target JD here..." />
        {error && <div className="text-sm text-red-600 font-bold">{error}</div>}
        <button disabled={loading} onClick={submit} className="w-full py-4 rounded-2xl bg-brand-primary text-brand-secondary font-black hover:scale-[1.01] active:scale-95 transition">
          {loading ? 'Analyzing...' : 'Analyze Resume Gap'}
        </button>
      </div>
      <div className="rounded-3xl bg-white p-6 border border-brand-primary/10 min-h-[420px]">
        {!analysis ? <div className="h-full flex flex-col items-center justify-center text-center text-brand-primary/40"><FileText size={48}/><p className="mt-3 font-bold">Your score and fix plan appears here.</p></div> : <div className="space-y-5">
          <div className="flex items-end justify-between"><div><p className="text-xs uppercase font-black opacity-40">Match Score</p><h3 className="text-6xl font-black">{analysis.score}<span className="text-xl opacity-40">/100</span></h3></div><Sparkles className="text-brand-accent"/></div>
          <div><h4 className="font-black mb-2">Top blockers</h4><div className="space-y-2">{analysis.top_blockers.map((x:string,i:number)=><div key={i} className="p-3 rounded-xl bg-red-50 text-sm font-medium">{x}</div>)}</div></div>
          <div><h4 className="font-black mb-2">Missing keywords</h4><div className="flex flex-wrap gap-2">{analysis.missing_keywords.map((x:string)=><span key={x} className="px-3 py-1 rounded-full bg-brand-primary/5 text-xs font-bold">{x}</span>)}</div></div>
          <div><h4 className="font-black mb-2">7-day fix plan</h4><div className="space-y-2">{analysis.seven_day_plan.map((x:string)=><div key={x} className="flex gap-2 text-sm"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5"/>{x}</div>)}</div></div>
        </div>}
      </div>
    </div>
  </div>
}

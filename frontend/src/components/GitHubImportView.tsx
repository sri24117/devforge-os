import React, { useState } from 'react';
import { Github, ShieldCheck, ExternalLink } from 'lucide-react';
import { getV6GithubAuthUrl, importGithubRepoV6 } from '../services/apiService';

export default function GitHubImportView(){
  const [repo,setRepo]=useState(''); const [result,setResult]=useState<any>(null); const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false);
  const connect=async()=>{ const r:any=await getV6GithubAuthUrl(); if(r?.url) window.open(r.url,'_blank'); else setMsg(r?.message || 'GitHub OAuth not configured yet. Public repo import still works.'); };
  const analyze=async()=>{ setLoading(true); setMsg(''); try{ setResult(await importGithubRepoV6(repo)); }catch(e:any){ setMsg(e.message||'GitHub import failed'); } finally{ setLoading(false);} };
  return <div className="max-w-6xl mx-auto p-8 space-y-6">
    <div className="rounded-3xl bg-white border border-brand-primary/10 p-8 shadow-sm flex items-center justify-between gap-6">
      <div><div className="flex items-center gap-3 mb-2"><Github className="text-brand-accent"/><h2 className="text-3xl font-black tracking-tight">GitHub Import + Repo Proof</h2></div><p className="text-brand-primary/50 max-w-2xl">Analyze whether a repo is interview-ready: README, Docker, tests, env example, docs, demo proof.</p></div>
      <button onClick={connect} className="px-5 py-3 rounded-2xl bg-brand-primary text-brand-secondary font-black flex gap-2"><ShieldCheck size={18}/> Connect GitHub</button>
    </div>
    {msg && <div className="rounded-2xl p-4 bg-yellow-50 text-yellow-800 font-bold text-sm">{msg}</div>}
    <div className="rounded-3xl bg-white p-6 border border-brand-primary/10 space-y-4">
      <label className="text-xs font-black uppercase tracking-widest opacity-50">Public repo URL or owner/repo</label>
      <div className="flex gap-3"><input value={repo} onChange={e=>setRepo(e.target.value)} className="flex-1 rounded-xl border p-3" placeholder="https://github.com/sri24117/devforge"/><button onClick={analyze} disabled={loading} className="px-6 rounded-xl bg-brand-accent text-white font-black">{loading?'Scanning...':'Analyze'}</button></div>
    </div>
    {result && <div className="grid lg:grid-cols-3 gap-6">
      <div className="rounded-3xl bg-white p-6 border border-brand-primary/10"><p className="text-xs uppercase font-black opacity-40">Repo Score</p><h3 className="text-6xl font-black">{result.score}<span className="text-xl opacity-40">/100</span></h3><p className="mt-2 text-sm opacity-60">{result.repo} · {result.language || 'Mixed'}</p></div>
      <div className="lg:col-span-2 rounded-3xl bg-white p-6 border border-brand-primary/10 space-y-4"><h4 className="font-black">Fix before applying</h4>{result.missing?.map((m:string)=><div key={m} className="p-3 rounded-xl bg-brand-primary/5 text-sm font-bold">{m}</div>)}<div className="p-4 rounded-2xl bg-green-50 text-green-900 text-sm font-bold flex gap-2"><ExternalLink size={18}/>{result.interview_pitch}</div></div>
    </div>}
  </div>
}

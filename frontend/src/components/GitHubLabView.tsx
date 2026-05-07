import React, { useState } from 'react';
import { Github, Loader2, CheckCircle2 } from 'lucide-react';
import { analyzeGithubProfile } from '../services/apiService';

export default function GitHubLabView() {
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState('devforge, multibot, attendance-management');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const run = async () => {
    setLoading(true);
    try {
      setResult(await analyzeGithubProfile({ github_username: username, repo_names: repos.split(',').map(r=>r.trim()).filter(Boolean), project_description: desc }));
    } finally { setLoading(false); }
  };

  return <div className="space-y-6">
    <header><div className="text-[10px] uppercase tracking-widest font-black text-brand-accent">Portfolio proof</div><h2 className="text-4xl font-black tracking-tighter flex gap-3 items-center"><Github/> GitHub Lab</h2><p className="text-sm opacity-50">Score your developer proof before recruiters open your repo.</p></header>
    <div className="bg-white rounded-[2rem] border border-brand-primary/10 p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="GitHub username" className="rounded-2xl border border-brand-primary/10 p-4" />
      <input value={repos} onChange={e=>setRepos(e.target.value)} placeholder="Repo names, comma separated" className="rounded-2xl border border-brand-primary/10 p-4" />
      <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describe your main project proof: README, Docker, screenshots, tests, deployment..." className="lg:col-span-2 h-40 rounded-2xl border border-brand-primary/10 p-4 resize-none" />
      <button onClick={run} disabled={loading} className="lg:col-span-2 rounded-2xl bg-brand-primary text-brand-secondary py-4 font-black uppercase tracking-widest flex justify-center gap-2">{loading && <Loader2 className="animate-spin"/>} Analyze GitHub Proof</button>
    </div>
    {result && <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="bg-brand-primary text-brand-secondary rounded-[2rem] p-8"><div className="text-[10px] uppercase tracking-widest font-black text-brand-accent">GitHub Score</div><div className="text-7xl font-black mt-3">{result.score}</div><div className="font-black mt-2">{result.label}</div></div>
      <div className="lg:col-span-2 bg-white rounded-[2rem] border border-brand-primary/10 p-6"><h3 className="font-black">Quick fixes</h3><ul className="mt-4 space-y-2">{result.quick_fixes.map((f:string)=><li key={f} className="flex gap-2 text-sm"><CheckCircle2 size={16} className="text-brand-accent shrink-0"/> {f}</li>)}</ul><h3 className="font-black mt-6">README sections</h3><div className="mt-3 flex flex-wrap gap-2">{result.readme_sections.map((s:string)=><span key={s} className="px-3 py-1 rounded-full bg-brand-primary/5 text-xs font-bold">{s}</span>)}</div></div>
    </div>}
  </div>;
}

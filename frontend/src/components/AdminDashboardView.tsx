import React, { useEffect, useState } from 'react';
import { Shield, Users, Activity, Brain } from 'lucide-react';
import { getAdminSummary } from '../services/apiService';

export default function AdminDashboardView(){
  const [data,setData]=useState<any>(null); const [error,setError]=useState('');
  useEffect(()=>{getAdminSummary().then(setData).catch((e:any)=>setError(e.message||'Admin access failed'))},[]);
  if(error) return <div className="max-w-4xl mx-auto p-8"><div className="rounded-3xl bg-red-50 p-8 text-red-700 font-bold"><Shield/> {error}<p className="text-sm mt-2">Add your email to ADMIN_EMAILS in .env.</p></div></div>;
  if(!data) return <div className="p-8 font-black">Loading admin metrics...</div>;
  const cards=[['Users',data.total_users,Users],['Active 24h',data.active_today,Activity],['DSA Done',data.dsa_completed,Brain],['Focus Min',data.focus_minutes,Activity],['Applications',data.applications,Users],['AI Today',data.ai_interactions_today,Brain]];
  return <div className="max-w-6xl mx-auto p-8 space-y-6"><div className="rounded-3xl bg-brand-primary text-brand-secondary p-8"><h2 className="text-3xl font-black flex gap-3"><Shield/> Admin Control Room</h2><p className="opacity-60 mt-2">SaaS health, activation, practice depth, AI usage, and conversion risks.</p></div><div className="grid md:grid-cols-3 gap-4">{cards.map(([l,v,Icon]:any)=><div key={l} className="rounded-3xl bg-white p-6 border border-brand-primary/10"><Icon className="text-brand-accent"/><p className="text-xs uppercase font-black opacity-40 mt-3">{l}</p><h3 className="text-4xl font-black">{v}</h3></div>)}</div><div className="rounded-3xl bg-white p-6 border border-brand-primary/10"><h3 className="font-black mb-3">Conversion risks</h3>{data.conversion_risks.map((r:string)=><div key={r} className="p-3 rounded-xl bg-yellow-50 mb-2 text-sm font-bold">{r}</div>)}</div></div>
}

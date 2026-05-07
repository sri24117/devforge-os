import React, { useEffect, useState } from 'react';
import { Building2, Target, BrainCircuit, FileText } from 'lucide-react';
import { getCompanyPacks } from '../services/apiService';

export default function CompanyPacksView() {
  const [packs, setPacks] = useState<any[]>([]);
  useEffect(()=>{ getCompanyPacks().then(d=>setPacks(d.packs)).catch(()=>setPacks([])); }, []);
  return <div className="space-y-6">
    <header><div className="text-[10px] uppercase tracking-widest font-black text-brand-accent">Role-specific prep</div><h2 className="text-4xl font-black tracking-tighter flex items-center gap-3"><Building2/> Company Packs</h2><p className="text-sm opacity-50">Not leaks — structured interview packs by company/role pattern.</p></header>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {packs.map(pack => <div key={pack.id} className="bg-white rounded-[2rem] border border-brand-primary/10 p-6 hover:shadow-xl transition-all">
        <div className="text-[10px] uppercase tracking-widest font-black text-brand-accent">{pack.role_fit}</div>
        <h3 className="text-2xl font-black tracking-tight mt-2">{pack.title}</h3>
        <p className="text-sm opacity-60 mt-2">{pack.hook}</p>
        <div className="mt-5 space-y-4">
          <Section icon={<Target size={16}/>} title="DSA patterns" items={pack.dsa_patterns}/>
          <Section icon={<BrainCircuit size={16}/>} title="System design" items={pack.system_design}/>
          <Section icon={<FileText size={16}/>} title="Resume keywords" items={pack.resume_keywords}/>
        </div>
      </div>)}
    </div>
  </div>;
}
function Section({icon,title,items}:{icon:React.ReactNode;title:string;items:string[]}){return <div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-50">{icon}{title}</div><div className="mt-2 flex flex-wrap gap-2">{items.map(i=><span key={i} className="px-2 py-1 rounded-full bg-brand-primary/5 text-[10px] font-bold">{i}</span>)}</div></div>}

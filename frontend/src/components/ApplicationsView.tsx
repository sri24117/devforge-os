import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Filter, MoreHorizontal, ExternalLink, ChevronRight, BrainCircuit, Code2, Terminal, MessageSquare, CheckCircle2, History } from 'lucide-react';
import { Application, InterviewRound } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function ApplicationsView() {
  const [apps, setApps] = useState<Application[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newApp, setNewApp] = useState({ company: '', role: '', status: 'Applied' });
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [rounds, setRounds] = useState<InterviewRound[]>([]);
  const [showAddRound, setShowAddRound] = useState(false);
  const [newRound, setNewRound] = useState({ round_name: '', type: 'DSA', questions_asked: '', user_answer: '', improvement_notes: '' });

  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(setApps);
  }, []);

  useEffect(() => {
    if (selectedApp) {
      fetch(`/api/applications/${selectedApp.id}/rounds`)
        .then(res => res.json())
        .then(setRounds);
    }
  }, [selectedApp]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApp)
    });
    setNewApp({ company: '', role: '', status: 'Applied' });
    setShowAdd(false);
    fetch('/api/applications').then(res => res.json()).then(setApps);
  };

  const handleAddRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    await fetch(`/api/applications/${selectedApp.id}/rounds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRound)
    });
    setNewRound({ round_name: '', type: 'DSA', questions_asked: '', user_answer: '', improvement_notes: '' });
    setShowAddRound(false);
    fetch(`/api/applications/${selectedApp.id}/rounds`).then(res => res.json()).then(setRounds);
  };

  const companyPrep: Record<string, any> = {
    'Razorpay': {
      questions: ['Explain idempotency in payment systems', 'How to handle double-spend problem?', 'Design a rate limiter for API'],
      patterns: ['Sliding Window', 'Heaps', 'Graphs'],
      topics: ['Distributed Transactions', 'Kafka Internals', 'Redis Caching Strategies']
    },
    'Freshworks': {
      questions: ['Multi-tenancy architecture in SaaS', 'Optimizing database queries for large datasets', 'Explain CAP theorem in context of their services'],
      patterns: ['Arrays & Hashing', 'Trees', 'Dynamic Programming'],
      topics: ['Microservices Communication', 'Elasticsearch for Search', 'Background Job Processing']
    }
  };

  const currentPrep = selectedApp ? (companyPrep[selectedApp.company] || {
    questions: ['Common backend architecture questions', 'Scalability and performance optimization', 'Database indexing and query optimization'],
    patterns: ['Common DSA patterns', 'System design basics', 'Behavioral questions'],
    topics: ['Microservices', 'Caching', 'Message Queues']
  }) : null;

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Job Pipeline</h2>
          <p className="text-brand-primary/50 font-serif italic">Track your applications and interview stages.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="px-6 py-3 bg-brand-primary text-brand-secondary rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Plus size={18} /> New Application
        </button>
      </header>

      {showAdd && (
        <div className="bg-white p-8 rounded-2xl border border-brand-accent shadow-xl">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Company</label>
              <input 
                required
                value={newApp.company}
                onChange={e => setNewApp({...newApp, company: e.target.value})}
                className="w-full p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-sm focus:outline-none focus:border-brand-accent"
                placeholder="e.g. Freshworks"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Role</label>
              <input 
                required
                value={newApp.role}
                onChange={e => setNewApp({...newApp, role: e.target.value})}
                className="w-full p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-sm focus:outline-none focus:border-brand-accent"
                placeholder="e.g. Backend Engineer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Status</label>
              <select 
                value={newApp.status}
                onChange={e => setNewApp({...newApp, status: e.target.value})}
                className="w-full p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-sm focus:outline-none focus:border-brand-accent"
              >
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-3 bg-brand-accent text-brand-primary font-black uppercase tracking-widest rounded-xl">Add</button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-3 border border-brand-primary/10 rounded-xl text-xs font-bold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-brand-primary/5 overflow-hidden">
        <div className="grid grid-cols-12 p-4 border-b border-brand-primary/5 text-[10px] font-black uppercase tracking-widest opacity-40">
          <div className="col-span-4">Company</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2">Applied Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1"></div>
        </div>
        <div className="divide-y divide-brand-primary/5">
          {apps.length === 0 ? (
            <div className="p-12 text-center opacity-40 italic font-serif">No applications tracked yet.</div>
          ) : (
            apps.map((app) => (
              <div 
                key={app.id} 
                onClick={() => setSelectedApp(app)}
                className="grid grid-cols-12 p-4 items-center hover:bg-brand-primary/5 transition-colors group cursor-pointer"
              >
                <div className="col-span-4 font-bold flex items-center gap-2">
                  {app.company}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="col-span-3 text-sm opacity-60">{app.role}</div>
                <div className="col-span-2 text-xs font-mono opacity-40">{app.applied_date}</div>
                <div className="col-span-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    app.status === 'Offer' ? 'bg-emerald-100 text-emerald-700' : 
                    app.status === 'Interviewing' ? 'bg-blue-100 text-blue-700' :
                    app.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-brand-primary/10 text-brand-primary/60'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-brand-primary/5">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedApp && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl border-l border-brand-primary/10 z-50 overflow-y-auto p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setSelectedApp(null)} className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-2">
                ← Back to Pipeline
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-3 py-1 bg-brand-primary/5 rounded-full">{selectedApp.status}</span>
              </div>
            </div>

            <div className="space-y-12">
              <header>
                <h3 className="text-5xl font-black tracking-tighter uppercase mb-2">{selectedApp.company}</h3>
                <p className="text-xl font-serif italic opacity-60">{selectedApp.role}</p>
              </header>

              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <BrainCircuit size={16} className="text-brand-accent" />
                    Company-Specific Prep
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-brand-primary text-brand-secondary rounded-2xl space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Common Questions</div>
                    <ul className="space-y-3">
                      {currentPrep?.questions.map((q: string, i: number) => (
                        <li key={i} className="text-xs leading-relaxed flex gap-3">
                          <span className="opacity-40">{i+1}.</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">DSA Patterns</div>
                      <div className="flex flex-wrap gap-2">
                        {currentPrep?.patterns.map((p: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-white border border-brand-primary/10 rounded text-[10px] font-bold uppercase tracking-wider">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">System Design Topics</div>
                      <ul className="space-y-2">
                        {currentPrep?.topics.map((t: string, i: number) => (
                          <li key={i} className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                            <div className="h-1 w-1 bg-brand-accent rounded-full" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <History size={16} className="text-brand-accent" />
                    Interview Rounds
                  </h4>
                  <button 
                    onClick={() => setShowAddRound(true)}
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-brand-primary text-brand-secondary rounded-lg"
                  >
                    Log Round
                  </button>
                </div>

                {showAddRound && (
                  <motion.form 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleAddRound} 
                    className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-accent space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase opacity-40">Round Name</label>
                        <input 
                          required
                          value={newRound.round_name}
                          onChange={e => setNewRound({...newRound, round_name: e.target.value})}
                          className="w-full p-2 bg-white border border-brand-primary/10 rounded-lg text-sm"
                          placeholder="e.g. Round 1: DSA"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase opacity-40">Type</label>
                        <select 
                          value={newRound.type}
                          onChange={e => setNewRound({...newRound, type: e.target.value as any})}
                          className="w-full p-2 bg-white border border-brand-primary/10 rounded-lg text-sm"
                        >
                          <option>DSA</option>
                          <option>Backend</option>
                          <option>System Design</option>
                          <option>Behavioral</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase opacity-40">Questions Asked</label>
                      <textarea 
                        required
                        value={newRound.questions_asked}
                        onChange={e => setNewRound({...newRound, questions_asked: e.target.value})}
                        className="w-full p-2 bg-white border border-brand-primary/10 rounded-lg text-sm h-20"
                        placeholder="What did they ask?"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="submit" className="py-3 bg-brand-accent text-brand-primary font-black uppercase tracking-widest rounded-xl text-xs">Save Round</button>
                      <button type="button" onClick={() => setShowAddRound(false)} className="py-3 border border-brand-primary/10 rounded-xl text-xs font-bold">Cancel</button>
                    </div>
                  </motion.form>
                )}

                <div className="space-y-4">
                  {rounds.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-brand-primary/5 rounded-2xl opacity-40 italic font-serif">
                      No rounds logged yet. Start tracking your progress.
                    </div>
                  ) : (
                    rounds.map((round, i) => (
                      <div key={round.id} className="p-6 bg-white border border-brand-primary/5 rounded-2xl space-y-4 hover:border-brand-accent/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-brand-primary/5 flex items-center justify-center">
                              {round.type === 'DSA' ? <Code2 size={16} /> : 
                               round.type === 'Backend' ? <Terminal size={16} /> :
                               round.type === 'System Design' ? <BrainCircuit size={16} /> : <MessageSquare size={16} />}
                            </div>
                            <div>
                              <div className="text-sm font-bold">{round.round_name}</div>
                              <div className="text-[10px] uppercase tracking-wider opacity-40">{round.timestamp}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase px-2 py-1 bg-brand-primary/5 rounded">{round.type}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Questions</div>
                            <p className="text-xs leading-relaxed opacity-70">{round.questions_asked}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Improvement Notes</div>
                            <p className="text-xs leading-relaxed italic text-brand-accent">{round.improvement_notes || 'No notes added yet.'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Sent', value: apps.length },
          { label: 'Interviews', value: apps.filter(a => a.status === 'Interviewing').length },
          { label: 'Response Rate', value: apps.length ? `${Math.round((apps.filter(a => a.status !== 'Applied').length / apps.length) * 100)}%` : '0%' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-brand-primary/5">
            <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{stat.label}</div>
            <div className="text-3xl font-black">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, CheckCircle2, X, Loader2, Timer, Brain, MessageSquare, Sparkles, Dumbbell } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { DSAProblem } from '../types';
import { getDSAProblems, executeCodeWithTests, completeDSAProblem, aiGetHint, logFocusSession } from '../services/apiService';

const TESTS: Record<string, any[]> = {
  'Two Sum': [
    { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { args: [[3, 2, 4], 6], expected: [1, 2] },
    { args: [[3, 3], 6], expected: [0, 1] },
  ],
  'Valid Parentheses': [
    { args: ['()'], expected: true },
    { args: ['()[]{}'], expected: true },
    { args: ['(]'], expected: false },
  ],
  'Best Time to Buy and Sell Stock': [
    { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
    { args: [[7, 6, 4, 3, 1]], expected: 0 },
  ],
};

const STARTERS: Record<string, string> = {
  'Two Sum': `def solve(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        need = target - n\n        if need in seen:\n            return [seen[need], i]\n        seen[n] = i\n    return []`,
  'Valid Parentheses': `def solve(s):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for ch in s:\n        if ch in pairs.values():\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return not stack`,
  'Best Time to Buy and Sell Stock': `def solve(prices):\n    min_price = float('inf')\n    best = 0\n    for price in prices:\n        min_price = min(min_price, price)\n        best = max(best, price - min_price)\n    return best`,
};

function starterFor(problem?: DSAProblem | null) {
  if (!problem) return `def solve():\n    return None`;
  return STARTERS[problem.title] || `def solve(*args):\n    # Write your ${problem.title} solution here\n    return None`;
}

function targetMinutes(difficulty?: string) {
  if (difficulty === 'Hard') return 45;
  if (difficulty === 'Medium') return 35;
  return 20;
}

export default function PracticeView() {
  const [problems, setProblems] = useState<DSAProblem[]>([]);
  const [selected, setSelected] = useState<DSAProblem | null>(null);
  const [code, setCode] = useState('');
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [hint, setHint] = useState('');
  const [hinting, setHinting] = useState(false);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [reflection, setReflection] = useState('');
  const [confidence, setConfidence] = useState(3);

  useEffect(() => {
    setLoading(true);
    getDSAProblems().then(data => {
      setProblems(data);
      if (data.length && !selected) {
        const first = data.find(p => !p.completed) || data[0];
        setSelected(first);
        setCode(starterFor(first));
      }
    }).catch((e:any) => setLoadError(e.message || 'Could not load problems')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [selected]);

  const tests = useMemo(() => selected ? (TESTS[selected.title] || []) : [], [selected]);
  const target = targetMinutes(selected?.difficulty);
  const overTarget = time / 60 > target;

  const fmt = (s:number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  const selectProblem = (p: DSAProblem) => {
    setSelected(p); setTime(0); setResult(null); setHint(''); setReflection(''); setConfidence(3); setCode(starterFor(p));
  };

  const runCode = async () => {
    if (!selected) return;
    setRunning(true); setResult(null);
    try {
      const data = await executeCodeWithTests(code, tests, 'solve', selected.title);
      setResult(data);
    } catch (e:any) {
      setResult({ stderr: e.message || 'Execution failed. Check backend /api/execute logs.' });
    } finally { setRunning(false); }
  };

  const askHint = async () => {
    if (!selected) return;
    setHinting(true);
    try {
      const { response } = await aiGetHint(selected.title, code);
      setHint(response);
    } catch (e:any) { setHint(e.message || 'AI hint failed'); }
    finally { setHinting(false); }
  };

  const complete = async () => {
    if (!selected) return;
    await completeDSAProblem(selected.id, { time_taken: time, confidence, reflection });
    await logFocusSession({ context: 'practice', task_title: selected.title, target_minutes: target, elapsed_seconds: time, completed: true, difficulty: selected.difficulty });
    const updated = await getDSAProblems();
    setProblems(updated);
    const next = updated.find(p => !p.completed) || updated[0] || null;
    setReflectionOpen(false);
    if (next) selectProblem(next);
  };

  return <div className="space-y-6">
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="text-[10px] uppercase tracking-widest font-black text-brand-accent flex items-center gap-2"><Dumbbell size={14}/> Timed coding reps</div>
        <h2 className="text-4xl font-black tracking-tighter">Practice Gym</h2>
        <p className="text-sm opacity-50">Python compiler fixed: function-based tests, clearer errors, target-time pressure.</p>
      </div>
      {selected && <div className={`rounded-2xl px-5 py-3 border font-mono font-black ${overTarget ? 'bg-red-500 text-white border-red-500' : 'bg-white border-brand-primary/10'}`}><Timer className="inline mr-2" size={18}/>{fmt(time)} <span className="text-xs opacity-60">/ {target}m target</span></div>}
    </header>

    {loading && <div className="bg-white rounded-3xl p-8 flex items-center gap-3"><Loader2 className="animate-spin"/> Loading practice problems...</div>}
    {loadError && <div className="bg-red-50 text-red-600 rounded-3xl p-6 font-bold">{loadError}</div>}

    {!loading && <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <aside className="lg:col-span-4 bg-white rounded-[2rem] border border-brand-primary/10 overflow-hidden">
        <div className="p-5 border-b border-brand-primary/10 flex justify-between"><span className="font-black">Problem List</span><span className="text-xs opacity-50">{problems.filter(p=>p.completed).length}/{problems.length}</span></div>
        <div className="max-h-[70vh] overflow-y-auto divide-y divide-brand-primary/5">
          {problems.map(p => <button key={p.id} onClick={()=>selectProblem(p)} className={`w-full text-left p-4 hover:bg-brand-primary/5 ${selected?.id===p.id?'bg-brand-accent/10':''}`}>
            <div className="flex items-center justify-between gap-3"><div className="font-black text-sm">{p.title}</div>{p.completed ? <CheckCircle2 size={16} className="text-emerald-500"/> : <span className="h-3 w-3 rounded-full border border-brand-primary/20"/>}</div>
            <div className="mt-1 flex gap-2 text-[10px] uppercase tracking-widest font-bold opacity-50"><span>{p.pattern}</span><span>·</span><span>{p.difficulty}</span></div>
          </button>)}
        </div>
      </aside>

      <main className="lg:col-span-8 space-y-4">
        <div className="bg-brand-primary text-brand-secondary rounded-[2rem] overflow-hidden border border-brand-primary">
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <div><div className="text-[10px] uppercase tracking-widest font-black text-brand-accent">Active rep</div><h3 className="text-xl font-black">{selected?.title || 'Select a problem'}</h3></div>
            <div className="flex gap-2"><button onClick={askHint} disabled={!selected || hinting} className="px-4 py-2 rounded-xl bg-white/10 text-xs font-black uppercase tracking-widest flex gap-2 items-center">{hinting ? <Loader2 className="animate-spin" size={14}/> : <MessageSquare size={14}/>} Hint</button><button onClick={runCode} disabled={!selected || running} className="px-5 py-2 rounded-xl bg-brand-accent text-brand-primary text-xs font-black uppercase tracking-widest flex gap-2 items-center">{running ? <Loader2 className="animate-spin" size={14}/> : <Play size={14}/>} Run</button></div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 min-h-[520px]">
            <div className="border-r border-white/10"><Editor height="520px" defaultLanguage="python" theme="vs-dark" value={code} onChange={v=>setCode(v||'')} options={{fontSize:14,minimap:{enabled:false},scrollBeyondLastLine:false,padding:{top:18}}}/></div>
            <div className="bg-black/20 p-5 overflow-y-auto">
              <div className="text-[10px] uppercase tracking-widest font-black opacity-40 mb-4">Execution Output</div>
              {!result && <div className="text-sm opacity-30 italic">Run your code. Use def solve(...), not input().</div>}
              {result?.stderr && <pre className="whitespace-pre-wrap text-rose-300 bg-black/30 p-4 rounded-2xl text-xs">{result.stderr}</pre>}
              {result?.stdout && <pre className="whitespace-pre-wrap text-emerald-300 bg-black/30 p-4 rounded-2xl text-xs">{result.stdout}</pre>}
              {result && !result.stderr && !result.stdout && !result.test_results && <div className="rounded-2xl p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm font-bold">Code executed successfully. No test cases are configured for this problem yet.</div>}
              {result?.test_results && <div className="space-y-3">{result.test_results.map((t:any, i:number)=><div key={i} className={`rounded-2xl p-4 border ${t.passed?'bg-emerald-500/10 border-emerald-500/20':'bg-rose-500/10 border-rose-500/20'}`}><div className="flex items-center gap-2 font-black text-sm">{t.passed?<CheckCircle2 size={16} className="text-emerald-400"/>:<X size={16} className="text-rose-400"/>} Test {i+1}: {t.passed?'Passed':'Failed'}</div>{!t.passed && <div className="mt-2 text-xs opacity-70">Expected {JSON.stringify(t.expected)} · Got {JSON.stringify(t.actual)}</div>}</div>)}</div>}
              {hint && <div className="mt-4 rounded-2xl p-4 bg-brand-accent/10 border border-brand-accent/20"><div className="text-[10px] uppercase tracking-widest font-black text-brand-accent flex gap-2"><Brain size={14}/> AI Hint</div><p className="text-sm mt-2 whitespace-pre-wrap opacity-80">{hint}</p></div>}
            </div>
          </div>
        </div>
        <div className="flex justify-end"><button onClick={()=>setReflectionOpen(true)} disabled={!selected} className="px-6 py-4 rounded-2xl bg-brand-primary text-brand-secondary font-black uppercase tracking-widest flex gap-2"><Sparkles/> Submit & Explain</button></div>
      </main>
    </div>}

    <AnimatePresence>{reflectionOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setReflectionOpen(false)} className="absolute inset-0 bg-brand-primary/60 backdrop-blur-sm"/><motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.95}} className="relative bg-white rounded-[2rem] p-6 w-full max-w-2xl space-y-5"><h3 className="text-2xl font-black">Interview Reflection</h3><textarea value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Explain pattern, complexity, edge cases, and production lesson..." className="w-full h-40 rounded-2xl border border-brand-primary/10 p-4 resize-none"/><div><div className="text-xs font-black uppercase tracking-widest opacity-50 mb-2">Confidence</div><div className="flex gap-2">{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setConfidence(n)} className={`h-11 w-11 rounded-xl font-black ${confidence===n?'bg-brand-accent text-brand-primary':'bg-brand-primary/5'}`}>{n}</button>)}</div></div><button onClick={complete} className="w-full py-4 rounded-2xl bg-brand-primary text-brand-secondary font-black uppercase tracking-widest">Complete Rep</button></motion.div></div>}</AnimatePresence>
  </div>;
}

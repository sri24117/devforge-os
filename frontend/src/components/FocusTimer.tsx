import React, { useEffect, useMemo, useState } from 'react';
import { Clock, Pause, Play, RotateCcw, Save } from 'lucide-react';
import { logFocusSession } from '../services/apiService';

const targetByDifficulty: Record<string, number> = { Easy: 20, Medium: 35, Hard: 45 };

export default function FocusTimer({ taskTitle = 'Current task', difficulty = 'Medium', context = 'practice' }: { taskTitle?: string; difficulty?: string; context?: string }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [saved, setSaved] = useState(false);
  const targetMinutes = targetByDifficulty[difficulty] || 25;
  const overTarget = seconds > targetMinutes * 60;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => { setSeconds(0); setRunning(false); setSaved(false); }, [taskTitle]);

  const mmss = useMemo(() => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [seconds]);

  const save = async () => {
    await logFocusSession({ context, task_title: taskTitle, target_minutes: targetMinutes, elapsed_seconds: seconds, completed: true, difficulty });
    setSaved(true);
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl border ${overTarget ? 'border-red-500/30 bg-red-500/10 text-red-600' : 'border-brand-primary/10 bg-white/70 text-brand-primary'}`}>
      <Clock size={15}/>
      <div className="font-mono font-black text-sm">{mmss}</div>
      <div className="text-[10px] opacity-50 hidden sm:block">target {targetMinutes}m</div>
      <button onClick={() => setRunning(!running)} className="p-1 rounded-lg hover:bg-brand-primary/10">{running ? <Pause size={14}/> : <Play size={14}/>}</button>
      <button onClick={() => { setSeconds(0); setRunning(false); setSaved(false); }} className="p-1 rounded-lg hover:bg-brand-primary/10"><RotateCcw size={14}/></button>
      <button disabled={seconds === 0 || saved} onClick={save} className="p-1 rounded-lg hover:bg-brand-primary/10 disabled:opacity-30"><Save size={14}/></button>
    </div>
  );
}

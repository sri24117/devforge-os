import React, { useRef, useState } from 'react';
import { Mic, Square, Volume2 } from 'lucide-react';
import { reviewVoiceMock } from '../services/apiService';

declare global { interface Window { webkitSpeechRecognition?: any; SpeechRecognition?: any; } }

export default function VoiceMockView(){
  const [question,setQuestion]=useState('Tell me about your strongest backend project.');
  const [transcript,setTranscript]=useState(''); const [recording,setRecording]=useState(false); const [result,setResult]=useState<any>(null); const [started,setStarted]=useState<number|null>(null); const recogRef=useRef<any>(null);
  const start=()=>{ const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR){ alert('Speech recognition is not supported in this browser. Type transcript manually.'); return; } const r=new SR(); r.lang='en-IN'; r.continuous=true; r.interimResults=true; r.onresult=(e:any)=>{ let t=''; for(let i=0;i<e.results.length;i++) t+=e.results[i][0].transcript+' '; setTranscript(t.trim()); }; r.start(); recogRef.current=r; setStarted(Date.now()); setRecording(true); };
  const stop=()=>{ recogRef.current?.stop?.(); setRecording(false); };
  const submit=async()=>{ const duration=started?Math.round((Date.now()-started)/1000):undefined; setResult(await reviewVoiceMock({question, transcript, duration_seconds: duration, target_role:'Python Backend Developer'})); };
  return <div className="max-w-5xl mx-auto p-8 space-y-6">
    <div className="rounded-3xl bg-white p-8 border border-brand-primary/10"><div className="flex items-center gap-3"><Volume2 className="text-brand-accent"/><h2 className="text-3xl font-black">Voice Mock Interview</h2></div><p className="opacity-50 mt-2">Practice speaking. Get filler-word count, WPM, clarity, structure score, and better answer template.</p></div>
    <div className="rounded-3xl bg-white p-6 border border-brand-primary/10 space-y-4"><input value={question} onChange={e=>setQuestion(e.target.value)} className="w-full rounded-xl border p-3 font-bold"/><div className="flex gap-3"><button onClick={recording?stop:start} className={`px-5 py-3 rounded-2xl font-black flex gap-2 ${recording?'bg-red-600 text-white':'bg-brand-primary text-brand-secondary'}`}>{recording?<Square size={18}/>:<Mic size={18}/>} {recording?'Stop':'Start voice practice'}</button><button onClick={submit} className="px-5 py-3 rounded-2xl bg-brand-accent text-white font-black">Review Answer</button></div><textarea value={transcript} onChange={e=>setTranscript(e.target.value)} rows={8} className="w-full rounded-xl border p-3" placeholder="Transcript appears here, or type your answer manually..."/></div>
    {result && <div className="grid md:grid-cols-4 gap-4"><Metric label="Overall" value={result.overall_score}/><Metric label="Clarity" value={result.clarity_score}/><Metric label="Pace" value={result.pace_score}/><Metric label="WPM" value={result.words_per_minute}/><div className="md:col-span-4 rounded-3xl bg-white p-6 border border-brand-primary/10"><h4 className="font-black mb-3">Coach feedback</h4>{result.feedback.map((f:string)=><p key={f} className="p-3 rounded-xl bg-brand-primary/5 mb-2 text-sm font-bold">{f}</p>)}<p className="mt-4 text-sm opacity-60">Template: {result.improved_answer_template}</p></div></div>}
  </div>
}
function Metric({label,value}:{label:string;value:any}){return <div className="rounded-3xl bg-white p-6 border border-brand-primary/10"><p className="text-xs uppercase font-black opacity-40">{label}</p><h3 className="text-4xl font-black">{value}</h3></div>}

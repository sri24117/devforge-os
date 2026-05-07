import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, Code2, Terminal, Briefcase, ArrowRight, 
  BrainCircuit, Github, CheckCircle2, Loader2, Trophy,
  Lock, Unlock, Circle, ChevronRight, AlertCircle, TrendingUp,
  Map, Sparkles, MessageSquare, Monitor, Cloud, Search,
  ChevronDown, ChevronUp, Star, Lightbulb, Target, Copy
} from 'lucide-react';

// ─── DATA ───────────────────────────────────────────────────────────────────

const GAPS = [
  { area: "DSA / Algorithms", current: 15, needed: 85, priority: "CRITICAL", reason: "First elimination filter in every product company. No evidence of Leetcode/CP in resume." },
  { area: "System Design", current: 20, needed: 80, priority: "CRITICAL", reason: "You built monolithic apps. 30L roles need distributed thinking: queues, caching, sharding." },
  { area: "Python Depth", current: 72, needed: 90, priority: "HIGH", reason: "Good Django/Flask. Missing: async Python, concurrency, profiling, Celery, FastAPI." },
  { area: "CS Fundamentals", current: 40, needed: 80, priority: "HIGH", reason: "OS, networks, memory management—asked heavily at Atlassian, Razorpay, CRED." },
  { area: "AI/LLM Engineering", current: 78, needed: 95, priority: "MEDIUM", reason: "Your biggest moat. LangChain ✅ Gemini ✅ AWS Textract ✅. Needs: RAG, evals, agents at scale." },
  { area: "Cloud Architecture", current: 55, needed: 85, priority: "HIGH", reason: "AWS CCP ✅ but need hands-on: Lambda, ECS, SQS, CloudWatch, Terraform basics." },
  { area: "Communication / Storytelling", current: 60, needed: 88, priority: "MEDIUM", reason: "Metrics exist (30%, 99% uptime) but need STAR format mastery + system design narration." },
];

const PHASES = [
  {
    id: 1,
    label: "Phase 1",
    title: "DSA Foundation",
    days: "Day 1–30",
    color: "#ef4444",
    icon: <Code2 />,
    goal: "Survive screening rounds. Solve 120 patterned problems.",
    weeklyHours: 14,
    tracks: [
      {
        week: "Week 1–2",
        focus: "Arrays, Hashing, Sliding Window",
        problems: 30,
        tools: "Leetcode Easy→Medium",
        srikanth_edge: "Use your MySQL optimization mindset — hashing IS indexing",
        dailyPlan: [
          { time: "7–8am", task: "2 Leetcode problems (no solution for 30 min)" },
          { time: "8–8:30am", task: "Review pattern, write pattern note in Notion" },
          { time: "9pm", task: "1 revision problem from yesterday" },
        ],
        patterns: ["Two Pointer", "Sliding Window", "Hash Map", "Prefix Sum"],
        key_problems: ["Two Sum variants", "Longest substring without repeat", "Subarray sum = K", "Max profit stock"]
      },
      {
        week: "Week 3",
        focus: "Binary Search + Recursion",
        problems: 25,
        tools: "Leetcode + NeetCode.io",
        srikanth_edge: "BS = search in SORTED space. You already think in SQL ranges.",
        dailyPlan: [
          { time: "7–8am", task: "2 Binary search problems" },
          { time: "8pm", task: "Recursion: write tree of calls on paper" },
        ],
        patterns: ["Binary Search on answer", "Modified BS", "Recursion with memoization"],
        key_problems: ["Search rotated array", "Find peak element", "Koko eating bananas", "Median of arrays"]
      },
      {
        week: "Week 4",
        focus: "Linked Lists + Stacks + Queues",
        problems: 25,
        tools: "Blind75 subset",
        srikanth_edge: "Think of Django request middleware = stack. Log processing = queue.",
        dailyPlan: [
          { time: "Morning", task: "2 LL/Stack problems" },
          { time: "Evening", task: "Mock 30-min timed problem" },
        ],
        patterns: ["Fast-slow pointer", "Monotonic stack", "Deque tricks"],
        key_problems: ["Reverse LL", "LRU Cache", "Valid parentheses", "Min stack"]
      }
    ]
  },
  {
    id: 2,
    label: "Phase 2",
    title: "DSA Depth + CS Core",
    days: "Day 31–75",
    color: "#f97316",
    icon: <BrainCircuit />,
    goal: "Crack medium-hard. Learn Trees, Graphs, DP. Nail CS fundamentals.",
    weeklyHours: 18,
    tracks: [
      {
        week: "Week 5–6",
        focus: "Trees + Graphs (HIGH VALUE)",
        problems: 40,
        tools: "NeetCode roadmap",
        srikanth_edge: "Your LLM log analyser had dependency graphs. Trees = your thing.",
        dailyPlan: [
          { time: "Morning", task: "1 Tree + 1 Graph problem" },
          { time: "Evening", task: "Draw the tree/graph by hand — visualise before coding" },
        ],
        patterns: ["BFS/DFS", "Topological Sort", "Union-Find", "Tree DP"],
        key_problems: ["Word Ladder", "Clone graph", "Course schedule", "Diameter of tree"]
      },
      {
        week: "Week 7–8",
        focus: "Dynamic Programming (core 5 patterns)",
        problems: 35,
        tools: "DP patterns by Aditya Verma (YouTube)",
        srikanth_edge: "DP = optimal substructure. You already think modularly in APIs.",
        dailyPlan: [
          { time: "Morning", task: "Identify pattern first, code second" },
          { time: "Evening", task: "Explain solution out loud as if in interview" },
        ],
        patterns: ["0/1 Knapsack", "LCS", "Matrix DP", "Interval DP", "State machine DP"],
        key_problems: ["Coin change", "Longest palindrome", "Edit distance", "House robber"]
      },
      {
        week: "Week 9",
        focus: "CS Fundamentals Sprint",
        problems: 0,
        tools: "OS: OSTEP book Ch1-10. Networks: Julia Evans zines.",
        srikanth_edge: "AWS CCP gives you cloud mental model — extend it to OS + network layer.",
        dailyPlan: [
          { time: "Morning", task: "1hr OS or Networking concept" },
          { time: "Evening", task: "Write 5-bullet summary. Quiz yourself next morning." },
        ],
        patterns: ["Processes vs Threads", "Memory: heap/stack", "TCP vs UDP", "HTTP/2 vs WebSockets", "DB ACID"],
        key_problems: ["How does DNS work?", "Explain mutex vs semaphore", "What is virtual memory?", "How does TLS handshake work?"]
      },
    ]
  },
  {
    id: 3,
    label: "Phase 3",
    title: "System Design",
    days: "Day 45–90 (parallel)",
    color: "#8b5cf6",
    icon: <Monitor />,
    goal: "Design any system confidently. Know tradeoffs, not just buzzwords.",
    weeklyHours: 10,
    tracks: [
      {
        week: "Week 7–8",
        focus: "Core Building Blocks",
        problems: 0,
        tools: "Alex Xu: System Design Interview Vol 1",
        srikanth_edge: "You built attendance with MySQL. Now think: what if 10M users?",
        dailyPlan: [
          { time: "30 min daily", task: "Read 1 chapter OR watch 1 system design video" },
          { time: "20 min", task: "Draw architecture without looking" },
        ],
        patterns: ["Load Balancer", "CDN", "DB sharding", "Redis caching", "Message Queue (Kafka/SQS)"],
        key_problems: ["Design URL shortener", "Design rate limiter", "Design cache", "Design notification system"]
      },
      {
        week: "Week 9–12",
        focus: "Complex System Designs",
        problems: 0,
        tools: "Excalidraw for diagrams",
        srikanth_edge: "Your log analyser pipeline = you understand event-driven. Scale it mentally.",
        dailyPlan: [
          { time: "45 min", task: "Full system design mock (timed)" },
          { time: "15 min", task: "Self critique: What failed at 10x scale?" },
        ],
        patterns: ["Consistent hashing", "Leader election", "CAP theorem", "Saga pattern", "CQRS"],
        key_problems: ["Design WhatsApp", "Design YouTube", "Design Uber", "Design Slack"]
      }
    ]
  },
  {
    id: 4,
    label: "Phase 4",
    title: "Projects + Proof",
    days: "Day 60–90",
    color: "#10b981",
    icon: <Terminal />,
    goal: "2 killer projects that signal product-company readiness.",
    weeklyHours: 12,
    tracks: [
      {
        week: "Project 1",
        focus: "AI Agent with RAG + Evaluation (4 weeks)",
        problems: 0,
        tools: "LangChain + Supabase pgvector + FastAPI + Streamlit",
        srikanth_edge: "You already built Log Analyser. EXTEND it: add RAG, add eval metrics, add agent memory.",
        dailyPlan: [
          { time: "Week 1", task: "RAG pipeline: ingest docs → chunk → embed → Supabase pgvector" },
          { time: "Week 2", task: "Add LangChain agent with tools (search, summarize, classify)" },
          { time: "Week 3", task: "Add eval layer: faithfulness, relevance (use RAGAS library)" },
          { time: "Week 4", task: "FastAPI wrapper + deploy on AWS EC2 + write README with benchmarks" },
        ],
        patterns: ["RAG", "Agent tools", "Vector search", "LLM evaluation", "FastAPI"],
        key_problems: ["Must show: latency metrics", "Cost per query tracking", "Fallback handling", "Memory persistence"]
      },
      {
        week: "Project 2",
        focus: "Scalable Backend: Rate Limiter + Queue (2 weeks)",
        problems: 0,
        tools: "FastAPI + Redis + Celery + PostgreSQL + Docker",
        srikanth_edge: "Your 1000+ daily attendance system = you understand write volume. Now handle 1M req/day.",
        dailyPlan: [
          { time: "Week 1", task: "Token bucket rate limiter in Redis. FastAPI middleware. Load test with Locust." },
          { time: "Week 2", task: "Add Celery task queue. Async email/notification processing. Docker Compose it." },
        ],
        patterns: ["Rate limiting", "Task queue", "Async processing", "Docker", "Load testing"],
        key_problems: ["Handle 10k req/s", "Graceful degradation", "Dead letter queue", "Observability with logs"]
      }
    ]
  }
];

const COMPANIES = [
  { name: "Freshworks", lpa: "20–35", tier: "A", location: "Chennai/Hyderabad", focus: "Python + DSA + System Design", realistic: 78, round1: "OA: 2 Leetcode Mediums", round2: "System Design: SaaS feature", round3: "Hiring Manager round" },
  { name: "Razorpay", lpa: "25–45", tier: "A+", location: "Bangalore/Remote", focus: "Python + Infra + Payments domain", realistic: 62, round1: "Phone screen: 1 medium", round2: "3x coding rounds", round3: "System design: Payment gateway" },
  { name: "CRED", lpa: "30–55", tier: "A+", location: "Bangalore", focus: "DSA Heavy + System Design", realistic: 55, round1: "OA: 3 problems (hard difficulty)", round2: "2x Tech rounds", round3: "Arch round" },
  { name: "Zomato/Blinkit", lpa: "20–40", tier: "A", location: "Gurugram/Remote", focus: "Python + Scale problems", realistic: 65, round1: "DSA: 2 problems", round2: "System Design: logistics", round3: "Culture + bar raiser" },
  { name: "Atlassian", lpa: "35–70", tier: "S", location: "Bangalore/Remote", focus: "Values + DSA + SD", realistic: 52, round1: "Code review assignment", round2: "3x rounds: DSA+SD+Values", round3: "Bar raiser (senior engineer)" },
  { name: "Chargebee", lpa: "20–35", tier: "A", location: "Chennai/Remote", focus: "Python + SaaS + API design", realistic: 80, round1: "Take-home: API design task", round2: "Tech deep dive", round3: "Founder interview" },
  { name: "Postman", lpa: "25–45", tier: "A+", location: "Bangalore", focus: "APIs + Python + SD", realistic: 68, round1: "Coding + API design", round2: "System Design", round3: "Cross-functional interview" },
  { name: "Observe.ai", lpa: "18–35", tier: "A", location: "Hyderabad/Remote", focus: "AI + Python + NLP", realistic: 85, round1: "ML/NLP coding round", round2: "System Design: AI infra", round3: "Bar raiser" },
  { name: "Yellow.ai", lpa: "15–30", tier: "B+", location: "Hyderabad", focus: "Python + LLM + Chatbots", realistic: 88, round1: "LLM coding task", round2: "System design: chatbot infra", round3: "Founder/CTO chat" },
  { name: "Sarvam AI", lpa: "20–50", tier: "A+", location: "Bangalore/Remote", focus: "AI infra + Python + LLM", realistic: 72, round1: "AI/ML coding task", round2: "Research + system thinking", round3: "Values alignment" },
  { name: "BrowserStack", lpa: "20–38", tier: "A", location: "Mumbai/Remote", focus: "Python + Distributed + Testing", realistic: 67, round1: "DSA: 2 problems", round2: "Infra system design", round3: "Team fit" },
  { name: "Publicis Sapient", lpa: "12–22", tier: "B", location: "Hyderabad", focus: "Python + AWS + client delivery", realistic: 91, round1: "Technical screen", round2: "Case study: API design", round3: "HR + negotiation" },
];

const DSA_PATTERNS = [
  { pattern: "Two Pointer", problems: ["Valid palindrome", "3Sum", "Container with most water", "Trapping rain water"], done: false },
  { pattern: "Sliding Window", problems: ["Max sum subarray", "Longest substr no repeat", "Minimum window substr", "Fruits in baskets"], done: false },
  { pattern: "Binary Search", problems: ["Search rotated", "Find minimum rotated", "Koko bananas", "Median sorted arrays"], done: false },
  { pattern: "Trees: BFS/DFS", problems: ["Level order traversal", "Zigzag traversal", "Right side view", "Binary tree paths"], done: false },
  { pattern: "Trees: DP on tree", problems: ["Diameter", "Max path sum", "House robber III", "Binary tree cameras"], done: false },
  { pattern: "Graph: BFS/DFS", problems: ["Number of islands", "Clone graph", "Pacific Atlantic water", "Surrounded regions"], done: false },
  { pattern: "Graph: Topo Sort", problems: ["Course schedule I", "Course schedule II", "Alien dictionary", "Sequence reconstruction"], done: false },
  { pattern: "DP: 1D", problems: ["Climbing stairs", "House robber", "Coin change", "Word break"], done: false },
  { pattern: "DP: 2D / Grid", problems: ["Unique paths", "Min path sum", "Maximal square", "Edit distance"], done: false },
  { pattern: "Heap / Priority Queue", problems: ["Top K frequent", "K closest points", "Find median stream", "Task scheduler"], done: false },
];

const AI_PROMPT_TEMPLATES = [
  {
    mode: "Interviewer Mode",
    prompt: `You are a senior FAANG engineer interviewing me for a Python backend role.\nProblem: [paste problem here]\nRules:\n- Give ZERO code solutions\n- Give 3 progressive hints if I'm stuck (hint1 = direction, hint2 = approach, hint3 = pseudocode only)\n- After I code, critique: time complexity, edge cases, production concerns\n- Ask 2 follow-up questions like a real interviewer would`,
    useWhen: "Every Leetcode session"
  },
  {
    mode: "System Design Critic",
    prompt: `I'm designing [SYSTEM NAME] for [SCALE: 1M users, 10k req/s, etc].\nHere's my architecture: [your design]\nCritique this like a principal engineer:\n1. Single points of failure?\n2. What breaks first at 10x load?\n3. What would you redesign and why?\n4. What did I miss in data consistency?\n5. Suggest 2 real-world alternatives`,
    useWhen: "After every system design attempt"
  },
  {
    mode: "Code Optimizer",
    prompt: `Here's my Python solution: [paste code]\nProblem was: [problem statement]\nAnalyse:\n1. Time + space complexity (with proof)\n2. Hidden inefficiencies (loop inside loop, unnecessary copies, etc.)\n3. Pythonic improvements\n4. Production concerns (what if input is 10M items?)\n5. Rewrite only the bottleneck, explain why`,
    useWhen: "After solving any medium/hard"
  },
  {
    mode: "CS Fundamentals Drill",
    prompt: `Quiz me like a senior Atlassian engineer on: [topic: OS/Networks/DB]\nFormat:\n- Ask 1 question at a time\n- Wait for my answer\n- Score: Correct/Partial/Wrong + explanation\n- After 5 questions, give my weak areas\nTopics today: [list 3 specific topics]`,
    useWhen: "CS fundamentals study sessions"
  },
  {
    mode: "Resume Story Coach",
    prompt: `My resume bullet: "[paste your bullet point]"\nHelp me convert this to a STAR story for a 30 LPA interview:\n- Situation: context that shows scale/complexity\n- Task: what specifically was your ownership?  \n- Action: technical decisions YOU made (not team)\n- Result: quantified business impact\nMake it sound like a senior engineer, not a junior dev`,
    useWhen: "Interview prep, HR rounds"
  }
];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function GapBar({ gap }: { gap: any }) {
  const priorityColor = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#eab308" };
  const c = priorityColor[gap.priority as keyof typeof priorityColor];
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-5 bg-white rounded-2xl border border-brand-primary/5 shadow-sm"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-black tracking-tight text-brand-primary">{gap.area}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest" style={{ background: `${c}15`, color: c }}>
          {gap.priority}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-1.5 bg-brand-primary/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${gap.current}%` }}
              className="h-full bg-brand-primary/20"
            />
          </div>
          <span className="text-[10px] font-bold text-brand-primary/40 min-w-[50px]">NOW: {gap.current}%</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-1.5 bg-brand-primary/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${gap.needed}%` }}
              style={{ background: c }}
              className="h-full"
            />
          </div>
          <span className="text-[10px] font-bold min-w-[50px]" style={{ color: c }}>NEED: {gap.needed}%</span>
        </div>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-brand-primary/60 font-serif italic">{gap.reason}</p>
    </motion.div>
  );
}

function PhaseCard({ phase, expanded, onToggle }: { phase: any, expanded: boolean, onToggle: () => void }) {
  return (
    <div className={`mb-4 rounded-2xl border transition-all overflow-hidden ${expanded ? 'border-brand-accent shadow-xl' : 'border-brand-primary/5 bg-white'}`}>
      <button
        onClick={onToggle}
        className={`w-full p-6 flex items-center gap-6 text-left transition-colors ${expanded ? 'bg-brand-primary text-brand-secondary' : 'bg-white hover:bg-brand-primary/5'}`}
      >
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${expanded ? 'bg-white/10' : 'bg-brand-primary/5 text-brand-primary'}`}>
          {phase.icon}
        </div>
        <div className="flex-1">
          <div className="flex gap-3 items-center mb-1">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${expanded ? 'text-brand-accent' : 'text-brand-primary/40'}`}>
              {phase.label} · {phase.days}
            </span>
            <span className={`text-[10px] font-bold ${expanded ? 'text-white/40' : 'text-brand-primary/20'}`}>
              ~{phase.weeklyHours}h/week
            </span>
          </div>
          <div className={`text-xl font-black tracking-tight ${expanded ? 'text-white' : 'text-brand-primary'}`}>
            {phase.title}
          </div>
        </div>
        {expanded ? <ChevronUp className="text-brand-accent" /> : <ChevronDown className="text-brand-primary/20" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-brand-primary/5 p-6 space-y-6"
          >
            <div className="pb-4 border-b border-brand-primary/5">
              <p className="text-xs font-bold text-brand-primary flex items-center gap-2">
                <Target size={14} className="text-brand-accent" />
                {phase.goal}
              </p>
            </div>

            {phase.tracks.map((t: any, i: number) => (
              <div key={i} className="p-6 bg-white rounded-xl border border-brand-primary/5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-brand-accent mb-1">{t.week}</div>
                    <div className="text-lg font-bold text-brand-primary">{t.focus}</div>
                  </div>
                  {t.problems > 0 && (
                    <div className="px-3 py-1 bg-brand-primary/5 rounded-full text-[10px] font-black text-brand-primary/60">
                      {t.problems} PROBLEMS
                    </div>
                  )}
                </div>

                {t.srikanth_edge && (
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                      <Sparkles size={12} />
                      Your Edge
                    </div>
                    <p className="text-xs font-bold text-emerald-700/80">{t.srikanth_edge}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/30 mb-3">Today's Protocol</div>
                    <div className="space-y-3">
                      {t.dailyPlan.map((d: any, j: number) => (
                        <div key={j} className="flex gap-4 items-start">
                          <span className="text-[10px] font-black text-brand-accent min-w-[80px] pt-0.5">{d.time}</span>
                          <span className="text-xs font-bold text-brand-primary/70 leading-relaxed">{d.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {t.patterns.map((p: string) => (
                      <span key={p} className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-brand-primary/5 text-brand-primary/40 rounded-md border border-brand-primary/5">
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-brand-primary/5">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/30 mb-3">High-Priority Focus</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {t.key_problems.map((p: string, k: number) => (
                        <div key={k} className="text-[10px] font-bold text-brand-primary/60 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-brand-accent" />
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompanyRow({ c }: { c: any }) {
  const realisticColor = c.realistic >= 80 ? "#10b981" : c.realistic >= 65 ? "#f59e0b" : "#ef4444";
  const tierColor = { S: "#f59e0b", "A+": "#8b5cf6", A: "#3b82f6", B: "#10b981", "B+": "#10b981" };
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="group mb-3 p-5 bg-white rounded-2xl border border-brand-primary/5 hover:border-brand-accent transition-all cursor-default"
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-black tracking-tight text-brand-primary">{c.name}</h4>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full" style={{ background: `${tierColor[c.tier as keyof typeof tierColor]}15`, color: tierColor[c.tier as keyof typeof tierColor] }}>
            Tier {c.tier}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-black text-emerald-600">₹{c.lpa} LPA</span>
          <div className="text-right">
            <div className="text-[14px] font-black" style={{ color: realisticColor }}>{c.realistic}%</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-brand-primary/20">Match</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-[10px] font-bold text-brand-primary/40 mb-4">
        <Map size={12} />
        {c.location}
        <span className="mx-2 opacity-20">|</span>
        <TrendingUp size={12} />
        {c.focus}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {[c.round1, c.round2, c.round3].map((r, i) => (
          <div key={i} className="px-3 py-2 bg-brand-primary/5 rounded-xl border border-brand-primary/5 group-hover:bg-white transition-colors">
            <div className="text-[8px] font-black uppercase tracking-widest text-brand-primary/30 mb-1">Round {i + 1}</div>
            <div className="text-[10px] font-black text-brand-primary/70">{r}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function RoadmapView() {
  const [tab, setTab] = useState("gaps");
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [checkedPatterns, setCheckedPatterns] = useState<Record<number, boolean>>({});

  const tabs = [
    { id: "gaps", label: "Analysis", icon: <TrendingUp size={14} /> },
    { id: "roadmap", label: "90-Day Plan", icon: <Map size={14} /> },
    { id: "companies", label: "Targets", icon: <Trophy size={14} /> },
    { id: "dsa", label: "DSA Tracker", icon: <Code2 size={14} /> },
    { id: "prompts", label: "AI Pilots", icon: <Sparkles size={14} /> },
  ];

  const totalCritical = GAPS.filter(g => g.priority === "CRITICAL").length;
  const avgGap = Math.round(GAPS.reduce((a, g) => a + (g.needed - g.current), 0) / GAPS.length);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-brand-primary/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-[0.3em]">
            <Sparkles size={14} />
            Execution Protocol Activated
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-brand-primary underline decoration-brand-accent/30 underline-offset-8">
            ₹30–90 LPA ROADMAP
          </h2>
          <p className="text-brand-primary/50 font-serif italic text-lg max-w-xl">
            Precision-engineered career pivot for Srikanth. 2 Years experience. BSc CS. Cloud + AI focus.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:text-right">
          <div>
            <div className="text-3xl font-black text-brand-primary tracking-tighter">{totalCritical}</div>
            <div className="text-[9px] font-black uppercase tracking-widest text-brand-primary/30">Critical Gaps</div>
          </div>
          <div>
            <div className="text-3xl font-black text-brand-accent tracking-tighter">90</div>
            <div className="text-[9px] font-black uppercase tracking-widest text-brand-primary/30">Day Cycle</div>
          </div>
        </div>
      </header>

      {/* Tab Navigator */}
      <nav className="flex flex-wrap gap-2 sticky top-0 z-10 py-4 bg-brand-secondary/80 backdrop-blur-xl">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
              tab === t.id 
                ? 'bg-brand-primary text-brand-secondary shadow-lg shadow-brand-primary/20 scale-105' 
                : 'bg-white text-brand-primary/40 border border-brand-primary/5 hover:bg-brand-primary/5'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </nav>

      {/* ── VIEWPORT ── */}
      <div className="min-h-[500px]">
          {/* ── GAP ANALYSIS ── */}
          {tab === "gaps" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 space-y-6">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-500/10 pb-4">
                    <Star size={16} />
                    Unfair Advantages
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Production LangChain + Gemini stack",
                      "Quantified 30% SQL Optimization metrics",
                      "End-to-end AI Log Ingestion architecture",
                      "AWS CCP + Hands-on Infrastructure",
                      "Real-world scale (1000+ daily users)"
                    ].map((adv, i) => (
                      <li key={i} className="flex gap-3 items-start text-xs font-bold text-emerald-800/70">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
                        {adv}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-brand-primary text-brand-secondary rounded-3xl shadow-xl shadow-brand-primary/10">
                  <div className="flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-widest mb-4">
                    <AlertCircle size={14} />
                    The Trap
                  </div>
                  <p className="text-sm font-serif italic opacity-60 leading-relaxed mb-6">
                    "AI specialists roles weigh System Thinking at 75%. Don't drown in LeetCode hards, but don't ignore the filter."
                  </p>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Status Check</div>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-black tracking-tighter text-brand-accent">{avgGap}%</span>
                      <span className="text-[8px] font-black uppercase opacity-40">Avg Gap</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-2">
                <div className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.4em] mb-6 pl-2">Gap Isolation Protocol</div>
                {GAPS.map((g, i) => <GapBar key={i} gap={g} />)}
              </div>
            </div>
          )}

          {/* ── ROADMAP ── */}
          {tab === "roadmap" && (
            <div className="max-w-4xl mx-auto space-y-8">
               <div className="bg-brand-primary text-brand-secondary p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-8 items-center border border-white/5">
                <div className="h-16 w-16 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-primary shadow-lg shadow-brand-accent/20 flex-shrink-0">
                  <Timer size={32} />
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tighter">Day-Zero Setup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { t: "07:00 AM", d: "DSA: Pattern Focus (High Stress)" },
                      { t: "08:30 AM", d: "Synthesis: Write pattern logic" },
                      { t: "09:00 PM", d: "System Design Chapter / Mock" },
                      { t: "10:30 PM", d: "Core CS / Project Component" }
                    ].map((sch, i) => (
                      <div key={i} className="flex gap-3 text-xs bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="font-black text-brand-accent">{sch.t}</span>
                        <span className="font-bold opacity-60">{sch.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {PHASES.map((p, i) => (
                  <PhaseCard
                    key={i} phase={p}
                    expanded={expandedPhase === i}
                    onToggle={() => setExpandedPhase(expandedPhase === i ? -1 : i)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── TARGETS ── */}
          {tab === "companies" && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-brand-accent rounded-3xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 mb-2">Primary Moat</div>
                  <div className="text-2xl font-black text-brand-primary tracking-tighter">AI INFRA & SAAS</div>
                  <p className="text-xs font-bold text-brand-primary/60 mt-1">Highest leverage for your specific experience.</p>
                </div>
                <div className="p-6 bg-brand-primary text-brand-secondary rounded-3xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-2">Strategy Protocol</div>
                  <div className="text-lg font-black tracking-tighter">STAGGERED APPLICATIONS</div>
                  <div className="flex gap-4 mt-2">
                    <span className="text-[10px] font-bold opacity-40">B Tier: Day 60</span>
                    <span className="text-[10px] font-bold opacity-40">A Tier: Day 75</span>
                    <span className="text-[10px] font-bold opacity-40">S Tier: Day 90</span>
                  </div>
                </div>
              </div>
              {[...COMPANIES].sort((a, b) => b.realistic - a.realistic).map((c, i) => (
                <CompanyRow key={i} c={c} />
              ))}
            </div>
          )}

          {/* ── DSA TRACKER ── */}
          {tab === "dsa" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                <div className="md:col-span-8 p-8 bg-white rounded-3xl border border-brand-primary/5 space-y-4">
                  <h3 className="text-2xl font-black tracking-tighter text-brand-primary uppercase">The 10-Pattern Engine</h3>
                  <p className="text-sm font-serif italic text-brand-primary/50">"Don't solve 500 problems. Master 10 patterns. Mastered = solved any variant in &lt;25 mins."</p>
                  <div className="flex gap-4 pt-4">
                    <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                       <CheckCircle2 size={12} />
                       Easy-Ready
                    </div>
                    <div className="px-4 py-2 bg-brand-accent/20 text-brand-primary/40 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-accent/20 flex items-center gap-2">
                       <Lock size={12} />
                       Med-Hard Mastery
                    </div>
                  </div>
                </div>
                <div className="md:col-span-4 bg-brand-primary text-brand-secondary p-8 rounded-3xl flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-1">Mastery Status</div>
                    <div className="text-5xl font-black text-white tracking-tighter leading-none">
                      {Object.values(checkedPatterns).filter(Boolean).length}
                      <span className="text-xl opacity-20 ml-2">/ {DSA_PATTERNS.length}</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-6 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(Object.values(checkedPatterns).filter(Boolean).length / DSA_PATTERNS.length) * 100}%` }}
                      className="h-full bg-brand-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DSA_PATTERNS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setCheckedPatterns(prev => ({ ...prev, [i]: !prev[i] }))}
                    className={`p-6 rounded-2xl border text-left transition-all relative group overflow-hidden ${
                      checkedPatterns[i] 
                        ? 'bg-emerald-500/5 border-emerald-500/20' 
                        : 'bg-white border-brand-primary/5 hover:border-brand-accent/50'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                        checkedPatterns[i] ? 'bg-emerald-500 text-white' : 'bg-brand-primary/5 text-brand-primary/20'
                      }`}>
                        {checkedPatterns[i] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </div>
                      <span className={`text-sm font-black tracking-tight transition-colors ${
                        checkedPatterns[i] ? 'text-emerald-700' : 'text-brand-primary'
                      }`}>{p.pattern}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      {p.problems.map((prob, j) => (
                        <span key={j} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-brand-primary/5 text-brand-primary/40 rounded-md">
                          {prob}
                        </span>
                      ))}
                    </div>
                    {checkedPatterns[i] && (
                      <div className="absolute top-2 right-2 text-emerald-500/10 -rotate-12 translate-x-1 -translate-y-1">
                        <Trophy size={48} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── AI PROMPTS ── */}
          {tab === "prompts" && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center gap-6 p-8 bg-brand-primary text-brand-secondary rounded-3xl border border-white/5">
                <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-brand-accent shrink-0">
                  <Sparkles size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-1 text-white">The AI Co-pilot Engine</h3>
                  <p className="text-sm font-serif italic opacity-60">
                    "Use AI as your senior mentor, not a solutions manual. These prompts are tuned for deep learning."
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {AI_PROMPT_TEMPLATES.map((t, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group bg-white rounded-3xl border border-brand-primary/5 overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="p-6 flex items-center justify-between border-b border-brand-primary/5">
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-brand-primary text-brand-secondary rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                          {t.mode}
                        </div>
                        <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">
                          When: {t.useWhen}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          const btn = e.currentTarget;
                          navigator.clipboard.writeText(t.prompt);
                          const originalInner = btn.innerHTML;
                          btn.innerHTML = '<span class="text-[8px] font-black uppercase">Copied!</span>';
                          btn.classList.add('text-emerald-500');
                          setTimeout(() => {
                            btn.innerHTML = originalInner;
                            btn.classList.remove('text-emerald-500');
                          }, 2000);
                        }}
                        className="flex items-center gap-2 p-2 hover:bg-brand-primary/5 rounded-lg text-brand-primary/20 hover:text-brand-accent transition-all"
                      >
                         <Copy size={18} />
                      </button>
                    </div>
                    <div className="p-8">
                      <div className="p-6 bg-brand-primary/[0.02] rounded-2xl border border-brand-primary/5 font-mono text-[11px] leading-relaxed text-brand-primary/70 whitespace-pre-wrap">
                        {t.prompt}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

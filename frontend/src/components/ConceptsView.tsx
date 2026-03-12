import React, { useState } from 'react';
import { BookOpen, ChevronRight, ExternalLink, Code, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getConceptSummary } from '../services/geminiService';

export default function ConceptsView() {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const concepts = [
    { title: 'REST Architecture', category: 'API Design', description: 'Understanding statelessness, resources, and HTTP verbs.' },
    { title: 'DB Indexing', category: 'Performance', description: 'B-Trees, Hash indexes, and query optimization strategies.' },
    { title: 'JWT Authentication', category: 'Security', description: 'Stateless auth, claims, and token lifecycle management.' },
    { title: 'Rate Limiting', category: 'System Design', description: 'Token bucket, leaky bucket, and fixed window algorithms.' },
    { title: 'Async Python', category: 'Language', description: 'Event loops, coroutines, and asyncio in FastAPI/Django.' },
    { title: 'Docker Basics', category: 'DevOps', description: 'Images, containers, and multi-stage builds for backend.' },
  ];

  const handleConceptClick = async (title: string) => {
    setSelectedConcept(title);
    setLoading(true);
    setSummary(null);
    try {
      const aiSummary = await getConceptSummary(title);
      setSummary(aiSummary || "Failed to generate summary.");
    } catch (error) {
      setSummary("An error occurred while generating the summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-black tracking-tighter uppercase">Knowledge Base</h2>
        <p className="text-brand-primary/50 font-serif italic">Quick reference for core backend interview topics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concepts.map((concept, i) => (
          <div 
            key={i} 
            onClick={() => handleConceptClick(concept.title)}
            className="bg-white p-6 rounded-2xl border border-brand-primary/5 hover:border-brand-accent/30 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 bg-brand-primary/5 text-[10px] font-black uppercase tracking-widest opacity-50 rounded">
                {concept.category}
              </span>
              <BookOpen size={16} className="opacity-20 group-hover:text-brand-accent group-hover:opacity-100 transition-all" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-brand-accent transition-colors">{concept.title}</h3>
            <p className="text-sm opacity-50 mb-6 line-clamp-2">{concept.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-brand-primary/5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                <Code size={12} /> 5 Min Read
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-primary text-brand-secondary p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h4 className="text-2xl font-black tracking-tight">Need a deeper dive?</h4>
          <p className="text-sm opacity-50">Ask the AI assistant to explain any concept in the context of your project.</p>
        </div>
        <button className="px-8 py-4 bg-brand-accent text-brand-primary font-black uppercase tracking-widest rounded-xl flex items-center gap-2 hover:scale-[1.05] transition-transform">
          Consult AI <ExternalLink size={18} />
        </button>
      </div>

      {/* Concept Summary Modal */}
      <AnimatePresence>
        {selectedConcept && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedConcept(null)}
              className="absolute inset-0 bg-brand-primary/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl max-h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <header className="p-6 border-b border-brand-primary/5 flex items-center justify-between bg-brand-secondary/30">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">AI Generated Summary</span>
                  <h3 className="text-2xl font-black tracking-tight uppercase">{selectedConcept}</h3>
                </div>
                <button 
                  onClick={() => setSelectedConcept(null)}
                  className="h-10 w-10 rounded-full hover:bg-brand-primary/5 flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-8">
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={40} className="animate-spin text-brand-accent" />
                    <p className="text-sm font-medium opacity-50 font-serif italic">Consulting the backend architect...</p>
                  </div>
                ) : (
                  <div className="prose prose-brand max-w-none prose-headings:font-black prose-headings:tracking-tight prose-pre:bg-brand-primary prose-pre:text-brand-secondary prose-code:text-brand-accent">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {summary || ""}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              <footer className="p-6 border-t border-brand-primary/5 bg-brand-secondary/30 flex justify-end">
                <button 
                  onClick={() => setSelectedConcept(null)}
                  className="px-6 py-2 bg-brand-primary text-brand-secondary rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  Close Summary
                </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

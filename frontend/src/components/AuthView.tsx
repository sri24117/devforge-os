import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Lock, Mail, User, ChevronRight } from 'lucide-react';
import { login, register } from '../services/apiService';

interface AuthViewProps {
  onLoginSuccess: () => void;
}

export default function AuthView({ onLoginSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login({ username: email, password });
        if (res.access_token) {
          localStorage.setItem('token', res.access_token);
          onLoginSuccess();
        }
      } else {
        await register({ email, password, name });
        // Auto login after register
        const res = await login({ username: email, password });
        if (res.access_token) {
          localStorage.setItem('token', res.access_token);
          onLoginSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-secondary flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/50 backdrop-blur-xl border border-brand-primary/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4 border border-brand-primary/20 shadow-inner">
              <BrainCircuit className="text-brand-accent w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
              DEVFORGE<span className="text-brand-accent">OS</span>
            </h1>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-primary/70 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary/40 group-focus-within:text-brand-accent transition-colors">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-brand-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm font-medium"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-primary/70 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary/40 group-focus-within:text-brand-accent transition-colors">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-brand-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-primary/70 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary/40 group-focus-within:text-brand-accent transition-colors">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-brand-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-xs text-center font-semibold mt-2">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-brand-secondary py-3.5 rounded-lg font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-brand-primary/90 hover:scale-[1.01] transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-70 disabled:cursor-not-allowed mt-8 border border-brand-primary/50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-brand-secondary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Protocol'}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-[11px] font-medium text-brand-primary/50 hover:text-brand-primary transition-colors uppercase tracking-wider hover:underline underline-offset-4"
            >
              {isLogin ? "Initialize New User" : "Return to Login"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

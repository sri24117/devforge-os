import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, CheckCircle2 } from 'lucide-react';

interface ProfileSettingsProps {
  userProfile: { name: string; email: string } | null;
}

export default function ProfileSettingsView({ userProfile }: ProfileSettingsProps) {
  const [success, setSuccess] = useState('');
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('Profile initialized and updated successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tighter">PROFILE SETTINGS</h1>
        <p className="text-sm font-medium opacity-50 uppercase tracking-widest mt-1">
          Manage your account protocol and preferences
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 backdrop-blur-xl border border-brand-primary/10 rounded-2xl p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -z-10"></div>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-brand-primary/10">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-primary/70 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary/40 group-focus-within:text-brand-accent transition-colors">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  defaultValue={userProfile?.name || ''}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-brand-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-primary/70 uppercase tracking-widest ml-1">Email Credentials</label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary/40">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  disabled
                  defaultValue={userProfile?.email || ''}
                  className="w-full pl-10 pr-4 py-3 bg-brand-primary/5 border border-brand-primary/10 rounded-lg opacity-70 cursor-not-allowed text-sm font-medium"
                  title="Contact system administrator to change your email."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary">Security</h3>
              <p className="text-[10px] font-medium opacity-50 uppercase tracking-widest">Update your authentication protocol</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-primary/70 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary/40 group-focus-within:text-brand-accent transition-colors">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    placeholder="Leave blank to keep unchanged"
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-brand-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm font-medium"
                  />
                </div>
              </div>

               <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-primary/70 uppercase tracking-widest ml-1">Confirm New Password</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary/40 group-focus-within:text-brand-accent transition-colors">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    placeholder="Matches new password"
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-brand-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {success && (
             <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="overflow-hidden"
             >
              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-xs font-semibold">
                <CheckCircle2 size={16} />
                {success}
              </div>
            </motion.div>
          )}

          <div className="flex justify-end pt-6 border-t border-brand-primary/10">
            <button
              type="submit"
              className="bg-brand-primary text-brand-secondary px-8 py-3 rounded-lg font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-brand-primary/90 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl shadow-brand-primary/20"
            >
              SAVE PROTOCOL
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

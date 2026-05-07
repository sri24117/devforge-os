import React, { useEffect, useState } from 'react';
import { Shield, Trash2, UserPlus, UserMinus, Crown, RefreshCw, Search } from 'lucide-react';
import { getAdminUsers, updateUserSubscription, deleteUser } from '../services/apiService';

export default function AdminUsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdatePlan = async (userId: number, currentPlan: string) => {
    const nextPlanMap: Record<string, string> = {
      'free': 'pro',
      'pro': 'premium',
      'premium': 'free'
    };
    const nextPlan = nextPlanMap[currentPlan] || 'free';
    
    try {
      await updateUserSubscription(userId, nextPlan);
      await fetchUsers(); // Refresh
    } catch (e: any) {
      alert('Update failed: ' + e.message);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    
    try {
      await deleteUser(userId);
      await fetchUsers(); // Refresh
    } catch (e: any) {
      alert('Delete failed: ' + e.message);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="rounded-3xl bg-red-50 p-8 text-red-700 font-bold border-2 border-red-200">
        <Shield className="mb-4" />
        <h2 className="text-xl mb-2">Access Denied / Error</h2>
        {error}
        <p className="text-sm mt-4 opacity-70">
          Make sure your email is listed in <code className="bg-red-100 px-1 rounded">ADMIN_EMAILS</code> in your backend <code className="bg-red-100 px-1 rounded">.env</code> file.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-10 rounded-[3rem] shadow-sm border-white/60">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] mb-2">
            <Shield size={12} /> Root Access Verified
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase gradient-text leading-none">
            User Control<br/>
            <span className="text-2xl opacity-40">Database Management</span>
          </h2>
        </div>
        <button 
          onClick={fetchUsers}
          className="flex items-center gap-3 bg-brand-primary text-brand-secondary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-primary/20"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Database
        </button>
      </div>

      {/* Search bar */}
      <div className="relative group">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-accent transition-colors" />
        <input 
          type="text" 
          placeholder="SEARCH PROTOCOL BY NAME OR EMAIL..."
          className="w-full pl-16 pr-8 py-6 glass border-white/60 rounded-[2.5rem] font-black text-[10px] tracking-[0.2em] focus:outline-none focus:ring-4 focus:ring-brand-accent/10 transition-all uppercase placeholder:text-brand-primary/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="glass rounded-[3rem] border-white/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-primary/5 text-brand-primary/30 uppercase text-[9px] font-black tracking-[0.3em] border-b border-white/40">
                <th className="px-10 py-8">User Identity</th>
                <th className="px-10 py-8">Subscription Tier</th>
                <th className="px-10 py-8">Activity Sync</th>
                <th className="px-10 py-8 text-right">Direct Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <RefreshCw className="animate-spin mx-auto mb-6 text-brand-accent/20" size={64} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary/20">Decrypting User Data...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary/20">No matching protocols found.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/40 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl accent-gradient flex items-center justify-center font-black text-brand-primary text-2xl shadow-lg shadow-brand-accent/10">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-brand-primary tracking-tight text-lg">{user.name}</p>
                          <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-sm
                        ${user.plan === 'premium' ? 'bg-brand-accent text-brand-primary' : 
                          user.plan === 'pro' ? 'bg-brand-primary text-brand-secondary' : 'bg-white border border-brand-primary/5 text-brand-primary/40'}`}>
                        {user.plan === 'premium' && <Crown size={12} />}
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <p className="text-[11px] font-black text-brand-primary/60 uppercase tracking-tighter">
                          {user.last_active ? new Date(user.last_active).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'NEVER'}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <div className={`h-1.5 w-1.5 rounded-full ${user.last_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span className="text-[8px] font-black uppercase tracking-widest text-brand-primary/20">{user.last_active ? 'Sync Online' : 'Dormant'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleUpdatePlan(user.id, user.plan)}
                          title="Modify Tier"
                          className="h-12 w-12 rounded-xl glass flex items-center justify-center text-brand-primary hover:accent-gradient hover:text-brand-primary transition-all active:scale-90 border-white/60"
                        >
                          {user.plan === 'premium' ? <UserMinus size={18} /> : <UserPlus size={18} />}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          title="Purge User"
                          className="h-12 w-12 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 border border-red-500/10"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-4 p-8 glass-dark rounded-[2rem] text-white/50 text-[10px] font-black uppercase tracking-[0.1em]">
        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
          <Shield size={20} />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold mb-1">Administrative Protocol Warning</p>
          <span>User purging is irreversible. All algorithmic progress, architectural schemas, and telemetry data will be permanently erased from the node.</span>
        </div>
      </div>
    </div>
  );
}

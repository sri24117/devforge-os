import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Map, 
  Code2, 
  Briefcase, 
  BookOpen, 
  User, 
  ChevronRight, 
  Timer, 
  CheckCircle2, 
  Circle,
  Flame,
  Plus,
  ArrowRight,
  BrainCircuit,
  Terminal,
  Gamepad2,
  Layers,
  MessageSquare,
  Library,
  LogOut,
  Settings
} from 'lucide-react';
import { DashboardStats } from './types';
import { getDashboard, getMe } from './services/apiService';

// Views
import DashboardView from './components/DashboardView';
import RoadmapView from './components/RoadmapView';
import PracticeView from './components/PracticeView';
import ProjectView from './components/ProjectView';
import ApplicationsView from './components/ApplicationsView';
import ConceptsView from './components/ConceptsView';
import SimulatorView from './components/SimulatorView';
import SystemDesignView from './components/SystemDesignView';
import BehavioralTrainer from './components/BehavioralTrainer';
import MasterGuide from './components/MasterGuide';
import AuthView from './components/AuthView';
import ProfileSettingsView from './components/ProfileSettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{name: string, email: string} | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile();
    }
    setIsAuthLoading(false);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const me = await getMe();
      if (me) {
        setUserProfile({ name: me.name, email: me.email });
      }
    } catch (e) {
      console.error('Failed to get user profile', e);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  const fetchStats = async () => {
    try {
      const data = await getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Provide fallback stats so dashboard doesn't appear completely broken
      setStats({
        streak: 0,
        dsa: { total: 0, completed: 0 },
        project: { total: 0, completed: 0 },
        applications: { count: 0 },
        patterns: [],
        github: null,
        readinessScore: 0,
        weaknesses: ['No data yet — complete some problems to see insights'],
      });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        fetchStats();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'practice', label: 'Practice', icon: Code2 },
    { id: 'simulator', label: 'Simulator', icon: Gamepad2 },
    { id: 'system-design', label: 'System Design', icon: Layers },
    { id: 'behavioral', label: 'Behavioral', icon: MessageSquare },
    { id: 'master-guide', label: 'Master Guide', icon: BookOpen },
    { id: 'project', label: 'Project', icon: Terminal },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'concepts', label: 'Concepts', icon: Library },
  ];

  if (isAuthLoading) {
    return <div className="min-h-screen bg-brand-secondary flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <AuthView onLoginSuccess={() => {
      setIsAuthenticated(true);
      fetchUserProfile();
      fetchStats();
    }} />;
  }

  return (
    <div className="min-h-screen flex bg-brand-secondary">
      {/* Sidebar */}
      <aside className="w-64 border-r border-brand-primary/10 flex flex-col bg-white/50 backdrop-blur-sm">
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <BrainCircuit className="text-brand-accent" />
            DEVFORGE<span className="text-brand-accent">OS</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mt-1">Backend Interview Engine</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-brand-primary text-brand-secondary shadow-lg shadow-brand-primary/20' 
                  : 'text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-brand-primary/10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-brand-accent/10 text-brand-accent">
            <Flame size={18} fill="currentColor" />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
              <span className="text-lg font-black leading-none">{stats?.streak || 0} DAYS</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        <header className="h-16 border-b border-brand-primary/10 flex items-center justify-between px-8 bg-white/30 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-medium opacity-50 uppercase tracking-widest">
            <span>System</span>
            <ChevronRight size={12} />
            <span className="text-brand-primary opacity-100">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 mr-2 focus:outline-none group"
            >
              <div className="text-right hidden sm:block transition-transform group-hover:scale-[1.02]">
                <div className="text-sm font-bold text-brand-primary">{userProfile?.name || 'Developer'}</div>
                <div className="text-[10px] text-brand-primary/50 opacity-70 uppercase">{userProfile?.email || 'Authorized'}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary/20 transition-colors">
                <User size={16} />
              </div>
            </button>

            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-12 mt-1 w-56 bg-white/90 backdrop-blur-xl border border-brand-primary/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
                >
                  <div className="px-4 py-3 border-b border-brand-primary/10 bg-brand-primary/5 sm:hidden">
                    <div className="text-sm font-bold text-brand-primary truncate">{userProfile?.name || 'Developer'}</div>
                    <div className="text-[10px] text-brand-primary/50 uppercase truncate">{userProfile?.email || 'Authorized'}</div>
                  </div>
                  <button 
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setActiveTab('profile-settings');
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-brand-primary/80 hover:bg-brand-primary/5 hover:text-brand-primary transition-colors text-left"
                  >
                    <Settings size={16} />
                    Profile Settings
                  </button>
                  <div className="h-[1px] bg-brand-primary/10 w-full" />
                  <button 
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardView stats={stats} />}
              {activeTab === 'roadmap' && <RoadmapView />}
              {activeTab === 'practice' && <PracticeView />}
              {activeTab === 'simulator' && <SimulatorView />}
              {activeTab === 'system-design' && <SystemDesignView />}
              {activeTab === 'behavioral' && <BehavioralTrainer />}
              {activeTab === 'master-guide' && <MasterGuide />}
              {activeTab === 'project' && <ProjectView />}
              {activeTab === 'applications' && <ApplicationsView />}
              {activeTab === 'concepts' && <ConceptsView />}
              {activeTab === 'profile-settings' && <ProfileSettingsView userProfile={userProfile} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

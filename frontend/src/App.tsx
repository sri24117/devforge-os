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
  Settings,
  Sparkles,
  Target,
  Dumbbell,
  FileSearch,
  Github,
  Building2,
  UploadCloud,
  Volume2,
  ShieldCheck,
  CreditCard,
  Users
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
import AIWorkflowView from './components/AIWorkflowView';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import FocusTimer from './components/FocusTimer';
import MinimalHomeView from './components/MinimalHomeView';
import TrainingRoomView from './components/TrainingRoomView';
import ResumeLabView from './components/ResumeLabView';
import GitHubLabView from './components/GitHubLabView';
import CompanyPacksView from './components/CompanyPacksView';
import ResumeUploadView from './components/ResumeUploadView';
import GitHubImportView from './components/GitHubImportView';
import VoiceMockView from './components/VoiceMockView';
import AdminDashboardView from './components/AdminDashboardView';
import AdminUsersView from './components/AdminUsersView';
import PaymentsView from './components/PaymentsView';

export default function App() {
  // Sync tab with URL hash for better UX
  const getHashTab = () => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'today';
  };

  const [activeTab, setActiveTab] = useState(getHashTab());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string, email: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handler = () => setActiveTab(getHashTab());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const handleSetTab = (tab: string) => {
    window.location.hash = tab;
    setActiveTab(tab);
  };

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

  const checkAdminStatus = async () => {
    try {
      const { getEntitlements } = await import('./services/apiService');
      const entitlements = await getEntitlements();
      setIsAdmin(entitlements.admin_enabled);
    } catch (e) {
      setIsAdmin(false);
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
        interviews: { count: 0 },
        system_design: { count: 0 },
        patterns: [],
        github: null,
        readinessScore: 0,
        weaknesses: ['No data yet — complete some problems to see insights'],
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      checkAdminStatus();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        fetchStats();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const navGroups = [
    {
      label: 'Core Training',
      items: [
        { id: 'today', label: 'Training Room', icon: Dumbbell },
        { id: 'practice', label: 'Practice Gym', icon: Code2 },
        { id: 'roadmap', label: 'Preparation Roadmap', icon: Map },
        { id: 'concepts', label: 'Core Concepts', icon: Library },
      ]
    },
    {
      label: 'Simulation Lab',
      items: [
        { id: 'simulator', label: 'Mock Interview', icon: Gamepad2 },
        { id: 'system-design', label: 'System Design', icon: Layers },
        { id: 'voice-mock', label: 'Voice Mock', icon: Volume2 },
        { id: 'behavioral', label: 'Behavioral Prep', icon: MessageSquare },
      ]
    },
    {
      label: 'Career Suite',
      items: [
        { id: 'resume-lab', label: 'Resume Analyzer', icon: FileSearch },
        { id: 'resume-upload', label: 'PDF Analysis', icon: UploadCloud },
        { id: 'github-import', label: 'Repo Import', icon: Github },
        { id: 'applications', label: 'Job Tracker', icon: Briefcase },
      ]
    },
    {
      label: 'Insights & Admin',
      items: [
        { id: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
        { id: 'master-guide', label: 'Resource Library', icon: BookOpen },
        { id: 'payments', label: 'Membership', icon: CreditCard },
        { id: 'admin', label: 'Admin Summary', icon: ShieldCheck, adminOnly: true },
        { id: 'admin-users', label: 'User CRUD', icon: Users, adminOnly: true },
      ]
    }
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

        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto scrollbar-hide">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(item => !item.adminOnly || isAdmin);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="space-y-2">
                <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/30">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {visibleItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSetTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === item.id
                          ? 'bg-brand-primary text-brand-secondary shadow-lg shadow-brand-primary/20 scale-[1.02]'
                          : 'text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary active:scale-95'
                        }`}
                    >
                      <item.icon size={18} className={activeTab === item.id ? 'text-brand-accent' : ''} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="mt-auto p-4 border-t border-brand-primary/10">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to terminate this session?')) {
                handleLogout();
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
          >
            <LogOut size={18} />
            Logout Protocol
          </button>
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
            <FocusTimer taskTitle={activeTab} context={activeTab} />
            <div className="flex items-center gap-3 px-3 py-1.5 bg-brand-primary/5 rounded-full border border-brand-primary/10">
              <div className="flex flex-col items-end pr-2 border-r border-brand-primary/10">
                <span className="text-[11px] font-black tracking-tight text-brand-primary">{userProfile?.name || 'Developer'}</span>
                <span className="text-[9px] text-brand-primary/40 font-bold uppercase tracking-widest">{userProfile?.email ? 'ID Verified' : 'Guest Mode'}</span>
              </div>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="h-8 w-8 rounded-full bg-brand-primary text-brand-secondary flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
              >
                <User size={16} />
              </button>
            </div>

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
                      handleSetTab('profile-settings');
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
              {activeTab === 'today' && <TrainingRoomView onNavigate={handleSetTab} />}
              {activeTab === 'legacy-today' && <MinimalHomeView onNavigate={handleSetTab} />}
              {activeTab === 'resume-lab' && <ResumeLabView />}
              {activeTab === 'resume-upload' && <ResumeUploadView />}
              {activeTab === 'github-import' && <GitHubImportView />}
              {activeTab === 'voice-mock' && <VoiceMockView />}
              {activeTab === 'payments' && <PaymentsView />}
              {activeTab === 'admin' && <AdminDashboardView />}
              {activeTab === 'admin-users' && <AdminUsersView />}
              {activeTab === 'github-lab' && <GitHubLabView />}
              {activeTab === 'company-packs' && <CompanyPacksView />}
              {activeTab === 'dashboard' && <DashboardView stats={stats} userProfile={userProfile} />}
              {activeTab === 'roadmap' && <RoadmapView />}
              {activeTab === 'ai-workflow' && <AIWorkflowView />}
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
      <FloatingAIAssistant activeTab={activeTab} />
    </div>
  );
}

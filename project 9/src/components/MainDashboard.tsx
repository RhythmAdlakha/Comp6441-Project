import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Mail, Lock, Users, Key, Network, Bug, 
  Trophy, Clock, Target, BookOpen, ArrowRight,
  GraduationCap, Award, TrendingUp, Menu, X,
  Home, BarChart3, Settings, User, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface MainDashboardProps {
  userStats: {
    totalModulesCompleted: number;
    totalScore: number;
    totalTimeSpent: number;
    moduleProgress: Record<string, any>;
  };
}

const modules = [
  {
    id: 'phishing-awareness',
    title: 'Phishing Awareness',
    description: 'Learn to spot suspicious emails, links, and social engineering attempts',
    icon: Mail,
    difficulty: 'Beginner',
    duration: '30 min',
    path: '/phishing-awareness',
    skills: ['Email Security', 'Social Engineering', 'Risk Assessment'],
    color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    progress: 0
  },
  {
    id: 'password-security',
    title: 'Password Security',
    description: 'Understand password strength, hashing, and authentication security',
    icon: Lock,
    difficulty: 'Beginner',
    duration: '25 min',
    path: '/password-security',
    skills: ['Authentication', 'Cryptography', 'Security Policies'],
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    progress: 0
  },
  {
    id: 'threat-hunting',
    title: 'Threat Hunting',
    description: 'Master log analysis and pattern recognition to identify security threats',
    icon: Shield,
    difficulty: 'Intermediate',
    duration: '45 min',
    path: '/threat-hunting',
    skills: ['Log Analysis', 'Pattern Recognition', 'Incident Response'],
    color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    progress: 0
  },
  {
    id: 'network-security',
    title: 'Network Security',
    description: 'Understand firewalls, ports, and network vulnerability assessment',
    icon: Network,
    difficulty: 'Intermediate',
    duration: '40 min',
    path: '/network-security',
    skills: ['Network Analysis', 'Firewall Configuration', 'Port Scanning'],
    color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    progress: 0
  },
  {
    id: 'malware-analysis',
    title: 'Malware Analysis',
    description: 'Analyze file behavior and identify malicious software patterns',
    icon: Bug,
    difficulty: 'Advanced',
    duration: '60 min',
    path: '/malware-analysis',
    skills: ['Static Analysis', 'Dynamic Analysis', 'Reverse Engineering'],
    color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    progress: 0
  }
];

const sidebarItems = [
  { icon: Home, label: 'Dashboard', active: true },
];

export const MainDashboard: React.FC<MainDashboardProps> = ({ userStats }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'difficulty-beginner';
      case 'Intermediate': return 'difficulty-intermediate';
      case 'Advanced': return 'difficulty-advanced';
      default: return 'difficulty-beginner';
    }
  };


  const modulesWithProgress = modules.map(module => {
    const progress = userStats.moduleProgress[module.id];
    return {
      ...module,
      progress: progress?.bestScore || 0
    };
  });

  return (
    <div className="dark-theme min-h-screen">
      {}
      <AnimatePresence>
        <motion.div 
          className={`sidebar ${sidebarOpen ? 'open' : ''}`}
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="logo-icon">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CyberSec Academy</h1>
                <p className="text-sm text-gray-400">Training Library</p>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  className={`sidebar-item ${item.active ? 'active' : ''} cursor-pointer`}
                  onClick={() => {
                    
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ cursor: 'pointer' } as React.CSSProperties}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="space-y-3">
                <div className="text-sm text-gray-400">Progress Overview</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Completed</span>
                    <span className="text-white">{userStats.totalModulesCompleted}/5</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(userStats.totalModulesCompleted / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {}
      <div className="main-content">
        {}
        <div className="app-header">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/progress"
              className="btn-primary text-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Progress
            </Link>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Welcome, {user?.name}
              </span>
              <button
                onClick={logout}
                className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Logout
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {[
            { icon: Target, value: userStats.totalModulesCompleted, label: 'Modules Completed', color: '#06b6d4' },
            { icon: Trophy, value: userStats.totalScore, label: 'Total Score', color: '#f59e0b' },
            { icon: Clock, value: `${Math.floor(userStats.totalTimeSpent / 60)}h`, label: 'Learning Time', color: '#10b981' },
            { icon: Award, value: Object.keys(userStats.moduleProgress).length, label: 'Modules Started', color: '#8b5cf6' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)` }}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Training Modules</h2>
          <p className="text-gray-400 mb-6">Build your cybersecurity expertise through hands-on learning</p>
        </div>

        <div className="module-grid">
          {modulesWithProgress.map((module, index) => {
            const Icon = module.icon;
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={module.path} className="block h-full">
                  <div className="module-card group">
                    {}
                    <div className="flex justify-between items-start mb-4">
                      <div 
                        className="hex-icon"
                        style={{ background: module.color }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className={`difficulty-badge ${getDifficultyClass(module.difficulty)}`}>
                          {module.difficulty}
                        </div>
                        <div className="text-sm text-gray-400 mt-2 flex items-center justify-end">
                          <Clock className="w-3 h-3 mr-1" />
                          {module.duration}
                        </div>
                      </div>
                    </div>

                    {}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {module.description}
                      </p>
                    </div>

                    {}
                    <div className="mt-auto">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-cyan-400 font-medium">{module.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>

                    {}
                    <div className="flex justify-center mt-4 space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
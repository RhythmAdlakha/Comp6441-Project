import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { MainDashboard } from './components/MainDashboard';
import { ThreatHunting } from './modules/ThreatHunting/ThreatHunting';
import { PhishingAwareness } from './modules/PhishingAwareness/PhishingAwareness';
import { PasswordSecurity } from './modules/PasswordSecurity/PasswordSecurity';
import { NetworkSecurity } from './modules/NetworkSecurity/NetworkSecurity';
import { MalwareAnalysis } from './modules/MalwareAnalysis/MalwareAnalysis';
import { UserProgress } from './components/UserProgress';
import { ModuleRecommendation } from './components/ModuleRecommendation';
import { 
  Shield, Mail, Lock, Network, Bug 
} from 'lucide-react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);


const moduleProgression: Record<string, string | null> = {
  'phishing-awareness': 'password-security',
  'password-security': 'threat-hunting',
  'threat-hunting': 'network-security',
  'network-security': 'malware-analysis',
  'malware-analysis': null
};

const modules = [
  {
    id: 'phishing-awareness',
    title: 'Phishing Awareness',
    description: 'Learn to spot suspicious emails, links, and social engineering attempts',
    icon: Mail,
    difficulty: 'Beginner',
    duration: '30 min',
    path: '/phishing-awareness'
  },
  {
    id: 'password-security',
    title: 'Password Security',
    description: 'Understand password strength, hashing, and authentication security',
    icon: Lock,
    difficulty: 'Beginner',
    duration: '25 min',
    path: '/password-security'
  },
  {
    id: 'threat-hunting',
    title: 'Threat Hunting',
    description: 'Master log analysis and pattern recognition to identify security threats',
    icon: Shield,
    difficulty: 'Intermediate',
    duration: '45 min',
    path: '/threat-hunting'
  },
  {
    id: 'network-security',
    title: 'Network Security',
    description: 'Understand firewalls, ports, and network vulnerability assessment',
    icon: Network,
    difficulty: 'Intermediate',
    duration: '40 min',
    path: '/network-security'
  },
  {
    id: 'malware-analysis',
    title: 'Malware Analysis',
    description: 'Analyze file behavior and identify malicious software patterns',
    icon: Bug,
    difficulty: 'Advanced',
    duration: '60 min',
    path: '/malware-analysis'
  }
];

function AppContent() {
  const { user, userProgress, updateProgress, isLoading } = useAuth();
  const { isDark } = useTheme();
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [completedModule, setCompletedModule] = useState<string>('');
  const [lastScore, setLastScore] = useState<number>(0);


  const handleModuleComplete = (moduleId: string, score: number, timeSpent: number) => {
    updateProgress(moduleId, score, timeSpent);


    setCompletedModule(moduleId);
    setLastScore(score);
    setShowRecommendation(true);
  };

  const getNextModule = (currentModuleId: string) => {
    const nextModuleId = moduleProgression[currentModuleId];
    if (!nextModuleId) return null;
    
    return modules.find(module => module.id === nextModuleId) || null;
  };

  const getCurrentModuleName = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    return module?.title || 'Unknown Module';
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (

    <div className={`App ${isDark ? 'dark' : ''}`}>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <MainDashboard 
                userStats={userProgress}
              />
            } 
          />
          <Route 
            path="/threat-hunting" 
            element={
              <ThreatHunting 
                onComplete={(score, time) => handleModuleComplete('threat-hunting', score, time)}
              />
            } 
          />
          <Route 
            path="/phishing-awareness" 
            element={
              <PhishingAwareness 
                onComplete={(score, time) => handleModuleComplete('phishing-awareness', score, time)}
              />
            } 
          />
          <Route 
            path="/password-security" 
            element={
              <PasswordSecurity 
                onComplete={(score, time) => handleModuleComplete('password-security', score, time)}
              />
            } 
          />
          <Route 
            path="/network-security" 
            element={
              <NetworkSecurity 
                onComplete={(score, time) => handleModuleComplete('network-security', score, time)}
              />
            } 
          />
          <Route 
            path="/malware-analysis" 
            element={
              <MalwareAnalysis 
                onComplete={(score, time) => handleModuleComplete('malware-analysis', score, time)}
              />
            } 
          />
          <Route 
            path="/progress" 
            element={
              <UserProgress 
                userStats={userProgress}
              />
            } 
          />
        </Routes>
        {}
        <AnimatePresence>
          {showRecommendation && (
            <ModuleRecommendation
              completedModule={getCurrentModuleName(completedModule)}
              nextModule={getNextModule(completedModule)}
              onClose={() => setShowRecommendation(false)}
              score={lastScore}
            />
          )}
        </AnimatePresence>
      </Router>
    </div>
  );
}

function App() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };


  React.useEffect(() => {
    document.body.className = isDark ? 'dark' : 'light';
  }, [isDark]);
  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        <AppContent />
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

export default App;
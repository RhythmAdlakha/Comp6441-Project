import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Clock, Target, TrendingUp, Award, BarChart3, Star, Zap, Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

interface UserProgressProps {
  userStats: {
    totalModulesCompleted: number;
    totalScore: number;
    totalTimeSpent: number;
    moduleProgress: Record<string, {
      completed: number;
      total: number;
      bestScore: number;
      timeSpent: number;
    }>;
  };
}

const moduleNames: Record<string, string> = {
  'phishing-awareness': 'Phishing Awareness',
  'password-security': 'Password Security',
  'threat-hunting': 'Threat Hunting',
  'network-security': 'Network Security',
  'malware-analysis': 'Malware Analysis'
};

const moduleDifficulties: Record<string, string> = {
  'phishing-awareness': 'Beginner',
  'password-security': 'Beginner',
  'threat-hunting': 'Intermediate',
  'network-security': 'Intermediate',
  'malware-analysis': 'Advanced'
};

const moduleColors: Record<string, string> = {
  'phishing-awareness': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  'password-security': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'threat-hunting': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  'network-security': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  'malware-analysis': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
};

export const UserProgress: React.FC<UserProgressProps> = ({ userStats }) => {
  useTheme();
  const { user, logout } = useAuth();

  const getProgressColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#f59e0b';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'difficulty-beginner';
      case 'Intermediate': return 'difficulty-intermediate';
      case 'Advanced': return 'difficulty-advanced';
      default: return 'difficulty-beginner';
    }
  };

 
  const totalModules = Object.keys(moduleNames).length;
  const completedModules = Object.keys(userStats.moduleProgress).length;
  const overallProgress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;


  const averageScore = completedModules > 0 
    ? Object.values(userStats.moduleProgress).reduce((sum, module) => sum + module.bestScore, 0) / completedModules 
    : 0;


  const chartData = Object.entries(moduleNames).map(([moduleId, moduleName]) => {
    const progress = userStats.moduleProgress[moduleId];
    return {
      id: moduleId,
      name: moduleName,
      score: progress?.bestScore || 0,
      completed: !!progress,
      difficulty: moduleDifficulties[moduleId as keyof typeof moduleDifficulties],
      color: moduleColors[moduleId as keyof typeof moduleColors]
    };
  });

  return (
    <div className="dark-theme min-h-screen">
      {}
      <div className="app-header">
        <div className="flex items-center gap-4">
          <Link 
            to="/"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="logo-icon">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Progress Analytics</h1>
              <p className="text-sm text-gray-400">Track your learning journey</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            {user?.name}
          </span>
          <button
            onClick={logout}
            className="text-sm px-3 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {[
            { icon: Target, value: userStats.totalModulesCompleted, label: 'Completed', color: '#06b6d4' },
            { icon: Trophy, value: `${Math.round(averageScore)}%`, label: 'Average Score', color: '#f59e0b' },
            { icon: Clock, value: `${Math.floor(userStats.totalTimeSpent / 60)}h`, label: 'Study Time', color: '#10b981' },
            { icon: Award, value: `${Math.round(overallProgress)}%`, label: 'Overall Progress', color: '#8b5cf6' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
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
        <motion.div 
          className="glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 mr-3 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Module Performance</h2>
          </div>

          <div className="space-y-4">
            {chartData.map((module, index) => (
              <motion.div 
                key={module.id} 
                className="glass-card p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ 
                        background: module.completed ? module.color : '#374151',
                        color: 'white'
                      }}
                    >
                      {module.completed ? <Star className="h-4 w-4" /> : index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{module.name}</h3>
                      <div className={`difficulty-badge ${getDifficultyClass(module.difficulty)} text-xs mt-1`}>
                        {module.difficulty}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {module.completed ? (
                      <span 
                        className="font-bold text-lg"
                        style={{ color: getProgressColor(module.score) }}
                      >
                        {module.score}%
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">Not started</span>
                    )}
                  </div>
                </div>
                
                {}
                <div className="progress-bar">
                                  <motion.div 
                  className="h-full rounded-full transition-all duration-1000"
                  initial={{ width: "0%" }}
                  animate={{ width: `${module.completed ? module.score : 0}%` }}
                  transition={{ duration: 1, delay: 0.2 * index }}
                  style={{
                    background: module.completed 
                      ? `linear-gradient(90deg, ${getProgressColor(module.score)}, ${getProgressColor(module.score)}dd)`
                      : '#374151'
                  } as React.CSSProperties}
                />
                </div>
                
                {}
                {module.completed && userStats.moduleProgress[module.id] && (
                  <div className="flex justify-between text-sm pt-3 mt-3 border-t border-white/10">
                    <span className="text-gray-400 flex items-center">
                      <Zap className="h-3 w-3 mr-1" />
                      Attempts: {userStats.moduleProgress[module.id].completed}
                    </span>
                    <span className="text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Time: {Math.floor(userStats.moduleProgress[module.id].timeSpent / 60)}m
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {}
        {userStats.totalModulesCompleted > 0 && (
          <motion.div 
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-6 text-white flex items-center">
              <Trophy className="h-6 w-6 mr-3 text-yellow-400" />
              Achievements Unlocked
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { condition: userStats.totalModulesCompleted >= 1, icon: Award, title: 'First Steps', desc: 'Completed your first module', color: '#10b981' },
                { condition: userStats.totalModulesCompleted >= 3, icon: TrendingUp, title: 'Making Progress', desc: 'Completed 3 modules', color: '#06b6d4' },
                { condition: averageScore >= 80, icon: Trophy, title: 'High Achiever', desc: '80%+ average score', color: '#8b5cf6' }
              ].filter(achievement => achievement.condition).map((achievement, index) => (
                <motion.div
                  key={index}
                  className="glass-card p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${achievement.color}, ${achievement.color}dd)` }}
                    >
                      <achievement.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{achievement.title}</h4>
                      <p className="text-gray-400 text-sm">{achievement.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
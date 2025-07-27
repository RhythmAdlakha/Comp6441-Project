import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Dashboard } from '../../components/Dashboard';
import { LogViewer } from '../../components/LogViewer';
import { scenarios } from '../../data/scenarios';
import { Scenario, ScenarioResult } from '../../types';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../App';

interface ThreatHuntingProps {
  onComplete: (score: number, timeSpent: number) => void;
}

export const ThreatHunting: React.FC<ThreatHuntingProps> = ({ onComplete }) => {
  const { isDark } = useTheme();
  const [currentView, setCurrentView] = useState<'dashboard' | 'scenario'>('dashboard');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [userStats, setUserStats] = useState({
    totalCompleted: 0,
    averageScore: 0,
    totalTime: 0
  });

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentView('scenario');
  };

  const handleScenarioComplete = (results: ScenarioResult) => {
    // Update user stats
    setUserStats(prev => ({
      totalCompleted: prev.totalCompleted + 1,
      averageScore: prev.totalCompleted === 0 
        ? results.percentage 
        : Math.round((prev.averageScore * prev.totalCompleted + results.percentage) / (prev.totalCompleted + 1)),
      totalTime: prev.totalTime + results.timeSpent
    }));

    // Call parent completion handler
    onComplete(results.totalPoints, results.timeSpent);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedScenario(null);
  };

  if (currentView === 'dashboard') {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900'
      }`}>
        {/* Header */}
        <div className={`backdrop-blur-sm border-b transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link 
                  to="/"
                  className={`p-2 rounded-lg transition-colors mr-4 ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ArrowLeft className={`h-5 w-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                </Link>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl mr-4 overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/5380792/pexels-photo-5380792.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                      alt="Threat Hunting"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Threat Hunting</h1>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Master log analysis and pattern recognition</p>
                  </div>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <Dashboard
          scenarios={scenarios}
          onSelectScenario={handleSelectScenario}
          userStats={userStats}
        />
      </div>
    );
  }

  return selectedScenario ? (
    <LogViewer
      scenario={selectedScenario}
      onComplete={handleScenarioComplete}
      onBack={handleBackToDashboard}
    />
  ) : null;
};
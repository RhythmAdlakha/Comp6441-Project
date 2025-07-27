import React from 'react';
import { Shield, Clock, Target, Trophy, AlertTriangle, BookOpen, Play } from 'lucide-react';
import { Scenario } from '../types';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../App';

interface DashboardProps {
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
  userStats: {
    totalCompleted: number;
    averageScore: number;
    totalTime: number;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ scenarios, onSelectScenario, userStats }) => {
  const { isDark } = useTheme();
  
  const getDifficultyColor = (difficulty: string) => {
    if (isDark) {
      switch (difficulty) {
        case 'Beginner': return 'text-green-400 bg-green-900/20 border-green-500/30';
        case 'Intermediate': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
        case 'Advanced': return 'text-red-400 bg-red-900/20 border-red-500/30';
        default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
      }
    } else {
      switch (difficulty) {
        case 'Beginner': return 'text-green-700 bg-green-100 border-green-300';
        case 'Intermediate': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
        case 'Advanced': return 'text-red-700 bg-red-100 border-red-300';
        default: return 'text-gray-700 bg-gray-100 border-gray-300';
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900'
    }`}>
      {}
      <div className={`backdrop-blur-sm border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <motion.div 
              className="text-center flex-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`p-4 rounded-2xl mr-4 ${
                  isDark 
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className={`text-4xl font-bold bg-clip-text text-transparent ${
                    isDark 
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-400' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700'
                  }`}>
                    Threat Hunting Simulator
                  </h1>
                  <p className={`text-xl mt-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Learn to Read Logs Like a Security Expert
                  </p>
                </div>
              </div>
              
              <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Master the art of cybersecurity log analysis through realistic attack scenarios. 
                Identify threats, understand attack patterns, and develop critical security skills.
              </p>
            </motion.div>
            
            <div className="ml-6">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600/50 hover:border-cyan-500/50' 
              : 'bg-white border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl'
          }`}>
            <div className="flex items-center">
              <Target className={`h-10 w-10 mr-4 ${
                isDark ? 'text-cyan-400' : 'text-blue-600'
              }`} />
              <div>
                <p className={`text-3xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {userStats.totalCompleted}
                </p>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Scenarios Completed
                </p>
              </div>
            </div>
          </div>
          <div className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600/50 hover:border-green-500/50' 
              : 'bg-white border-gray-200 hover:border-green-300 shadow-lg hover:shadow-xl'
          }`}>
            <div className="flex items-center">
              <Trophy className={`h-10 w-10 mr-4 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`} />
              <div>
                <p className={`text-3xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {userStats.averageScore}%
                </p>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Average Score
                </p>
              </div>
            </div>
          </div>
          <div className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600/50 hover:border-purple-500/50' 
              : 'bg-white border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-xl'
          }`}>
            <div className="flex items-center">
              <Clock className={`h-10 w-10 mr-4 ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <div>
                <p className={`text-3xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {Math.floor(userStats.totalTime / 60)}m
                </p>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Total Analysis Time
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Choose Your Challenge
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Progress from basic log analysis to advanced threat hunting
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                className={`rounded-xl border cursor-pointer group overflow-hidden transition-all duration-300 hover:scale-102 hover:-translate-y-2 ${
                  isDark 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600/50 hover:border-cyan-500/50' 
                    : 'bg-white border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-2xl'
                }`}
                onClick={() => onSelectScenario(scenario)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(scenario.difficulty)}`}>
                      {scenario.difficulty}
                    </div>
                    <div className={`text-sm flex items-center ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <Clock className="h-4 w-4 mr-1" />
                      {Math.floor(scenario.timeLimit / 60)}m
                    </div>
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 transition-colors ${
                    isDark 
                      ? 'text-white group-hover:text-cyan-400' 
                      : 'text-gray-900 group-hover:text-blue-600'
                  }`}>
                    {scenario.title}
                  </h3>
                  
                  <p className={`text-sm mb-4 leading-relaxed ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {scenario.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                        {scenario.logs.length} log entries
                      </span>
                      <span className={`font-medium ${
                        isDark ? 'text-cyan-400' : 'text-blue-600'
                      }`}>
                        {scenario.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                        {scenario.questions.length} questions
                      </span>
                      <span className={`font-medium ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {scenario.questions.reduce((sum, q) => sum + q.points, 0)} points
                      </span>
                    </div>
                  </div>
                  
                  {}
                  <div className={`border-t pt-4 ${
                    isDark ? 'border-gray-600/50' : 'border-gray-200'
                  }`}>
                    <h4 className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      What You'll Learn
                    </h4>
                    <div className="space-y-1">
                      {scenario.learningGoals.slice(0, 2).map((goal, idx) => (
                        <div key={idx} className={`text-xs flex items-start ${
                          isDark ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          <span className={`mr-2 ${
                            isDark ? 'text-cyan-400' : 'text-blue-500'
                          }`}>•</span>
                          <span>{goal}</span>
                        </div>
                      ))}
                      {scenario.learningGoals.length > 2 && (
                        <div className={`text-xs ${
                          isDark ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          +{scenario.learningGoals.length - 2} more skills
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={`px-6 py-4 border-t ${
                  isDark 
                    ? 'bg-gray-700/50 border-gray-600/50' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`flex items-center justify-center font-medium transition-colors ${
                    isDark 
                      ? 'text-cyan-400 group-hover:text-white' 
                      : 'text-blue-600 group-hover:text-blue-700'
                  }`}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Analysis
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {}
        <motion.div 
          className={`rounded-xl border p-8 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600/50' 
              : 'bg-white border-gray-200 shadow-lg'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className={`text-2xl font-bold mb-6 flex items-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <BookOpen className={`h-6 w-6 mr-3 ${
              isDark ? 'text-cyan-400' : 'text-blue-600'
            }`} />
            How the Simulator Works
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                isDark ? 'bg-cyan-500/20' : 'bg-blue-100'
              }`}>
                <span className={`font-bold text-lg ${
                  isDark ? 'text-cyan-400' : 'text-blue-600'
                }`}>1</span>
              </div>
              <h4 className={`font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>View Logs</h4>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Examine realistic system logs containing both normal and suspicious activities
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'
              }`}>
                <span className={`font-bold text-lg ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`}>2</span>
              </div>
              <h4 className={`font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Spot Threats</h4>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Identify suspicious patterns, anomalies, and indicators of compromise
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                isDark ? 'bg-green-500/20' : 'bg-green-100'
              }`}>
                <span className={`font-bold text-lg ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>3</span>
              </div>
              <h4 className={`font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Answer Questions</h4>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Demonstrate your understanding through targeted questions about the threats
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                isDark ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <span className={`font-bold text-lg ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>4</span>
              </div>
              <h4 className={`font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Learn & Improve</h4>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Get detailed explanations and improve your threat detection skills
              </p>
            </div>
          </div>
          
          <div className={`mt-8 p-4 rounded-lg border ${
            isDark 
              ? 'bg-blue-900/20 border-blue-500/30' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start">
              <AlertTriangle className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <div>
                <h4 className={`font-bold mb-1 ${
                  isDark ? 'text-blue-400' : 'text-blue-700'
                }`}>Educational Focus</h4>
                <p className={`text-sm ${
                  isDark ? 'text-blue-200' : 'text-blue-700'
                }`}>
                  Each scenario is designed to teach specific cybersecurity concepts through hands-on analysis. 
                  You'll learn to recognize attack patterns, understand threat indicators, and develop the 
                  analytical skills essential for cybersecurity professionals.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
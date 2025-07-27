import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Trophy, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../App';

interface ModuleRecommendationProps {
  completedModule: string;
  nextModule: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    path: string;
    icon: React.ComponentType<any>;
  } | null;
  onClose: () => void;
  score: number;
}

export const ModuleRecommendation: React.FC<ModuleRecommendationProps> = ({
  completedModule,
  nextModule,
  onClose,
  score
}) => {
  const { isDark } = useTheme();

  const getDifficultyColor = (difficulty: string) => {
    if (isDark) {
      switch (difficulty) {
        case 'Beginner': return 'text-green-300 bg-green-800/30 border-green-600/50';
        case 'Intermediate': return 'text-yellow-300 bg-yellow-800/30 border-yellow-600/50';
        case 'Advanced': return 'text-red-300 bg-red-800/30 border-red-600/50';
        default: return 'text-gray-300 bg-gray-800/30 border-gray-600/50';
      }
    } else {
      switch (difficulty) {
        case 'Beginner': return 'text-green-800 bg-green-50 border-green-200';
        case 'Intermediate': return 'text-yellow-800 bg-yellow-50 border-yellow-200';
        case 'Advanced': return 'text-red-800 bg-red-50 border-red-200';
        default: return 'text-gray-800 bg-gray-50 border-gray-200';
      }
    }
  };

  const getEncouragementMessage = (score: number) => {
    if (score >= 90) return "Outstanding work! You're ready for the next challenge.";
    if (score >= 75) return "Great job! Let's continue building your skills.";
    if (score >= 60) return "Good progress! The next module will help strengthen your knowledge.";
    return "Keep learning! Each module builds important cybersecurity skills.";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`rounded-xl border p-8 max-w-md w-full ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200 shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-3 ${
              isDark ? 'bg-blue-600' : 'bg-blue-600'
            }`}>
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h3 className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Module Complete!</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`h-5 w-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </button>
        </div>

        {}
        <div className="text-center mb-6">
          <p className={`text-lg font-medium mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            You've completed <strong>{completedModule}</strong>!
          </p>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {getEncouragementMessage(score)}
          </p>
        </div>

        {}
        {nextModule ? (
          <div className={`rounded-lg border p-6 mb-6 ${
            isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center mb-4">
              <BookOpen className={`h-5 w-5 mr-2 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h4 className={`font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Recommended Next:</h4>
            </div>
            
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className={`p-2 rounded mr-3 ${
                  isDark ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <nextModule.icon className={`h-5 w-5 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h5 className={`font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{nextModule.title}</h5>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{nextModule.duration}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(nextModule.difficulty)}`}>
                {nextModule.difficulty}
              </div>
            </div>
            
            <p className={`text-sm mb-4 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {nextModule.description}
            </p>
            
            <Link
              to={nextModule.path}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Start {nextModule.title}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className={`rounded-lg border p-6 mb-6 text-center ${
            isDark ? 'bg-green-800/20 border-green-600/30' : 'bg-green-50 border-green-200'
          }`}>
            <Trophy className={`h-8 w-8 mx-auto mb-3 ${
              isDark ? 'text-green-400' : 'text-green-600'
            }`} />
            <h4 className={`font-bold mb-2 ${
              isDark ? 'text-green-400' : 'text-green-700'
            }`}>Congratulations!</h4>
            <p className={`text-sm ${
              isDark ? 'text-green-200' : 'text-green-700'
            }`}>
              You've completed all available modules! You're now well-equipped with cybersecurity knowledge.
            </p>
          </div>
        )}

        {}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg font-medium border ${
              isDark 
                ? 'border-gray-600 hover:bg-gray-700 text-white' 
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            Back to Dashboard
          </button>
          
          <Link
            to="/progress"
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-center ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            View Progress
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};
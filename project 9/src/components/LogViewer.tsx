import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, XCircle, ArrowLeft, Eye, EyeOff, 
  AlertTriangle, Target, FileText, HelpCircle, Award
} from 'lucide-react';
import { LogEntry, Scenario, Question, UserAnswer, ScenarioResult } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../App';

interface LogViewerProps {
  scenario: Scenario;
  onComplete: (results: ScenarioResult) => void;
  onBack: () => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({ scenario, onComplete, onBack }) => {
  const { isDark } = useTheme();
  const [timeRemaining, setTimeRemaining] = useState(scenario.timeLimit);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showLogDetails, setShowLogDetails] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = scenario.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === scenario.questions.length - 1;

  useEffect(() => {
    if (isComplete) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete]);

  const handleTimeUp = () => {
    if (!isComplete) {
      completeScenario();
    }
  };

  const handleLogClick = (logId: string) => {
    if (currentQuestion.type === 'log-selection') {
      setSelectedLogs(prev => 
        prev.includes(logId) 
          ? prev.filter(id => id !== logId)
          : [...prev, logId]
      );
    }
  };

  const handleAnswerSubmit = (answer: string | string[]) => {
    const isCorrect = Array.isArray(answer) 
      ? JSON.stringify(answer.sort()) === JSON.stringify((currentQuestion.correctAnswer as string[]).sort())
      : answer.toLowerCase() === (currentQuestion.correctAnswer as string).toLowerCase();

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answer,
      isCorrect,
      pointsEarned: isCorrect ? currentQuestion.points : 0
    };

    setUserAnswers(prev => [...prev, userAnswer]);

    if (isLastQuestion) {
      completeScenario([...userAnswers, userAnswer]);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedLogs([]);
    }
  };

  const completeScenario = (finalAnswers = userAnswers) => {
    const totalPoints = finalAnswers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
    const maxPoints = scenario.questions.reduce((sum, question) => sum + question.points, 0);
    const percentage = Math.round((totalPoints / maxPoints) * 100);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    let feedback = '';
    if (percentage >= 90) feedback = 'Excellent! You have strong threat detection skills.';
    else if (percentage >= 75) feedback = 'Good work! You identified most threats correctly.';
    else if (percentage >= 60) feedback = 'Not bad, but there\'s room for improvement in threat analysis.';
    else feedback = 'Keep practicing! Threat detection requires experience and attention to detail.';

    const results: ScenarioResult = {
      scenarioId: scenario.id,
      totalPoints,
      maxPoints,
      percentage,
      answers: finalAnswers,
      timeSpent,
      feedback
    };

    setIsComplete(true);
    setShowResults(true);
    onComplete(results);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLogLevelColor = (level: string) => {
    if (isDark) {
      switch (level) {
        case 'CRITICAL': return 'text-red-400 bg-red-900/20';
        case 'ERROR': return 'text-red-400 bg-red-900/10';
        case 'WARN': return 'text-yellow-400 bg-yellow-900/10';
        case 'INFO': return 'text-blue-400 bg-blue-900/10';
        case 'DEBUG': return 'text-gray-400 bg-gray-900/10';
        default: return 'text-white bg-gray-900/10';
      }
    } else {
      switch (level) {
        case 'CRITICAL': return 'text-red-700 bg-red-100';
        case 'ERROR': return 'text-red-600 bg-red-50';
        case 'WARN': return 'text-yellow-700 bg-yellow-100';
        case 'INFO': return 'text-blue-700 bg-blue-100';
        case 'DEBUG': return 'text-gray-600 bg-gray-100';
        default: return 'text-gray-800 bg-gray-100';
      }
    }
  };

  const selectedLog = selectedLogId ? scenario.logs.find(log => log.id === selectedLogId) : null;

  if (showResults) {
    const results = {
      totalPoints: userAnswers.reduce((sum, answer) => sum + answer.pointsEarned, 0),
      maxPoints: scenario.questions.reduce((sum, question) => sum + question.points, 0),
      percentage: Math.round((userAnswers.reduce((sum, answer) => sum + answer.pointsEarned, 0) / scenario.questions.reduce((sum, question) => sum + question.points, 0)) * 100)
    };

    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDark 
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}>
              <Award className="h-10 w-10 text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Analysis Complete!</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Here's how you performed on {scenario.title}
            </p>
          </motion.div>

          <motion.div 
            className={`rounded-xl border p-8 mb-8 ${
              isDark 
                ? 'bg-gray-800/80 border-gray-700/50' 
                : 'bg-white border-gray-200 shadow-lg'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  isDark ? 'text-cyan-400' : 'text-blue-600'
                }`}>{results.percentage}%</div>
                <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Final Score</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>{results.totalPoints}</div>
                <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Points Earned</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {userAnswers.filter(a => a.isCorrect).length}/{userAnswers.length}
                </div>
                <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Correct Answers</div>
              </div>
            </div>

            <div className={`text-center p-4 rounded-lg border ${
              isDark 
                ? 'bg-blue-900/20 border-blue-500/30' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={isDark ? 'text-blue-200' : 'text-blue-700'}>
                {results.percentage >= 90 ? 'Excellent! You have strong threat detection skills.' :
                 results.percentage >= 75 ? 'Good work! You identified most threats correctly.' :
                 results.percentage >= 60 ? 'Not bad, but there\'s room for improvement in threat analysis.' :
                 'Keep practicing! Threat detection requires experience and attention to detail.'}
              </p>
            </div>
          </motion.div>

          <motion.div 
            className={`rounded-xl border p-6 mb-8 ${
              isDark 
                ? 'bg-gray-800/80 border-gray-700/50' 
                : 'bg-white border-gray-200 shadow-lg'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className={`text-xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Detailed Results</h3>
            <div className="space-y-4">
              {scenario.questions.map((question, index) => {
                const userAnswer = userAnswers.find(a => a.questionId === question.id);
                return (
                  <div key={question.id} className={`border rounded-lg p-4 ${
                    isDark ? 'border-gray-600/50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>Question {index + 1}</h4>
                      <div className="flex items-center">
                        {userAnswer?.isCorrect ? (
                          <CheckCircle className={`h-5 w-5 mr-2 ${
                            isDark ? 'text-green-400' : 'text-green-600'
                          }`} />
                        ) : (
                          <XCircle className={`h-5 w-5 mr-2 ${
                            isDark ? 'text-red-400' : 'text-red-600'
                          }`} />
                        )}
                        <span className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {userAnswer?.pointsEarned || 0}/{question.points} pts
                        </span>
                      </div>
                    </div>
                    <p className={`mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>{question.question}</p>
                    <div className="text-sm">
                      <p className={`mb-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Your answer: <span className={isDark ? 'text-white' : 'text-gray-900'}>
                          {Array.isArray(userAnswer?.answer) 
                            ? (userAnswer.answer as string[]).join(', ') 
                            : userAnswer?.answer || 'No answer'}
                        </span>
                      </p>
                      <p className={`mb-2 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Correct answer: <span className={
                          isDark ? 'text-green-400' : 'text-green-600'
                        }>
                          {Array.isArray(question.correctAnswer) 
                            ? question.correctAnswer.join(', ') 
                            : question.correctAnswer}
                        </span>
                      </p>
                      <p className={`text-sm p-2 rounded ${
                        isDark 
                          ? 'text-blue-200 bg-blue-900/20' 
                          : 'text-blue-700 bg-blue-50'
                      }`}>
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="text-center">
            <button
              onClick={onBack}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                isDark 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
              }`}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className={`p-2 rounded-lg transition-colors mr-4 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className={`h-5 w-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </button>
              <div>
                <h1 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{scenario.title}</h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>{scenario.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Question</div>
                <div className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentQuestionIndex + 1} / {scenario.questions.length}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className={`h-5 w-5 ${
                  timeRemaining < 60 
                    ? 'text-red-400' 
                    : isDark ? 'text-cyan-400' : 'text-blue-600'
                }`} />
                <span className={`font-mono text-xl font-bold ${
                  timeRemaining < 60 
                    ? 'text-red-400' 
                    : isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {}
          <div className="lg:col-span-2">
            <div className={`backdrop-blur-sm rounded-xl border ${
              isDark 
                ? 'bg-gray-800/80 border-gray-700/50' 
                : 'bg-white/80 border-gray-200/50 shadow-lg'
            }`}>
              <div className={`p-4 border-b ${
                isDark ? 'border-gray-700/50' : 'border-gray-200/50'
              }`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-bold flex items-center ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <FileText className={`h-5 w-5 mr-2 ${
                      isDark ? 'text-cyan-400' : 'text-blue-600'
                    }`} />
                    System Logs
                  </h2>
                  <button
                    onClick={() => setShowLogDetails(!showLogDetails)}
                    className={`px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {showLogDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span>{showLogDetails ? 'Hide' : 'Show'} Details</span>
                  </button>
                </div>
                <p className={`text-sm mt-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {currentQuestion.type === 'log-selection' 
                    ? 'Click on log entries to select them for your answer'
                    : 'Review the logs to answer the question below'
                  }
                </p>
              </div>
              
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {scenario.logs.map((log, index) => {
                  const isSelected = selectedLogs.includes(log.id);
                  const canSelect = currentQuestion.type === 'log-selection';
                  
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => canSelect && handleLogClick(log.id)}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? isDark 
                            ? 'border-cyan-500 bg-cyan-900/20 shadow-lg shadow-cyan-500/20'
                            : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                          : canSelect 
                            ? isDark
                              ? 'border-gray-600 hover:border-gray-500 bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer'
                              : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer'
                            : isDark
                              ? 'border-gray-600 bg-gray-700/30'
                              : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 font-mono text-sm">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`text-xs ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>{log.timestamp}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                              {log.level}
                            </span>
                            <span className={`text-xs ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>{log.source}</span>
                          </div>
                          
                          <div className={`pl-2 ${
                            isDark ? 'text-gray-100' : 'text-gray-800'
                          }`}>
                            {log.message}
                          </div>
                          
                          {showLogDetails && log.isSuspicious && (
                            <div className={`mt-3 p-3 rounded border ${
                              isDark 
                                ? 'bg-red-900/20 border-red-500/30' 
                                : 'bg-red-50 border-red-200'
                            }`}>
                              <div className="flex items-center mb-2">
                                <AlertTriangle className={`h-4 w-4 mr-2 ${
                                  isDark ? 'text-red-400' : 'text-red-600'
                                }`} />
                                <span className={`font-medium text-sm ${
                                  isDark ? 'text-red-400' : 'text-red-700'
                                }`}>{log.threatType}</span>
                              </div>
                              <p className={`text-xs mb-2 ${
                                isDark ? 'text-red-200' : 'text-red-700'
                              }`}>{log.explanation}</p>
                              
                              {log.indicators && (
                                <div className="mb-2">
                                  <h5 className={`text-xs font-semibold mb-1 ${
                                    isDark ? 'text-red-400' : 'text-red-700'
                                  }`}>Indicators:</h5>
                                  <ul className="text-xs space-y-1">
                                    {log.indicators.map((indicator, idx) => (
                                      <li key={idx} className={`flex items-start ${
                                        isDark ? 'text-red-200' : 'text-red-700'
                                      }`}>
                                        <span className={`mr-1 ${
                                          isDark ? 'text-red-400' : 'text-red-600'
                                        }`}>•</span>
                                        <span>{indicator}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {log.remediation && (
                                <div>
                                  <h5 className={`text-xs font-semibold mb-1 ${
                                    isDark ? 'text-green-400' : 'text-green-700'
                                  }`}>Remediation:</h5>
                                  <ul className="text-xs space-y-1">
                                    {log.remediation.map((step, idx) => (
                                      <li key={idx} className={`flex items-start ${
                                        isDark ? 'text-green-200' : 'text-green-700'
                                      }`}>
                                        <span className={`mr-1 ${
                                          isDark ? 'text-green-400' : 'text-green-600'
                                        }`}>•</span>
                                        <span>{step}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLogId(selectedLogId === log.id ? null : log.id);
                          }}
                          className={`p-1 rounded transition-colors ml-2 ${
                            isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                        >
                          <HelpCircle className={`h-4 w-4 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {}
          <div className="space-y-6">
            <div className={`backdrop-blur-sm rounded-xl border p-6 ${
              isDark 
                ? 'bg-gray-800/80 border-gray-700/50' 
                : 'bg-white/80 border-gray-200/50 shadow-lg'
            }`}>
              <div className="flex items-center mb-4">
                <Target className={`h-5 w-5 mr-2 ${
                  isDark ? 'text-cyan-400' : 'text-blue-600'
                }`} />
                <h3 className={`font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Question {currentQuestionIndex + 1}</h3>
              </div>
              
              <p className={`mb-6 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>{currentQuestion.question}</p>
              
              <QuestionInput
                question={currentQuestion}
                selectedLogs={selectedLogs}
                onSubmit={handleAnswerSubmit}
                isDark={isDark}
              />
            </div>

            {}
            <div className={`backdrop-blur-sm rounded-xl border p-4 ${
              isDark 
                ? 'bg-gray-800/80 border-gray-700/50' 
                : 'bg-white/80 border-gray-200/50 shadow-lg'
            }`}>
              <h3 className={`font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Learning Goals</h3>
              <ul className="space-y-2 text-sm">
                {scenario.learningGoals.map((goal, idx) => (
                  <li key={idx} className={`flex items-start ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <span className={`mr-2 mt-1 ${
                      isDark ? 'text-cyan-400' : 'text-blue-600'
                    }`}>•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {}
      <AnimatePresence>
        {selectedLogId && selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedLogId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-xl border p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200 shadow-2xl'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Log Entry Details</h3>
                <button
                  onClick={() => setSelectedLogId(null)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <XCircle className={`h-5 w-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg font-mono text-sm ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {selectedLog.timestamp}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getLogLevelColor(selectedLog.level)}`}>
                      {selectedLog.level}
                    </span>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {selectedLog.source}
                    </span>
                  </div>
                  <div className={isDark ? 'text-gray-100' : 'text-gray-800'}>
                    {selectedLog.message}
                  </div>
                </div>
                
                {selectedLog.isSuspicious ? (
                  <div className={`p-4 rounded-lg border ${
                    isDark 
                      ? 'bg-red-900/20 border-red-500/30' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center mb-3">
                      <AlertTriangle className={`h-5 w-5 mr-2 ${
                        isDark ? 'text-red-400' : 'text-red-600'
                      }`} />
                      <h4 className={`font-bold ${
                        isDark ? 'text-red-400' : 'text-red-700'
                      }`}>Threat Detected: {selectedLog.threatType}</h4>
                    </div>
                    <p className={`mb-4 ${
                      isDark ? 'text-red-200' : 'text-red-700'
                    }`}>{selectedLog.explanation}</p>
                    
                    {selectedLog.indicators && (
                      <div className="mb-4">
                        <h5 className={`font-semibold mb-2 ${
                          isDark ? 'text-red-400' : 'text-red-700'
                        }`}>Key Indicators:</h5>
                        <ul className="space-y-1">
                          {selectedLog.indicators.map((indicator, idx) => (
                            <li key={idx} className={`flex items-start text-sm ${
                              isDark ? 'text-red-200' : 'text-red-700'
                            }`}>
                              <span className={`mr-2 ${
                                isDark ? 'text-red-400' : 'text-red-600'
                              }`}>•</span>
                              <span>{indicator}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedLog.remediation && (
                      <div>
                        <h5 className={`font-semibold mb-2 ${
                          isDark ? 'text-green-400' : 'text-green-700'
                        }`}>Recommended Actions:</h5>
                        <ul className="space-y-1">
                          {selectedLog.remediation.map((step, idx) => (
                            <li key={idx} className={`flex items-start text-sm ${
                              isDark ? 'text-green-200' : 'text-green-700'
                            }`}>
                              <span className={`mr-2 ${
                                isDark ? 'text-green-400' : 'text-green-600'
                              }`}>•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`p-4 rounded-lg border ${
                    isDark 
                      ? 'bg-green-900/20 border-green-500/30' 
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center mb-2">
                      <CheckCircle className={`h-5 w-5 mr-2 ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <h4 className={`font-bold ${
                        isDark ? 'text-green-400' : 'text-green-700'
                      }`}>Normal Activity</h4>
                    </div>
                    <p className={isDark ? 'text-green-200' : 'text-green-700'}>
                      {selectedLog.explanation}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


interface QuestionInputProps {
  question: Question;
  selectedLogs: string[];
  onSubmit: (answer: string | string[]) => void;
  isDark: boolean;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, selectedLogs, onSubmit, isDark }) => {
  const [textAnswer, setTextAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const handleSubmit = () => {
    if (question.type === 'log-selection') {
      onSubmit(selectedLogs);
    } else if (question.type === 'text-input') {
      onSubmit(textAnswer.trim());
    } else if (question.type === 'multiple-choice') {
      onSubmit(selectedOption);
    }
  };

  const canSubmit = () => {
    if (question.type === 'log-selection') return selectedLogs.length > 0;
    if (question.type === 'text-input') return textAnswer.trim().length > 0;
    if (question.type === 'multiple-choice') return selectedOption.length > 0;
    return false;
  };

  return (
    <div className="space-y-4">
      {question.type === 'multiple-choice' && question.options && (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <label key={index} className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
              isDark 
                ? 'bg-gray-700/30 hover:bg-gray-700/50' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}>
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                className={`mr-3 ${
                  isDark ? 'text-cyan-500' : 'text-blue-500'
                }`}
              />
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {option}
              </span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'text-input' && (
        <input
          type="text"
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          placeholder="Enter your answer..."
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
          }`}
        />
      )}

      {question.type === 'log-selection' && (
        <div className={`p-3 rounded-lg ${
          isDark ? 'bg-gray-700/30' : 'bg-gray-50'
        }`}>
          <p className={`text-sm mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Selected logs: {selectedLogs.length}</p>
          <div className="flex flex-wrap gap-2">
            {selectedLogs.map(logId => (
              <span key={logId} className={`px-2 py-1 rounded text-xs ${
                isDark 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {logId}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>{question.points} points</span>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            canSubmit()
              ? isDark
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
              : 'bg-gray-400 cursor-not-allowed text-gray-200'
          }`}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};
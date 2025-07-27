import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Lock, Eye, EyeOff, CheckCircle, XCircle, 
  AlertTriangle, Shield, Zap, Clock, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../App';

interface PasswordSecurityProps {
  onComplete: (score: number, timeSpent: number) => void;
}

interface PasswordTest {
  password: string;
  strength: 'weak' | 'medium' | 'strong';
  crackTime: string;
  issues: string[];
  improvements: string[];
}

const passwordTests: PasswordTest[] = [
  {
    password: 'password123',
    strength: 'weak',
    crackTime: 'Less than 1 second',
    issues: [
      'Common dictionary word',
      'Predictable number sequence',
      'Too short (11 characters)',
      'No special characters',
      'No uppercase letters'
    ],
    improvements: [
      'Use a longer passphrase',
      'Include special characters',
      'Mix upper and lowercase',
      'Avoid dictionary words'
    ]
  },
  {
    password: 'MyDog2023!',
    strength: 'medium',
    crackTime: '2 hours',
    issues: [
      'Contains personal information',
      'Predictable pattern',
      'Relatively short (10 characters)'
    ],
    improvements: [
      'Make it longer (15+ characters)',
      'Avoid personal information',
      'Use random words instead'
    ]
  },
  {
    password: 'Tr0ub4dor&3',
    strength: 'medium',
    crackTime: '3 days',
    issues: [
      'Based on common substitution pattern',
      'Moderately short (11 characters)',
      'Predictable structure'
    ],
    improvements: [
      'Use longer passphrases',
      'Avoid predictable substitutions',
      'Consider random word combinations'
    ]
  },
  {
    password: 'correct horse battery staple',
    strength: 'strong',
    crackTime: '550 years',
    issues: [
      'Well-known example password',
      'No numbers or special characters'
    ],
    improvements: [
      'Add numbers or symbols',
      'Use less common word combinations',
      'Consider adding personal twist'
    ]
  },
  {
    password: 'P@ssw0rd!2024#Security',
    strength: 'strong',
    crackTime: '34,000 years',
    issues: [
      'Contains "password" - avoid obvious terms'
    ],
    improvements: [
      'Remove obvious security-related terms',
      'Use completely unrelated words'
    ]
  }
];

export const PasswordSecurity: React.FC<PasswordSecurityProps> = ({ onComplete }) => {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState<'intro' | 'testing' | 'results'>('intro');
  const [currentPasswordIndex, setCurrentPasswordIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes
  const [startTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);

  const currentPassword = passwordTests[currentPasswordIndex];

  useEffect(() => {
    if (currentStep === 'testing' && !showExplanation) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep, showExplanation]);

  const handleAnswer = (strength: string) => {
    const newAnswers = [...userAnswers, strength];
    setUserAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextPassword = () => {
    setShowExplanation(false);
    setShowPassword(false);
    
    if (currentPasswordIndex === passwordTests.length - 1) {
      handleComplete();
    } else {
      setCurrentPasswordIndex(prev => prev + 1);
    }
  };

  const handleComplete = (finalAnswers = userAnswers) => {
    const correctAnswers = finalAnswers.filter((answer, index) => 
      answer === passwordTests[index].strength
    ).length;
    
    const score = Math.round((correctAnswers / passwordTests.length) * 100);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    setCurrentStep('results');
    onComplete(score, timeSpent);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return isDark ? 'text-red-400' : 'text-red-600';
      case 'medium': return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'strong': return isDark ? 'text-green-400' : 'text-green-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStrengthBg = (strength: string) => {
    switch (strength) {
      case 'weak': return isDark ? 'bg-red-800/20 border-red-600/30' : 'bg-red-50 border-red-200';
      case 'medium': return isDark ? 'bg-yellow-800/20 border-yellow-600/30' : 'bg-yellow-50 border-yellow-200';
      case 'strong': return isDark ? 'bg-green-800/20 border-green-600/30' : 'bg-green-50 border-green-200';
      default: return isDark ? 'bg-gray-800/20 border-gray-600/30' : 'bg-gray-50 border-gray-200';
    }
  };

  if (currentStep === 'intro') {
    return (
      <div className={`min-h-screen ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        {/* Header */}
        <div className={`border-b ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link 
                  to="/"
                  className={`p-2 rounded-lg mr-4 ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ArrowLeft className={`h-5 w-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                </Link>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg mr-4 overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/60504/pexels-photo-60504.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                      alt="Password Security"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Password Security Lab</h1>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Learn to evaluate password strength and security</p>
                  </div>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className={`rounded-lg border p-8 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-lg mx-auto mb-4 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/60504/pexels-photo-60504.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                  alt="Password Security"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Password Security Assessment</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Test your ability to evaluate password strength and understand security principles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`p-6 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <Shield className={`h-8 w-8 mb-3 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <h3 className={`font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Strength Analysis</h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Evaluate password complexity and resistance to attacks
                </p>
              </div>

              <div className={`p-6 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <Zap className={`h-8 w-8 mb-3 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <h3 className={`font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Crack Time</h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Learn how long it takes to break different passwords
                </p>
              </div>

              <div className={`p-6 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <CheckCircle className={`h-8 w-8 mb-3 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <h3 className={`font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Best Practices</h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Understand what makes passwords secure
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-lg border mb-8 ${
              isDark ? 'bg-blue-800/20 border-blue-600/30' : 'bg-blue-50 border-blue-200'
            }`}>
              <h3 className={`font-bold mb-3 ${
                isDark ? 'text-blue-400' : 'text-blue-700'
              }`}>How It Works</h3>
              <div className="space-y-2 text-sm">
                <p className={isDark ? 'text-blue-200' : 'text-blue-700'}>
                  • You'll be shown 5 different passwords
                </p>
                <p className={isDark ? 'text-blue-200' : 'text-blue-700'}>
                  • Evaluate each password's strength (Weak, Medium, Strong)
                </p>
                <p className={isDark ? 'text-blue-200' : 'text-blue-700'}>
                  • Learn about security issues and improvements
                </p>
                <p className={isDark ? 'text-blue-200' : 'text-blue-700'}>
                  • Get detailed feedback on password security principles
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('testing')}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isDark 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Start Password Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === passwordTests[index].strength
    ).length;
    const score = Math.round((correctAnswers / passwordTests.length) * 100);

    return (
      <div className={`min-h-screen ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-lg mx-auto mb-4 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/60504/pexels-photo-60504.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                alt="Password Security"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Assessment Complete!</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Here's how well you evaluated password security
            </p>
          </div>

          <div className={`rounded-lg border p-6 mb-6 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>{score}%</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>{correctAnswers}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Correct</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>{passwordTests.length}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total</div>
              </div>
            </div>

            <div className={`text-center p-4 rounded-lg border ${
              isDark ? 'bg-blue-800/20 border-blue-600/30' : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                {score >= 90 ? 'Excellent! You have strong password security knowledge.' :
                 score >= 75 ? 'Good work! You understand most password security principles.' :
                 score >= 60 ? 'Not bad, but review password security best practices.' :
                 'Keep learning! Password security is crucial for cybersecurity.'}
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className={`px-6 py-3 rounded-lg font-medium ${
                isDark 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`border-b ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                to="/"
                className={`p-2 rounded-lg mr-4 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className={`h-5 w-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </Link>
              <div>
                <h1 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Password Security Assessment</h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Evaluate password strength and security</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Password</div>
                <div className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentPasswordIndex + 1} / {passwordTests.length}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className={`h-5 w-5 ${
                  timeRemaining < 60 
                    ? 'text-red-400' 
                    : isDark ? 'text-green-400' : 'text-green-600'
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!showExplanation ? (
            <motion.div
              key={currentPasswordIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className={`p-6 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h2 className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Evaluate This Password</h2>
                
                <div className={`p-6 rounded-lg border mb-6 ${
                  isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`font-mono text-xl px-4 py-2 rounded border ${
                        isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                      }`}>
                        {showPassword ? currentPassword.password : '•'.repeat(currentPassword.password.length)}
                      </span>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className={`ml-4 p-2 rounded-lg ${
                          isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                        }`}
                      >
                        {showPassword ? 
                          <EyeOff className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} /> : 
                          <Eye className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                        }
                      </button>
                    </div>
                    
                    <div className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Length: {currentPassword.password.length} characters
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className={`text-lg font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>How would you rate this password's strength?</h3>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleAnswer('weak')}
                      className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                        isDark 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Weak
                    </button>
                    
                    <button
                      onClick={() => handleAnswer('medium')}
                      className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                        isDark 
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                          : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      }`}
                    >
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Medium
                    </button>
                    
                    <button
                      onClick={() => handleAnswer('strong')}
                      className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                        isDark 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Strong
                    </button>
                  </div>
                </div>
              </div>

              <div className={`p-6 ${
                isDark ? 'bg-gray-700/30' : 'bg-gray-50'
              }`}>
                <h4 className={`font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Consider These Factors:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className={`font-semibold mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Strength Indicators:</h5>
                    <ul className={`space-y-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <li>• Length (12+ characters)</li>
                      <li>• Mixed case letters</li>
                      <li>• Numbers and symbols</li>
                      <li>• Unpredictable patterns</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className={`font-semibold mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Weakness Indicators:</h5>
                    <ul className={`space-y-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <li>• Dictionary words</li>
                      <li>• Personal information</li>
                      <li>• Common patterns</li>
                      <li>• Short length</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-lg border p-8 text-center ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="mb-6">
                {userAnswers[currentPasswordIndex] === currentPassword.strength ? (
                  <CheckCircle className={`h-12 w-12 mx-auto mb-4 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`} />
                ) : (
                  <XCircle className={`h-12 w-12 mx-auto mb-4 ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`} />
                )}
                
                <h3 className={`text-xl font-bold mb-2 ${
                  userAnswers[currentPasswordIndex] === currentPassword.strength
                    ? isDark ? 'text-green-400' : 'text-green-600'
                    : isDark ? 'text-red-400' : 'text-red-600'
                }`}>
                  {userAnswers[currentPasswordIndex] === currentPassword.strength ? 'Correct!' : 'Incorrect'}
                </h3>
                
                <p className={`text-lg mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  This password is <strong>{currentPassword.strength}</strong>
                </p>
                
                <p className={`text-sm mb-4 ${getStrengthColor(currentPassword.strength)}`}>
                  Crack Time: {currentPassword.crackTime}
                </p>
              </div>

              <div className={`p-4 rounded-lg border mb-6 text-left ${getStrengthBg(currentPassword.strength)}`}>
                {currentPassword.issues.length > 0 && (
                  <div className="mb-4">
                    <h4 className={`font-bold mb-2 ${getStrengthColor(currentPassword.strength)}`}>
                      Issues:
                    </h4>
                    <ul className="space-y-1">
                      {currentPassword.issues.map((issue, idx) => (
                        <li key={idx} className={`flex items-start text-sm ${getStrengthColor(currentPassword.strength)}`}>
                          <span className="mr-2">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h4 className={`font-bold mb-2 ${getStrengthColor(currentPassword.strength)}`}>
                    Improvements:
                  </h4>
                  <ul className="space-y-1">
                    {currentPassword.improvements.map((improvement, idx) => (
                      <li key={idx} className={`flex items-start text-sm ${getStrengthColor(currentPassword.strength)}`}>
                        <span className="mr-2">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={handleNextPassword}
                className={`px-8 py-3 rounded-lg font-medium flex items-center mx-auto ${
                  isDark 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {currentPasswordIndex === passwordTests.length - 1 ? 'Complete Assessment' : 'Next Password'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
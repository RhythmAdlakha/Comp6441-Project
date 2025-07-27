import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Network, Shield, AlertTriangle, CheckCircle, 
  XCircle, Clock, Wifi, Lock, Unlock, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../App';

interface NetworkSecurityProps {
  onComplete: (score: number, timeSpent: number) => void;
}

interface NetworkChallenge {
  id: string;
  type: 'port-scan' | 'firewall' | 'protocol' | 'vulnerability';
  title: string;
  description: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

const challenges: NetworkChallenge[] = [
  {
    id: 'port-1',
    type: 'port-scan',
    title: 'Port Scan Analysis',
    description: 'Analyze this Nmap scan result to identify potential security issues',
    scenario: `Nmap scan report for target.company.com (192.168.1.100)
Host is up (0.0012s latency).

PORT     STATE  SERVICE
22/tcp   open   ssh
23/tcp   open   telnet
80/tcp   open   http
443/tcp  open   https
3389/tcp open   ms-wbt-server
5432/tcp open   postgresql`,
    question: 'Which open port presents the highest security risk?',
    options: ['Port 22 (SSH)', 'Port 23 (Telnet)', 'Port 80 (HTTP)', 'Port 443 (HTTPS)'],
    correctAnswer: 'Port 23 (Telnet)',
    explanation: 'Telnet (port 23) transmits data in plaintext, including passwords, making it extremely vulnerable to eavesdropping attacks.',
    points: 15
  },
  {
    id: 'firewall-1',
    type: 'firewall',
    title: 'Firewall Rule Configuration',
    description: 'Determine the correct firewall rule to block malicious traffic',
    scenario: `Your network is experiencing a DDoS attack from multiple IP addresses in the range 203.0.113.0/24. You need to block this traffic while maintaining legitimate access.`,
    question: 'Which firewall rule would effectively block the attack?',
    options: [
      'DENY ALL FROM 203.0.113.0/24 TO ANY',
      'ALLOW ALL FROM 203.0.113.0/24 TO ANY',
      'DENY TCP FROM 203.0.113.0/24 TO PORT 80',
      'ALLOW TCP FROM ANY TO 203.0.113.0/24'
    ],
    correctAnswer: 'DENY ALL FROM 203.0.113.0/24 TO ANY',
    explanation: 'This rule blocks all traffic from the attacking subnet while allowing legitimate traffic from other sources.',
    points: 20
  },
  {
    id: 'protocol-1',
    type: 'protocol',
    title: 'Network Protocol Security',
    description: 'Identify the most secure protocol for the given scenario',
    scenario: `A company needs to transfer sensitive financial data between two offices over the internet. They want to ensure the data is encrypted and authenticated.`,
    question: 'Which protocol combination provides the best security?',
    options: [
      'HTTP + FTP',
      'HTTPS + SFTP',
      'Telnet + FTP',
      'HTTP + TFTP'
    ],
    correctAnswer: 'HTTPS + SFTP',
    explanation: 'HTTPS provides encrypted web communication and SFTP provides secure file transfer with encryption and authentication.',
    points: 15
  },
  {
    id: 'vulnerability-1',
    type: 'vulnerability',
    title: 'Network Vulnerability Assessment',
    description: 'Identify the vulnerability in this network configuration',
    scenario: `Network Configuration:
- WiFi Network: "CompanyWiFi" 
- Security: WEP encryption
- Password: "password123"
- Guest network: Open (no password)
- Admin panel accessible via HTTP on default port`,
    question: 'What is the most critical vulnerability?',
    options: [
      'Weak WiFi password',
      'WEP encryption usage',
      'Open guest network',
      'HTTP admin panel'
    ],
    correctAnswer: 'WEP encryption usage',
    explanation: 'WEP encryption is fundamentally broken and can be cracked in minutes. It should be replaced with WPA3 or at minimum WPA2.',
    points: 20
  },
  {
    id: 'port-2',
    type: 'port-scan',
    title: 'Service Identification',
    description: 'Identify potentially dangerous services from this scan',
    scenario: `Nmap scan results:
21/tcp   open   ftp
25/tcp   open   smtp  
53/tcp   open   domain
110/tcp  open   pop3
143/tcp  open   imap
993/tcp  open   imaps
995/tcp  open   pop3s`,
    question: 'Which service should be immediately secured or disabled?',
    options: ['FTP (21)', 'SMTP (25)', 'DNS (53)', 'IMAPS (993)'],
    correctAnswer: 'FTP (21)',
    explanation: 'Standard FTP transmits credentials and data in plaintext. It should be replaced with SFTP or FTPS for secure file transfer.',
    points: 15
  }
];

export const NetworkSecurity: React.FC<NetworkSecurityProps> = ({ onComplete }) => {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState<'intro' | 'challenges' | 'results'>('intro');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(1500); // 25 minutes
  const [startTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentChallenge = challenges[currentChallengeIndex];

  useEffect(() => {
    if (currentStep === 'challenges' && !showExplanation) {
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

  const handleAnswer = () => {
    const correct = selectedAnswer === currentChallenge.correctAnswer;
    setIsCorrect(correct);
    
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextChallenge = () => {
    setShowExplanation(false);
    setSelectedAnswer('');
    
    if (currentChallengeIndex === challenges.length - 1) {
      handleComplete();
    } else {
      setCurrentChallengeIndex(prev => prev + 1);
    }
  };

  const handleComplete = (finalAnswers = userAnswers) => {
    const correctAnswers = finalAnswers.filter((answer, index) => 
      answer === challenges[index].correctAnswer
    ).length;
    
    const totalPoints = challenges.reduce((sum, challenge, index) => {
      const isCorrect = finalAnswers[index] === challenge.correctAnswer;
      return sum + (isCorrect ? challenge.points : 0);
    }, 0);
    
    const maxPoints = challenges.reduce((sum, challenge) => sum + challenge.points, 0);
    const score = Math.round((totalPoints / maxPoints) * 100);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    setCurrentStep('results');
    onComplete(score, timeSpent);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'port-scan': return Network;
      case 'firewall': return Shield;
      case 'protocol': return Wifi;
      case 'vulnerability': return AlertTriangle;
      default: return Network;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'port-scan': return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'firewall': return isDark ? 'text-green-400' : 'text-green-600';
      case 'protocol': return isDark ? 'text-purple-400' : 'text-purple-600';
      case 'vulnerability': return isDark ? 'text-red-400' : 'text-red-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
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
                      src="https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                      alt="Network Security"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Network Security Lab</h1>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Master network analysis and security assessment</p>
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
                  src="https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                  alt="Network Security"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Network Security Assessment</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Test your knowledge of network security, vulnerability assessment, and defensive strategies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className={`p-6 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <Network className={`h-8 w-8 mb-3 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <h3 className={`font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Port Scanning</h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Analyze Nmap results and identify security vulnerabilities
                </p>
              </div>

              <div className={`p-6 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <Shield className={`h-8 w-8 mb-3 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <h3 className={`font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Firewall Rules</h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Configure proper firewall rules to block malicious traffic
                </p>
              </div>

              <div className={`p-6 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <Wifi className={`h-8 w-8 mb-3 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`} />
                <h3 className={`font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Protocol Security</h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Choose secure protocols for different network scenarios
                </p>
              </div>

              <div className={`p-6 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <AlertTriangle className={`h-8 w-8 mb-3 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`} />
                <h3 className={`font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Vulnerability Assessment</h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Identify and prioritize network security weaknesses
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-lg border mb-8 ${
              isDark ? 'bg-blue-800/20 border-blue-600/30' : 'bg-blue-50 border-blue-200'
            }`}>
              <h3 className={`font-bold mb-3 ${
                isDark ? 'text-blue-400' : 'text-blue-700'
              }`}>Assessment Format</h3>
              <div className="space-y-2 text-sm">
                <p className={isDark ? 'text-blue-200' : 'text-blue-700'}>
                  • 5 network security scenarios with multiple choice questions
                </p>
                <p className={isDark ? 'text-blue-200' : 'text-blue-700'}>
                  • Analyze real network configurations and scan results
                </p>
                <p className={isDark ? 'text-blue-200' : 'text-blue-700'}>
                  • Apply security best practices to practical situations
                </p>
                <p className={isDark ? 'text-blue-200' : 'text-blue-700'}>
                  • Learn from detailed explanations of security concepts
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('challenges')}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isDark 
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }`}
              >
                Start Network Security Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === challenges[index].correctAnswer
    ).length;
    
    const totalPoints = challenges.reduce((sum, challenge, index) => {
      const isCorrect = userAnswers[index] === challenge.correctAnswer;
      return sum + (isCorrect ? challenge.points : 0);
    }, 0);
    
    const maxPoints = challenges.reduce((sum, challenge) => sum + challenge.points, 0);
    const score = Math.round((totalPoints / maxPoints) * 100);

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
                src="https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                alt="Network Security"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Network Security Assessment Complete!</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Here's how well you understood network security concepts
            </p>
          </div>

          <div className={`rounded-lg border p-6 mb-6 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-cyan-400' : 'text-cyan-600'
                }`}>{score}%</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Final Score</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>{totalPoints}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Points Earned</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>{correctAnswers}/{challenges.length}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Correct</div>
              </div>
            </div>

            <div className={`text-center p-4 rounded-lg border ${
              isDark ? 'bg-blue-800/20 border-blue-600/30' : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                {score >= 90 ? 'Excellent! You have strong network security knowledge.' :
                 score >= 75 ? 'Good work! You understand most network security concepts.' :
                 score >= 60 ? 'Not bad, but review network security fundamentals.' :
                 'Keep studying! Network security is crucial for cybersecurity professionals.'}
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className={`px-6 py-3 rounded-lg font-medium ${
                isDark 
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
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
                }`}>Network Security Assessment</h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Test your network security knowledge</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Challenge</div>
                <div className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentChallengeIndex + 1} / {challenges.length}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className={`h-5 w-5 ${
                  timeRemaining < 60 
                    ? 'text-red-400' 
                    : isDark ? 'text-cyan-400' : 'text-cyan-600'
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
              key="challenge"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className={`rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className={`p-6 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {React.createElement(getTypeIcon(currentChallenge.type), {
                      className: `h-6 w-6 mr-3 ${getTypeColor(currentChallenge.type)}`
                    })}
                    <h2 className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{currentChallenge.title}</h2>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDark ? 'bg-cyan-600/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                  }`}>
                    {currentChallenge.points} points
                  </div>
                </div>
                
                <p className={`${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{currentChallenge.description}</p>
              </div>

              <div className="p-6">
                <div className={`p-6 rounded-lg border mb-6 ${
                  isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                }`}>
                  <h3 className={`font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Scenario:</h3>
                  
                  <pre className={`font-mono text-sm whitespace-pre-wrap mb-4 p-4 rounded border ${
                    isDark ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'
                  }`}>
                    {currentChallenge.scenario}
                  </pre>
                  
                  <h4 className={`font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{currentChallenge.question}</h4>
                  
                  <div className="space-y-2">
                    {currentChallenge.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(option)}
                        className={`w-full p-3 text-left rounded border ${
                          selectedAnswer === option
                            ? isDark ? 'border-cyan-500 bg-cyan-800/20' : 'border-cyan-500 bg-cyan-50'
                            : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAnswer}
                    disabled={!selectedAnswer}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      selectedAnswer
                        ? isDark
                          ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                          : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                        : 'bg-gray-400 cursor-not-allowed text-gray-200'
                    }`}
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`rounded-lg border p-8 text-center ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="mb-6">
                {isCorrect ? (
                  <CheckCircle className={`h-12 w-12 mx-auto mb-4 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`} />
                ) : (
                  <XCircle className={`h-12 w-12 mx-auto mb-4 ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`} />
                )}
                
                <h3 className={`text-xl font-bold mb-2 ${
                  isCorrect
                    ? isDark ? 'text-green-400' : 'text-green-600'
                    : isDark ? 'text-red-400' : 'text-red-600'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
                
                <p className={`text-lg mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  The correct answer is: <strong>{currentChallenge.correctAnswer}</strong>
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${
                isDark ? 'bg-blue-800/20 border-blue-600/30' : 'bg-blue-50 border-blue-200'
              }`}>
                <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                  {currentChallenge.explanation}
                </p>
              </div>

              <button
                onClick={handleNextChallenge}
                className={`mt-6 px-8 py-3 rounded-lg font-medium flex items-center mx-auto ${
                  isDark 
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }`}
              
              >
                {currentChallengeIndex === challenges.length - 1 ? 'Complete Assessment' : 'Next Challenge'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
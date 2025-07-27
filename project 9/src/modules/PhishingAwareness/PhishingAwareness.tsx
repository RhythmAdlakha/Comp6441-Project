import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Mail, AlertTriangle, CheckCircle, XCircle, 
  Clock, Trophy, Eye, Shield, ExternalLink, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../App';

interface PhishingAwarenessProps {
  onComplete: (score: number, timeSpent: number) => void;
}

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  indicators: string[];
  explanation: string;
  timestamp: string;
  attachments?: string[];
  links?: string[];
}

const phishingEmails: Email[] = [
  {
    id: 'email-1',
    from: 'security@paypal-verification.net',
    subject: 'URGENT: Your PayPal Account Has Been Suspended',
    body: `Dear Valued Customer,

We have detected suspicious activity on your PayPal account. Your account has been temporarily suspended for your protection.

To restore access immediately, please click the link below and verify your information:

https://paypal-secure-verification.net/login

Failure to verify within 24 hours will result in permanent account closure.

Thank you,
PayPal Security Team`,
    isPhishing: true,
    indicators: [
      'Suspicious domain (paypal-verification.net)',
      'Urgent language and threats',
      'Fake verification link',
      'Generic greeting',
      'Pressure tactics'
    ],
    explanation: 'This is a classic phishing email using urgency and fear to trick users into clicking malicious links.',
    timestamp: '2024-01-15 14:23:45',
    links: ['https://paypal-secure-verification.net/login']
  },
  {
    id: 'email-2',
    from: 'noreply@company.com',
    subject: 'Monthly Security Report - January 2024',
    body: `Hi Team,

Please find attached the monthly security report for January 2024.

Key highlights:
- 99.9% uptime maintained
- Zero security incidents
- Completed quarterly penetration testing

Best regards,
IT Security Team`,
    isPhishing: false,
    indicators: [],
    explanation: 'This appears to be a legitimate internal security report with professional language and realistic content.',
    timestamp: '2024-01-15 09:15:22',
    attachments: ['security-report-jan-2024.pdf']
  },
  {
    id: 'email-3',
    from: 'winner@lottery-international.biz',
    subject: 'CONGRATULATIONS! You have won $2,500,000 USD',
    body: `CONGRATULATIONS!!!

You have been selected as the winner of our International Lottery Program. You have won the sum of $2,500,000 USD.

To claim your prize, please provide:
- Full Name
- Phone Number
- Bank Account Details
- Copy of ID

Contact our claims agent immediately:
Email: claims@lottery-international.biz
Phone: +234-801-234-5678

Congratulations once again!
International Lottery Commission`,
    isPhishing: true,
    indicators: [
      'Too good to be true offer',
      'Requests personal/financial information',
      'Suspicious domain (.biz)',
      'Foreign phone number',
      'Poor grammar and formatting'
    ],
    explanation: 'Classic advance fee fraud attempting to steal personal and financial information.',
    timestamp: '2024-01-15 16:45:12'
  },
  {
    id: 'email-4',
    from: 'hr@company.com',
    subject: 'Updated Employee Handbook Available',
    body: `Dear Team,

The updated Employee Handbook for 2024 is now available on the company intranet.

Key updates include:
- Remote work policy changes
- Updated benefits information
- New security protocols

Please review the handbook at your earliest convenience and acknowledge receipt by replying to this email.

Best regards,
Human Resources Department`,
    isPhishing: false,
    indicators: [],
    explanation: 'Legitimate HR communication with appropriate sender, realistic content, and professional tone.',
    timestamp: '2024-01-15 11:30:18'
  },
  {
    id: 'email-5',
    from: 'support@microsoft-security.org',
    subject: 'Microsoft Security Alert: Unusual Sign-in Activity',
    body: `Microsoft Security Alert

We detected unusual sign-in activity on your Microsoft account from:
Location: Unknown location
Device: Unknown device
Time: January 15, 2024 at 3:22 PM

If this was you, you can safely ignore this email. If not, please secure your account immediately by clicking below:

Secure My Account: https://microsoft-security.org/secure-account

Microsoft Security Team`,
    isPhishing: true,
    indicators: [
      'Fake Microsoft domain (.org instead of .com)',
      'Vague location information',
      'Suspicious security link',
      'Impersonating legitimate service'
    ],
    explanation: 'Phishing email impersonating Microsoft to steal login credentials through a fake security link.',
    timestamp: '2024-01-15 15:22:33',
    links: ['https://microsoft-security.org/secure-account']
  }
];

export const PhishingAwareness: React.FC<PhishingAwarenessProps> = ({ onComplete }) => {
  const { isDark } = useTheme();
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [startTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);

  const currentEmail = phishingEmails[currentEmailIndex];
  const isLastEmail = currentEmailIndex === phishingEmails.length - 1;

  useEffect(() => {
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
  }, []);

  const handleAnswer = (isPhishing: boolean) => {
    const newAnswers = [...userAnswers, isPhishing];
    setUserAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextEmail = () => {
    setShowExplanation(false);
    if (isLastEmail) {
      handleComplete();
    } else {
      setCurrentEmailIndex(prev => prev + 1);
    }
  };

  const handleComplete = (finalAnswers = userAnswers) => {
    const correctAnswers = finalAnswers.filter((answer, index) => 
      answer === phishingEmails[index].isPhishing
    ).length;
    
    const score = Math.round((correctAnswers / phishingEmails.length) * 100);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    setShowResult(true);
    onComplete(score, timeSpent);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResult) {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === phishingEmails[index].isPhishing
    ).length;
    const score = Math.round((correctAnswers / phishingEmails.length) * 100);

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
                ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
                : 'bg-gradient-to-br from-orange-500 to-orange-600'
            }`}>
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Phishing Test Complete!</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Here's how well you identified phishing attempts
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
                  isDark ? 'text-orange-400' : 'text-orange-600'
                }`}>{score}%</div>
                <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Accuracy</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>{correctAnswers}</div>
                <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Correct</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`}>{phishingEmails.length - correctAnswers}</div>
                <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Missed</div>
              </div>
            </div>

            <div className={`text-center p-4 rounded-lg border ${
              isDark 
                ? 'bg-blue-900/20 border-blue-500/30' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={isDark ? 'text-blue-200' : 'text-blue-700'}>
                {score >= 90 ? 'Excellent! You have strong phishing detection skills.' :
                 score >= 75 ? 'Good work! You caught most phishing attempts.' :
                 score >= 60 ? 'Not bad, but be more careful with suspicious emails.' :
                 'Keep practicing! Phishing emails can be very convincing.'}
              </p>
            </div>
          </motion.div>

          <div className="text-center">
            <Link
              to="/"
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                isDark 
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white' 
                  : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
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
        <div className="max-w-6xl mx-auto px-6 py-4">
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
                <div className={`p-3 rounded-xl mr-4 ${
                  isDark 
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
                    : 'bg-gradient-to-br from-orange-500 to-orange-600'
                }`}>
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Phishing Awareness Test</h1>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Identify suspicious emails and protect yourself</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Email</div>
                <div className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentEmailIndex + 1} / {phishingEmails.length}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className={`h-5 w-5 ${
                  timeRemaining < 60 
                    ? 'text-red-400' 
                    : isDark ? 'text-orange-400' : 'text-orange-600'
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
              key="email"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className={`rounded-xl border ${
                isDark 
                  ? 'bg-gray-800/80 border-gray-700/50' 
                  : 'bg-white border-gray-200 shadow-lg'
              }`}
            >
              {/* Email Header */}
              <div className={`p-6 border-b ${
                isDark ? 'border-gray-700/50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Mail className={`h-6 w-6 mr-3 ${
                      isDark ? 'text-orange-400' : 'text-orange-600'
                    }`} />
                    <h2 className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Inbox</h2>
                  </div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {currentEmail.timestamp}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium mr-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>From:</span>
                    <span className={`font-mono ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{currentEmail.from}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium mr-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Subject:</span>
                    <span className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{currentEmail.subject}</span>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-6">
                <div className={`whitespace-pre-line leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {currentEmail.body}
                </div>

                {/* Attachments */}
                {currentEmail.attachments && (
                  <div className="mt-6">
                    <h4 className={`font-medium mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Attachments:</h4>
                    <div className="space-y-2">
                      {currentEmail.attachments.map((attachment, idx) => (
                        <div key={idx} className={`flex items-center p-2 rounded border ${
                          isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                        }`}>
                          <span className={`text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {currentEmail.links && (
                  <div className="mt-6">
                    <h4 className={`font-medium mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Links:</h4>
                    <div className="space-y-2">
                      {currentEmail.links.map((link, idx) => (
                        <div key={idx} className={`flex items-center p-2 rounded border ${
                          isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                        }`}>
                          <ExternalLink className={`h-4 w-4 mr-2 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm font-mono ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                          }`}>{link}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={`p-6 border-t ${
                isDark ? 'border-gray-700/50' : 'border-gray-200'
              }`}>
                <div className="text-center mb-6">
                  <h3 className={`text-lg font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Is this email a phishing attempt?</h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Carefully examine the sender, content, and any suspicious elements</p>
                </div>
                
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={() => handleAnswer(true)}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                      isDark 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Phishing
                  </button>
                  
                  <button
                    onClick={() => handleAnswer(false)}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                      isDark 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Legitimate
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
              className={`rounded-xl border p-8 text-center ${
                isDark 
                  ? 'bg-gray-800/80 border-gray-700/50' 
                  : 'bg-white border-gray-200 shadow-lg'
              }`}
            >
              <div className="mb-6">
                {userAnswers[currentEmailIndex] === currentEmail.isPhishing ? (
                  <CheckCircle className={`h-16 w-16 mx-auto mb-4 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`} />
                ) : (
                  <XCircle className={`h-16 w-16 mx-auto mb-4 ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`} />
                )}
                
                <h3 className={`text-2xl font-bold mb-2 ${
                  userAnswers[currentEmailIndex] === currentEmail.isPhishing
                    ? isDark ? 'text-green-400' : 'text-green-600'
                    : isDark ? 'text-red-400' : 'text-red-600'
                }`}>
                  {userAnswers[currentEmailIndex] === currentEmail.isPhishing ? 'Correct!' : 'Incorrect'}
                </h3>
                
                <p className={`text-lg ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  This email is {currentEmail.isPhishing ? 'a phishing attempt' : 'legitimate'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border mb-6 ${
                currentEmail.isPhishing
                  ? isDark 
                    ? 'bg-red-900/20 border-red-500/30' 
                    : 'bg-red-50 border-red-200'
                  : isDark 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-green-50 border-green-200'
              }`}>
                <p className={`mb-4 ${
                  currentEmail.isPhishing
                    ? isDark ? 'text-red-200' : 'text-red-700'
                    : isDark ? 'text-green-200' : 'text-green-700'
                }`}>
                  {currentEmail.explanation}
                </p>

                {currentEmail.indicators.length > 0 && (
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-xl mr-4 overflow-hidden">
                      <img 
                        src="https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                        alt="Phishing Awareness"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className={`font-bold mb-2 ${
                        currentEmail.isPhishing
                          ? isDark ? 'text-red-400' : 'text-red-700'
                          : isDark ? 'text-green-400' : 'text-green-700'
                      }`}>
                        {currentEmail.isPhishing ? 'Warning Signs:' : 'Legitimate Indicators:'}
                      </h4>
                      <ul className="text-left space-y-1">
                        {currentEmail.indicators.map((indicator, idx) => (
                          <li key={idx} className={`flex items-start text-sm ${
                            currentEmail.isPhishing
                              ? isDark ? 'text-red-200' : 'text-red-700'
                              : isDark ? 'text-green-200' : 'text-green-700'
                          }`}>
                            <span className="mr-2">•</span>
                            <span>{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleNextEmail}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center mx-auto ${
                  isDark 
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white' 
                    : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                }`}
              >
                {isLastEmail ? 'Complete Assessment' : 'Next Email'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
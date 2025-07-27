import { Scenario } from '../types';

export const scenarios: Scenario[] = [
  {
    id: 'ssh-brute-force',
    title: 'SSH Brute Force Attack',
    description: 'Analyze SSH authentication logs to identify a brute force attack pattern',
    difficulty: 'Beginner',
    timeLimit: 300,
    category: 'Authentication Attacks',
    learningGoals: [
      'Identify failed login patterns',
      'Recognize suspicious IP addresses',
      'Understand brute force attack indicators'
    ],
    logs: [
      {
        id: 'ssh-1',
        timestamp: '2024-01-15 08:30:15',
        source: 'sshd[1234]',
        level: 'INFO',
        message: 'Accepted password for alice from 192.168.1.100 port 22 ssh2',
        isSuspicious: false,
        explanation: 'Normal successful login from internal network'
      },
      {
        id: 'ssh-2',
        timestamp: '2024-01-15 14:22:01',
        source: 'sshd[2341]',
        level: 'INFO',
        message: 'Failed password for root from 203.0.113.42 port 22 ssh2',
        isSuspicious: true,
        threatType: 'Brute Force Attack',
        explanation: 'Failed login attempt for root user from external IP - first sign of brute force',
        indicators: ['External IP address', 'Root user target', 'Failed authentication'],
        remediation: ['Block suspicious IP', 'Disable root SSH login', 'Implement fail2ban']
      },
      {
        id: 'ssh-3',
        timestamp: '2024-01-15 14:22:03',
        source: 'sshd[2342]',
        level: 'INFO',
        message: 'Failed password for admin from 203.0.113.42 port 22 ssh2',
        isSuspicious: true,
        threatType: 'Brute Force Attack',
        explanation: 'Second failed attempt from same IP, different username - brute force pattern',
        indicators: ['Same external IP', 'Admin user target', 'Rapid succession'],
        remediation: ['Immediate IP blocking', 'Alert security team', 'Monitor for additional attempts']
      },
      {
        id: 'ssh-4',
        timestamp: '2024-01-15 14:22:05',
        source: 'sshd[2343]',
        level: 'INFO',
        message: 'Failed password for user from 203.0.113.42 port 22 ssh2',
        isSuspicious: true,
        threatType: 'Brute Force Attack',
        explanation: 'Third consecutive failed attempt - confirms brute force attack',
        indicators: ['Continued attempts', 'Username enumeration', 'Automated attack pattern'],
        remediation: ['Activate incident response', 'Block IP range', 'Review all authentication logs']
      },
      {
        id: 'ssh-5',
        timestamp: '2024-01-15 14:22:07',
        source: 'sshd[2344]',
        level: 'INFO',
        message: 'Failed password for test from 203.0.113.42 port 22 ssh2',
        isSuspicious: true,
        threatType: 'Brute Force Attack',
        explanation: 'Fourth attempt with common username - attacker using dictionary attack',
        indicators: ['Dictionary attack pattern', 'Common username', 'Persistent attacker'],
        remediation: ['Implement account lockout', 'Enable MFA', 'Monitor for successful breaches']
      },
      {
        id: 'ssh-6',
        timestamp: '2024-01-15 14:22:09',
        source: 'sshd[2345]',
        level: 'INFO',
        message: 'Failed password for guest from 203.0.113.42 port 22 ssh2',
        isSuspicious: true,
        threatType: 'Brute Force Attack',
        explanation: 'Fifth failed attempt - brute force attack is escalating',
        indicators: ['Escalating attack', 'Guest account target', 'No signs of stopping'],
        remediation: ['Emergency IP blocking', 'Disable SSH temporarily', 'Contact ISP if needed']
      },
      {
        id: 'ssh-7',
        timestamp: '2024-01-15 15:45:22',
        source: 'sshd[3456]',
        level: 'INFO',
        message: 'Accepted password for bob from 192.168.1.101 port 22 ssh2',
        isSuspicious: false,
        explanation: 'Normal successful login from internal network after attack'
      }
    ],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Which IP address is conducting the brute force attack?',
        options: ['192.168.1.100', '203.0.113.42', '192.168.1.101', '127.0.0.1'],
        correctAnswer: '203.0.113.42',
        explanation: '203.0.113.42 appears in all the failed login attempts within seconds of each other.',
        points: 10
      },
      {
        id: 'q2',
        type: 'log-selection',
        question: 'Select ALL log entries that are part of the brute force attack:',
        correctAnswer: ['ssh-2', 'ssh-3', 'ssh-4', 'ssh-5', 'ssh-6'],
        explanation: 'All failed login attempts from 203.0.113.42 between 14:22:01 and 14:22:09 are part of the attack.',
        points: 15
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'What type of attack pattern is this?',
        options: ['Password Spraying', 'Credential Stuffing', 'Dictionary Attack', 'Rainbow Table Attack'],
        correctAnswer: 'Dictionary Attack',
        explanation: 'The attacker is trying common usernames (root, admin, user, test, guest) against the same target.',
        points: 10
      },
      {
        id: 'q4',
        type: 'text-input',
        question: 'What is the primary indicator that this is an automated attack? (one word)',
        correctAnswer: 'timing',
        explanation: 'The rapid succession of attempts (every 2 seconds) indicates automated tooling rather than manual attempts.',
        points: 5
      }
    ]
  },
  {
    id: 'insider-threat',
    title: 'Insider Threat - Suspicious Data Access',
    description: 'Identify unusual employee behavior indicating potential data theft',
    difficulty: 'Intermediate',
    timeLimit: 450,
    category: 'Insider Threats',
    learningGoals: [
      'Recognize abnormal access patterns',
      'Identify after-hours suspicious activity',
      'Understand data exfiltration indicators'
    ],
    logs: [
      {
        id: 'insider-1',
        timestamp: '2024-01-14 09:15:22',
        source: 'fileserver[1001]',
        level: 'INFO',
        message: 'User jsmith accessed file: /shares/projects/quarterly-report.docx',
        isSuspicious: false,
        explanation: 'Normal business file access during work hours'
      },
      {
        id: 'insider-2',
        timestamp: '2024-01-14 17:30:45',
        source: 'auth[2001]',
        level: 'INFO',
        message: 'User jsmith logged out from workstation WS-101',
        isSuspicious: false,
        explanation: 'Normal end-of-day logout'
      },
      {
        id: 'insider-3',
        timestamp: '2024-01-14 23:45:12',
        source: 'auth[2002]',
        level: 'INFO',
        message: 'User jsmith logged in from workstation WS-101',
        isSuspicious: true,
        threatType: 'After-hours Access',
        explanation: 'Employee logging in at 11:45 PM - highly unusual for normal business operations',
        indicators: ['After-hours access', 'Weekend/late night activity', 'No business justification'],
        remediation: ['Investigate access reason', 'Review recent employee status', 'Monitor subsequent activity']
      },
      {
        id: 'insider-4',
        timestamp: '2024-01-14 23:47:33',
        source: 'fileserver[1002]',
        level: 'INFO',
        message: 'User jsmith accessed file: /shares/hr/employee-database.xlsx',
        isSuspicious: true,
        threatType: 'Unauthorized Data Access',
        explanation: 'Access to HR database outside normal hours and job responsibilities',
        indicators: ['HR data access', 'After-hours activity', 'Outside job scope'],
        remediation: ['Immediate access review', 'Contact HR department', 'Check data permissions']
      },
      {
        id: 'insider-5',
        timestamp: '2024-01-14 23:52:18',
        source: 'fileserver[1003]',
        level: 'INFO',
        message: 'User jsmith copied 847MB from /shares/customer-data/ to /users/jsmith/temp/',
        isSuspicious: true,
        threatType: 'Large Data Transfer',
        explanation: 'Massive data copying to personal directory - potential data staging for theft',
        indicators: ['Large data volume', 'Personal directory', 'Customer data involved'],
        remediation: ['Immediate investigation', 'Preserve evidence', 'Contact legal team']
      },
      {
        id: 'insider-6',
        timestamp: '2024-01-15 00:15:44',
        source: 'email[3001]',
        level: 'WARN',
        message: 'User jsmith sent email with 3 attachments (245MB) to external address: personal@gmail.com',
        isSuspicious: true,
        threatType: 'Data Exfiltration',
        explanation: 'Large email attachments sent to personal email - clear data exfiltration attempt',
        indicators: ['External email destination', 'Large attachments', 'Personal email account'],
        remediation: ['Block email immediately', 'Preserve email content', 'Activate incident response']
      },
      {
        id: 'insider-7',
        timestamp: '2024-01-15 08:30:15',
        source: 'auth[2003]',
        level: 'INFO',
        message: 'User alice logged in from workstation WS-205',
        isSuspicious: false,
        explanation: 'Normal morning login by different employee'
      }
    ],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What time did the suspicious activity begin?',
        options: ['09:15:22', '17:30:45', '23:45:12', '00:15:44'],
        correctAnswer: '23:45:12',
        explanation: 'The first suspicious activity was the after-hours login at 23:45:12.',
        points: 5
      },
      {
        id: 'q2',
        type: 'log-selection',
        question: 'Select ALL entries showing suspicious behavior:',
        correctAnswer: ['insider-3', 'insider-4', 'insider-5', 'insider-6'],
        explanation: 'All activities from the after-hours login through data exfiltration are suspicious.',
        points: 20
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'What is the most serious indicator of data theft?',
        options: ['After-hours login', 'HR database access', 'Large file copying', 'Email to personal account'],
        correctAnswer: 'Email to personal account',
        explanation: 'Sending large attachments to a personal email account is the clearest sign of data exfiltration.',
        points: 15
      },
      {
        id: 'q4',
        type: 'text-input',
        question: 'How much data was copied to the personal directory? (include units)',
        correctAnswer: '847MB',
        explanation: 'The log shows 847MB was copied from customer data to the personal temp directory.',
        points: 5
      }
    ]
  },
  {
    id: 'dns-tunneling',
    title: 'DNS Tunneling - Covert Communication',
    description: 'Detect DNS tunneling used for covert data exfiltration',
    difficulty: 'Advanced',
    timeLimit: 600,
    category: 'Covert Channels',
    learningGoals: [
      'Identify DNS tunneling patterns',
      'Recognize unusual DNS query characteristics',
      'Understand covert communication methods'
    ],
    logs: [
      {
        id: 'dns-1',
        timestamp: '2024-01-15 10:15:22',
        source: 'dns[4001]',
        level: 'INFO',
        message: 'Query: www.google.com A record from 10.0.1.50',
        isSuspicious: false,
        explanation: 'Normal DNS query for popular website'
      },
      {
        id: 'dns-2',
        timestamp: '2024-01-15 10:16:33',
        source: 'dns[4002]',
        level: 'INFO',
        message: 'Query: 4d7a6c8b9e.tunnel.example.com TXT record from 10.0.1.75',
        isSuspicious: true,
        threatType: 'DNS Tunneling',
        explanation: 'Suspicious TXT record query with encoded data in subdomain - classic DNS tunneling',
        indicators: ['TXT record query', 'Encoded subdomain', 'Unusual domain pattern'],
        remediation: ['Block suspicious domain', 'Monitor DNS traffic', 'Investigate source host']
      },
      {
        id: 'dns-3',
        timestamp: '2024-01-15 10:16:35',
        source: 'dns[4003]',
        level: 'INFO',
        message: 'Query: 7f3e9a2d1c.tunnel.example.com TXT record from 10.0.1.75',
        isSuspicious: true,
        threatType: 'DNS Tunneling',
        explanation: 'Second TXT query with different encoded data - confirms tunneling activity',
        indicators: ['Sequential TXT queries', 'Same source IP', 'Pattern continuation'],
        remediation: ['Immediate domain blocking', 'Isolate source system', 'Deep packet inspection']
      },
      {
        id: 'dns-4',
        timestamp: '2024-01-15 10:16:37',
        source: 'dns[4004]',
        level: 'INFO',
        message: 'Query: b8f4c6e2a9.tunnel.example.com TXT record from 10.0.1.75',
        isSuspicious: true,
        threatType: 'DNS Tunneling',
        explanation: 'Third consecutive TXT query - active data exfiltration in progress',
        indicators: ['Rapid succession queries', 'Consistent pattern', 'Data exfiltration'],
        remediation: ['Emergency response', 'Network isolation', 'Forensic analysis']
      },
      {
        id: 'dns-5',
        timestamp: '2024-01-15 10:17:45',
        source: 'dns[4005]',
        level: 'INFO',
        message: 'Query: mail.company.com MX record from 10.0.1.30',
        isSuspicious: false,
        explanation: 'Normal MX record lookup for company email'
      },
      {
        id: 'dns-6',
        timestamp: '2024-01-15 10:18:12',
        source: 'dns[4006]',
        level: 'INFO',
        message: 'Query: 3c8f7b4e6d.tunnel.example.com TXT record from 10.0.1.75',
        isSuspicious: true,
        threatType: 'DNS Tunneling',
        explanation: 'Continued tunneling activity - persistent covert communication',
        indicators: ['Ongoing tunneling', 'Same attack pattern', 'Persistent threat'],
        remediation: ['Maintain isolation', 'Continue monitoring', 'Prepare incident report']
      }
    ],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Which DNS record type is being abused for tunneling?',
        options: ['A record', 'MX record', 'TXT record', 'CNAME record'],
        correctAnswer: 'TXT record',
        explanation: 'TXT records can contain arbitrary text data, making them ideal for DNS tunneling.',
        points: 10
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Which IP address is conducting the DNS tunneling?',
        options: ['10.0.1.50', '10.0.1.75', '10.0.1.30', '10.0.1.100'],
        correctAnswer: '10.0.1.75',
        explanation: '10.0.1.75 is the source of all suspicious TXT record queries.',
        points: 10
      },
      {
        id: 'q3',
        type: 'log-selection',
        question: 'Select ALL DNS tunneling attempts:',
        correctAnswer: ['dns-2', 'dns-3', 'dns-4', 'dns-6'],
        explanation: 'All TXT record queries to tunnel.example.com with encoded subdomains are tunneling attempts.',
        points: 20
      },
      {
        id: 'q4',
        type: 'text-input',
        question: 'What domain is being used for the covert channel?',
        correctAnswer: 'tunnel.example.com',
        explanation: 'The domain tunnel.example.com is being used with encoded subdomains for data exfiltration.',
        points: 10
      }
    ]
  }
];
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface UserProgress {
  totalModulesCompleted: number;
  totalScore: number;
  totalTimeSpent: number;
  moduleProgress: Record<string, {
    completed: number;
    total: number;
    bestScore: number;
    timeSpent: number;
  }>;
}

interface AuthContextType {
  user: User | null;
  userProgress: UserProgress;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProgress: (moduleId: string, score: number, timeSpent: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalModulesCompleted: 0,
    totalScore: 0,
    totalTimeSpent: 0,
    moduleProgress: {}
  });
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const savedUser = localStorage.getItem('cybersec_user');
    const savedProgress = localStorage.getItem('cybersec_progress');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    
    setIsLoading(false);
  }, []);


  useEffect(() => {
    if (user) {
      localStorage.setItem('cybersec_progress', JSON.stringify(userProgress));
    }
  }, [userProgress, user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {

      await new Promise(resolve => setTimeout(resolve, 1000));
      

      const storedUsers = JSON.parse(localStorage.getItem('cybersec_users') || '[]');
      const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          createdAt: foundUser.createdAt
        };
        
        setUser(userData);
        localStorage.setItem('cybersec_user', JSON.stringify(userData));
        

        const userProgressKey = `cybersec_progress_${foundUser.id}`;
        const savedProgress = localStorage.getItem(userProgressKey);
        if (savedProgress) {
          setUserProgress(JSON.parse(savedProgress));
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {

      await new Promise(resolve => setTimeout(resolve, 1000));
      

      const storedUsers = JSON.parse(localStorage.getItem('cybersec_users') || '[]');
      

      if (storedUsers.find((u: any) => u.email === email)) {
        return false;
      }
      

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        createdAt: new Date().toISOString()
      };
      

      storedUsers.push(newUser);
      localStorage.setItem('cybersec_users', JSON.stringify(storedUsers));
      

      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt
      };
      
      setUser(userData);
      localStorage.setItem('cybersec_user', JSON.stringify(userData));
      

      const initialProgress = {
        totalModulesCompleted: 0,
        totalScore: 0,
        totalTimeSpent: 0,
        moduleProgress: {}
      };
      setUserProgress(initialProgress);
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserProgress({
      totalModulesCompleted: 0,
      totalScore: 0,
      totalTimeSpent: 0,
      moduleProgress: {}
    });
    localStorage.removeItem('cybersec_user');
    localStorage.removeItem('cybersec_progress');
  };

  const updateProgress = (moduleId: string, score: number, timeSpent: number) => {
    setUserProgress(prev => {
      const moduleProgress = prev.moduleProgress[moduleId] || {
        completed: 0,
        total: 1,
        bestScore: 0,
        timeSpent: 0
      };

      const updatedModuleProgress = {
        ...moduleProgress,
        completed: moduleProgress.completed + 1,
        bestScore: Math.max(moduleProgress.bestScore, score),
        timeSpent: moduleProgress.timeSpent + timeSpent
      };

      const newProgress = {
        ...prev,
        totalModulesCompleted: prev.totalModulesCompleted + 1,
        totalScore: prev.totalScore + score,
        totalTimeSpent: prev.totalTimeSpent + timeSpent,
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: updatedModuleProgress
        }
      };

  
      if (user) {
        const userProgressKey = `cybersec_progress_${user.id}`;
        localStorage.setItem(userProgressKey, JSON.stringify(newProgress));
      }

      return newProgress;
    });
  };

  const value = {
    user,
    userProgress,
    login,
    signup,
    logout,
    updateProgress,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
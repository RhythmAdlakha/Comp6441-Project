import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../App';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-12 h-6 rounded-full p-1 transition-all duration-300 ${
        isDark 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'bg-gray-300 hover:bg-gray-400'
      }`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform duration-300 ${
          isDark ? 'translate-x-0' : 'translate-x-6'
        }`}
      >
        {isDark ? (
          <Moon className="h-2 w-2 text-slate-700" />
        ) : (
          <Sun className="h-2 w-2 text-yellow-500" />
        )}
      </div>
    </button>
  );
};
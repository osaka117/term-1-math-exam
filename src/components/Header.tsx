import React from 'react';
import { AppView } from '../types/math';
import { BookOpen, CheckSquare, Moon, Sun } from 'lucide-react';

interface Props {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<Props> = ({
  currentView,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="border-b-2 border-[#2b2a27] dark:border-[#44423c] bg-[#f9f8f4] dark:bg-[#181715] sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Title */}
        <button
          onClick={() => onNavigate('practice')}
          className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 bg-[#2b2a27] dark:bg-[#e6e4dc] text-white dark:text-[#181715] flex items-center justify-center font-bold text-lg retro-box-sm">
            ∑
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-[#1c1b18] dark:text-[#e6e4dc] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase font-mono">
              MATH REVIEWER
            </h1>
          </div>
        </button>

        {/* Navigation & Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('practice')}
              className={`px-3 py-1.5 retro-button flex items-center gap-1.5 cursor-pointer ${
                currentView === 'practice' || currentView === 'practice-picker'
                  ? 'bg-[#2b2a27] text-white dark:bg-[#e6e4dc] dark:text-[#1c1b18]'
                  : 'bg-white text-[#1c1b18] dark:bg-[#22211e] dark:text-[#e6e4dc]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>PRACTICE</span>
            </button>

            <button
              onClick={() => onNavigate('mock-config')}
              className={`px-3 py-1.5 retro-button flex items-center gap-1.5 cursor-pointer ${
                currentView.startsWith('mock')
                  ? 'bg-[#2b2a27] text-white dark:bg-[#e6e4dc] dark:text-[#1c1b18]'
                  : 'bg-white text-[#1c1b18] dark:bg-[#22211e] dark:text-[#e6e4dc]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>MOCK TEST</span>
            </button>
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="px-2.5 py-1.5 retro-button flex items-center gap-1.5 bg-white text-[#1c1b18] dark:bg-[#22211e] dark:text-[#fbbf24] cursor-pointer"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold">LIGHT</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] font-bold">DARK</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

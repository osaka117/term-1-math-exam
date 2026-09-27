import React from 'react';
import { AppView } from '../types/math';
import { BookOpen, CheckSquare } from 'lucide-react';

interface Props {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Header: React.FC<Props> = ({ currentView, onNavigate }) => {
  return (
    <header className="border-b-2 border-[#2b2a27] bg-[#f9f8f4] sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Title */}
        <button
          onClick={() => onNavigate('practice')}
          className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 bg-[#2b2a27] text-white flex items-center justify-center font-bold text-lg retro-box-sm">
            ∑
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-[#1c1b18] group-hover:text-blue-700 transition-colors uppercase font-mono">
              MATH REVIEWER
            </h1>
          </div>
        </button>

        {/* Navigation buttons */}
        <nav className="flex items-center flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => onNavigate('practice')}
            className={`px-3 py-1.5 retro-button flex items-center gap-1.5 ${
              currentView === 'practice' || currentView === 'practice-picker'
                ? 'bg-[#2b2a27] text-white'
                : 'bg-white text-[#1c1b18]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>PRACTICE</span>
          </button>

          <button
            onClick={() => onNavigate('mock-config')}
            className={`px-3 py-1.5 retro-button flex items-center gap-1.5 ${
              currentView.startsWith('mock') ? 'bg-[#2b2a27] text-white' : 'bg-white text-[#1c1b18]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>MOCK TEST</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

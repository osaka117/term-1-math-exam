import React from 'react';
import { TOPICS } from '../data/topics';
import { TopicId } from '../types/math';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

interface Props {
  onSelectTopic: (topicId: TopicId) => void;
  onBackToHome: () => void;
}

export const PracticeTopicPicker: React.FC<Props> = ({ onSelectTopic, onBackToHome }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Return button */}
      <button
        onClick={onBackToHome}
        className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-[#555] dark:text-[#a09e97] hover:text-[#1c1b18] dark:hover:text-[#fff] retro-button bg-white dark:bg-[#22211e] px-3 py-1 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO PRACTICE</span>
      </button>

      {/* Main card */}
      <div className="retro-box p-6 md:p-8 bg-white dark:bg-[#1a1916] mb-6">
        <div className="border-b-2 border-[#2b2a27] dark:border-[#383733] pb-4 mb-6">
          <h2 className="text-2xl font-bold font-mono text-[#1c1b18] dark:text-[#f3f1ea] tracking-tight">
            SELECT TOPIC
          </h2>
        </div>

        {/* 8 Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOPICS.map((topic, idx) => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className="p-4 border-2 border-[#2b2a27] dark:border-[#444] bg-[#faf9f5] dark:bg-[#201f1c] hover:bg-white dark:hover:bg-[#262521] hover:border-[#2563eb] text-left transition-all group cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 bg-[#2b2a27] dark:bg-[#e6e4dc] group-hover:bg-[#2563eb] text-white dark:text-[#181715] text-xs font-mono font-bold flex items-center justify-center transition-colors">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#2563eb] dark:text-[#60a5fa] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>START</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-[#1c1b18] dark:text-[#f3f1ea] font-mono mb-1.5 leading-snug group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa] transition-colors">
                  {topic.name}
                </h3>
                <p className="text-xs text-[#555] dark:text-[#a09e97] font-mono leading-relaxed mb-3">
                  {topic.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#e2e0d8] dark:border-[#383733] flex flex-wrap gap-1 text-[11px] font-mono text-[#777] dark:text-[#888]">
                {topic.subtopics.slice(0, 2).map((sub, sIdx) => (
                  <span key={sIdx} className="bg-[#edebe4] dark:bg-[#2a2925] text-[#333] dark:text-[#bbb] px-1.5 py-0.5">
                    {sub}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

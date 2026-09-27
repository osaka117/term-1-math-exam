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
        className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-[#555] hover:text-[#1c1b18] retro-button bg-white px-3 py-1 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO PRACTICE</span>
      </button>

      {/* Main card */}
      <div className="retro-box p-6 md:p-8 bg-white mb-6">
        <div className="border-b-2 border-[#2b2a27] pb-4 mb-6">
          <h2 className="text-2xl font-bold font-mono text-[#1c1b18] tracking-tight">
            SELECT TOPIC
          </h2>
        </div>

        {/* 8 Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOPICS.map((topic, idx) => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className="p-4 border-2 border-[#2b2a27] bg-[#faf9f5] hover:bg-white hover:border-[#2563eb] text-left transition-all group cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 bg-[#2b2a27] group-hover:bg-[#2563eb] text-white text-xs font-mono font-bold flex items-center justify-center transition-colors">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#2563eb] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>START</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-[#1c1b18] font-mono mb-1.5 leading-snug group-hover:text-[#2563eb] transition-colors">
                  {topic.name}
                </h3>
                <p className="text-xs text-[#555] font-mono leading-relaxed mb-3">
                  {topic.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#e2e0d8] flex flex-wrap gap-1 text-[11px] font-mono text-[#777]">
                {topic.subtopics.slice(0, 2).map((sub, sIdx) => (
                  <span key={sIdx} className="bg-[#edebe4] px-1.5 py-0.5">
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

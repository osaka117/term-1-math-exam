import React, { useState } from 'react';
import { TOPICS } from '../data/topics';
import { MockTestConfig, TopicId } from '../types/math';
import { ArrowLeft, Check, Play } from 'lucide-react';

interface Props {
  initialConfig: MockTestConfig;
  onStartMockTest: (config: MockTestConfig) => void;
  onBackToHome: () => void;
}

export const MockTestConfigScreen: React.FC<Props> = ({
  initialConfig,
  onStartMockTest,
  onBackToHome,
}) => {
  const [selectedTopics, setSelectedTopics] = useState<TopicId[]>(initialConfig.selectedTopics);
  const [questionCount, setQuestionCount] = useState<number>(initialConfig.questionCount || 10);
  const [customInput, setCustomInput] = useState<string>(
    [5, 10, 15, 20, 25, 30].includes(initialConfig.questionCount)
      ? ''
      : String(initialConfig.questionCount || '')
  );

  const presets = [5, 10, 15, 20, 25, 30];

  const toggleTopic = (id: TopicId) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedTopics(TOPICS.map((t) => t.id));
  };

  const handleClearAll = () => {
    setSelectedTopics([]);
  };

  const handlePresetSelect = (count: number) => {
    setQuestionCount(count);
    setCustomInput('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 50) {
      setQuestionCount(parsed);
    }
  };

  const canStart = selectedTopics.length > 0 && questionCount >= 1 && questionCount <= 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canStart) return;
    onStartMockTest({
      questionCount,
      selectedTopics,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={onBackToHome}
        className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-[#555] hover:text-[#1c1b18] retro-button bg-white px-3 py-1 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO PRACTICE</span>
      </button>

      <form onSubmit={handleSubmit} className="retro-box p-6 md:p-8 bg-white">
        {/* Title */}
        <div className="border-b-2 border-[#2b2a27] pb-4 mb-6">
          <h2 className="text-2xl font-bold font-mono text-[#1c1b18] tracking-tight">
            MOCK TEST
          </h2>
        </div>

        {/* 1. NUMBER OF QUESTIONS */}
        <div className="mb-8">
          <div className="mb-3">
            <h3 className="font-bold font-mono text-sm uppercase text-[#1c1b18]">
              NUMBER OF QUESTIONS
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {presets.map((preset) => {
              const isSelected = questionCount === preset && customInput === '';
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-4 py-2 font-mono text-xs font-bold border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#2b2a27] bg-[#2b2a27] text-white shadow-sm'
                      : 'border-[#2b2a27] bg-[#fbfbfa] text-[#1c1b18] hover:bg-white'
                  }`}
                >
                  {preset} QUESTIONS
                </button>
              );
            })}
          </div>

          {/* Custom Input */}
          <div className="flex items-center gap-2 max-w-xs mt-2">
            <span className="text-xs font-mono text-[#555]">Custom count:</span>
            <input
              type="number"
              min="1"
              max="50"
              placeholder="e.g. 12"
              value={customInput}
              onChange={handleCustomChange}
              className="w-24 px-3 py-1.5 border-2 border-[#2b2a27] bg-[#fdfdfc] font-mono text-xs focus:outline-none focus:border-blue-600"
            />
            <span className="text-[11px] font-mono text-[#777]">(1 – 50)</span>
          </div>

          <div className="mt-2 text-xs font-mono font-semibold text-[#0f766e]">
            Selected: {questionCount} questions
          </div>
        </div>

        {/* 2. TOPIC SELECTION */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="font-bold font-mono text-sm uppercase text-[#1c1b18] flex items-center gap-1.5">
                <span>SELECT TOPICS</span>
                <span className="text-xs font-normal text-[#666]">
                  ({selectedTopics.length} of {TOPICS.length} selected)
                </span>
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-2.5 py-1 retro-button bg-[#fafaf7] text-[#1c1b18] hover:bg-white cursor-pointer"
              >
                SELECT ALL
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-2.5 py-1 retro-button bg-[#fafaf7] text-[#1c1b18] hover:bg-white cursor-pointer"
              >
                CLEAR ALL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TOPICS.map((topic, idx) => {
              const isSelected = selectedTopics.includes(topic.id);
              return (
                <label
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`p-3 border-2 transition-all cursor-pointer select-none flex items-start gap-2.5 text-left ${
                    isSelected
                      ? 'border-[#0f766e] bg-[#f0fdfa]'
                      : 'border-[#d8d6cc] bg-[#fbfbfa] hover:border-[#999]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 mt-0.5 shrink-0 border border-[#2b2a27] flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-[#0f766e] text-white' : 'bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-mono font-bold text-[#1c1b18] block mb-0.5">
                      {idx + 1}. {topic.name}
                    </span>
                    <span className="text-[10px] text-[#666] font-mono block leading-snug">
                      {topic.shortName}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          {selectedTopics.length === 0 && (
            <p className="text-xs font-mono text-red-600 mt-2">
              * Please select at least one topic.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t-2 border-[#2b2a27] flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="submit"
            disabled={!canStart}
            className="w-full sm:w-auto px-6 py-2.5 retro-button bg-[#0f766e] text-white text-sm font-mono font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START MOCK TEST</span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { DIFFICULTY_LABELS, TOPICS } from '../data/topics';
import { DifficultyLevel, Question, TopicId } from '../types/math';
import { DiagramRenderer } from './diagrams/DiagramRenderer';
import { ArrowRight, CheckCircle2, ChevronDown, ListFilter, RotateCcw, XCircle } from 'lucide-react';

interface Props {
  question: Question;
  questionNumber: number;
  activeTopicId: TopicId;
  selectedDifficulty: DifficultyLevel | 'all';
  onNextQuestion: () => void;
  onChangeTopic: (newTopicId: TopicId) => void;
  onChangeDifficulty: (newDifficulty: DifficultyLevel | 'all') => void;
  onOpenTopicPicker: () => void;
}

export const PracticeQuestionScreen: React.FC<Props> = ({
  question,
  questionNumber,
  activeTopicId,
  selectedDifficulty,
  onNextQuestion,
  onChangeTopic,
  onChangeDifficulty,
  onOpenTopicPicker,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    onNextQuestion();
  };

  const handleTopicSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTopicId = e.target.value as TopicId;
    if (newTopicId !== activeTopicId) {
      setSelectedOptionId(null);
      setIsSubmitted(false);
      onChangeTopic(newTopicId);
    }
  };

  const handleDifficultyClick = (level: DifficultyLevel | 'all') => {
    if (level !== selectedDifficulty) {
      setSelectedOptionId(null);
      setIsSubmitted(false);
      onChangeDifficulty(level);
    }
  };

  const isCorrect = selectedOptionId === question.correctOptionId;
  const diffInfo = DIFFICULTY_LABELS[question.difficulty];

  const difficultyButtons: { id: DifficultyLevel | 'all'; label: string; tooltip: string }[] = [
    { id: 'all', label: 'RANDOM', tooltip: 'Random Difficulty (Levels 1–5)' },
    { id: 1, label: 'LVL 1', tooltip: 'Level 1: Very basic questions' },
    { id: 2, label: 'LVL 2', tooltip: 'Level 2: Basic questions' },
    { id: 3, label: 'LVL 3', tooltip: 'Level 3: Moderate questions' },
    { id: 4, label: 'LVL 4', tooltip: 'Level 4: Challenging questions' },
    { id: 5, label: 'LVL 5', tooltip: 'Level 5: Very challenging questions' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      {/* Control Bar: Topic & Difficulty Selectors */}
      <div className="retro-box p-3 sm:p-4 bg-[#f8f7f2] mb-5 space-y-3">
        {/* Row 1: Topic Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-mono text-xs font-bold text-[#2b2a27] shrink-0 tracking-wider">
              TOPIC:
            </span>
            <div className="relative flex-1 min-w-0">
              <select
                value={activeTopicId}
                onChange={handleTopicSelectChange}
                className="w-full font-mono text-xs font-bold border-2 border-[#2b2a27] bg-white px-2.5 py-1.5 text-[#1c1b18] cursor-pointer appearance-none pr-8 focus:outline-none focus:border-blue-600 truncate"
                title="Switch topic midway"
              >
                {TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#555] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenTopicPicker}
              className="retro-button px-2.5 py-1 bg-white text-xs font-mono font-semibold text-[#1c1b18] hover:bg-[#fafaf7] flex items-center gap-1 cursor-pointer"
              title="Browse all 8 topics"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>ALL TOPICS</span>
            </button>
            <span className="font-mono text-xs text-[#555] bg-white px-2.5 py-1 border border-[#ccc]">
              Q #{questionNumber}
            </span>
          </div>
        </div>

        {/* Row 2: Difficulty Selection */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#e2e0d8]">
          <span className="font-mono text-xs font-bold text-[#2b2a27] shrink-0 tracking-wider">
            DIFFICULTY:
          </span>
          <div className="flex flex-wrap gap-1">
            {difficultyButtons.map((btn) => {
              const isActive = selectedDifficulty === btn.id;
              return (
                <button
                  key={String(btn.id)}
                  type="button"
                  onClick={() => handleDifficultyClick(btn.id)}
                  title={btn.tooltip}
                  className={`px-2.5 py-1 text-xs font-mono font-bold border transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#2b2a27] bg-[#2b2a27] text-white shadow-xs'
                      : 'border-[#2b2a27] bg-white text-[#1c1b18] hover:bg-[#eae8e0]'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Question Box */}
      <div className="retro-box p-5 sm:p-7 bg-white mb-6">
        {/* Topic Header & Level Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2b2a27] pb-3 mb-5">
          <span className="px-2.5 py-0.5 bg-[#2563eb] text-white font-mono text-xs font-bold tracking-wider">
            {question.topicName}
          </span>
          <span className="font-mono text-xs font-semibold px-2 py-0.5 border border-[#2b2a27] bg-[#f5f4ef] text-[#2b2a27]">
            {diffInfo.label}
          </span>
        </div>

        {/* Question Prompt */}
        <div className="mb-5">
          <h2 className="text-base sm:text-lg font-mono font-medium text-[#1c1b18] whitespace-pre-line leading-relaxed">
            {question.prompt}
          </h2>
        </div>

        {/* Visual Diagram if available */}
        {question.diagramType !== 'none' && question.diagramData && (
          <div className="my-4 p-2 bg-[#faf9f6] border border-[#e2e0d8]">
            <DiagramRenderer type={question.diagramType} data={question.diagramData} />
          </div>
        )}

        {/* Multiple Choice Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let optStyle = 'border-[#2b2a27] bg-white hover:bg-[#faf9f5]';

            if (isSubmitted) {
              if (opt.id === question.correctOptionId) {
                optStyle = 'border-[#15803d] bg-[#f0fdf4] text-[#15803d] font-bold';
              } else if (isSelected && !isCorrect) {
                optStyle = 'border-[#b91c1c] bg-[#fef2f2] text-[#b91c1c] line-through';
              } else {
                optStyle = 'border-[#d5d3cb] bg-[#fafaf8] opacity-60';
              }
            } else if (isSelected) {
              optStyle = 'border-[#2563eb] bg-[#eff6ff] shadow-sm';
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isSubmitted}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`w-full p-3.5 border-2 text-left transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${optStyle}`}
              >
                <span
                  className={`w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs border ${
                    isSelected
                      ? 'bg-[#2b2a27] text-white border-[#2b2a27]'
                      : 'bg-[#f4f3ef] text-[#1c1b18] border-[#2b2a27]'
                  }`}
                >
                  {opt.id}
                </span>
                <span className="font-mono text-sm leading-relaxed text-[#1c1b18] flex-1">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Submit or Next Button */}
        {!isSubmitted ? (
          <div className="pt-4 border-t border-[#e2e0d8] flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              className="px-6 py-2.5 retro-button bg-[#2563eb] text-white font-mono text-sm font-bold cursor-pointer disabled:opacity-50"
            >
              SUBMIT ANSWER
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-4 border-t-2 border-[#2b2a27]">
            {/* Feedback Status Banner */}
            <div
              className={`p-4 border-2 flex items-center justify-between gap-3 ${
                isCorrect
                  ? 'border-[#15803d] bg-[#f0fdf4] text-[#15803d]'
                  : 'border-[#b91c1c] bg-[#fef2f2] text-[#b91c1c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 stroke-[2.5]" />
                ) : (
                  <XCircle className="w-5 h-5 shrink-0 stroke-[2.5]" />
                )}
                <div>
                  <h4 className="font-mono font-bold text-sm tracking-wide">
                    {isCorrect ? 'CORRECT ANSWER' : 'INCORRECT ANSWER'}
                  </h4>
                  <p className="font-mono text-xs mt-0.5">
                    Correct Option: <span className="font-bold underline">{question.correctOptionId}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="px-5 py-2 retro-button bg-[#2b2a27] text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>NEXT QUESTION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step-by-Step Mathematical Explanation */}
            <div className="retro-box-sm p-4 bg-[#faf9f5]">
              <h5 className="font-mono font-bold text-xs uppercase tracking-wider text-[#2b2a27] mb-2 border-b border-[#e2e0d8] pb-1">
                STEP-BY-STEP MATHEMATICAL SOLUTION
              </h5>
              <div className="font-mono text-xs text-[#333] whitespace-pre-line leading-relaxed mb-3">
                {question.explanation}
              </div>

              {question.steps && question.steps.length > 0 && (
                <div className="bg-white p-3 border border-[#d8d6cc]">
                  <span className="font-mono text-[11px] font-bold text-[#555] block mb-1.5 uppercase">
                    Key Calculation Steps:
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-xs font-mono text-[#222]">
                    {question.steps.map((st, idx) => (
                      <li key={idx} className="leading-snug">
                        {st}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Bottom Next Question bar */}
            <div className="flex items-center justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 retro-button bg-[#2563eb] text-white font-mono text-sm font-bold flex items-center gap-2 cursor-pointer"
              >
                <span>NEXT QUESTION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

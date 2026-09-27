import React, { useState } from 'react';
import { DIFFICULTY_LABELS } from '../data/topics';
import { Question } from '../types/math';
import { DiagramRenderer } from './diagrams/DiagramRenderer';
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckSquare } from 'lucide-react';

interface Props {
  questions: Question[];
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | undefined>;
  currentIndex: number;
  onSelectAnswer: (questionId: string, optionId: 'A' | 'B' | 'C' | 'D') => void;
  onNavigateQuestion: (index: number) => void;
  onSubmitTest: () => void;
  onCancelTest: () => void;
}

export const MockTestQuestionScreen: React.FC<Props> = ({
  questions,
  userAnswers,
  currentIndex,
  onSelectAnswer,
  onNavigateQuestion,
  onSubmitTest,
  onCancelTest,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const currentAnswer = userAnswers[currentQ.id];

  const answeredCount = Object.values(userAnswers).filter(Boolean).length;
  const unansweredCount = total - answeredCount;

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigateQuestion(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      onNavigateQuestion(currentIndex + 1);
    }
  };

  const diffInfo = DIFFICULTY_LABELS[currentQ.difficulty];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Test Control Bar */}
      <div className="retro-box p-4 bg-[#f8f7f2] mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancelTest}
            className="retro-button px-3 py-1 bg-white text-xs font-mono text-[#555] hover:text-[#1c1b18] cursor-pointer"
          >
            EXIT TEST
          </button>
          <div className="font-mono text-xs">
            <span className="font-bold text-[#1c1b18]">QUESTION {currentIndex + 1}</span>
            <span className="text-[#666]"> OF {total}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono">
            <span className="text-[#666]">Progress: </span>
            <span className="font-bold text-[#0f766e]">
              {answeredCount}/{total} answered
            </span>
          </div>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="retro-button px-4 py-1.5 bg-[#0f766e] text-white font-mono text-xs font-bold cursor-pointer"
          >
            FINISH TEST
          </button>
        </div>
      </div>

      {/* Question Jumper Grid / Palette */}
      <div className="retro-box-sm p-3 bg-white mb-6">
        <div className="text-[11px] font-mono text-[#666] mb-2 flex items-center justify-between">
          <span>QUESTION NAVIGATION JUMPER:</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#0f766e] inline-block"></span>
              Answered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#f4f3ef] border border-[#2b2a27] inline-block"></span>
              Unanswered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 border-2 border-blue-600 bg-white inline-block"></span>
              Current
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, idx) => {
            const hasAnswer = Boolean(userAnswers[q.id]);
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => onNavigateQuestion(idx)}
                className={`w-8 h-8 font-mono text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                  isCurrent
                    ? 'border-2 border-blue-600 ring-2 ring-blue-300'
                    : 'border-[#2b2a27]'
                } ${
                  hasAnswer ? 'bg-[#0f766e] text-white' : 'bg-[#f4f3ef] text-[#2b2a27]'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="retro-box p-6 md:p-8 bg-white mb-6">
        {/* Header tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2b2a27] pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#2b2a27] text-white font-mono text-xs font-bold">
              {currentQ.topicName}
            </span>
          </div>
          <span className="font-mono text-xs font-semibold px-2 py-0.5 border border-[#2b2a27] bg-[#f5f4ef] text-[#2b2a27]">
            {diffInfo.label}
          </span>
        </div>

        {/* Prompt */}
        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-mono font-medium text-[#1c1b18] whitespace-pre-line leading-relaxed">
            {currentQ.prompt}
          </h2>
        </div>

        {/* Diagram if any */}
        {currentQ.diagramType !== 'none' && currentQ.diagramData && (
          <div className="my-4 p-2 bg-[#faf9f6] border border-[#e2e0d8]">
            <DiagramRenderer type={currentQ.diagramType} data={currentQ.diagramData} />
          </div>
        )}

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQ.options.map((opt) => {
            const isSelected = currentAnswer === opt.id;
            return (
              <label
                key={opt.id}
                onClick={() => onSelectAnswer(currentQ.id, opt.id)}
                className={`p-3.5 border-2 transition-all flex items-start gap-3 cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#0f766e] bg-[#f0fdfa] shadow-sm'
                    : 'border-[#2b2a27] bg-white hover:bg-[#faf9f5]'
                }`}
              >
                <div
                  className={`w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs border ${
                    isSelected
                      ? 'bg-[#0f766e] text-white border-[#0f766e]'
                      : 'bg-[#f4f3ef] text-[#1c1b18] border-[#2b2a27]'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : opt.id}
                </div>
                <span className="font-mono text-sm leading-relaxed text-[#1c1b18] flex-1">
                  {opt.text}
                </span>
              </label>
            );
          })}
        </div>

        {/* Navigation buttons: PREVIOUS / NEXT */}
        <div className="pt-4 border-t-2 border-[#2b2a27] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 retro-button bg-white text-[#1c1b18] font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PREVIOUS</span>
          </button>

          <span className="text-xs font-mono text-[#666] hidden sm:inline">
            You may change your answer anytime before finishing.
          </span>

          {currentIndex < total - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 retro-button bg-[#2b2a27] text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>NEXT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-2.5 retro-button bg-[#0f766e] text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>FINISH TEST</span>
              <CheckSquare className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="retro-box p-6 max-w-md w-full bg-white">
            <h3 className="text-xl font-bold font-mono text-[#1c1b18] mb-2 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#0f766e]" />
              FINISH & SUBMIT TEST?
            </h3>

            {unansweredCount > 0 ? (
              <div className="p-3 bg-[#fffbeb] border border-[#f59e0b] mb-4 text-xs font-mono text-[#92400e] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}!</p>
                  <p className="mt-1 text-[11px]">
                    Unanswered questions will be scored as incorrect. You can return to answer them or submit anyway.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs font-mono text-[#555] mb-4">
                All {total} questions have been answered. Would you like to submit and view your detailed evaluation?
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e2e0d8]">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 retro-button bg-white text-xs font-mono font-bold text-[#333] cursor-pointer"
              >
                RETURN TO TEST
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  onSubmitTest();
                }}
                className="px-5 py-2 retro-button bg-[#0f766e] text-white text-xs font-mono font-bold cursor-pointer"
              >
                CONFIRM SUBMISSION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

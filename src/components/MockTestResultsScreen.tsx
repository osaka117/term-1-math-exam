import React, { useState } from 'react';
import { DIFFICULTY_LABELS } from '../data/topics';
import { MockTestResult, TopicId } from '../types/math';
import { DiagramRenderer } from './diagrams/DiagramRenderer';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, Filter, RotateCcw, XCircle } from 'lucide-react';

interface Props {
  result: MockTestResult;
  onRetakeSameTest: () => void;
  onConfigureNewTest: () => void;
  onReturnToHome: () => void;
}

export const MockTestResultsScreen: React.FC<Props> = ({
  result,
  onRetakeSameTest,
  onConfigureNewTest,
  onReturnToHome,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedQuestionIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const all: Record<string, boolean> = {};
    result.questions.forEach((q) => {
      all[q.id] = true;
    });
    setExpandedQuestionIds(all);
  };

  const handleCollapseAll = () => {
    setExpandedQuestionIds({});
  };

  // Filter questions
  const filteredQuestions = result.questions.filter((q) => {
    const userAnswer = result.userAnswers[q.id];
    const isCorrect = userAnswer === q.correctOptionId;

    if (filterMode === 'incorrect' && isCorrect) return false;
    if (filterMode === 'correct' && !isCorrect) return false;
    if (selectedTopicFilter !== 'all' && q.topicId !== selectedTopicFilter) return false;

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Test Complete Header Banner */}
      <div className="retro-box p-6 md:p-8 bg-white mb-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold font-mono text-[#1c1b18] mb-4">
          TEST COMPLETE
        </h2>

        {/* Score Metrics (Clean, Academic, No Gamification) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto my-6">
          <div className="p-4 border-2 border-[#2b2a27] bg-[#fcfbf9]">
            <span className="text-[11px] font-mono text-[#666] uppercase block mb-1">
              NUMBER CORRECT
            </span>
            <span className="text-3xl font-bold font-mono text-[#15803d]">
              {result.correct}
            </span>
            <span className="text-xs font-mono text-[#777] block mt-0.5">
              out of {result.total} questions
            </span>
          </div>

          <div className="p-4 border-2 border-[#2b2a27] bg-[#fcfbf9]">
            <span className="text-[11px] font-mono text-[#666] uppercase block mb-1">
              NUMBER INCORRECT
            </span>
            <span className="text-3xl font-bold font-mono text-[#b91c1c]">
              {result.incorrect}
            </span>
            <span className="text-xs font-mono text-[#777] block mt-0.5">
              {result.total - (result.correct + result.incorrect)} unattempted
            </span>
          </div>

          <div className="p-4 border-2 border-[#2b2a27] bg-[#fcfbf9]">
            <span className="text-[11px] font-mono text-[#666] uppercase block mb-1">
              PERCENTAGE
            </span>
            <span className="text-3xl font-bold font-mono text-[#1c1b18]">
              {result.percentage}%
            </span>
            <span className="text-xs font-mono text-[#777] block mt-0.5">
              overall accuracy
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetakeSameTest}
            className="px-5 py-2 retro-button bg-[#2563eb] text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RETAKE TEST</span>
          </button>
          <button
            onClick={onConfigureNewTest}
            className="px-5 py-2 retro-button bg-white text-[#1c1b18] font-mono text-xs font-bold cursor-pointer"
          >
            CONFIGURE NEW TEST
          </button>
          <button
            onClick={onReturnToHome}
            className="px-5 py-2 retro-button bg-[#2b2a27] text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>BACK TO PRACTICE</span>
          </button>
        </div>
      </div>

      {/* Performance by Topic & Difficulty Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* By Topic */}
        <div className="retro-box p-5 bg-white">
          <h3 className="font-mono font-bold text-sm text-[#1c1b18] uppercase border-b border-[#2b2a27] pb-2 mb-3">
            PERFORMANCE BY TOPIC
          </h3>
          <div className="space-y-2">
            {Object.entries(result.byTopic).map(([topicId, stats]) => {
              if (stats.total === 0) return null;
              const pct = Math.round((stats.correct / stats.total) * 100);
              const qTopic = result.questions.find((q) => q.topicId === topicId);
              return (
                <div key={topicId} className="p-2 border border-[#e5e3dc] bg-[#faf9f6]">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="font-bold text-[#1c1b18] truncate pr-2">
                      {qTopic?.topicName || topicId}
                    </span>
                    <span className="font-bold shrink-0">
                      {stats.correct}/{stats.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#e5e3dc] h-2 border border-[#ccc]">
                    <div
                      className="bg-[#0f766e] h-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Difficulty */}
        <div className="retro-box p-5 bg-white">
          <h3 className="font-mono font-bold text-sm text-[#1c1b18] uppercase border-b border-[#2b2a27] pb-2 mb-3">
            PERFORMANCE BY DIFFICULTY
          </h3>
          <div className="space-y-2">
            {([1, 2, 3, 4, 5] as (1 | 2 | 3 | 4 | 5)[]).map((level) => {
              const stats = result.byDifficulty[level];
              if (!stats || stats.total === 0) return null;
              const pct = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={level} className="p-2 border border-[#e5e3dc] bg-[#faf9f6]">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="font-bold text-[#1c1b18]">
                      LEVEL {level}
                    </span>
                    <span className="font-bold">
                      {stats.correct}/{stats.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#e5e3dc] h-2 border border-[#ccc]">
                    <div
                      className="bg-[#2563eb] h-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Question Review List */}
      <div className="retro-box p-6 bg-white mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#2b2a27] pb-4 mb-6">
          <div>
            <h3 className="font-mono font-bold text-lg text-[#1c1b18] tracking-tight">
              DETAILED QUESTION REVIEW & STEP-BY-STEP SOLUTIONS
            </h3>
            <p className="text-xs font-mono text-[#666]">
              Review questions, compare your answers with the correct choices, and study the complete explanations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={handleExpandAll}
              className="px-2.5 py-1 retro-button bg-[#fafaf7] text-[#1c1b18] cursor-pointer"
            >
              EXPAND ALL
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-2.5 py-1 retro-button bg-[#fafaf7] text-[#1c1b18] cursor-pointer"
            >
              COLLAPSE ALL
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-[#f8f7f2] border border-[#2b2a27] mb-6 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#555]">
            <Filter className="w-3.5 h-3.5" />
            <span>FILTER BY STATUS:</span>
          </div>

          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 border transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#2b2a27] text-white border-[#2b2a27]'
                : 'bg-white text-[#1c1b18] border-[#ccc]'
            }`}
          >
            ALL ({result.total})
          </button>
          <button
            onClick={() => setFilterMode('incorrect')}
            className={`px-2.5 py-1 border transition-all cursor-pointer ${
              filterMode === 'incorrect'
                ? 'bg-[#b91c1c] text-white border-[#b91c1c]'
                : 'bg-white text-[#1c1b18] border-[#ccc]'
            }`}
          >
            INCORRECT ({result.incorrect})
          </button>
          <button
            onClick={() => setFilterMode('correct')}
            className={`px-2.5 py-1 border transition-all cursor-pointer ${
              filterMode === 'correct'
                ? 'bg-[#15803d] text-white border-[#15803d]'
                : 'bg-white text-[#1c1b18] border-[#ccc]'
            }`}
          >
            CORRECT ({result.correct})
          </button>
        </div>

        {/* Question cards */}
        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <p className="text-center py-8 font-mono text-sm text-[#777]">
              No questions match the selected filter.
            </p>
          ) : (
            filteredQuestions.map((q, idx) => {
              const qIndex = result.questions.findIndex((item) => item.id === q.id);
              const userAnswer = result.userAnswers[q.id];
              const isCorrect = userAnswer === q.correctOptionId;
              const isExpanded = expandedQuestionIds[q.id] ?? true;
              const diffInfo = DIFFICULTY_LABELS[q.difficulty];

              return (
                <div
                  key={q.id}
                  className={`border-2 transition-all ${
                    isCorrect ? 'border-[#15803d]/40 bg-[#fbfdfb]' : 'border-[#b91c1c]/40 bg-[#fdfbfb]'
                  }`}
                >
                  {/* Card Header Bar */}
                  <div
                    onClick={() => toggleExpand(q.id)}
                    className="p-3.5 border-b border-[#e5e3dc] flex flex-wrap items-center justify-between gap-2 cursor-pointer bg-white select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-[#15803d] shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#b91c1c] shrink-0" />
                      )}
                      <div>
                        <span className="font-mono font-bold text-xs text-[#1c1b18]">
                          QUESTION #{qIndex + 1}
                        </span>
                        <span className="font-mono text-xs text-[#666] ml-2">
                          [{q.topicName}]
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] px-2 py-0.5 border border-[#ccc] bg-[#f8f7f2]">
                        {diffInfo.label}
                      </span>
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 ${
                          isCorrect ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'
                        }`}
                      >
                        {isCorrect ? 'CORRECT' : userAnswer ? 'INCORRECT' : 'UNANSWERED'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#777]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#777]" />
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  {isExpanded && (
                    <div className="p-4 md:p-6 bg-white space-y-4">
                      {/* Prompt */}
                      <p className="font-mono text-sm text-[#1c1b18] whitespace-pre-line leading-relaxed">
                        {q.prompt}
                      </p>

                      {/* Diagram */}
                      {q.diagramType !== 'none' && q.diagramData && (
                        <div className="my-3 p-2 bg-[#faf9f6] border border-[#e2e0d8]">
                          <DiagramRenderer type={q.diagramType} data={q.diagramData} />
                        </div>
                      )}

                      {/* Options evaluation */}
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isUserChoice = userAnswer === opt.id;
                          const isCorrectChoice = q.correctOptionId === opt.id;

                          let style = 'border-[#e2e0d8] bg-[#fafaf8] opacity-75';
                          if (isCorrectChoice) {
                            style = 'border-[#15803d] bg-[#f0fdf4] text-[#15803d] font-bold opacity-100';
                          } else if (isUserChoice && !isCorrect) {
                            style = 'border-[#b91c1c] bg-[#fef2f2] text-[#b91c1c] opacity-100';
                          }

                          return (
                            <div
                              key={opt.id}
                              className={`p-2.5 border text-xs font-mono flex items-start gap-2.5 ${style}`}
                            >
                              <span className="w-5 h-5 border border-current flex items-center justify-center font-bold text-[11px] shrink-0">
                                {opt.id}
                              </span>
                              <span className="flex-1 leading-snug">{opt.text}</span>
                              {isCorrectChoice && (
                                <span className="text-[10px] uppercase font-bold text-[#15803d] shrink-0">
                                  ✓ Correct Answer
                                </span>
                              )}
                              {isUserChoice && !isCorrectChoice && (
                                <span className="text-[10px] uppercase font-bold text-[#b91c1c] shrink-0">
                                  ✗ Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="p-4 bg-[#faf9f5] border border-[#2b2a27]/30 mt-4">
                        <h5 className="font-mono font-bold text-xs uppercase tracking-wider text-[#2b2a27] mb-2 border-b border-[#e2e0d8] pb-1">
                          STEP-BY-STEP MATHEMATICAL SOLUTION
                        </h5>
                        <div className="font-mono text-xs text-[#333] whitespace-pre-line leading-relaxed mb-3">
                          {q.explanation}
                        </div>

                        {q.steps && q.steps.length > 0 && (
                          <div className="bg-white p-3 border border-[#d8d6cc]">
                            <span className="font-mono text-[11px] font-bold text-[#555] block mb-1 uppercase">
                              Solution Steps:
                            </span>
                            <ol className="list-decimal list-inside space-y-1 text-xs font-mono text-[#222]">
                              {q.steps.map((st, sIdx) => (
                                <li key={sIdx} className="leading-snug">
                                  {st}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

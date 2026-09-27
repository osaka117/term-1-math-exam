/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { PracticeTopicPicker } from './components/PracticeTopicPicker';
import { PracticeQuestionScreen } from './components/PracticeQuestionScreen';
import { MockTestConfigScreen } from './components/MockTestConfigScreen';
import { MockTestQuestionScreen } from './components/MockTestQuestionScreen';
import { MockTestResultsScreen } from './components/MockTestResultsScreen';
import {
  AppView,
  DifficultyLevel,
  MockTestConfig,
  MockTestResult,
  Question,
  TopicId,
} from './types/math';
import { TOPICS } from './data/topics';
import {
  generateMockTestQuestions,
  generatePracticeQuestionForTopic,
} from './math/questionGenerator';

const STORAGE_KEY_ACTIVE_TOPIC = 'math_reviewer_active_topic';
const STORAGE_KEY_ACTIVE_DIFF = 'math_reviewer_active_diff';
const STORAGE_KEY_MOCK_CONFIG = 'math_reviewer_mock_config';
const STORAGE_KEY_MOCK_ACTIVE = 'math_reviewer_mock_active';

export default function App() {
  // Practice mode is the home page
  const [currentView, setCurrentView] = useState<AppView>('practice');

  // Active Practice Topic
  const [activeTopicId, setActiveTopicId] = useState<TopicId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TOPIC);
      if (saved && TOPICS.some((t) => t.id === saved)) {
        return saved as TopicId;
      }
    } catch (e) {
      // ignore
    }
    return 'position-transformations';
  });

  // Active Practice Difficulty
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_DIFF);
      if (saved === 'all' || [1, 2, 3, 4, 5].includes(Number(saved))) {
        return saved === 'all' ? 'all' : (Number(saved) as DifficultyLevel);
      }
    } catch (e) {
      // ignore
    }
    return 'all';
  });

  const [currentPracticeQuestion, setCurrentPracticeQuestion] = useState<Question>(() => {
    return generatePracticeQuestionForTopic(activeTopicId, selectedDifficulty);
  });
  const [practiceCount, setPracticeCount] = useState<number>(1);

  // Mock Test Mode State
  const [mockConfig, setMockConfig] = useState<MockTestConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MOCK_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      questionCount: 10,
      selectedTopics: TOPICS.map((t) => t.id),
    };
  });

  const [mockQuestions, setMockQuestions] = useState<Question[]>([]);
  const [mockUserAnswers, setMockUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | undefined>>({});
  const [mockCurrentIndex, setMockCurrentIndex] = useState<number>(0);
  const [mockResult, setMockResult] = useState<MockTestResult | null>(null);

  // Restore active mock test from storage if present
  useEffect(() => {
    try {
      const activeTest = localStorage.getItem(STORAGE_KEY_MOCK_ACTIVE);
      if (activeTest) {
        const parsed = JSON.parse(activeTest);
        if (parsed.questions && parsed.questions.length > 0 && parsed.userAnswers) {
          setMockQuestions(parsed.questions);
          setMockUserAnswers(parsed.userAnswers);
          setMockCurrentIndex(parsed.currentIndex || 0);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Save active mock test state to survive reload
  useEffect(() => {
    if (currentView === 'mock-active' && mockQuestions.length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEY_MOCK_ACTIVE,
          JSON.stringify({
            questions: mockQuestions,
            userAnswers: mockUserAnswers,
            currentIndex: mockCurrentIndex,
          })
        );
      } catch (e) {
        // ignore
      }
    }
  }, [currentView, mockQuestions, mockUserAnswers, mockCurrentIndex]);

  // Save active practice topic & difficulty
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TOPIC, activeTopicId);
      localStorage.setItem(STORAGE_KEY_ACTIVE_DIFF, String(selectedDifficulty));
    } catch (e) {
      // ignore
    }
  }, [activeTopicId, selectedDifficulty]);

  // Save mock config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MOCK_CONFIG, JSON.stringify(mockConfig));
    } catch (e) {
      // ignore
    }
  }, [mockConfig]);

  // Handlers for Practice Mode:
  const handleSelectTopicAndStart = (topicId: TopicId) => {
    setActiveTopicId(topicId);
    const q = generatePracticeQuestionForTopic(topicId, selectedDifficulty);
    setCurrentPracticeQuestion(q);
    setPracticeCount(1);
    setCurrentView('practice');
  };

  const handleChangeTopicMidway = (newTopicId: TopicId) => {
    setActiveTopicId(newTopicId);
    const q = generatePracticeQuestionForTopic(newTopicId, selectedDifficulty);
    setCurrentPracticeQuestion(q);
    setPracticeCount(1);
  };

  const handleChangeDifficultyMidway = (newDiff: DifficultyLevel | 'all') => {
    setSelectedDifficulty(newDiff);
    const q = generatePracticeQuestionForTopic(activeTopicId, newDiff);
    setCurrentPracticeQuestion(q);
    setPracticeCount(1);
  };

  const handleNextPracticeQuestion = () => {
    const nextQ = generatePracticeQuestionForTopic(activeTopicId, selectedDifficulty);
    setCurrentPracticeQuestion(nextQ);
    setPracticeCount((prev) => prev + 1);
  };

  // Handlers for Mock Test Mode
  const handleStartMockTest = (config: MockTestConfig) => {
    setMockConfig(config);
    const questions = generateMockTestQuestions(config);
    setMockQuestions(questions);
    setMockUserAnswers({});
    setMockCurrentIndex(0);
    setMockResult(null);
    setCurrentView('mock-active');
  };

  const handleSelectMockAnswer = (questionId: string, optionId: 'A' | 'B' | 'C' | 'D') => {
    setMockUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitMockTest = () => {
    let correct = 0;
    let incorrect = 0;

    const byTopic: Record<TopicId, { total: number; correct: number }> = {
      'position-transformations': { total: 0, correct: 0 },
      'law-of-sines': { total: 0, correct: 0 },
      'law-of-cosines': { total: 0, correct: 0 },
      'quadratic-inequalities-1v': { total: 0, correct: 0 },
      'linear-quadratic-inequalities-2v': { total: 0, correct: 0 },
      'absolute-value': { total: 0, correct: 0 },
      'measures-of-position': { total: 0, correct: 0 },
      'iqr-and-outliers': { total: 0, correct: 0 },
    };

    const byDifficulty: Record<DifficultyLevel, { total: number; correct: number }> = {
      1: { total: 0, correct: 0 },
      2: { total: 0, correct: 0 },
      3: { total: 0, correct: 0 },
      4: { total: 0, correct: 0 },
      5: { total: 0, correct: 0 },
    };

    mockQuestions.forEach((q) => {
      const userAnswer = mockUserAnswers[q.id];
      const isRight = userAnswer === q.correctOptionId;

      if (isRight) {
        correct++;
      } else {
        incorrect++;
      }

      if (byTopic[q.topicId]) {
        byTopic[q.topicId].total++;
        if (isRight) byTopic[q.topicId].correct++;
      }

      if (byDifficulty[q.difficulty]) {
        byDifficulty[q.difficulty].total++;
        if (isRight) byDifficulty[q.difficulty].correct++;
      }
    });

    const total = mockQuestions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    const result: MockTestResult = {
      total,
      correct,
      incorrect,
      percentage,
      byTopic,
      byDifficulty,
      questions: mockQuestions,
      userAnswers: mockUserAnswers,
      completedAt: new Date().toISOString(),
    };

    setMockResult(result);
    try {
      localStorage.removeItem(STORAGE_KEY_MOCK_ACTIVE);
    } catch (e) {
      // ignore
    }
    setCurrentView('mock-results');
  };

  const handleRetakeSameTest = () => {
    setMockUserAnswers({});
    setMockCurrentIndex(0);
    setMockResult(null);
    setCurrentView('mock-active');
  };

  const handleCancelTest = () => {
    if (window.confirm('Are you sure you want to exit the current test? Your answers will be lost.')) {
      try {
        localStorage.removeItem(STORAGE_KEY_MOCK_ACTIVE);
      } catch (e) {
        // ignore
      }
      setMockQuestions([]);
      setMockUserAnswers({});
      setCurrentView('practice');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4ef] text-[#1c1b18]">
      {/* Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'practice' && (
          <PracticeQuestionScreen
            question={currentPracticeQuestion}
            questionNumber={practiceCount}
            activeTopicId={activeTopicId}
            selectedDifficulty={selectedDifficulty}
            onNextQuestion={handleNextPracticeQuestion}
            onChangeTopic={handleChangeTopicMidway}
            onChangeDifficulty={handleChangeDifficultyMidway}
            onOpenTopicPicker={() => setCurrentView('practice-picker')}
          />
        )}

        {currentView === 'practice-picker' && (
          <PracticeTopicPicker
            onSelectTopic={handleSelectTopicAndStart}
            onBackToHome={() => setCurrentView('practice')}
          />
        )}

        {currentView === 'mock-config' && (
          <MockTestConfigScreen
            initialConfig={mockConfig}
            onStartMockTest={handleStartMockTest}
            onBackToHome={() => setCurrentView('practice')}
          />
        )}

        {currentView === 'mock-active' && mockQuestions.length > 0 && (
          <MockTestQuestionScreen
            questions={mockQuestions}
            userAnswers={mockUserAnswers}
            currentIndex={mockCurrentIndex}
            onSelectAnswer={handleSelectMockAnswer}
            onNavigateQuestion={(idx) => setMockCurrentIndex(idx)}
            onSubmitTest={handleSubmitMockTest}
            onCancelTest={handleCancelTest}
          />
        )}

        {currentView === 'mock-results' && mockResult && (
          <MockTestResultsScreen
            result={mockResult}
            onRetakeSameTest={handleRetakeSameTest}
            onConfigureNewTest={() => setCurrentView('mock-config')}
            onReturnToHome={() => setCurrentView('practice')}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-[#d8d6cc] bg-[#eeeae0] py-3 text-center text-xs font-mono text-[#666]">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>MATH REVIEWER</span>
          <span>STATIC SPA</span>
        </div>
      </footer>
    </div>
  );
}

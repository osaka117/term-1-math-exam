export type TopicId =
  | 'position-transformations'
  | 'law-of-sines'
  | 'law-of-cosines'
  | 'quadratic-inequalities-1v'
  | 'linear-quadratic-inequalities-2v'
  | 'absolute-value'
  | 'measures-of-position'
  | 'iqr-and-outliers';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface TopicInfo {
  id: TopicId;
  name: string;
  shortName: string;
  description: string;
  subtopics: string[];
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export type DiagramType =
  | 'none'
  | 'coordinate-plane'
  | 'triangle'
  | 'number-line'
  | 'two-var-inequality'
  | 'boxplot';

export interface CoordinateDiagramData {
  preimage?: { x: number; y: number; label?: string };
  image?: { x: number; y: number; label?: string };
  points?: { x: number; y: number; label: string; color?: string }[];
  reflectionLine?: 'x-axis' | 'y-axis' | 'y=x' | 'y=-x' | { m: number; b: number; label: string };
  range?: number; // e.g. -6 to 6
}

export interface TriangleDiagramData {
  vertices: { A: string; B: string; C: string };
  angles?: { A?: string; B?: string; C?: string };
  sides?: { a?: string; b?: string; c?: string };
  triangleType?: 'acute' | 'obtuse' | 'right';
  targetLabel?: string;
}

export interface NumberLineDiagramData {
  intervals: {
    min: number | null; // null for -inf
    max: number | null; // null for +inf
    includeMin: boolean;
    includeMax: boolean;
  }[];
  criticalValues: number[];
  viewMin?: number;
  viewMax?: number;
}

export interface TwoVarInequalityDiagramData {
  type: 'linear' | 'quadratic';
  // For linear: y [op] m*x + b or x [op] c
  linear?: {
    m?: number;
    b?: number;
    verticalX?: number;
    op: '<' | '<=' | '>' | '>=' | '≤' | '≥';
    solid: boolean;
    shadeRegion: 'above' | 'below' | 'left' | 'right';
  };
  // For quadratic: y [op] a*(x-h)^2 + k
  quadratic?: {
    a: number;
    h: number;
    k: number;
    op: '<' | '<=' | '>' | '>=' | '≤' | '≥';
    solid: boolean;
    shadeInside: boolean;
  };
  testPoints?: { x: number; y: number; label: string; isInSolution?: boolean }[];
  range?: number;
}

export interface BoxplotDiagramData {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  lowerFence?: number;
  upperFence?: number;
  outliers?: number[];
  dataMin: number;
  dataMax: number;
}

export type DiagramData =
  | CoordinateDiagramData
  | TriangleDiagramData
  | NumberLineDiagramData
  | TwoVarInequalityDiagramData
  | BoxplotDiagramData;

export interface Question {
  id: string;
  topicId: TopicId;
  topicName: string;
  difficulty: DifficultyLevel;
  prompt: string;
  diagramType: DiagramType;
  diagramData?: DiagramData;
  options: QuestionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  steps: string[];
}

export interface PracticeConfig {
  selectedTopics: TopicId[];
  selectedDifficulties: DifficultyLevel[];
  randomTopic: boolean;
  randomDifficulty: boolean;
}

export interface MockTestConfig {
  questionCount: number;
  selectedTopics: TopicId[];
}

export interface MockTestAnswer {
  questionId: string;
  selectedOptionId?: 'A' | 'B' | 'C' | 'D';
}

export interface MockTestResult {
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  byTopic: Record<TopicId, { total: number; correct: number }>;
  byDifficulty: Record<DifficultyLevel, { total: number; correct: number }>;
  questions: Question[];
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | undefined>;
  completedAt: string;
}

export type AppView =
  | 'practice'
  | 'practice-picker'
  | 'mock-config'
  | 'mock-active'
  | 'mock-results';

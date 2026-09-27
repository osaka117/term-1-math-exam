import { DifficultyLevel, MockTestConfig, PracticeConfig, Question, TopicId } from '../types/math';
import { randChoice, shuffle } from './utils';
import { generateTransformationQuestion } from './generators/transformations';
import { generateLawOfSinesQuestion } from './generators/lawOfSines';
import { generateLawOfCosinesQuestion } from './generators/lawOfCosines';
import { generateQuadraticInequalitiesQuestion } from './generators/quadraticInequalities';
import { generateTwoVarInequalitiesQuestion } from './generators/twoVarInequalities';
import { generateAbsoluteValueQuestion } from './generators/absoluteValue';
import { generateMeasuresOfPositionQuestion } from './generators/measuresOfPosition';
import { generateIqrOutliersQuestion } from './generators/iqrOutliers';

export function generateQuestion(topicId: TopicId, difficulty: DifficultyLevel): Question {
  switch (topicId) {
    case 'position-transformations':
      return generateTransformationQuestion(difficulty);
    case 'law-of-sines':
      return generateLawOfSinesQuestion(difficulty);
    case 'law-of-cosines':
      return generateLawOfCosinesQuestion(difficulty);
    case 'quadratic-inequalities-1v':
      return generateQuadraticInequalitiesQuestion(difficulty);
    case 'linear-quadratic-inequalities-2v':
      return generateTwoVarInequalitiesQuestion(difficulty);
    case 'absolute-value':
      return generateAbsoluteValueQuestion(difficulty);
    case 'measures-of-position':
      return generateMeasuresOfPositionQuestion(difficulty);
    case 'iqr-and-outliers':
      return generateIqrOutliersQuestion(difficulty);
    default:
      return generateTransformationQuestion(difficulty);
  }
}

/**
 * Generates a practice question directly for a specific chosen topic,
 * randomly varying the difficulty level (1-5) and numerical parameters.
 */
export function generatePracticeQuestionForTopic(
  topicId: TopicId,
  preferredDifficulty?: DifficultyLevel | 'all'
): Question {
  const diffs: DifficultyLevel[] = [1, 2, 3, 4, 5];
  const chosenDiff =
    !preferredDifficulty || preferredDifficulty === 'all'
      ? randChoice(diffs)
      : preferredDifficulty;
  return generateQuestion(topicId, chosenDiff);
}

/**
 * Generates the next question for Practice Mode based on configuration and iteration index
 */
export function generateNextPracticeQuestion(
  config: PracticeConfig,
  currentCount: number
): Question {
  const topics = config.selectedTopics.length > 0 ? config.selectedTopics : (['position-transformations'] as TopicId[]);
  const difficulties = config.selectedDifficulties.length > 0 ? config.selectedDifficulties : ([1, 2, 3] as DifficultyLevel[]);

  // Topic selection
  let chosenTopic: TopicId;
  if (config.randomTopic) {
    chosenTopic = randChoice(topics);
  } else {
    chosenTopic = topics[currentCount % topics.length];
  }

  // Difficulty selection
  let chosenDifficulty: DifficultyLevel;
  if (config.randomDifficulty) {
    chosenDifficulty = randChoice(difficulties);
  } else {
    chosenDifficulty = difficulties[currentCount % difficulties.length];
  }

  return generateQuestion(chosenTopic, chosenDifficulty);
}

/**
 * Generates a full Mock Test with balanced topic distribution and independent Level 1-5 difficulty per question.
 */
export function generateMockTestQuestions(config: MockTestConfig): Question[] {
  const count = Math.max(1, Math.min(50, config.questionCount));
  const topics = config.selectedTopics.length > 0 ? config.selectedTopics : (['position-transformations'] as TopicId[]);

  // Distribute topics evenly across the test
  const topicPool: TopicId[] = [];
  while (topicPool.length < count) {
    topicPool.push(...shuffle(topics));
  }
  const assignedTopics = topicPool.slice(0, count);

  const allDifficulties: DifficultyLevel[] = [1, 2, 3, 4, 5];

  return assignedTopics.map((topic) => {
    // Independent random difficulty between 1 and 5
    const diff = randChoice(allDifficulties);
    return generateQuestion(topic, diff);
  });
}

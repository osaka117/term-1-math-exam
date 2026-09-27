import { DifficultyLevel, Question } from '../../types/math';
import { buildMultipleChoiceOptions, randChoice, randInt, round } from '../utils';

export function generateMeasuresOfPositionQuestion(difficulty: DifficultyLevel): Question {
  const id = `pos-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (difficulty === 1) {
    // Level 1: Find the Median of a data set (odd or even n)
    const isOdd = Math.random() > 0.5;
    const n = isOdd ? randChoice([7, 9, 11]) : randChoice([8, 10, 12]);
    const base = randInt(15, 60);

    // generate random sorted numbers
    const data: number[] = [];
    let cur = base;
    for (let i = 0; i < n; i++) {
      cur += randInt(1, 6);
      data.push(cur);
    }

    // shuffle the display order so student must sort
    const displayData = [...data].sort(() => Math.random() - 0.5);

    let median: number;
    let medianSteps: string;
    if (isOdd) {
      const midIdx = Math.floor(n / 2);
      median = data[midIdx];
      medianSteps = `Since n = ${n} is odd, the median is the middle value at position (${n} + 1)/2 = position ${midIdx + 1}.\nSorted data: [${data.join(', ')}]\nMedian = ${median}.`;
    } else {
      const mid1 = data[n / 2 - 1];
      const mid2 = data[n / 2];
      median = round((mid1 + mid2) / 2, 1);
      medianSteps = `Since n = ${n} is even, the median is the mean of the two middle values at positions ${n / 2} and ${n / 2 + 1}: (${mid1} + ${mid2}) / 2 = ${median}.\nSorted data: [${data.join(', ')}].`;
    }

    const prompt = `Find the median of the following data set:\n${displayData.join(', ')}`;
    const correct = `${median}`;
    const distractors = [
      `${data[Math.floor(n / 2) - 1]}`,
      `${data[Math.floor(n / 2) + 1]}`,
      `${round(median + 2.5, 1)}`,
      `${round(median - 3, 1)}`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'measures-of-position',
      topicName: 'Measures of Position',
      difficulty: 1,
      prompt,
      diagramType: 'none',
      options,
      correctOptionId,
      explanation: `Step-by-step median calculation:
1. First, arrange the ${n} data values in ascending order:
   ${data.join(', ')}

2. ${medianSteps}`,
      steps: [
        `Order data in ascending order: ${data.join(', ')}`,
        `Determine number of elements: n = ${n}`,
        `Find middle position(s)`,
        `Median = ${median}`,
      ],
    };
  }

  if (difficulty === 2) {
    // Level 2: Finding Q1 or Q3 from an ordered data set
    // Using standard Tukey / median of lower and upper halves method
    const findQ1 = Math.random() > 0.5;
    const n = randChoice([8, 10, 12]);
    const base = randInt(20, 50);
    const data: number[] = [];
    let cur = base;
    for (let i = 0; i < n; i++) {
      cur += randInt(2, 5);
      data.push(cur);
    }

    const half = n / 2;
    const lowerHalf = data.slice(0, half);
    const upperHalf = data.slice(half);

    // Q1 is median of lowerHalf, Q3 is median of upperHalf
    const calcMedian = (arr: number[]) => {
      const len = arr.length;
      if (len % 2 !== 0) return arr[Math.floor(len / 2)];
      return round((arr[len / 2 - 1] + arr[len / 2]) / 2, 1);
    };

    const q1 = calcMedian(lowerHalf);
    const q3 = calcMedian(upperHalf);

    const targetVal = findQ1 ? q1 : q3;
    const targetName = findQ1 ? 'first quartile (Q₁)' : 'third quartile (Q₃)';
    const prompt = `Given the ordered data set of size n = ${n}:\n${data.join(', ')}\nFind the ${targetName}.`;

    const correct = `${targetVal}`;
    const distractors = [
      `${findQ1 ? q3 : q1}`,
      `${calcMedian(data)}`, // median instead
      `${round(targetVal + 3, 1)}`,
      `${round(targetVal - 2.5, 1)}`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'measures-of-position',
      topicName: 'Measures of Position',
      difficulty: 2,
      prompt,
      diagramType: 'none',
      options,
      correctOptionId,
      explanation: `To find the quartiles:
1. Divide the sorted data into two equal halves of size ${half}:
   Lower half: [${lowerHalf.join(', ')}]
   Upper half: [${upperHalf.join(', ')}]

2. The ${targetName} is the median of the ${findQ1 ? 'lower' : 'upper'} half:
   ${targetName} = ${targetVal}.`,
      steps: [
        `Divide data into lower and upper halves of ${half} elements each`,
        `Lower half: [${lowerHalf.join(', ')}]`,
        `Upper half: [${upperHalf.join(', ')}]`,
        `${targetName} = ${targetVal}`,
      ],
    };
  }

  if (difficulty === 3) {
    // Level 3: Finding Deciles (Dk) and Percentiles (Pk)
    const k = randChoice([20, 30, 40, 60, 70, 80]); // percentile
    const isDecile = k % 10 === 0 && Math.random() > 0.5;
    const termName = isDecile ? `${k / 10}th decile (D_${k / 10})` : `${k}th percentile (P_${k})`;

    const n = randChoice([10, 15, 20]);
    const base = randInt(30, 70);
    const data: number[] = [];
    let cur = base;
    for (let i = 0; i < n; i++) {
      cur += randInt(2, 6);
      data.push(cur);
    }

    // Standard position formula: L = (k / 100) * n
    const L = (k / 100) * n;
    let targetVal: number;
    let positionExp: string;

    if (Number.isInteger(L)) {
      // Mean of values at position L and L + 1
      const val1 = data[L - 1];
      const val2 = data[L];
      targetVal = round((val1 + val2) / 2, 1);
      positionExp = `Position index L = (${k}/100) · ${n} = ${L}. Since L is an integer, the measure is the average of the values at position ${L} (${val1}) and position ${L + 1} (${val2}): (${val1} + ${val2}) / 2 = ${targetVal}.`;
    } else {
      const idx = Math.ceil(L);
      targetVal = data[idx - 1];
      positionExp = `Position index L = (${k}/100) · ${n} = ${L}. Since L is not an integer, round up to ${idx}. The value at position ${idx} is ${targetVal}.`;
    }

    const prompt = `Consider the ordered data set with n = ${n} values:\n${data.join(', ')}\nFind the value of the ${termName}.`;
    const correct = `${targetVal}`;
    const distractors = [
      `${data[Math.floor(L) - 1] ?? targetVal + 2}`,
      `${round(targetVal + 3.5, 1)}`,
      `${round(targetVal - 4, 1)}`,
      `${k}`, // common distractor: confusing percentile with data value
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'measures-of-position',
      topicName: 'Measures of Position',
      difficulty: 3,
      prompt,
      diagramType: 'none',
      options,
      correctOptionId,
      explanation: `Step-by-step percentile location:
1. Formula for index location: L = (P / 100) · n
   Here P = ${k} and n = ${n}.
   L = (${k} / 100) · ${n} = ${L}.

2. ${positionExp}`,
      steps: [
        `Index location: L = (${k}/100) · ${n} = ${L}`,
        `Locate corresponding element(s) in sorted array`,
        `${termName} = ${targetVal}`,
      ],
    };
  }

  if (difficulty === 4) {
    // Level 4: Finding Percentile Rank of a specific score
    // Percentile rank = (number of values strictly below x / total n) * 100%
    const n = randChoice([12, 16, 20, 25]);
    const base = randInt(40, 75);
    const data: number[] = [];
    let cur = base;
    for (let i = 0; i < n; i++) {
      cur += randInt(1, 4);
      data.push(cur);
    }

    // Pick a test value in the data (e.g. at index around 0.35 to 0.75)
    const targetIdx = randInt(Math.floor(n * 0.3), Math.floor(n * 0.8));
    const targetScore = data[targetIdx];
    const belowCount = data.filter(v => v < targetScore).length;
    const percentileRank = round((belowCount / n) * 100, 1);

    const prompt = `A math test was administered to a class of ${n} students, resulting in the following ordered scores:\n${data.join(', ')}\nCalculate the percentile rank of a student who scored ${targetScore}. (Formula: Percentile Rank = [Number of values below score / Total number of values] × 100%)`;
    const correct = `${percentileRank}% (or ${Math.round(percentileRank)}th percentile)`;
    const distractors = [
      `${round(((belowCount + 1) / n) * 100, 1)}%`, // included score itself
      `${round(((n - belowCount) / n) * 100, 1)}%`, // complementary percentage
      `${round(percentileRank + 12.5, 1)}%`,
      `${targetScore}%`, // confused score with percentile
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'measures-of-position',
      topicName: 'Measures of Position',
      difficulty: 4,
      prompt,
      diagramType: 'none',
      options,
      correctOptionId,
      explanation: `To calculate the percentile rank of the score ${targetScore}:
1. Count how many values in the data set are strictly below ${targetScore}:
   Values below ${targetScore}: ${belowCount} values.

2. Apply the percentile rank formula:
   Percentile Rank = (Count below / n) · 100%
   Percentile Rank = (${belowCount} / ${n}) · 100% = ${percentileRank}%.

This indicates that approximately ${percentileRank}% of the class scored lower than ${targetScore}.`,
      steps: [
        `Count scores strictly below ${targetScore}: ${belowCount}`,
        `Total number of scores: n = ${n}`,
        `Formula: (${belowCount} / ${n}) × 100% = ${percentileRank}%`,
        `Percentile Rank: ${percentileRank}%`,
      ],
    };
  }

  // Level 5: Synthesis / Contextual Interpretation & Comparison
  const pRank = randChoice([68, 75, 82, 88, 92]);
  const score = randInt(82, 94);
  const prompt = `A student scored ${score} on a standardized mathematics evaluation, placing them at the ${pRank}th percentile. Which of the following statements provides the most mathematically accurate interpretation of this measure of position?`;

  const correct = `The student scored higher than approximately ${pRank}% of all test takers.`;
  const distractors = [
    `The student correctly answered ${pRank}% of the questions on the examination.`,
    `The student failed to answer ${100 - pRank}% of the questions correctly.`,
    `The student scored in the top ${pRank}% of all students who took the test.`,
  ];

  const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
  return {
    id,
    topicId: 'measures-of-position',
    topicName: 'Measures of Position',
    difficulty: 5,
    prompt,
    diagramType: 'none',
    options,
    correctOptionId,
    explanation: `Understanding Percentile Rank vs. Percentage Score:
- A percentage score (e.g. ${score}%) measures the proportion of test items answered correctly.
- A percentile rank (e.g. ${pRank}th percentile) is a measure of relative position: it indicates the percentage of individuals in the comparison group whose scores fall below that student's score.
- Therefore, being at the ${pRank}th percentile means the student outperformed approximately ${pRank}% of all test participants (and is in the top ${100 - pRank}%).`,
    steps: [
      `Distinguish percentage score vs percentile rank`,
      `Percentile rank measures relative standing in a population`,
      `${pRank}th percentile means exceeding ${pRank}% of test takers`,
      `Correct interpretation: ${correct}`,
    ],
  };
}

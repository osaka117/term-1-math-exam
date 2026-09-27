import { DifficultyLevel, Question } from '../../types/math';
import { buildMultipleChoiceOptions, randChoice, randInt, round } from '../utils';

export function generateIqrOutliersQuestion(difficulty: DifficultyLevel): Question {
  const id = `iqr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (difficulty === 1) {
    // Level 1: Direct IQR formula IQR = Q3 - Q1
    const q1 = randInt(20, 50);
    const iqr = randInt(12, 35);
    const q3 = q1 + iqr;
    const median = round(q1 + iqr * 0.45, 1);

    const prompt = `A data set has a first quartile Q₁ = ${q1}, a median Q₂ = ${median}, and a third quartile Q₃ = ${q3}. What is the interquartile range (IQR)?`;
    const correct = `${iqr}`;
    const distractors = [
      `${round(q3 - median, 1)}`, // upper half range
      `${round(median - q1, 1)}`, // lower half range
      `${q1 + q3}`,               // added instead of subtracted
      `${round((q1 + q3) / 2, 1)}`, // midrange
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'iqr-and-outliers',
      topicName: 'Interquartile Range and Outliers',
      difficulty: 1,
      prompt,
      diagramType: 'boxplot',
      diagramData: {
        min: q1 - randInt(6, 12),
        q1,
        median,
        q3,
        max: q3 + randInt(8, 15),
        dataMin: q1 - 15,
        dataMax: q3 + 20,
      },
      options,
      correctOptionId,
      explanation: `The Interquartile Range (IQR) measures the spread of the middle 50% of the data:
Formula: IQR = Q₃ - Q₁

Substitute the given quartiles:
IQR = ${q3} - ${q1} = ${iqr}.`,
      steps: [
        `Formula: IQR = Q₃ - Q₁`,
        `Substitute Q₃ = ${q3} and Q₁ = ${q1}`,
        `IQR = ${q3} - ${q1} = ${iqr}`,
      ],
    };
  }

  if (difficulty === 2) {
    // Level 2: Compute IQR from raw data
    const n = 12;
    const base = randInt(15, 40);
    const data: number[] = [];
    let cur = base;
    for (let i = 0; i < n; i++) {
      cur += randInt(2, 6);
      data.push(cur);
    }

    // Lower half: data[0..5], median is (data[2] + data[3])/2
    const q1 = round((data[2] + data[3]) / 2, 1);
    // Upper half: data[6..11], median is (data[8] + data[9])/2
    const q3 = round((data[8] + data[9]) / 2, 1);
    const iqr = round(q3 - q1, 1);
    const med = round((data[5] + data[6]) / 2, 1);

    const prompt = `Calculate the interquartile range (IQR) for the following ordered set of data:\n${data.join(', ')}`;
    const correct = `${iqr}`;
    const distractors = [
      `${data[n - 1] - data[0]}`, // full range
      `${round(q3 - med, 1)}`,
      `${round(iqr + 3.5, 1)}`,
      `${round(Math.max(2, iqr - 4), 1)}`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'iqr-and-outliers',
      topicName: 'Interquartile Range and Outliers',
      difficulty: 2,
      prompt,
      diagramType: 'boxplot',
      diagramData: {
        min: data[0],
        q1,
        median: med,
        q3,
        max: data[n - 1],
        dataMin: data[0] - 5,
        dataMax: data[n - 1] + 5,
      },
      options,
      correctOptionId,
      explanation: `Step-by-step IQR calculation:
1. Divide the 12 sorted data points into equal halves of 6 values:
   Lower half: [${data.slice(0, 6).join(', ')}]
   Upper half: [${data.slice(6).join(', ')}]

2. Find Q₁ (median of lower half):
   Middle two values are ${data[2]} and ${data[3]}.
   Q₁ = (${data[2]} + ${data[3]}) / 2 = ${q1}

3. Find Q₃ (median of upper half):
   Middle two values are ${data[8]} and ${data[9]}.
   Q₃ = (${data[8]} + ${data[9]}) / 2 = ${q3}

4. Compute IQR:
   IQR = Q₃ - Q₁ = ${q3} - ${q1} = ${iqr}.`,
      steps: [
        `Lower half median: Q₁ = ${q1}`,
        `Upper half median: Q₃ = ${q3}`,
        `Formula: IQR = Q₃ - Q₁`,
        `IQR = ${q3} - ${q1} = ${iqr}`,
      ],
    };
  }

  if (difficulty === 3) {
    // Level 3: Finding Lower and Upper Fences
    const q1 = randInt(35, 60);
    const iqr = randInt(14, 28);
    const q3 = q1 + iqr;
    const lowerFence = round(q1 - 1.5 * iqr, 1);
    const upperFence = round(q3 + 1.5 * iqr, 1);

    const askLower = Math.random() > 0.5;
    const targetFenceName = askLower ? 'Lower Fence' : 'Upper Fence';
    const targetFenceVal = askLower ? lowerFence : upperFence;

    const prompt = `A distribution has Q₁ = ${q1} and Q₃ = ${q3} (IQR = ${iqr}). Using the standard 1.5 × IQR rule, what is the ${targetFenceName} for identifying outliers?`;
    const correct = `${targetFenceVal}`;
    const distractors = [
      `${askLower ? upperFence : lowerFence}`, // other fence
      `${askLower ? round(q1 - 1.0 * iqr, 1) : round(q3 + 1.0 * iqr, 1)}`, // 1.0 IQR instead of 1.5
      `${askLower ? round(q1 + 1.5 * iqr, 1) : round(q3 - 1.5 * iqr, 1)}`, // wrong sign
      `${round(targetFenceVal + 5, 1)}`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'iqr-and-outliers',
      topicName: 'Interquartile Range and Outliers',
      difficulty: 3,
      prompt,
      diagramType: 'boxplot',
      diagramData: {
        min: Math.max(0, lowerFence - 10),
        q1,
        median: round((q1 + q3) / 2, 1),
        q3,
        max: upperFence + 10,
        lowerFence,
        upperFence,
        dataMin: Math.max(0, lowerFence - 15),
        dataMax: upperFence + 20,
      },
      options,
      correctOptionId,
      explanation: `Formulas for outlier fences in the 1.5 × IQR rule:
- Lower Fence = Q₁ - 1.5 · IQR
- Upper Fence = Q₃ + 1.5 · IQR

Calculations:
1.5 · IQR = 1.5 · ${iqr} = ${round(1.5 * iqr, 1)}
- Lower Fence = ${q1} - ${round(1.5 * iqr, 1)} = ${lowerFence}
- Upper Fence = ${q3} + ${round(1.5 * iqr, 1)} = ${upperFence}

Therefore, the ${targetFenceName} is ${targetFenceVal}.`,
      steps: [
        `Compute fence step: 1.5 × IQR = 1.5 × ${iqr} = ${round(1.5 * iqr, 1)}`,
        `Formula: ${askLower ? 'Lower Fence = Q₁ - 1.5(IQR)' : 'Upper Fence = Q₃ + 1.5(IQR)'}`,
        `Evaluate: ${askLower ? `${q1} - ${round(1.5 * iqr, 1)} = ${lowerFence}` : `${q3} + ${round(1.5 * iqr, 1)} = ${upperFence}`}`,
        `Result: ${targetFenceVal}`,
      ],
    };
  }

  if (difficulty === 4) {
    // Level 4: Identify outlier(s) in a full data set
    const q1 = randInt(40, 60);
    const iqr = randInt(16, 26);
    const q3 = q1 + iqr;
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    // Normal values inside [q1 - 0.8*iqr, q3 + 0.8*iqr]
    const normalVals = [
      Math.round(q1 - 0.7 * iqr),
      q1 - 2,
      q1 + 3,
      Math.round((q1 + q3) / 2),
      q3 - 4,
      q3 + 2,
      Math.round(q3 + 0.6 * iqr),
    ];

    // Outlier: create an obvious high or low outlier
    const isHighOutlier = Math.random() > 0.5;
    const outlier = isHighOutlier
      ? Math.round(upperFence + randInt(8, 22))
      : Math.round(lowerFence - randInt(8, 20));

    const allData = [...normalVals, outlier].sort((a, b) => a - b);

    const prompt = `For a sample data set, Q₁ = ${q1} and Q₃ = ${q3}. Which of the following values from the data set is confirmed as an outlier by the 1.5 × IQR rule?\nData values: ${allData.join(', ')}`;

    const correct = `${outlier} (because ${isHighOutlier ? `${outlier} > Upper Fence ${upperFence}` : `${outlier} < Lower Fence ${lowerFence}`})`;
    const distractors = [
      `${isHighOutlier ? allData[0] : allData[allData.length - 1]} (boundary value)`,
      `None of the values are outliers`,
      `${normalVals[1]}`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'iqr-and-outliers',
      topicName: 'Interquartile Range and Outliers',
      difficulty: 4,
      prompt,
      diagramType: 'boxplot',
      diagramData: {
        min: allData[0] === outlier ? allData[1] : allData[0],
        q1,
        median: round((q1 + q3) / 2, 1),
        q3,
        max: allData[allData.length - 1] === outlier ? allData[allData.length - 2] : allData[allData.length - 1],
        lowerFence,
        upperFence,
        outliers: [outlier],
        dataMin: Math.min(...allData) - 5,
        dataMax: Math.max(...allData) + 5,
      },
      options,
      correctOptionId,
      explanation: `Step-by-step outlier verification:
1. Given quartiles: Q₁ = ${q1}, Q₃ = ${q3}
   IQR = Q₃ - Q₁ = ${q3} - ${q1} = ${iqr}

2. Calculate outlier fences:
   1.5 · IQR = 1.5 · ${iqr} = ${1.5 * iqr}
   Lower Fence = Q₁ - 1.5(IQR) = ${q1} - ${1.5 * iqr} = ${lowerFence}
   Upper Fence = Q₃ + 1.5(IQR) = ${q3} + ${1.5 * iqr} = ${upperFence}

3. Any observation x is an outlier if x < ${lowerFence} or x > ${upperFence}.
   Inspecting the data:
   ${outlier} ${isHighOutlier ? `> ${upperFence}` : `< ${lowerFence}`}.
Therefore, ${outlier} is an outlier.`,
      steps: [
        `Compute IQR = ${q3} - ${q1} = ${iqr}`,
        `Lower Fence = ${lowerFence}, Upper Fence = ${upperFence}`,
        `Test: ${outlier} falls outside [${lowerFence}, ${upperFence}]`,
        `Outlier identified: ${outlier}`,
      ],
    };
  }

  // Level 5: Resistant vs Non-Resistant Summary Statistics
  const statScenarios = [
    {
      stat: 'Mean and Range',
      desc: 'strongly affected (non-resistant) by extreme outliers, whereas Median and IQR remain resistant',
    },
    {
      stat: 'Median and IQR',
      desc: 'resistant (robust) to extreme outliers, unlike the mean and standard deviation',
    },
  ];
  const chosen = randChoice(statScenarios);

  const prompt = `When an extreme high outlier is added to an otherwise symmetric data set, which of the following best describes the effect on the measures of center and spread?`;
  const correct = `The mean and standard deviation increase significantly, while the median and IQR remain virtually unchanged (resistant).`;
  const distractors = [
    `The median and IQR increase significantly, while the mean and range remain unaffected.`,
    `All measures of center and spread (mean, median, IQR, and standard deviation) increase proportionally.`,
    `The mean increases, but the range and standard deviation decrease.`,
  ];

  const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
  return {
    id,
    topicId: 'iqr-and-outliers',
    topicName: 'Interquartile Range and Outliers',
    difficulty: 5,
    prompt,
    diagramType: 'none',
    options,
    correctOptionId,
    explanation: `Mathematical properties of resistant vs. non-resistant statistics:
- Non-resistant measures: The Mean, Standard Deviation, and Range incorporate every value directly into their calculation; therefore, an extreme outlier pulls the mean toward itself and inflates the standard deviation and range.
- Resistant (robust) measures: The Median and Interquartile Range (IQR) are based on rank order and position. Extreme values in the tails do not shift the middle 50% or the central index, making them resistant to outliers.`,
    steps: [
      `Non-resistant measures: Mean, Range, Standard Deviation (sensitive to outliers)`,
      `Resistant measures: Median, IQR (unaffected by extreme values in the tails)`,
      `Adding an extreme high outlier increases mean and spread, leaving median and IQR stable`,
      `Conclusion: ${correct}`,
    ],
  };
}

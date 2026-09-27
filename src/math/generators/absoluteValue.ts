import { DifficultyLevel, Question } from '../../types/math';
import { buildMultipleChoiceOptions, randChoice, randInt } from '../utils';

export function generateAbsoluteValueQuestion(difficulty: DifficultyLevel): Question {
  const id = `abs-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (difficulty === 1) {
    // Level 1: Basic equation |x - a| = b
    const a = randInt(-6, 6);
    const b = randInt(2, 9);
    const aStr = a >= 0 ? `- ${a}` : `+ ${Math.abs(a)}`;
    const eqStr = `|x ${aStr}| = ${b}`;

    // x - a = b => x = a + b
    // x - a = -b => x = a - b
    const sol1 = a - b;
    const sol2 = a + b;

    const correct = `x = ${sol1}, x = ${sol2}`;
    const distractors = [
      `x = ${sol2}`, // only positive branch
      `x = ${sol1}`, // only negative branch
      `x = ${-sol1}, x = ${-sol2}`, // inverted signs
      `x = ${a}, x = ${b}`,
    ];

    const prompt = `Solve the absolute value equation:\n${eqStr}`;
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);

    return {
      id,
      topicId: 'absolute-value',
      topicName: 'Absolute Value Equations and Inequalities in One Variable',
      difficulty: 1,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: [
          { min: sol1, max: sol1, includeMin: true, includeMax: true },
          { min: sol2, max: sol2, includeMin: true, includeMax: true },
        ],
        criticalValues: [sol1, sol2],
        viewMin: sol1 - 2,
        viewMax: sol2 + 2,
      },
      options,
      correctOptionId,
      explanation: `By definition of absolute value, |u| = b (where b ≥ 0) implies u = b OR u = -b:
1. Case 1 (positive branch):
   x ${aStr} = ${b}  =>  x = ${b} + (${a}) = ${sol2}

2. Case 2 (negative branch):
   x ${aStr} = -${b}  =>  x = -${b} + (${a}) = ${sol1}

The two solutions are x = ${sol1} and x = ${sol2}.`,
      steps: [
        `Split into two cases: x - (${a}) = ${b} or x - (${a}) = -${b}`,
        `Case 1: x = ${sol2}`,
        `Case 2: x = ${sol1}`,
        `Solution: x = ${sol1}, x = ${sol2}`,
      ],
    };
  }

  if (difficulty === 2) {
    // Level 2: Non-isolated equation |ax + b| - d = c
    const a = randChoice([2, 3, 4]);
    const b = randInt(-5, 5);
    const d = randInt(2, 6);
    const c = randInt(4, 12);
    const rhs = c + d; // |ax + b| = rhs

    // Ensure integer solutions: make rhs + b and -rhs + b divisible by a
    // Choose b such that (rhs - b) % a == 0 and (-rhs - b) % a == 0 => 2*rhs % a == 0
    // Simpler: pick sol1 and sol2 first!
    const sol1 = randInt(-5, 0);
    const sol2 = sol1 + 2 * randInt(1, 4);
    // midpoint = (sol1 + sol2)/2, halfdist = (sol2 - sol1)/2
    // |x - mid| = halfdist
    // multiply by a: |a*x - a*mid| = a*halfdist
    const actualA = randChoice([2, 3]);
    const mid = (sol1 + sol2) / 2;
    // To keep integer, ensure sol2 - sol1 is even
    const evenDiff = randInt(1, 4) * 2;
    const s1 = randInt(-4, 1);
    const s2 = s1 + evenDiff;
    const center = (s1 + s2) / 2;
    const radius = (s2 - s1) / 2;

    // equation: |actualA * (x - center)| = actualA * radius
    // = |actualA*x - actualA*center| = targetRhs
    const targetRhs = actualA * radius;
    const shift = randInt(3, 8);
    const displayedRhs = targetRhs - shift;
    const constTerm = -(actualA * center);
    const constStr = constTerm >= 0 ? `+ ${constTerm}` : `- ${Math.abs(constTerm)}`;

    const eqStr = `|${actualA}x ${constStr}| - ${shift} = ${displayedRhs}`;
    const correct = `x = ${s1}, x = ${s2}`;
    const distractors = [
      `x = ${s2}`,
      `x = ${s1}`,
      `x = ${s1 - 1}, x = ${s2 + 1}`,
      `x = ${-s2}, x = ${-s1}`,
    ];

    const prompt = `Solve the multi-step absolute value equation:\n${eqStr}`;
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'absolute-value',
      topicName: 'Absolute Value Equations and Inequalities in One Variable',
      difficulty: 2,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: [
          { min: s1, max: s1, includeMin: true, includeMax: true },
          { min: s2, max: s2, includeMin: true, includeMax: true },
        ],
        criticalValues: [s1, s2],
        viewMin: s1 - 2,
        viewMax: s2 + 2,
      },
      options,
      correctOptionId,
      explanation: `1. First isolate the absolute value expression by adding ${shift} to both sides:
   |${actualA}x ${constStr}| = ${displayedRhs} + ${shift} = ${targetRhs}

2. Set up the two linear equations:
   Case 1: ${actualA}x ${constStr} = ${targetRhs}
   ${actualA}x = ${targetRhs - constTerm}  =>  x = ${s2}

   Case 2: ${actualA}x ${constStr} = -${targetRhs}
   ${actualA}x = ${-targetRhs - constTerm}  =>  x = ${s1}

Solutions: x = ${s1} and x = ${s2}.`,
      steps: [
        `Isolate absolute value: |${actualA}x ${constStr}| = ${targetRhs}`,
        `Branch 1: ${actualA}x ${constStr} = ${targetRhs} → x = ${s2}`,
        `Branch 2: ${actualA}x ${constStr} = -${targetRhs} → x = ${s1}`,
        `Solution set: x = ${s1}, x = ${s2}`,
      ],
    };
  }

  if (difficulty === 3) {
    // Level 3: Less-than inequality |ax + b| <= c (bounded interval)
    const a = randChoice([1, 2]);
    const minVal = randInt(-5, 0);
    const span = randInt(2, 6) * 2;
    const maxVal = minVal + span;
    const center = (minVal + maxVal) / 2;
    const radius = (maxVal - minVal) / 2;
    const c = a * radius;
    const bTerm = -(a * center);
    const isStrict = Math.random() > 0.5;
    const op = isStrict ? '<' : '≤';

    const bStr = bTerm >= 0 ? `+ ${bTerm}` : `- ${Math.abs(bTerm)}`;
    const expr = a === 1 ? `|x ${bStr}|` : `|${a}x ${bStr}|`;
    const prompt = `Solve the absolute value inequality and express the answer in interval notation:\n${expr} ${op} ${c}`;

    const openL = isStrict ? '(' : '[';
    const openR = isStrict ? ')' : ']';
    const correct = `${openL}${minVal}, ${maxVal}${openR}`;
    const distractors = [
      `(-∞, ${minVal}${openR} ∪ ${openL}${maxVal}, ∞)`, // inverted outside interval
      `${isStrict ? '[' : '('}${minVal}, ${maxVal}${isStrict ? ']' : ')'}`,
      `(-∞, ${maxVal}${openR}`,
      `${openL}${minVal}, ∞)`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'absolute-value',
      topicName: 'Absolute Value Equations and Inequalities in One Variable',
      difficulty: 3,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: [{ min: minVal, max: maxVal, includeMin: !isStrict, includeMax: !isStrict }],
        criticalValues: [minVal, maxVal],
        viewMin: minVal - 2,
        viewMax: maxVal + 2,
      },
      options,
      correctOptionId,
      explanation: `For |u| ${op} c where c > 0, the inequality translates into a bounded compound inequality:
-${c} ${op} ${a === 1 ? 'x' : `${a}x`} ${bStr} ${op} ${c}

1. Subtract ${bTerm} from all parts:
   -${c} - (${bTerm}) ${op} ${a === 1 ? 'x' : `${a}x`} ${op} ${c} - (${bTerm})
   ${-c - bTerm} ${op} ${a === 1 ? 'x' : `${a}x`} ${op} ${c - bTerm}

${a > 1 ? `2. Divide all parts by ${a}:\n   ${minVal} ${op} x ${op} ${maxVal}\n` : ''}
In interval notation: ${correct}.`,
      steps: [
        `Write as three-part inequality: -${c} ${op} ${a === 1 ? 'x' : `${a}x`} ${bStr} ${op} ${c}`,
        `Isolate x: ${minVal} ${op} x ${op} ${maxVal}`,
        `Express in interval notation: ${correct}`,
      ],
    };
  }

  if (difficulty === 4) {
    // Level 4: Greater-than inequality |ax + b| >= c (disjoint rays / union)
    const a = randChoice([1, 2]);
    const minVal = randInt(-5, 0);
    const span = randInt(2, 5) * 2;
    const maxVal = minVal + span;
    const center = (minVal + maxVal) / 2;
    const radius = (maxVal - minVal) / 2;
    const c = a * radius;
    const bTerm = -(a * center);
    const isStrict = Math.random() > 0.5;
    const op = isStrict ? '>' : '≥';

    const bStr = bTerm >= 0 ? `+ ${bTerm}` : `- ${Math.abs(bTerm)}`;
    const expr = a === 1 ? `|x ${bStr}|` : `|${a}x ${bStr}|`;
    const prompt = `Solve the absolute value inequality:\n${expr} ${op} ${c}`;

    const openL = isStrict ? '(' : '[';
    const openR = isStrict ? ')' : ']';
    const correct = `(-∞, ${minVal}${openR} ∪ ${openL}${maxVal}, ∞)`;
    const distractors = [
      `${openL}${minVal}, ${maxVal}${openR}`, // inside interval mistake
      `(-∞, ${minVal}${isStrict ? ']' : ')'} ∪ ${isStrict ? '[' : '('}${maxVal}, ∞)`, // bracket mistake
      `(-∞, ${maxVal}${openR}`,
      `(${minVal}, ∞)`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'absolute-value',
      topicName: 'Absolute Value Equations and Inequalities in One Variable',
      difficulty: 4,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: [
          { min: null, max: minVal, includeMin: false, includeMax: !isStrict },
          { min: maxVal, max: null, includeMin: !isStrict, includeMax: false },
        ],
        criticalValues: [minVal, maxVal],
        viewMin: minVal - 3,
        viewMax: maxVal + 3,
      },
      options,
      correctOptionId,
      explanation: `For |u| ${op} c where c > 0, the inequality translates into two separate inequalities connected by 'OR':
Case 1: ${a === 1 ? 'x' : `${a}x`} ${bStr} ${op} ${c}  =>  x ${op} ${maxVal}
Case 2: ${a === 1 ? 'x' : `${a}x`} ${bStr} ${isStrict ? '<' : '≤'} -${c}  =>  x ${isStrict ? '<' : '≤'} ${minVal}

Combining the two disjoint rays gives:
${correct}.`,
      steps: [
        `Split into OR statement: ${a === 1 ? 'x' : `${a}x`} ${bStr} ≤ -${c} OR ≥ ${c}`,
        `Solve branch 1: x ≤ ${minVal}`,
        `Solve branch 2: x ≥ ${maxVal}`,
        `Union in interval notation: ${correct}`,
      ],
    };
  }

  // Level 5: Special cases (Negative RHS or reversing sign when dividing by negative coefficient)
  const specialType = randChoice(['neg-rhs-less', 'neg-rhs-greater', 'neg-multiplier']);
  if (specialType === 'neg-rhs-less') {
    const a = randInt(2, 5);
    const b = randInt(1, 9);
    const negVal = -randInt(2, 7);
    const prompt = `Solve the absolute value inequality:\n|${a}x - ${b}| < ${negVal}`;
    const correct = `∅ (No real solution)`;
    const distractors = [
      `(-∞, ∞) (All real numbers)`,
      `(-${Math.abs(negVal)}, ${Math.abs(negVal)})`,
      `x = ${Math.round(b / a)}`,
    ];
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'absolute-value',
      topicName: 'Absolute Value Equations and Inequalities in One Variable',
      difficulty: 5,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: [],
        criticalValues: [],
        viewMin: -5,
        viewMax: 5,
      },
      options,
      correctOptionId,
      explanation: `Analyze the nature of absolute value:
1. By mathematical definition, the absolute value of any real expression is non-negative: |${a}x - ${b}| ≥ 0 for all real x.
2. The inequality asks when this non-negative quantity is strictly less than ${negVal} (a negative number).
3. A number ≥ 0 can NEVER be less than a negative number.
Therefore, there is no real solution (∅).`,
      steps: [
        `Definition: |u| ≥ 0 for all real u`,
        `The right hand side is ${negVal} (negative)`,
        `A non-negative quantity can never be < ${negVal}`,
        `Solution: ∅ (No solution)`,
      ],
    };
  } else if (specialType === 'neg-rhs-greater') {
    const a = randInt(2, 5);
    const b = randInt(1, 9);
    const negVal = -randInt(2, 7);
    const prompt = `Solve the absolute value inequality:\n|${a}x + ${b}| > ${negVal}`;
    const correct = `(-∞, ∞) (All real numbers)`;
    const distractors = [
      `∅ (No real solution)`,
      `(-${Math.abs(negVal)}, ${Math.abs(negVal)})`,
      `[-${b}/${a}, ∞)`,
      `(-∞, -${b}/${a}] ∪ [${b}/${a}, ∞)`,
    ];
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'absolute-value',
      topicName: 'Absolute Value Equations and Inequalities in One Variable',
      difficulty: 5,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: [{ min: null, max: null, includeMin: false, includeMax: false }],
        criticalValues: [],
        viewMin: -5,
        viewMax: 5,
      },
      options,
      correctOptionId,
      explanation: `1. The absolute value of any real quantity is always greater than or equal to 0: |${a}x + ${b}| ≥ 0.
2. Since ${negVal} is strictly negative, any number ≥ 0 is ALWAYS strictly greater than ${negVal}.
3. Consequently, every real value of x satisfies this inequality.
Solution set: (-∞, ∞).`,
      steps: [
        `Absolute value is always non-negative: |u| ≥ 0`,
        `Since 0 > ${negVal}, |${a}x + ${b}| > ${negVal} is true for ALL real x`,
        `Solution set: (-∞, ∞)`,
      ],
    };
  } else {
    // Multi-step with negative multiplier: e.g. -2|x - 3| + 4 >= -6
    // -2|x - 3| >= -10 => |x - 3| <= 5 => [-2, 8]
    const center = randInt(-2, 4);
    const radius = randInt(3, 6);
    const mult = -2;
    const addConst = randInt(2, 8);
    const rhsOriginal = mult * radius + addConst; // = -2*radius + addConst
    const minVal = center - radius;
    const maxVal = center + radius;

    const centerStr = center >= 0 ? `- ${center}` : `+ ${Math.abs(center)}`;
    const prompt = `Solve the multi-step inequality:\n-2|x ${centerStr}| + ${addConst} ≥ ${rhsOriginal}`;
    const correct = `[${minVal}, ${maxVal}]`;
    const distractors = [
      `(-∞, ${minVal}] ∪ [${maxVal}, ∞)`, // forgot to flip inequality symbol
      `[${-maxVal}, ${-minVal}]`,
      `(-∞, ${rhsOriginal}]`,
      `∅ (No real solution)`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'absolute-value',
      topicName: 'Absolute Value Equations and Inequalities in One Variable',
      difficulty: 5,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: [{ min: minVal, max: maxVal, includeMin: true, includeMax: true }],
        criticalValues: [minVal, maxVal],
        viewMin: minVal - 2,
        viewMax: maxVal + 2,
      },
      options,
      correctOptionId,
      explanation: `Step-by-step algebraic isolation:
1. Subtract ${addConst} from both sides:
   -2|x ${centerStr}| ≥ ${rhsOriginal} - ${addConst} = ${rhsOriginal - addConst}

2. Divide both sides by -2:
   CRITICAL: Dividing by a negative number REVERSES the inequality symbol from '≥' to '≤'!
   |x ${centerStr}| ≤ ${(rhsOriginal - addConst) / -2} (which equals ${radius})

3. Solve the bounded inequality:
   -${radius} ≤ x ${centerStr} ≤ ${radius}
   ${minVal} ≤ x ≤ ${maxVal}

In interval notation: [${minVal}, ${maxVal}].`,
      steps: [
        `Subtract constant: -2|x ${centerStr}| ≥ ${rhsOriginal - addConst}`,
        `Divide by -2 and REVERSE sign: |x ${centerStr}| ≤ ${radius}`,
        `Solve: -${radius} ≤ x - (${center}) ≤ ${radius}`,
        `Solution: [${minVal}, ${maxVal}]`,
      ],
    };
  }
}

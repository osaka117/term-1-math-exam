import { DifficultyLevel, Question } from '../../types/math';
import { buildMultipleChoiceOptions, randChoice, randInt } from '../utils';

export function generateQuadraticInequalitiesQuestion(difficulty: DifficultyLevel): Question {
  const id = `quad-ineq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (difficulty === 1) {
    // Level 1: Already factored form: (x - r1)(x - r2) < 0 or > 0
    let r1 = randInt(-5, 3);
    let r2 = randInt(r1 + 2, r1 + 7);
    const isStrict = Math.random() > 0.5;
    const isLessThan = Math.random() > 0.5;

    // operator
    const op = isLessThan ? (isStrict ? '<' : '≤') : (isStrict ? '>' : '≥');
    const r1Str = r1 >= 0 ? `- ${r1}` : `+ ${Math.abs(r1)}`;
    const r2Str = r2 >= 0 ? `- ${r2}` : `+ ${Math.abs(r2)}`;
    const inequalityStr = `(x ${r1Str})(x ${r2Str}) ${op} 0`;

    // Intervals
    const openL = isStrict ? '(' : '[';
    const openR = isStrict ? ')' : ']';

    let correct: string;
    let distractors: string[];

    if (isLessThan) {
      // inside interval
      correct = `${openL}${r1}, ${r2}${openR}`;
      distractors = [
        `(-∞, ${r1}${openR} ∪ ${openL}${r2}, ∞)`, // inverted outside interval
        `${isStrict ? '[' : '('}${r1}, ${r2}${isStrict ? ']' : ')'}`, // inverted bracket inclusivity
        `(-∞, ${openL}${r1}, ${r2}${openR})`,
        `[${r1}, ∞)`,
      ];
    } else {
      // outside interval
      correct = `(-∞, ${r1}${openR} ∪ ${openL}${r2}, ∞)`;
      distractors = [
        `${openL}${r1}, ${r2}${openR}`, // inside interval mistake
        `(-∞, ${r1}${isStrict ? ']' : ')'} ∪ ${isStrict ? '[' : '('}${r2}, ∞)`, // bracket mistake
        `(-∞, ${r2}${openR}`,
        `${openL}${r1}, ∞)`,
      ];
    }

    const prompt = `Solve the quadratic inequality and write your answer in interval notation:\n${inequalityStr}`;
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);

    return {
      id,
      topicId: 'quadratic-inequalities-1v',
      topicName: 'Quadratic Inequalities in One Variable',
      difficulty: 1,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: isLessThan
          ? [{ min: r1, max: r2, includeMin: !isStrict, includeMax: !isStrict }]
          : [
              { min: null, max: r1, includeMin: false, includeMax: !isStrict },
              { min: r2, max: null, includeMin: !isStrict, includeMax: false },
            ],
        criticalValues: [r1, r2],
        viewMin: r1 - 3,
        viewMax: r2 + 3,
      },
      options,
      correctOptionId,
      explanation: `To solve (x - ${r1})(x - ${r2}) ${op} 0:
1. Find the critical values where the expression equals 0:
   x - ${r1} = 0  =>  x = ${r1}
   x - ${r2} = 0  =>  x = ${r2}
   Critical values are x = ${r1} and x = ${r2}.

2. Test values in the three intervals (-∞, ${r1}), (${r1}, ${r2}), and (${r2}, ∞):
   - For x < ${r1}: both factors are negative, product is positive (+).
   - For ${r1} < x < ${r2}: first factor is positive, second is negative, product is negative (-).
   - For x > ${r2}: both factors are positive, product is positive (+).

3. Since the inequality asks for ${isLessThan ? 'negative (< 0 / ≤ 0)' : 'positive (> 0 / ≥ 0)'}:
   Solution set is ${correct}. (${isStrict ? 'Strict inequality means endpoints are excluded' : 'Non-strict inequality means endpoints are included'}).`,
      steps: [
        `Critical values: x = ${r1}, x = ${r2}`,
        `Sign analysis on intervals: (+), (-), (+)`,
        `Inequality condition: ${op} 0`,
        `Solution set: ${correct}`,
      ],
    };
  }

  if (difficulty === 2) {
    // Level 2: Standard form monic x^2 + bx + c <= 0 or >= 0 (requires factoring)
    let r1 = randInt(-5, 3);
    let r2 = randInt(r1 + 1, r1 + 6);
    const isStrict = Math.random() > 0.5;
    const isLessThan = Math.random() > 0.5;
    const op = isLessThan ? (isStrict ? '<' : '≤') : (isStrict ? '>' : '≥');

    // x^2 - (r1 + r2)x + r1*r2
    const b = -(r1 + r2);
    const c = r1 * r2;
    const bStr = b === 0 ? '' : (b > 0 ? `+ ${b === 1 ? '' : b}x` : `- ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`);
    const cStr = c === 0 ? '' : (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`);
    const ineqStr = `x² ${bStr} ${cStr} ${op} 0`;

    const openL = isStrict ? '(' : '[';
    const openR = isStrict ? ')' : ']';

    let correct: string;
    let distractors: string[];

    if (isLessThan) {
      correct = `${openL}${r1}, ${r2}${openR}`;
      distractors = [
        `(-∞, ${r1}${openR} ∪ ${openL}${r2}, ∞)`,
        `${openL}${-r2}, ${-r1}${openR}`, // factored signs inverted
        `${isStrict ? '[' : '('}${r1}, ${r2}${isStrict ? ']' : ')'}`,
        `(-∞, ${openL}${r1}, ${r2}${openR})`,
      ];
    } else {
      correct = `(-∞, ${r1}${openR} ∪ ${openL}${r2}, ∞)`;
      distractors = [
        `${openL}${r1}, ${r2}${openR}`,
        `(-∞, ${-r2}${openR} ∪ ${openL}${-r1}, ∞)`, // inverted root signs
        `(-∞, ${r1}${isStrict ? ']' : ')'} ∪ ${isStrict ? '[' : '('}${r2}, ∞)`,
        `[${r2}, ∞)`,
      ];
    }

    const prompt = `Solve the quadratic inequality in one variable:\n${ineqStr}`;
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);

    return {
      id,
      topicId: 'quadratic-inequalities-1v',
      topicName: 'Quadratic Inequalities in One Variable',
      difficulty: 2,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: isLessThan
          ? [{ min: r1, max: r2, includeMin: !isStrict, includeMax: !isStrict }]
          : [
              { min: null, max: r1, includeMin: false, includeMax: !isStrict },
              { min: r2, max: null, includeMin: !isStrict, includeMax: false },
            ],
        criticalValues: [r1, r2],
        viewMin: r1 - 3,
        viewMax: r2 + 3,
      },
      options,
      correctOptionId,
      explanation: `Step-by-step solution:
1. Factor the quadratic expression:
   x² ${bStr} ${cStr} = (x ${r1 >= 0 ? '- ' + r1 : '+ ' + Math.abs(r1)})(x ${r2 >= 0 ? '- ' + r2 : '+ ' + Math.abs(r2)})

2. Find the critical values:
   x = ${r1} and x = ${r2}

3. Since the parabola opens upward (leading coefficient is positive 1):
   - The expression is negative between the roots: (${r1}, ${r2})
   - The expression is positive outside the roots: (-∞, ${r1}) ∪ (${r2}, ∞)

4. Since the inequality is ${op} 0, the solution set is:
   ${correct}.`,
      steps: [
        `Factor: (x - ${r1})(x - ${r2}) ${op} 0`,
        `Critical points: x = ${r1}, x = ${r2}`,
        `Parabola opens upward → negative inside (${r1}, ${r2}), positive outside`,
        `Solution in interval notation: ${correct}`,
      ],
    };
  }

  if (difficulty === 3) {
    // Level 3: Non-monic or negative leading coefficient: e.g. -x^2 + bx + c >= 0 or 2x^2 + bx + c < 0
    const hasNegativeLeading = Math.random() > 0.5;

    if (hasNegativeLeading) {
      const r1 = randInt(-4, 1);
      const r2 = randInt(r1 + 2, r1 + 5);
      const isStrict = Math.random() > 0.5;
      const op = isStrict ? '>' : '≥';
      // -(x - r1)(x - r2) = -x^2 + (r1 + r2)x - r1*r2
      const b = r1 + r2;
      const c = -(r1 * r2);
      const bStr = b === 0 ? '' : (b > 0 ? `+ ${b === 1 ? '' : b}x` : `- ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`);
      const cStr = c === 0 ? '' : (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`);
      const ineqStr = `-x² ${bStr} ${cStr} ${op} 0`;

      const openL = isStrict ? '(' : '[';
      const openR = isStrict ? ')' : ']';
      // - (x - r1)(x - r2) >= 0 <=> (x - r1)(x - r2) <= 0 => [r1, r2]
      const correct = `${openL}${r1}, ${r2}${openR}`;
      const distractors = [
        `(-∞, ${r1}${openR} ∪ ${openL}${r2}, ∞)`, // forgot to flip inequality sign when multiplying by -1
        `${openL}${-r2}, ${-r1}${openR}`,
        `(-∞, ∞)`,
        `∅ (No real solution)`,
      ];

      const prompt = `Solve the quadratic inequality:\n${ineqStr}`;
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'quadratic-inequalities-1v',
        topicName: 'Quadratic Inequalities in One Variable',
        difficulty: 3,
        prompt,
        diagramType: 'number-line',
        diagramData: {
          intervals: [{ min: r1, max: r2, includeMin: !isStrict, includeMax: !isStrict }],
          criticalValues: [r1, r2],
          viewMin: r1 - 3,
          viewMax: r2 + 3,
        },
        options,
        correctOptionId,
        explanation: `Watch out for multiplying or dividing by -1:
1. Multiply the entire inequality by -1 to make the leading coefficient positive.
   REMEMBER: Multiplying or dividing an inequality by a negative number reverses the inequality symbol!
   ${ineqStr}
   becomes:
   x² ${b > 0 ? '- ' + b + 'x' : '+ ' + Math.abs(b) + 'x'} ${c > 0 ? '- ' + c : '+ ' + Math.abs(c)} ${isStrict ? '<' : '≤'} 0

2. Factor:
   (x - ${r1})(x - ${r2}) ${isStrict ? '<' : '≤'} 0

3. Critical values: x = ${r1} and x = ${r2}.
   The expression is less than or equal to 0 between the roots:
   Solution: ${correct}.`,
        steps: [
          `Multiply by -1 and REVERSE the inequality sign: x² ... ${isStrict ? '<' : '≤'} 0`,
          `Factor: (x - ${r1})(x - ${r2}) ${isStrict ? '<' : '≤'} 0`,
          `Critical values: x = ${r1}, x = ${r2}`,
          `Solution interval: ${correct}`,
        ],
      };
    } else {
      // a = 2: (2x - r1)(x - r2)
      const r1 = randChoice([-3, -1, 1, 3, 5]); // fraction root r1 / 2
      const r2 = randChoice([-4, -2, 2, 4]); // integer root
      const root1 = Math.min(r1 / 2, r2);
      const root2 = Math.max(r1 / 2, r2);
      const isStrict = Math.random() > 0.5;
      const op = isStrict ? '<' : '≤';

      // (2x - r1)(x - r2) = 2x^2 - (2*r2 + r1)x + r1*r2
      const b = -(2 * r2 + r1);
      const c = r1 * r2;
      const bStr = b > 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
      const cStr = c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
      const ineqStr = `2x² ${bStr} ${cStr} ${op} 0`;

      const openL = isStrict ? '(' : '[';
      const openR = isStrict ? ')' : ']';
      const root1Str = root1 === r1 / 2 ? `${r1}/2` : `${root1}`;
      const root2Str = root2 === r1 / 2 ? `${r1}/2` : `${root2}`;

      const correct = `${openL}${root1Str}, ${root2Str}${openR}`;
      const distractors = [
        `(-∞, ${root1Str}${openR} ∪ ${openL}${root2Str}, ∞)`,
        `${openL}${root1 === r1 / 2 ? `${r1}` : `${root1}`}, ${root2 === r1 / 2 ? `${r1}` : `${root2}`}${openR}`, // forgot to divide by 2
        `(-∞, ${root1Str}${openR}`,
        `[${root2Str}, ∞)`,
      ];

      const prompt = `Solve the quadratic inequality:\n${ineqStr}`;
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'quadratic-inequalities-1v',
        topicName: 'Quadratic Inequalities in One Variable',
        difficulty: 3,
        prompt,
        diagramType: 'number-line',
        diagramData: {
          intervals: [{ min: root1, max: root2, includeMin: !isStrict, includeMax: !isStrict }],
          criticalValues: [root1, root2],
          viewMin: Math.floor(root1) - 2,
          viewMax: Math.ceil(root2) + 2,
        },
        options,
        correctOptionId,
        explanation: `1. Factor the quadratic:
   2x² ${bStr} ${cStr} = (2x - ${r1})(x - ${r2}) ${op} 0

2. Determine the critical values by setting each factor to zero:
   2x - ${r1} = 0  =>  x = ${r1}/2
   x - ${r2} = 0   =>  x = ${r2}
   Critical values in order: ${root1Str} and ${root2Str}.

3. Since the parabola opens upwards and we require ${op} 0:
   The solution set is the interval between the critical values: ${correct}.`,
        steps: [
          `Factor: (2x - ${r1})(x - ${r2}) ${op} 0`,
          `Critical values: x = ${root1Str} and x = ${root2Str}`,
          `Solution: ${correct}`,
        ],
      };
    }
  }

  if (difficulty === 4) {
    // Level 4: Rearranging terms / non-zero right hand side, e.g. x(x - 5) >= -6 or x^2 - 3x >= 10
    const r1 = randInt(-4, 2);
    const r2 = randInt(r1 + 2, r1 + 5);
    const isStrict = false;
    const isLessThan = Math.random() > 0.5;
    const op = isLessThan ? '≤' : '≥';

    // (x - r1)(x - r2) = x^2 - (r1+r2)x + r1*r2
    // Move constant to the right: x^2 - (r1+r2)x <= -r1*r2 or x(x - (r1+r2)) <= -r1*r2
    const sum = r1 + r2;
    const prod = r1 * r2;
    const rhs = -prod;

    let ineqStr: string;
    if (Math.random() > 0.5) {
      ineqStr = `x(x ${sum >= 0 ? '- ' + sum : '+ ' + Math.abs(sum)}) ${op} ${rhs}`;
    } else {
      ineqStr = `x² ${sum >= 0 ? '- ' + sum + 'x' : '+ ' + Math.abs(sum) + 'x'} ${op} ${rhs}`;
    }

    const correct = isLessThan ? `[${r1}, ${r2}]` : `(-∞, ${r1}] ∪ [${r2}, ∞)`;
    const distractors = [
      isLessThan ? `(-∞, ${r1}] ∪ [${r2}, ∞)` : `[${r1}, ${r2}]`,
      `[${-r2}, ${-r1}]`,
      `(-∞, ${rhs}]`,
      `[0, ${sum}]`, // fallacy of splitting x >= rhs
    ];

    const prompt = `Solve the inequality by first rearranging all terms to one side:\n${ineqStr}`;
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'quadratic-inequalities-1v',
      topicName: 'Quadratic Inequalities in One Variable',
      difficulty: 4,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: isLessThan
          ? [{ min: r1, max: r2, includeMin: true, includeMax: true }]
          : [
              { min: null, max: r1, includeMin: false, includeMax: true },
              { min: r2, max: null, includeMin: true, includeMax: false },
            ],
        criticalValues: [r1, r2],
        viewMin: r1 - 3,
        viewMax: r2 + 3,
      },
      options,
      correctOptionId,
      explanation: `To solve this inequality:
1. Expand and move all terms to the left-hand side so the right side is 0:
   x² - ${sum}x + ${prod} ${op} 0

2. Factor the quadratic:
   (x - ${r1})(x - ${r2}) ${op} 0

3. Critical values are x = ${r1} and x = ${r2}.
4. Since we want ${op} 0:
   The solution set is ${correct}.
   (Caution: You cannot set each factor directly against ${rhs}; an inequality must be compared to 0).`,
      steps: [
        `Move all terms to one side: x² - ${sum}x + ${prod} ${op} 0`,
        `Factor: (x - ${r1})(x - ${r2}) ${op} 0`,
        `Critical values: x = ${r1}, x = ${r2}`,
        `Solution set: ${correct}`,
      ],
    };
  }

  // Level 5: Special cases (no real solution, single point, all reals, or discriminant < 0)
  const specialType = randChoice(['single-point', 'no-solution-square', 'all-reals-positive']);
  const h = randInt(-4, 4);

  if (specialType === 'single-point') {
    // (x - h)^2 <= 0 => only x = h
    const hStr = h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`;
    const expanded = `x² ${-2 * h >= 0 ? '+ ' + (-2 * h) + 'x' : '- ' + Math.abs(-2 * h) + 'x'} ${h * h >= 0 ? '+ ' + (h * h) : '- ' + Math.abs(h * h)}`;
    const prompt = `Solve the quadratic inequality:\n${expanded} ≤ 0`;
    const correct = `{${h}} (Single point solution x = ${h})`;
    const distractors = [
      `∅ (No real solution)`,
      `(-∞, ∞) (All real numbers)`,
      `[-${Math.abs(h)}, ${Math.abs(h)}]`,
      `(-∞, ${h}]`,
    ];
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'quadratic-inequalities-1v',
      topicName: 'Quadratic Inequalities in One Variable',
      difficulty: 5,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: [{ min: h, max: h, includeMin: true, includeMax: true }],
        criticalValues: [h],
        viewMin: h - 4,
        viewMax: h + 4,
      },
      options,
      correctOptionId,
      explanation: `1. Recognize that the left-hand side is a perfect square trinomial:
   ${expanded} = (x ${hStr})²

2. The inequality is:
   (x ${hStr})² ≤ 0

3. Since the square of any real number is always non-negative ((x - ${h})² ≥ 0 for all real x), it can never be strictly less than 0.
4. The only way (x - ${h})² ≤ 0 is if (x - ${h})² = 0, which occurs precisely when x = ${h}.
Therefore, the solution set is the single point {${h}}.`,
      steps: [
        `Factor into perfect square: (x - ${h})² ≤ 0`,
        `A real square is always ≥ 0, so it can only equal 0`,
        `x - ${h} = 0 → x = ${h}`,
        `Solution set: {${h}}`,
      ],
    };
  } else if (specialType === 'no-solution-square') {
    // (x - h)^2 < 0 or x^2 + c < 0
    const c = randInt(2, 6);
    const prompt = `Solve the quadratic inequality:\nx² + ${c} < 0`;
    const correct = `∅ (No real solution)`;
    const distractors = [
      `(-√${c}, √${c})`,
      `(-∞, -√${c}) ∪ (√${c}, ∞)`,
      `(-∞, ∞)`,
      `{0}`,
    ];
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'quadratic-inequalities-1v',
      topicName: 'Quadratic Inequalities in One Variable',
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
      explanation: `Analyze the expression x² + ${c}:
1. For any real number x, x² ≥ 0.
2. Adding ${c} gives x² + ${c} ≥ ${c} > 0 for all real numbers x.
3. Therefore, x² + ${c} is strictly positive everywhere and can never be less than 0.
Conclusion: There are no real solutions (∅).`,
      steps: [
        `For all real x: x² ≥ 0`,
        `Therefore: x² + ${c} ≥ ${c} > 0`,
        `The expression can never be < 0`,
        `Solution set: ∅ (Empty set)`,
      ],
    };
  } else {
    // All real numbers: (x - h)^2 + c > 0
    const c = randInt(2, 6);
    const prompt = `Solve the quadratic inequality in one variable:\nx² + ${c} > 0`;
    const correct = `(-∞, ∞) (All real numbers)`;
    const distractors = [
      `∅ (No real solution)`,
      `(-√${c}, √${c})`,
      `[0, ∞)`,
      `(-∞, -${c}) ∪ (${c}, ∞)`,
    ];
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'quadratic-inequalities-1v',
      topicName: 'Quadratic Inequalities in One Variable',
      difficulty: 5,
      prompt,
      diagramType: 'number-line',
      diagramData: {
        intervals: [{ min: null, max: null, includeMin: false, includeMax: false }],
        criticalValues: [],
        viewMin: -6,
        viewMax: 6,
      },
      options,
      correctOptionId,
      explanation: `Analyze the inequality:
1. For every real number x, x² ≥ 0.
2. Since ${c} > 0, the sum x² + ${c} is at least ${c} > 0 for all x ∈ ℝ.
3. Thus the inequality x² + ${c} > 0 is unconditionally true for every real number.
Solution set: (-∞, ∞).`,
      steps: [
        `Property: x² ≥ 0 for all x ∈ ℝ`,
        `x² + ${c} ≥ ${c} > 0`,
        `True for every real x`,
        `Solution set: (-∞, ∞)`,
      ],
    };
  }
}

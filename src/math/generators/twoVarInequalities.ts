import { DifficultyLevel, Question } from '../../types/math';
import { buildMultipleChoiceOptions, randChoice, randInt, randNonZero } from '../utils';

export function generateTwoVarInequalitiesQuestion(difficulty: DifficultyLevel): Question {
  const id = `ineq2v-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (difficulty === 1) {
    // Level 1: Test points in a linear inequality
    const m = randChoice([-3, -2, -1, 1, 2, 3]);
    const b = randInt(-4, 4);
    const isStrict = Math.random() > 0.5;
    const isGreater = Math.random() > 0.5;
    const op = isGreater ? (isStrict ? '>' : '≥') : (isStrict ? '<' : '≤');

    const ineqStr = `y ${op} ${m === 1 ? '' : m === -1 ? '-' : m}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}`;

    // Pick 1 correct test point and 3 incorrect test points
    // For a test x, compute lineY = m*x + b
    const testX = randInt(-3, 3);
    const lineY = m * testX + b;
    let correctY: number;
    let incorrectY1: number;
    let incorrectY2: number;
    let incorrectY3: number;

    if (isGreater) {
      correctY = lineY + (isStrict ? 2 : 0);
      incorrectY1 = lineY - (isStrict ? 0 : 2);
      incorrectY2 = lineY - 3;
      incorrectY3 = lineY - 4;
    } else {
      correctY = lineY - (isStrict ? 2 : 0);
      incorrectY1 = lineY + (isStrict ? 0 : 2);
      incorrectY2 = lineY + 3;
      incorrectY3 = lineY + 4;
    }

    const correctPt = `(${testX}, ${correctY})`;
    const distractors = [
      `(${testX}, ${incorrectY1})`,
      `(${testX + 1}, ${isGreater ? m * (testX + 1) + b - 2 : m * (testX + 1) + b + 2})`,
      `(${testX - 1}, ${isGreater ? m * (testX - 1) + b - 3 : m * (testX - 1) + b + 3})`,
    ];

    const prompt = `Which of the following ordered pairs (x, y) is a solution to the inequality:\n${ineqStr}?`;
    const { options, correctOptionId } = buildMultipleChoiceOptions(correctPt, distractors);

    return {
      id,
      topicId: 'linear-quadratic-inequalities-2v',
      topicName: 'Linear and Quadratic Inequalities in Two Variables',
      difficulty: 1,
      prompt,
      diagramType: 'two-var-inequality',
      diagramData: {
        type: 'linear',
        linear: {
          m,
          b,
          op,
          solid: !isStrict,
          shadeRegion: isGreater ? 'above' : 'below',
        },
        testPoints: [{ x: testX, y: correctY, label: `(${testX}, ${correctY})`, isInSolution: true }],
        range: 7,
      },
      options,
      correctOptionId,
      explanation: `To check if an ordered pair (x, y) is a solution, substitute the coordinates into ${ineqStr}:
For (${testX}, ${correctY}):
Left side: y = ${correctY}
Right side: ${m}(${testX}) + (${b}) = ${lineY}
Inequality check: ${correctY} ${op} ${lineY} is TRUE.
Therefore, (${testX}, ${correctY}) is in the solution region.`,
      steps: [
        `Substitute x = ${testX} and y = ${correctY}`,
        `Compute right side: ${m}(${testX}) + (${b}) = ${lineY}`,
        `Verify: ${correctY} ${op} ${lineY} is satisfied`,
        `Point (${testX}, ${correctY}) is a solution`,
      ],
    };
  }

  if (difficulty === 2) {
    // Level 2: Boundary line / curve characteristics (dashed vs solid, shaded above vs below)
    const m = randChoice([-3, -2, -1, 1, 2, 3]);
    const b = randInt(-3, 3);
    const isStrict = Math.random() > 0.5;
    const isGreater = Math.random() > 0.5;
    const op = isGreater ? (isStrict ? '>' : '≥') : (isStrict ? '<' : '≤');

    const ineqStr = `y ${op} ${m === 1 ? '' : m === -1 ? '-' : m}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}`;
    const lineType = isStrict ? 'dashed boundary line' : 'solid boundary line';
    const region = isGreater ? 'shaded above the line' : 'shaded below the line';

    const correct = `${lineType} with region ${region}`;
    const distractors = [
      `${isStrict ? 'solid boundary line' : 'dashed boundary line'} with region ${region}`,
      `${lineType} with region ${isGreater ? 'shaded below the line' : 'shaded above the line'}`,
      `${isStrict ? 'solid boundary line' : 'dashed boundary line'} with region ${isGreater ? 'shaded below the line' : 'shaded above the line'}`,
    ];

    const prompt = `Which description accurately depicts the graph of the linear inequality:\n${ineqStr}?`;
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);

    return {
      id,
      topicId: 'linear-quadratic-inequalities-2v',
      topicName: 'Linear and Quadratic Inequalities in Two Variables',
      difficulty: 2,
      prompt,
      diagramType: 'two-var-inequality',
      diagramData: {
        type: 'linear',
        linear: {
          m,
          b,
          op,
          solid: !isStrict,
          shadeRegion: isGreater ? 'above' : 'below',
        },
        range: 7,
      },
      options,
      correctOptionId,
      explanation: `Analyze the inequality ${ineqStr}:
1. Boundary line type:
   - The symbol '${op}' is ${isStrict ? 'strict (> or <), so points on the boundary are NOT included' : 'non-strict (≥ or ≤), so points on the boundary ARE included'}.
   - Therefore, the boundary is drawn as a ${lineType}.

2. Shaded region:
   - Since y is isolated and the inequality is y ${op} ..., y values ${isGreater ? 'greater than' : 'less than'} the line correspond to the region ${region}.`,
      steps: [
        `Check equality symbol: ${op} indicates ${lineType}`,
        `Check direction: y ${op} ... indicates region ${region}`,
        `Graph features: ${correct}`,
      ],
    };
  }

  if (difficulty === 3) {
    // Level 3: Standard form Ax + By >= C with negative B (tests sign flipping)
    const A = randChoice([-3, -2, 2, 3, 4]);
    const B = randChoice([-3, -2, 2, 3]); // include negatives
    const C = randChoice([-6, -4, 4, 6, 8]);
    const isStrict = false;
    const isGreater = Math.random() > 0.5;
    const op = isGreater ? '≥' : '≤';

    // Ax + By op C
    // By op -Ax + C
    // If B < 0, divide by B flips op!
    const effectiveOp: '≤' | '≥' = B < 0 ? (isGreater ? '≤' : '≥') : op;
    const finalShade = effectiveOp === '≥' ? 'above' : 'below';

    const prompt = `Given the linear inequality in standard form:\n${A}x ${B > 0 ? '+ ' + B : '- ' + Math.abs(B)}y ${op} ${C}\nWhat is the inequality in slope-intercept form and which half-plane is shaded?`;

    // slope = -A/B, intercept = C/B
    const slopeNum = -A;
    const slopeDen = B;
    const slopeStr = `${slopeNum}/${slopeDen}`;
    const intStr = `${C}/${B}`;

    const correct = `y ${effectiveOp} (${slopeStr})x + (${intStr}), shaded ${finalShade} the line`;
    const wrongOp = effectiveOp === '≥' ? '≤' : '≥';
    const distractors = [
      `y ${wrongOp} (${slopeStr})x + (${intStr}), shaded ${wrongOp === '≥' ? 'above' : 'below'} the line`, // forgot to flip sign
      `y ${effectiveOp} (${A}/${B})x + (${intStr}), shaded ${finalShade} the line`, // forgot negative sign on A
      `y ${wrongOp} (${A}/${B})x - (${intStr}), shaded ${wrongOp === '≥' ? 'above' : 'below'} the line`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'linear-quadratic-inequalities-2v',
      topicName: 'Linear and Quadratic Inequalities in Two Variables',
      difficulty: 3,
      prompt,
      diagramType: 'two-var-inequality',
      diagramData: {
        type: 'linear',
        linear: {
          m: -A / B,
          b: C / B,
          op: effectiveOp,
          solid: true,
          shadeRegion: finalShade,
        },
        range: 7,
      },
      options,
      correctOptionId,
      explanation: `Step-by-step conversion to slope-intercept form:
1. Isolate the y-term:
   ${B}y ${op} -(${A})x + ${C}

2. Divide both sides by ${B}:
   ${B < 0 ? `WARNING: Since ${B} is negative, dividing by ${B} REVERSES the inequality symbol from '${op}' to '${effectiveOp}'!` : `Since ${B} is positive, the inequality direction is preserved.`}
   y ${effectiveOp} (${slopeStr})x + (${intStr})

3. Since y is ${effectiveOp} ..., the solution region is shaded ${finalShade} the solid boundary line.`,
      steps: [
        `Subtract ${A}x: ${B}y ${op} -${A}x + ${C}`,
        `Divide by ${B}${B < 0 ? ' (REVERSE INEQUALITY SIGN)' : ''}`,
        `Result: y ${effectiveOp} (${slopeStr})x + (${intStr})`,
        `Region: Shaded ${finalShade} the line`,
      ],
    };
  }

  if (difficulty === 4) {
    // Level 4: Quadratic inequality in two variables: y >= a(x-h)^2 + k or y < ax^2 + bx + c
    const a = randChoice([-1, 1]);
    const h = randInt(-3, 3);
    const k = randInt(-3, 3);
    const isStrict = Math.random() > 0.5;
    const isGreater = Math.random() > 0.5;
    const op = isGreater ? (isStrict ? '>' : '≥') : (isStrict ? '<' : '≤');

    const hStr = h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`;
    const kStr = k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`;
    const quadExpr = `${a === -1 ? '-' : ''}(x ${hStr})² ${kStr}`;
    const ineqStr = `y ${op} ${quadExpr}`;

    const vertex = `(${h}, ${k})`;
    const orientation = a === 1 ? 'opens upward' : 'opens downward';
    const boundary = isStrict ? 'dashed parabola' : 'solid parabola';
    const shade = (isGreater && a === 1) || (!isGreater && a === -1)
      ? 'inside (interior of) the parabola'
      : 'outside (exterior of) the parabola';

    const correct = `Vertex at ${vertex}, ${boundary} that ${orientation}, shaded ${shade}`;
    const distractors = [
      `Vertex at (${-h}, ${k}), ${boundary} that ${orientation}, shaded ${shade}`, // inverted h
      `Vertex at ${vertex}, ${isStrict ? 'solid parabola' : 'dashed parabola'} that ${orientation}, shaded ${shade}`,
      `Vertex at ${vertex}, ${boundary} that ${orientation}, shaded ${shade.includes('inside') ? 'outside (exterior of) the parabola' : 'inside (interior of) the parabola'}`,
    ];

    const prompt = `Describe the graph and solution region of the quadratic inequality in two variables:\n${ineqStr}`;
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);

    return {
      id,
      topicId: 'linear-quadratic-inequalities-2v',
      topicName: 'Linear and Quadratic Inequalities in Two Variables',
      difficulty: 4,
      prompt,
      diagramType: 'two-var-inequality',
      diagramData: {
        type: 'quadratic',
        quadratic: {
          a,
          h,
          k,
          op,
          solid: !isStrict,
          shadeInside: shade.includes('inside'),
        },
        range: 7,
      },
      options,
      correctOptionId,
      explanation: `Analyze the quadratic inequality ${ineqStr}:
1. Vertex form: y = a(x - h)² + k
   - The vertex is (h, k) = ${vertex}.
   - The coefficient a = ${a}, so the parabola ${orientation}.

2. Boundary type:
   - The symbol is '${op}', which is ${isStrict ? 'strict, giving a dashed parabola' : 'inclusive, giving a solid parabola'}.

3. Shaded region test:
   - Testing a point clearly inside the parabola (such as x = ${h}, y = ${k + a}):
     y = ${k + a} vs a(0)² + k = ${k}.
     ${k + a} ${op} ${k} evaluates to ${((k + a > k && isGreater) || (k + a < k && !isGreater)) ? 'TRUE' : 'FALSE'}.
   - Thus the shaded region is ${shade}.`,
      steps: [
        `Identify vertex: ${vertex}`,
        `Determine orientation: a = ${a} → ${orientation}`,
        `Check boundary: ${op} → ${boundary}`,
        `Test point verifies region is ${shade}`,
      ],
    };
  }

  // Level 5: System of Inequalities in Two Variables (feasibility / region check)
  // e.g., Line 1: y >= x - 2, Line 2: y < -x + 4
  const prompt = `Consider the system of linear inequalities:\n1) y ≥ x - 2\n2) y < -x + 4\nWhich of the following points lies in the simultaneous solution region of both inequalities?`;

  // Feasible point must satisfy y >= x - 2 AND y < -x + 4
  // Let's test points:
  // e.g. (0, 0): 0 >= -2 (True) and 0 < 4 (True) -> FEASIBLE!
  // e.g. (5, 5): 5 >= 3 (True), 5 < -1 (False)
  // e.g. (0, 5): 5 >= -2 (True), 5 < 4 (False)
  // e.g. (4, -5): -5 >= 2 (False), -5 < 0 (True)
  const candidateSolutions = [
    { pt: '(0, 0)', ok: true },
    { pt: '(1, 1)', ok: true },
    { pt: '(0, 1)', ok: true },
    { pt: '(-1, 0)', ok: true },
  ];
  const chosenSol = randChoice(candidateSolutions);

  const distractors = [
    '(5, 5)',  // violates line 2
    '(0, 6)',  // violates line 2
    '(4, -5)', // violates line 1
  ];

  const { options, correctOptionId } = buildMultipleChoiceOptions(chosenSol.pt, distractors);
  return {
    id,
    topicId: 'linear-quadratic-inequalities-2v',
    topicName: 'Linear and Quadratic Inequalities in Two Variables',
    difficulty: 5,
    prompt,
    diagramType: 'two-var-inequality',
    diagramData: {
      type: 'linear',
      linear: {
        m: 1,
        b: -2,
        op: '>=',
        solid: true,
        shadeRegion: 'above',
      },
      testPoints: [
        { x: 0, y: 0, label: chosenSol.pt, isInSolution: true },
      ],
      range: 7,
    },
    options,
    correctOptionId,
    explanation: `For a point to be a solution to the system, it must satisfy BOTH inequalities simultaneously:
Testing ${chosenSol.pt}:
1. Check in y ≥ x - 2:
   Satisfies the condition (lies on or above the solid boundary y = x - 2).

2. Check in y < -x + 4:
   Satisfies the condition (strictly below the dashed boundary y = -x + 4).

Because both inequalities evaluate to TRUE, ${chosenSol.pt} belongs to the feasible intersection region.`,
    steps: [
      `Test point in first inequality: y ≥ x - 2 → TRUE`,
      `Test point in second inequality: y < -x + 4 → TRUE`,
      `Both conditions are met simultaneously`,
      `Conclusion: ${chosenSol.pt} is in the solution region`,
    ],
  };
}

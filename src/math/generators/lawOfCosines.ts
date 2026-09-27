import { DifficultyLevel, Question } from '../../types/math';
import { buildMultipleChoiceOptions, degToRad, radToDeg, randChoice, randInt, round } from '../utils';

export function generateLawOfCosinesQuestion(difficulty: DifficultyLevel): Question {
  const id = `cosines-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (difficulty === 1) {
    // Level 1: SAS - find the missing side
    const a = randInt(7, 18);
    const b = randInt(8, 20);
    const angleC = randChoice([40, 50, 60, 75, 100, 110, 120]);
    // c^2 = a^2 + b^2 - 2*a*b*cos(C)
    const cosC = Math.cos(degToRad(angleC));
    const cSq = a * a + b * b - 2 * a * b * cosC;
    const c = round(Math.sqrt(cSq), 1);

    const prompt = `In △ABC, side a = ${a}, side b = ${b}, and the included angle m∠C = ${angleC}°. Use the Law of Cosines to find the length of side c. (Round to one decimal place)`;
    const correct = `${c}`;
    const distractors = [
      `${round(Math.sqrt(a * a + b * b), 1)}`, // forgot -2ab cosC (Pythagorean misconception)
      `${round(Math.sqrt(a * a + b * b + 2 * a * b * cosC), 1)}`, // added instead of subtracted
      `${round(c + 2.8, 1)}`,
      `${round(Math.max(1, c - 3.2), 1)}`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'law-of-cosines',
      topicName: 'Law of Cosines',
      difficulty: 1,
      prompt,
      diagramType: 'triangle',
      diagramData: {
        vertices: { A: 'A', B: 'B', C: 'C' },
        angles: { C: `${angleC}°` },
        sides: { a: `${a}`, b: `${b}`, c: 'c = ?' },
        triangleType: angleC > 90 ? 'obtuse' : 'acute',
      },
      options,
      correctOptionId,
      explanation: `Use the Law of Cosines for side c:
c² = a² + b² - 2ab · cos(C)

1. Substitute values:
   c² = (${a})² + (${b})² - 2(${a})(${b}) · cos(${angleC}°)
   c² = ${a * a} + ${b * b} - ${2 * a * b} · (${round(cosC, 4)})
   c² = ${a * a + b * b} - (${round(2 * a * b * cosC, 2)})
   c² ≈ ${round(cSq, 2)}

2. Take the square root:
   c = √(${round(cSq, 2)}) ≈ ${c}.`,
      steps: [
        `Formula: c² = a² + b² - 2ab · cos(C)`,
        `Substitute: c² = ${a}² + ${b}² - 2(${a})(${b}) · cos(${angleC}°)`,
        `Evaluate: c² = ${a * a + b * b} - ${round(2 * a * b * cosC, 2)} = ${round(cSq, 2)}`,
        `Square root: c ≈ ${c}`,
      ],
    };
  }

  if (difficulty === 2) {
    // Level 2: SSS - Find a missing angle given 3 sides
    // Generate valid triangle sides
    const a = randInt(6, 14);
    const b = randInt(7, 16);
    // ensure c satisfies triangle inequality: |a - b| < c < a + b
    const minC = Math.abs(a - b) + 2;
    const maxC = a + b - 2;
    const c = randInt(minC, maxC);

    // Find angle C: cos(C) = (a^2 + b^2 - c^2) / (2ab)
    const num = a * a + b * b - c * c;
    const den = 2 * a * b;
    const cosC = num / den;
    const angleCRad = Math.acos(cosC);
    const angleC = round(radToDeg(angleCRad), 1);

    const prompt = `In △ABC, side a = ${a}, side b = ${b}, and side c = ${c}. Find the measure of ∠C to the nearest tenth of a degree.`;
    const correct = `${angleC}°`;
    const distractors = [
      `${round(180 - angleC, 1)}°`, // supplement
      `${round(radToDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c))), 1)}°`, // found angle A
      `${round(angleC + 5.6, 1)}°`,
      `${round(angleC - 4.8, 1)}°`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'law-of-cosines',
      topicName: 'Law of Cosines',
      difficulty: 2,
      prompt,
      diagramType: 'triangle',
      diagramData: {
        vertices: { A: 'A', B: 'B', C: 'C' },
        sides: { a: `${a}`, b: `${b}`, c: `${c}` },
        angles: { C: '∠C = ?' },
        triangleType: angleC > 90 ? 'obtuse' : 'acute',
      },
      options,
      correctOptionId,
      explanation: `Use the rearranged Law of Cosines to solve for angle C:
cos(C) = (a² + b² - c²) / (2ab)

1. Substitute the side lengths:
   cos(C) = (${a}² + ${b}² - ${c}²) / (2 · ${a} · ${b})
   cos(C) = (${a * a} + ${b * b} - ${c * c}) / (${den})
   cos(C) = ${num} / ${den} ≈ ${round(cosC, 4)}

2. Take the inverse cosine (arccos):
   m∠C = arccos(${round(cosC, 4)}) ≈ ${angleC}°.`,
      steps: [
        `Formula: cos(C) = (a² + b² - c²) / (2ab)`,
        `Substitute: cos(C) = (${a * a} + ${b * b} - ${c * c}) / (2 · ${a} · ${b})`,
        `Calculate ratio: cos(C) = ${num} / ${den} ≈ ${round(cosC, 4)}`,
        `Invert: m∠C = arccos(${round(cosC, 4)}) ≈ ${angleC}°`,
      ],
    };
  }

  if (difficulty === 3) {
    // Level 3: Identifying the largest (or smallest) angle in an SSS triangle
    const askLargest = Math.random() > 0.5;
    const a = randInt(7, 12);
    const b = randInt(13, 18);
    const c = randInt(b + 1, a + b - 2); // ensure c is strictly largest

    // Sides are a < b < c. Largest is C, smallest is A.
    let targetAngleName: string;
    let targetCos: number;
    let targetNum: number;
    let targetDen: number;

    if (askLargest) {
      targetAngleName = 'largest angle (∠C, opposite the longest side c = ' + c + ')';
      targetNum = a * a + b * b - c * c;
      targetDen = 2 * a * b;
      targetCos = targetNum / targetDen;
    } else {
      targetAngleName = 'smallest angle (∠A, opposite the shortest side a = ' + a + ')';
      targetNum = b * b + c * c - a * a;
      targetDen = 2 * b * c;
      targetCos = targetNum / targetDen;
    }

    const angleDeg = round(radToDeg(Math.acos(targetCos)), 1);

    const prompt = `A triangle has side lengths a = ${a}, b = ${b}, and c = ${c}. What is the measure of the ${targetAngleName}, to the nearest tenth of a degree?`;
    const correct = `${angleDeg}°`;
    const otherAngle = round(radToDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c))), 1);
    const distractors = [
      `${otherAngle}°`,
      `${round(180 - angleDeg, 1)}°`,
      `${round(angleDeg + 6.3, 1)}°`,
      `${round(Math.max(15, angleDeg - 7.1), 1)}°`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'law-of-cosines',
      topicName: 'Law of Cosines',
      difficulty: 3,
      prompt,
      diagramType: 'triangle',
      diagramData: {
        vertices: { A: 'A', B: 'B', C: 'C' },
        sides: { a: `${a}`, b: `${b}`, c: `${c}` },
        triangleType: angleDeg > 90 ? 'obtuse' : 'acute',
      },
      options,
      correctOptionId,
      explanation: `In any triangle, the ${askLargest ? 'largest' : 'smallest'} angle is always opposite the ${askLargest ? 'longest' : 'shortest'} side.
- Given side lengths: a = ${a}, b = ${b}, c = ${c}.
- The ${askLargest ? 'longest side is c = ' + c + ', so the largest angle is ∠C' : 'shortest side is a = ' + a + ', so the smallest angle is ∠A'}.

Using the Law of Cosines:
cos(θ) = ${targetNum} / ${targetDen} ≈ ${round(targetCos, 4)}
θ = arccos(${round(targetCos, 4)}) ≈ ${angleDeg}°.`,
      steps: [
        `Identify target: ${askLargest ? 'Largest angle is opposite longest side' : 'Smallest angle is opposite shortest side'}`,
        `Set up Law of Cosines formula`,
        `Evaluate cos(θ) = ${targetNum} / ${targetDen} ≈ ${round(targetCos, 4)}`,
        `Compute angle: θ ≈ ${angleDeg}°`,
      ],
    };
  }

  if (difficulty === 4) {
    // Level 4: SAS Triangle Area via K = 1/2 * a * b * sin(C) or finding diagonal of parallelogram
    const a = randInt(10, 18);
    const b = randInt(12, 22);
    const angleC = randChoice([35, 45, 60, 75, 120, 135]);
    // Area K = 0.5 * a * b * sin(C)
    const sinC = Math.sin(degToRad(angleC));
    const area = round(0.5 * a * b * sinC, 1);
    // Missing side c
    const cosC = Math.cos(degToRad(angleC));
    const c = round(Math.sqrt(a * a + b * b - 2 * a * b * cosC), 1);

    const prompt = `In △ABC, side a = ${a} cm, side b = ${b} cm, and included angle m∠C = ${angleC}°. First use the Law of Cosines to verify the triangle configuration (side c ≈ ${c} cm), and then calculate the exact area of △ABC. (Round to the nearest tenth of a square centimeter)`;
    const correct = `${area} cm²`;
    const distractors = [
      `${round(0.5 * a * b, 1)} cm²`, // assumed right triangle
      `${round(0.5 * a * b * cosC, 1)} cm²`, // used cos instead of sin
      `${round(area + 12.4, 1)} cm²`,
      `${round(area - 9.8, 1)} cm²`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'law-of-cosines',
      topicName: 'Law of Cosines',
      difficulty: 4,
      prompt,
      diagramType: 'triangle',
      diagramData: {
        vertices: { A: 'A', B: 'B', C: 'C' },
        angles: { C: `${angleC}°` },
        sides: { a: `${a} cm`, b: `${b} cm` },
        triangleType: angleC > 90 ? 'obtuse' : 'acute',
      },
      options,
      correctOptionId,
      explanation: `1. The formula for the area of a triangle given two sides and the included angle is:
   Area = ½ · a · b · sin(C)

2. Substitute the values:
   Area = ½ · ${a} · ${b} · sin(${angleC}°)
   Area = ${0.5 * a * b} · sin(${angleC}°)
   sin(${angleC}°) ≈ ${round(sinC, 4)}
   Area ≈ ${0.5 * a * b} · ${round(sinC, 4)} ≈ ${area} cm².`,
      steps: [
        `Area formula: Area = ½ · a · b · sin(C)`,
        `Substitute: Area = ½ · (${a}) · (${b}) · sin(${angleC}°)`,
        `Evaluate: Area = ${0.5 * a * b} · ${round(sinC, 4)}`,
        `Result: Area ≈ ${area} cm²`,
      ],
    };
  }

  // Level 5: Applied Navigation / Bearing Problem
  const speed1 = randChoice([15, 20, 25, 30]); // knots or km/h
  const speed2 = randChoice([12, 18, 22, 28]);
  const hours = randChoice([2, 3]);
  const dist1 = speed1 * hours;
  const dist2 = speed2 * hours;
  const angle = randChoice([65, 75, 80, 110, 125]);

  const cosAngle = Math.cos(degToRad(angle));
  const separationSq = dist1 * dist1 + dist2 * dist2 - 2 * dist1 * dist2 * cosAngle;
  const separation = round(Math.sqrt(separationSq), 1);

  const prompt = `Two ships leave the same port at the same time. Ship A sails on a bearing with a speed of ${speed1} knots, and Ship B sails at a speed of ${speed2} knots. The angle formed between their paths is ${angle}°. After ${hours} hours, how far apart are the two ships? (Round to the nearest tenth of a nautical mile)`;
  const correct = `${separation} nautical miles`;
  const distractors = [
    `${round(Math.sqrt(dist1 * dist1 + dist2 * dist2), 1)} nautical miles`, // assumed 90 degrees
    `${round(dist1 + dist2, 1)} nautical miles`, // linear sum
    `${round(separation + 8.5, 1)} nautical miles`,
    `${round(separation - 9.2, 1)} nautical miles`,
  ];

  const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
  return {
    id,
    topicId: 'law-of-cosines',
    topicName: 'Law of Cosines',
    difficulty: 5,
    prompt,
    diagramType: 'triangle',
    diagramData: {
      vertices: { A: 'Ship A', B: 'Ship B', C: 'Port' },
      angles: { C: `${angle}°` },
      sides: { a: `${dist2} nm`, b: `${dist1} nm`, c: 'd = ?' },
      triangleType: angle > 90 ? 'obtuse' : 'acute',
    },
    options,
    correctOptionId,
    explanation: `Step-by-step navigation problem solution:
1. Determine the distance traveled by each ship after ${hours} hours:
   - Ship A distance: ${speed1} knots × ${hours} h = ${dist1} nm
   - Ship B distance: ${speed2} knots × ${hours} h = ${dist2} nm

2. The port and the two ships form a triangle with two known sides (${dist1} nm and ${dist2} nm) and included angle ${angle}°.

3. Use the Law of Cosines to find the distance d between the ships:
   d² = (${dist1})² + (${dist2})² - 2(${dist1})(${dist2}) · cos(${angle}°)
   d² = ${dist1 * dist1} + ${dist2 * dist2} - ${2 * dist1 * dist2} · (${round(cosAngle, 4)})
   d² = ${dist1 * dist1 + dist2 * dist2} - (${round(2 * dist1 * dist2 * cosAngle, 2)}) ≈ ${round(separationSq, 2)}
   d = √(${round(separationSq, 2)}) ≈ ${separation} nautical miles.`,
    steps: [
      `Distance Ship A: ${speed1} × ${hours} = ${dist1} nm`,
      `Distance Ship B: ${speed2} × ${hours} = ${dist2} nm`,
      `Set up Law of Cosines: d² = ${dist1}² + ${dist2}² - 2(${dist1})(${dist2})cos(${angle}°)`,
      `Evaluate: d ≈ ${separation} nautical miles`,
    ],
  };
}

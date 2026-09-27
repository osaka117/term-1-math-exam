import { DifficultyLevel, Question } from '../../types/math';
import { buildMultipleChoiceOptions, degToRad, radToDeg, randChoice, randInt, round } from '../utils';

export function generateLawOfSinesQuestion(difficulty: DifficultyLevel): Question {
  const id = `sines-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (difficulty === 1) {
    // Level 1: Find a missing side given two angles and one opposite side (AAS)
    const angleA = randInt(35, 75);
    const angleB = randInt(40, 80);
    const sideA = randInt(10, 28);
    // b = a * sin(B) / sin(A)
    const sideB = round((sideA * Math.sin(degToRad(angleB))) / Math.sin(degToRad(angleA)), 1);

    const prompt = `In △ABC, m∠A = ${angleA}°, m∠B = ${angleB}°, and side a = ${sideA}. Using the Law of Sines, what is the length of side b? (Round to one decimal place if necessary)`;
    const correct = `${sideB}`;
    const distractors = [
      `${round((sideA * Math.sin(degToRad(angleA))) / Math.sin(degToRad(angleB)), 1)}`, // inverted ratio
      `${round((sideA * Math.cos(degToRad(angleB))) / Math.sin(degToRad(angleA)), 1)}`, // used cos
      `${round(sideB + 3.4, 1)}`,
      `${round(sideB - 2.8, 1)}`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'law-of-sines',
      topicName: 'Law of Sines',
      difficulty: 1,
      prompt,
      diagramType: 'triangle',
      diagramData: {
        vertices: { A: 'A', B: 'B', C: 'C' },
        angles: { A: `${angleA}°`, B: `${angleB}°` },
        sides: { a: `${sideA}`, b: 'b = ?' },
        triangleType: 'acute',
      },
      options,
      correctOptionId,
      explanation: `Use the Law of Sines:
a / sin(A) = b / sin(B)

1. Substitute known values:
   ${sideA} / sin(${angleA}°) = b / sin(${angleB}°)

2. Solve for b:
   b = (${sideA} · sin(${angleB}°)) / sin(${angleA}°)
   sin(${angleB}°) ≈ ${round(Math.sin(degToRad(angleB)), 4)}
   sin(${angleA}°) ≈ ${round(Math.sin(degToRad(angleA)), 4)}

3. Calculate:
   b ≈ (${sideA} · ${round(Math.sin(degToRad(angleB)), 4)}) / ${round(Math.sin(degToRad(angleA)), 4)} ≈ ${sideB}.`,
      steps: [
        `State Law of Sines: a / sin(A) = b / sin(B)`,
        `Rearrange: b = (a · sin(B)) / sin(A)`,
        `Substitute: b = (${sideA} · sin(${angleB}°)) / sin(${angleA}°)`,
        `Compute: b ≈ ${sideB}`,
      ],
    };
  }

  if (difficulty === 2) {
    // Level 2: Finding a missing angle given two sides and an opposite angle (SSA acute)
    const angleA = randInt(30, 50);
    const sideA = randInt(12, 22);
    // Choose sideB such that sinB = (sideB * sinA) / sideA is between 0.35 and 0.85
    const sinA = Math.sin(degToRad(angleA));
    const targetSinB = randChoice([0.45, 0.52, 0.60, 0.70, 0.78, 0.82]);
    const sideB = Math.round((targetSinB * sideA) / sinA);
    const actualSinB = (sideB * sinA) / sideA;
    const angleBRad = Math.asin(actualSinB);
    const angleB = round(radToDeg(angleBRad), 1);

    const prompt = `In △ABC, side a = ${sideA}, side b = ${sideB}, and m∠A = ${angleA}°. Assuming ∠B is an acute angle, find the measure of ∠B to the nearest tenth of a degree.`;
    const correct = `${angleB}°`;
    const distractors = [
      `${round(180 - angleB, 1)}°`, // obtuse supplement
      `${round(radToDeg(Math.asin((sideA * Math.sin(degToRad(angleA))) / sideB)), 1)}°`, // inverted ratio
      `${round(angleB + 5.2, 1)}°`,
      `${round(angleB - 6.5, 1)}°`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'law-of-sines',
      topicName: 'Law of Sines',
      difficulty: 2,
      prompt,
      diagramType: 'triangle',
      diagramData: {
        vertices: { A: 'A', B: 'B', C: 'C' },
        angles: { A: `${angleA}°`, B: 'B = ?' },
        sides: { a: `${sideA}`, b: `${sideB}` },
        triangleType: 'acute',
      },
      options,
      correctOptionId,
      explanation: `Use the Law of Sines to find m∠B:
sin(B) / b = sin(A) / a

1. Solve for sin(B):
   sin(B) = (b · sin(A)) / a
   sin(B) = (${sideB} · sin(${angleA}°)) / ${sideA}
   sin(${angleA}°) ≈ ${round(sinA, 4)}
   sin(B) ≈ (${sideB} · ${round(sinA, 4)}) / ${sideA} ≈ ${round(actualSinB, 4)}

2. Take the inverse sine (arcsin):
   B = arcsin(${round(actualSinB, 4)}) ≈ ${angleB}°.`,
      steps: [
        `Law of Sines: sin(B) / b = sin(A) / a`,
        `Isolate sin(B): sin(B) = (${sideB} · sin(${angleA}°)) / ${sideA}`,
        `Evaluate: sin(B) ≈ ${round(actualSinB, 4)}`,
        `Take arcsin: B ≈ ${angleB}°`,
      ],
    };
  }

  if (difficulty === 3) {
    // Level 3: Finding an unknown side after determining the third angle
    const angleA = randInt(40, 70);
    const angleB = randInt(35, 65);
    const angleC = 180 - (angleA + angleB);
    const sideA = randInt(15, 30);
    // Find side c opposite angle C
    const sideC = round((sideA * Math.sin(degToRad(angleC))) / Math.sin(degToRad(angleA)), 1);

    const prompt = `In △ABC, m∠A = ${angleA}°, m∠B = ${angleB}°, and side a = ${sideA}. Determine the length of side c. (Round to the nearest tenth)`;
    const correct = `${sideC}`;
    const distractors = [
      `${round((sideA * Math.sin(degToRad(angleB))) / Math.sin(degToRad(angleA)), 1)}`, // found side b instead
      `${round((sideA * Math.cos(degToRad(angleC))) / Math.sin(degToRad(angleA)), 1)}`,
      `${round(sideC + 4.2, 1)}`,
      `${round(sideC - 3.8, 1)}`,
    ];

    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
    return {
      id,
      topicId: 'law-of-sines',
      topicName: 'Law of Sines',
      difficulty: 3,
      prompt,
      diagramType: 'triangle',
      diagramData: {
        vertices: { A: 'A', B: 'B', C: 'C' },
        angles: { A: `${angleA}°`, B: `${angleB}°` },
        sides: { a: `${sideA}`, c: 'c = ?' },
        triangleType: angleC > 90 ? 'obtuse' : 'acute',
      },
      options,
      correctOptionId,
      explanation: `To find side c, first find the measure of angle C:
1. The sum of interior angles in a triangle is 180°:
   m∠C = 180° - (m∠A + m∠B)
   m∠C = 180° - (${angleA}° + ${angleB}°) = 180° - ${angleA + angleB}° = ${angleC}°

2. Apply the Law of Sines:
   c / sin(C) = a / sin(A)
   c = (a · sin(C)) / sin(A)
   c = (${sideA} · sin(${angleC}°)) / sin(${angleA}°)
   c ≈ (${sideA} · ${round(Math.sin(degToRad(angleC)), 4)}) / ${round(Math.sin(degToRad(angleA)), 4)} ≈ ${sideC}.`,
      steps: [
        `Find third angle: m∠C = 180° - (${angleA}° + ${angleB}°) = ${angleC}°`,
        `Set up Law of Sines: c / sin(${angleC}°) = ${sideA} / sin(${angleA}°)`,
        `Solve for c: c = (${sideA} · sin(${angleC}°)) / sin(${angleA}°)`,
        `Compute: c ≈ ${sideC}`,
      ],
    };
  }

  if (difficulty === 4) {
    // Level 4: Ambiguous Case (SSA) number of triangles test or second triangle solution
    const angleA = randChoice([30, 45, 60]);
    const b = randInt(14, 26);
    const h = round(b * Math.sin(degToRad(angleA)), 1);

    const scenario = randChoice(['zero', 'two', 'one']);
    let a: number;
    let correct: string;
    let distractors: string[];
    let explanationDetails: string;

    if (scenario === 'zero') {
      a = Math.floor(h - 2);
      correct = '0 triangles (No triangle can be formed)';
      distractors = [
        '1 unique right triangle',
        '1 unique oblique triangle',
        '2 distinct triangles',
      ];
      explanationDetails = `Since angle A = ${angleA}° is acute, compare side a with altitude h = b · sin(A):
h = ${b} · sin(${angleA}°) ≈ ${h}.
Since side a (${a}) < h (${h}), side a is too short to reach the opposite side.
Therefore, no triangle can be formed (0 triangles).`;
    } else if (scenario === 'two') {
      a = Math.round(h + (b - h) * 0.5);
      if (a >= b) a = b - 1;
      correct = '2 distinct triangles';
      distractors = [
        '0 triangles (No triangle exists)',
        '1 unique right triangle',
        'Infinitely many triangles',
      ];
      explanationDetails = `Since angle A = ${angleA}° is acute, compute altitude h = b · sin(A):
h = ${b} · sin(${angleA}°) ≈ ${h}.
Here: h (${h}) < a (${a}) < b (${b}).
Because the side opposite the acute angle is strictly between the altitude and the adjacent side (h < a < b), the ambiguous case yields exactly 2 distinct triangles.`;
    } else {
      a = b + randInt(3, 8);
      correct = '1 unique triangle';
      distractors = [
        '0 triangles (No triangle exists)',
        '2 distinct triangles',
        '3 triangles',
      ];
      explanationDetails = `Since angle A = ${angleA}° is acute, compare side a with side b:
Here a = ${a} and b = ${b}.
Because a ≥ b, the swinging side can only intersect the base at one point to form a valid triangle.
Therefore, exactly 1 unique triangle is formed.`;
    }

    const prompt = `In △ABC, m∠A = ${angleA}°, side b = ${b}, and side a = ${a}. How many distinct triangles can be formed with these given dimensions?`;
    const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);

    return {
      id,
      topicId: 'law-of-sines',
      topicName: 'Law of Sines',
      difficulty: 4,
      prompt,
      diagramType: 'triangle',
      diagramData: {
        vertices: { A: 'A', B: 'B', C: 'C' },
        angles: { A: `${angleA}°` },
        sides: { a: `${a}`, b: `${b}` },
        triangleType: 'acute',
      },
      options,
      correctOptionId,
      explanation: explanationDetails,
      steps: [
        `Calculate altitude: h = b · sin(A) = ${b} · sin(${angleA}°) ≈ ${h}`,
        `Compare side a = ${a} with h = ${h} and b = ${b}`,
        `Conclusion: ${correct}`,
      ],
    };
  }

  // Level 5: Applied Real-World Problem (Surveying / Baseline)
  const baseline = randInt(80, 200); // meters between two observation stations A and B
  const angleA = randInt(42, 68);
  const angleB = randInt(45, 72);
  const angleC = 180 - (angleA + angleB);
  // Distance from station A to target C = b = baseline * sin(B) / sin(C)
  const distAC = round((baseline * Math.sin(degToRad(angleB))) / Math.sin(degToRad(angleC)), 1);

  const prompt = `Two surveyors at points A and B are observing a distant tower peak at point C. The distance between stations A and B is ${baseline} meters. The measured angle CAB is ${angleA}° and angle CBA is ${angleB}°. Using the Law of Sines, calculate the direct distance from station A to the tower peak C (side b), rounded to the nearest tenth of a meter.`;
  const correct = `${distAC} m`;
  const distractors = [
    `${round((baseline * Math.sin(degToRad(angleA))) / Math.sin(degToRad(angleC)), 1)} m`, // distance from B instead
    `${round((baseline * Math.cos(degToRad(angleB))) / Math.sin(degToRad(angleC)), 1)} m`,
    `${round(distAC + 15.5, 1)} m`,
    `${round(distAC - 18.2, 1)} m`,
  ];

  const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
  return {
    id,
    topicId: 'law-of-sines',
    topicName: 'Law of Sines',
    difficulty: 5,
    prompt,
    diagramType: 'triangle',
    diagramData: {
      vertices: { A: 'Station A', B: 'Station B', C: 'Tower C' },
      angles: { A: `${angleA}°`, B: `${angleB}°` },
      sides: { c: `${baseline} m`, b: 'AC = ?' },
      triangleType: angleC > 90 ? 'obtuse' : 'acute',
    },
    options,
    correctOptionId,
    explanation: `Step-by-step solution for the surveying problem:
1. Identify the given values in △ABC:
   - Baseline c = AB = ${baseline} m
   - m∠A = ${angleA}°
   - m∠B = ${angleB}°

2. Compute the angle at the tower peak (∠C):
   m∠C = 180° - (m∠A + m∠B) = 180° - (${angleA}° + ${angleB}°) = ${angleC}°

3. Apply Law of Sines to find distance AC (side b):
   b / sin(B) = c / sin(C)
   b = (c · sin(B)) / sin(C)
   b = (${baseline} · sin(${angleB}°)) / sin(${angleC}°)
   b ≈ (${baseline} · ${round(Math.sin(degToRad(angleB)), 4)}) / ${round(Math.sin(degToRad(angleC)), 4)} ≈ ${distAC} m.`,
    steps: [
      `Find vertex angle: m∠C = 180° - (${angleA}° + ${angleB}°) = ${angleC}°`,
      `Set up Law of Sines: AC / sin(${angleB}°) = ${baseline} / sin(${angleC}°)`,
      `Solve for AC: AC = (${baseline} · sin(${angleB}°)) / sin(${angleC}°)`,
      `Compute: AC ≈ ${distAC} m`,
    ],
  };
}

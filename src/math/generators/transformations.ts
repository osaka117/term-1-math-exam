import { DifficultyLevel, Question } from '../../types/math';
import { buildMultipleChoiceOptions, randChoice, randInt, randNonZero } from '../utils';

export function generateTransformationQuestion(difficulty: DifficultyLevel): Question {
  const id = `trans-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (difficulty === 1) {
    // Level 1: Basic Translation or Single Axis Reflection
    const type = randChoice(['translation', 'reflect-x', 'reflect-y']);
    const x = randInt(-6, 6);
    const y = randInt(-6, 6);

    if (type === 'translation') {
      const dx = randNonZero(-5, 5);
      const dy = randNonZero(-5, 5);
      const newX = x + dx;
      const newY = y + dy;

      const horiz = dx > 0 ? `${dx} units right` : `${Math.abs(dx)} units left`;
      const vert = dy > 0 ? `${dy} units up` : `${Math.abs(dy)} units down`;
      const prompt = `A point P(${x}, ${y}) is translated ${horiz} and ${vert}. What are the coordinates of the image point P'?`;

      const correct = `(${newX}, ${newY})`;
      const distractors = [
        `(${x - dx}, ${y - dy})`, // inverted both
        `(${y + dy}, ${x + dx})`, // swapped x and y
        `(${newX}, ${y - dy})`,   // inverted y
        `(${x - dx}, ${newY})`,   // inverted x
      ];

      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 1,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x, y, label: `P(${x},${y})` },
          image: { x: newX, y: newY, label: `P'(${newX},${newY})` },
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `Under translation by (${dx > 0 ? '+' + dx : dx}, ${dy > 0 ? '+' + dy : dy}):
1. Add the horizontal shift to the x-coordinate: ${x} + (${dx}) = ${newX}.
2. Add the vertical shift to the y-coordinate: ${y} + (${dy}) = ${newY}.
Therefore, the image point is P'(${newX}, ${newY}).`,
        steps: [
          `Horizontal movement: x' = ${x} + (${dx}) = ${newX}`,
          `Vertical movement: y' = ${y} + (${dy}) = ${newY}`,
          `Resulting coordinates: P'(${newX}, ${newY})`,
        ],
      };
    } else if (type === 'reflect-x') {
      const prompt = `Point A(${x}, ${y}) is reflected across the x-axis. What are the coordinates of its image A'?`;
      const correct = `(${x}, ${-y})`;
      const distractors = [
        `(${-x}, ${y})`,   // y-axis reflection mistake
        `(${-x}, ${-y})`,  // origin reflection mistake
        `(${y}, ${x})`,    // y = x reflection mistake
      ];
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 1,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x, y, label: `A(${x},${y})` },
          image: { x, y: -y, label: `A'(${x},${-y})` },
          reflectionLine: 'x-axis',
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `A reflection across the x-axis keeps the x-coordinate unchanged and negates the y-coordinate:
Rule: (x, y) → (x, -y)
Applying to A(${x}, ${y}):
A' = (${x}, -(${y})) = (${x}, ${-y}).`,
        steps: [
          `Rule for reflection over x-axis: (x, y) → (x, -y)`,
          `x-coordinate remains ${x}`,
          `y-coordinate changes from ${y} to ${-y}`,
          `Image is A'(${x}, ${-y})`,
        ],
      };
    } else {
      const prompt = `Point B(${x}, ${y}) is reflected across the y-axis. What are the coordinates of its image B'?`;
      const correct = `(${-x}, ${y})`;
      const distractors = [
        `(${x}, ${-y})`,   // x-axis mistake
        `(${-x}, ${-y})`,  // 180 rotation mistake
        `(${y}, ${x})`,
      ];
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 1,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x, y, label: `B(${x},${y})` },
          image: { x: -x, y, label: `B'(${-x},${y})` },
          reflectionLine: 'y-axis',
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `A reflection across the y-axis negates the x-coordinate and leaves the y-coordinate unchanged:
Rule: (x, y) → (-x, y)
Applying to B(${x}, ${y}):
B' = (-(${x}), ${y}) = (${-x}, ${y}).`,
        steps: [
          `Rule for reflection over y-axis: (x, y) → (-x, y)`,
          `x-coordinate changes from ${x} to ${-x}`,
          `y-coordinate remains ${y}`,
          `Image is B'(${-x}, ${y})`,
        ],
      };
    }
  }

  if (difficulty === 2) {
    // Level 2: Rotations about the origin (90, 180, 270) or reflection over y = x / y = -x
    const rotType = randChoice(['90ccw', '180', '270ccw', 'refl-y=x']);
    const x = randNonZero(-5, 5);
    const y = randNonZero(-5, 5);

    if (rotType === '90ccw') {
      const newX = -y;
      const newY = x;
      const prompt = `What are the coordinates of point C(${x}, ${y}) after a rotation of 90° counterclockwise (270° clockwise) about the origin?`;
      const correct = `(${newX}, ${newY})`;
      const distractors = [
        `(${y}, ${-x})`,  // 90 clockwise instead
        `(${-x}, ${-y})`, // 180 rotation
        `(${newX}, ${-newY})`,
        `(${y}, ${x})`,
      ];
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 2,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x, y, label: `C(${x},${y})` },
          image: { x: newX, y: newY, label: `C'(${newX},${newY})` },
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `Rule for a 90° counterclockwise rotation about the origin:
(x, y) → (-y, x)
1. New x = -(${y}) = ${newX}
2. New y = ${x}
Therefore, C' = (${newX}, ${newY}).`,
        steps: [
          `Formula for 90° counterclockwise rotation: (x, y) → (-y, x)`,
          `Substitute x = ${x} and y = ${y}`,
          `x' = -(${y}) = ${newX}`,
          `y' = ${x}`,
          `Result: C'(${newX}, ${newY})`,
        ],
      };
    } else if (rotType === '180') {
      const newX = -x;
      const newY = -y;
      const prompt = `Point D(${x}, ${y}) is rotated 180° about the origin. What are the coordinates of D'?`;
      const correct = `(${newX}, ${newY})`;
      const distractors = [
        `(${newY}, ${newX})`,
        `(${-y}, ${x})`,
        `(${x}, ${-y})`,
        `(${-x}, ${y})`,
      ];
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 2,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x, y, label: `D(${x},${y})` },
          image: { x: newX, y: newY, label: `D'(${newX},${newY})` },
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `Rule for a 180° rotation about the origin:
(x, y) → (-x, -y)
Applying this to D(${x}, ${y}):
D' = (-(${x}), -(${y})) = (${newX}, ${newY}).`,
        steps: [
          `Formula for 180° rotation: (x, y) → (-x, -y)`,
          `Negate x: -(${x}) = ${newX}`,
          `Negate y: -(${y}) = ${newY}`,
          `D' = (${newX}, ${newY})`,
        ],
      };
    } else if (rotType === '270ccw') {
      const newX = y;
      const newY = -x;
      const prompt = `What are the coordinates of point E(${x}, ${y}) after a 270° counterclockwise rotation about the origin?`;
      const correct = `(${newX}, ${newY})`;
      const distractors = [
        `(${-y}, ${x})`,  // 90 ccw
        `(${-x}, ${-y})`, // 180
        `(${x}, ${-y})`,
        `(${-y}, ${-x})`,
      ];
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 2,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x, y, label: `E(${x},${y})` },
          image: { x: newX, y: newY, label: `E'(${newX},${newY})` },
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `A 270° counterclockwise rotation is equivalent to a 90° clockwise rotation:
Rule: (x, y) → (y, -x)
1. New x = ${y}
2. New y = -(${x}) = ${newY}
Therefore, E' = (${newX}, ${newY}).`,
        steps: [
          `Rule for 270° counterclockwise rotation: (x, y) → (y, -x)`,
          `Substitute coordinates: x' = ${y}, y' = -(${x}) = ${newY}`,
          `Image point: E'(${newX}, ${newY})`,
        ],
      };
    } else {
      // Reflection over line y = x
      const newX = y;
      const newY = x;
      const prompt = `Point F(${x}, ${y}) is reflected across the line y = x. What are the coordinates of F'?`;
      const correct = `(${newX}, ${newY})`;
      const distractors = [
        `(${-y}, ${-x})`, // reflection across y = -x
        `(${-x}, ${-y})`,
        `(${x}, ${-y})`,
        `(${-x}, ${y})`,
      ];
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 2,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x, y, label: `F(${x},${y})` },
          image: { x: newX, y: newY, label: `F'(${newX},${newY})` },
          reflectionLine: 'y=x',
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `Rule for reflection across the line y = x:
The coordinates are swapped: (x, y) → (y, x)
For F(${x}, ${y}):
F' = (${y}, ${x}).`,
        steps: [
          `Reflection across line y = x swaps the x and y coordinates`,
          `x' = ${y}`,
          `y' = ${x}`,
          `F' = (${newX}, ${newY})`,
        ],
      };
    }
  }

  if (difficulty === 3) {
    // Level 3: Finding Preimage (inverse transformation) or identifying the transformation
    const sub = randChoice(['preimage-translation', 'preimage-rotation', 'identify-transform']);
    if (sub === 'preimage-translation') {
      const origX = randInt(-5, 5);
      const origY = randInt(-5, 5);
      const dx = randNonZero(-4, 4);
      const dy = randNonZero(-4, 4);
      const imgX = origX + dx;
      const imgY = origY + dy;

      const horiz = dx > 0 ? `${dx} units right` : `${Math.abs(dx)} units left`;
      const vert = dy > 0 ? `${dy} units up` : `${Math.abs(dy)} units down`;
      const prompt = `After a translation of ${horiz} and ${vert}, the image point is P'(${imgX}, ${imgY}). What were the original coordinates of the preimage P?`;
      const correct = `(${origX}, ${origY})`;
      const distractors = [
        `(${imgX + dx}, ${imgY + dy})`, // applied forward shift to image instead of backward
        `(${origX}, ${origY + 2 * dy})`,
        `(${origY}, ${origX})`,
        `(${imgX - dy}, ${imgY - dx})`,
      ];
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 3,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          image: { x: imgX, y: imgY, label: `P'(${imgX},${imgY})` },
          preimage: { x: origX, y: origY, label: `P(${origX},${origY})` },
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `To find the preimage, reverse the translation:
Image coordinates: P'(${imgX}, ${imgY})
Shift was: x' = x + (${dx}), y' = y + (${dy})
Solving for original (x, y):
x = x' - (${dx}) = ${imgX} - (${dx}) = ${origX}
y = y' - (${dy}) = ${imgY} - (${dy}) = ${origY}
Preimage is P(${origX}, ${origY}).`,
        steps: [
          `Set up equations: x + (${dx}) = ${imgX} and y + (${dy}) = ${imgY}`,
          `Solve for x: x = ${imgX} - (${dx}) = ${origX}`,
          `Solve for y: y = ${imgY} - (${dy}) = ${origY}`,
          `Original coordinates: P(${origX}, ${origY})`,
        ],
      };
    } else if (sub === 'preimage-rotation') {
      const origX = randNonZero(-5, 5);
      const origY = randNonZero(-5, 5);
      // 90 ccw rotation gives imgX = -origY, imgY = origX
      const imgX = -origY;
      const imgY = origX;

      const prompt = `Point Q'(${imgX}, ${imgY}) is the image of point Q after a 90° counterclockwise rotation about the origin. What are the coordinates of Q?`;
      const correct = `(${origX}, ${origY})`;
      const distractors = [
        `(${-imgY}, ${imgX})`, // applied forward rotation again: (-origX, -origY)
        `(${imgY}, ${-imgX})`,
        `(${-origX}, ${origY})`,
        `(${origY}, ${origX})`,
      ];
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 3,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x: origX, y: origY, label: `Q(${origX},${origY})` },
          image: { x: imgX, y: imgY, label: `Q'(${imgX},${imgY})` },
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `A 90° counterclockwise rotation maps (x, y) → (-y, x).
Here, Q' = (${imgX}, ${imgY}).
Therefore:
-y = ${imgX}  =>  y = ${origY}
x = ${imgY}   =>  x = ${origX}
So the original point Q is (${origX}, ${origY}).`,
        steps: [
          `Rotation rule: (x, y) → (-y, x)`,
          `Equate components: -y = ${imgX} → y = ${origY}`,
          `Equate x: x = ${imgY} → x = ${origX}`,
          `Preimage Q = (${origX}, ${origY})`,
        ],
      };
    } else {
      // Identifying transformation
      const x = randNonZero(1, 5);
      const y = randNonZero(1, 5);
      const transChoice = randChoice([
        { name: 'Reflection across the line y = -x', rule: `(${-y}, ${-x})` },
        { name: 'Rotation of 180° about the origin', rule: `(${-x}, ${-y})` },
        { name: 'Rotation of 90° clockwise about the origin', rule: `(${y}, ${-x})` },
      ]);

      const prompt = `Which transformation maps the preimage point M(${x}, ${y}) to the image point M'${transChoice.rule}?`;
      const correct = transChoice.name;
      const distractors = [
        'Reflection across the line y = x',
        'Rotation of 90° counterclockwise about the origin',
        'Reflection across the y-axis',
        'Translation of 2 units left and 2 units down',
      ].filter(d => d !== correct);

      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 3,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x, y, label: `M(${x},${y})` },
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `Analyzing the mapping from (${x}, ${y}) to ${transChoice.rule}:
- ${transChoice.name} corresponds exactly to this algebraic coordinate rule.`,
        steps: [
          `Original coordinates: (${x}, ${y})`,
          `Target coordinates: ${transChoice.rule}`,
          `Matching against coordinate transformation rules identifies: ${correct}`,
        ],
      };
    }
  }

  if (difficulty === 4) {
    // Level 4: Composite transformations (two steps)
    const x = randInt(-4, 4);
    const y = randInt(-4, 4);
    const compType = randChoice(['reflectX-then-trans', 'rotate90-then-reflectY', 'refl-line-x=k']);

    if (compType === 'reflectX-then-trans') {
      const dx = randNonZero(-3, 3);
      const dy = randNonZero(-3, 3);
      // Step 1: reflect across x-axis: (x, -y)
      const midX = x;
      const midY = -y;
      // Step 2: translate by (dx, dy)
      const finalX = midX + dx;
      const finalY = midY + dy;

      const horiz = dx > 0 ? `${dx} units right` : `${Math.abs(dx)} units left`;
      const vert = dy > 0 ? `${dy} units up` : `${Math.abs(dy)} units down`;
      const prompt = `Point R(${x}, ${y}) is first reflected across the x-axis, and the resulting image is then translated ${horiz} and ${vert}. What are the final coordinates R''?`;
      const correct = `(${finalX}, ${finalY})`;
      const distractors = [
        `(${x + dx}, ${y + dy})`,           // forgot reflection
        `(${-x + dx}, ${y + dy})`,          // reflected y-axis instead of x-axis
        `(${finalX}, ${-finalY})`,
        `(${x - dx}, ${midY - dy})`,
      ];
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 4,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x, y, label: `R(${x},${y})` },
          points: [
            { x: midX, y: midY, label: `R'(${midX},${midY})`, color: '#6b7280' },
            { x: finalX, y: finalY, label: `R''(${finalX},${finalY})`, color: '#16a34a' },
          ],
          reflectionLine: 'x-axis',
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `Apply the composite transformations sequentially:
Step 1 (Reflection across x-axis): (x, y) → (x, -y)
R(${x}, ${y}) → R'(${midX}, ${midY})

Step 2 (Translation by ${horiz}, ${vert}):
x'' = ${midX} + (${dx}) = ${finalX}
y'' = ${midY} + (${dy}) = ${finalY}
Final point R'' = (${finalX}, ${finalY}).`,
        steps: [
          `Step 1: Reflect R(${x}, ${y}) over x-axis → R'(${midX}, ${midY})`,
          `Step 2: Translate R' by (${dx}, ${dy})`,
          `x'' = ${midX} + (${dx}) = ${finalX}`,
          `y'' = ${midY} + (${dy}) = ${finalY}`,
          `Final image: R''(${finalX}, ${finalY})`,
        ],
      };
    } else if (compType === 'rotate90-then-reflectY') {
      // Rotate 90 ccw: (x, y) -> (-y, x)
      // Then reflect across y-axis: (-y, x) -> (-(-y), x) = (y, x)
      const midX = -y;
      const midY = x;
      const finalX = -midX;
      const finalY = midY;

      const prompt = `Point S(${x}, ${y}) is rotated 90° counterclockwise about the origin, and then the image is reflected across the y-axis. What are the coordinates of the final point S''?`;
      const correct = `(${finalX}, ${finalY})`;
      const distractors = [
        `(${midX}, ${midY})`,    // only rotated
        `(${-x}, ${-y})`,
        `(${-finalX}, ${-finalY})`,
        `(${x}, ${-y})`,
      ];
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 4,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x, y, label: `S(${x},${y})` },
          points: [
            { x: midX, y: midY, label: `S'(${midX},${midY})`, color: '#6b7280' },
            { x: finalX, y: finalY, label: `S''(${finalX},${finalY})`, color: '#16a34a' },
          ],
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `Step 1 (90° counterclockwise rotation):
(x, y) → (-y, x)
S(${x}, ${y}) → S'(${midX}, ${midY})

Step 2 (Reflection across the y-axis):
(x', y') → (-x', y')
S'(${midX}, ${midY}) → S''(-(${midX}), ${midY}) = S''(${finalX}, ${finalY}).
Note: The composition of a 90° CCW rotation followed by reflection over y-axis simplifies to (x, y) → (y, x), which is reflection across the line y = x.`,
        steps: [
          `Step 1: 90° CCW rotation: (${x}, ${y}) → (-(${y}), ${x}) = (${midX}, ${midY})`,
          `Step 2: Reflect over y-axis: (-(${midX}), ${midY}) = (${finalX}, ${finalY})`,
          `Final point: S''(${finalX}, ${finalY})`,
        ],
      };
    } else {
      // Reflection across a vertical line x = k
      const k = randChoice([-3, -2, -1, 1, 2, 3]);
      // Distance from x to k is (x - k). Image is at k - (x - k) = 2k - x
      const newX = 2 * k - x;
      const newY = y;
      const prompt = `Point T(${x}, ${y}) is reflected across the vertical line x = ${k}. What are the coordinates of the image T'?`;
      const correct = `(${newX}, ${newY})`;
      const distractors = [
        `(${x}, ${2 * k - y})`, // reflected across horizontal line y = k mistake
        `(${-x}, ${y})`,        // reflected across y-axis mistake
        `(${newX + 1}, ${newY})`,
        `(${k - x}, ${newY})`,
      ];
      const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
      return {
        id,
        topicId: 'position-transformations',
        topicName: 'Position of Points and Transformations',
        difficulty: 4,
        prompt,
        diagramType: 'coordinate-plane',
        diagramData: {
          preimage: { x, y, label: `T(${x},${y})` },
          image: { x: newX, y: newY, label: `T'(${newX},${newY})` },
          reflectionLine: { m: Infinity, b: k, label: `x = ${k}` },
          range: 8,
        },
        options,
        correctOptionId,
        explanation: `When reflecting across a vertical line x = k:
1. The y-coordinate remains unchanged: y' = ${y}.
2. The distance between the original point and the line of reflection is preserved on the other side:
   The midpoint of x and x' must be k: (x + x') / 2 = k  =>  x' = 2k - x.
   x' = 2(${k}) - (${x}) = ${2 * k} - (${x}) = ${newX}.
Therefore, T' = (${newX}, ${newY}).`,
        steps: [
          `Midpoint formula for reflection across line x = ${k}: (x + x') / 2 = ${k}`,
          `x' = 2(${k}) - (${x}) = ${2 * k} - (${x}) = ${newX}`,
          `y' = ${y} (vertical reflection line does not affect y)`,
          `Image is T'(${newX}, ${newY})`,
        ],
      };
    }
  }

  // Level 5: High-level Multi-step or Composition Inversion
  // Given original triangle or point transformed twice, find original point or analyze invariant properties
  const x = randInt(-4, 4);
  const y = randInt(-4, 4);
  // Transform 1: Translate by (h, k)
  const h = randNonZero(-3, 3);
  const k = randNonZero(-3, 3);
  const p1X = x + h;
  const p1Y = y + k;
  // Transform 2: Rotate 180°: (-p1X, -p1Y)
  const finalX = -p1X;
  const finalY = -p1Y;

  const hStr = h > 0 ? `${h} units right` : `${Math.abs(h)} units left`;
  const kStr = k > 0 ? `${k} units up` : `${Math.abs(k)} units down`;

  const prompt = `A secret point W was translated ${hStr} and ${kStr}, and then the resulting point was rotated 180° about the origin, arriving at the final coordinates W''(${finalX}, ${finalY}). What were the initial coordinates of point W?`;
  const correct = `(${x}, ${y})`;
  const distractors = [
    `(${-x}, ${-y})`,
    `(${finalX - h}, ${finalY - k})`, // reversed order of inverse
    `(${x + 2 * h}, ${y + 2 * k})`,
    `(${y}, ${x})`,
  ];
  const { options, correctOptionId } = buildMultipleChoiceOptions(correct, distractors);
  return {
    id,
    topicId: 'position-transformations',
    topicName: 'Position of Points and Transformations',
    difficulty: 5,
    prompt,
    diagramType: 'coordinate-plane',
    diagramData: {
      image: { x: finalX, y: finalY, label: `W''(${finalX},${finalY})` },
      preimage: { x, y, label: `W(${x},${y})` },
      range: 8,
    },
    options,
    correctOptionId,
    explanation: `To find the initial point W, we apply the inverse transformations in reverse order:
1. Inverse of 180° rotation about origin:
   The inverse of a 180° rotation is another 180° rotation:
   W' = (-(${finalX}), -(${finalY})) = (${p1X}, ${p1Y}).

2. Inverse of the translation (${hStr}, ${kStr}):
   Subtract the shift from W':
   x = ${p1X} - (${h}) = ${x}
   y = ${p1Y} - (${k}) = ${y}

Therefore, the initial coordinates of W were (${x}, ${y}).`,
    steps: [
      `Undo 180° rotation: W' = (-(${finalX}), -(${finalY})) = (${p1X}, ${p1Y})`,
      `Undo translation: x = ${p1X} - (${h}) = ${x}`,
      `Undo translation: y = ${p1Y} - (${k}) = ${y}`,
      `Original coordinates: W(${x}, ${y})`,
    ],
  };
}

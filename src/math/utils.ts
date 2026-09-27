import { QuestionOption } from '../types/math';

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randChoice<T>(arr: readonly T[] | T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

export function randNonZero(min: number, max: number): number {
  let val = 0;
  while (val === 0) {
    val = randInt(min, max);
  }
  return val;
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function formatFraction(numerator: number, denominator: number): string {
  if (denominator === 0) return 'undefined';
  if (numerator === 0) return '0';
  const sign = (numerator * denominator < 0) ? '-' : '';
  const num = Math.abs(numerator);
  const den = Math.abs(denominator);
  const common = gcd(num, den);
  const sNum = num / common;
  const sDen = den / common;
  if (sDen === 1) return `${sign}${sNum}`;
  return `${sign}${sNum}/${sDen}`;
}

export function formatSigned(n: number, withSpace = true): string {
  const space = withSpace ? ' ' : '';
  if (n >= 0) return `+${space}${n}`;
  return `-${space}${Math.abs(n)}`;
}

export function round(val: number, decimals = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Creates 4 multiple choice options from 1 correct answer and 3 distinct plausible distractors.
 * Guarantees distinct option texts and randomly assigns to A, B, C, D.
 */
export function buildMultipleChoiceOptions(
  correctText: string,
  distractors: string[]
): { options: QuestionOption[]; correctOptionId: 'A' | 'B' | 'C' | 'D' } {
  // Ensure distractors are unique and don't match the correct text
  const cleanDistractors = Array.from(
    new Set(distractors.filter(d => d.trim() !== correctText.trim()))
  );

  // If there are fewer than 3 unique distractors, generate fallback variants
  while (cleanDistractors.length < 3) {
    const fallback = `None of the above / ${cleanDistractors.length + 1}`;
    if (!cleanDistractors.includes(fallback) && fallback !== correctText) {
      cleanDistractors.push(fallback);
    } else {
      cleanDistractors.push(`Variant ${cleanDistractors.length + 1}`);
    }
  }

  const selectedDistractors = cleanDistractors.slice(0, 3);
  const pool = [
    { text: correctText, isCorrect: true },
    { text: selectedDistractors[0], isCorrect: false },
    { text: selectedDistractors[1], isCorrect: false },
    { text: selectedDistractors[2], isCorrect: false },
  ];

  const shuffled = shuffle(pool);
  const letterIds: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  const options: QuestionOption[] = shuffled.map((item, idx) => ({
    id: letterIds[idx],
    text: item.text,
  }));

  const correctIndex = shuffled.findIndex(item => item.isCorrect);
  const correctOptionId = letterIds[correctIndex];

  return { options, correctOptionId };
}

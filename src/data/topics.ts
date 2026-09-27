import { TopicId, TopicInfo } from '../types/math';

export const TOPICS: TopicInfo[] = [
  {
    id: 'position-transformations',
    name: 'Position of Points and Transformations',
    shortName: 'Transformations',
    description: 'Translations, reflections across axes/lines, rotations about the origin, identifying rules, and composite transformations.',
    subtopics: [
      'Translations (h, k)',
      'Reflections (x-axis, y-axis, y=x, y=-x)',
      'Rotations (90°, 180°, 270°)',
      'Finding original preimage coordinates',
      'Composite transformations',
    ],
  },
  {
    id: 'law-of-sines',
    name: 'Law of Sines',
    shortName: 'Law of Sines',
    description: 'Using a/sin(A) = b/sin(B) = c/sin(C) to find unknown sides, angles, and analyzing triangle configurations.',
    subtopics: [
      'Finding unknown side lengths (AAS / ASA)',
      'Finding unknown angle measures (SSA)',
      'Calculating third angle before side calculation',
      'Ambiguous case (0, 1, or 2 triangles)',
      'Applied non-right triangle problems',
    ],
  },
  {
    id: 'law-of-cosines',
    name: 'Law of Cosines',
    shortName: 'Law of Cosines',
    description: 'Applying c² = a² + b² - 2ab·cos(C) to solve SAS and SSS oblique triangles.',
    subtopics: [
      'Finding missing side in SAS triangles',
      'Finding angles in SSS triangles',
      'Identifying largest and smallest angles',
      'Area of triangle using K = ½ab·sin(C)',
      'Distance and navigation problems',
    ],
  },
  {
    id: 'quadratic-inequalities-1v',
    name: 'Quadratic Inequalities in One Variable',
    shortName: 'Quadratic Inequalities (1V)',
    description: 'Solving ax² + bx + c > 0, ≥ 0, < 0, ≤ 0 via factoring, critical values, interval tests, and number lines.',
    subtopics: [
      'Factoring and finding critical values',
      'Sign analysis on test intervals',
      'Monic & non-monic quadratics',
      'Interval notation & number lines',
      'Special cases (empty set, single point, all reals)',
    ],
  },
  {
    id: 'linear-quadratic-inequalities-2v',
    name: 'Linear and Quadratic Inequalities in Two Variables',
    shortName: 'Inequalities in Two Variables',
    description: 'Graphing linear and quadratic inequalities in the Cartesian plane, boundary curves, and test points.',
    subtopics: [
      'Testing points in half-planes & parabolic regions',
      'Dashed vs. solid boundary lines and parabolas',
      'Determining shaded regions (above, below, inside, outside)',
      'Converting standard form to slope-intercept form',
      'Systems of inequalities and feasible regions',
    ],
  },
  {
    id: 'absolute-value',
    name: 'Absolute Value Equations and Inequalities in One Variable',
    shortName: 'Absolute Value (1V)',
    description: 'Solving |ax + b| = c, |ax + b| < c (and), and |ax + b| > c (or), isolated forms and special cases.',
    subtopics: [
      'Absolute value equations |ax + b| = c',
      'Bounded compound inequalities |ax + b| ≤ c',
      'Disjoint union inequalities |ax + b| ≥ c',
      'Reversing signs when dividing by negatives',
      'Special cases (no solution, all real numbers)',
    ],
  },
  {
    id: 'measures-of-position',
    name: 'Measures of Position',
    shortName: 'Measures of Position',
    description: 'Determining median, quartiles (Q1, Q2, Q3), deciles, percentiles, and percentile ranks in data sets.',
    subtopics: [
      'Median of odd and even-sized distributions',
      'First quartile (Q1) and third quartile (Q3)',
      'Finding the kth percentile (Pk) and deciles (Dk)',
      'Calculating percentile rank of a score',
      'Interpreting position metrics in context',
    ],
  },
  {
    id: 'iqr-and-outliers',
    name: 'Interquartile Range and Outliers',
    shortName: 'IQR & Outliers',
    description: 'Computing IQR = Q3 - Q1, calculating lower and upper 1.5×IQR fences, and detecting statistical outliers.',
    subtopics: [
      'Computing IQR from 5-number summary or data',
      'Calculating lower fence (Q1 - 1.5·IQR)',
      'Calculating upper fence (Q3 + 1.5·IQR)',
      'Identifying outlier values in data sets',
      'Resistant vs. non-resistant summary statistics',
    ],
  },
];

export const DIFFICULTY_LABELS: Record<number, { label: string; desc: string }> = {
  1: { label: 'LEVEL 1', desc: 'Very basic questions requiring direct application of the concept.' },
  2: { label: 'LEVEL 2', desc: 'Basic questions with slightly more steps.' },
  3: { label: 'LEVEL 3', desc: 'Moderate questions requiring multiple steps or more careful reasoning.' },
  4: { label: 'LEVEL 4', desc: 'Challenging questions requiring several steps or less obvious applications.' },
  5: { label: 'LEVEL 5', desc: 'Very challenging questions requiring deeper reasoning and careful synthesis.' },
};

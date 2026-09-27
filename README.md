# Math Reviewer

A clean, static, single-page secondary mathematics reviewer and evaluation website inspired by retro educational computer programs.

## Key Features

- **No Gamification**: Strictly free of points, XP, coins, streaks, timers, student logins, or leaderboards. Focused entirely on mastery, reasoning, and conceptual understanding.
- **8 Core Mathematics Modules**:
  1. Position of Points and Transformations (translations, reflections across lines/axes, rotations about the origin, composite transformations)
  2. Law of Sines (missing sides, missing angles, third-angle derivation, ambiguous case SSA, applied word problems)
  3. Law of Cosines (SAS missing side, SSS missing angle, largest/smallest angle identification, triangle area, applied navigation)
  4. Quadratic Inequalities in One Variable (factoring, critical values, interval notation, special cases)
  5. Linear and Quadratic Inequalities in Two Variables (point testing, solid vs. dashed boundaries, shaded regions, systems)
  6. Absolute Value Equations and Inequalities in One Variable (equations, bounded conjunctions, disjoint union rays, negative RHS cases)
  7. Measures of Position (median, quartiles Q1/Q3, deciles, percentiles, percentile ranks)
  8. Interquartile Range and Outliers (IQR = Q3 - Q1, 1.5×IQR lower and upper fences, outlier detection, resistant vs. non-resistant metrics)
- **Practice Mode**:
  - Filter by any combination of the 8 topics
  - Filter by any combination of difficulty levels (Level 1 to Level 5)
  - Independent Random Topic and Random Difficulty toggles
  - Step-by-step mathematical explanations and key calculation breakdowns
- **Mock Test Mode**:
  - Configurable test length (5, 10, 15, 20, 25, 30, or custom 1–50)
  - Topic selection with balanced distribution
  - Independent random difficulty (Levels 1–5) per question without artificial ramp
  - Question jumper palette, navigate freely, change answers before submitting
  - Comprehensive post-test review with solutions for missed and correct problems
- **Retro Educational UI**: Clean off-white and charcoal theme, crisp borders, legible monospace typography, and interactive SVG diagrams (coordinate grids, triangles, number lines, 2D planes, boxplots).

---

## Deploying to GitHub Pages

This project is a 100% client-side Static Single Page Application (SPA). It requires no backend server, database, or API keys at runtime.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Navigate to your repository on GitHub.
2. Go to **Settings** > **Pages** (under the "Code and automation" section).
3. Under **Build and deployment > Source**, select **GitHub Actions**.

### Step 3: Access the Published Reviewer

Because `.github/workflows/deploy.yml` is already included in this repository and `vite.config.ts` uses relative asset bundling (`base: './'`), GitHub will automatically build and publish your application within 1–2 minutes at:

`https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`

import React from 'react';
import { TwoVarInequalityDiagramData } from '../../types/math';

interface Props {
  data: TwoVarInequalityDiagramData;
}

export const TwoVarInequalityDiagram: React.FC<Props> = ({ data }) => {
  const range = data.range || 7;
  const size = 280;
  const padding = 24;
  const innerSize = size - padding * 2;
  const scale = innerSize / (range * 2);
  const cx = size / 2;
  const cy = size / 2;

  const toSvgX = (x: number) => cx + x * scale;
  const toSvgY = (y: number) => cy - y * scale;

  // Linear boundary points
  let lineX1 = 0, lineY1 = 0, lineX2 = 0, lineY2 = 0;
  let shadePath = '';

  if (data.type === 'linear' && data.linear) {
    const { m = 1, b = 0, shadeRegion } = data.linear;
    // Calculate endpoints across range
    const xMin = -range;
    const xMax = range;
    const yAtMin = m * xMin + b;
    const yAtMax = m * xMax + b;

    lineX1 = toSvgX(xMin);
    lineY1 = toSvgY(yAtMin);
    lineX2 = toSvgX(xMax);
    lineY2 = toSvgY(yAtMax);

    // Shading polygon
    if (shadeRegion === 'above') {
      shadePath = `M ${lineX1},${lineY1} L ${lineX2},${lineY2} L ${toSvgX(range)},${toSvgY(range)} L ${toSvgX(-range)},${toSvgY(range)} Z`;
    } else {
      shadePath = `M ${lineX1},${lineY1} L ${lineX2},${lineY2} L ${toSvgX(range)},${toSvgY(-range)} L ${toSvgX(-range)},${toSvgY(-range)} Z`;
    }
  }

  // Quadratic boundary points
  const quadPoints: string[] = [];
  let quadShadePath = '';
  if (data.type === 'quadratic' && data.quadratic) {
    const { a, h, k, shadeInside } = data.quadratic;
    const step = 0.25;
    for (let x = -range; x <= range; x += step) {
      const y = a * Math.pow(x - h, 2) + k;
      if (y >= -range - 2 && y <= range + 2) {
        quadPoints.push(`${toSvgX(x)},${toSvgY(y)}`);
      }
    }

    if (shadeInside) {
      const topY = a > 0 ? toSvgY(range) : toSvgY(-range);
      if (quadPoints.length > 0) {
        quadShadePath = `M ${quadPoints[0]} ` + quadPoints.map(p => `L ${p}`).join(' ') + ` L ${toSvgX(range)},${topY} L ${toSvgX(-range)},${topY} Z`;
      }
    }
  }

  return (
    <div className="flex flex-col items-center my-3">
      <svg
        width={size}
        height={size}
        className="bg-[#fcfbf9] border border-[#3a3935] shadow-sm select-none"
        viewBox={`0 0 ${size} ${size}`}
      >
        <clipPath id="chart-area">
          <rect x={padding} y={padding} width={innerSize} height={innerSize} />
        </clipPath>

        {/* Shaded Region with clipping */}
        <g clipPath="url(#chart-area)">
          {data.type === 'linear' && shadePath && (
            <path d={shadePath} fill="#93c5fd" opacity="0.35" />
          )}
          {data.type === 'quadratic' && quadShadePath && (
            <path d={quadShadePath} fill="#93c5fd" opacity="0.35" />
          )}
        </g>

        {/* Grid lines */}
        {[-4, -2, 2, 4].map((val) => (
          <g key={val}>
            <line
              x1={toSvgX(val)}
              y1={padding}
              x2={toSvgX(val)}
              y2={size - padding}
              stroke="#e2e0d8"
              strokeWidth="1"
            />
            <line
              x1={padding}
              y1={toSvgY(val)}
              x2={size - padding}
              y2={toSvgY(val)}
              stroke="#e2e0d8"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Axes */}
        <line x1={padding} y1={cy} x2={size - padding} y2={cy} stroke="#2b2a27" strokeWidth="1.5" />
        <line x1={cx} y1={size - padding} x2={cx} y2={padding} stroke="#2b2a27" strokeWidth="1.5" />

        {/* Ticks and Labels */}
        {[-4, -2, 2, 4].map((val) => (
          <g key={`num-${val}`}>
            <text x={toSvgX(val)} y={cy + 13} fontSize="9" fill="#777" textAnchor="middle" fontFamily="monospace">{val}</text>
            <text x={cx - 5} y={toSvgY(val) + 3} fontSize="9" fill="#777" textAnchor="end" fontFamily="monospace">{val}</text>
          </g>
        ))}

        {/* Boundary Curve */}
        <g clipPath="url(#chart-area)">
          {data.type === 'linear' && data.linear && (
            <line
              x1={lineX1}
              y1={lineY1}
              x2={lineX2}
              y2={lineY2}
              stroke="#1e3a8a"
              strokeWidth="2"
              strokeDasharray={data.linear.solid ? undefined : '5 4'}
            />
          )}

          {data.type === 'quadratic' && quadPoints.length > 0 && data.quadratic && (
            <polyline
              points={quadPoints.join(' ')}
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="2"
              strokeDasharray={data.quadratic.solid ? undefined : '5 4'}
            />
          )}

          {/* Test points */}
          {data.testPoints?.map((pt, idx) => (
            <g key={idx}>
              <circle
                cx={toSvgX(pt.x)}
                cy={toSvgY(pt.y)}
                r="4.5"
                fill={pt.isInSolution ? '#16a34a' : '#dc2626'}
                stroke="#1c1b18"
                strokeWidth="1.5"
              />
              <text
                x={toSvgX(pt.x) + 7}
                y={toSvgY(pt.y) - 6}
                fontSize="10"
                fontWeight="bold"
                fill="#1c1b18"
                fontFamily="monospace"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <div className="text-[11px] text-[#555] font-mono mt-1 flex gap-3">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-200 border border-blue-400 inline-block"></span>
          Solution region
        </span>
        <span>
          {data.type === 'linear'
            ? data.linear?.solid ? 'Solid boundary (included)' : 'Dashed boundary (excluded)'
            : data.quadratic?.solid ? 'Solid parabola' : 'Dashed parabola'}
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { BoxplotDiagramData } from '../../types/math';

interface Props {
  data: BoxplotDiagramData;
}

export const BoxplotDiagram: React.FC<Props> = ({ data }) => {
  const width = 360;
  const height = 120;
  const padding = 34;

  const minAxis = data.dataMin;
  const maxAxis = data.dataMax;
  const span = Math.max(1, maxAxis - minAxis);

  const toSvgX = (val: number) => padding + ((val - minAxis) / span) * (width - padding * 2);

  const boxTop = 28;
  const boxHeight = 44;
  const boxMidY = boxTop + boxHeight / 2;
  const axisY = 96;

  // Generate 5-6 nice ticks across [minAxis, maxAxis]
  const tickStep = Math.max(1, Math.round((maxAxis - minAxis) / 5));
  const ticks: number[] = [];
  const startTick = Math.ceil(minAxis / tickStep) * tickStep;
  for (let t = startTick; t <= maxAxis; t += tickStep) {
    ticks.push(t);
  }

  return (
    <div className="flex flex-col items-center my-3">
      <svg
        width={width}
        height={height}
        className="bg-[#fcfbf9] border border-[#3a3935] shadow-sm select-none"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Axis line */}
        <line
          x1={padding}
          y1={axisY}
          x2={width - padding}
          y2={axisY}
          stroke="#2b2a27"
          strokeWidth="1.5"
        />

        {/* Ticks and values */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={toSvgX(t)} y1={axisY} x2={toSvgX(t)} y2={axisY + 4} stroke="#2b2a27" strokeWidth="1" />
            <text
              x={toSvgX(t)}
              y={axisY + 16}
              fontSize="9"
              fill="#555"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Left whisker */}
        <line
          x1={toSvgX(data.min)}
          y1={boxMidY}
          x2={toSvgX(data.q1)}
          y2={boxMidY}
          stroke="#2b2a27"
          strokeWidth="1.5"
        />
        <line
          x1={toSvgX(data.min)}
          y1={boxMidY - 10}
          x2={toSvgX(data.min)}
          y2={boxMidY + 10}
          stroke="#2b2a27"
          strokeWidth="1.5"
        />

        {/* Right whisker */}
        <line
          x1={toSvgX(data.q3)}
          y1={boxMidY}
          x2={toSvgX(data.max)}
          y2={boxMidY}
          stroke="#2b2a27"
          strokeWidth="1.5"
        />
        <line
          x1={toSvgX(data.max)}
          y1={boxMidY - 10}
          x2={toSvgX(data.max)}
          y2={boxMidY + 10}
          stroke="#2b2a27"
          strokeWidth="1.5"
        />

        {/* The IQR Box */}
        <rect
          x={toSvgX(data.q1)}
          y={boxTop}
          width={Math.max(2, toSvgX(data.q3) - toSvgX(data.q1))}
          height={boxHeight}
          fill="#e0e7ff"
          stroke="#1e3a8a"
          strokeWidth="1.8"
        />

        {/* Median line */}
        <line
          x1={toSvgX(data.median)}
          y1={boxTop}
          x2={toSvgX(data.median)}
          y2={boxTop + boxHeight}
          stroke="#b91c1c"
          strokeWidth="2.5"
        />

        {/* Outlier markers if present */}
        {data.outliers?.map((outlierVal, idx) => (
          <g key={idx}>
            <circle
              cx={toSvgX(outlierVal)}
              cy={boxMidY}
              r="4.5"
              fill="#dc2626"
              stroke="#7f1d1d"
              strokeWidth="1.5"
            />
            <text
              x={toSvgX(outlierVal)}
              y={boxMidY - 8}
              fontSize="10"
              fontWeight="bold"
              fill="#dc2626"
              textAnchor="middle"
              fontFamily="monospace"
            >
              ★ {outlierVal}
            </text>
          </g>
        ))}

        {/* Labels for Q1, Median, Q3 */}
        <text x={toSvgX(data.q1)} y={boxTop - 5} fontSize="9" fill="#1e3a8a" textAnchor="middle" fontFamily="monospace">
          Q₁:{data.q1}
        </text>
        <text x={toSvgX(data.median)} y={boxTop - 5} fontSize="9" fill="#b91c1c" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
          Med:{data.median}
        </text>
        <text x={toSvgX(data.q3)} y={boxTop - 5} fontSize="9" fill="#1e3a8a" textAnchor="middle" fontFamily="monospace">
          Q₃:{data.q3}
        </text>
      </svg>
      <div className="text-[11px] text-[#555] font-mono mt-1 flex gap-3">
        <span>Box = Middle 50% (IQR)</span>
        <span className="text-red-700 font-semibold">Red Line = Median</span>
        {data.outliers && data.outliers.length > 0 && <span className="text-red-600 font-semibold">★ = Outlier</span>}
      </div>
    </div>
  );
};

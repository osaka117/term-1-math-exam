import React from 'react';
import { NumberLineDiagramData } from '../../types/math';

interface Props {
  data: NumberLineDiagramData;
}

export const NumberLineDiagram: React.FC<Props> = ({ data }) => {
  const width = 360;
  const height = 90;
  const padding = 36;
  const cy = 42;

  const minVal = data.viewMin ?? Math.min(...data.criticalValues, -4) - 2;
  const maxVal = data.viewMax ?? Math.max(...data.criticalValues, 4) + 2;
  const span = Math.max(1, maxVal - minVal);

  const toSvgX = (val: number) => padding + ((val - minVal) / span) * (width - padding * 2);

  // Generate integer ticks
  const ticks: number[] = [];
  const start = Math.ceil(minVal);
  const end = Math.floor(maxVal);
  for (let t = start; t <= end; t++) {
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
        {/* Main Axis Line with Arrowheads */}
        <defs>
          <marker id="arrow-left" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 10 0 L 0 5 L 10 10 z" fill="#2b2a27" />
          </marker>
          <marker id="arrow-right" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2b2a27" />
          </marker>
        </defs>

        <line
          x1={padding - 12}
          y1={cy}
          x2={width - padding + 12}
          y2={cy}
          stroke="#2b2a27"
          strokeWidth="2"
          markerStart="url(#arrow-left)"
          markerEnd="url(#arrow-right)"
        />

        {/* Ticks and Labels */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={toSvgX(t)}
              y1={cy - 4}
              x2={toSvgX(t)}
              y2={cy + 4}
              stroke="#666560"
              strokeWidth="1.2"
            />
            <text
              x={toSvgX(t)}
              y={cy + 18}
              fontSize="10"
              fill="#44433e"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Shaded Solution Intervals */}
        {data.intervals.map((interval, idx) => {
          const x1 = interval.min === null ? padding - 10 : toSvgX(interval.min);
          const x2 = interval.max === null ? width - padding + 10 : toSvgX(interval.max);

          return (
            <g key={idx}>
              {/* Highlighted thick bar */}
              <line
                x1={x1}
                y1={cy}
                x2={x2}
                y2={cy}
                stroke="#2563eb"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Min endpoint circle */}
              {interval.min !== null && (
                <circle
                  cx={toSvgX(interval.min)}
                  cy={cy}
                  r="4.5"
                  fill={interval.includeMin ? '#2563eb' : '#ffffff'}
                  stroke="#1d4ed8"
                  strokeWidth="2"
                />
              )}

              {/* Max endpoint circle */}
              {interval.max !== null && (
                <circle
                  cx={toSvgX(interval.max)}
                  cy={cy}
                  r="4.5"
                  fill={interval.includeMax ? '#2563eb' : '#ffffff'}
                  stroke="#1d4ed8"
                  strokeWidth="2"
                />
              )}
            </g>
          );
        })}
      </svg>
      <div className="text-[11px] text-[#555] font-mono mt-1 flex gap-4">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-600 bg-blue-600 inline-block"></span>
          Included [ ]
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-600 bg-white inline-block"></span>
          Excluded ( )
        </span>
      </div>
    </div>
  );
};

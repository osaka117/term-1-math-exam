import React from 'react';
import { CoordinateDiagramData } from '../../types/math';

interface Props {
  data: CoordinateDiagramData;
}

export const CoordinateDiagram: React.FC<Props> = ({ data }) => {
  const range = data.range || 8;
  const size = 300;
  const padding = 28;
  const innerSize = size - padding * 2;
  const scale = innerSize / (range * 2);
  const cx = size / 2;
  const cy = size / 2;

  const toSvgX = (x: number) => cx + x * scale;
  const toSvgY = (y: number) => cy - y * scale;

  // Grid lines
  const gridTicks = [];
  for (let i = -range; i <= range; i += 2) {
    if (i !== 0) gridTicks.push(i);
  }

  return (
    <div className="flex flex-col items-center my-3">
      <svg
        width={size}
        height={size}
        className="bg-[#fcfbf9] border border-[#3a3935] shadow-sm select-none"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Subtle grid */}
        {gridTicks.map((val) => (
          <g key={`grid-${val}`}>
            <line
              x1={toSvgX(val)}
              y1={padding}
              x2={toSvgX(val)}
              y2={size - padding}
              stroke="#e5e3dc"
              strokeWidth="1"
            />
            <line
              x1={padding}
              y1={toSvgY(val)}
              x2={size - padding}
              y2={toSvgY(val)}
              stroke="#e5e3dc"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Axes */}
        <line
          x1={padding}
          y1={cy}
          x2={size - padding}
          y2={cy}
          stroke="#2b2a27"
          strokeWidth="1.5"
        />
        <line
          x1={cx}
          y1={size - padding}
          x2={cx}
          y2={padding}
          stroke="#2b2a27"
          strokeWidth="1.5"
        />

        {/* Axis Labels */}
        <text x={size - padding + 8} y={cy + 4} fontSize="11" fill="#44433e" fontFamily="monospace">x</text>
        <text x={cx - 4} y={padding - 6} fontSize="11" fill="#44433e" fontFamily="monospace">y</text>

        {/* Tick labels */}
        {gridTicks.map((val) => (
          <g key={`tick-${val}`}>
            <line x1={toSvgX(val)} y1={cy - 3} x2={toSvgX(val)} y2={cy + 3} stroke="#2b2a27" strokeWidth="1" />
            <text
              x={toSvgX(val)}
              y={cy + 13}
              fontSize="9"
              fill="#666560"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {val}
            </text>
            <line x1={cx - 3} y1={toSvgY(val)} x2={cx + 3} y2={toSvgY(val)} stroke="#2b2a27" strokeWidth="1" />
            <text
              x={cx - 7}
              y={toSvgY(val) + 3}
              fontSize="9"
              fill="#666560"
              textAnchor="end"
              fontFamily="monospace"
            >
              {val}
            </text>
          </g>
        ))}

        {/* Reflection line if any */}
        {data.reflectionLine === 'y=x' && (
          <line
            x1={toSvgX(-range)}
            y1={toSvgY(-range)}
            x2={toSvgX(range)}
            y2={toSvgY(range)}
            stroke="#9333ea"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}
        {data.reflectionLine === 'x-axis' && (
          <line
            x1={padding}
            y1={cy}
            x2={size - padding}
            y2={cy}
            stroke="#9333ea"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        )}
        {data.reflectionLine === 'y-axis' && (
          <line
            x1={cx}
            y1={padding}
            x2={cx}
            y2={size - padding}
            stroke="#9333ea"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        )}
        {typeof data.reflectionLine === 'object' && data.reflectionLine.m === Infinity && (
          <line
            x1={toSvgX(data.reflectionLine.b)}
            y1={padding}
            x2={toSvgX(data.reflectionLine.b)}
            y2={size - padding}
            stroke="#9333ea"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Preimage Point */}
        {data.preimage && (
          <g>
            <circle
              cx={toSvgX(data.preimage.x)}
              cy={toSvgY(data.preimage.y)}
              r="4.5"
              fill="#2563eb"
              stroke="#1e3a8a"
              strokeWidth="1.5"
            />
            <text
              x={toSvgX(data.preimage.x) + 7}
              y={toSvgY(data.preimage.y) - 6}
              fontSize="10"
              fontWeight="bold"
              fill="#1e3a8a"
              fontFamily="monospace"
            >
              {data.preimage.label || `(${data.preimage.x},${data.preimage.y})`}
            </text>
          </g>
        )}

        {/* Additional Points */}
        {data.points &&
          data.points.map((pt, idx) => (
            <g key={idx}>
              <circle
                cx={toSvgX(pt.x)}
                cy={toSvgY(pt.y)}
                r="4.5"
                fill={pt.color || '#16a34a'}
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

        {/* Image Point */}
        {data.image && (
          <g>
            {/* Arrow connecting preimage to image */}
            {data.preimage && (
              <line
                x1={toSvgX(data.preimage.x)}
                y1={toSvgY(data.preimage.y)}
                x2={toSvgX(data.image.x)}
                y2={toSvgY(data.image.y)}
                stroke="#6b7280"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
            )}
            <circle
              cx={toSvgX(data.image.x)}
              cy={toSvgY(data.image.y)}
              r="4.5"
              fill="#dc2626"
              stroke="#991b1b"
              strokeWidth="1.5"
            />
            <text
              x={toSvgX(data.image.x) + 7}
              y={toSvgY(data.image.y) - 6}
              fontSize="10"
              fontWeight="bold"
              fill="#991b1b"
              fontFamily="monospace"
            >
              {data.image.label || `P'(${data.image.x},${data.image.y})`}
            </text>
          </g>
        )}
      </svg>
      <div className="text-[11px] text-[#555] font-mono mt-1 flex gap-4">
        {data.preimage && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span> Preimage</span>}
        {data.image && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span> Image</span>}
        {data.reflectionLine && <span className="text-purple-700">Line of reflection</span>}
      </div>
    </div>
  );
};

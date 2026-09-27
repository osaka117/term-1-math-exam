import React from 'react';
import { TriangleDiagramData } from '../../types/math';

interface Props {
  data: TriangleDiagramData;
}

export const TriangleDiagram: React.FC<Props> = ({ data }) => {
  const width = 320;
  const height = 190;

  // Coordinate positions for triangle vertices
  // Acute or obtuse layout
  const isObtuse = data.triangleType === 'obtuse';
  const ax = 40;
  const ay = 150;

  const bx = 280;
  const by = 150;

  const cx = isObtuse ? 85 : 170;
  const cy = 35;

  return (
    <div className="flex flex-col items-center my-3">
      <svg
        width={width}
        height={height}
        className="bg-[#fcfbf9] border border-[#3a3935] shadow-sm select-none"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Triangle polygon */}
        <polygon
          points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
          fill="#f1f5f9"
          stroke="#1e293b"
          strokeWidth="2"
        />

        {/* Vertex markers and labels */}
        <circle cx={ax} cy={ay} r="3.5" fill="#1e293b" />
        <text
          x={ax - 18}
          y={ay + 18}
          fontSize="13"
          fontWeight="bold"
          fill="#0f172a"
          fontFamily="monospace"
        >
          {data.vertices.A}
        </text>

        <circle cx={bx} cy={by} r="3.5" fill="#1e293b" />
        <text
          x={bx + 10}
          y={by + 18}
          fontSize="13"
          fontWeight="bold"
          fill="#0f172a"
          fontFamily="monospace"
        >
          {data.vertices.B}
        </text>

        <circle cx={cx} cy={cy} r="3.5" fill="#1e293b" />
        <text
          x={cx}
          y={cy - 12}
          fontSize="13"
          fontWeight="bold"
          fill="#0f172a"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {data.vertices.C}
        </text>

        {/* Angles display */}
        {data.angles?.A && (
          <text
            x={ax + 24}
            y={ay - 12}
            fontSize="11"
            fill="#2563eb"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {data.angles.A}
          </text>
        )}
        {data.angles?.B && (
          <text
            x={bx - 48}
            y={by - 12}
            fontSize="11"
            fill="#2563eb"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {data.angles.B}
          </text>
        )}
        {data.angles?.C && (
          <text
            x={cx}
            y={cy + 24}
            fontSize="11"
            fill="#2563eb"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {data.angles.C}
          </text>
        )}

        {/* Side labels */}
        {/* Side c is opposite C, between A and B (bottom) */}
        {data.sides?.c && (
          <text
            x={(ax + bx) / 2}
            y={ay + 20}
            fontSize="11"
            fontWeight="600"
            fill="#b45309"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {data.sides.c}
          </text>
        )}

        {/* Side a is opposite A, between B and C (right edge) */}
        {data.sides?.a && (
          <text
            x={(bx + cx) / 2 + 18}
            y={(by + cy) / 2}
            fontSize="11"
            fontWeight="600"
            fill="#b45309"
            textAnchor="start"
            fontFamily="monospace"
          >
            {data.sides.a}
          </text>
        )}

        {/* Side b is opposite B, between A and C (left edge) */}
        {data.sides?.b && (
          <text
            x={(ax + cx) / 2 - 18}
            y={(ay + cy) / 2}
            fontSize="11"
            fontWeight="600"
            fill="#b45309"
            textAnchor="end"
            fontFamily="monospace"
          >
            {data.sides.b}
          </text>
        )}
      </svg>
      <span className="text-[11px] text-[#666] font-mono mt-1">
        Figure △ABC (not strictly to scale)
      </span>
    </div>
  );
};

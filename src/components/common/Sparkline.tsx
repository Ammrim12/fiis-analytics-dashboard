import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string; // 'emerald' | 'sky' | 'teal' | 'amber' | 'indigo' | hex
  fillOpacity?: number;
  strokeWidth?: number;
  showDot?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 90,
  height = 24,
  color = '#10B981',
  fillOpacity = 0.15,
  strokeWidth = 1.75,
  showDot = true,
  className = '',
}) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="opacity-20 bg-slate-800 rounded" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const paddingY = 3;
  const usableHeight = height - paddingY * 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 6) + 3;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    // Curva bezier suave
    const prev = points[idx - 1];
    const cpx = (prev.x + curr.x) / 2;
    return `${acc} C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  // Caminho fechado para preenchimento de gradiente
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const fillD = `${pathD} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;

  const gradientId = `spark-grad-${Math.random().toString(36).substring(2, 9)}`;

  // Determine actual color hex
  let strokeHex = color;
  if (color === 'emerald') strokeHex = '#10B981';
  if (color === 'sky') strokeHex = '#38BDF8';
  if (color === 'teal') strokeHex = '#14B8A6';
  if (color === 'amber') strokeHex = '#F59E0B';
  if (color === 'indigo') strokeHex = '#6366F1';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeHex} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={strokeHex} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Área preenchida */}
      <path d={fillD} fill={`url(#${gradientId})`} />

      {/* Linha da curva */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeHex}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ponto indicador no valor mais recente */}
      {showDot && (
        <>
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r={3}
            fill={strokeHex}
            className="animate-pulse"
          />
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r={1.5}
            fill="#FFFFFF"
          />
        </>
      )}
    </svg>
  );
};


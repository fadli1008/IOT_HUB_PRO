import React from 'react';
import { WidgetConfig } from '../../types/dashboard';
import { useTelemetry } from '../../context/TelemetryContext';
import { formatTelemetryValue } from '../../utils/formatters';

interface GaugeWidgetProps {
  config: WidgetConfig;
}

export const GaugeWidget: React.FC<GaugeWidgetProps> = ({ config }) => {
  const { telemetry } = useTelemetry();
  const rawValue = telemetry[config.deviceId]?.[config.pin] ?? 0;
  const numValue = typeof rawValue === 'number' ? rawValue : parseFloat(rawValue) || 0;
  
  const min = config.min ?? 0;
  const max = config.max ?? 100;
  const clamped = Math.min(Math.max(numValue, min), max);
  const percentage = (clamped - min) / (max - min || 1);

  // SVG Gauge calculations (-120 deg to +120 deg)
  const startAngle = -135;
  const endAngle = 135;
  const totalAngle = endAngle - startAngle;
  const currentAngle = startAngle + percentage * totalAngle;

  const radius = 70;
  const cx = 100;
  const cy = 95;

  // Determine threshold color
  let arcColor = config.accentColor || '#06b6d4';
  if (config.thresholds?.criticalValue && numValue >= config.thresholds.criticalValue) {
    arcColor = '#ef4444'; // Red alert
  } else if (config.thresholds?.warningValue && numValue >= config.thresholds.warningValue) {
    arcColor = '#f59e0b'; // Amber warning
  }

  // Polar to Cartesian conversion
  const polarToCartesian = (centerX: number, centerY: number, rad: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + rad * Math.cos(angleInRadians),
      y: centerY + rad * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, rad: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, rad, endA);
    const end = polarToCartesian(x, y, rad, startA);
    const largeArcFlag = endA - startA <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', rad, rad, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const bgArc = describeArc(cx, cy, radius, startAngle, endAngle);
  const valueArc = describeArc(cx, cy, radius, startAngle, Math.max(currentAngle, startAngle + 1));

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-2">
      <div className="relative w-full max-w-[210px] aspect-[1.15/1]">
        <svg viewBox="0 0 200 170" className="w-full h-full drop-shadow-md">
          {/* Background Arc */}
          <path
            d={bgArc}
            fill="none"
            stroke="#1F2937"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Value Arc */}
          <path
            d={valueArc}
            fill="none"
            stroke={arcColor}
            strokeWidth="14"
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />

          {/* Needle Center Hub */}
          <circle cx={cx} cy={cy} r="6" fill="#374151" stroke="#4B5563" strokeWidth="2" />

          {/* Needle Pointer */}
          <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`} className="transition-transform duration-500 ease-out">
            <line x1={cx} y1={cy} x2={cx} y2={cy - radius + 15} stroke="#F3F4F6" strokeWidth="3" strokeLinecap="round" />
            <polygon points={`${cx - 3},${cy} ${cx + 3},${cy} ${cx},${cy - radius + 10}`} fill="#F3F4F6" />
          </g>

          {/* Min and Max Labels */}
          <text x="35" y="155" fill="#6B7280" fontSize="11" textAnchor="middle" className="font-mono">{min}</text>
          <text x="165" y="155" fill="#6B7280" fontSize="11" textAnchor="middle" className="font-mono">{max}</text>
        </svg>

        {/* Numeric Readout in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 pointer-events-none">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-heading tracking-tight text-white drop-shadow">
              {formatTelemetryValue(numValue, config.formula, config.decimalPlaces ?? 1)}
            </span>
            {config.unit && (
              <span className="text-xs font-semibold text-gray-400 font-mono">
                {config.unit}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

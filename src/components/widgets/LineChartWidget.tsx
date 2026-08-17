import React from 'react';
import { WidgetConfig } from '../../types/dashboard';
import { useTelemetry } from '../../context/TelemetryContext';

interface LineChartWidgetProps {
  config: WidgetConfig;
}

export const LineChartWidget: React.FC<LineChartWidgetProps> = ({ config }) => {
  const { history, telemetry } = useTelemetry();
  const rawData = history[config.deviceId]?.[config.pin] || [];
  const secondaryData = config.secondaryPin ? (history[config.deviceId]?.[config.secondaryPin] || []) : [];

  const currentValue = telemetry[config.deviceId]?.[config.pin] ?? '--';
  const secondaryValue = config.secondaryPin ? (telemetry[config.deviceId]?.[config.secondaryPin] ?? '--') : null;

  // Compute SVG polyline / path coordinates
  const width = 500;
  const height = 140;
  const padding = 20;

  const points1 = rawData.slice(-25);
  const values1 = points1.map(p => p.value);

  const minVal = values1.length ? Math.min(...values1) * 0.9 : 0;
  const maxVal = values1.length ? Math.max(...values1) * 1.1 : 100;
  const range = maxVal - minVal || 1;

  const getCoordinates = (data: Array<{ timestamp: number; value: number }>) => {
    if (data.length < 2) return '';
    return data.map((p, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((p.value - minVal) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
  };

  const polylineStr1 = getCoordinates(points1);
  const polylineStr2 = secondaryData.length ? getCoordinates(secondaryData.slice(-25)) : '';

  // Area path
  let areaPath = '';
  if (points1.length >= 2) {
    const coords = points1.map((p, i) => {
      const x = padding + (i / (points1.length - 1)) * (width - padding * 2);
      const y = height - padding - ((p.value - minVal) / range) * (height - padding * 2);
      return `${x},${y}`;
    });
    const firstX = coords[0].split(',')[0];
    const lastX = coords[coords.length - 1].split(',')[0];
    const bottomY = height - padding;
    areaPath = `M ${firstX},${bottomY} L ${coords.join(' L ')} L ${lastX},${bottomY} Z`;
  }

  const primaryColor = config.accentColor || '#06b6d4';
  const secondaryColor = '#f59e0b';

  return (
    <div className="flex flex-col h-full w-full p-2 justify-between">
      {/* Metrics Header */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-baseline space-x-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span className="text-xs font-mono text-gray-400">{config.pin}:</span>
            <span className="text-xl font-bold font-heading text-white font-mono">{currentValue}</span>
          </div>
          {secondaryValue !== null && (
            <div className="flex items-center space-x-1.5 ml-4">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
              <span className="text-xs font-mono text-gray-400">{config.secondaryPin}:</span>
              <span className="text-xl font-bold font-heading text-white font-mono">{secondaryValue}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-mono">
          <span className="bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700">Live (1s)</span>
          <span>Min: {minVal.toFixed(1)}</span>
          <span>Max: {maxVal.toFixed(1)}</span>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="w-full flex-1 relative overflow-hidden flex items-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`chart-grad-${config.pin}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1F2937" strokeDasharray="4 4" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1F2937" strokeDasharray="4 4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1F2937" />

          {/* Area under curve */}
          {areaPath && (
            <path d={areaPath} fill={`url(#chart-grad-${config.pin})`} />
          )}

          {/* Primary Line */}
          {polylineStr1 && (
            <polyline
              fill="none"
              stroke={primaryColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylineStr1}
            />
          )}

          {/* Secondary Line */}
          {polylineStr2 && (
            <polyline
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeDasharray="3 3"
              strokeLinecap="round"
              points={polylineStr2}
            />
          )}

          {/* Latest Point Indicator */}
          {points1.length > 0 && (
            <circle
              cx={width - padding}
              cy={height - padding - ((points1[points1.length - 1].value - minVal) / range) * (height - padding * 2)}
              r="4.5"
              fill={primaryColor}
              stroke="#0B0F19"
              strokeWidth="2"
              className="animate-pulse"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

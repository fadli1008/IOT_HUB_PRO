import React from 'react';
import { WidgetConfig } from '../../types/dashboard';
import { useTelemetry } from '../../context/TelemetryContext';
import { formatTelemetryValue } from '../../utils/formatters';
import { TrendingUp, Activity, Gauge, Flame, Droplets, Zap } from 'lucide-react';

interface MetricWidgetProps {
  config: WidgetConfig;
}

export const MetricWidget: React.FC<MetricWidgetProps> = ({ config }) => {
  const { telemetry } = useTelemetry();
  const rawValue = telemetry[config.deviceId]?.[config.pin] ?? 0;
  const numValue = typeof rawValue === 'number' ? rawValue : parseFloat(rawValue) || 0;

  const formatted = formatTelemetryValue(numValue, config.formula, config.decimalPlaces ?? 1);

  return (
    <div className="flex flex-col h-full w-full justify-between p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-gray-400">Target Pin: {config.pin}</span>
        <span className="flex items-center text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <TrendingUp className="w-3 h-3 mr-1" /> +2.4%
        </span>
      </div>

      <div className="flex items-baseline space-x-2 my-auto">
        <span className="text-3xl font-extrabold font-heading text-white tracking-tight drop-shadow">
          {formatted}
        </span>
        {config.unit && (
          <span className="text-sm font-bold text-brand-400 font-mono">
            {config.unit}
          </span>
        )}
      </div>

      <div className="w-full bg-gray-800/60 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(Math.max((numValue / (config.max || 100)) * 100, 5), 100)}%`,
            backgroundColor: config.accentColor || '#06b6d4'
          }}
        />
      </div>
    </div>
  );
};

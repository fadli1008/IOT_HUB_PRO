import React from 'react';
import { WidgetConfig } from '../../types/dashboard';
import { useTelemetry } from '../../context/TelemetryContext';

interface TankWidgetProps {
  config: WidgetConfig;
}

export const TankWidget: React.FC<TankWidgetProps> = ({ config }) => {
  const { telemetry } = useTelemetry();
  const rawValue = telemetry[config.deviceId]?.[config.pin] ?? 0;
  const numValue = typeof rawValue === 'number' ? rawValue : parseFloat(rawValue) || 0;

  const min = config.min ?? 0;
  const max = config.max ?? 20;
  const percentage = Math.min(Math.max(((numValue - min) / (max - min || 1)) * 100, 0), 100);

  const accent = config.accentColor || '#3b82f6';

  return (
    <div className="flex items-center justify-around h-full w-full p-2">
      {/* Cylindrical Liquid Tank Visual */}
      <div className="relative w-20 h-32 rounded-2xl border-2 border-gray-700 bg-gray-900/90 overflow-hidden shadow-inner flex flex-col justify-end">
        {/* Tick Marks */}
        <div className="absolute right-1 top-2 bottom-2 flex flex-col justify-between text-[8px] font-mono text-gray-500 pointer-events-none z-10">
          <span>{max}</span>
          <span>{((max + min) / 2).toFixed(0)}</span>
          <span>{min}</span>
        </div>

        {/* Liquid Fill */}
        <div
          className="w-full transition-all duration-700 ease-out relative"
          style={{
            height: `${percentage}%`,
            background: `linear-gradient(to top, ${accent}, #60a5fa)`
          }}
        >
          {/* Wave effect at the top of liquid */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/30" />
        </div>

        {/* Glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Numerical Stats */}
      <div className="flex flex-col space-y-1">
        <div className="text-xs text-gray-400 font-mono">Fill Level</div>
        <div className="text-2xl font-bold font-heading text-white">
          {percentage.toFixed(0)}%
        </div>
        <div className="text-xs font-mono text-cyan-400 font-bold">
          {numValue.toFixed(1)} {config.unit || 'bar'}
        </div>
        <div className="text-[10px] text-gray-500 font-mono">
          Capacity: {max} {config.unit}
        </div>
      </div>
    </div>
  );
};

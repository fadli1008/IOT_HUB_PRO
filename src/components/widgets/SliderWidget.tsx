import React, { useState, useEffect } from 'react';
import { WidgetConfig } from '../../types/dashboard';
import { useTelemetry } from '../../context/TelemetryContext';
import { Sliders, Zap } from 'lucide-react';

interface SliderWidgetProps {
  config: WidgetConfig;
}

export const SliderWidget: React.FC<SliderWidgetProps> = ({ config }) => {
  const { telemetry, sendCommand } = useTelemetry();
  const remoteValue = telemetry[config.deviceId]?.[config.pin] ?? config.min ?? 0;
  const [localVal, setLocalVal] = useState<number>(Number(remoteValue));

  useEffect(() => {
    setLocalVal(Number(remoteValue));
  }, [remoteValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLocalVal(val);
    sendCommand(config.deviceId, config.pin, val);
  };

  const min = config.min ?? 0;
  const max = config.max ?? 100;
  const step = config.step ?? 1;
  const percentage = ((localVal - min) / (max - min || 1)) * 100;

  return (
    <div className="flex flex-col h-full w-full justify-between p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono text-gray-400">Pin {config.pin} (PWM)</span>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-xl font-bold font-mono text-white">{localVal}</span>
          {config.unit && <span className="text-xs text-gray-400 font-mono">{config.unit}</span>}
        </div>
      </div>

      {/* Custom Slider Bar */}
      <div className="w-full py-2">
        <div className="relative flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localVal}
            onChange={handleChange}
            className="w-full h-2.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-500 focus:outline-none"
            style={{
              background: `linear-gradient(to right, ${config.accentColor || '#06b6d4'} 0%, ${config.accentColor || '#06b6d4'} ${percentage}%, #1F2937 ${percentage}%, #1F2937 100%)`
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
          <span>{min}{config.unit}</span>
          <span>{max}{config.unit}</span>
        </div>
      </div>
    </div>
  );
};

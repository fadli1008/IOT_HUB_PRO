import React, { useState } from 'react';
import { WidgetConfig } from '../../types/dashboard';
import { useTelemetry } from '../../context/TelemetryContext';
import { Palette } from 'lucide-react';

interface ColorPickerWidgetProps {
  config: WidgetConfig;
}

const PRESET_COLORS = [
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#ef4444', '#f59e0b', '#10b981', '#ffffff'
];

export const ColorPickerWidget: React.FC<ColorPickerWidgetProps> = ({ config }) => {
  const { telemetry, sendCommand } = useTelemetry();
  const rawColor = telemetry[config.deviceId]?.[config.pin] || '#06b6d4';
  const [currentColor, setCurrentColor] = useState<string>(rawColor);

  const handleColorSelect = (hex: string) => {
    setCurrentColor(hex);
    sendCommand(config.deviceId, config.pin, hex);
  };

  return (
    <div className="flex flex-col h-full w-full justify-between p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div
            className="w-5 h-5 rounded-full border border-white/20 transition-all"
            style={{ backgroundColor: currentColor, boxShadow: `0 0 10px ${currentColor}80` }}
          />
          <span className="text-xs font-mono text-gray-300 uppercase">{currentColor}</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">Pin {config.pin} (RGB)</span>
      </div>

      {/* Preset Swatches */}
      <div className="grid grid-cols-4 gap-2 py-1">
        {PRESET_COLORS.map(color => (
          <button
            key={color}
            onClick={() => handleColorSelect(color)}
            className={`h-6 rounded-lg transition-transform hover:scale-110 border ${
              currentColor.toLowerCase() === color.toLowerCase() ? 'border-white ring-2 ring-white/50' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

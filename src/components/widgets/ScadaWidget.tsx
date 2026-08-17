import React from 'react';
import { WidgetConfig } from '../../types/dashboard';
import { useTelemetry } from '../../context/TelemetryContext';
import { Flame, Activity, Zap, Play, Square } from 'lucide-react';

interface ScadaWidgetProps {
  config: WidgetConfig;
}

export const ScadaWidget: React.FC<ScadaWidgetProps> = ({ config }) => {
  const { telemetry, sendCommand } = useTelemetry();

  const coreTemp = telemetry[config.deviceId]?.['V0'] ?? 78.5;
  const flowRate = telemetry[config.deviceId]?.['V1'] ?? 42.0;
  const isPumpActive = Boolean(telemetry[config.deviceId]?.['V2'] ?? 1);
  const isHeaterActive = Boolean(telemetry[config.deviceId]?.['V3'] ?? 1);
  const steamPressure = telemetry[config.deviceId]?.['V4'] ?? 4.8;

  const togglePump = () => {
    sendCommand(config.deviceId, 'V2', isPumpActive ? 0 : 1);
  };

  const toggleHeater = () => {
    sendCommand(config.deviceId, 'V3', isHeaterActive ? 0 : 1);
  };

  return (
    <div className="flex flex-col h-full w-full p-3 justify-between">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-gray-200 uppercase font-mono">
            HMI SCADA: Plant Section A-1
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-gray-400">Pressure: <strong className="text-cyan-400">{steamPressure} bar</strong></span>
          <span className="text-gray-400">Flow: <strong className="text-emerald-400">{flowRate} L/m</strong></span>
        </div>
      </div>

      {/* SVG Industrial Schematic Canvas */}
      <div className="w-full flex-1 relative flex items-center justify-center my-2">
        <svg viewBox="0 0 700 280" className="w-full h-full max-h-[260px] drop-shadow-lg">
          {/* Main Boiler Vessel */}
          <rect x="50" y="40" width="160" height="200" rx="30" fill="#111827" stroke="#374151" strokeWidth="4" />
          <text x="130" y="70" fill="#9CA3AF" fontSize="12" fontWeight="bold" textAnchor="middle" className="font-mono">
            BOILER CORE
          </text>
          
          {/* Fire / Temperature Status inside Vessel */}
          <circle cx="130" cy="140" r="45" fill={isHeaterActive ? '#ef444420' : '#37415120'} stroke={isHeaterActive ? '#ef4444' : '#4B5563'} strokeWidth="2" />
          <text x="130" y="135" fill="#F3F4F6" fontSize="18" fontWeight="bold" textAnchor="middle" className="font-heading">
            {coreTemp}°C
          </text>
          <text x="130" y="155" fill={isHeaterActive ? '#ef4444' : '#6B7280'} fontSize="10" textAnchor="middle" className="font-mono">
            {isHeaterActive ? '🔥 HEATER ACTIVE' : 'STANDBY'}
          </text>

          {/* Steam Output Pipe (Top) */}
          <path
            d="M 130,40 L 130,20 L 350,20 L 350,60"
            fill="none"
            stroke={isPumpActive ? '#06b6d4' : '#374151'}
            strokeWidth="8"
            className={isPumpActive ? 'scada-pipe-active' : ''}
          />
          <text x="240" y="14" fill="#06b6d4" fontSize="10" fontStyle="italic" className="font-mono">High Steam 4.8 bar</text>

          {/* Heat Exchanger Unit (Middle) */}
          <rect x="290" y="60" width="120" height="150" rx="12" fill="#182234" stroke="#0e7490" strokeWidth="3" />
          <text x="350" y="85" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" className="font-mono">
            HEAT EXCHANGER
          </text>
          {/* Coil internal */}
          <path d="M 310,110 Q 350,90 390,110 T 310,140 T 390,170" fill="none" stroke="#0284c7" strokeWidth="3" />

          {/* Return Coolant Pipe */}
          <path
            d="M 350,210 L 350,250 L 520,250 L 520,130"
            fill="none"
            stroke={isPumpActive ? '#10b981' : '#374151'}
            strokeWidth="8"
            className={isPumpActive ? 'scada-pipe-active' : ''}
          />

          {/* Primary Motor Circulation Pump */}
          <circle cx="520" cy="130" r="35" fill="#111827" stroke={isPumpActive ? '#10b981' : '#4B5563'} strokeWidth="4" />
          <text x="520" y="125" fill="#E5E7EB" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">
            PUMP M-1
          </text>
          <text x="520" y="142" fill={isPumpActive ? '#10b981' : '#6B7280'} fontSize="9" textAnchor="middle" className="font-mono">
            {isPumpActive ? 'RUNNING' : 'STOPPED'}
          </text>

          {/* Return Line back to Boiler */}
          <path
            d="M 520,95 L 520,60 L 210,60"
            fill="none"
            stroke={isPumpActive ? '#10b981' : '#374151'}
            strokeWidth="8"
            className={isPumpActive ? 'scada-pipe-active' : ''}
          />
        </svg>
      </div>

      {/* Manual Actuation Bar */}
      <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-800/80">
        <button
          onClick={togglePump}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
            isPumpActive
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {isPumpActive ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>PUMP M-1: {isPumpActive ? 'STOP' : 'START'}</span>
        </button>

        <button
          onClick={toggleHeater}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
            isHeaterActive
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>HEATER: {isHeaterActive ? 'OFF' : 'ON'}</span>
        </button>
      </div>
    </div>
  );
};

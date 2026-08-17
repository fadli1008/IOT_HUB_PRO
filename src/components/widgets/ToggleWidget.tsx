import React, { useState } from 'react';
import { WidgetConfig } from '../../types/dashboard';
import { useTelemetry } from '../../context/TelemetryContext';
import { Power, CheckCircle, AlertTriangle } from 'lucide-react';

interface ToggleWidgetProps {
  config: WidgetConfig;
}

export const ToggleWidget: React.FC<ToggleWidgetProps> = ({ config }) => {
  const { telemetry, sendCommand } = useTelemetry();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPin, setPendingPin] = useState<string | null>(null);

  const state1 = Boolean(telemetry[config.deviceId]?.[config.pin]);
  const state2 = config.secondaryPin ? Boolean(telemetry[config.deviceId]?.[config.secondaryPin]) : null;

  const handleToggle = (pin: string, currentState: boolean) => {
    if (config.confirmBeforeExecute) {
      setPendingPin(pin);
      setShowConfirm(true);
    } else {
      sendCommand(config.deviceId, pin, currentState ? 0 : 1);
    }
  };

  const confirmExecution = () => {
    if (pendingPin) {
      const currentState = Boolean(telemetry[config.deviceId]?.[pendingPin]);
      sendCommand(config.deviceId, pendingPin, currentState ? 0 : 1);
      setShowConfirm(false);
      setPendingPin(null);
    }
  };

  const accent = config.accentColor || '#10b981';

  return (
    <div className="flex flex-col h-full w-full justify-center p-3 relative">
      {/* Confirmation Modal Overlay */}
      {showConfirm && (
        <div className="absolute inset-0 z-20 bg-gray-950/90 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-6 h-6 text-amber-400 mb-1 animate-bounce" />
          <p className="text-xs font-semibold text-white mb-2">Confirm Safety Override?</p>
          <div className="flex space-x-2">
            <button
              onClick={confirmExecution}
              className="px-3 py-1 bg-brand-500 hover:bg-brand-600 text-black text-xs font-bold rounded-lg transition"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 w-full">
        {/* Primary Switch */}
        <div className="flex items-center justify-between bg-gray-800/40 p-2.5 rounded-xl border border-gray-700/50 hover:border-gray-600 transition">
          <div className="flex items-center space-x-2.5">
            <div
              className={`p-2 rounded-lg transition-colors ${
                state1 ? 'bg-emerald-500/20 text-emerald-400 glow-green' : 'bg-gray-800 text-gray-500'
              }`}
            >
              <Power className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-200">{config.pin} Relay</div>
              <div className="text-[10px] text-gray-400 font-mono">
                {state1 ? 'STATUS: ENERGIZED' : 'STATUS: DE-ENERGIZED'}
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => handleToggle(config.pin, state1)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
              state1 ? 'bg-emerald-500' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                state1 ? 'translate-x-8 shadow-md' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Secondary Switch (Optional) */}
        {config.secondaryPin && (
          <div className="flex items-center justify-between bg-gray-800/40 p-2.5 rounded-xl border border-gray-700/50 hover:border-gray-600 transition">
            <div className="flex items-center space-x-2.5">
              <div
                className={`p-2 rounded-lg transition-colors ${
                  state2 ? 'bg-cyan-500/20 text-cyan-400 glow-cyan' : 'bg-gray-800 text-gray-500'
                }`}
              >
                <Power className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-200">{config.secondaryPin} Pump Aux</div>
                <div className="text-[10px] text-gray-400 font-mono">
                  {state2 ? 'STATUS: RUNNING' : 'STATUS: STOPPED'}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleToggle(config.secondaryPin!, Boolean(state2))}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                state2 ? 'bg-cyan-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  state2 ? 'translate-x-8 shadow-md' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Device } from '../../types/device';
import { useDevices } from '../../context/DeviceContext';
import { useTelemetry } from '../../context/TelemetryContext';
import { X, RefreshCw, Layers, CheckCircle, ArrowRight, Zap } from 'lucide-react';

interface DeviceShadowModalProps {
  device: Device;
  onClose: () => void;
}

export const DeviceShadowModal: React.FC<DeviceShadowModalProps> = ({ device, onClose }) => {
  const { updateDeviceShadowDesired } = useDevices();
  const { sendCommand } = useTelemetry();
  const [desiredJson, setDesiredJson] = useState(JSON.stringify(device.shadow.desired, null, 2));
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveDesired = () => {
    try {
      const parsed = JSON.parse(desiredJson);
      updateDeviceShadowDesired(device.id, parsed);

      // Send MQTT delta commands for modified keys
      Object.entries(parsed).forEach(([key, val]) => {
        sendCommand(device.id, key, val);
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      alert('Invalid JSON formatting');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold font-heading text-white">{device.name}</h3>
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                  Digital Twin Shadow
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Version #{device.shadow.version} • Token: {device.token.substring(0, 16)}...</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shadow Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 flex-1 overflow-y-auto">
          {/* Desired State (Cloud Target) */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-cyan-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>DESIRED STATE (Cloud)</span>
              </span>
              <span className="text-[10px] text-gray-500">Editable Target State</span>
            </div>
            <textarea
              value={desiredJson}
              onChange={e => setDesiredJson(e.target.value)}
              rows={9}
              className="w-full font-mono text-xs bg-gray-950 border border-gray-800 rounded-xl p-3 text-cyan-300 focus:border-brand-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Reported State (Hardware Actual) */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-emerald-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>REPORTED STATE (Device)</span>
              </span>
              <span className="text-[10px] text-gray-500">Actual Hardware Values</span>
            </div>
            <pre className="w-full flex-1 font-mono text-xs bg-gray-950 border border-gray-800 rounded-xl p-3 text-emerald-300 overflow-y-auto leading-relaxed">
              {JSON.stringify(device.shadow.reported, null, 2)}
            </pre>
          </div>
        </div>

        {/* Delta Sync Explanation & Save Button */}
        <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-gray-400">
            When hardware reconnects, IoT Hub automatically dispatches delta diff to synchronize actuators.
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {saveSuccess && (
              <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Updated!</span>
              </span>
            )}
            <button
              onClick={handleSaveDesired}
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition flex items-center justify-center space-x-1.5 w-full sm:w-auto"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Push Desired Delta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

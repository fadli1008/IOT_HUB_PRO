import React from 'react';
import { useDevices } from '../../context/DeviceContext';
import { useTelemetry } from '../../context/TelemetryContext';
import { Play, Square, Cpu, Zap, Activity, Thermometer, Droplets, Gauge } from 'lucide-react';

export const VirtualDeviceSimulator: React.FC = () => {
  const { devices, updateDatastream } = useDevices();
  const {
    telemetry,
    isSimulatorRunning,
    setIsSimulatorRunning,
    simulatorIntervalMs,
    setSimulatorIntervalMs,
    sendCommand
  } = useTelemetry();

  const handleManualSensorChange = (deviceId: string, pin: string, value: number) => {
    updateDatastream(deviceId, pin, value);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0B0F19] p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-heading text-white">Virtual Hardware Simulator</h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-brand-500/20 text-brand-400 px-2.5 py-0.5 rounded-full border border-brand-500/30">
              Live Mock Engine
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Test and simulate sensor fluctuations and relay responses without requiring physical microcontrollers
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-3 bg-gray-900 border border-gray-800 p-2 rounded-2xl">
          <button
            onClick={() => setIsSimulatorRunning(!isSimulatorRunning)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition shadow-md ${
              isSimulatorRunning
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {isSimulatorRunning ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isSimulatorRunning ? 'SIMULATOR ACTIVE' : 'PAUSED'}</span>
          </button>

          <div className="flex items-center space-x-2 text-xs font-mono text-gray-400 pr-2">
            <span>Interval:</span>
            <select
              value={simulatorIntervalMs}
              onChange={e => setSimulatorIntervalMs(Number(e.target.value))}
              className="bg-gray-950 border border-gray-700 text-xs rounded-lg px-2 py-1 text-white focus:outline-none"
            >
              <option value={1000}>1.0s (Fast)</option>
              <option value={2000}>2.0s (Normal)</option>
              <option value={5000}>5.0s (Slow)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Simulated Hardware Boards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {devices.map(device => {
          const isBoiler = device.id.includes('boiler');
          const isAgri = device.id.includes('agri');

          return (
            <div
              key={device.id}
              className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              {/* Virtual Circuit Board Accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Board Header */}
              <div className="flex items-start justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gray-950 text-cyan-400 border border-cyan-500/30 rounded-2xl shadow-inner font-mono font-bold text-xs">
                    MCU: {device.platform.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-heading text-white">{device.name}</h3>
                    <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                      IP: {device.ipAddress || '192.168.1.100'} • Token: {device.token.substring(0, 14)}...
                    </div>
                  </div>
                </div>

                <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>TRANSMITTING</span>
                </span>
              </div>

              {/* Sensor Controls / Sliders (Hardware Simulation) */}
              <div className="space-y-4">
                <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wide">
                  Virtual Physical Sensors & Actuators
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {device.datastreams.map(ds => {
                    const currentVal = telemetry[device.id]?.[ds.pin] ?? ds.defaultValue ?? 0;
                    const isBoolean = ds.type === 'boolean';

                    return (
                      <div
                        key={ds.pin}
                        className="bg-gray-950/70 p-3.5 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-brand-400 font-bold">{ds.pin}: {ds.name}</span>
                          <span className="font-mono text-white font-bold bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                            {isBoolean ? (currentVal ? 'ON (1)' : 'OFF (0)') : `${currentVal} ${ds.unit || ''}`}
                          </span>
                        </div>

                        {/* Control interface based on type */}
                        {isBoolean ? (
                          <button
                            onClick={() => sendCommand(device.id, ds.pin, currentVal ? 0 : 1)}
                            className={`w-full py-1.5 rounded-xl text-xs font-bold font-mono transition border ${
                              currentVal
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 glow-green'
                                : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                            }`}
                          >
                            {currentVal ? 'LED / RELAY ON' : 'LED / RELAY OFF'}
                          </button>
                        ) : (
                          <input
                            type="range"
                            min={ds.min ?? 0}
                            max={ds.max ?? 100}
                            value={Number(currentVal)}
                            onChange={e => handleManualSensorChange(device.id, ds.pin, Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hardware Diagnostic Status Footer */}
              <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>Free Heap: 182 KB</span>
                <span>Uptime: 4d 12h 30m</span>
                <span className="text-cyan-400">Firmware: {device.firmwareVersion}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

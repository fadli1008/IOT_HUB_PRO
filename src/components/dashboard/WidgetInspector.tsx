import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useDevices } from '../../context/DeviceContext';
import {
  X,
  Sliders,
  Database,
  Palette,
  ShieldAlert,
  Calculator,
  Trash2,
  Copy
} from 'lucide-react';

export const WidgetInspector: React.FC = () => {
  const { selectedWidget, setSelectedWidget, updateWidgetConfig, deleteWidget, duplicateWidget } = useDashboard();
  const { devices } = useDevices();

  if (!selectedWidget) return null;

  const { config, id, type } = selectedWidget;
  const targetDevice = devices.find(d => d.id === config.deviceId) || devices[0];

  const handleConfigChange = (key: string, value: any) => {
    updateWidgetConfig(id, { [key]: value });
  };

  const handleThresholdChange = (key: string, value: any) => {
    updateWidgetConfig(id, {
      thresholds: {
        ...(config.thresholds || {}),
        [key]: value
      }
    });
  };

  const COLOR_PALETTES = [
    { name: 'Cyan Neon', hex: '#06b6d4' },
    { name: 'Electric Blue', hex: '#3b82f6' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber Warning', hex: '#f59e0b' },
    { name: 'Crimson Alert', hex: '#ef4444' },
    { name: 'Purple Cyber', hex: '#8b5cf6' },
    { name: 'Hot Pink', hex: '#ec4899' },
    { name: 'Pure White', hex: '#ffffff' }
  ];

  return (
    <div className="w-80 glass-panel border-l border-gray-800 flex flex-col h-full overflow-hidden select-none">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded font-bold">
            {type.toUpperCase().replace('_', ' ')}
          </span>
          <h2 className="text-sm font-bold font-heading text-white tracking-wide mt-1">Property Inspector</h2>
        </div>
        <button
          onClick={() => setSelectedWidget(null)}
          className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Inspector Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Section 1: Basic Information */}
        <div className="space-y-3">
          <div className="flex items-center space-x-1.5 text-gray-300 font-bold">
            <Sliders className="w-3.5 h-3.5 text-brand-400" />
            <span>General Setup</span>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 block mb-1">Widget Title</label>
            <input
              type="text"
              value={config.title}
              onChange={e => handleConfigChange('title', e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Data Binding (Device & Virtual Pins) */}
        <div className="space-y-3 pt-3 border-t border-gray-800/80">
          <div className="flex items-center space-x-1.5 text-gray-300 font-bold">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Data Binding</span>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 block mb-1">Target Device</label>
            <select
              value={config.deviceId}
              onChange={e => handleConfigChange('deviceId', e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none font-mono"
            >
              {devices.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Primary Pin / Channel</label>
              <select
                value={config.pin}
                onChange={e => handleConfigChange('pin', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none font-mono"
              >
                {targetDevice?.datastreams.map(ds => (
                  <option key={ds.pin} value={ds.pin}>{ds.pin} ({ds.name})</option>
                )) || (
                  <option value="V0">V0</option>
                )}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Unit Display</label>
              <input
                type="text"
                value={config.unit || ''}
                placeholder="e.g. °C, bar, %"
                onChange={e => handleConfigChange('unit', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Secondary Pin (for Dual Controls or Multi-Line Charts) */}
          {(type === 'line_chart' || type === 'toggle') && (
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Secondary Pin (Optional)</label>
              <select
                value={config.secondaryPin || ''}
                onChange={e => handleConfigChange('secondaryPin', e.target.value || undefined)}
                className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none font-mono"
              >
                <option value="">-- None --</option>
                {targetDevice?.datastreams.map(ds => (
                  <option key={ds.pin} value={ds.pin}>{ds.pin} ({ds.name})</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Section 3: Value Limits & Formula */}
        <div className="space-y-3 pt-3 border-t border-gray-800/80">
          <div className="flex items-center space-x-1.5 text-gray-300 font-bold">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Scaling & Limits</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Min Limit</label>
              <input
                type="number"
                value={config.min ?? 0}
                onChange={e => handleConfigChange('min', Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Max Limit</label>
              <input
                type="number"
                value={config.max ?? 100}
                onChange={e => handleConfigChange('max', Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 block mb-1">Formula Transformation</label>
            <input
              type="text"
              value={config.formula || ''}
              placeholder="e.g. value * 1.8 + 32"
              onChange={e => handleConfigChange('formula', e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none font-mono text-[11px]"
            />
            <p className="text-[10px] text-gray-500 mt-0.5">Use 'value' keyword to compute live formula.</p>
          </div>
        </div>

        {/* Section 4: Threshold Alerts */}
        {(type === 'gauge' || type === 'metric' || type === 'tank') && (
          <div className="space-y-3 pt-3 border-t border-gray-800/80">
            <div className="flex items-center space-x-1.5 text-gray-300 font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Alarm Thresholds</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-amber-400 block mb-1">Warning Value</label>
                <input
                  type="number"
                  value={config.thresholds?.warningValue ?? ''}
                  placeholder="e.g. 70"
                  onChange={e => handleThresholdChange('warningValue', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full bg-gray-900 border border-amber-500/40 text-gray-100 rounded-lg px-2.5 py-1.5 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-red-400 block mb-1">Critical Value</label>
                <input
                  type="number"
                  value={config.thresholds?.criticalValue ?? ''}
                  placeholder="e.g. 95"
                  onChange={e => handleThresholdChange('criticalValue', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full bg-gray-900 border border-red-500/40 text-gray-100 rounded-lg px-2.5 py-1.5 focus:border-red-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Appearance & Theme */}
        <div className="space-y-3 pt-3 border-t border-gray-800/80">
          <div className="flex items-center space-x-1.5 text-gray-300 font-bold">
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>Theme & Accent</span>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 block mb-1.5">Card Theme</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['glass', 'solid', 'cyber'] as const).map(theme => (
                <button
                  key={theme}
                  onClick={() => handleConfigChange('cardTheme', theme)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-mono capitalize border transition ${
                    (config.cardTheme || 'glass') === theme
                      ? 'border-brand-500 bg-brand-500/20 text-brand-300 font-bold'
                      : 'border-gray-800 bg-gray-900 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 block mb-1.5">Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTES.map(p => (
                <button
                  key={p.hex}
                  onClick={() => handleConfigChange('accentColor', p.hex)}
                  className={`w-6 h-6 rounded-full transition-transform hover:scale-110 border ${
                    config.accentColor === p.hex ? 'border-white ring-2 ring-white/40' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: p.hex }}
                  title={p.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-800 space-y-2">
          <button
            onClick={() => duplicateWidget(id)}
            className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium transition flex items-center justify-center space-x-2"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate Widget</span>
          </button>
          <button
            onClick={() => deleteWidget(id)}
            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium transition flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Widget</span>
          </button>
        </div>
      </div>
    </div>
  );
};

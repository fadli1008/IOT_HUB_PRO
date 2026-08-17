import React, { useState } from 'react';
import { WidgetType } from '../../types/dashboard';
import { useDashboard } from '../../context/DashboardContext';
import { useDevices } from '../../context/DeviceContext';
import {
  Gauge,
  LineChart,
  ToggleLeft,
  Sliders,
  Activity,
  Layers,
  MapPin,
  Palette,
  Terminal,
  Search,
  Plus,
  X
} from 'lucide-react';

interface WidgetToolboxProps {
  onClose?: () => void;
}

interface ToolboxItem {
  type: WidgetType;
  title: string;
  category: 'Controls' | 'Telemetry' | 'Industrial' | 'Special';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOOLBOX_ITEMS: ToolboxItem[] = [
  { type: 'gauge', title: 'Radial Gauge', category: 'Telemetry', description: 'Speedometer gauge with warning threshold arcs', icon: Gauge },
  { type: 'line_chart', title: 'Time-Series Chart', category: 'Telemetry', description: 'Live streaming multi-variable graph', icon: LineChart },
  { type: 'metric', title: 'Metric Card', category: 'Telemetry', description: 'Large KPI readout with trends & units', icon: Activity },
  { type: 'tank', title: 'Liquid Tank', category: 'Telemetry', description: 'Cylindrical liquid level & volume percentage', icon: Activity },
  { type: 'toggle', title: 'Relay Switch', category: 'Controls', description: 'Industrial on/off toggle with shadow sync', icon: ToggleLeft },
  { type: 'slider', title: 'Analog PWM Slider', category: 'Controls', description: 'Continuous dimmer slider & step dial', icon: Sliders },
  { type: 'color_picker', title: 'RGB Color Picker', category: 'Controls', description: 'Color palette for LED & lighting', icon: Palette },
  { type: 'scada', title: 'SCADA Plant HMI', category: 'Industrial', description: 'Interactive industrial piping & boiler layout', icon: Layers },
  { type: 'map', title: 'GPS Fleet Tracker', category: 'Special', description: 'Live asset tracking with sensor pinpoints', icon: MapPin },
  { type: 'terminal', title: 'Serial Console', category: 'Special', description: 'Direct serial monitor & command sender', icon: Terminal },
];

export const WidgetToolbox: React.FC<WidgetToolboxProps> = ({ onClose }) => {
  const { addWidget } = useDashboard();
  const { devices } = useDevices();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [targetDeviceId, setTargetDeviceId] = useState<string>(devices[0]?.id || '');
  const [targetPin, setTargetPin] = useState<string>('V0');

  const categories = ['All', 'Telemetry', 'Controls', 'Industrial', 'Special'];

  const filtered = TOOLBOX_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (type: WidgetType) => {
    addWidget(type, targetDeviceId, targetPin);
  };

  return (
    <div className="w-80 glass-panel border-r border-gray-800 flex flex-col h-full overflow-hidden select-none">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold font-heading text-white tracking-wide">Widget Library</h2>
          <p className="text-[11px] text-gray-400">Click to add widgets to canvas</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white md:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Target Device & Pin Quick Selector */}
      <div className="p-3 bg-gray-900/60 border-b border-gray-800 space-y-2">
        <div className="text-[10px] uppercase font-bold text-gray-400 font-mono">Default Target Device</div>
        <select
          value={targetDeviceId}
          onChange={e => setTargetDeviceId(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 text-gray-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500 font-mono"
        >
          {devices.map(d => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.platform})
            </option>
          ))}
        </select>
      </div>

      {/* Search and Category Filters */}
      <div className="p-3 border-b border-gray-800 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search widgets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-brand-500 placeholder:text-gray-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex space-x-1 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                  : 'bg-gray-800/60 text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Widget List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filtered.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              onClick={() => handleAdd(item.type)}
              className="p-3 rounded-xl bg-gray-900/40 border border-gray-800/80 hover:border-brand-500/50 hover:bg-gray-800/50 cursor-pointer transition group flex items-start justify-between"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-gray-800 text-brand-400 group-hover:bg-brand-500/20 group-hover:text-brand-300 transition">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-200 group-hover:text-white flex items-center space-x-1.5">
                    <span>{item.title}</span>
                    <span className="text-[9px] bg-gray-800 text-gray-400 px-1.5 py-0.2 rounded font-mono">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                </div>
              </div>

              <button className="p-1.5 rounded-lg bg-gray-800 text-gray-400 group-hover:bg-brand-500 group-hover:text-black transition">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

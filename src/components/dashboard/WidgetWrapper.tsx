import React from 'react';
import { Widget } from '../../types/dashboard';
import { useDashboard } from '../../context/DashboardContext';
import { Settings, Trash2, Copy, Move, Maximize2, Minimize2 } from 'lucide-react';
import { GaugeWidget } from '../widgets/GaugeWidget';
import { LineChartWidget } from '../widgets/LineChartWidget';
import { ToggleWidget } from '../widgets/ToggleWidget';
import { SliderWidget } from '../widgets/SliderWidget';
import { MetricWidget } from '../widgets/MetricWidget';
import { TankWidget } from '../widgets/TankWidget';
import { ScadaWidget } from '../widgets/ScadaWidget';
import { MapWidget } from '../widgets/MapWidget';
import { ColorPickerWidget } from '../widgets/ColorPickerWidget';
import { TerminalWidget } from '../widgets/TerminalWidget';

interface WidgetWrapperProps {
  widget: Widget;
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ widget }) => {
  const {
    isEditMode,
    selectedWidget,
    setSelectedWidget,
    deleteWidget,
    duplicateWidget,
    updateWidgetLayout
  } = useDashboard();

  const isSelected = selectedWidget?.id === widget.id;

  // Grid column span mappings
  const getColSpanClass = (w: number) => {
    switch (w) {
      case 1: return 'col-span-1';
      case 2: return 'col-span-2';
      case 3: return 'col-span-3';
      case 4: return 'col-span-12 md:col-span-4';
      case 5: return 'col-span-12 md:col-span-5';
      case 6: return 'col-span-12 md:col-span-6';
      case 7: return 'col-span-12 md:col-span-7';
      case 8: return 'col-span-12 md:col-span-8';
      case 9: return 'col-span-12 md:col-span-9';
      case 10: return 'col-span-12 md:col-span-10';
      case 11: return 'col-span-12 md:col-span-11';
      case 12: default: return 'col-span-12';
    }
  };

  const getMinHeight = (h: number) => {
    return `${h * 85}px`;
  };

  const handleWidthChange = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newW = Math.min(Math.max(widget.layout.w + delta, 2), 12);
    updateWidgetLayout(widget.id, { w: newW });
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'gauge': return <GaugeWidget config={widget.config} />;
      case 'line_chart': case 'area_chart': return <LineChartWidget config={widget.config} />;
      case 'toggle': case 'button': return <ToggleWidget config={widget.config} />;
      case 'slider': return <SliderWidget config={widget.config} />;
      case 'metric': case 'led': return <MetricWidget config={widget.config} />;
      case 'tank': return <TankWidget config={widget.config} />;
      case 'scada': return <ScadaWidget config={widget.config} />;
      case 'map': return <MapWidget config={widget.config} />;
      case 'color_picker': return <ColorPickerWidget config={widget.config} />;
      case 'terminal': return <TerminalWidget config={widget.config} />;
      default: return <div className="p-4 text-xs text-gray-500">Widget type not found</div>;
    }
  };

  return (
    <div
      onClick={() => setSelectedWidget(widget)}
      style={{ minHeight: getMinHeight(widget.layout.h) }}
      className={`relative group rounded-2xl transition-all duration-200 flex flex-col ${getColSpanClass(widget.layout.w)} ${
        widget.config.cardTheme === 'solid'
          ? 'bg-gray-900 border border-gray-800'
          : widget.config.cardTheme === 'cyber'
          ? 'bg-gray-950/80 border border-brand-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
          : 'glass-panel'
      } ${
        isSelected
          ? 'ring-2 ring-brand-500 shadow-xl shadow-brand-500/10 border-transparent'
          : 'hover:border-gray-700'
      }`}
    >
      {/* Widget Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800/60 select-none">
        <div className="flex items-center space-x-2 truncate">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: widget.config.accentColor || '#06b6d4' }}
          />
          <h3 className="text-xs font-semibold text-gray-200 truncate font-heading tracking-wide">
            {widget.config.title}
          </h3>
        </div>

        {/* Action buttons on edit mode */}
        {isEditMode ? (
          <div className="flex items-center space-x-1 opacity-90 transition">
            {/* Width Controls */}
            <button
              onClick={(e) => handleWidthChange(-2, e)}
              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white text-[10px]"
              title="Narrow"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleWidthChange(2, e)}
              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white text-[10px]"
              title="Widen"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); duplicateWidget(widget.id); }}
              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-cyan-400"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedWidget(widget); }}
              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
              title="Configure"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deleteWidget(widget.id); }}
              className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-[10px] font-mono text-gray-500">
            {widget.config.pin}
          </span>
        )}
      </div>

      {/* Widget Body */}
      <div className="flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden">
        {renderWidgetContent()}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { DashboardHeader } from './DashboardHeader';
import { WidgetToolbox } from './WidgetToolbox';
import { WidgetInspector } from './WidgetInspector';
import { WidgetWrapper } from './WidgetWrapper';
import { PlusCircle, LayoutGrid, Sparkles } from 'lucide-react';

export const DashboardCanvas: React.FC = () => {
  const {
    activeTab,
    isEditMode,
    setIsEditMode,
    viewportMode,
    selectedWidget,
    addWidget,
    isKioskMode
  } = useDashboard();

  const [isToolboxOpen, setIsToolboxOpen] = useState(false);

  // Viewport width styling
  const getViewportContainerClass = () => {
    switch (viewportMode) {
      case 'mobile':
        return 'max-w-[420px] mx-auto shadow-2xl border-x border-gray-800 my-4 rounded-3xl min-h-[780px] bg-[#0B0F19] overflow-hidden';
      case 'tablet':
        return 'max-w-[820px] mx-auto shadow-2xl border-x border-gray-800 my-4 rounded-2xl min-h-[850px] bg-[#0B0F19] overflow-hidden';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0B0F19]">
      {/* Top Header if not in Kiosk mode */}
      {!isKioskMode && (
        <DashboardHeader
          onToggleToolbox={() => setIsToolboxOpen(!isToolboxOpen)}
          isToolboxOpen={isToolboxOpen}
        />
      )}

      {/* Main Workspace Area (Toolbox + Canvas + Inspector) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Widget Toolbox (Drawer/Sidebar) */}
        {(isToolboxOpen || (isEditMode && !selectedWidget && window.innerWidth >= 1280)) && (
          <WidgetToolbox onClose={() => setIsToolboxOpen(false)} />
        )}

        {/* Center Grid Canvas */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 grid-bg-pattern flex flex-col items-center">
          <div className={`${getViewportContainerClass()} transition-all duration-300`}>
            {activeTab.widgets.length === 0 ? (
              /* Empty Canvas State */
              <div className="h-[450px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-800 rounded-3xl m-4">
                <div className="p-4 bg-brand-500/10 text-brand-400 rounded-2xl mb-4 glow-cyan">
                  <LayoutGrid className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold font-heading text-white">This Tab is Empty</h3>
                <p className="text-xs text-gray-400 max-w-sm mt-1 mb-5">
                  Start building your custom IoT dashboard by adding gauges, switches, charts, or industrial SCADA schematics.
                </p>
                <button
                  onClick={() => {
                    setIsEditMode(true);
                    setIsToolboxOpen(true);
                  }}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Open Widget Library</span>
                </button>
              </div>
            ) : (
              /* Responsive 12-Column Grid */
              <div className="grid grid-cols-12 gap-4 pb-12">
                {activeTab.widgets.map(widget => (
                  <WidgetWrapper key={widget.id} widget={widget} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Property Inspector Sidebar */}
        {selectedWidget && <WidgetInspector />}
      </div>
    </div>
  );
};

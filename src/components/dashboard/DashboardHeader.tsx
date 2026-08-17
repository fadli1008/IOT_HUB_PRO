import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  Edit3,
  Eye,
  Plus,
  Monitor,
  Tablet,
  Smartphone,
  Maximize,
  Download,
  Upload,
  Layers,
  Trash2
} from 'lucide-react';

interface DashboardHeaderProps {
  onToggleToolbox: () => void;
  isToolboxOpen: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleToolbox, isToolboxOpen }) => {
  const {
    activeDashboard,
    activeTab,
    setActiveTabId,
    addTab,
    deleteTab,
    isEditMode,
    setIsEditMode,
    viewportMode,
    setViewportMode,
    isKioskMode,
    setIsKioskMode,
    exportDashboardJson,
    importDashboardJson
  } = useDashboard();

  const [newTabName, setNewTabName] = useState('');
  const [showNewTabInput, setShowNewTabInput] = useState(false);

  const handleAddTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTabName.trim()) {
      addTab(newTabName.trim());
      setNewTabName('');
      setShowNewTabInput(false);
    }
  };

  const handleExport = () => {
    const jsonStr = exportDashboardJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDashboard.name.toLowerCase().replace(/\s+/g, '_')}_layout.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) importDashboardJson(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col border-b border-gray-800/80 bg-gray-950/40 backdrop-blur-md px-6 py-3 select-none">
      {/* Top Row: Title, Viewports, Edit Mode, Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-heading text-white flex items-center space-x-2">
            <span>{activeDashboard.name}</span>
            {isEditMode && (
              <span className="text-[10px] uppercase font-mono bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full border border-brand-500/30">
                Editing Layout
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-400">{activeDashboard.description || 'Live universal IoT control center'}</p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Viewport Switcher */}
          <div className="hidden md:flex items-center bg-gray-900 border border-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded-lg transition ${viewportMode === 'desktop' ? 'bg-gray-800 text-brand-400' : 'text-gray-400 hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded-lg transition ${viewportMode === 'tablet' ? 'bg-gray-800 text-brand-400' : 'text-gray-400 hover:text-white'}`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded-lg transition ${viewportMode === 'mobile' ? 'bg-gray-800 text-brand-400' : 'text-gray-400 hover:text-white'}`}
              title="Mobile Smartphone View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Edit Mode Toggle Button */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-md ${
              isEditMode
                ? 'bg-brand-500 text-black hover:bg-brand-400 glow-cyan'
                : 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            {isEditMode ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditMode ? 'Live Preview' : 'Edit Dashboard'}</span>
          </button>

          {/* Add Widget Button (when in edit mode) */}
          {isEditMode && (
            <button
              onClick={onToggleToolbox}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                isToolboxOpen
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-700'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Widgets</span>
            </button>
          )}

          {/* Export / Import */}
          <div className="hidden sm:flex items-center space-x-1">
            <button
              onClick={handleExport}
              className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition"
              title="Export Layout JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <label className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition cursor-pointer" title="Import Layout JSON">
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button
              onClick={() => setIsKioskMode(!isKioskMode)}
              className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition"
              title="Kiosk Full-Screen Mode"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Tabs */}
      <div className="flex items-center space-x-2 mt-3 overflow-x-auto pb-1">
        {activeDashboard.tabs.map(tab => (
          <div
            key={tab.id}
            className={`group flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition select-none ${
              activeTab.id === tab.id
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 font-bold shadow-sm'
                : 'bg-gray-900/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800/80 border border-transparent'
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{tab.name}</span>
            <span className="text-[10px] text-gray-500 font-mono">({tab.widgets.length})</span>

            {/* Delete Tab if > 1 */}
            {isEditMode && activeDashboard.tabs.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteTab(tab.id); }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 rounded transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {/* Add Tab Button */}
        {showNewTabInput ? (
          <form onSubmit={handleAddTab} className="flex items-center space-x-1">
            <input
              type="text"
              autoFocus
              value={newTabName}
              onChange={e => setNewTabName(e.target.value)}
              placeholder="Tab name..."
              className="bg-gray-900 border border-brand-500 text-xs px-2.5 py-1 rounded-lg text-white focus:outline-none"
            />
            <button type="submit" className="p-1 bg-brand-500 text-black text-xs rounded-lg font-bold">
              Add
            </button>
            <button type="button" onClick={() => setShowNewTabInput(false)} className="text-gray-500 text-xs px-1">
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowNewTabInput(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs text-gray-400 hover:text-brand-400 hover:bg-gray-800/50 rounded-xl transition border border-dashed border-gray-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Tab</span>
          </button>
        )}
      </div>
    </div>
  );
};

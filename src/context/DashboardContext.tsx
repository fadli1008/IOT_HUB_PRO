import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dashboard, DashboardTab, Widget, WidgetType } from '../types/dashboard';
import { INITIAL_DASHBOARDS } from '../utils/mockData';
import { storage } from '../utils/storage';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

interface DashboardContextType {
  dashboards: Dashboard[];
  activeDashboard: Dashboard;
  activeTab: DashboardTab;
  isEditMode: boolean;
  setIsEditMode: (edit: boolean) => void;
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  selectedWidget: Widget | null;
  setSelectedWidget: (widget: Widget | null) => void;
  setActiveDashboardId: (id: string) => void;
  setActiveTabId: (id: string) => void;
  addWidget: (type: WidgetType, deviceId?: string, pin?: string) => void;
  updateWidgetConfig: (widgetId: string, updates: Partial<Widget['config']>) => void;
  updateWidgetLayout: (widgetId: string, layout: Partial<Widget['layout']>) => void;
  deleteWidget: (widgetId: string) => void;
  duplicateWidget: (widgetId: string) => void;
  addTab: (name: string) => void;
  deleteTab: (tabId: string) => void;
  createDashboard: (name: string, description?: string) => void;
  deleteDashboard: (id: string) => void;
  exportDashboardJson: () => string;
  importDashboardJson: (jsonStr: string) => boolean;
  isKioskMode: boolean;
  setIsKioskMode: (kiosk: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>(() => storage.get('dashboards', INITIAL_DASHBOARDS));
  const [activeDashboardId, setActiveDashboardId] = useState<string>(() => dashboards[0]?.id || 'dash_main_factory');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [isKioskMode, setIsKioskMode] = useState<boolean>(false);

  const activeDashboard = dashboards.find(d => d.id === activeDashboardId) || dashboards[0] || INITIAL_DASHBOARDS[0];
  const activeTab = activeDashboard.tabs.find(t => t.id === activeDashboard.activeTabId) || activeDashboard.tabs[0];

  useEffect(() => {
    storage.set('dashboards', dashboards);
  }, [dashboards]);

  // Keep selectedWidget in sync if widget updates
  useEffect(() => {
    if (selectedWidget) {
      const current = activeTab?.widgets.find(w => w.id === selectedWidget.id);
      if (current) setSelectedWidget(current);
      else setSelectedWidget(null);
    }
  }, [dashboards, activeTab]);

  const setActiveTabId = (tabId: string) => {
    setDashboards(prev => prev.map(d => {
      if (d.id !== activeDashboard.id) return d;
      return { ...d, activeTabId: tabId };
    }));
  };

  const addWidget = (type: WidgetType, deviceId: string = 'dev_esp32_boiler_01', pin: string = 'V0') => {
    const id = 'w_' + Math.random().toString(36).substring(2, 9);
    
    // Find next available Y coordinate
    const currentWidgets = activeTab.widgets;
    const maxY = currentWidgets.reduce((max, w) => Math.max(max, w.layout.y + w.layout.h), 0);

    let defaultWidth = 4;
    let defaultHeight = 3;

    if (type === 'line_chart' || type === 'scada' || type === 'map') {
      defaultWidth = 12;
      defaultHeight = type === 'scada' ? 6 : 4;
    } else if (type === 'slider' || type === 'metric') {
      defaultWidth = 4;
      defaultHeight = 2;
    }

    const newWidget: Widget = {
      id,
      type,
      layout: {
        id,
        x: 0,
        y: maxY,
        w: defaultWidth,
        h: defaultHeight
      },
      config: {
        title: `Custom ${type.toUpperCase().replace('_', ' ')}`,
        deviceId,
        pin,
        unit: type === 'gauge' || type === 'metric' ? '°C' : '',
        min: 0,
        max: 100,
        accentColor: '#06b6d4'
      }
    };

    setDashboards(prev => prev.map(d => {
      if (d.id !== activeDashboard.id) return d;
      return {
        ...d,
        tabs: d.tabs.map(t => {
          if (t.id !== activeTab.id) return t;
          return { ...t, widgets: [...t.widgets, newWidget] };
        })
      };
    }));

    setSelectedWidget(newWidget);
    setIsEditMode(true);
  };

  const updateWidgetConfig = (widgetId: string, updates: Partial<Widget['config']>) => {
    setDashboards(prev => prev.map(d => {
      if (d.id !== activeDashboard.id) return d;
      return {
        ...d,
        tabs: d.tabs.map(t => {
          if (t.id !== activeTab.id) return t;
          return {
            ...t,
            widgets: t.widgets.map(w => w.id === widgetId ? { ...w, config: { ...w.config, ...updates } } : w)
          };
        })
      };
    }));
  };

  const updateWidgetLayout = (widgetId: string, layoutUpdates: Partial<Widget['layout']>) => {
    setDashboards(prev => prev.map(d => {
      if (d.id !== activeDashboard.id) return d;
      return {
        ...d,
        tabs: d.tabs.map(t => {
          if (t.id !== activeTab.id) return t;
          return {
            ...t,
            widgets: t.widgets.map(w => w.id === widgetId ? { ...w, layout: { ...w.layout, ...layoutUpdates } } : w)
          };
        })
      };
    }));
  };

  const deleteWidget = (widgetId: string) => {
    setDashboards(prev => prev.map(d => {
      if (d.id !== activeDashboard.id) return d;
      return {
        ...d,
        tabs: d.tabs.map(t => {
          if (t.id !== activeTab.id) return t;
          return {
            ...t,
            widgets: t.widgets.filter(w => w.id !== widgetId)
          };
        })
      };
    }));
    if (selectedWidget?.id === widgetId) setSelectedWidget(null);
  };

  const duplicateWidget = (widgetId: string) => {
    const target = activeTab.widgets.find(w => w.id === widgetId);
    if (!target) return;

    const newId = 'w_' + Math.random().toString(36).substring(2, 9);
    const duplicated: Widget = {
      ...target,
      id: newId,
      layout: {
        ...target.layout,
        id: newId,
        y: target.layout.y + target.layout.h
      },
      config: {
        ...target.config,
        title: `${target.config.title} (Copy)`
      }
    };

    setDashboards(prev => prev.map(d => {
      if (d.id !== activeDashboard.id) return d;
      return {
        ...d,
        tabs: d.tabs.map(t => {
          if (t.id !== activeTab.id) return t;
          return { ...t, widgets: [...t.widgets, duplicated] };
        })
      };
    }));
    setSelectedWidget(duplicated);
  };

  const addTab = (name: string) => {
    const newTabId = 'tab_' + Math.random().toString(36).substring(2, 9);
    const newTab: DashboardTab = {
      id: newTabId,
      name,
      widgets: []
    };

    setDashboards(prev => prev.map(d => {
      if (d.id !== activeDashboard.id) return d;
      return {
        ...d,
        activeTabId: newTabId,
        tabs: [...d.tabs, newTab]
      };
    }));
  };

  const deleteTab = (tabId: string) => {
    if (activeDashboard.tabs.length <= 1) return; // Keep at least one tab
    setDashboards(prev => prev.map(d => {
      if (d.id !== activeDashboard.id) return d;
      const remainingTabs = d.tabs.filter(t => t.id !== tabId);
      return {
        ...d,
        activeTabId: remainingTabs[0]?.id || '',
        tabs: remainingTabs
      };
    }));
  };

  const createDashboard = (name: string, description?: string) => {
    const newDashId = 'dash_' + Math.random().toString(36).substring(2, 9);
    const newDash: Dashboard = {
      id: newDashId,
      name,
      description,
      activeTabId: 'tab_default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tabs: [
        {
          id: 'tab_default',
          name: 'Main Overview',
          widgets: []
        }
      ]
    };
    setDashboards(prev => [newDash, ...prev]);
    setActiveDashboardId(newDashId);
    setIsEditMode(true);
  };

  const deleteDashboard = (id: string) => {
    if (dashboards.length <= 1) return;
    setDashboards(prev => prev.filter(d => d.id !== id));
    setActiveDashboardId(dashboards.find(d => d.id !== id)?.id || '');
  };

  const exportDashboardJson = (): string => {
    return JSON.stringify(activeDashboard, null, 2);
  };

  const importDashboardJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr) as Dashboard;
      if (parsed.name && Array.isArray(parsed.tabs)) {
        const importedId = 'dash_' + Math.random().toString(36).substring(2, 9);
        const newDash = { ...parsed, id: importedId };
        setDashboards(prev => [newDash, ...prev]);
        setActiveDashboardId(importedId);
        return true;
      }
    } catch (e) {
      console.error('Failed to import dashboard json', e);
    }
    return false;
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboards,
        activeDashboard,
        activeTab,
        isEditMode,
        setIsEditMode,
        viewportMode,
        setViewportMode,
        selectedWidget,
        setSelectedWidget,
        setActiveDashboardId,
        setActiveTabId,
        addWidget,
        updateWidgetConfig,
        updateWidgetLayout,
        deleteWidget,
        duplicateWidget,
        addTab,
        deleteTab,
        createDashboard,
        deleteDashboard,
        exportDashboardJson,
        importDashboardJson,
        isKioskMode,
        setIsKioskMode
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};

export type WidgetType = 
  | 'toggle'
  | 'slider'
  | 'button'
  | 'color_picker'
  | 'metric'
  | 'gauge'
  | 'line_chart'
  | 'area_chart'
  | 'tank'
  | 'led'
  | 'table'
  | 'scada'
  | 'map'
  | 'terminal';

export interface WidgetThreshold {
  warningValue?: number;
  criticalValue?: number;
  normalColor?: string;
  warningColor?: string;
  criticalColor?: string;
}

export interface WidgetConfig {
  title: string;
  deviceId: string;
  pin: string; // "V0", "V1", etc.
  secondaryPin?: string;
  icon?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  decimalPlaces?: number;
  cardTheme?: 'glass' | 'solid' | 'minimal' | 'cyber';
  accentColor?: string;
  formula?: string; // e.g. "value * 1.8 + 32"
  confirmBeforeExecute?: boolean;
  thresholds?: WidgetThreshold;
  scadaType?: 'boiler_plant' | 'water_pump' | 'conveyor';
  chartTimeframe?: '1m' | '5m' | '1h' | '24h';
}

export interface LayoutItem {
  id: string;
  x: number; // 0 to 11 (12 col grid)
  y: number;
  w: number; // width in columns
  h: number; // height in rows
}

export interface Widget {
  id: string;
  type: WidgetType;
  layout: LayoutItem;
  config: WidgetConfig;
}

export interface DashboardTab {
  id: string;
  name: string;
  icon?: string;
  widgets: Widget[];
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  tabs: DashboardTab[];
  activeTabId: string;
  createdAt: string;
  updatedAt: string;
}

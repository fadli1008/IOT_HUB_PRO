import { Device, DeviceTemplate } from '../types/device';
import { Dashboard } from '../types/dashboard';
import { AutomationRule } from '../types/rules';

export const INITIAL_DEVICE_TEMPLATES: DeviceTemplate[] = [
  {
    id: 'tpl_esp32_smart_boiler',
    name: 'Industrial Smart Boiler (ESP32)',
    description: 'Dual temperature, pressure sensor, automatic valve & pump relay',
    platform: 'esp32',
    icon: 'Flame',
    datastreams: [
      { id: 'ds_v0', pin: 'V0', name: 'Boiler Core Temp', type: 'double', unit: '°C', min: 0, max: 150, defaultValue: 78.5 },
      { id: 'ds_v1', pin: 'V1', name: 'Coolant Flow Rate', type: 'double', unit: 'L/min', min: 0, max: 100, defaultValue: 42.0 },
      { id: 'ds_v2', pin: 'V2', name: 'Main Power Relay', type: 'boolean', defaultValue: 1 },
      { id: 'ds_v3', pin: 'V3', name: 'Circulation Pump', type: 'boolean', defaultValue: 1 },
      { id: 'ds_v4', pin: 'V4', name: 'Steam Pressure', type: 'double', unit: 'bar', min: 0, max: 20, defaultValue: 4.8 },
      { id: 'ds_v5', pin: 'V5', name: 'Heater PWM Power', type: 'integer', unit: '%', min: 0, max: 100, defaultValue: 65 },
      { id: 'ds_v6', pin: 'V6', name: 'LED Status RGB', type: 'string', defaultValue: '#06b6d4' }
    ],
    defaultWidgets: []
  },
  {
    id: 'tpl_rpi_gateway',
    name: 'Raspberry Pi Industrial Gateway',
    description: 'Multi-channel edge gateway with CPU, memory, and Modbus RTU telemetry',
    platform: 'raspberry_pi',
    icon: 'Cpu',
    datastreams: [
      { id: 'ds_cpu', pin: 'V0', name: 'CPU Temp', type: 'double', unit: '°C', min: 20, max: 90, defaultValue: 46.2 },
      { id: 'ds_ram', pin: 'V1', name: 'RAM Usage', type: 'double', unit: '%', min: 0, max: 100, defaultValue: 38.5 },
      { id: 'ds_net', pin: 'V2', name: 'Network Throughput', type: 'double', unit: 'MB/s', min: 0, max: 50, defaultValue: 12.4 },
      { id: 'ds_gw_relay', pin: 'V3', name: 'Watchdog Relay', type: 'boolean', defaultValue: 1 }
    ],
    defaultWidgets: []
  },
  {
    id: 'tpl_weather_station',
    name: 'Smart Agriculture & Weather (ESP32)',
    description: 'Ambient temp, soil moisture, humidity, and auto irrigation valve',
    platform: 'esp32',
    icon: 'Sprout',
    datastreams: [
      { id: 'ds_w_temp', pin: 'V0', name: 'Ambient Temp', type: 'double', unit: '°C', min: -10, max: 60, defaultValue: 29.4 },
      { id: 'ds_w_hum', pin: 'V1', name: 'Ambient Humidity', type: 'double', unit: '%', min: 0, max: 100, defaultValue: 68.0 },
      { id: 'ds_w_soil', pin: 'V2', name: 'Soil Moisture', type: 'double', unit: '%', min: 0, max: 100, defaultValue: 54.0 },
      { id: 'ds_w_valve', pin: 'V3', name: 'Irrigation Solenoid', type: 'boolean', defaultValue: 0 }
    ],
    defaultWidgets: []
  }
];

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'dev_esp32_boiler_01',
    name: 'ESP32 Boiler Unit Alpha',
    token: 'iothub_tok_esp32_boiler_98a7bc',
    platform: 'esp32',
    status: 'online',
    templateId: 'tpl_esp32_smart_boiler',
    ipAddress: '192.168.1.145',
    firmwareVersion: 'v1.4.2-prod',
    lastSeen: new Date().toISOString(),
    rssi: -62,
    location: {
      lat: -6.2088,
      lng: 106.8456,
      address: 'Industrial Plant Line A, Jakarta'
    },
    tags: ['Factory Floor', 'High Temp', 'ESP32'],
    datastreams: [
      { id: 'ds_v0', pin: 'V0', name: 'Boiler Core Temp', type: 'double', unit: '°C', min: 0, max: 150, defaultValue: 78.5, currentValue: 78.5, lastUpdated: new Date().toISOString() },
      { id: 'ds_v1', pin: 'V1', name: 'Coolant Flow Rate', type: 'double', unit: 'L/min', min: 0, max: 100, defaultValue: 42.0, currentValue: 42.0, lastUpdated: new Date().toISOString() },
      { id: 'ds_v2', pin: 'V2', name: 'Main Power Relay', type: 'boolean', defaultValue: 1, currentValue: 1, lastUpdated: new Date().toISOString() },
      { id: 'ds_v3', pin: 'V3', name: 'Circulation Pump', type: 'boolean', defaultValue: 1, currentValue: 1, lastUpdated: new Date().toISOString() },
      { id: 'ds_v4', pin: 'V4', name: 'Steam Pressure', type: 'double', unit: 'bar', min: 0, max: 20, defaultValue: 4.8, currentValue: 4.8, lastUpdated: new Date().toISOString() },
      { id: 'ds_v5', pin: 'V5', name: 'Heater PWM Power', type: 'integer', unit: '%', min: 0, max: 100, defaultValue: 65, currentValue: 65, lastUpdated: new Date().toISOString() },
      { id: 'ds_v6', pin: 'V6', name: 'LED Status RGB', type: 'string', defaultValue: '#06b6d4', currentValue: '#06b6d4', lastUpdated: new Date().toISOString() }
    ],
    shadow: {
      desired: { V2: 1, V3: 1, V5: 65 },
      reported: { V2: 1, V3: 1, V5: 65, V0: 78.5, V4: 4.8 },
      lastSyncedAt: new Date().toISOString(),
      version: 42
    }
  },
  {
    id: 'dev_rpi_gateway_01',
    name: 'RPi Edge Gateway 01',
    token: 'iothub_tok_rpi_edge_33f81e',
    platform: 'raspberry_pi',
    status: 'online',
    templateId: 'tpl_rpi_gateway',
    ipAddress: '192.168.1.200',
    firmwareVersion: 'v2.1.0-linux',
    lastSeen: new Date().toISOString(),
    rssi: -48,
    tags: ['Gateway', 'Linux', 'Modbus'],
    datastreams: [
      { id: 'ds_cpu', pin: 'V0', name: 'CPU Temp', type: 'double', unit: '°C', min: 20, max: 90, currentValue: 47.8, lastUpdated: new Date().toISOString() },
      { id: 'ds_ram', pin: 'V1', name: 'RAM Usage', type: 'double', unit: '%', min: 0, max: 100, currentValue: 41.2, lastUpdated: new Date().toISOString() },
      { id: 'ds_net', pin: 'V2', name: 'Network Throughput', type: 'double', unit: 'MB/s', min: 0, max: 50, currentValue: 18.3, lastUpdated: new Date().toISOString() },
      { id: 'ds_gw_relay', pin: 'V3', name: 'Watchdog Relay', type: 'boolean', currentValue: 1, lastUpdated: new Date().toISOString() }
    ],
    shadow: {
      desired: { V3: 1 },
      reported: { V3: 1, V0: 47.8, V1: 41.2 },
      lastSyncedAt: new Date().toISOString(),
      version: 15
    }
  },
  {
    id: 'dev_agri_station_01',
    name: 'Greenhouse Sensor Hub',
    token: 'iothub_tok_agri_gh_55bc92',
    platform: 'esp32',
    status: 'online',
    templateId: 'tpl_weather_station',
    ipAddress: '192.168.1.168',
    firmwareVersion: 'v1.1.0',
    lastSeen: new Date().toISOString(),
    rssi: -71,
    tags: ['Agriculture', 'Greenhouse', 'DHT22'],
    datastreams: [
      { id: 'ds_w_temp', pin: 'V0', name: 'Ambient Temp', type: 'double', unit: '°C', min: -10, max: 60, currentValue: 31.2, lastUpdated: new Date().toISOString() },
      { id: 'ds_w_hum', pin: 'V1', name: 'Ambient Humidity', type: 'double', unit: '%', min: 0, max: 100, currentValue: 64.5, lastUpdated: new Date().toISOString() },
      { id: 'ds_w_soil', pin: 'V2', name: 'Soil Moisture', type: 'double', unit: '%', min: 0, max: 100, currentValue: 52.0, lastUpdated: new Date().toISOString() },
      { id: 'ds_w_valve', pin: 'V3', name: 'Irrigation Solenoid', type: 'boolean', currentValue: 0, lastUpdated: new Date().toISOString() }
    ],
    shadow: {
      desired: { V3: 0 },
      reported: { V3: 0, V0: 31.2, V1: 64.5 },
      lastSyncedAt: new Date().toISOString(),
      version: 8
    }
  }
];

export const INITIAL_DASHBOARDS: Dashboard[] = [
  {
    id: 'dash_main_factory',
    name: 'Plant Central Overview',
    description: 'Real-time telemetry, SCADA plant schematic, and remote controls',
    isDefault: true,
    activeTabId: 'tab_overview',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tabs: [
      {
        id: 'tab_overview',
        name: 'Main Controls & Metrics',
        icon: 'LayoutDashboard',
        widgets: [
          {
            id: 'w_gauge_boiler',
            type: 'gauge',
            layout: { id: 'w_gauge_boiler', x: 0, y: 0, w: 4, h: 3 },
            config: {
              title: 'Boiler Core Temperature',
              deviceId: 'dev_esp32_boiler_01',
              pin: 'V0',
              unit: '°C',
              min: 0,
              max: 150,
              accentColor: '#06b6d4',
              thresholds: { warningValue: 85, criticalValue: 110 }
            }
          },
          {
            id: 'w_tank_pressure',
            type: 'tank',
            layout: { id: 'w_tank_pressure', x: 4, y: 0, w: 4, h: 3 },
            config: {
              title: 'Steam Chamber Pressure',
              deviceId: 'dev_esp32_boiler_01',
              pin: 'V4',
              unit: 'bar',
              min: 0,
              max: 15,
              accentColor: '#3b82f6',
              thresholds: { warningValue: 8, criticalValue: 12 }
            }
          },
          {
            id: 'w_power_switches',
            type: 'toggle',
            layout: { id: 'w_power_switches', x: 8, y: 0, w: 4, h: 3 },
            config: {
              title: 'Relay Actuation (Pump & Valve)',
              deviceId: 'dev_esp32_boiler_01',
              pin: 'V2',
              secondaryPin: 'V3',
              accentColor: '#10b981',
              confirmBeforeExecute: true
            }
          },
          {
            id: 'w_slider_pwm',
            type: 'slider',
            layout: { id: 'w_slider_pwm', x: 0, y: 3, w: 4, h: 2 },
            config: {
              title: 'Heater Output (PWM)',
              deviceId: 'dev_esp32_boiler_01',
              pin: 'V5',
              unit: '%',
              min: 0,
              max: 100,
              step: 5,
              accentColor: '#f59e0b'
            }
          },
          {
            id: 'w_metric_flow',
            type: 'metric',
            layout: { id: 'w_metric_flow', x: 4, y: 3, w: 4, h: 2 },
            config: {
              title: 'Coolant Flow Rate',
              deviceId: 'dev_esp32_boiler_01',
              pin: 'V1',
              unit: 'L/min',
              icon: 'Activity',
              accentColor: '#06b6d4'
            }
          },
          {
            id: 'w_color_picker',
            type: 'color_picker',
            layout: { id: 'w_color_picker', x: 8, y: 3, w: 4, h: 2 },
            config: {
              title: 'Status RGB Lamp',
              deviceId: 'dev_esp32_boiler_01',
              pin: 'V6',
              accentColor: '#8b5cf6'
            }
          },
          {
            id: 'w_chart_history',
            type: 'line_chart',
            layout: { id: 'w_chart_history', x: 0, y: 5, w: 12, h: 4 },
            config: {
              title: 'Real-time Telemetry Stream (Live Multi-Sensor)',
              deviceId: 'dev_esp32_boiler_01',
              pin: 'V0',
              secondaryPin: 'V4',
              unit: '°C / bar',
              chartTimeframe: '1m',
              accentColor: '#06b6d4'
            }
          }
        ]
      },
      {
        id: 'tab_scada',
        name: 'SCADA Plant Schematic',
        icon: 'Layers',
        widgets: [
          {
            id: 'w_scada_schematic',
            type: 'scada',
            layout: { id: 'w_scada_schematic', x: 0, y: 0, w: 12, h: 6 },
            config: {
              title: 'Industrial Plant HMI (Boiler & Circulation System)',
              deviceId: 'dev_esp32_boiler_01',
              pin: 'V0',
              scadaType: 'boiler_plant',
              accentColor: '#06b6d4'
            }
          }
        ]
      },
      {
        id: 'tab_geo',
        name: 'GPS Fleet & Site Map',
        icon: 'MapPin',
        widgets: [
          {
            id: 'w_geo_map',
            type: 'map',
            layout: { id: 'w_geo_map', x: 0, y: 0, w: 12, h: 5 },
            config: {
              title: 'Live Site Tracking & Telemetry Geolocation',
              deviceId: 'dev_esp32_boiler_01',
              pin: 'V0',
              accentColor: '#10b981'
            }
          }
        ]
      }
    ]
  }
];

export const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule_high_temp_alert',
    name: 'Boiler Overheat Emergency Shutoff',
    description: 'If Boiler Core Temp exceeds 105°C, automatically shut off Heater PWM and send Telegram alert',
    isEnabled: true,
    trigger: {
      type: 'telemetry_threshold',
      deviceId: 'dev_esp32_boiler_01',
      pin: 'V0',
      operator: '>',
      thresholdValue: 105
    },
    actions: [
      {
        type: 'actuate_device',
        targetDeviceId: 'dev_esp32_boiler_01',
        targetPin: 'V5',
        targetValue: 0
      },
      {
        type: 'send_telegram',
        recipient: '@industrial_alerts_bot',
        messageTemplate: '🚨 [CRITICAL ALERT] Boiler Core Temperature exceeded 105°C! Emergency shutoff triggered.'
      }
    ],
    lastTriggeredAt: new Date(Date.now() - 3600000).toISOString(),
    executionCount: 3
  },
  {
    id: 'rule_soil_irrigation',
    name: 'Greenhouse Auto-Watering',
    description: 'Turn on Solenoid Valve when Soil Moisture falls below 40%',
    isEnabled: true,
    trigger: {
      type: 'telemetry_threshold',
      deviceId: 'dev_agri_station_01',
      pin: 'V2',
      operator: '<',
      thresholdValue: 40
    },
    actions: [
      {
        type: 'actuate_device',
        targetDeviceId: 'dev_agri_station_01',
        targetPin: 'V3',
        targetValue: 1
      },
      {
        type: 'send_email',
        recipient: 'agri-operator@iothub.local',
        messageTemplate: 'Greenhouse soil moisture low. Auto-irrigation activated.'
      }
    ],
    executionCount: 12
  }
];

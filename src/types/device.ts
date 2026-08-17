export type DatastreamType = 'double' | 'integer' | 'boolean' | 'string' | 'json';
export type HardwarePlatform = 'esp32' | 'esp8266' | 'stm32' | 'raspberry_pi' | 'arduino' | 'custom';
export type DeviceStatus = 'online' | 'offline' | 'warning' | 'error';

export interface Datastream {
  id: string;
  pin: string; // e.g. "V0", "V1", "V2" or "temperature"
  name: string;
  type: DatastreamType;
  unit?: string;
  min?: number;
  max?: number;
  defaultValue?: any;
  currentValue?: any;
  lastUpdated?: string;
}

export interface DeviceShadow {
  desired: Record<string, any>;
  reported: Record<string, any>;
  lastSyncedAt: string;
  version: number;
}

export interface Device {
  id: string;
  name: string;
  token: string;
  platform: HardwarePlatform;
  status: DeviceStatus;
  templateId?: string;
  ipAddress?: string;
  firmwareVersion: string;
  lastSeen: string;
  datastreams: Datastream[];
  shadow: DeviceShadow;
  rssi?: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  tags: string[];
}

export interface DeviceTemplate {
  id: string;
  name: string;
  description: string;
  platform: HardwarePlatform;
  icon: string;
  datastreams: Omit<Datastream, 'currentValue' | 'lastUpdated'>[];
  defaultWidgets: any[];
}

export interface OTARelease {
  id: string;
  version: string;
  targetPlatform: HardwarePlatform;
  filename: string;
  sizeBytes: number;
  checksum: string;
  createdAt: string;
  notes: string;
}

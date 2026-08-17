export interface TelemetryPoint {
  timestamp: number;
  value: any;
  pin: string;
  deviceId: string;
}

export interface TelemetryStreamState {
  [deviceId: string]: {
    [pin: string]: any;
  };
}

export interface TelemetryHistory {
  [deviceId: string]: {
    [pin: string]: Array<{ timestamp: number; value: number }>;
  };
}

export interface DeviceCommandPacket {
  deviceId: string;
  pin: string;
  value: any;
  source: 'dashboard' | 'rule' | 'api' | 'simulator';
  timestamp: number;
}

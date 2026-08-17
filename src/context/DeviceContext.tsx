import React, { createContext, useContext, useState, useEffect } from 'react';
import { Device, DeviceTemplate, HardwarePlatform, OTARelease, Datastream, DatastreamType } from '../types/device';
import { INITIAL_DEVICES, INITIAL_DEVICE_TEMPLATES } from '../utils/mockData';
import { storage } from '../utils/storage';
import { generateToken } from '../utils/formatters';

interface DeviceContextType {
  devices: Device[];
  templates: DeviceTemplate[];
  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
  addDevice: (device: { name: string; platform: HardwarePlatform; templateId?: string; tags?: string[] }) => Device;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  updateDatastream: (deviceId: string, pin: string, value: any) => void;
  updateDeviceShadowDesired: (deviceId: string, desired: Record<string, any>) => void;
  otaReleases: OTARelease[];
  addOtaRelease: (release: Omit<OTARelease, 'id' | 'createdAt'>) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>(() => storage.get('devices', INITIAL_DEVICES));
  const [templates] = useState<DeviceTemplate[]>(INITIAL_DEVICE_TEMPLATES);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [otaReleases, setOtaReleases] = useState<OTARelease[]>([
    {
      id: 'ota_01',
      version: 'v1.4.3-hotfix',
      targetPlatform: 'esp32',
      filename: 'firmware_esp32_boiler_v143.bin',
      sizeBytes: 1048576,
      checksum: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      createdAt: new Date().toISOString(),
      notes: 'Fix MQTT reconnection watchdog timer and ADC noise filtering'
    }
  ]);

  useEffect(() => {
    storage.set('devices', devices);
  }, [devices]);

  const addDevice = (params: { name: string; platform: HardwarePlatform; templateId?: string; tags?: string[] }): Device => {
    const template = templates.find(t => t.id === params.templateId);
    const token = generateToken(params.platform);

    const defaultStreams: Datastream[] = template ? template.datastreams.map(ds => ({
      ...ds,
      currentValue: ds.defaultValue ?? 0,
      lastUpdated: new Date().toISOString()
    })) : [
      { id: 'ds_v0', pin: 'V0', name: 'Sensor Telemetry', type: 'double' as DatastreamType, defaultValue: 0, currentValue: 0, lastUpdated: new Date().toISOString() },
      { id: 'ds_v1', pin: 'V1', name: 'Relay Switch', type: 'boolean' as DatastreamType, defaultValue: 0, currentValue: 0, lastUpdated: new Date().toISOString() }
    ];

    const newDev: Device = {
      id: 'dev_' + Math.random().toString(36).substring(2, 9),
      name: params.name,
      token,
      platform: params.platform,
      status: 'online',
      templateId: params.templateId,
      firmwareVersion: 'v1.0.0',
      lastSeen: new Date().toISOString(),
      rssi: -58,
      tags: params.tags || ['New Device'],
      datastreams: defaultStreams,
      shadow: {
        desired: { V1: 0 },
        reported: { V1: 0, V0: 0 },
        lastSyncedAt: new Date().toISOString(),
        version: 1
      }
    };

    setDevices(prev => [newDev, ...prev]);
    return newDev;
  };

  const updateDevice = (id: string, updates: Partial<Device>) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    if (selectedDevice?.id === id) setSelectedDevice(null);
  };

  const updateDatastream = (deviceId: string, pin: string, value: any) => {
    setDevices(prev => prev.map(d => {
      if (d.id !== deviceId) return d;
      const updatedStreams = d.datastreams.map(ds => {
        if (ds.pin.toUpperCase() === pin.toUpperCase()) {
          return { ...ds, currentValue: value, lastUpdated: new Date().toISOString() };
        }
        return ds;
      });
      return {
        ...d,
        datastreams: updatedStreams,
        lastSeen: new Date().toISOString(),
        status: 'online',
        shadow: {
          ...d.shadow,
          reported: { ...d.shadow.reported, [pin]: value }
        }
      };
    }));
  };

  const updateDeviceShadowDesired = (deviceId: string, desired: Record<string, any>) => {
    setDevices(prev => prev.map(d => {
      if (d.id !== deviceId) return d;
      return {
        ...d,
        shadow: {
          ...d.shadow,
          desired: { ...d.shadow.desired, ...desired },
          version: d.shadow.version + 1,
          lastSyncedAt: new Date().toISOString()
        }
      };
    }));
  };

  const addOtaRelease = (release: Omit<OTARelease, 'id' | 'createdAt'>) => {
    const newRelease: OTARelease = {
      ...release,
      id: 'ota_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    setOtaReleases(prev => [newRelease, ...prev]);
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        templates,
        selectedDevice,
        setSelectedDevice,
        addDevice,
        updateDevice,
        deleteDevice,
        updateDatastream,
        updateDeviceShadowDesired,
        otaReleases,
        addOtaRelease
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (!context) throw new Error('useDevices must be used within DeviceProvider');
  return context;
};

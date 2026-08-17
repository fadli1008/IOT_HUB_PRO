import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { TelemetryStreamState, TelemetryHistory, DeviceCommandPacket } from '../types/telemetry';
import { useDevices } from './DeviceContext';

// Global public MQTT broker with WSS support for browser clients
const MQTT_WS_BROKER = 'wss://broker.emqx.io:8084/mqtt';

interface TelemetryContextType {
  telemetry: TelemetryStreamState;
  history: TelemetryHistory;
  sendCommand: (deviceId: string, pin: string, value: any) => void;
  isSimulatorRunning: boolean;
  setIsSimulatorRunning: (running: boolean) => void;
  simulatorIntervalMs: number;
  setSimulatorIntervalMs: (ms: number) => void;
  logMessages: Array<{ id: string; timestamp: string; topic: string; payload: string; type: 'pub' | 'sub' | 'cmd' }>;
  clearLogs: () => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { devices, updateDatastream, updateDeviceShadowDesired } = useDevices();
  const [telemetry, setTelemetry] = useState<TelemetryStreamState>({});
  const [history, setHistory] = useState<TelemetryHistory>({});
  const [isSimulatorRunning, setIsSimulatorRunning] = useState<boolean>(true);
  const [simulatorIntervalMs, setSimulatorIntervalMs] = useState<number>(2000);
  const [logMessages, setLogMessages] = useState<Array<{ id: string; timestamp: string; topic: string; payload: string; type: 'pub' | 'sub' | 'cmd' }>>([]);

  const devicesRef = useRef(devices);
  useEffect(() => {
    devicesRef.current = devices;
  }, [devices]);

  // Initialize telemetry from devices
  useEffect(() => {
    const initialTele: TelemetryStreamState = {};
    const initialHist: TelemetryHistory = {};
    const now = Date.now();

    devices.forEach(dev => {
      initialTele[dev.id] = {};
      initialHist[dev.id] = {};
      dev.datastreams.forEach(ds => {
        const val = ds.currentValue ?? ds.defaultValue ?? 0;
        initialTele[dev.id][ds.pin] = val;
        
        // Populate 10 historical points
        if (typeof val === 'number') {
          initialHist[dev.id][ds.pin] = Array.from({ length: 15 }, (_, i) => ({
            timestamp: now - (15 - i) * 2000,
            value: Number((val + (Math.random() - 0.5) * 3).toFixed(2))
          }));
        }
      });
    });

    setTelemetry(initialTele);
    setHistory(initialHist);
  }, []);

  const addLog = useCallback((topic: string, payload: any, type: 'pub' | 'sub' | 'cmd') => {
    setLogMessages(prev => [
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        topic,
        payload: typeof payload === 'string' ? payload : JSON.stringify(payload),
        type
      },
      ...prev.slice(0, 49) // Keep last 50
    ]);
  }, []);

  const clearLogs = () => setLogMessages([]);

  const mqttClientRef = useRef<MqttClient | null>(null);

  // Live Cloud MQTT Broker Connection (wss://broker.emqx.io:8084/mqtt)
  useEffect(() => {
    try {
      const client = mqtt.connect(MQTT_WS_BROKER, {
        clientId: 'iothub_web_' + Math.random().toString(36).substring(2, 9),
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 3000
      });

      client.on('connect', () => {
        console.log('[IoT Hub Cloud] Terhubung ke Broker MQTT Publik via WebSocket WSS!');
        client.subscribe('iothub/v1/+/telemetry');
        client.subscribe('iothub/v1/+/status');
      });

      client.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          const parts = topic.split('/');
          const token = parts[2];

          addLog(topic, payload, 'sub');

          const currentDevices = devicesRef.current;
          const dev = currentDevices.find(d => d.token === token || d.id === token) || currentDevices[0];
          if (!dev) return;

          const now = Date.now();
          Object.entries(payload).forEach(([key, val]) => {
            const pin = key.toUpperCase();
            const numVal = typeof val === 'number' ? val : Number(val);

            if (!isNaN(numVal)) {
              setTelemetry(prev => ({
                ...prev,
                [dev.id]: {
                  ...(prev[dev.id] || {}),
                  [pin]: numVal
                }
              }));

              setHistory(prev => {
                const devHist = prev[dev.id] || {};
                const pinHist = devHist[pin] || [];
                return {
                  ...prev,
                  [dev.id]: {
                    ...devHist,
                    [pin]: [...pinHist.slice(-29), { timestamp: now, value: numVal }]
                  }
                };
              });

              updateDatastream(dev.id, pin, numVal);
            }
          });
        } catch (err) {
          console.error('[MQTT Message Error]', err);
        }
      });

      mqttClientRef.current = client;

      return () => {
        client.end();
      };
    } catch (e) {
      console.warn('[MQTT Connect Error]', e);
    }
  }, [addLog, updateDatastream]);

  const sendCommand = useCallback((deviceId: string, pin: string, value: any) => {
    // 1. Update shadow desired
    updateDeviceShadowDesired(deviceId, { [pin]: value });
    
    // 2. Dispatch simulated MQTT command topic
    const device = devicesRef.current.find(d => d.id === deviceId);
    const token = device ? device.token : 'token';
    const topic = `iothub/v1/${token}/command`;
    const payload = { [pin.toLowerCase()]: value, [pin]: value };
    addLog(topic, payload, 'cmd');

    // 3. Publish to live MQTT Broker if connected
    if (mqttClientRef.current && mqttClientRef.current.connected) {
      mqttClientRef.current.publish(topic, JSON.stringify(payload));
    }

    // 4. Immediately reflect in telemetry & reported state
    updateDatastream(deviceId, pin, value);
    setTelemetry(prev => ({
      ...prev,
      [deviceId]: {
        ...(prev[deviceId] || {}),
        [pin]: value
      }
    }));
  }, [addLog, updateDatastream, updateDeviceShadowDesired]);

  // Background Telemetry Simulator
  useEffect(() => {
    if (!isSimulatorRunning) return;

    const interval = setInterval(() => {
      const currentDevices = devicesRef.current;
      const now = Date.now();

      currentDevices.forEach(device => {
        // Find sensor datastreams
        device.datastreams.forEach(ds => {
          if (ds.type === 'double' || ds.type === 'integer') {
            const currentVal = telemetry[device.id]?.[ds.pin] ?? ds.defaultValue ?? 50;
            let delta = (Math.random() - 0.48) * (ds.max ? (ds.max - (ds.min || 0)) * 0.03 : 1.5);
            let nextVal = Number(currentVal) + delta;

            if (ds.min !== undefined && nextVal < ds.min) nextVal = ds.min;
            if (ds.max !== undefined && nextVal > ds.max) nextVal = ds.max;

            nextVal = Number(nextVal.toFixed(ds.type === 'integer' ? 0 : 2));

            // Update state
            setTelemetry(prev => ({
              ...prev,
              [device.id]: {
                ...(prev[device.id] || {}),
                [ds.pin]: nextVal
              }
            }));

            // Update history
            setHistory(prev => {
              const devHist = prev[device.id] || {};
              const pinHist = devHist[ds.pin] || [];
              return {
                ...prev,
                [device.id]: {
                  ...devHist,
                  [ds.pin]: [...pinHist.slice(-29), { timestamp: now, value: nextVal }]
                }
              };
            });

            // Update context
            updateDatastream(device.id, ds.pin, nextVal);
          }
        });

        // Add MQTT log periodically
        if (Math.random() > 0.6) {
          const sampleData: Record<string, any> = {};
          device.datastreams.slice(0, 3).forEach(ds => {
            sampleData[ds.pin.toLowerCase()] = telemetry[device.id]?.[ds.pin] ?? ds.defaultValue;
          });
          addLog(`iothub/v1/${device.token}/telemetry`, sampleData, 'pub');
        }
      });
    }, simulatorIntervalMs);

    return () => clearInterval(interval);
  }, [isSimulatorRunning, simulatorIntervalMs, telemetry, updateDatastream, addLog]);

  // Live Local Gateway Bridge (Polls local server.py at http://localhost:8000/api/v1/telemetry)
  useEffect(() => {
    const localPollInterval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/telemetry');
        if (!res.ok) return;
        const json = await res.json();
        if (json.data && Object.keys(json.data).length > 0) {
          const currentDevices = devicesRef.current;
          const now = Date.now();

          Object.entries(json.data).forEach(([tokenOrId, payload]: [string, any]) => {
            const dev = currentDevices.find(d => d.token === tokenOrId || d.id === tokenOrId) || currentDevices[0];
            if (!dev) return;

            Object.entries(payload).forEach(([key, val]) => {
              if (key === 'token') return;
              const pin = key.toUpperCase();
              const numVal = typeof val === 'number' ? val : Number(val);

              if (!isNaN(numVal)) {
                setTelemetry(prev => ({
                  ...prev,
                  [dev.id]: {
                    ...(prev[dev.id] || {}),
                    [pin]: numVal
                  }
                }));

                setHistory(prev => {
                  const devHist = prev[dev.id] || {};
                  const pinHist = devHist[pin] || [];
                  return {
                    ...prev,
                    [dev.id]: {
                      ...devHist,
                      [pin]: [...pinHist.slice(-29), { timestamp: now, value: numVal }]
                    }
                  };
                });

                updateDatastream(dev.id, pin, numVal);
              }
            });
          });
        }
      } catch (err) {
        // Local server not running or CORS, silently ignore
      }
    }, 1500);

    return () => clearInterval(localPollInterval);
  }, [updateDatastream]);

  return (
    <TelemetryContext.Provider
      value={{
        telemetry,
        history,
        sendCommand,
        isSimulatorRunning,
        setIsSimulatorRunning,
        simulatorIntervalMs,
        setSimulatorIntervalMs,
        logMessages,
        clearLogs
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) throw new Error('useTelemetry must be used within TelemetryProvider');
  return context;
};

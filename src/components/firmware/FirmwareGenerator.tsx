import React, { useState } from 'react';
import { useDevices } from '../../context/DeviceContext';
import { HardwarePlatform } from '../../types/device';
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  Wifi,
  Sparkles,
  Layers
} from 'lucide-react';

export const FirmwareGenerator: React.FC = () => {
  const { devices } = useDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || '');
  const [selectedPlatform, setSelectedPlatform] = useState<HardwarePlatform>('esp32');
  const [wifiSsid, setWifiSsid] = useState('MyHome_WiFi');
  const [wifiPass, setWifiPass] = useState('SuperSecretPassword');
  const [isCopied, setIsCopied] = useState(false);

  const currentDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const token = currentDevice ? currentDevice.token : 'YOUR_DEVICE_TOKEN';

  const generateCode = (): { filename: string; code: string } => {
    if (selectedPlatform === 'esp32' || selectedPlatform === 'esp8266' || selectedPlatform === 'arduino') {
      return {
        filename: `${currentDevice?.name.toLowerCase().replace(/\s+/g, '_')}_esp32.ino`,
        code: `/*
 * ============================================================================
 * Project      : IoT Hub ESP32 Production Client
 * Developer    : Fadli (IoT Hub Lead Architect)
 * Device Name  : ${currentDevice?.name}
 * Generated At : ${new Date().toISOString()}
 * ============================================================================
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// ========== KREDENSIAL & JARINGAN ==========
const char* WIFI_SSID     = "${wifiSsid}";
const char* WIFI_PASSWORD = "${wifiPass}";

// Broker MQTT Cloud Global (Publik & Gratis Aktif)
const char* IOTHUB_BROKER = "broker.emqx.io";
const int   IOTHUB_PORT   = 1883; // Port standar MQTT (atau 8883 dengan TLS)
const char* DEVICE_TOKEN  = "${token}";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 2000; // Kirim data tiap 2 detik

// ========== HANDLER PERINTAH DARI DASHBOARD ==========
void handleCloudCommand(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, payload, length);

  if (error) {
    Serial.print(F("[IoT Hub] JSON parsing failed: "));
    Serial.println(error.f_str());
    return;
  }

  // Handle Virtual Pin V2 (Relay Utama)
  if (doc.containsKey("v2") || doc.containsKey("V2")) {
    int state = doc.containsKey("v2") ? doc["v2"].as<int>() : doc["V2"].as<int>();
    digitalWrite(2, state ? HIGH : LOW);
    Serial.printf("[IoT Hub] Command Relay V2 -> %s\\n", state ? "ON" : "OFF");
  }

  // Handle Virtual Pin V5 (Slider PWM)
  if (doc.containsKey("v5") || doc.containsKey("V5")) {
    int pwm = doc.containsKey("v5") ? doc["v5"].as<int>() : doc["V5"].as<int>();
    analogWrite(18, pwm);
    Serial.printf("[IoT Hub] Command PWM V5 -> %d\\n", pwm);
  }
}

// ========== REKONEKSI MQTT AUTO-BACKOFF ==========
void connectToIoTHub() {
  while (!mqttClient.connected()) {
    Serial.print(F("[IoT Hub] Menghubungkan ke Broker MQTT..."));
    
    String lwtTopic = "iothub/v1/" + String(DEVICE_TOKEN) + "/status";
    String subTopic = "iothub/v1/" + String(DEVICE_TOKEN) + "/command";
    String clientId = "ESP32_" + String(random(0xffff), HEX);

    if (mqttClient.connect(clientId.c_str(), DEVICE_TOKEN, "", lwtTopic.c_str(), 1, true, "{\\"state\\":\\"offline\\"}")) {
      Serial.println(F(" BERHASIL!"));
      mqttClient.publish(lwtTopic.c_str(), "{\\"state\\":\\"online\\"}", true);
      mqttClient.subscribe(subTopic.c_str(), 1);
    } else {
      Serial.printf(" Gagal (rc=%d), coba lagi 3 detik...\\n", mqttClient.state());
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT);
  pinMode(18, OUTPUT);

  // Connect WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(F("\\nWiFi Terhubung!"));

  tlsClient.setInsecure(); // Dev mode (atau pasang CA cert)
  mqttClient.setServer(IOTHUB_BROKER, IOTHUB_PORT);
  mqttClient.setCallback(handleCloudCommand);
}

void loop() {
  if (!mqttClient.connected()) {
    connectToIoTHub();
  }
  mqttClient.loop();

  unsigned long now = millis();
  if (now - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    lastTelemetryTime = now;

    // Simulasi / Baca Sensor Riil
    float temperature = 28.5 + (random(-50, 50) / 100.0);
    float pressure    = 4.8 + (random(-10, 10) / 100.0);

    StaticJsonDocument<256> doc;
    doc["v0"] = serialized(String(temperature, 2));
    doc["v4"] = serialized(String(pressure, 2));
    doc["rssi"] = WiFi.RSSI();

    char buffer[256];
    size_t len = serializeJson(doc, buffer);

    String pubTopic = "iothub/v1/" + String(DEVICE_TOKEN) + "/telemetry";
    mqttClient.publish(pubTopic.c_str(), buffer, len);

    Serial.printf("[Data Sent] Temp: %.2f°C | Pressure: %.2f bar\\n", temperature, pressure);
  }
}`
      };
    } else if (selectedPlatform === 'raspberry_pi') {
      return {
        filename: `${currentDevice?.name.toLowerCase().replace(/\s+/g, '_')}_edge.py`,
        code: `"""
============================================================================
Project      : IoT Hub Edge Python Gateway
Developer    : Fadli (IoT Hub Lead Architect)
Device Name  : ${currentDevice?.name}
Target Board : Raspberry Pi 4 / Linux SBC
============================================================================
"""

import asyncio
import json
import logging
import psutil
from paho.mqtt import client as mqtt_client

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

BROKER_HOST  = "broker.emqx.io"
BROKER_PORT  = 1883
DEVICE_TOKEN = "${token}"

TOPIC_TELEMETRY = f"iothub/v1/{DEVICE_TOKEN}/telemetry"
TOPIC_COMMAND   = f"iothub/v1/{DEVICE_TOKEN}/command"
TOPIC_STATUS    = f"iothub/v1/{DEVICE_TOKEN}/status"

class EdgeClient:
    def __init__(self):
        self.client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION2, f"rpi_{DEVICE_TOKEN[:8]}")
        self.client.username_pw_set(DEVICE_TOKEN, "")
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        self.client.will_set(TOPIC_STATUS, json.dumps({"state": "offline"}), qos=1, retain=True)

    def _on_connect(self, client, userdata, flags, rc, properties=None):
        if rc == 0:
            logging.info("[IoT Hub] Terhubung ke Broker Cloud (broker.emqx.io)!")
            client.publish(TOPIC_STATUS, json.dumps({"state": "online"}), qos=1, retain=True)
            client.subscribe(TOPIC_COMMAND, qos=1)

    def _on_message(self, client, userdata, msg):
        payload = json.loads(msg.payload.decode())
        logging.info(f"[Command Received] -> {payload}")

    def start(self):
        self.client.connect(BROKER_HOST, BROKER_PORT, keepalive=60)
        self.client.loop_start()

    def send_telemetry(self, data: dict):
        self.client.publish(TOPIC_TELEMETRY, json.dumps(data), qos=1)

async def main():
    iot = EdgeClient()
    iot.start()

    while True:
        cpu = psutil.cpu_percent()
        ram = psutil.virtual_memory().percent
        iot.send_telemetry({"v0": cpu, "v1": ram})
        logging.info(f"[Telemetry] CPU: {cpu}% | RAM: {ram}%")
        await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(main())`
      };
    } else {
      return {
        filename: `${currentDevice?.name.toLowerCase().replace(/\s+/g, '_')}_main.py`,
        code: `# MicroPython Client for ${currentDevice?.name}
# Developed by: Fadli (IoT Hub Lead Architect)
import time, ujson, network, machine
from umqtt.simple import MQTTClient

WIFI_SSID = "${wifiSsid}"
WIFI_PASS = "${wifiPass}"
DEVICE_TOKEN = "${token}"
BROKER = "broker.emqx.io"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASS)
while not wlan.isconnected():
    time.sleep(0.5)

client = MQTTClient("esp32_mpy", BROKER, port=1883, user=DEVICE_TOKEN, password="")
client.connect()
print("[IoT Hub] MicroPython Connected!")

while True:
    client.publish(b"iothub/v1/" + DEVICE_TOKEN + b"/telemetry", ujson.dumps({"v0": 29.4}))
    time.sleep(3)`
      };
    }
  };

  const generated = generateCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(generated.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generated.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generated.filename;
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0B0F19] p-6 space-y-6">
      {/* Top Header */}
      <div className="pb-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold font-heading text-white">Interactive Firmware Generator</h1>
          <span className="text-[10px] uppercase font-mono font-bold bg-brand-500/20 text-brand-400 px-2.5 py-0.5 rounded-full border border-brand-500/30">
            SDK v1.0
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Generate plug-and-play source code tailored for your microcontrollers with pre-configured Virtual Pins and Tokens
        </p>
      </div>

      {/* Control Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-3xl glass-panel border border-gray-800">
        {/* Device Picker */}
        <div>
          <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Target Device</label>
          <select
            value={selectedDeviceId}
            onChange={e => setSelectedDeviceId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 font-mono"
          >
            {devices.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.platform})</option>
            ))}
          </select>
        </div>

        {/* Framework Picker */}
        <div>
          <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Framework / Language</label>
          <select
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value as any)}
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 font-mono"
          >
            <option value="esp32">ESP32 (Arduino C++)</option>
            <option value="raspberry_pi">Raspberry Pi (Python Asyncio)</option>
            <option value="stm32">MicroPython (ESP32/RP2040)</option>
          </select>
        </div>

        {/* WiFi SSID */}
        <div>
          <label className="text-[11px] text-gray-400 font-medium block mb-1.5">WiFi Network (SSID)</label>
          <input
            type="text"
            value={wifiSsid}
            onChange={e => setWifiSsid(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 font-mono"
          />
        </div>

        {/* WiFi Password */}
        <div>
          <label className="text-[11px] text-gray-400 font-medium block mb-1.5">WiFi Password</label>
          <input
            type="text"
            value={wifiPass}
            onChange={e => setWifiPass(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 font-mono"
          />
        </div>
      </div>

      {/* Code Editor Preview Box */}
      <div className="flex-1 flex flex-col rounded-3xl glass-panel border border-gray-800 overflow-hidden shadow-2xl">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-950/80 border-b border-gray-800 text-xs">
          <div className="flex items-center space-x-2 font-mono text-gray-300">
            <Code2 className="w-4 h-4 text-brand-400" />
            <span className="font-bold">{generated.filename}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl transition text-xs font-mono"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-brand-500 hover:bg-brand-400 text-black font-bold rounded-xl transition text-xs font-mono shadow-md glow-cyan"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <pre className="flex-1 p-5 overflow-auto font-mono text-xs text-gray-200 leading-relaxed bg-[#0B0F19]/90 selection:bg-brand-500 selection:text-black">
          <code>{generated.code}</code>
        </pre>
      </div>
    </div>
  );
};

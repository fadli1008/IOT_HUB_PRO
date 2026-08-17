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
  Layers,
  Radio,
  Globe,
  Package,
  BookOpen,
  Sliders,
  Gauge,
  Activity,
  ToggleLeft,
  MapPin,
  Flame,
  Palette
} from 'lucide-react';

export const FirmwareGenerator: React.FC = () => {
  const { devices } = useDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || '');
  const [mode, setMode] = useState<'iothub_lib' | 'mqtt_raw' | 'http_rest'>('iothub_lib');
  const [selectedPlatform, setSelectedPlatform] = useState<HardwarePlatform>('esp32');
  const [wifiSsid, setWifiSsid] = useState('MyHome_WiFi');
  const [wifiPass, setWifiPass] = useState('SuperSecretPassword');
  const [isCopied, setIsCopied] = useState(false);

  const currentDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const token = currentDevice ? currentDevice.token : 'YOUR_DEVICE_TOKEN';

  const generateCode = (): { filename: string; code: string } => {
    // ==============================================================
    // 1. IOTHUB PRO ARDUINO LIBRARY (RECOMMENDED - BLYNK-LIKE SYNTAX)
    // ==============================================================
    if (mode === 'iothub_lib') {
      return {
        filename: `${currentDevice?.name.toLowerCase().replace(/\s+/g, '_')}_iothub_app.ino`,
        code: `/*
 * ============================================================================
 * Project      : ${currentDevice?.name} — IoTHubPro Client
 * Library      : IoTHubPro Arduino Library v1.0.0
 * Developer    : Muhamad Fadli (Lead IoT Architect)
 * Target       : ESP32 / ESP8266
 * Website      : https://iothubpro.vercel.app/
 * ============================================================================
 * 
 * 📌 WIDGET PIN MAPPING REFERENCE:
 * • V0  : [GAUGE]            -> IoTHub.virtualWrite(V0, temperature);
 * • V1  : [LINE CHART]       -> IoTHub.virtualWrite(V1, humidity);
 * • V2  : [RELAY SWITCH]     -> IOTHUB_WRITE(V2) { int val = param.asInt(); }
 * • V4  : [PRESSURE GAUGE]   -> IoTHub.virtualWrite(V4, pressure);
 * • V5  : [ANALOG SLIDER]    -> IOTHUB_WRITE(V5) { int pwm = param.asInt(); }
 * • V6  : [LIQUID TANK]      -> IoTHub.virtualWrite(V6, tankLevelLiters);
 * • V7  : [RGB COLOR PICKER] -> IOTHUB_WRITE(V7) { String hex = param.asStr(); }
 * • V8  : [GPS FLEET MAP]    -> IoTHub.locationWrite(V8, lat, lon, speed);
 */

#include <IoTHubPro.h>

// ========== 1. KREDENSIAL PERANGKAT & WI-FI ==========
const char* AUTH_TOKEN = "${token}";
const char* WIFI_SSID  = "${wifiSsid}";
const char* WIFI_PASS  = "${wifiPass}";

#define RELAY_PIN 2   // Pin Onboard LED / Relay Fisik
#define PWM_PIN   18  // Pin PWM Motor Driver

// ============================================================================
// 2. HANDLER PERINTAH DARI DASHBOARD WEB (WEB -> ESP32)
// ============================================================================

// [WIDGET RELAY SWITCH] Terpanggil otomatis saat tombol V2 di Web diklik
IOTHUB_WRITE(V2) {
  int relayState = param.asInt();
  digitalWrite(RELAY_PIN, relayState ? HIGH : LOW);
  Serial.printf("\\n[WEB] 🎛️ Relay V2 diubah ke: %s\\n", relayState ? "ON (1)" : "OFF (0)");
}

// [WIDGET ANALOG SLIDER] Terpanggil otomatis saat Slider PWM V5 digeser (0-255)
IOTHUB_WRITE(V5) {
  int pwmValue = param.asInt();
  analogWrite(PWM_PIN, pwmValue);
  Serial.printf("\\n[WEB] 🎚️ Slider PWM V5 diset ke: %d\\n", pwmValue);
}

// [WIDGET RGB COLOR PICKER] Terpanggil saat warna V7 diubah di Web
IOTHUB_WRITE(V7) {
  String hexColor = param.asStr();
  Serial.printf("\\n[WEB] 🎨 Warna RGB V7 diubah ke: %s\\n", hexColor.c_str());
}

// ============================================================================
// 3. SETUP & INISIALISASI
// ============================================================================
void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(PWM_PIN, OUTPUT);

  // Inisialisasi otomatis koneksi Wi-Fi dan Cloud Broker
  IoTHub.begin(AUTH_TOKEN, WIFI_SSID, WIFI_PASS);
}

// ============================================================================
// 4. LOOP UTAMA
// ============================================================================
void loop() {
  // Wajib dipanggil untuk memproses packet data cloud
  IoTHub.run();

  // Kirim data telemetri berkala tiap 2 detik
  static unsigned long lastSend = 0;
  if (millis() - lastSend >= 2000) {
    lastSend = millis();

    // 1. Baca Sensor Fisik (atau Simulasi)
    float temperature = 28.5 + (random(-30, 30) / 10.0);
    float humidity    = 65.0 + (random(-20, 20) / 10.0);
    float pressure    = 4.8  + (random(-5, 5) / 10.0);
    float tankLevel   = 750.0 + random(-25, 25);

    // 2. Kirim Nilai ke Masing-Masing Widget di Web:
    IoTHub.virtualWrite(V0, temperature);                        // [Radial Gauge]
    IoTHub.virtualWrite(V1, humidity);                           // [Time-Series Chart]
    IoTHub.virtualWrite(V4, pressure);                           // [Display Tekanan]
    IoTHub.virtualWrite(V6, tankLevel);                          // [Liquid Tank Silo]
    IoTHub.locationWrite(V8, -6.2088, 106.8456, 45.0);           // [GPS Fleet Map]

    Serial.printf("[TELEMETRI] Suhu: %.1f°C | Hum: %.1f%% | Press: %.1f bar | Tank: %.0f L\\n",
                  temperature, humidity, pressure, tankLevel);
  }
}`
      };
    }

    // ==============================================================
    // 2. HTTP REST INGESTION (SIMPLE HTTP POST)
    // ==============================================================
    if (mode === 'http_rest') {
      return {
        filename: `${currentDevice?.name.toLowerCase().replace(/\s+/g, '_')}_http_post.ino`,
        code: `/*
 * ============================================================================
 * Project      : ${currentDevice?.name} — HTTP REST Client
 * Developer    : Muhamad Fadli (IoT Hub Lead Architect)
 * Target       : ESP32 / ESP8266 (No MQTT required)
 * ============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

const char* WIFI_SSID     = "${wifiSsid}";
const char* WIFI_PASSWORD = "${wifiPass}";

// Endpoint Vercel API Live
const char* API_URL       = "https://iothubpro.vercel.app/api/telemetry";
const char* DEVICE_TOKEN  = "${token}";

#define RELAY_PIN 2

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\\n[OK] Wi-Fi Terhubung!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient http;
    http.begin(client, API_URL);
    http.addHeader("Content-Type", "application/json");

    float suhu = 29.5 + (random(-20, 20) / 10.0);
    float tekanan = 4.8 + (random(-5, 5) / 10.0);

    StaticJsonDocument<256> doc;
    doc["token"] = DEVICE_TOKEN;
    doc["v0"]    = suhu;      // Virtual Pin V0 (Suhu)
    doc["v4"]    = tekanan;   // Virtual Pin V4 (Tekanan)
    doc["v6"]    = 800;       // Virtual Pin V6 (Tank)

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    int httpCode = http.POST(jsonPayload);
    if (httpCode > 0) {
      Serial.printf("[HTTP POST %d] Data terkirim: %s\\n", httpCode, jsonPayload.c_str());
    }
    http.end();
  }
  delay(2000);
}`
      };
    }

    // ==============================================================
    // 3. RAW MQTT (ADVANCED PUBSUBCLIENT)
    // ==============================================================
    return {
      filename: `${currentDevice?.name.toLowerCase().replace(/\s+/g, '_')}_raw_mqtt.ino`,
      code: `/*
 * ============================================================================
 * Project      : ${currentDevice?.name} — Raw MQTT Client
 * Developer    : Muhamad Fadli (IoT Hub Lead Architect)
 * Target       : ESP32 (broker.emqx.io)
 * ============================================================================
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* WIFI_SSID     = "${wifiSsid}";
const char* WIFI_PASSWORD = "${wifiPass}";
const char* IOTHUB_BROKER = "broker.emqx.io";
const int   IOTHUB_PORT   = 1883;
const char* DEVICE_TOKEN  = "${token}";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

void handleCommand(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<256> doc;
  deserializeJson(doc, payload, length);
  if (doc.containsKey("v2") || doc.containsKey("V2")) {
    int state = doc["v2"] | doc["V2"];
    digitalWrite(2, state ? HIGH : LOW);
  }
}

void connectMQTT() {
  while (!mqttClient.connected()) {
    String clientId = "ESP32_" + String(random(0xffff), HEX);
    String subTopic = "iothub/v1/" + String(DEVICE_TOKEN) + "/command";
    if (mqttClient.connect(clientId.c_str())) {
      mqttClient.subscribe(subTopic.c_str());
    } else {
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  mqttClient.setServer(IOTHUB_BROKER, IOTHUB_PORT);
  mqttClient.setCallback(handleCommand);
}

void loop() {
  if (!mqttClient.connected()) connectMQTT();
  mqttClient.loop();

  static unsigned long lastSend = 0;
  if (millis() - lastSend >= 2000) {
    lastSend = millis();
    StaticJsonDocument<256> doc;
    doc["v0"] = 28.5 + (random(-20, 20) / 10.0);
    doc["v4"] = 4.8;

    char buffer[256];
    serializeJson(doc, buffer);
    String pubTopic = "iothub/v1/" + String(DEVICE_TOKEN) + "/telemetry";
    mqttClient.publish(pubTopic.c_str(), buffer);
  }
}`
    };
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
      <div className="pb-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-heading text-white">Interactive Firmware SDK & Generator</h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-brand-500/20 text-brand-400 px-2.5 py-0.5 rounded-full border border-brand-500/30">
              v1.0 Industrial
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Generate clean, ready-to-flash firmware using the official <strong>IoTHubPro</strong> Arduino Library or native HTTP/MQTT protocols.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="https://github.com/fadli1008/IOT_HUB_PRO/tree/main/libraries/IoTHubPro"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-700 hover:border-brand-500 text-gray-300 hover:text-white text-xs font-mono transition"
          >
            <Package className="w-4 h-4 text-brand-400" />
            <span>View Library on GitHub</span>
          </a>
        </div>
      </div>

      {/* Integration Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/80 p-3 rounded-2xl border border-gray-800">
        <span className="text-xs text-gray-300 font-mono font-semibold flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Select Integration Method:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode('iothub_lib')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition ${
              mode === 'iothub_lib'
                ? 'bg-brand-500 text-black shadow-md glow-cyan'
                : 'text-gray-400 hover:text-white bg-gray-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>IoTHubPro Library (Recommended)</span>
          </button>
          <button
            onClick={() => setMode('http_rest')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition ${
              mode === 'http_rest'
                ? 'bg-emerald-500 text-black shadow-md glow-green'
                : 'text-gray-400 hover:text-white bg-gray-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>HTTP REST (No MQTT Lib)</span>
          </button>
          <button
            onClick={() => setMode('mqtt_raw')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition ${
              mode === 'mqtt_raw'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white bg-gray-800/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Raw MQTT PubSubClient</span>
          </button>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-3xl glass-panel border border-gray-800">
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
      <div className="flex-1 flex flex-col rounded-3xl glass-panel border border-gray-800 overflow-hidden shadow-2xl min-h-[420px]">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-950/80 border-b border-gray-800 text-xs">
          <div className="flex items-center space-x-2 font-mono text-gray-300">
            <Code2 className="w-4 h-4 text-brand-400" />
            <span className="font-bold">{generated.filename}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-brand-500/20 text-brand-400 border border-brand-500/30">
              {mode === 'iothub_lib' ? 'IoTHubPro Library' : mode === 'http_rest' ? 'HTTP REST Client' : 'Raw MQTT'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl transition text-xs font-mono"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-brand-500 hover:bg-brand-400 text-black font-bold rounded-xl transition text-xs font-mono shadow-md glow-cyan"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .ino</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <pre className="flex-1 p-5 overflow-auto font-mono text-xs text-gray-200 leading-relaxed bg-[#0B0F19]/90 selection:bg-brand-500 selection:text-black">
          <code>{generated.code}</code>
        </pre>
      </div>

      {/* Widget Pin Mapping Cheat Sheet */}
      <div className="p-6 rounded-3xl glass-panel border border-gray-800 space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-bold text-white font-heading">Panduan Integrasi Virtual Pin Berbagai Macam Widget</h3>
        </div>
        <p className="text-xs text-gray-400">
          Gunakan fungsi sederhana di bawah ini pada program Arduino Anda untuk mengontrol atau membaca data dari berbagai jenis widget di dashboard:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          {/* Widget 1: Gauge */}
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <div className="flex items-center space-x-2 text-brand-400 font-bold">
              <Gauge className="w-4 h-4" />
              <span>1. Radial & Linear Gauge</span>
            </div>
            <p className="text-[11px] text-gray-400">Mengirim angka sensor suhu / tegangan ke jarum gauge:</p>
            <div className="p-2.5 rounded-xl bg-black/60 text-cyan-300 text-[11px]">
              <code>IoTHub.virtualWrite(V0, temperature);</code>
            </div>
          </div>

          {/* Widget 2: Line Chart */}
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Activity className="w-4 h-4" />
              <span>2. Time-Series Line Chart</span>
            </div>
            <p className="text-[11px] text-gray-400">Mengirim data grafik waktu nyata (live history):</p>
            <div className="p-2.5 rounded-xl bg-black/60 text-emerald-300 text-[11px]">
              <code>IoTHub.virtualWrite(V1, humidity);</code>
            </div>
          </div>

          {/* Widget 3: Relay Switch */}
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <ToggleLeft className="w-4 h-4" />
              <span>3. Relay Switch Toggle</span>
            </div>
            <p className="text-[11px] text-gray-400">Menerima saklar ON/OFF dari Web untuk kontrol lampu/pompa:</p>
            <div className="p-2.5 rounded-xl bg-black/60 text-amber-300 text-[11px]">
              <code>{`IOTHUB_WRITE(V2) {
  int state = param.asInt();
  digitalWrite(RELAY_PIN, state);
}`}</code>
            </div>
          </div>

          {/* Widget 4: PWM Slider */}
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 font-bold">
              <Sliders className="w-4 h-4" />
              <span>4. Analog Slider / Dimmer</span>
            </div>
            <p className="text-[11px] text-gray-400">Menerima nilai slider pengatur kecepatan motor (0-255):</p>
            <div className="p-2.5 rounded-xl bg-black/60 text-purple-300 text-[11px]">
              <code>{`IOTHUB_WRITE(V5) {
  int pwm = param.asInt();
  analogWrite(PWM_PIN, pwm);
}`}</code>
            </div>
          </div>

          {/* Widget 5: Liquid Tank */}
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <div className="flex items-center space-x-2 text-blue-400 font-bold">
              <Flame className="w-4 h-4" />
              <span>5. Liquid Tank / Silo</span>
            </div>
            <p className="text-[11px] text-gray-400">Mengirim level ketinggian cairan (Liter / Persen):</p>
            <div className="p-2.5 rounded-xl bg-black/60 text-blue-300 text-[11px]">
              <code>IoTHub.virtualWrite(V6, waterLiters);</code>
            </div>
          </div>

          {/* Widget 6: GPS Map */}
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <div className="flex items-center space-x-2 text-rose-400 font-bold">
              <MapPin className="w-4 h-4" />
              <span>6. GPS Fleet Map</span>
            </div>
            <p className="text-[11px] text-gray-400">Mengirim koordinat armada mobil/kapal (Lat, Lon, Speed):</p>
            <div className="p-2.5 rounded-xl bg-black/60 text-rose-300 text-[11px]">
              <code>IoTHub.locationWrite(V8, -6.2088, 106.8456, 45.2);</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

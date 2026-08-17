# 🌐 IoT Hub Pro — Universal & Industrial IoT Platform

<div align="center">

![IoT Hub Banner](https://img.shields.io/badge/IoT_Hub-Pro_v1.0.0-06b6d4?style=for-the-badge&logo=iot&logoColor=black)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

**Platform IoT Universal & Industri yang Fleksibel, Agnostik Hardware, dan Berkinerja Tinggi.**  
*Didesain dan dikembangkan sebagai solusi modern yang menggabungkan kemudahan drag-and-drop ala **Blynk**, fleksibilitas aturan ala **ThingsBoard**, dan keandalan skematik **SCADA Industri**.*

[🚀 Fitur Utama](#-fitur-utama) • [⚡ Mulai Cepat](#-panduan-instalasi--menjalankan-cepat) • [🔌 Integrasi ESP32 Fisik](#-integrasi-esp32-fisik-ke-localhost) • [📊 Ekspor Data Historis](#-ekspor-data-historis--analitik) • [📖 Panduan Lengkap](#-dokumen-dan-panduan-lengkap)

</div>

---

## 👨‍💻 Developer & Pemilik Proyek
* **Lead Developer & Architect**: **Muhamad Fadli** ([@fadli1008](https://github.com/fadli1008))
* **Repository**: [https://github.com/fadli1008/IOT_HUB_PRO](https://github.com/fadli1008/IOT_HUB_PRO)

---

## 📑 Daftar Isi
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Fitur Utama](#-fitur-utama)
- [Panduan Instalasi & Menjalankan Cepat](#-panduan-instalasi--menjalankan-cepat)
- [Integrasi ESP32 Fisik ke Localhost](#-integrasi-esp32-fisik-ke-localhost)
- [Ekspor Data Historis & Analitik](#-ekspor-data-historis--analitik)
- [Dokumen dan Panduan Lengkap](#-dokumen-dan-panduan-lengkap)
- [Struktur Direktori Proyek](#-struktur-direktori-proyek)

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────┐       HTTP / MQTTS :8883       ┌──────────────────────────────────────────────┐
│     HARDWARE KUSTOM     │ ─────────────────────────────▶ │            IoT Hub Platform (Local / Cloud)  │
│ • ESP32 / ESP8266 (C++) │                                │ ┌──────────────────────────────────────────┐ │
│ • Raspberry Pi (Python) │ ◀───────────────────────────── │ │  1. Local Bridge Gateway (server.py)     │ │
│ • MicroPython / STM32   │       Command & Shadow Delta   │ │     REST Ingestion & WebSocket Server    │ │
│ • PLC Modbus RTU/TCP    │                                │ └────────────────────┬─────────────────────┘ │
└─────────────────────────┘                                │                      │ Real-time Stream      │
                                                           │ ┌────────────────────▼─────────────────────┐ │
                                                           │ │  2. WYSIWYG Drag & Drop UI (React 18)    │ │
                                                           │ │     Gauges, Charts, SCADA, Map, History  │ │
                                                           │ └──────────────────────────────────────────┘ │
                                                           └──────────────────────────────────────────────┘
```

---

## 🌟 Fitur Utama

### 1. 🚪 Gated Authentication & Onboarding
* **Registrasi Mandiri**: Formulir pendaftaran akun aman, dukungan Social Sign-Up (Google & GitHub), dan simulasi verifikasi email OTP 6-Digit.
* **Onboarding Wizard**: Pemilihan persona (*Maker*, *Startup*, atau *Industri*) dan aktivasi otomatis paket **Free Lifetime (5 Perangkat Gratis)**.

### 2. 🎛️ WYSIWYG Drag & Drop Dashboard Builder
* **Canvas Grid 12/24 Kolom Responsif**: Pengaturan tata letak leluasa dengan *magnetic snap-to-grid* dan *resize handles*.
* **Property Inspector (Sidebar Kanan)**: Konfigurasi data binding **Virtual Pin (`V0`–`V255`)**, rumus transformasi (`value * 1.8 + 32`), pewarnaan alarm dinamis (*Warning & Critical*), serta tema kartu (*Glassmorphism*, *Solid*, *Cyber Glow*).
* **Multi-Viewport & Mode Kiosk**: Pratinjau responsif untuk Desktop, Tablet, Smartphone (Mobile), serta mode Kiosk Full-Screen TV.

### 3. 🧭 Katalog Widget Industri Lengkap
* 🧭 **Radial Gauge**: Speedometer presisi dengan busur warna peringatan dinamis.
* 📈 **Time-Series Chart**: Grafik multi-variabel real-time streaming (update 1 detik) dengan tombol quick export CSV.
* 🎛️ **Relay Switch**: Saklar kontrol aktuator industri dengan dialog konfirmasi keselamatan.
* 🎚️ **Analog Slider**: Pengatur dimmer / PWM dengan feedback numerik langsung.
* 💧 **Liquid Tank**: Visualisasi tangki cairan silinder dengan level persentase dinamis.
* 🏭 **SCADA HMI Schematic**: Diagram industri interaktif (Boiler Core, Heat Exchanger, Motor Pompa, dan pipa beranimasi alir).
* 🗺️ **GPS Fleet Map**: Peta pelacakan armada kendaraan berbasis **OpenStreetMap** dan mode **Cyber Radar**.
* 🎨 **RGB Color Picker** & 💻 **Serial Terminal Console**.

### 4. 📟 Device Fleet & Digital Twin (Device Shadow)
* Manajemen armada perangkat, status koneksi (*Online/Offline*), sinyal RSSI, dan penyalin token 1-klik.
* **Digital Twin Shadow Inspector**: Pemantau status *Desired State* vs *Reported State* dengan fitur *Push Delta Sync*.

### 5. 📊 Historical Telemetry Analytics & 1-Click Export
* Analisis data time-series berdasarkan rentang waktu (`1h`, `24h`, `7d`, `30d`).
* Kartu statistik otomatis: Total Records, Nilai Rata-rata, Rentang Min/Max.
* **1-Click Export CSV**: Format tabel standar untuk Microsoft Excel dan Google Sheets.
* **1-Click Export JSON**: Format data untuk pengolahan Python Pandas / Data Science.

### 6. 🧪 Built-in Virtual Hardware Simulator
* Papan sirkuit virtual di dalam browser untuk menguji sensor suhu (DHT22), tekanan, dan tombol relay tanpa perlu perangkat fisik di awal.

### 7. 💻 Interactive Firmware Generator & SDK
* Generator kode otomatis siap pakai dengan token yang tertanam langsung untuk **ESP32 (Arduino C++)**, **Raspberry Pi (Python)**, dan **ESP32 (MicroPython)**.

### 8. ⚙️ Visual Rule Engine & Automations
* Logika otomasi: **WHEN** (ambang batas sensor terlampaui) ➡️ **THEN** (kirim notifikasi Telegram/Email atau matikan relay otomatis).

### 9. 📖 OpenAPI 3.1 REST Docs & MQTT Playground
* Dokumentasi REST API interaktif dengan live test execution, generator perintah `cURL`, dan referensi topik MQTT.

---

## ⚡ Panduan Instalasi & Menjalankan Cepat

### Prasyarat:
* **Node.js** v18+ dan **npm** v9+
* **Python** v3.10+ (opsional, untuk menjalankan gateway lokal)

### 1. Clone Repository
```powershell
git clone https://github.com/fadli1008/IOT_HUB_PRO.git
cd IOT_HUB_PRO
```

### 2. Instalasi Dependensi Frontend
```powershell
npm install
```

### 3. Jalankan Web Dashboard
```powershell
npm run dev
```
Buka browser Anda di: **`http://localhost:5173/`**

### 4. Build untuk Production (Opsional)
```powershell
npm run build
```

---

## 📦 Library Arduino Resmi: `IoTHubPro` (Sangat Direkomendasikan ⭐)

Untuk kemudahan integrasi dengan sintaks intuitif ala **Blynk** & **ThingsBoard**, gunakan library **`IoTHubPro`** yang tersedia di folder [`libraries/IoTHubPro`](./libraries/IoTHubPro):

```cpp
#include <IoTHubPro.h>

const char* AUTH_TOKEN = "dev_esp32_boiler_01";
const char* WIFI_SSID  = "NAMA_WIFI_ANDA";
const char* WIFI_PASS  = "PASSWORD_WIFI_ANDA";

// Kontrol Relay (V2) dari Web Dashboard
IOTHUB_WRITE(V2) {
  int state = param.asInt();
  digitalWrite(2, state ? HIGH : LOW);
}

// Kontrol Dimmer / Slider PWM (V5) dari Web Dashboard
IOTHUB_WRITE(V5) {
  int pwm = param.asInt();
  analogWrite(18, pwm);
}

void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT);
  IoTHub.begin(AUTH_TOKEN, WIFI_SSID, WIFI_PASS); // Sambung Wi-Fi & Cloud Broker otomatis
}

void loop() {
  IoTHub.run(); // Wajib di loop

  static unsigned long lastSend = 0;
  if (millis() - lastSend > 2000) {
    lastSend = millis();
    IoTHub.virtualWrite(V0, 28.5);                        // Radial Gauge (Suhu)
    IoTHub.virtualWrite(V1, 65.0);                        // Time-Series Line Chart (Kelembaban)
    IoTHub.virtualWrite(V6, 750.0);                       // Liquid Tank Silo (Level Liter)
    IoTHub.locationWrite(V8, -6.2088, 106.8456, 45.0);    // GPS Fleet Map Tracker
  }
}
```

---

## 🔌 Integrasi ESP32 Fisik ke Localhost

Jika Anda memiliki board ESP32 fisik dan ingin mengirimkan data nyata ke dashboard yang berjalan di localhost:

### Langkah 1: Jalankan Local Gateway Bridge
Buka terminal baru di folder proyek dan jalankan:
```powershell
python server.py
```
*(Gateway server akan aktif di `http://0.0.0.0:8000`)*.

### Langkah 2: Cek IP Laptop Anda
Ketik `ipconfig` di PowerShell untuk melihat IPv4 laptop Anda (contoh: `192.168.100.123`).

### Langkah 3: Upload Sketch ke ESP32 (Arduino IDE)
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* WIFI_SSID     = "NAMA_WIFI_ANDA";
const char* WIFI_PASSWORD = "PASSWORD_WIFI_ANDA";
const char* SERVER_URL    = "http://192.168.100.123:8000/api/v1/telemetry"; // Ganti IP Laptop Anda
const char* DEVICE_TOKEN  = "dev_esp32_boiler_01";

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\n[OK] Wi-Fi Terhubung!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");

    float suhu = 28.5 + (random(-20, 20) / 10.0);
    float tekanan = 4.8 + (random(-5, 5) / 10.0);

    StaticJsonDocument<200> doc;
    doc["token"] = DEVICE_TOKEN;
    doc["v0"] = suhu;      // Virtual Pin V0
    doc["v4"] = tekanan;   // Virtual Pin V4

    String payload;
    serializeJson(doc, payload);
    http.POST(payload);
    http.end();
  }
  delay(2000);
}
```
*Data dari sensor ESP32 fisik Anda akan langsung muncul dan menggerakkan jarum gauge di web dashboard secara real-time!*

---

## 📊 Ekspor Data Historis & Analitik

1. Buka menu **"History & Export"** pada sidebar kiri aplikasi.
2. Pilih perangkat target dan rentang waktu (`1h`, `24h`, `7d`, `30d`).
3. Klik tombol hijau **`Export CSV (Excel)`** untuk mengunduh spreadsheet, atau **`Export JSON`** untuk analisis lanjutan.

---

## 📚 Dokumen dan Panduan Lengkap

* 📋 **[PRD.md](./PRD.md)** — Dokumen Kebutuhan Produk lengkap (benchmark kompetitor, arsitektur, spesifikasi teknis).
* 📖 **[USER_MANUAL.md](./USER_MANUAL.md)** — Buku Panduan Pengguna detail (panduan langkah demi langkah dari pendaftaran hingga integrasi PLC dan MicroPython).
* 🚀 **[Walkthrough Report](./walkthrough.md)** — Rangkuman implementasi dan hasil verifikasi sistem.

---

## 📁 Struktur Direktori Proyek

```
IOT_HUB/
├── src/
│   ├── components/
│   │   ├── analytics/        # Historical Data & CSV/JSON Export Center
│   │   ├── api-docs/         # OpenAPI REST & MQTT Playground
│   │   ├── dashboard/        # Drag & Drop Grid Canvas, Header, Inspector & Toolbox
│   │   ├── devices/          # Device Fleet Manager & Digital Twin Shadow
│   │   ├── firmware/         # Interactive Firmware Code Generator
│   │   ├── landing/          # Public Landing Page, Auth Modal & Onboarding Wizard
│   │   ├── layout/           # Sidebar Navigation & Layout Shell
│   │   ├── rules/            # Visual Rule Engine & Automations
│   │   ├── simulator/        # Virtual Hardware Board Simulator
│   │   └── widgets/          # Gauge, Chart, SCADA, Map, Tank, Switch, Slider, RGB
│   ├── context/              # Auth, Device, Dashboard & Telemetry State Providers
│   ├── types/                # TypeScript Interfaces (Device, Telemetry, Rules, Auth)
│   └── utils/                # Mock Data, Formatters & LocalStorage Helpers
├── server.py                 # Local Python Backend Gateway & Telemetry Bridge
├── PRD.md                    # Product Requirements Document
├── USER_MANUAL.md            # Comprehensive User Manual
├── README.md                 # Project Overview & Quickstart Guide
├── package.json              # Dependencies & Scripts
├── tailwind.config.js        # Industrial Dark Theme Styling Tokens
└── vite.config.ts            # Vite Bundler Configuration
```

---

<div align="center">

**Dikembangkan dan Dirancang oleh [Muhamad Fadli](https://github.com/fadli1008)**  
*Dibuat dengan React 18, Vite, TypeScript & Tailwind CSS • 2026*

</div>

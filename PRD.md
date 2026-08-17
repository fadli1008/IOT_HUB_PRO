# 📋 Product Requirements Document (PRD)
# **IoT Hub** — Universal & Industrial IoT Platform

| Atribut | Detail |
|---|---|
| **Nama Produk** | IoT Hub |
| **Versi Dokumen** | 1.0.0 |
| **Lead Developer & Architect** | **Muhamad Fadli** |
| **Tanggal Pembuatan** | 17 Agustus 2026 |
| **Status** | Approved & Implemented |
| **Target Rilis** | v1.0.0 (Phase 1-4 Roadmap) |
| **Benchmark Utama** | Blynk IoT, ThingsBoard (CE & PE), AWS IoT Core |

---

## Daftar Isi

1. [Ringkasan Eksekutif & Visi Produk](#1-ringkasan-eksekutif--visi-produk)
2. [Latar Belakang Masalah & Peluang Pasar](#2-latar-belakang-masalah--peluang-pasar)
3. [Analisis Kompetitor & Benchmark (Blynk vs ThingsBoard vs IoT Hub)](#3-analisis-kompetitor--benchmark-blynk-vs-thingsboard-vs-iot-hub)
4. [Target Pengguna & Persona](#4-target-pengguna--persona)
5. [Arsitektur Sistem & Technology Stack](#5-arsitektur-sistem--technology-stack)
6. [Fitur Platform Web (Core Web Application)](#6-fitur-platform-web-core-web-application)
7. [Dashboard IoT Profesional & Custom Drag-and-Drop UI Builder](#7-dashboard-iot-profesional--custom-drag-and-drop-ui-builder)
8. [Device Management & Digital Twin (Device Shadow)](#8-device-management--digital-twin-device-shadow)
9. [Visual Rule Engine & Automation](#9-visual-rule-engine--automation)
10. [Dokumentasi & Spesifikasi API (REST, MQTT, WebSocket)](#10-dokumentasi--spesifikasi-api-rest-mqtt-websocket)
11. [Firmware SDK & Contoh Kode Mikrokontroler](#11-firmware-sdk--contoh-kode-mikrokontroler)
12. [Panduan Integrasi Hardware (Hardware Integration Guide)](#12-panduan-integrasi-hardware-hardware-integration-guide)
13. [Panduan Integrasi Antar-Platform (Inter-Platform Integration)](#13-panduan-integrasi-antar-platform-inter-platform-integration)
14. [Keamanan, Standar Industri & Compliance](#14-keamanan-standar-industri--compliance)
15. [Non-Functional Requirements (NFR) & Skalabilitas](#15-non-functional-requirements-nfr--skalabilitas)
16. [Model Bisnis & Skema Tier Pricing](#16-model-bisnis--skema-tier-pricing)
17. [Roadmap Pengembangan & Rencana Implementasi](#17-roadmap-pengembangan--rencana-implementasi)
18. [Struktur Direktori Proyek (Project Structure)](#18-struktur-direktori-proyek-project-structure)
19. [Matriks Risiko & Rencana Mitigasi](#19-matriks-risiko--rencana-mitigasi)
20. [Metrik Keberhasilan Produk (KPI)](#20-metrik-keberhasilan-produk-kpi)

---

## 1. Ringkasan Eksekutif & Visi Produk

### 1.1 Visi Produk
> **"Menjadi platform IoT universal, terbuka, dan modular yang menghubungkan berbagai hardware kustom ke cloud dengan kemudahan integrasi setara Blynk, fleksibilitas aturan setara ThingsBoard, serta keandalan dan keamanan kelas industri."**

### 1.2 Ringkasan Solusi
**IoT Hub** adalah platform *Internet of Things* (IoT) end-to-end yang menjembatani kesenjangan antara prototyping cepat (maker/akademisi) dengan implementasi skala industri (smart factory, agrikultur presisi, manajemen energi, smart city). 

Platform ini menyediakan:
1. **Device Engine Universal**: Mendukung mikrokontroler apa pun (ESP32, ESP8266, STM32, Raspberry Pi, Arduino, NRF52, PLC via Modbus/OPC-UA).
2. **Firmware SDK Resmi & Contoh Nyata**: Pustaka C/C++, MicroPython, dan Python siap pakai dengan sistem Virtual Pin dan direct telemetry.
3. **Dashboard Real-time Industrial-Grade**: Drag-and-drop widget builder responsif (Gauges, Time-series multi-axis, SCADA/HMI schematics, Geo-Map, Data Table).
4. **API-First Architecture**: Dokumentasi interaktif (OpenAPI/Swagger), REST API, MQTT Broker dengan TLS, dan WebSocket untuk live telemetry.
5. **Open Integrations**: Webhook bidirectional, integrasi Home Assistant, Node-RED, Grafana, AWS/Azure IoT Bridge, dan ekspor data otomatis.

---

## 2. Latar Belakang Masalah & Peluang Pasar

### 2.1 Masalah Utama di Pasar IoT Saat Ini
1. **Vendor Lock-in & Hardware Proprietary**: Platform seperti Blynk generasi baru membatasi fleksibilitas custom firmware dan memberlakukan batasan device yang ketat pada paket terjangkau.
2. **Kompleksitas Solusi Industri**: Platform seperti ThingsBoard atau AWS IoT Core memerlukan kurva pembelajaran yang curam dan setup infrastruktur yang rumit bagi pengembang pemula/menengah.
3. **Dashboard yang Tidak Siap Industri**: Banyak platform maker hanya memiliki widget sederhana tanpa dukungan SCADA/HMI, multi-tenant RBAC, audit log, atau pemantauan offline yang andal.
4. **Dokumentasi Firmware Terfragmentasi**: Kurangnya contoh kode firmware siap pakai yang menangani *edge cases* nyata seperti auto-reconnect, MQTT backoff, buffer data saat offline, dan OTA updates.

### 2.2 Nilai Tambah IoT Hub
* **Hardware-Agnostic**: Protokol terbuka berbasis MQTT/HTTPS/WebSockets yang kompatibel dengan mikrokontroler 8-bit, 32-bit, hingga SBC Linux.
* **Hybrid Deployment**: Tersedia dalam mode *Cloud SaaS* dan *Self-Hosted Docker/Kubernetes*.
* **Digital Twin / Device Shadow**: Menyimpan status terakhir perangkat dan antrean perintah saat perangkat offline.

---

## 3. Analisis Kompetitor & Benchmark (Blynk vs ThingsBoard vs IoT Hub)

| Parameter | **Blynk IoT** (Benchmark UX) | **ThingsBoard** (Benchmark Industri) | **IoT Hub** (Produk Kami) |
|---|---|---|---|
| **Kemudahan Prototyping** | ⭐⭐⭐⭐⭐ (Sangat Cepat) | ⭐⭐⭐ (Perlu Konfigurasi) | ⭐⭐⭐⭐⭐ (Quickstart Template + SDK) |
| **Kesiapan Industri (SCADA/HMI)** | ⭐⭐ (Terbatas) | ⭐⭐⭐⭐⭐ (Sangat Lengkap) | ⭐⭐⭐⭐⭐ (SCADA Widgets + Custom SVG) |
| **Keterbukaan Firmware** | C/C++ (Blynk Protocol) | Agnostik (Tanpa SDK resmi terstandar) | Open C/C++, MicroPython, Python, REST/MQTT |
| **Arsitektur Data** | Virtual Pins | Key-Value Telemetry & Attributes | Dual Mode: Virtual Pins + JSON Key-Value |
| **Visual Rule Engine** | Otomasi sederhana | Rule Chain kompleks (Node-based) | Flow-based Automation (Visual & Intuitif) |
| **Self-Hosting Capability** | Sangat Terbatas (Legacy) | Penuh (Community Edition) | Penuh (Docker-Compose & Helm Charts) |
| **Device Shadow / Digital Twin** | Sederhana (Sync Pin) | Lengkap (Client/Shared Attributes) | Lengkap (Desired vs Reported State) |
| **Model Biaya** | Biaya per-device mahal | Gratis CE / Mahal PE | Model Transparan Berbasis Kapasitas |

---

## 4. Target Pengguna & Persona

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER PERSONA SPECTRUM                           │
│                                                                        │
│   [ Maker / Mahasiswa ] ────▶ [ Startup IoT / SME ] ────▶ [ Industri ] │
│   • ESP32 / Arduino           • Fleet 100-1000 device     • SCADA/Modbus│
│   • Monitoring Cepat          • Custom Branding           • SLA 99.95% │
│   • Free / Maker Tier         • REST API / Webhooks       • On-Premise │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Persona 1: Maker / Edukasi / Mahasiswa (Ahmad - 21 Tahun)**
   * *Kebutuhan*: Menghubungkan ESP32/DHT22 untuk tugas akhir atau smart home pribadi dalam hitungan menit.
   * *Kunci Sukses*: Contoh kode tinggal copy-paste, dashboard langsung jalan tanpa setup server rumit.
2. **Persona 2: Startup / Solusi IoT Komersial (Dian - 30 Tahun)**
   * *Kebutuhan*: Mengelola 500 unit device smart metering dengan dashboard multi-user, notifikasi WhatsApp/Telegram, dan integrasi webhook ke database internal.
   * *Kunci Sukses*: REST API lengkap, sub-organisasi/multi-tenant, custom widget, stabilitas koneksi.
3. **Persona 3: Engineer Otomasi Pabrik / IIoT (Ir. Handoko - 45 Tahun)**
   * *Kebutuhan*: Memantau temperatur boiler, vibration sensor mesin CNC, dan status inverter via Modbus RTU ke Gateway Raspberry Pi/STM32, visualisasi diagram P&ID (SCADA), serta alert ketika batas kritis terlampaui.
   * *Kunci Sukses*: Widget SCADA interaktif, audit log, time-series aggregation query berkecepatan tinggi, deployment on-premise lokal.

---

## 5. Arsitektur Sistem & Technology Stack

### 5.1 Diagram Arsitektur End-to-End

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. DEVICE & EDGE LAYER                                                 │
│    ESP32 / ESP8266  ──(C/C++ SDK)──┐                                  │
│    STM32 + W5500    ──(C/HAL SDK)───┼──► MQTTS (:8883)                 │
│    MicroPython      ──(Py SDK)─────┤    HTTPS (:443)                   │
│    Raspberry Pi/SBC ──(Python SDK)─┤    WSS   (:8084)                  │
│    Industrial PLC   ──(Modbus/GW)──┘                                  │
└────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. INGESTION & GATEWAY LAYER                                           │
│    • Reverse Proxy & SSL Termination: Traefik / Nginx                  │
│    • High-Throughput MQTT Broker: EMQX Enterprise / Mosquitto          │
│    • API Gateway: FastAPI / Go Ingestion Service                       │
│    • Message Streaming Bus: Apache Kafka / Redis Streams               │
└────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. CORE PROCESSING & BUSINESS LOGIC SERVICES                           │
│    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│    │ Auth & RBAC  │ │ Device &     │ │ Telemetry &  │ │ Rule Engine  │ │
│    │ Service (JWT)│ │ Shadow Mgr   │ │ Time-Series  │ │ & Triggers   │ │
│    └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │
│    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│    │ OTA Update   │ │ Notification │ │ Integration  │ │ Scheduler &  │ │
│    │ Manager      │ │ (WA/TG/Mail) │ │ & Webhooks   │ │ Aggregator   │ │
│    └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. STORAGE LAYER                                                       │
│    • Time-Series Telemetry : TimescaleDB (PostgreSQL Extension)        │
│    • Relational Metadata    : PostgreSQL 16 (Users, Devices, Config)    │
│    • In-Memory / Hot Cache : Redis 7 (Device Shadow, Token Session)    │
│    • Blob Storage          : MinIO / S3 (Firmware OTA Binaries, Assets)│
└────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. PRESENTATION & INTEGRATION LAYER                                    │
│    • Modern Web App: Next.js 14 / React 18 (Tailwind CSS, Radix UI)   │
│    • Dashboard Canvas: Grid Layout + Canvas/SVG SCADA Engine          │
│    • Real-time Stream: WebSocket Client (WSS) + MQTT over WebSockets   │
│    • Third-Party APIs: OpenAPI 3.1, Webhooks, Home Assistant Bridge    │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Rincian Tech Stack

| Komponen | Teknologi Pilihan | Alasan Pemilihan |
|---|---|---|
| **Frontend Framework** | Next.js 14 (App Router) + React 18 | Dukungan SSR/SSG, performa tinggi, ekosistem visualisasi kaya |
| **Design System** | Tailwind CSS + Lucide Icons + Framer Motion | Tampilan modern, dark mode native, micro-interactions halus |
| **Visualisasi / Charts** | Recharts, Apache ECharts, D3.js | Grafik time-series jutaan titik, radial gauges, chart multi-axis |
| **Canvas / SCADA** | Konva.js / Fabric.js + SVG Pan-Zoom | Pembuatan visualisasi skematik mesin dan denah interaktif |
| **Backend Core API** | Python (FastAPI) + Go (Opsional untuk Ingestion) | Asinkron tinggi, otomatisasi Swagger UI, validasi schema Pydantic |
| **MQTT Broker** | EMQX v5 | Broker MQTT terdistribusi, support 1M+ koneksi, rule engine internal |
| **Time-Series Database** | TimescaleDB (PostgreSQL) | Query SQL standar, hypertables untuk jutaan log sensor, kompresi 90% |
| **Relational Database** | PostgreSQL 16 | Relasi terstruktur untuk multi-tenancy, RBAC, dan audit trail |
| **Cache & Shadow State** | Redis 7 | State shadow device sub-milidetik, pub/sub, dan rate limiter |
| **Object Storage** | MinIO / AWS S3 | Penyimpanan aman file binary OTA (.bin, .hex) dan log file |

---

## 6. Fitur Platform Web (Core Web Application)

### 6.1 Akses Platform & Alur Registrasi Wajib (Mandatory Sign-Up & Onboarding Gate)

Platform memberlakukan **Akses Terproteksi Penuh (Gated Access)**. Pengguna publik yang mengakses platform wajib melakukan pendaftaran akun (Sign-Up) terlebih dahulu sebelum dapat mengakses dashboard, mendaftarkan hardware, atau menggunakan fitur IoT Hub.

```
┌────────────────────────────────────────────────────────────────────────┐
│                  USER ACCESS & ONBOARDING LIFECYCLE                    │
│                                                                        │
│  [ Pengunjung Baru ]                                                   │
│          │                                                             │
│          ▼                                                             │
│  ┌───────────────┐      Belum Ada Akun      ┌────────────────────────┐ │
│  │ Landing Page  │ ───────────────────────▶ │ Halaman Sign-Up        │ │
│  │ Publik        │                          │ (/register)            │ │
│  └───────────────┘                          └───────────┬────────────┘ │
│          │ Sudah Punya Akun                             │              │
│          ▼                                              ▼              │
│  ┌───────────────┐                          ┌────────────────────────┐ │
│  │ Halaman Login │                          │ Verifikasi Email       │ │
│  │ (/login)      │                          │ (Kode OTP 6-Digit)     │ │
│  └───────┬───────┘                          └───────────┬────────────┘ │
│          │                                              │ Sukses       │
│          │               Otentikasi Berhasil            ▼              │
│          └───────────────────────────────────▶ ┌─────────────────────┐ │
│                                                │ Onboarding Wizard   │ │
│                                                │ • Nama Workspace    │ │
│                                                │ • Pemilihan Persona │ │
│                                                │ • Auto-Set Free Tier│ │
│                                                └──────────┬──────────┘ │
│                                                           │ Selesai    │
│                                                           ▼            │
│                                                ┌─────────────────────┐ │
│                                                │ Main IoT Dashboard  │ │
│                                                │ (/dashboard)        │ │
│                                                └─────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### A. Kebijakan Akses (Access Control Policy)
1. **Public Landing Page**: Halaman muka publik yang menampilkan ringkasan fitur, dokumentasi API publik, harga (pricing), serta tombol CTA utama: **"Mulai Gratis (Daftar Sekarang)"** dan **"Masuk (Login)"**.
2. **Protected App Routes**: Semua rute aplikasi internal (`/dashboard`, `/devices`, `/templates`, `/rules`, `/analytics`, `/settings`) diproteksi oleh *Auth Middleware*. Akses tanpa token valid otomatis dialihkan (*redirect*) ke `/login` atau `/register`.
3. **Session Persistence**: Menggunakan Secure HttpOnly Cookie untuk Refresh Token dan In-Memory JWT Access Token dengan masa aktif terukur (Access Token: 15 menit, Refresh Token: 7 hari).

#### B. Formulir Pendaftaran (Sign-Up Flow)
* **Pilihan 1: Registrasi Email & Password**:
  * Input: Nama Lengkap, Alamat Email Aktif, Password (minimal 8 karakter, kombinasi huruf besar/kecil, angka, simbol).
  * Validasi: Pemeriksaan format email, pencegahan email duplikat, dan persetujuan Syarat & Ketentuan (Terms of Service) serta Kebijakan Privasi (Privacy Policy).
  * Anti-Bot / Anti-Spam: Integrasi Cloudflare Turnstile / reCAPTCHA v3 transparan.
* **Pilihan 2: Social Sign-Up (1-Click OAuth2)**:
  * Pendaftaran instan via **Google Account** dan **GitHub**.
  * Email otomatis terverifikasi secara langsung dari provider OAuth.

#### C. Verifikasi Akun & Email
* Setelah submit form pendaftaran, sistem mengirimkan kode OTP 6-digit (atau tautan aktivasi) ke email pengguna yang berlaku selama 15 menit.
* Akun dalam status `PENDING_VERIFICATION` tidak dapat mendaftarkan perangkat atau membuat koneksi MQTT broker hingga verifikasi email berhasil diselesaikan.

#### D. Onboarding Wizard (Langkah Pertama Setelah Daftar)
Segera setelah verifikasi email berhasil, pengguna dipandu melalui wizard 3 langkah sederhana:
1. **Langkah 1 (Setup Workspace)**: Menentukan Nama Organisasi / Workspace pertama (Contoh: "Smart Farming Lab" atau "Proyek IoT Pribadi").
2. **Langkah 2 (Pemilihan Profil/Use Case)**: Memilih persona (Hobi/Akademisi, Startup Komersial, atau Industri/Pabrik) untuk mengaktifkan setelan widget rekomendasi.
3. **Langkah 3 (Aktivasi Paket Default)**: Sistem secara otomatis mengaktifkan **Paket Free (Gratis 5 Device Seumur Hidup)** tanpa meminta informasi kartu kredit / metode pembayaran.
4. **Quickstart Prompt**: Menawarkan opsi membuat perangkat pertama dan langsung menghasilkan cuplikan kode firmware C++/Python dengan `DEVICE_TOKEN` siap pakai.

---

### 6.2 Multi-Tenancy & Organisasi

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TENANT HIERARCHY TREE                           │
│                                                                        │
│   Organization (e.g. PT Industri Cerdas)                               │
│   ├── Project 1: Smart Warehouse                                       │
│   │   ├── Device Group: Cold Storage Line A                           │
│   │   │   ├── Device 01 (ESP32 - Temp/Humidity)                        │
│   │   │   └── Device 02 (ESP32 - Door Sensor)                          │
│   │   └── Dashboards & Rule Automation                                 │
│   └── Project 2: Factory Energy Monitoring                             │
│       └── Device Group: Panel Induk LV                                 │
│           └── Device 03 (STM32 Modbus Power Meter)                     │
└────────────────────────────────────────────────────────────────────────┘
```

* **Hierarki**: `Organization` ➡️ `Project` ➡️ `Device Group` ➡️ `Device`.
* **Isolasi Data**: Data sensor dan konfigurasi terisolasi penuh antar-organisasi.
* **Undangan Anggota Tim (Team Invitation)**: Admin dapat mengundang rekan kerja via email untuk bergabung ke organisasi dengan peran spesifik.
* **White-Labeling (Enterprise)**: Kustomisasi domain, logo, tema warna, dan header email notifikasi.

### 6.3 Autentikasi & Otorisasi (RBAC)
* **Metode Login**: Email/Password dengan Argon2 hashing, OAuth2 (Google & GitHub), serta SSO (SAML/OpenID) untuk Enterprise.
* **Multi-Factor Authentication (MFA)**: TOTP via Authenticator App.
* **Role Hirarkis**:
  * `Owner`: Akses penuh ke billing, organisasi, transfer kepemilikan, dan hapus project.
  * `Admin`: Manajemen device, user, token, rule, dan konfigurasi sistem.
  * `Operator / Editor`: Membuat dashboard, mengubah rule, mengirim command kontrol hardware.
  * `Viewer / Client`: Hanya dapat melihat dashboard dan live telemetry (read-only).
* **API Keys Scoped**: Pembuatan token API terpisah dengan hak akses spesifik (read-only, write telemetry, admin control).

---

## 7. Dashboard IoT Profesional & Custom Drag-and-Drop UI Builder

### 7.1 Arsitektur Visual Drag-and-Drop UI Builder (WYSIWYG)

Platform menyediakan **Canvas Builder Interaktif** (WYSIWYG - *What You See Is What You Get*) yang memungkinkan pengguna dari semua tingkatan mengustomisasi antarmuka pemantauan dan kontrol secara bebas tanpa perlu menulis kode frontend.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                         VISUAL DRAG & DROP DASHBOARD BUILDER CANVAS                            │
├─────────────────┬──────────────────────────────────────────────┬───────────────────────────────┤
│ WIDGET TOOLBOX  │          RESPONSIVE GRID CANVAS (12/24 COL)  │   WIDGET PROPERTY INSPECTOR   │
│ (Left Sidebar)  │                (Center Workspace)            │        (Right Sidebar)        │
├─────────────────┼──────────────────────────────────────────────┼───────────────────────────────┤
│ 🔍 Cari Widget  │ [Toolbar: ↩ Undo | ↪ Redo | 📱 Preview | 💾] │ ⚙️ Pengaturan Widget Terpilih │
│                 │                                              │                               │
│ ▼ Controls      │  ┌──────────────────┐  ┌──────────────────┐  │ • Judul: "Temperatur Boiler" │
│ [🎛️ Switch]    │  │ 🌡️ Boiler Temp   │  │ ⚡ Relay Pompa   │  │ • Data Binding:              │
│ [🎚️ Slider]    │  │    [ 78.5 °C ]   │  │   [ TOGGLE ON ]  │  │   - Device: ESP32_Main_01     │
│ [🔘 Button]     │  │   (Radial Gauge) │  │                  │  │   - Pin / Key: V0 (temp)      │
│ [🎨 Color]      │  └────────┬─────────┘  └──────────────────┘  │ • Rentang Min/Max: 0 - 150    │
│                 │           │ Drag & Resize Handles ↘          │ • Satuan Unit: "°C"           │
│ ▼ Visuals       │  ┌────────┴───────────────────────────────┐  │ • Threshold Warna:            │
│ [📈 Line Chart] │  │ 📊 Real-time Sensor History (Live 1s)  │  │   - Hijau : < 70 °C           │
│ [🧭 Gauge]      │  │  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  │  │   - Kuning: 70 - 90 °C        │
│ [💡 Status LED] │  │                                        │  │   - Merah : > 90 °C (Alert)   │
│ [📋 Data Table] │  └────────────────────────────────────────┘  │ • Ukuran Card: [ 4 Col x 2 Row]│
│                 │                                              │ • Warna Aksen: [#06B6D4 Blue] │
│ ▼ Industrial    │  ┌────────────────────────────────────────┐  │ • Formula: "value * 1.0"      │
│ [🏭 SCADA HMI]  │  │ 🏭 SCADA Plant Schematic (Interactive) │  │                               │
│ [🗺️ GPS Map]    │  └────────────────────────────────────────┘  │ [ 🗑️ Hapus ] [ 📋 Gandakan ]  │
└─────────────────┴──────────────────────────────────────────────┴───────────────────────────────┘
```

---

### 7.2 Fitur Unggulan Custom Drag-and-Drop Builder

#### A. Fleksibilitas Canvas & Grid Engine
1. **Responsive Magnetic Grid (12 & 24 Kolom)**:
   * Widget secara otomatis terkunci (*snap-to-grid*) untuk menjaga kerapian tata letak.
   * Bebas dipindahkan (*draggable*) ke posisi manapun dan diubah ukurannya (*resizable*) dari sudut widget (1x1, 2x2, 4x2, 6x3, hingga full-width).
   * Fitur **Collision Detection & Auto-Flow**: Widget lain otomatis bergeser secara mulus saat widget baru disisipkan.
2. **Device Viewport Switcher & Responsive Preview**:
   * Pengguna dapat menguji dan menyesuaikan tata letak khusus untuk **Desktop (1920x1080 / 1440x900)**, **Tablet (iPad/Android)**, dan **Mobile Smartphone (iPhone/Android)** secara mandiri.
3. **Multi-Tab & Multi-Page Dashboard**:
   * Satu project dashboard dapat memiliki banyak tab (Contoh: Tab 1: *Overview Ringkasan*, Tab 2: *Detail Motor Listrik*, Tab 3: *Analitik Daya Listrik*, Tab 4: *Kamera & Keamanan*).
4. **Mode Operasi Canvas**:
   * **Edit Mode**: Membuka toolbox widget, grid helper, dan panel inspector properti.
   * **Live / View Mode**: Mengunci posisi widget, mengaktifkan interaksi kontrol saklar/slider, dan streaming live telemetry sub-detik.
   * **Kiosk / Full-Screen TV Mode**: Tampilan layar penuh tanpa navbar, cocok untuk monitor NOC pabrik atau ruang kendali.

---

### 7.3 Panel Property Inspector (Kustomisasi Mendalam per Widget)

Setiap widget yang ditarik ke canvas dapat dikustomisasi secara mendetail melalui **Property Inspector**:

| Aspek Kustomisasi | Opsi yang Tersedia |
|---|---|
| **Data Binding** | • Pemilihan Target Device (dapat memilih dari berbagai device berbeda dalam 1 dashboard)<br>• Pemilihan Channel Data: **Virtual Pin (`V0`–`V255`)** atau **Direct JSON Key (`temperature`, `flow_rate`)** |
| **Kalkulasi & Formula** | • Formula komputasi real-time sisi klien (Contoh: `value * 1.8 + 32` untuk mengubah °C ke °F, atau `value / 1000` untuk Watt ke kW) |
| **Batas Nilai & Thresholds**| • Nilai Minimum & Maximum (e.g. 0 – 100 bar)<br>• **Multi-Level Threshold Alert**: Pewarnaan dinamis kartu berdasarkan nilai (Normal = Hijau, Warning = Oranye, Kritis = Merah berkedip) |
| **Tipografi & Tampilan** | • Judul Widget Kustom & Sub-label<br>• Pilihan Satuan / Unit Kustom (°C, %, bar, RPM, kWh, Liter, m/s)<br>• Pilihan Desimal (0, 1, 2 digit di belakang koma) |
| **Estetika & Styling** | • Tema Kartu: *Glassmorphism Blur*, *Industrial Solid Dark*, *Border Minimalist*<br>• Custom Accent Color Palette (HEX / HSL picker)<br>• Icon Picker (1000+ ikon dari Lucide Icons & Material Design Icons) |
| **Interaktivitas Kontrol** | • Konfirmasi Sebelum Eksekusi (Modal dialog konfirmasi: *"Apakah Anda yakin ingin mematikan Generator?"*)<br>• Debounce slider (mencegah spam command MQTT saat slider digeser cepat) |

---

### 7.4 Katalog Lengkap Widget Terintegrasi

```
┌────────────────────────────────────────────────────────────────────────┐
│                        WIDGET SHOWCASE MATRIX                          │
│                                                                        │
│  [ DIGITAL & CONTROL ]      [ TIME-SERIES & GAUGES ]   [ SCADA / GEO ] │
│  ┌──────────────────┐       ┌──────────────────────┐   ┌─────────────┐ │
│  │ Relay 1: [ ON  ] │       │    Radial Gauge      │   │  [ Factory  │ │
│  │ Speed  : [==== ] │       │       ( 78 % )       │   │    Floor ]  │ │
│  │ RGB    : [ 🎨  ] │       │ ──────────────────── │   │  (S1)──(S2) │ │
│  │ State  : Standby │       │ Line Chart (Live 1s) │   │   \     /   │ │
│  └──────────────────┘       └──────────────────────┘   └─────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### A. Widget Kontrol & Input (Cloud ➡️ Device)
1. **Push Button & Momentary Switch**: Mengirim pulsa trigger / perintah sekejap (misal: tombol reset atau pembuka gerbang otomatis).
2. **Toggle Switch**: Saklar on/off persisten dengan indikator status konfirmasi dari *device shadow*.
3. **Continuous Slider & Step Bar**: Kontrol analog halus untuk PWM dimmer, setpoint temperatur boiler, atau kecepatan motor inverter.
4. **Rotary Knob Dial**: Input putar presisi dengan visual knob industrial.
5. **RGB / Color Picker**: Kontrol palet warna pencahayaan LED dengan preview warna live.
6. **Command Terminal Console**: Input teks baris perintah untuk interaksi serial langsung ke mikrokontroler (CLI mode).

#### B. Widget Visualisasi Telemetry (Device ➡️ Cloud)
1. **Single Value Metric Card**: Angka metrik besar dengan satuan, ikon dinamis, serta badge tren kenaikan/penurunan persentase.
2. **Radial Gauge & Semicircle Meter**: Speedometer radial presisi tinggi dengan zona warna aman/peringatan/bahaya.
3. **Linear Tank / Liquid Level Bar**: Visualisasi volume tangki air atau level bahan bakar silinder.
4. **Multi-Axis Line Chart**: Grafik time-series multi-sensor hingga 5 variabel dengan sumbu Y independen (misal: Suhu vs Tekanan vs Arus Listrik).
5. **Area & Stacked Bar Chart**: Visualisasi akumulasi konsumsi daya harian/mingguan/bulanan.
6. **State / LED Matrix Indicator**: Indikator status boolean atau enum (Standby, Running, Alarm, Fault) dengan efek animasi glow.
7. **Data Grid & Live Log Table**: Tabel data sensor historis dan real-time yang dapat difilter, diurutkan, dan diekspor ke Excel/CSV.

#### C. Widget Advanced & Industrial (SCADA / HMI)
1. **Interactive SVG Schematic (SCADA HMI)**: Upload denah mesin atau diagram P&ID dalam format SVG. Pengguna dapat menghubungkan tag ID pada SVG ke datastream sensor agar komponen diagram berputar, berubah warna, atau berkedip sesuai data nyata.
2. **GeoJSON Fleet & Asset Tracker**: Peta interaktif (OpenStreetMap / Google Maps) untuk pelacakan kendaraan/sensor bergerak dengan jejak rute GPS (*breadcrumbs*) dan status kecepatan.
3. **Thermal Heatmap Matrix**: Visualisasi kontur panas 2D untuk sensor array (e.g. AMG8833 thermal camera) di lantai produksi.
4. **RTSP / HLS Live Video Overlay**: Menampilkan streaming CCTV langsung dengan overlay metrik sensor di atas video player.

---

### 7.5 Manajemen Template Dashboard & Berbagi (Sharing)
* **Simpan sebagai Template Kustom**: Pengguna dapat menyimpan racikan dashboard mereka sebagai blueprint/template proyek baru.
* **Import & Export JSON**: Kemudahan backup, duplikasi, dan migrasi konfigurasi layout dashboard dalam satu file `.json`.
* **Public Share Link (Read-Only)**: Membuat tautan publik yang dilindungi password / token untuk presentasi ke klien atau stakeholder tanpa perlu login.
* **Iframe Embed**: Kode snippet `<iframe />` untuk memasang widget atau seluruh dashboard ke website internal perusahaan.

---

## 8. Device Management & Digital Twin (Device Shadow)

### 8.1 Konsep Virtual Pin & Datastream
Seperti pada sistem benchmark (Blynk), IoT Hub menggunakan abstraksi **Virtual Pins (`V0` - `V255`)** dan/atau **Named Keys (`temperature`, `relay_1`)** agar fleksibel bagi pemula maupun arsitek sistem.

```
Virtual Pin Mapping:
  • V0 : Sensor Suhu (Double, Read-Only, Unit: °C)
  • V1 : Sensor Kelembaban (Double, Read-Only, Unit: %)
  • V2 : Kontrol Relay Pompa (Boolean, Read/Write, 0 atau 1)
  • V3 : Setpoint Target Suhu (Integer, Read/Write, Range: 20 - 90)
```

### 8.2 Device Template Engine
* **Template Blueprint**: Satu template dapat diterapkan ke ratusan device bertipe sama.
* **Isi Template**:
  * Definisi seluruh Virtual Pin dan tipe data.
  * Aturan batas alarm bawaan (*default threshold*).
  * Konfigurasi widget default yang langsung terpasang saat device baru didaftarkan.
  * Target firmware file untuk pembaruan OTA.

### 8.3 Digital Twin / Device Shadow Architecture

```
┌─────────────────┐       MQTT Publish       ┌──────────────────────┐
│ Physical Device │ ───────────────────────▶ │   Reported State     │
│  (ESP32 / MCU)  │ ◀─────────────────────── │    Desired State     │
└─────────────────┘        MQTT Delta        └──────────┬───────────┘
                                                        │
                                                        ▼
                                             ┌──────────────────────┐
                                             │ Web Dashboard / User │
                                             │ (Sends Desired State)│
                                             └──────────────────────┘
```

1. **Reported State**: Data status nyata yang dikirimkan perangkat ke cloud.
2. **Desired State**: Nilai yang diinginkan pengguna dari web dashboard (misal: Menyalakan relay saat device sedang offline).
3. **Delta Sync**: Ketika perangkat menyala kembali (*reconnect*), broker otomatis mengirimkan *delta payload* sehingga mikrokontroler segera menyinkronkan status hardware.
4. **Last Will & Testament (LWT)**: Mendeteksi perangkat *offline* secara instan dalam 3–5 detik saat koneksi internet terputus mendadak.

### 8.4 Over-The-Air (OTA) Firmware Management
* Upload file binary (`.bin`, `.hex`, `.elf`) langsung melalui dashboard web.
* Pengelompokan update: *Single Device*, *Device Group*, atau *Canary Rollout (10% ➡️ 50% ➡️ 100%)*.
* Verifikasi integritas file dengan checksum SHA-256 dan enkripsi signature.
* Pemantauan status live progress: `INITIATED` ➡️ `DOWNLOADING (45%)` ➡️ `APPLYING` ➡️ `SUCCESS / ROLLBACK`.

---

## 9. Visual Rule Engine & Automation

```
┌──────────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│  TRIGGER NODE    │ ──▶ │   CONDITION NODE     │ ──▶ │   ACTION NODE    │
│  • Suhu V0 > 85°C│     │  • Jika Jam Kerja    │     │  • Matikan V2    │
│  • Device Offline│     │  • Durasi > 3 Menit  │     │  • Kirim WA Alert│
│  • Jadwal Cron   │     │  • AND Tekanan > 5Bar│     │  • POST Webhook  │
└──────────────────┘     └──────────────────────┘     └──────────────────┘
```

### 9.1 Flow-Based Visual Builder
* Pengguna dapat menghubungkan node Trigger, Logic/Condition, Transformation, dan Action layaknya Node-RED dengan antarmuka yang sangat simpel.

### 9.2 Komponen Rule
* **Triggers**:
  * Telemetry Threshold (e.g. `V0 > 80.0` atau `status == "OVERHEAT"`).
  * State Change (e.g. `Relay berubah dari OFF ke ON`).
  * Device Lifecycle (e.g. `Device disconnected selama > 5 menit`).
  * Time-based / Cron Scheduler (e.g. `Setiap Senin-Jumat pukul 07:00 WIB`).
  * Inbound Webhook Call dari aplikasi luar.
* **Actions**:
  * Device Actuation: Kirim command balik ke device lain (misal: jika Sensor A panas, nyalakan Kipas B).
  * Notification Dispatcher:
    * **Email**: Template HTML profesional dengan snapshot grafik terkini.
    * **Telegram**: Notifikasi instan via Bot API resmi.
    * **WhatsApp**: Notifikasi alert bisnis via WhatsApp Cloud API / Twilio.
    * **SMS**: Alert darurat untuk sistem industri.
    * **In-App Notification**: Toast & notification center di web.
  * Outbound HTTP Webhook: Meneruskan payload JSON ke endpoint sistem eksternal (SAP, ERP, database external).

---

## 10. Dokumentasi & Spesifikasi API (REST, MQTT, WebSocket)

### 10.1 Konvensi REST API
* **Base URL**: `https://api.iothub.io/v1`
* **Format Request/Response**: JSON (`application/json; charset=utf-8`)
* **Autentikasi**: Header `Authorization: Bearer <API_KEY_OR_JWT>`

#### Daftar Endpoint Kunci

| Kategori | Method | Endpoint | Deskripsi |
|---|---|---|---|
| **Auth & Register** | `POST` | `/auth/register` | Mendaftarkan akun user baru |
| | `POST` | `/auth/verify-email` | Verifikasi akun dengan kode OTP 6-digit |
| | `POST` | `/auth/resend-verification` | Mengirim ulang kode OTP aktivasi |
| | `POST` | `/auth/login` | Login user, mengembalikan JWT Access & Refresh Token |
| | `POST` | `/auth/oauth/{provider}` | Login / Pendaftaran 1-klik (Google & GitHub) |
| | `POST` | `/auth/refresh` | Refresh Access Token menggunakan Refresh Token |
| | `POST` | `/auth/logout` | Invalidate token sesi user |
| | `GET` | `/auth/me` | Mengambil profil user yang sedang login |
| | `POST` | `/auth/onboarding` | Menyelesaikan step onboarding (Nama Workspace & Persona) |
| **Devices** | `GET` | `/devices` | Mengambil daftar device dengan filter & pagination |
| | `POST` | `/devices` | Mendaftarkan device baru, generate `DEVICE_TOKEN` |
| | `GET` | `/devices/{id}` | Mengambil detail spesifik device & status koneksi |
| | `PUT` | `/devices/{id}` | Update metadata device & konfigurasi pin |
| | `DELETE` | `/devices/{id}` | Menghapus device dari sistem |
| **Telemetry & Data**| `GET` | `/devices/{id}/telemetry/latest` | Mengambil data sensor terbaru dari device |
| | `GET` | `/devices/{id}/telemetry/history` | Query data historis dengan agregasi (`avg`, `max`, `interval=5m`) |
| | `POST` | `/devices/{id}/telemetry` | Ingestion data via HTTP POST (alternatif MQTT) |
| **Control & Shadow**| `POST` | `/devices/{id}/command` | Mengirim perintah kontrol ke Virtual Pin atau key |
| | `GET` | `/devices/{id}/shadow` | Mengambil status Desired dan Reported state |
| | `PUT` | `/devices/{id}/shadow` | Mengubah Desired state dari cloud |
| **OTA Management** | `POST` | `/ota/releases` | Upload binary firmware baru untuk distribusi OTA |
| | `GET` | `/ota/releases` | Daftar rilis binary firmware |
| **Dashboard** | `GET` | `/dashboards` | Mengambil daftar & konfigurasi layout dashboard |
| | `POST` | `/dashboards` | Membuat dashboard baru |
| | `PUT` | `/dashboards/{id}` | Menyimpan susunan layout widget |

#### Contoh Request & Response Telemetry Historis

**Request**:
```http
GET /v1/devices/dev_esp32_01/telemetry/history?keys=temperature,humidity&start=2026-08-17T00:00:00Z&end=2026-08-17T12:00:00Z&interval=1h&agg=avg HTTP/1.1
Host: api.iothub.io
Authorization: Bearer iothub_live_secret_key_xxxxxx
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "device_id": "dev_esp32_01",
  "aggregation": "avg",
  "interval": "1h",
  "points_count": 12,
  "data": [
    {
      "timestamp": "2026-08-17T00:00:00Z",
      "temperature": 28.4,
      "humidity": 72.1
    },
    {
      "timestamp": "2026-08-17T01:00:00Z",
      "temperature": 28.1,
      "humidity": 73.0
    }
  ]
}
```

---

### 10.2 Struktur Topik MQTT

Semua komunikasi MQTT menggunakan protokol standar v3.1.1 / v5.0 dengan TLS pada port `8883`.

```
┌────────────────────────────────────────────────────────────────────────┐
│ MQTT TOPIC HIERARCHY STANDARD                                          │
│                                                                        │
│ Ingestion (Device ──▶ Broker):                                         │
│   • iothub/v1/{token}/telemetry              (Payload: JSON / Pin Data)│
│   • iothub/v1/{token}/attributes/report      (Firmware, IP, Signal)    │
│   • iothub/v1/{token}/events/{severity}      (Warning / Error Logs)    │
│   • iothub/v1/{token}/ota/progress           (Download status %)       │
│                                                                        │
│ Downlink (Broker ──▶ Device):                                          │
│   • iothub/v1/{token}/command                (Perintah Virtual Pin)    │
│   • iothub/v1/{token}/shadow/desired         (Delta sync desired state)│
│   • iothub/v1/{token}/ota/update             (Metadata binary & URL)   │
│                                                                        │
│ System / Lifecycle:                                                    │
│   • iothub/v1/{token}/status                 (Online / LWT Offline)    │
└────────────────────────────────────────────────────────────────────────┘
```

#### Format Payload Telemetry (Dua Mode Dukungan):
1. **Mode JSON Telemetry (Universal)**:
```json
{
  "temperature": 29.5,
  "humidity": 68.2,
  "rssi": -65,
  "voltage": 3.28
}
```

2. **Mode Virtual Pin (Format Ringkas / Sangat Hemat Bandwidth)**:
```json
{
  "v0": 29.5,
  "v1": 68.2,
  "v2": 1
}
```

---

### 10.3 Protokol WebSocket Real-Time

Digunakan oleh Web Dashboard untuk streaming data ultra rendah latensi.
* **Endpoint**: `wss://api.iothub.io/v1/stream?token=<JWT_TOKEN>`

#### Contoh Komunikasi WebSocket Client:
```javascript
// 1. Subscribe ke channel device
ws.send(JSON.stringify({
  action: "subscribe",
  device_id: "dev_esp32_01",
  pins: ["v0", "v1", "v2"]
}));

// 2. Menerima payload live update (Push dari Server)
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("Live Sensor Update:", message);
  // Output: { device_id: "dev_esp32_01", pin: "v0", value: 29.5, ts: 1786948000 }
};

// 3. Mengirim kontrol command dari widget dashboard
ws.send(JSON.stringify({
  action: "write_pin",
  device_id: "dev_esp32_01",
  pin: "v2",
  value: 1
}));
```

---

## 11. Firmware SDK & Contoh Kode Mikrokontroler

### 11.1 Arsitektur Firmware SDK
SDK resmi didesain dengan konsep **Non-Blocking Execution**, **Automatic Exponential Backoff Reconnection**, dan **Zero Dynamic Memory Allocation** pada loop utama guna mencegah memory leak pada mikrokontroler.

---

### 11.2 Contoh Firmware 1: ESP32 (Arduino Framework / C++)

Contoh lengkap pemantauan sensor DHT22, kontrol Relay (V1), pengaturan Brightness PWM (V5), dan auto-reconnect.

```cpp
/*
 * ============================================================================
 * Project      : IoT Hub ESP32 Example Client
 * Description  : Monitoring Suhu/Kelembaban & Kontrol Aktuator Dua Arah
 * Framework    : Arduino IDE / PlatformIO
 * Target Board : ESP32 Dev Module
 * ============================================================================
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// ======================= KONFIGURASI KREDENSIAL =======================
const char* WIFI_SSID     = "NAMA_WIFI_ANDA";
const char* WIFI_PASSWORD = "PASSWORD_WIFI_ANDA";

const char* IOTHUB_BROKER = "mqtt.iothub.io";
const int   IOTHUB_PORT   = 8883;
const char* DEVICE_TOKEN  = "iothub_dev_token_esp32_secure_123456";

// ======================= DEFINISI PIN HARDWARE =======================
#define DHT_PIN       4
#define DHT_TYPE      DHT22
#define RELAY_PIN     2
#define PWM_LED_PIN   18

DHT dht(DHT_PIN, DHT_TYPE);
WiFiClientSecure tlsClient;
PubSubClient mqttClient(tlsClient);

unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 5000; // Kirim data tiap 5 detik

// ======================= HANDLER PERINTAH DARI CLOUD =======================
void handleCloudCommand(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, payload, length);

  if (error) {
    Serial.print(F("[IoT Hub] JSON parsing failed: "));
    Serial.println(error.f_str());
    return;
  }

  // Handle Virtual Pin V1: Kontrol Relay (ON/OFF)
  if (doc.containsKey("v1")) {
    int relayState = doc["v1"].as<int>();
    digitalWrite(RELAY_PIN, relayState ? HIGH : LOW);
    Serial.printf("[IoT Hub] Command V1 (Relay) -> %s\n", relayState ? "ON" : "OFF");
  }

  // Handle Virtual Pin V5: Dimmer LED (PWM 0 - 255)
  if (doc.containsKey("v5")) {
    int pwmValue = doc["v5"].as<int>();
    analogWrite(PWM_LED_PIN, pwmValue);
    Serial.printf("[IoT Hub] Command V5 (Brightness) -> %d\n", pwmValue);
  }
}

// ======================= MANAJEMEN KONEKSI MQTT =======================
void connectToIoTHub() {
  while (!mqttClient.connected()) {
    Serial.print(F("[IoT Hub] Menghubungkan ke Broker MQTT..."));
    
    // Setup Topik LWT (Last Will and Testament)
    String lwtTopic = "iothub/v1/" + String(DEVICE_TOKEN) + "/status";
    String subTopic = "iothub/v1/" + String(DEVICE_TOKEN) + "/command";
    
    // Connect dengan Client ID acak dan LWT Payload "offline"
    String clientId = "ESP32_" + String(random(0xffff), HEX);
    if (mqttClient.connect(clientId.c_str(), DEVICE_TOKEN, "", lwtTopic.c_str(), 1, true, "{\"state\":\"offline\"}")) {
      Serial.println(F(" BERHASIL TERHUBUNG!"));
      
      // Publish status online
      mqttClient.publish(lwtTopic.c_str(), "{\"state\":\"online\"}", true);
      
      // Subscribe ke topik perintah
      mqttClient.subscribe(subTopic.c_str(), 1);
      Serial.printf("[IoT Hub] Subscribed to %s\n", subTopic.c_str());
    } else {
      Serial.printf(" GAGAL! (rc=%d), mencoba lagi dalam 5 detik...\n", mqttClient.state());
      delay(5000);
    }
  }
}

// ======================= SETUP SISTEM =======================
void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(PWM_LED_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  dht.begin();

  // Koneksi WiFi
  Serial.printf("\n[WiFi] Menghubungkan ke %s ", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\n[WiFi] Terhubung! IP Address: %s\n", WiFi.localIP().toString().c_str());

  // Inisialisasi TLS (Insecure Mode untuk dev / sertakan CA Cert untuk prod)
  tlsClient.setInsecure();

  mqttClient.setServer(IOTHUB_BROKER, IOTHUB_PORT);
  mqttClient.setCallback(handleCloudCommand);
}

// ======================= LOOP UTAMA =======================
void loop() {
  if (!mqttClient.connected()) {
    connectToIoTHub();
  }
  mqttClient.loop();

  // Pengiriman Telemetry Periodik
  unsigned long now = millis();
  if (now - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    lastTelemetryTime = now;

    float temperature = dht.readTemperature();
    float humidity    = dht.readHumidity();

    if (!isnan(temperature) && !isnan(humidity)) {
      StaticJsonDocument<256> doc;
      doc["v0"]          = serialized(String(temperature, 2)); // Suhu di V0
      doc["v2"]          = serialized(String(humidity, 2));    // Kelembaban di V2
      doc["temperature"] = serialized(String(temperature, 2)); // Nama Key
      doc["humidity"]    = serialized(String(humidity, 2));
      doc["rssi"]        = WiFi.RSSI();

      char buffer[256];
      size_t len = serializeJson(doc, buffer);

      String pubTopic = "iothub/v1/" + String(DEVICE_TOKEN) + "/telemetry";
      mqttClient.publish(pubTopic.c_str(), buffer, len);

      Serial.printf("[IoT Hub] Data terkirim -> Suhu: %.2f°C | Kelembaban: %.2f%% | RSSI: %d dBm\n", 
                    temperature, humidity, WiFi.RSSI());
    } else {
      Serial.println(F("[Sensor] Gagal membaca data dari sensor DHT22!"));
    }
  }
}
```

---

### 11.3 Contoh Firmware 2: Raspberry Pi / Linux SBC (Python SDK)

Contoh Python SDK modern menggunakan `asyncio` untuk monitoring CPU temperature, RAM, dan status GPIO.

```python
"""
============================================================================
Project      : IoT Hub Python Edge Client
Description  : Telemetry Gateway & GPIO Actuator pada Raspberry Pi
Target OS    : Raspberry Pi OS / Linux Ubuntu
Requirement  : pip install paho-mqtt asyncio psutil
============================================================================
"""

import asyncio
import json
import logging
import psutil
from paho.mqtt import client as mqtt_client

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# ======================= KONFIGURASI =======================
BROKER_HOST  = "mqtt.iothub.io"
BROKER_PORT  = 8883
DEVICE_TOKEN = "iothub_dev_token_rpi_gateway_789012"

TOPIC_TELEMETRY = f"iothub/v1/{DEVICE_TOKEN}/telemetry"
TOPIC_COMMAND   = f"iothub/v1/{DEVICE_TOKEN}/command"
TOPIC_STATUS    = f"iothub/v1/{DEVICE_TOKEN}/status"

class IoTHubClient:
    def __init__(self):
        self.client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION2, f"rpi_{DEVICE_TOKEN[:8]}")
        self.client.username_pw_set(DEVICE_TOKEN, "")
        self.client.tls_set()  # Mengaktifkan TLS
        
        # Setup Callbacks
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        
        # Setup LWT
        self.client.will_set(TOPIC_STATUS, json.dumps({"state": "offline"}), qos=1, retain=True)

    def _on_connect(self, client, userdata, flags, rc, properties=None):
        if rc == 0:
            logging.info("[IoT Hub] Terhubung ke Broker Cloud!")
            client.publish(TOPIC_STATUS, json.dumps({"state": "online"}), qos=1, retain=True)
            client.subscribe(TOPIC_COMMAND, qos=1)
            logging.info(f"[IoT Hub] Subscribed ke topik perintah: {TOPIC_COMMAND}")
        else:
            logging.error(f"[IoT Hub] Gagal terhubung dengan return code: {rc}")

    def _on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            logging.info(f"[IoT Hub] Menerima Perintah: {payload}")
            
            # Simulasi Kontrol Virtual Pin V1
            if "v1" in payload:
                action = "AKTIF" if payload["v1"] == 1 else "NON-AKTIF"
                logging.info(f"[GPIO Simulation] Relay V1 diubah ke -> {action}")
        except Exception as e:
            logging.error(f"[IoT Hub] Error saat parse pesan: {e}")

    def connect(self):
        self.client.connect(BROKER_HOST, BROKER_PORT, keepalive=60)
        self.client.loop_start()

    def send_telemetry(self, data: dict):
        payload = json.dumps(data)
        self.client.publish(TOPIC_TELEMETRY, payload, qos=1)
        logging.info(f"[Telemetry] Terkirim: {payload}")

async def main_loop():
    iot = IoTHubClient()
    iot.connect()

    while True:
        # Mengumpulkan metrics internal Raspberry Pi / Server
        cpu_usage = psutil.cpu_percent(interval=None)
        ram_usage = psutil.virtual_memory().percent
        
        # Membaca sensor suhu CPU
        try:
            with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
                cpu_temp = round(int(f.read().strip()) / 1000.0, 1)
        except Exception:
            cpu_temp = 42.5  # Fallback dummy jika dijalankan di PC

        telemetry_payload = {
            "v0": cpu_temp,
            "v1": cpu_usage,
            "v2": ram_usage,
            "cpu_temperature": cpu_temp,
            "cpu_load_percent": cpu_usage,
            "ram_used_percent": ram_usage
        }

        iot.send_telemetry(telemetry_payload)
        await asyncio.sleep(5)

if __name__ == "__main__":
    try:
        asyncio.run(main_loop())
    except KeyboardInterrupt:
        logging.info("Aplikasi dihentikan oleh user.")
```

---

### 11.4 Contoh Firmware 3: ESP32 (MicroPython)

Contoh implementasi ringan menggunakan MicroPython dan modul `umqtt.simple`.

```python
# ============================================================================
# Project      : IoT Hub MicroPython Client
# Target       : ESP32 / Raspberry Pi Pico W
# ============================================================================

import time
import ujson
import machine
import network
from umqtt.simple import MQTTClient

# Konfigurasi
WIFI_SSID     = "NAMA_WIFI"
WIFI_PASS     = "PASSWORD_WIFI"
BROKER        = "mqtt.iothub.io"
DEVICE_TOKEN  = "iothub_dev_token_micropython_123"

# Setup Hardware
led = machine.Pin(2, machine.Pin.OUT)
adc = machine.ADC(machine.Pin(34)) # Sensor Analog (e.g. LDR / Potensio)
adc.atten(machine.ADC.ATTN_11DB)

# Koneksi WiFi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASS)

print("Menghubungkan WiFi...", end="")
while not wlan.isconnected():
    time.sleep(0.5)
    print(".", end="")
print("\nWiFi Terhubung:", wlan.ifconfig()[0])

# Callback Pesan Masuk
def on_message(topic, msg):
    print("Pesan masuk:", topic, msg)
    data = ujson.loads(msg)
    if "v1" in data:
        led.value(1 if data["v1"] == 1 else 0)
        print("LED Diubah ke:", data["v1"])

# Setup MQTT
client = MQTTClient("esp32_mpy", BROKER, port=1883, user=DEVICE_TOKEN, password="")
client.set_callback(on_message)
client.connect()
client.subscribe(b"iothub/v1/" + DEVICE_TOKEN + b"/command")
print("Terhubung ke IoT Hub Broker!")

# Loop
last_send = 0
while True:
    client.check_msg()
    now = time.time()
    if now - last_send >= 5:
        last_send = now
        analog_val = adc.read()
        payload = ujson.dumps({
            "v0": analog_val,
            "light_intensity": analog_val
        })
        client.publish(b"iothub/v1/" + DEVICE_TOKEN + b"/telemetry", payload)
        print("Data terkirim:", payload)
    time.sleep(0.1)
```

---

## 12. Panduan Integrasi Hardware (Hardware Integration Guide)

### 12.1 Diagram Alur Integrasi Perangkat Baru

```
┌────────────────────────────────────────────────────────────────────────┐
│               STEP-BY-STEP HARDWARE ONBOARDING FLOW                    │
│                                                                        │
│  [ STEP 1: WEB ]         [ STEP 2: FIRMWARE ]    [ STEP 3: RUN ]       │
│  1. Login ke IoT Hub     1. Buka IDE (Arduino/   1. Device boot &      │
│  2. Buat "Device"        PlatformIO/Python)      terkoneksi WiFi       │
│  3. Salin DEVICE_TOKEN   2. Masukkan DEVICE_TOKEN2. Auto-provisioning  │
│  4. Tentukan Pin Datastream 3. Flash ke mikrokontroler 3. Live di Dashboard│
└────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Dukungan Antarmuka Industri (Modbus RTU/TCP & OPC-UA)

Untuk level industri yang menggunakan PLC (Siemens S7, Schneider, Omron), IoT Hub menyediakan **IoT Hub Edge Gateway Daemon** (berjalan pada Raspberry Pi atau Industrial PC Linux).

```
┌──────────────┐     RS485 / Modbus RTU     ┌──────────────────────┐     MQTT (TLS)     ┌──────────────┐
│ Factory PLC  │ ─────────────────────────▶ │  IoT Hub Edge Daemon │ ─────────────────▶ │ IoT Hub Cloud│
│ (Inverter/KW)│                            │ (Protocol Converter) │                    │   Platform   │
└──────────────┘                            └──────────────────────┘                    └──────────────┘
```

* **Modbus Mapper Config File (`gateway_config.yaml`)**:
```yaml
gateway:
  device_token: "iothub_gw_token_factory_floor_01"
  poll_interval_ms: 1000

modbus_devices:
  - name: "Energy_Meter_Line_1"
    slave_id: 1
    port: "/dev/ttyUSB0"
    baudrate: 9600
    registers:
      - address: 30001
        type: "float32"
        target_datastream: "voltage_l1"
        virtual_pin: "v0"
      - address: 30003
        type: "float32"
        target_datastream: "current_l1"
        virtual_pin: "v1"
      - address: 30005
        type: "float32"
        target_datastream: "active_power_kw"
        virtual_pin: "v2"
```

---

## 13. Panduan Integrasi Antar-Platform (Inter-Platform Integration)

```
┌────────────────────────────────────────────────────────────────────────┐
│                     INTEGRATION ECOSYSTEM MATRIX                       │
│                                                                        │
│    ┌──────────────────┐               ┌──────────────────┐             │
│    │  Home Assistant  │ ◀───────────▶ │   IoT Hub Core   │             │
│    │ (MQTT Discovery) │               │   (Event Bus)    │             │
│    └──────────────────┘               └────────┬─────────┘             │
│                                                │                       │
│              ┌─────────────────────────────────┼───────────────┐       │
│              ▼                                 ▼               ▼       │
│    ┌──────────────────┐               ┌────────────────┐ ┌───────────┐ │
│    │ Node-RED Flows   │               │ Grafana Engine │ │ Cloud AWS │ │
│    │ (Visual Logic)   │               │ (Timescale SQL)│ │ Bridge    │ │
│    └──────────────────┘               └────────────────┘ └───────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### 13.1 Integrasi Home Assistant (MQTT Auto-Discovery)
Platform secara otomatis mem-publish config auto-discovery sehingga sensor dan switch langsung muncul di dashboard Home Assistant pengguna tanpa konfigurasi YAML manual.
* **Topic**: `homeassistant/sensor/{device_id}/{pin}/config`

### 13.2 Integrasi Grafana (Enterprise Data Analytics)
Karena data tersimpan dalam TimescaleDB (PostgreSQL), pengguna tier Business & Enterprise dapat menghubungkan Grafana langsung menggunakan driver standar PostgreSQL:
```sql
-- Query Visualisasi Suhu Real-Time di Grafana
SELECT
  time_bucket('1 minute', time) AS "time",
  avg(value) AS "Suhu Rata-rata (°C)"
FROM telemetry_records
WHERE
  device_id = '$device_id' AND
  datastream = 'temperature' AND
  $__timeFilter(time)
GROUP BY 1
ORDER BY 1;
```

### 13.3 Integrasi Outbound Webhooks (ERP, SAP, Custom Backend)
Setiap kali ada trigger atau perubahan data, IoT Hub dapat menembakkan HTTP POST ke URL pihak ketiga:
* **Payload Webhook Outbound**:
```json
{
  "event": "threshold_breached",
  "organization_id": "org_indofood_01",
  "device_id": "dev_boiler_04",
  "datastream": "pressure_bar",
  "current_value": 12.8,
  "threshold_limit": 10.0,
  "timestamp": "2026-08-17T12:05:30.123Z",
  "signature_sha256": "8f4a3c1e2b5d7..."
}
```

---

## 14. Keamanan, Standar Industri & Compliance

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SECURITY DEFENSE LAYERS                         │
│                                                                        │
│   [ Transport ] ──▶ TLS 1.3 / mTLS X.509 Certificate                   │
│   [ Access    ] ──▶ JWT + Scoped API Keys + RBAC                       │
│   [ Storage   ] ──▶ AES-256 Data at Rest + Argon2 Password Hash        │
│   [ Perimeter ] ──▶ WAF + DDoS Mitigation + Ingestion Rate Limiter     │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Keamanan Komunikasi (Data in Transit)**:
   * Enkripsi wajib TLS 1.2 / TLS 1.3 pada port MQTT (8883) dan HTTPS (443).
   * Opsi Mutual TLS (mTLS) dengan sertifikat X.509 per-device untuk implementasi Enterprise.
2. **Keamanan Data (Data at Rest)**:
   * Enkripsi database menggunakan AES-256.
   * Kredensial rahasia (token broker, third-party API key) disimpan dengan enkripsi via HashiCorp Vault.
3. **Audit Trail & Logging**:
   * Setiap aksi kontrol saklar, perubahan rule, atau download firmware dicatat secara permanen di tabel audit log (siapa, kapan, IP mana, aksi apa).
4. **Kepatuhan Regulasi (Compliance Target)**:
   * Standar privasi data GDPR (General Data Protection Regulation).
   * Standar keamanan siber industri IEC 62443 untuk komunikasi Industrial Automation and Control Systems.

---

## 15. Non-Functional Requirements (NFR) & Skalabilitas

| Metrik NFR | Target Kinerja | Metode Pengujian |
|---|---|---|
| **Broker Throughput** | Minimal 50.000 pesan/detik per node | Load test dengan `emqtt_bench` |
| **Broker Latency** | < 25 ms (Device ➡️ Broker ➡️ Webhook) | End-to-end benchmark tracing |
| **API Response Time** | P95 < 80 ms, P99 < 200 ms | Locust / k6 load testing |
| **Web Dashboard First Load**| < 1.5 detik (First Contentful Paint) | Google Lighthouse audit |
| **System Availability / Uptime** | 99.95% (Multi-Region Failover) | Automated Uptime Monitor (Prometheus) |
| **Telemetry Data Retention** | 100 Juta titik data per node tanpa degradasi | TimescaleDB hypertable partition pruning |
| **Concurrent Connections** | 100.000 perangkat online bersamaan | Distributed cluster test |

---

## 16. Model Bisnis & Skema Tier Pricing

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER PRICING PACKAGES                           │
│                                                                        │
│   [ 🆓 FREE ]          [ 🔧 MAKER ]        [ 🚀 PRO / BIZ ]    [ 🏭 ]  │
│   • 5 Devices          • 25 Devices        • 250 Devices       • Custom│
│   • 7 Hari Log         • 30 Hari Log       • 1 Tahun Log       • On-   │
│   • $0 / Bulan         • $9.90 / Bulan     • $79.00 / Bulan      Prem  │
└────────────────────────────────────────────────────────────────────────┘
```

| Fitur | 🆓 **Free (Maker)** | 🔧 **Maker Plus** | 🚀 **Pro / Startup** | 🏢 **Enterprise / IIoT** |
|---|---|---|---|---|
| **Target** | Hobi, Tugas Kampus | Prototyper, Smart Home | Startup IoT, Bisnis | Pabrik, Energi, OEM |
| **Biaya** | **Gratis ($0)** | **$9.90 / bln** | **$79.00 / bln** | **Custom Quote** |
| **Jumlah Device** | Max 5 Perangkat | Max 25 Perangkat | Max 250 Perangkat | Tidak Terbatas |
| **Virtual Pins / Device** | 16 Pin | 64 Pin | 256 Pin | 256 Pin |
| **Retensi Data** | 7 Hari | 30 Hari | 1 Tahun | Custom / Permanen |
| **Interval Minimal** | 1 Detik | 500 ms | 100 ms | 50 ms |
| **Dashboard Builder** | Maks 2 Dashboard | Maks 10 Dashboard | Unlimited | Unlimited + SCADA Engine |
| **Notifikasi Alert** | Email & In-App | Email, Telegram | Email, Telegram, WA, SMS | Semua + Webhook SLA |
| **OTA Firmware Update** | Manual Single | Batch Update | Otomatis + Rollback | Advanced Fleet Rollout |
| **White-Label Branding** | ❌ | ❌ | Subdomain Kustom | Custom Domain, Logo, App |
| **Deployment Mode** | Cloud Shared | Cloud Shared | Cloud Dedicated | Cloud / Self-Hosted Docker |

---

## 17. Roadmap Pengembangan & Rencana Implementasi

```
┌────────────────────────────────────────────────────────────────────────┐
│ 12-MONTH IMPLEMENTATION ROADMAP                                        │
│                                                                        │
│ Q1 (Bln 1-3)  : Core Ingestion, MQTT TLS, Time-Series DB, ESP32 SDK    │
│ Q2 (Bln 4-6)  : Drag-Drop Dashboard Builder, Widget Library, Shadow    │
│ Q3 (Bln 7-9)  : Visual Rule Engine, OTA Manager, Python & STM32 SDK    │
│ Q4 (Bln 10-12): SCADA HMI Widgets, Multi-Tenancy, Enterprise Launch    │
└────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Core Foundation & Ingestion Engine (Bulan 1–3)
* Setup Ingestion Layer: EMQX Cluster, PostgreSQL 16, TimescaleDB, Redis.
* Core Backend API: Autentikasi JWT, Device Registry, Endpoint Telemetry.
* Firmware SDK v1.0: Pustaka C++ Arduino untuk ESP32/ESP8266 dengan Virtual Pin.
* Pengujian throughput dasar 10.000 message/detik.

### Phase 2: Professional Dashboard & Device Shadow (Bulan 4–6)
* Frontend Web Canvas: Grid drag-and-drop layout responsif.
* Widget Library Dasar: Line Chart, Gauge, Toggle, Slider, Value Display.
* Implementasi WebSocket real-time stream.
* Fitur Device Shadow (Desired vs Reported State synchronization).

### Phase 3: Rule Engine, OTA & Extended SDKs (Bulan 7–9)
* Visual Flow-Based Rule Engine (Trigger ➡️ Condition ➡️ Action).
* Sistem Notifikasi: Integrasi Telegram Bot, Email SMTP, WhatsApp Cloud API.
* Modul OTA Firmware Update dengan progress bar interaktif.
* Rilis SDK tambahan: Python SDK (Raspberry Pi), MicroPython, dan STM32 HAL.

### Phase 4: Industrial Features, SCADA & Enterprise Scale (Bulan 10–12)
* Pembuatan Widget SCADA HMI (Dynamic SVG schematics).
* Modbus Gateway Daemon untuk integrasi mesin pabrik / PLC.
* Multi-Tenancy Organisasi, RBAC terinci, dan Audit Log.
* Penetration Testing, Security Hardening, dan Peluncuran Publik (v1.0 GA).

---

## 18. Struktur Direktori Proyek (Project Structure)

Berikut rancangan struktur repository monorepo yang bersih dan modular:

```
d:\PROJECT PYTHON\IOT_HUB\
├── PRD.md                          # Dokumen Persyaratan Produk ini
├── docker-compose.yml              # Setup infrastruktur lokal (EMQX, DB, Redis)
├── README.md                       # Panduan setup & quickstart
│
├── apps/
│   ├── web/                        # Frontend Web App (Next.js 14, Tailwind)
│   │   ├── src/
│   │   │   ├── app/                # Next.js App Router Pages
│   │   │   ├── components/
│   │   │   │   ├── canvas/         # Drag & Drop Grid Canvas
│   │   │   │   ├── widgets/        # Widget Library (Gauge, Chart, SCADA)
│   │   │   │   └── rules/          # Flow-based visual rule editor
│   │   │   ├── hooks/              # Custom Hooks (useWebSocket, useTelemetry)
│   │   │   └── lib/                # API Client & Utility Functions
│   │   └── package.json
│   │
│   └── api/                        # Core Backend API (FastAPI)
│       ├── src/
│       │   ├── api/v1/             # REST API Router Endpoints
│       │   ├── core/               # Konfigurasi, Security, Database Pool
│       │   ├── models/             # ORM SQL Models (PostgreSQL & Timescale)
│       │   ├── schemas/            # Pydantic Input/Output Validation
│       │   ├── services/           # Business Logic (Shadow, Telemetry, Rules)
│       │   └── workers/            # Background Tasks (Alert Dispatcher, OTA)
│       └── requirements.txt
│
├── packages/
│   └── shared-types/               # Schema TypeScript & JSON Types bersama
│
├── firmware/                       # Firmware SDKs Resmi & Contoh Kode
│   ├── iothub-esp32-arduino/       # Library C++ Arduino IDE / PlatformIO
│   │   ├── src/                    # Source code library (IoTHub.h, IoTHub.cpp)
│   │   └── examples/
│   │       ├── 01_BasicTelemetry/
│   │       ├── 02_RelayControl/
│   │       └── 03_Complete_DHT22/
│   ├── iothub-python-edge/         # SDK Python untuk Raspberry Pi / Linux
│   ├── iothub-micropython/         # Library MicroPython ESP32 / Pico W
│   └── iothub-stm32/               # Contoh C HAL untuk STM32 + W5500
│
├── docs/                           # Dokumentasi Developer & API
│   ├── openapi.json                # OpenAPI 3.1 Specification
│   ├── hardware-guides/            # Panduan skematik & wiring sensor
│   └── platform-integration/       # Panduan integrasi Home Assistant, Grafana
│
└── deploy/                         # File Deployment Production
    ├── docker/                     # Dockerfile per service
    ├── k8s/                        # Kubernetes Manifests / Helm Chart
    └── emqx/                       # Konfigurasi EMQX ACL & Authentication
```

---

## 19. Matriks Risiko & Rencana Mitigasi

| Risiko | Dampak | Probabilitas | Rencana Mitigasi |
|---|:---:|:---:|---|
| **Beban Spike Pesan MQTT** | 🔴 Tinggi | Sedang | Gunakan EMQX Connection Pooling + Kafka Message Queue buffer sebelum masuk ke DB |
| **Koneksi Internet Mikrokontroler Putus-Nyambung** | 🟡 Sedang | Tinggi | Implementasikan Ring Buffer di RAM MCU; kirim kembali data saat jaringan pulih (*offline sync*) |
| **Data Ingestion Bottleneck di Database** | 🔴 Tinggi | Sedang | Wajib gunakan TimescaleDB Hypertables dengan partition otomatis per hari & kompresi kolom |
| **Kerentanan Keamanan Token Device** | 🔴 Tinggi | Rendah | Validasi token per-topik di layer broker (EMQX ACL); batasi agar device A tidak bisa subscribe device B |
| **Kompleksitas UI Dashboard bagi Pemula** | 🟡 Sedang | Sedang | Sediakan template dashboard 1-klik siap pakai (misal: "Smart Agriculture", "Weather Station") |

---

## 20. Metrik Keberhasilan Produk (KPI)

### 20.1 Kinerja Teknis (Engineering KPIs)
* **Time-to-First-Data (TTFD)**: Pengembang baru dapat menghubungkan ESP32 dan melihat data pertama di dashboard dalam waktu **< 5 menit**.
* **Crash-Free Firmware Rate**: > 99.9% firmware client beroperasi stabil tanpa crash/reboot selama minimal 30 hari berturut-turut.
* **Latency Push Real-Time**: < 100 ms dari mikrokontroler hingga widget web bergerak.

### 20.2 Pertumbuhan Pengguna & Bisnis (Product KPIs)
* **Aktivasi Pengguna**: > 60% pengguna terdaftar berhasil mendaftarkan minimal 1 device aktif di minggu pertama.
* **Tingkat Retensi (30-day Retention)**: > 45% device yang terdaftar terus mengirimkan data setelah bulan pertama.
* **Konversi Free-to-Paid**: 5% hingga 8% pengguna beralih ke tier Maker Plus atau Pro dalam 6 bulan.

---

> **📌 Langkah Selanjutnya**:
> Dokumen PRD ini siap dibaca dan dikoreksi. Setelah disetujui, kita dapat langsung mulai mengeksekusi **Phase 1** (Infrastruktur Backend Ingestion, Database Schema, dan Core Dashboard Web).

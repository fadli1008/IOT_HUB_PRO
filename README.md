# 🌐 IoT Hub — Universal & Industrial IoT Platform
> **Lead Developer & Creator**: **Fadli**

Platform IoT end-to-end modern dan agnostik perangkat keras yang dibangun dan dirancang oleh **Fadli**, dirancang untuk menghubungkan hardware kustom ke cloud dengan kemudahan setara **Blynk**, fleksibilitas aturan setara **ThingsBoard**, dan keandalan kelas industri.

---

## 📚 Dokumen Proyek
* 📋 **[PRD.md](file:///d:/PROJECT%20PYTHON/IOT_HUB/PRD.md)** — Product Requirements Document lengkap (arsitektur, spesifikasi fitur, benchmark kompetitor, roadmap).
* 📖 **[USER_MANUAL.md](file:///d:/PROJECT%20PYTHON/IOT_HUB/USER_MANUAL.md)** — Buku Panduan Pengguna lengkap (dari registrasi akun, pembuatan dashboard drag-and-drop, hingga integrasi firmware ESP32, Python, dan MicroPython).
* 🚀 **[Walkthrough](file:///C:/Users/fadli/.gemini/antigravity-ide/brain/da6a33f7-8eac-4cff-b309-68891207f9ff/walkthrough.md)** — Rangkuman implementasi dan hasil verifikasi platform.

---

## ⚡ Cara Menjalankan Secara Lokal

### 1. Instalasi Dependensi
```powershell
cd "d:\PROJECT PYTHON\IOT_HUB"
npm install
```

### 2. Menjalankan Development Server
```powershell
npm run dev
```
Akses di browser pada: **`http://localhost:5173/`**

### 3. Production Build
```powershell
npm run build
```

---

## 🌟 Fitur-Fitur Utama

1. **Gated Public Landing Page & Auth Flow**:
   * Formulir Sign-Up & Sign-In dengan verifikasi Email OTP 6-Digit.
   * Onboarding Wizard 3 langkah dengan aktivasi otomatis **Free Lifetime Tier (5 Perangkat)**.
2. **WYSIWYG Drag & Drop Dashboard Builder**:
   * Canvas grid 12/24 kolom responsif dengan *magnetic snap-to-grid*.
   * **Property Inspector** untuk data binding Virtual Pin (`V0`–`V255`), rumus matematika kustom (`value * 1.8 + 32`), pewarnaan ambang batas (*threshold alerts*), dan tema kartu.
   * Katalog widget lengkap: Radial Gauges, Time-Series Charts multi-axis, Toggle Relays, PWM Sliders, Liquid Tanks, SCADA HMI Schematics, GPS Fleet Maps, RGB Color Pickers, dan Serial Console.
3. **Device Fleet & Digital Twin (Device Shadow)**:
   * Generator `DEVICE_TOKEN`, status koneksi real-time, dan inspektor sinkronisasi status *Desired vs Reported*.
4. **Built-in Virtual Hardware Simulator**:
   * Papan sirkuit virtual di dalam browser untuk menguji respon sensor & saklar secara instan tanpa perlu hardware fisik.
5. **Interactive Firmware SDK Generator**:
   * Pembuat kode otomatis untuk **ESP32 (Arduino C++)**, **Raspberry Pi (Python Asyncio)**, dan **ESP32 (MicroPython)**.
6. **Visual Rule Engine**:
   * Otomasi pemicu ambang batas (*Threshold Trigger* ➡️ *Telegram/Email Alert* / *Relay Shutdown*).
7. **API Documentation & MQTT Topic Explorer**:
   * Dokumentasi OpenAPI 3.1 interaktif dengan tombol eksekusi live dan generator perintah **cURL**.

---
*Dikembangkan & Dirancang oleh **Fadli** • React 18, Vite, TypeScript & Tailwind CSS • 2026*

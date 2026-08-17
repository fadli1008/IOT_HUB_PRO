# 📖 Buku Panduan Pengguna (User Manual)
# **IoT Hub** — Universal & Industrial IoT Platform
> **Dikembangkan & Dirancang oleh**: **Fadli** (Lead IoT Architect & Developer)  
> **Versi**: 1.0.0 Industrial Release

Selamat datang di **IoT Hub**! Platform IoT universal yang dikembangkan oleh **Fadli** untuk memberikan fleksibilitas penuh dalam menghubungkan berbagai perangkat keras custom, menyusun dashboard pemantauan visual secara drag-and-drop, serta mengelola otomasi industri.

---

## 📑 Daftar Isi
1. [Pengenalan Konsep Dasar IoT Hub](#1-pengenalan-konsep-dasar-iot-hub)
2. [Langkah 1: Registrasi Akun & Onboarding Awal](#2-langkah-1-registrasi-akun--onboarding-awal)
3. [Langkah 2: Mendaftarkan Perangkat Baru (Device Registration)](#3-langkah-2-mendaftarkan-perangkat-baru-device-registration)
4. [Langkah 3: Mengintegrasikan Hardware & Mengunggah Firmware](#4-langkah-3-mengintegrasikan-hardware--mengunggah-firmware)
   - [A. Panduan ESP32 / ESP8266 (Arduino C++)](#a-panduan-esp32--esp8266-arduino-c)
   - [B. Panduan Raspberry Pi / Linux SBC (Python)](#b-panduan-raspberry-pi--linux-sbc-python)
   - [C. Panduan ESP32 / RP2040 (MicroPython)](#c-panduan-esp32--rp2040-micropython)
   - [D. Panduan Mesin Industri / PLC (Modbus RTU/TCP)](#d-panduan-mesin-industri--plc-modbus-rtutcp)
5. [Langkah 4: Membangun Dashboard Kustom (Drag & Drop Builder)](#5-langkah-4-membangun-dashboard-kustom-drag--drop-builder)
6. [Langkah 5: Menguji dengan Virtual Hardware Simulator](#6-langkah-5-menguji-dengan-virtual-hardware-simulator)
7. [Langkah 6: Membuat Aturan Otomasi (Visual Rule Engine)](#7-langkah-6-membuat-aturan-otomasi-visual-rule-engine)
8. [Langkah 7: Integrasi REST API, MQTT & Pihak Ketiga](#8-langkah-7-integrasi-rest-api-mqtt--pihak-ketiga)
9. [Tanya Jawab & Pemecahan Masalah (FAQ & Troubleshooting)](#9-tanya-jawab--pemecahan-masalah-faq--troubleshooting)

---

## 1. Pengenalan Konsep Dasar IoT Hub

Sebelum mulai, mari pahami 3 konsep inti di IoT Hub:

```
┌─────────────────┐       MQTT / HTTP        ┌───────────────────────────┐       WebSockets        ┌──────────────────┐
│ Physical Device │ ───────────────────────▶ │          IoT Hub          │ ──────────────────────▶ │ Custom Dashboard │
│ (ESP32/Sensors) │ ◀─────────────────────── │ (Virtual Pins & Shadow)   │ ◀────────────────────── │ (Gauges/Widgets) │
└─────────────────┘       Command Topic      └───────────────────────────┘       Command Send      └──────────────────┘
```

1. **Virtual Pin (`V0` – `V255`)**:
   Abstraksi saluran data universal. Sebagai contoh:
   * `V0` = Sensor Suhu (°C)
   * `V1` = Sensor Kelembaban (%)
   * `V2` = Saklar Relay Pompa Air (0 atau 1)
   * `V5` = Pengatur Kecepatan Kipas PWM (0 – 255)
2. **Device Auth Token (`DEVICE_TOKEN`)**:
   Kunci rahasia unik (misal: `iothub_tok_esp32_boiler_98a7bc`) yang digunakan oleh mikrokontroler Anda untuk mengautentikasi koneksi ke broker MQTT dan API cloud kami.
3. **Digital Twin (Device Shadow)**:
   Salinan status perangkat di cloud yang mencatat *Desired State* (perintah target dari pengguna) dan *Reported State* (status aktual sensor/aktuator di perangkat).

---

## 2. Langkah 1: Registrasi Akun & Onboarding Awal

Platform IoT Hub memberlakukan **Gated Access** (akses terproteksi). Setiap pengguna wajib mendaftar akun sebelum dapat mengelola perangkat.

```
┌────────────────────┐     Registrasi Form     ┌───────────────────────┐     Pilih Persona     ┌──────────────────────┐
│ Landing Page       │ ──────────────────────▶ │ Verifikasi Email OTP  │ ────────────────────▶ │ Workspace Dashboard  │
│ (http://localhost) │                         │ (Kode 6-Digit)        │                       │ (Paket Free Aktif)   │
└────────────────────┘                         └───────────────────────┘                       └──────────────────────┘
```

### Langkah-langkah:
1. Buka browser dan akses **[http://localhost:5173/](http://localhost:5173/)**.
2. Pada halaman depan publik, klik tombol **"Get Started Free"** atau **"Sign In"**.
3. Pilih tab **Sign Up (Daftar)**:
   * Masukkan **Nama Lengkap** (contoh: *Ahmad Fauzi*).
   * Masukkan **Email Aktif** (contoh: *ahmad@gmail.com*).
   * Masukkan **Password** yang aman.
   * *(Atau klik tombol **Google** / **GitHub** untuk registrasi instan 1-klik)*.
4. **Verifikasi Email OTP**:
   * Masukkan kode verifikasi 6-digit (pada mode demo lokal, Anda dapat memasukkan kode sembarang 6 angka, misal: **`123456`**).
5. **Onboarding Wizard (3 Langkah Cepat)**:
   * **Langkah 1**: Masukkan nama workspace/proyek pertama Anda (contoh: *"Smart Home Project"* atau *"Laboratorium IoT"*).
   * **Langkah 2**: Pilih profil penggunaan Anda (*Maker/Education*, *IoT Commercial*, atau *Industrial/IIoT*).
   * **Langkah 3**: Sistem secara otomatis mengaktifkan **Free Lifetime Tier (Gratis 5 Perangkat)** tanpa meminta kartu kredit.
   * Klik **"Launch IoT Hub Workspace"** untuk masuk ke dashboard utama!

---

## 3. Langkah 2: Mendaftarkan Perangkat Baru (Device Registration)

Setelah masuk ke workspace, Anda perlu mendaftarkan perangkat agar mendapatkan `DEVICE_TOKEN`.

1. Pada navigasi sidebar sebelah kiri, klik menu **"Device Fleet"**.
2. Klik tombol **"+ Register New Device"** di sudut kanan atas.
3. Isi informasi perangkat Anda pada modal yang muncul:
   * **Device Name**: Beri nama yang deskriptif (contoh: `ESP32 Smart Boiler Unit 01`).
   * **Hardware Architecture**: Pilih chip mikrokontroler Anda (contoh: `ESP32 / ESP8266`).
   * **Device Blueprint Template**: Pilih template yang sesuai (misal: *Industrial Smart Boiler*, *Weather Station*, atau *Blank*).
   * **Tags**: Beri label pembantu (contoh: `Line A, Sensor Suhu`).
4. Klik **"Create Device"**.
5. Perangkat Anda sekarang terdaftar! Temukan kartu perangkat Anda di daftar, lalu klik tombol **"Copy Token"** untuk menyalin token rahasia perangkat Anda.

---

## 4. Langkah 3: Mengintegrasikan Hardware & Mengunggah Firmware

Platform IoT Hub menyediakan generator kode otomatis di menu **"Firmware SDK"**. Berikut adalah panduan langkah demi langkah untuk berbagai jenis hardware:

---

### A. Panduan ESP32 / ESP8266 (Arduino C++)

```
┌────────────────┐      Wi-Fi / Internet      ┌─────────────────────┐
│  ESP32 DevKit  │ ─────────────────────────▶ │ Broker MQTT Global  │
│  + Sensor DHT  │      Port :1883            │ (broker.emqx.io)    │
└────────────────┘                            └─────────────────────┘
```

#### 1. Persiapan Software & Library (Arduino IDE / PlatformIO):
Pastikan Anda telah menginstal library berikut melalui Library Manager di Arduino IDE:
* **`PubSubClient`** (oleh Nick O'Leary)
* **`ArduinoJson`** (oleh Benoit Blanchon - versi 6.x / 7.x)
* **`DHT sensor library`** (oleh Adafruit - jika menggunakan sensor suhu/kelembaban DHT)

#### 2. Generator Kode Otomatis:
1. Buka menu **"Firmware SDK"** di sidebar web IoT Hub.
2. Pada dropdown **Target Device**, pilih perangkat yang baru Anda buat.
3. Pada dropdown **Framework**, pilih **`ESP32 (Arduino C++)`**.
4. Masukkan **WiFi SSID** dan **WiFi Password** rumah/kantor Anda.
5. Kode lengkap akan ter-generate secara otomatis! Klik **"Copy Code"** atau **"Download File" (`.ino`)**.

#### 3. Cuplikan Kode Firmware ESP32:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// ========== KONFIGURASI KREDENSIAL ==========
const char* WIFI_SSID     = "NAMA_WIFI_ANDA";
const char* WIFI_PASSWORD = "PASSWORD_WIFI_ANDA";

// Broker MQTT Global Publik & Gratis Aktif
const char* IOTHUB_BROKER = "broker.emqx.io";
const int   IOTHUB_PORT   = 1883;
const char* DEVICE_TOKEN  = "MASUKKAN_DEVICE_TOKEN_ANDA_DISINI";

#define DHT_PIN       4
#define DHT_TYPE      DHT22
#define RELAY_PIN     2

DHT dht(DHT_PIN, DHT_TYPE);
WiFiClientSecure tlsClient;
PubSubClient mqttClient(tlsClient);
unsigned long lastSend = 0;

// Handler Perintah dari Dashboard (Cloud -> Device)
void handleCloudCommand(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<256> doc;
  deserializeJson(doc, payload, length);

  // Jika saklar V2 di dashboard ditekan
  if (doc.containsKey("v2") || doc.containsKey("V2")) {
    int state = doc["v2"] | doc["V2"];
    digitalWrite(RELAY_PIN, state ? HIGH : LOW);
    Serial.printf("[IoT Hub] Relay V2 diubah ke: %s\n", state ? "ON" : "OFF");
  }
}

void connectToIoTHub() {
  while (!mqttClient.connected()) {
    Serial.print("Menghubungkan ke IoT Hub...");
    String clientId = "ESP32_" + String(random(0xffff), HEX);
    String lwtTopic = "iothub/v1/" + String(DEVICE_TOKEN) + "/status";
    String subTopic = "iothub/v1/" + String(DEVICE_TOKEN) + "/command";

    if (mqttClient.connect(clientId.c_str(), DEVICE_TOKEN, "", lwtTopic.c_str(), 1, true, "{\"state\":\"offline\"}")) {
      Serial.println(" TERHUBUNG!");
      mqttClient.publish(lwtTopic.c_str(), "{\"state\":\"online\"}", true);
      mqttClient.subscribe(subTopic.c_str(), 1);
    } else {
      Serial.println(" Gagal. Mencoba lagi dalam 3 detik...");
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Terhubung!");

  tlsClient.setInsecure(); // Mengaktifkan TLS
  mqttClient.setServer(IOTHUB_BROKER, IOTHUB_PORT);
  mqttClient.setCallback(handleCloudCommand);
}

void loop() {
  if (!mqttClient.connected()) {
    connectToIoTHub();
  }
  mqttClient.loop();

  // Kirim data setiap 2 detik (Device -> Cloud)
  if (millis() - lastSend >= 2000) {
    lastSend = millis();

    float temp = dht.readTemperature();
    float hum  = dht.readHumidity();

    if (!isnan(temp) && !isnan(hum)) {
      StaticJsonDocument<256> doc;
      doc["v0"] = temp;        // Saluran Pin V0: Suhu
      doc["v1"] = hum;         // Saluran Pin V1: Kelembaban
      doc["rssi"] = WiFi.RSSI();

      char buffer[256];
      serializeJson(doc, buffer);

      String pubTopic = "iothub/v1/" + String(DEVICE_TOKEN) + "/telemetry";
      mqttClient.publish(pubTopic.c_str(), buffer);
      Serial.printf("Data terkirim -> Suhu: %.1f°C | Kelembaban: %.1f%%\n", temp, hum);
    }
  }
}
```

#### 4. Upload & Verifikasi:
1. Sambungkan kabel USB ESP32 ke komputer Anda.
2. Klik tombol **Upload** di Arduino IDE.
3. Buka **Serial Monitor** (Baud rate: `115200`). Anda akan melihat pesan:
   `[IoT Hub] Menghubungkan ke Broker MQTT... TERHUBUNG!`
4. Buka kembali dashboard web IoT Hub. Status perangkat Anda pada kartu akan berubah menjadi **ONLINE (Hijau)** dan nilai sensor suhu akan mulai bergerak secara live!

---

### B. Panduan Raspberry Pi / Linux SBC (Python)

Cocok untuk gateway industri, mini PC, atau Raspberry Pi yang membaca metrik CPU/RAM atau sensor Modbus RS485.

```bash
# 1. Install dependensi
pip install paho-mqtt psutil
```

```python
# edge_gateway.py
import asyncio
import json
import psutil
from paho.mqtt import client as mqtt_client

DEVICE_TOKEN = "MASUKKAN_DEVICE_TOKEN_ANDA"
BROKER = "mqtt.iothub.io"

def on_connect(client, userdata, flags, rc, properties=None):
    print("Terhubung ke IoT Hub Cloud!")
    client.subscribe(f"iothub/v1/{DEVICE_TOKEN}/command")

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())
    print(f"Menerima perintah dari dashboard: {payload}")

client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION2, f"rpi_{DEVICE_TOKEN[:8]}")
client.username_pw_set(DEVICE_TOKEN, "")
client.tls_set()
client.on_connect = on_connect
client.on_message = on_message
client.connect(BROKER, 8883, 60)
client.loop_start()

async def main():
    while True:
        cpu = psutil.cpu_percent()
        ram = psutil.virtual_memory().percent
        # Kirim data CPU ke Pin V0, RAM ke Pin V1
        payload = json.dumps({"v0": cpu, "v1": ram})
        client.publish(f"iothub/v1/{DEVICE_TOKEN}/telemetry", payload)
        print(f"Telemetry terkirim -> CPU: {cpu}% | RAM: {ram}%")
        await asyncio.sleep(2)

asyncio.run(main())
```

---

### C. Panduan ESP32 / RP2040 (MicroPython)

Gunakan **Thonny IDE** untuk mengunggah script berikut ke board MicroPython Anda:

```python
import time, ujson, network, machine
from umqtt.simple import MQTTClient

WIFI_SSID = "NAMA_WIFI"
WIFI_PASS = "PASSWORD_WIFI"
DEVICE_TOKEN = "MASUKKAN_TOKEN_ANDA"

# Koneksi WiFi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASS)
while not wlan.isconnected():
    time.sleep(0.5)
print("WiFi Terhubung!")

# Callback Perintah
def on_cmd(topic, msg):
    data = ujson.loads(msg)
    print("Command:", data)

client = MQTTClient("mpy_client", "mqtt.iothub.io", port=1883, user=DEVICE_TOKEN, password="")
client.set_callback(on_cmd)
client.connect()
client.subscribe(b"iothub/v1/" + DEVICE_TOKEN + b"/command")

# Loop Pengiriman Data
adc = machine.ADC(machine.Pin(34))
while True:
    client.check_msg()
    val = adc.read() # Sensor analog
    client.publish(b"iothub/v1/" + DEVICE_TOKEN + b"/telemetry", ujson.dumps({"v0": val}))
    time.sleep(2)
```

---

### D. Panduan Mesin Industri / PLC (Modbus RTU/TCP)

Untuk menghubungkan PLC pabrik (Siemens S7, Schneider, Omron, Delta) atau inverter daya listrik:
1. Hubungkan port RS485 PLC ke port USB Raspberry Pi / Industrial PC menggunakan konverter USB-to-RS485.
2. Gunakan pemetaan register Modbus ke Virtual Pin IoT Hub:
   * Register `30001` (Holding Register Tegangan Listrik) ➡️ Bind ke Pin `V0`
   * Register `30002` (Holding Register Arus Listrik) ➡️ Bind ke Pin `V1`
   * Coil `00001` (Kontrol Motor Relay) ➡️ Bind ke Pin `V2`

---

## 5. Langkah 4: Membangun Dashboard Kustom (Drag & Drop Builder)

IoT Hub menyediakan editor dashboard visual berbasis WYSIWYG yang sangat mudah digunakan:

```
┌──────────────────┐     Pilih Pin (V0)      ┌──────────────────────┐     Klik "Save"       ┌──────────────────┐
│ Tarik Widget     │ ──────────────────────▶ │ Atur Warna & Satuan  │ ────────────────────▶ │ Monitoring Live  │
│ (Gauge / Chart)  │                         │ di Property Inspector│                       │ Real-time        │
└──────────────────┘                         └──────────────────────┘                       └──────────────────┘
```

### 1. Masuk ke Mode Edit:
* Klik menu **"Dashboards"** di sidebar.
* Klik tombol **"Edit Dashboard"** di bagian atas kanan navbar.

### 2. Menambahkan Widget Baru:
* Klik tombol **"+ Widgets"** untuk membuka **Widget Library** di sidebar kiri.
* Cari widget yang Anda inginkan (misal: *Radial Gauge*, *Time-Series Chart*, *Relay Switch*, *Liquid Tank*, atau *SCADA Plant*).
* Klik pada widget tersebut untuk memasukkannya ke dalam canvas grid.

### 3. Mengubah Ukuran & Memindahkan Widget:
* Klik tombol panah **`[ ⤢ Widen ]`** atau **`[ ⤡ Narrow ]`** di kartu widget untuk memperlebar/mempersempit kolom (tersedia dari 2 kolom hingga 12 kolom penuh).
* Anda dapat membuat tab baru dengan mengklik **"+ New Tab"** (contoh: Tab 1: *Ringkasan*, Tab 2: *SCADA Pipa*, Tab 3: *Peta GPS*).

### 4. Mengonfigurasi Properti Widget (Property Inspector):
Klik pada widget yang ingin Anda atur untuk membuka **Property Inspector** di sebelah kanan:
* **Target Device**: Pilih perangkat hardware yang ingin dihubungkan.
* **Primary Pin**: Pilih saluran Virtual Pin (misal: `V0` untuk suhu).
* **Unit Display**: Masukkan satuan unit (contoh: `°C`, `bar`, `RPM`, `kWh`).
* **Min/Max Limit**: Tentukan skala grafik/gauge (contoh: Min `0`, Max `150`).
* **Formula Transformation**: Anda dapat menulis rumus matematika (contoh: `value * 1.8 + 32` untuk mengubah nilai Celcius ke Fahrenheit secara otomatis di browser).
* **Alarm Thresholds**: Atur batas warna dinamis (contoh: Nilai di atas `85` otomatis membuat kartu berkedip merah / *Critical*).
* **Card Theme**: Pilih tema kartu (*Glassmorphism*, *Solid Dark*, atau *Cyber Glow*).

### 5. Mode Tampilan:
* **Pratinjau Responsif**: Gunakan ikon monitor, tablet, dan smartphone di toolbar atas untuk melihat bagaimana tampilan dashboard di layar HP Anda.
* **Mode Kiosk**: Klik ikon layar penuh untuk menampilkan dashboard tanpa navbar di monitor ruang kendali pabrik (NOC).

---

## 6. Langkah 5: Menguji dengan Virtual Hardware Simulator

Jika Anda sedang bepergian atau belum memiliki perangkat keras fisik, Anda tetap dapat menguji seluruh fungsi platform menggunakan **Virtual Hardware Simulator**:

1. Klik menu **"Virtual Hardware"** di sidebar kiri.
2. Anda akan melihat papan sirkuit virtual yang merepresentasikan perangkat ESP32 dan Raspberry Pi Anda.
3. **Uji Sensor**: Geser slider temperatur `V0` atau tekanan `V4` secara manual. Buka tab dashboard, Anda akan melihat jarum Gauge dan grafik time-series bergerak secara instan mengikuti pergeseran slider Anda!
4. **Uji Saklar**: Ubah saklar relay dari dashboard web, maka lampu indikator LED virtual di simulator akan seketika menyala hijau (*ENERGIZED*).

---

## 7. Langkah 6: Membuat Aturan Otomasi (Visual Rule Engine)

Anda dapat membuat sistem proteksi otomatis dan notifikasi darurat tanpa perlu coding:

```
┌───────────────────────┐          IF TRUE           ┌────────────────────────────┐
│ KONDISI AMBANG BATAS  │ ─────────────────────────▶ │ AKSI OTOMATIS DISPATCHER   │
│ Suhu Boiler V0 > 90°C │                            │ • Matikan Heater Relay V2  │
│                       │                            │ • Kirim Pesan Alert Tele   │
└───────────────────────┘                            └────────────────────────────┘
```

1. Klik menu **"Rule Engine"** di sidebar kiri.
2. Klik tombol **"+ Create Automation Rule"**.
3. Atur kondisi pemicu:
   * **Trigger Pin**: Pilih Pin yang dipantau (contoh: `V0 - Boiler Temp`).
   * **Operator**: Pilih `>` (Lebih besar dari).
   * **Threshold**: Masukkan angka batas (contoh: `90`).
4. Atur aksi yang dieksekusi:
   * **Action Channel**: Pilih *Telegram Bot Alert*, *Email Notification*, atau *Actuate Hardware Relay*.
   * **Alert Message**: Masukkan teks pesan peringatan darurat.
5. Klik **"Save Rule"**.
6. Anda dapat mengklik tombol **"Simulate"** pada kartu aturan untuk menguji pengiriman notifikasi instan.

---

## 8. Langkah 7: Integrasi REST API, MQTT & Pihak Ketiga

Untuk menghubungkan IoT Hub ke aplikasi backend internal, web perusahaan, atau software analitik seperti Grafana dan Home Assistant:

### A. Format Endpoint REST API
* **Base URL**: `https://api.iothub.io/api/v1`
* **Header Autentikasi**: `Authorization: Bearer <API_KEY>`

#### 1. Mengambil Data Sensor Terkini (GET):
```bash
curl -X GET "https://api.iothub.io/api/v1/devices/dev_esp32_boiler_01/telemetry/latest" \
  -H "Authorization: Bearer iothub_live_secret_key"
```

#### 2. Mengirim Perintah Saklar Kontrol (POST):
```bash
curl -X POST "https://api.iothub.io/api/v1/devices/dev_esp32_boiler_01/command" \
  -H "Authorization: Bearer iothub_live_secret_key" \
  -H "Content-Type: application/json" \
  -d '{"pin": "V2", "value": 1}'
```

### B. Standardisasi Topik MQTT
| Arah Komunikasi | Format Topik MQTT | Keterangan |
|---|---|---|
| Device ➡️ Cloud | `iothub/v1/{DEVICE_TOKEN}/telemetry` | Mengirim data sensor (JSON) |
| Cloud ➡️ Device | `iothub/v1/{DEVICE_TOKEN}/command` | Menerima perintah saklar/slider |
| Cloud ➡️ Device | `iothub/v1/{DEVICE_TOKEN}/shadow/desired` | Menerima delta sinkronisasi status |
| Device ➡️ Cloud | `iothub/v1/{DEVICE_TOKEN}/status` | Status Online / Offline (LWT) |

---

## 9. Tanya Jawab & Pemecahan Masalah (FAQ & Troubleshooting)

### ❓ Tanya: Mengapa status perangkat saya tetap "OFFLINE"?
* **Solusi**:
  1. Pastikan `DEVICE_TOKEN` yang Anda masukkan ke dalam sketch firmware sama persis dengan yang tertera di menu **Device Fleet**.
  2. Pastikan port MQTT **`8883`** (TLS) atau **`1883`** tidak diblokir oleh firewall router Wi-Fi Anda.
  3. Periksa Serial Monitor di Arduino IDE untuk memastikan board Anda berhasil mendapatkan IP dari router Wi-Fi.

### ❓ Tanya: Mengapa grafik di dashboard tidak bergerak saat hardware mengirim data?
* **Solusi**:
  1. Periksa apakah nama Pin pada firmware (`v0`, `v1`, dll.) sesuai dengan Pin yang dipilih pada **Property Inspector** widget Anda.
  2. Pastikan format payload JSON yang dikirimkan hardware valid (misal: `{"v0": 28.5}`).

### ❓ Tanya: Bagaimana jika internet di lokasi pabrik/rumah mati sementara?
* **Solusi**:
  * Platform IoT Hub mendukung **Digital Twin Shadow**. Semua perintah kontrol saklar yang Anda kirim saat perangkat offline akan disimpan di antrean cloud. Begitu perangkat menyala kembali, cloud akan otomatis mengirimkan *delta sync* sehingga aktuator hardware seketika menyelaraskan statusnya.

---

🎉 **Selamat! Anda kini telah menguasai penggunaan platform IoT Hub.** Jika Anda membutuhkan bantuan lebih lanjut, Anda dapat membuka menu **"API & MQTT Docs"** atau berkonsultasi dengan tim support kami.

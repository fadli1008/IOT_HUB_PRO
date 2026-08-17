/**
 * ============================================================================
 * IoTHubPro — All Widgets Master Integration Demo
 * Developer : Muhamad Fadli (Lead IoT Architect)
 * Target    : ESP32 / ESP8266
 * Website   : https://iothubpro.vercel.app/
 * ============================================================================
 * 
 * Widget Pin Mapping:
 * - V0  : [GAUGE]              Boiler Temperature (°C)
 * - V1  : [LINE CHART]         Ambient Humidity (%)
 * - V2  : [RELAY SWITCH]       Main Solenoid / LED Relay (0 / 1)
 * - V4  : [NUMERIC DISPLAY]    Boiler Pressure (bar)
 * - V5  : [ANALOG SLIDER]      Pump Motor PWM (0 - 255)
 * - V6  : [LIQUID TANK]        Water Storage Level (Liters / %)
 * - V7  : [RGB COLOR PICKER]   Indicator NeoPixel / RGB LED (#HEX)
 * - V8  : [GPS FLEET MAP]      Asset GPS Tracker (Lat, Lon, Speed)
 * - V10 : [SCADA SCHEMATIC]    Cooling Tower Fan Status
 */

#include <IoTHubPro.h>

// ========== 1. KREDENSIAL & AUTENTIKASI ==========
const char* AUTH_TOKEN = "dev_esp32_boiler_01"; // Ganti dengan Token Perangkat Anda di Web
const char* WIFI_SSID  = "NAMA_WIFI_ANDA";
const char* WIFI_PASS  = "PASSWORD_WIFI_ANDA";

// Definisi Pin Fisik Board ESP32
#define RELAY_PIN  2   // Pin Onboard LED / Relay
#define PWM_PIN    18  // Pin PWM Motor Driver

// Variabel Global
float currentTemp     = 28.5;
float currentHumidity = 65.0;
float currentPressure = 4.8;
float currentTankLtr  = 750.0;
int   currentPWM      = 128;

// ============================================================================
// 2. HANDLER KONTROL DARI DASHBOARD WEB (WEB -> ESP32)
// ============================================================================

// [WIDGET 1] RELAY SWITCH TOGGLE (V2)
// Dijalankan otomatis saat tombol switch di web dashboard diklik
IOTHUB_WRITE(V2) {
  int relayState = param.asInt();
  digitalWrite(RELAY_PIN, relayState ? HIGH : LOW);

  Serial.printf("\n[WEB COMMAND] 🎛️ Relay V2 diubah ke: %s\n", relayState ? "ON (MENYALA)" : "OFF (MATI)");
  IoTHub.log("Relay V2 state changed to " + String(relayState));
}

// [WIDGET 2] ANALOG SLIDER / DIMMER (V5)
// Dijalankan otomatis saat slider PWM digeser (0 - 255)
IOTHUB_WRITE(V5) {
  currentPWM = param.asInt();
  analogWrite(PWM_PIN, currentPWM);

  Serial.printf("\n[WEB COMMAND] 🎚️ Slider PWM V5 diset ke: %d\n", currentPWM);
}

// [WIDGET 3] RGB COLOR PICKER (V7)
// Dijalankan otomatis saat palet warna di web diubah
IOTHUB_WRITE(V7) {
  String hexColor = param.asStr();
  Serial.printf("\n[WEB COMMAND] 🎨 Warna RGB V7 diubah ke: %s\n", hexColor.c_str());
  // Masukkan fungsi kontrol WS2812B NeoPixel di sini
}

// ============================================================================
// 3. SETUP & INISIALISASI
// ============================================================================
void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(PWM_PIN, OUTPUT);

  // Inisialisasi otomatis: menyambungkan Wi-Fi & Broker Cloud MQTT
  IoTHub.begin(AUTH_TOKEN, WIFI_SSID, WIFI_PASS);
}

// ============================================================================
// 4. LOOP UTAMA
// ============================================================================
void loop() {
  // Wajib dipanggil di loop untuk memproses paket data cloud
  IoTHub.run();

  // Kirim data telemetri berkala setiap 2 detik
  static unsigned long lastSend = 0;
  if (millis() - lastSend >= 2000) {
    lastSend = millis();

    // 1. Simulasi / Baca Nilai Sensor Fisik
    currentTemp     = 28.5 + (random(-30, 30) / 10.0);
    currentHumidity = 65.0 + (random(-20, 20) / 10.0);
    currentPressure = 4.8  + (random(-5, 5) / 10.0);
    currentTankLtr  = 720.0 + (random(-50, 50));

    // 2. Kirim Data ke Masing-Masing Widget di Web:
    // -------------------------------------------------------------
    // Kirim ke [Radial Gauge]
    IoTHub.virtualWrite(V0, currentTemp);

    // Kirim ke [Time-Series Line Chart]
    IoTHub.virtualWrite(V1, currentHumidity);

    // Kirim ke [Display Angka / Gauge Tekanan]
    IoTHub.virtualWrite(V4, currentPressure);

    // Kirim ke [Liquid Tank Silo] (Level Cairan)
    IoTHub.virtualWrite(V6, currentTankLtr);

    // Kirim ke [SCADA Plant Status] (1 = Normal Run, 0 = Stop)
    IoTHub.virtualWrite(V10, 1);

    // Kirim ke [GPS Fleet Map Tracker] (Lat, Lon, Kecepatan km/h)
    IoTHub.locationWrite(V8, -6.2088, 106.8456, 45.5);

    Serial.printf("[TELEMETRI] Temp: %.1f°C | Hum: %.1f%% | Press: %.1f bar | Tank: %.0f L\n",
                  currentTemp, currentHumidity, currentPressure, currentTankLtr);
  }
}

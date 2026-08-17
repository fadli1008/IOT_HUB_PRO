/**
 * ============================================================================
 * IoTHubPro Arduino Library
 * Developer : Muhamad Fadli (Lead IoT Architect)
 * Version   : 1.0.0
 * Website   : https://iothubpro.vercel.app/
 * GitHub    : https://github.com/fadli1008/IOT_HUB_PRO
 * ============================================================================
 * An expressive, high-performance IoT library for ESP32 and ESP8266
 * benchmarked against Blynk and ThingsBoard.
 */

#ifndef IOTHUB_PRO_H
#define IOTHUB_PRO_H

#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
  #include <HTTPClient.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
  #include <ESP8266HTTPClient.h>
#else
  #error "IoTHubPro currently supports ESP32 and ESP8266 microcontrollers."
#endif

#include <PubSubClient.h>
#include <ArduinoJson.h>

// Virtual Pin Definitions
enum VirtualPin {
  V0 = 0, V1, V2, V3, V4, V5, V6, V7, V8, V9,
  V10, V11, V12, V13, V14, V15, V16, V17, V18, V19,
  V20, V21, V22, V23, V24, V25, V26, V27, V28, V29,
  V30, V31, V32, V33, V34, V35, V36, V37, V38, V39,
  V40, V41, V42, V43, V44, V45, V46, V47, V48, V49,
  V50, V100 = 100, V255 = 255
};

// Parameter Wrapper Class
class IoTHubParam {
private:
  String _val;
public:
  IoTHubParam(const String& val = "") : _val(val) {}
  int asInt() const { return _val.toInt(); }
  float asFloat() const { return _val.toFloat(); }
  double asDouble() const { return _val.toDouble(); }
  String asStr() const { return _val; }
  const char* c_str() const { return _val.c_str(); }
};

// Callback Signature
typedef void (*IoTHubWriteHandler)(const IoTHubParam& param);

// Callback registry for Virtual Pins (0 - 50)
extern IoTHubWriteHandler _iothub_handlers[51];

#define IOTHUB_WRITE(pin) \
  void _iothub_write_handler_##pin(const IoTHubParam& param); \
  struct _IoTHubReg_##pin { \
    _IoTHubReg_##pin() { \
      _iothub_handlers[pin] = _iothub_write_handler_##pin; \
    } \
  } _iothub_reg_instance_##pin; \
  void _iothub_write_handler_##pin(const IoTHubParam& param)

class IoTHubClient {
private:
  const char* _token;
  const char* _ssid;
  const char* _pass;
  const char* _broker;
  int _port;
  WiFiClient _wifiClient;
  PubSubClient _mqttClient;
  unsigned long _lastReconnectAttempt;

  static void mqttCallback(char* topic, byte* payload, unsigned int length);

public:
  IoTHubClient() 
    : _token(nullptr), _ssid(nullptr), _pass(nullptr), 
      _broker("broker.emqx.io"), _port(1883),
      _mqttClient(_wifiClient), _lastReconnectAttempt(0) {}

  void begin(const char* token, const char* ssid, const char* pass, const char* broker = "broker.emqx.io", int port = 1883) {
    _token = token;
    _ssid = ssid;
    _pass = pass;
    _broker = broker;
    _port = port;

    Serial.println();
    Serial.println(F("================================================"));
    Serial.println(F("   🌐 IoT Hub Pro — Arduino Client v1.0.0       "));
    Serial.println(F("   Developed by: Muhamad Fadli                 "));
    Serial.println(F("================================================"));

    connectWiFi();

    _mqttClient.setServer(_broker, _port);
    _mqttClient.setCallback(IoTHubClient::mqttCallback);
    _mqttClient.setBufferSize(512);

    connectMQTT();
  }

  void connectWiFi() {
    Serial.printf("[IoT Hub] Menghubungkan ke Wi-Fi: %s ", _ssid);
    WiFi.begin(_ssid, _pass);
    while (WiFi.status() != WL_CONNECTED) {
      delay(400);
      Serial.print(F("."));
    }
    Serial.println();
    Serial.printf("[IoT Hub] Wi-Fi Terhubung! IP: %s\n", WiFi.localIP().toString().c_str());
  }

  bool connectMQTT() {
    if (_mqttClient.connected()) return true;

    Serial.printf("[IoT Hub] Menghubungkan ke Cloud Broker (%s:%d)...", _broker, _port);
    String clientId = "IoTHub_" + String(_token) + "_" + String(random(0xffff), HEX);
    String subTopic = "iothub/v1/" + String(_token) + "/command";
    String lwtTopic = "iothub/v1/" + String(_token) + "/status";

    if (_mqttClient.connect(clientId.c_str(), _token, "", lwtTopic.c_str(), 1, true, "{\"state\":\"offline\"}")) {
      Serial.println(F(" [ONLINE!]"));
      _mqttClient.publish(lwtTopic.c_str(), "{\"state\":\"online\"}", true);
      _mqttClient.subscribe(subTopic.c_str(), 1);
      return true;
    } else {
      Serial.printf(" Gagal (rc=%d)\n", _mqttClient.state());
      return false;
    }
  }

  void run() {
    if (WiFi.status() != WL_CONNECTED) {
      WiFi.reconnect();
      delay(500);
      return;
    }

    if (!_mqttClient.connected()) {
      unsigned long now = millis();
      if (now - _lastReconnectAttempt > 4000) {
        _lastReconnectAttempt = now;
        connectMQTT();
      }
    } else {
      _mqttClient.loop();
    }
  }

  // Virtual Write Single Numeric
  void virtualWrite(VirtualPin pin, float value) {
    if (!_mqttClient.connected()) return;

    StaticJsonDocument<128> doc;
    String pinKey = "v" + String((int)pin);
    doc[pinKey] = value;
    doc["rssi"] = WiFi.RSSI();

    char buffer[128];
    size_t len = serializeJson(doc, buffer);
    String pubTopic = "iothub/v1/" + String(_token) + "/telemetry";
    _mqttClient.publish(pubTopic.c_str(), buffer, len);
  }

  // Virtual Write String / Hex Color / Text
  void virtualWrite(VirtualPin pin, const String& value) {
    if (!_mqttClient.connected()) return;

    StaticJsonDocument<128> doc;
    String pinKey = "v" + String((int)pin);
    doc[pinKey] = value;

    char buffer[128];
    size_t len = serializeJson(doc, buffer);
    String pubTopic = "iothub/v1/" + String(_token) + "/telemetry";
    _mqttClient.publish(pubTopic.c_str(), buffer, len);
  }

  // Virtual Write GPS Location for Map Widget
  void locationWrite(VirtualPin pin, double latitude, double longitude, float speed = 0.0) {
    if (!_mqttClient.connected()) return;

    StaticJsonDocument<256> doc;
    String pinKey = "v" + String((int)pin);
    
    JsonObject loc = doc.createNestedObject(pinKey);
    loc["lat"] = latitude;
    loc["lon"] = longitude;
    loc["speed"] = speed;

    char buffer[256];
    size_t len = serializeJson(doc, buffer);
    String pubTopic = "iothub/v1/" + String(_token) + "/telemetry";
    _mqttClient.publish(pubTopic.c_str(), buffer, len);
  }

  // Send Terminal Log Message
  void log(const String& message) {
    if (!_mqttClient.connected()) return;
    StaticJsonDocument<256> doc;
    doc["log"] = message;
    char buffer[256];
    size_t len = serializeJson(doc, buffer);
    String pubTopic = "iothub/v1/" + String(_token) + "/telemetry";
    _mqttClient.publish(pubTopic.c_str(), buffer, len);
  }

  // Dispatch incoming command to registered IOTHUB_WRITE handlers
  static void dispatchCommand(const char* pinStr, const String& valStr) {
    int pinNum = -1;
    if (pinStr[0] == 'v' || pinStr[0] == 'V') {
      pinNum = atoi(&pinStr[1]);
    }
    if (pinNum >= 0 && pinNum <= 50 && _iothub_handlers[pinNum] != nullptr) {
      IoTHubParam param(valStr);
      _iothub_handlers[pinNum](param);
    }
  }
};

// Global Instance
extern IoTHubClient IoTHub;

#endif // IOTHUB_PRO_H

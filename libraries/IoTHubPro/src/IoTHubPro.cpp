#include "IoTHubPro.h"

// Initialize array of callback pointers
IoTHubWriteHandler _iothub_handlers[51] = { nullptr };

// Single Global IoTHub Instance
IoTHubClient IoTHub;

void IoTHubClient::mqttCallback(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, payload, length);

  if (error) {
    Serial.printf("[IoT Hub] JSON parsing failed: %s\n", error.c_str());
    return;
  }

  JsonObject obj = doc.as<JsonObject>();
  for (JsonPair p : obj) {
    const char* key = p.key().c_str();
    String valStr = p.value().as<String>();
    IoTHubClient::dispatchCommand(key, valStr);
  }
}

"""
===============================================================================
IoT Hub — Local Backend Gateway & WebSocket Server
Author      : Fadli
Description : Menjembatani ESP32 fisik di jaringan lokal (LAN) ke Web Dashboard
              secara real-time melalui REST API & WebSockets.
===============================================================================
"""

import json
import asyncio
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading

PORT = 8000
HOST = "0.0.0.0"

# In-memory store for live telemetry and commands
latest_telemetry = {}
active_clients = set()

print(f"""
╔═══════════════════════════════════════════════════════════════╗
║                   IoT Hub Local Gateway Server                ║
║                 Dikembangkan oleh: Fadli                      ║
╠═══════════════════════════════════════════════════════════════╣
║  • REST API Ingestion : http://localhost:{PORT}/api/v1/telemetry ║
║  • Status Dashboard   : http://localhost:5173/                ║
╚═══════════════════════════════════════════════════════════════╝
""")

class IoTLocalHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        self._set_cors_headers()
        if self.path.startswith('/api/v1/telemetry'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "success",
                "data": latest_telemetry
            }).encode('utf-8'))
        elif self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(b"<h1>IoT Hub Local Gateway is Running!</h1><p>Send POST to /api/v1/telemetry</p>")
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        self._set_cors_headers()
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            payload = json.loads(post_data.decode('utf-8'))
            device_token = self.headers.get('Authorization', '').replace('Bearer ', '') or payload.get('token', 'local_device')

            # Update live telemetry store
            latest_telemetry[device_token] = payload
            print(f"[ESP32 INGEST] Token: {device_token[:12]}... | Payload: {payload}")

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "ok",
                "received": payload
            }).encode('utf-8'))

        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

def run_server():
    server = HTTPServer((HOST, PORT), IoTLocalHandler)
    print(f"[*] Server aktif di port {PORT}. ESP32 dapat mengirim data ke http://<IP_LAPTOP_ANDA>:{PORT}/api/v1/telemetry")
    server.serve_forever()

if __name__ == '__main__':
    run_server()

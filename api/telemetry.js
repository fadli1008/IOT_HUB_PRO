// Vercel Serverless Function: HTTP Telemetry Ingestion Endpoint
// Author: Muhamad Fadli

let memoryStore = {};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET: Fetch latest telemetry
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: memoryStore
    });
  }

  // POST: Receive sensor data from ESP32
  if (req.method === 'POST') {
    try {
      const payload = req.body || {};
      const token = req.headers['authorization']?.replace('Bearer ', '') || payload.token || 'default_device';

      memoryStore[token] = {
        ...payload,
        receivedAt: new Date().toISOString()
      };

      return res.status(200).json({
        status: 'success',
        message: 'Telemetry received successfully',
        token,
        data: payload
      });
    } catch (err) {
      return res.status(400).json({ status: 'error', message: err.message });
    }
  }

  return res.status(405).json({ status: 'error', message: 'Method not allowed' });
}

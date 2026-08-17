import React, { useState } from 'react';
import { useDevices } from '../../context/DeviceContext';
import {
  Terminal,
  Send,
  Code2,
  Copy,
  Check,
  Globe,
  Radio,
  BookOpen,
  Database,
  CheckCircle2
} from 'lucide-react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: 'Telemetry' | 'Devices' | 'Shadow' | 'Rules';
  description: string;
  sampleBody?: string;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/devices',
    category: 'Devices',
    description: 'Retrieve paginated list of all devices in the current organization'
  },
  {
    method: 'GET',
    path: '/api/v1/devices/{device_id}/telemetry/latest',
    category: 'Telemetry',
    description: 'Fetch the latest reported telemetry metrics and timestamp'
  },
  {
    method: 'POST',
    path: '/api/v1/devices/{device_id}/telemetry',
    category: 'Telemetry',
    description: 'HTTP Ingestion endpoint for sensors without MQTT client',
    sampleBody: '{\n  "v0": 28.5,\n  "v1": 64.2,\n  "temperature": 28.5\n}'
  },
  {
    method: 'POST',
    path: '/api/v1/devices/{device_id}/command',
    category: 'Telemetry',
    description: 'Send actuation command to device virtual pin',
    sampleBody: '{\n  "pin": "V2",\n  "value": 1\n}'
  },
  {
    method: 'GET',
    path: '/api/v1/devices/{device_id}/shadow',
    category: 'Shadow',
    description: 'Retrieve Desired vs Reported state shadow'
  }
];

export const ApiPlayground: React.FC = () => {
  const { devices } = useDevices();
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(ENDPOINTS[1]);
  const [targetDeviceId, setTargetDeviceId] = useState<string>(devices[0]?.id || 'dev_esp32_boiler_01');
  const [requestBody, setRequestBody] = useState(selectedEndpoint.sampleBody || '');
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.sampleBody || '');
    setResponseOutput(null);
  };

  const handleExecute = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (selectedEndpoint.path.includes('latest')) {
        setResponseOutput(JSON.stringify({
          status: 'success',
          device_id: targetDeviceId,
          timestamp: new Date().toISOString(),
          telemetry: {
            V0: 78.5,
            V1: 42.0,
            V2: 1,
            V4: 4.8,
            V5: 65
          }
        }, null, 2));
      } else if (selectedEndpoint.path.includes('shadow')) {
        setResponseOutput(JSON.stringify({
          status: 'success',
          version: 42,
          desired: { V2: 1, V3: 1, V5: 65 },
          reported: { V2: 1, V3: 1, V5: 65, V0: 78.5 },
          last_synced: new Date().toISOString()
        }, null, 2));
      } else {
        setResponseOutput(JSON.stringify({
          status: 'success',
          message: 'Operation executed successfully',
          request_id: 'req_' + Math.random().toString(36).substring(2, 9)
        }, null, 2));
      }
    }, 400);
  };

  const currentPath = selectedEndpoint.path.replace('{device_id}', targetDeviceId);
  const curlCommand = `curl -X ${selectedEndpoint.method} "https://api.iothub.io${currentPath}" \\
  -H "Authorization: Bearer iothub_live_secret_key" \\
  -H "Content-Type: application/json"${requestBody ? ` \\\n  -d '${requestBody.replace(/\n/g, '')}'` : ''}`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0B0F19] p-6 space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold font-heading text-white">API Documentation & Live Playground</h1>
          <span className="text-[10px] uppercase font-mono font-bold bg-cyan-500/20 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            OpenAPI 3.1
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Test REST API endpoints, inspect MQTT topics, and test real-time WebSocket subscriptions directly in your browser
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        {/* Left Endpoint Selector */}
        <div className="lg:col-span-4 glass-panel p-4 rounded-3xl border border-gray-800 space-y-3">
          <div className="text-xs font-mono font-bold text-gray-400 uppercase">Available Endpoints</div>
          <div className="space-y-1.5">
            {ENDPOINTS.map(ep => {
              const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
              return (
                <div
                  key={ep.method + ep.path}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`p-3 rounded-2xl cursor-pointer transition border ${
                    isSelected
                      ? 'bg-brand-500/10 border-brand-500 text-white'
                      : 'bg-gray-950/60 border-gray-800/80 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded ${
                      ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' :
                      ep.method === 'POST' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="text-xs font-mono font-bold truncate">{ep.path}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{ep.description}</p>
                </div>
              );
            })}
          </div>

          {/* MQTT Reference Box */}
          <div className="mt-6 p-3 bg-gray-950 rounded-2xl border border-gray-800 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-brand-400 font-bold">
              <Radio className="w-3.5 h-3.5" />
              <span>MQTT Topic Reference</span>
            </div>
            <div className="text-[10px] font-mono text-gray-400 space-y-1">
              <div>Telemetry: <code className="text-cyan-300">iothub/v1/&#123;token&#125;/telemetry</code></div>
              <div>Commands: <code className="text-amber-300">iothub/v1/&#123;token&#125;/command</code></div>
              <div>Shadow: <code className="text-purple-300">iothub/v1/&#123;token&#125;/shadow/desired</code></div>
            </div>
          </div>
        </div>

        {/* Right API Tester & cURL */}
        <div className="lg:col-span-8 space-y-4">
          {/* Target Device Selector & URL Bar */}
          <div className="glass-panel p-4 rounded-3xl border border-gray-800 space-y-3">
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-mono font-extrabold px-2 py-1 rounded-lg ${
                selectedEndpoint.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' :
                selectedEndpoint.method === 'POST' ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {selectedEndpoint.method}
              </span>
              <div className="flex-1 bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-800 font-mono text-xs text-white truncate">
                https://api.iothub.io{currentPath}
              </div>
              <button
                onClick={handleExecute}
                disabled={isLoading}
                className="px-5 py-1.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-md glow-cyan transition flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Sending...' : 'Execute'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="text-gray-400 font-mono">Target Device:</span>
              <select
                value={targetDeviceId}
                onChange={e => setTargetDeviceId(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white rounded-lg px-2 py-1 font-mono text-xs"
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Request Body Editor if POST/PUT */}
          {selectedEndpoint.method === 'POST' && (
            <div className="glass-panel p-4 rounded-3xl border border-gray-800 space-y-2">
              <span className="text-xs font-mono font-bold text-gray-400">Request JSON Body:</span>
              <textarea
                rows={4}
                value={requestBody}
                onChange={e => setRequestBody(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 font-mono text-xs text-cyan-300 focus:border-brand-500 focus:outline-none"
              />
            </div>
          )}

          {/* Response Inspector */}
          {responseOutput && (
            <div className="glass-panel p-4 rounded-3xl border border-gray-800 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Response 200 OK</span>
                </span>
                <span className="text-[10px] font-mono text-gray-500">Latency: 28ms</span>
              </div>
              <pre className="w-full bg-gray-950 p-4 rounded-2xl border border-gray-800 font-mono text-xs text-gray-200 overflow-x-auto">
                {responseOutput}
              </pre>
            </div>
          )}

          {/* Generated cURL Box */}
          <div className="glass-panel p-4 rounded-3xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gray-400">cURL Command Generator:</span>
              <button
                onClick={handleCopyCurl}
                className="flex items-center space-x-1 text-xs font-mono text-brand-400 hover:text-brand-300 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="w-full bg-gray-950 p-3 rounded-2xl border border-gray-800 font-mono text-[11px] text-gray-400 overflow-x-auto">
              {curlCommand}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

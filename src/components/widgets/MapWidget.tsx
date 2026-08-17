import React, { useState } from 'react';
import { WidgetConfig } from '../../types/dashboard';
import { useDevices } from '../../context/DeviceContext';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  MapPin,
  Navigation,
  Signal,
  Compass,
  Layers,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Radio,
  Truck,
  Building,
  Cpu,
  CheckCircle2
} from 'lucide-react';

interface MapWidgetProps {
  config: WidgetConfig;
}

export const MapWidget: React.FC<MapWidgetProps> = ({ config }) => {
  const { devices } = useDevices();
  const { telemetry } = useTelemetry();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(config.deviceId || devices[0]?.id || '');
  const [mapMode, setMapMode] = useState<'vector_cyber' | 'osm_satellite'>('vector_cyber');
  const [zoomLevel, setZoomLevel] = useState<number>(14);

  // Fleet locations list with fallback coords
  const fleetList = devices.map((d, index) => {
    const defaultCoords = [
      { lat: -6.2088, lng: 106.8456, city: 'Jakarta Central Site A', speed: 42 },
      { lat: -6.9175, lng: 107.6191, city: 'Bandung Industrial Gateway', speed: 0 },
      { lat: -6.5971, lng: 106.8060, city: 'Bogor Agricultural Sector', speed: 15 }
    ];
    const fallback = defaultCoords[index % defaultCoords.length];
    return {
      device: d,
      lat: d.location?.lat ?? fallback.lat,
      lng: d.location?.lng ?? fallback.lng,
      address: d.location?.address || fallback.city,
      speed: fallback.speed
    };
  });

  const activeFleet = fleetList.find(f => f.device.id === selectedDeviceId) || fleetList[0];
  const targetDevice = activeFleet.device;
  const currentTemp = telemetry[targetDevice.id]?.['V0'] ?? 28.5;
  const currentPressure = telemetry[targetDevice.id]?.['V4'] ?? 4.8;

  // OpenStreetMap embed URL
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${activeFleet.lng - 0.04}%2C${activeFleet.lat - 0.04}%2C${activeFleet.lng + 0.04}%2C${activeFleet.lat + 0.04}&layer=mapnik&marker=${activeFleet.lat}%2C${activeFleet.lng}`;

  return (
    <div className="flex flex-col w-full h-full min-h-[440px] p-3 relative rounded-2xl overflow-hidden bg-[#0A0E17]">
      {/* Map Header Toolbar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-gray-800/80 mb-2.5 text-xs">
        {/* Device Fleet Selector */}
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-brand-400" />
          <span className="text-gray-400 font-mono hidden sm:inline">Fleet Asset:</span>
          <select
            value={selectedDeviceId}
            onChange={e => setSelectedDeviceId(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-cyan-300 font-mono text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-brand-500"
          >
            {fleetList.map(f => (
              <option key={f.device.id} value={f.device.id}>
                {f.device.name} ({f.address})
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle & Zoom */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-0.5">
            <button
              onClick={() => setMapMode('vector_cyber')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                mapMode === 'vector_cyber' ? 'bg-brand-500 text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Cyber Radar
            </button>
            <button
              onClick={() => setMapMode('osm_satellite')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                mapMode === 'osm_satellite' ? 'bg-brand-500 text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              OpenStreetMap Live
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-1 bg-gray-900 border border-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
              className="p-1 text-gray-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 1, 8))}
              className="p-1 text-gray-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Body Container */}
      <div className="relative flex-1 w-full min-h-[360px] rounded-2xl overflow-hidden border border-gray-800/80 bg-[#070A12] flex items-center justify-center">
        {mapMode === 'osm_satellite' ? (
          /* Live OpenStreetMap Iframe */
          <div className="w-full h-full relative">
            <iframe
              title="OpenStreetMap Live Viewer"
              width="100%"
              height="100%"
              className="w-full h-full border-0 filter invert contrast-[0.9] hue-rotate-[180deg]"
              src={osmEmbedUrl}
            />
            {/* Overlay coordinate badge */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-800 text-[10px] font-mono text-gray-300">
              <span className="text-brand-400 font-bold">OSM Lat/Lng:</span> {activeFleet.lat.toFixed(5)}, {activeFleet.lng.toFixed(5)}
            </div>
          </div>
        ) : (
          /* High-Tech Cyber Radar Vector Map */
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
            {/* Grid & Radar Circles */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-500/10 animate-pulse pointer-events-none" />
            <div className="absolute w-[320px] h-[320px] rounded-full border border-cyan-500/15 pointer-events-none" />
            <div className="absolute w-[160px] h-[160px] rounded-full border border-cyan-500/20 pointer-events-none" />

            {/* Radar Scan Needle Animation */}
            <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none origin-center animate-spin" style={{ animationDuration: '8s' }}>
              <div className="w-1/2 h-1/2 bg-gradient-to-tr from-cyan-500/15 to-transparent rounded-tl-full" />
            </div>

            {/* Simulated Road Arteries */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 600 350">
              <path d="M 0,100 Q 250,180 600,120" fill="none" stroke="#1e293b" strokeWidth="6" />
              <path d="M 180,0 L 350,350" fill="none" stroke="#1e293b" strokeWidth="5" />
              <path d="M 50,300 Q 300,150 550,280" fill="none" stroke="#0f172a" strokeWidth="4" />
              
              {/* Active Route Polyline Path */}
              <path
                d="M 120,240 L 220,190 L 300,175 L 390,140"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            </svg>

            {/* Fleet Markers */}
            {fleetList.map((item, idx) => {
              const isSelected = item.device.id === selectedDeviceId;
              // Spread positions across canvas
              const positions = [
                { top: '48%', left: '50%' }, // Center
                { top: '28%', left: '28%' }, // Top-Left
                { top: '65%', left: '72%' }  // Bottom-Right
              ];
              const pos = positions[idx % positions.length];

              return (
                <div
                  key={item.device.id}
                  onClick={() => setSelectedDeviceId(item.device.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-transform ${
                    isSelected ? 'scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {/* Beacon Rings */}
                  <div className="relative flex flex-col items-center">
                    <div className={`p-2.5 rounded-full shadow-2xl transition ${
                      isSelected
                        ? 'bg-brand-500 text-black ring-4 ring-brand-500/30 glow-cyan animate-bounce'
                        : 'bg-gray-800 text-cyan-400 border border-gray-700'
                    }`}>
                      <Navigation className="w-4 h-4 fill-current transform rotate-45" />
                    </div>

                    {/* Popover Badge */}
                    <div className={`mt-2 px-3 py-1.5 rounded-xl border backdrop-blur-md text-center shadow-2xl transition whitespace-nowrap ${
                      isSelected
                        ? 'bg-gray-950/95 border-brand-500/60 ring-1 ring-brand-500/30'
                        : 'bg-gray-900/80 border-gray-800'
                    }`}>
                      <div className="text-xs font-bold font-heading text-white">{item.device.name}</div>
                      <div className="text-[10px] font-mono text-brand-400 mt-0.5">
                        {item.speed > 0 ? `🚀 ${item.speed} km/h` : '⏹ Stationary'} • {item.address}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Telemetry HUD (Heads-up Display Overlay) */}
        <div className="absolute top-3 left-3 z-30 bg-gray-950/85 backdrop-blur-md p-3 rounded-2xl border border-gray-800 shadow-2xl space-y-1.5 text-[11px] font-mono">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>GPS RTK FIXED (14 SATS)</span>
          </div>
          <div className="text-gray-300">
            <span className="text-gray-500">LAT:</span> {activeFleet.lat.toFixed(5)}° N
          </div>
          <div className="text-gray-300">
            <span className="text-gray-500">LNG:</span> {activeFleet.lng.toFixed(5)}° E
          </div>
          <div className="text-cyan-400 font-bold pt-0.5 border-t border-gray-800">
            SPEED: {activeFleet.speed} km/h • ALT: 48m
          </div>
        </div>

        {/* Geofence & Sensor Telemetry Overlay */}
        <div className="absolute top-3 right-3 z-30 hidden sm:flex flex-col bg-gray-950/85 backdrop-blur-md p-3 rounded-2xl border border-gray-800 shadow-2xl space-y-1 text-[11px] font-mono">
          <div className="flex items-center space-x-1.5 text-brand-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>GEOFENCE: INSIDE ZONE A</span>
          </div>
          <div className="text-gray-300">
            <span className="text-gray-500">TEMP (V0):</span> <span className="text-white font-bold">{currentTemp}°C</span>
          </div>
          <div className="text-gray-300">
            <span className="text-gray-500">PRESSURE (V4):</span> <span className="text-white font-bold">{currentPressure} bar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

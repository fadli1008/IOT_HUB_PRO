import React, { useState } from 'react';
import { useDevices } from '../../context/DeviceContext';
import { Device, HardwarePlatform } from '../../types/device';
import { AddDeviceModal } from './AddDeviceModal';
import { DeviceShadowModal } from './DeviceShadowModal';
import { formatTimeAgo } from '../../utils/formatters';
import {
  Cpu,
  Plus,
  Search,
  Key,
  Copy,
  Check,
  Layers,
  Trash2,
  Wifi,
  ExternalLink,
  Sliders,
  Sparkles,
  Signal
} from 'lucide-react';

export const DeviceList: React.FC = () => {
  const { devices, deleteDevice } = useDevices();
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [shadowModalDevice, setShadowModalDevice] = useState<Device | null>(null);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const filtered = devices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.token.toLowerCase().includes(search.toLowerCase()) || d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesPlatform = selectedPlatform === 'all' || d.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const copyToken = (device: Device) => {
    navigator.clipboard.writeText(device.token);
    setCopiedTokenId(device.id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0B0F19] p-6">
      {/* Top Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Device Fleet Manager</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage credentials, virtual pins, and digital twin shadows</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Device</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search devices, tokens, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none"
          />
        </div>

        {/* Platform Filter Buttons */}
        <div className="flex space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'esp32', 'raspberry_pi', 'stm32'].map(p => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition ${
                selectedPlatform === p
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 font-bold'
                  : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {p === 'all' ? 'All Platforms' : p.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        {filtered.map(device => {
          const isOnline = device.status === 'online';
          const isCopied = copiedTokenId === device.id;

          return (
            <div
              key={device.id}
              className="glass-panel p-5 rounded-3xl border border-gray-800 hover:border-gray-700 transition flex flex-col justify-between space-y-4 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-gray-800/80 text-brand-400 border border-gray-700/50 group-hover:scale-105 transition-transform">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-heading text-white tracking-wide">{device.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center space-x-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                        <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {device.platform.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Signal RSSI */}
                {device.rssi && (
                  <div className="flex items-center space-x-1 text-[10px] text-gray-400 font-mono bg-gray-900 px-2 py-1 rounded-lg border border-gray-800">
                    <Signal className="w-3 h-3 text-brand-400" />
                    <span>{device.rssi} dBm</span>
                  </div>
                )}
              </div>

              {/* Token & Pin Overview */}
              <div className="space-y-2 bg-gray-950/60 p-3 rounded-2xl border border-gray-800/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-gray-500 font-mono">Device Auth Token</span>
                  <button
                    onClick={() => copyToken(device)}
                    className="flex items-center space-x-1 text-[10px] text-brand-400 hover:text-brand-300 font-mono transition"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Token'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-gray-300 truncate bg-gray-900 px-2.5 py-1 rounded-lg border border-gray-800">
                  {device.token}
                </div>

                {/* Datastreams preview */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-gray-400">Configured Datastreams:</span>
                  <span className="font-mono font-bold text-cyan-400">{device.datastreams.length} Channels</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {device.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono bg-gray-800/60 text-gray-400 px-2 py-0.5 rounded-md border border-gray-800">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-800/80">
                <button
                  onClick={() => setShadowModalDevice(device)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-medium transition"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Digital Twin Shadow</span>
                </button>

                <button
                  onClick={() => deleteDevice(device.id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                  title="Delete Device"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Shadow Modal */}
      {shadowModalDevice && (
        <DeviceShadowModal
          device={shadowModalDevice}
          onClose={() => setShadowModalDevice(null)}
        />
      )}
    </div>
  );
};

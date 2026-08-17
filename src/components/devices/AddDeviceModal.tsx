import React, { useState } from 'react';
import { useDevices } from '../../context/DeviceContext';
import { HardwarePlatform } from '../../types/device';
import { X, Cpu, Plus, Sparkles, Check } from 'lucide-react';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceCreated?: (deviceId: string) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, onDeviceCreated }) => {
  const { addDevice, templates } = useDevices();
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<HardwarePlatform>('esp32');
  const [templateId, setTemplateId] = useState<string>(templates[0]?.id || '');
  const [tags, setTags] = useState('Factory Floor, Smart Sensor');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    const newDev = addDevice({
      name: name.trim(),
      platform,
      templateId: templateId || undefined,
      tags: parsedTags
    });

    onClose();
    if (onDeviceCreated) onDeviceCreated(newDev.id);
  };

  const PLATFORMS: Array<{ id: HardwarePlatform; name: string; desc: string }> = [
    { id: 'esp32', name: 'ESP32 / ESP8266', desc: 'Wi-Fi & BLE 32-bit SoC' },
    { id: 'raspberry_pi', name: 'Raspberry Pi / Linux SBC', desc: 'Edge Linux Gateway with Python' },
    { id: 'stm32', name: 'STM32 / ARM Cortex', desc: 'Industrial MCU with Ethernet/HAL' },
    { id: 'arduino', name: 'Arduino / ATmega', desc: 'Standard microcontroller boards' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Register New Device</h3>
              <p className="text-xs text-gray-400">Generate secure credentials and datastream blueprint</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5 font-medium">Device Name</label>
            <input
              type="text"
              required
              placeholder="e.g. ESP32 Cold Storage Sensor 01"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none transition"
            />
          </div>

          {/* Hardware Platform Grid */}
          <div>
            <label className="text-xs text-gray-400 block mb-1.5 font-medium">Hardware Architecture</label>
            <div className="grid grid-cols-2 gap-2.5">
              {PLATFORMS.map(p => (
                <div
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    platform === p.id
                      ? 'border-brand-500 bg-brand-500/10 text-white'
                      : 'border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <div className="text-xs font-bold font-heading">{p.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="text-xs text-gray-400 block mb-1.5 font-medium">Device Blueprint Template</label>
            <select
              value={templateId}
              onChange={e => setTemplateId(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition font-mono"
            >
              <option value="">-- Custom Blank Template --</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.datastreams.length} datastreams)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5 font-medium">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Factory, High-Temp, Jakarta"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none transition"
            />
          </div>

          <div className="pt-3 border-t border-gray-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-white rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Device</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

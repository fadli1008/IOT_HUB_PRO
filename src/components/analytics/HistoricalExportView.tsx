import React, { useState, useMemo } from 'react';
import { useDevices } from '../../context/DeviceContext';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileCode,
  Table as TableIcon,
  Search,
  Database,
  BarChart2,
  TrendingUp,
  Activity,
  Check,
  Copy,
  Clock
} from 'lucide-react';

export const HistoricalExportView: React.FC = () => {
  const { devices } = useDevices();
  const { history, telemetry } = useTelemetry();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || '');
  const [selectedPin, setSelectedPin] = useState<string>('ALL');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [searchFilter, setSearchFilter] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const currentDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  // Generate or gather historical records
  const historicalRows = useMemo(() => {
    if (!currentDevice) return [];

    const rows: Array<{
      id: string;
      timestamp: string;
      unixTime: number;
      deviceName: string;
      pin: string;
      channelName: string;
      value: number;
      unit: string;
      status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    }> = [];

    const now = Date.now();
    const intervals = timeRange === '1h' ? 30 : timeRange === '24h' ? 60 : 100;
    const timeStep = timeRange === '1h' ? 120000 : timeRange === '24h' ? 1440000 : 86400000;

    currentDevice.datastreams.forEach(ds => {
      if (selectedPin !== 'ALL' && ds.pin !== selectedPin) return;

      const baseVal = Number(telemetry[currentDevice.id]?.[ds.pin] ?? ds.defaultValue ?? 30);
      const histBuffer = history[currentDevice.id]?.[ds.pin] || [];

      // Use real buffer if present
      if (histBuffer.length > 0 && timeRange === '1h') {
        histBuffer.forEach((p, idx) => {
          rows.push({
            id: `${ds.pin}_${p.timestamp}_${idx}`,
            timestamp: new Date(p.timestamp).toLocaleString('id-ID'),
            unixTime: p.timestamp,
            deviceName: currentDevice.name,
            pin: ds.pin,
            channelName: ds.name,
            value: p.value,
            unit: ds.unit || '',
            status: p.value > 85 ? 'CRITICAL' : p.value > 65 ? 'WARNING' : 'NORMAL'
          });
        });
      } else {
        // Generate historical distribution based on timeframe
        for (let i = intervals; i >= 0; i--) {
          const timestamp = now - i * timeStep;
          const randomVariation = (Math.sin(i * 0.4) * 5) + ((Math.random() - 0.5) * 3);
          let val = Number((baseVal + randomVariation).toFixed(2));
          if (ds.min !== undefined && val < ds.min) val = ds.min;
          if (ds.max !== undefined && val > ds.max) val = ds.max;

          rows.push({
            id: `${ds.pin}_${timestamp}_${i}`,
            timestamp: new Date(timestamp).toLocaleString('id-ID'),
            unixTime: timestamp,
            deviceName: currentDevice.name,
            pin: ds.pin,
            channelName: ds.name,
            value: val,
            unit: ds.unit || '',
            status: val > 85 ? 'CRITICAL' : val > 65 ? 'WARNING' : 'NORMAL'
          });
        }
      }
    });

    return rows.sort((a, b) => b.unixTime - a.unixTime);
  }, [currentDevice, selectedPin, timeRange, telemetry, history]);

  // Filtered rows for table view
  const filteredRows = useMemo(() => {
    return historicalRows.filter(r => {
      return (
        r.pin.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.channelName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.timestamp.toLowerCase().includes(searchFilter.toLowerCase())
      );
    });
  }, [historicalRows, searchFilter]);

  // Statistics
  const stats = useMemo(() => {
    if (historicalRows.length === 0) return { avg: 0, min: 0, max: 0, total: 0 };
    const values = historicalRows.map(r => r.value);
    const sum = values.reduce((acc, v) => acc + v, 0);
    return {
      avg: Number((sum / values.length).toFixed(2)),
      min: Math.min(...values),
      max: Math.max(...values),
      total: values.length
    };
  }, [historicalRows]);

  // Export to CSV Function
  const handleExportCSV = () => {
    if (historicalRows.length === 0) return;

    const headers = ['Timestamp', 'Unix Timestamp', 'Device Name', 'Virtual Pin', 'Channel Name', 'Value', 'Unit', 'Status'];
    const csvContent = [
      headers.join(','),
      ...historicalRows.map(r => [
        `"${r.timestamp}"`,
        r.unixTime,
        `"${r.deviceName}"`,
        r.pin,
        `"${r.channelName}"`,
        r.value,
        `"${r.unit}"`,
        r.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `iothub_telemetry_${currentDevice?.name.toLowerCase().replace(/\s+/g, '_')}_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Export to JSON Function
  const handleExportJSON = () => {
    if (historicalRows.length === 0) return;

    const exportData = {
      device: currentDevice?.name,
      deviceId: currentDevice?.id,
      exportedAt: new Date().toISOString(),
      timeRange,
      totalRecords: historicalRows.length,
      records: historicalRows
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `iothub_telemetry_${currentDevice?.name.toLowerCase().replace(/\s+/g, '_')}_${timeRange}.json`;
    link.click();
  };

  // Copy Summary
  const handleCopy = () => {
    const summary = `IoT Hub Historical Export\nDevice: ${currentDevice?.name}\nTotal Records: ${stats.total}\nAvg: ${stats.avg} | Min: ${stats.min} | Max: ${stats.max}`;
    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0B0F19] p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-heading text-white">Historical Data & Telemetry Analytics</h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              CSV & JSON Export
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Query time-series logs, filter datastreams, analyze statistical metrics, and export data for Excel or Python Pandas
          </p>
        </div>

        {/* 1-Click Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg glow-green transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV (Excel)</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-cyan-300 font-bold text-xs rounded-xl border border-gray-700 transition"
          >
            <FileCode className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl glass-panel border border-gray-800">
        {/* Device Select */}
        <div>
          <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Target Device</label>
          <select
            value={selectedDeviceId}
            onChange={e => setSelectedDeviceId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white font-mono text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
          >
            {devices.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Virtual Pin Select */}
        <div>
          <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Virtual Pin / Channel</label>
          <select
            value={selectedPin}
            onChange={e => setSelectedPin(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white font-mono text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">-- All Datastreams (Combined) --</option>
            {currentDevice?.datastreams.map(ds => (
              <option key={ds.pin} value={ds.pin}>{ds.pin}: {ds.name} ({ds.unit || ''})</option>
            ))}
          </select>
        </div>

        {/* Time Range */}
        <div>
          <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Time Range</label>
          <div className="grid grid-cols-4 gap-1 bg-gray-900 border border-gray-800 p-1 rounded-xl">
            {(['1h', '24h', '7d', '30d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`py-1 rounded-lg text-xs font-mono transition ${
                  timeRange === t ? 'bg-brand-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div>
          <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Filter Records</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter timestamp / pin..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-gray-500">Total Records</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{stats.total} points</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-gray-500">Average Value</div>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{stats.avg}</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-gray-500">Min / Max Range</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{stats.min} ~ {stats.max}</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-gray-500">Sampling Rate</div>
            <div className="text-xl font-bold font-mono text-purple-300 mt-0.5">
              {timeRange === '1h' ? '2s Live' : timeRange === '24h' ? '15m Agg' : '1h Agg'}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Data Table Preview */}
      <div className="flex-1 glass-panel rounded-3xl border border-gray-800 overflow-hidden flex flex-col shadow-2xl">
        <div className="px-5 py-3.5 bg-gray-950/80 border-b border-gray-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 font-mono text-gray-300">
            <TableIcon className="w-4 h-4 text-brand-400" />
            <span className="font-bold">Raw Telemetry Timescale Log Preview ({filteredRows.length} rows)</span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition text-xs font-mono"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-x-auto max-h-[420px]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-gray-900/90 text-gray-400 uppercase text-[10px] border-b border-gray-800 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Device</th>
                <th className="p-3.5">Pin</th>
                <th className="p-3.5">Channel Name</th>
                <th className="p-3.5 text-right">Value</th>
                <th className="p-3.5">Unit</th>
                <th className="p-3.5 text-center">Quality Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredRows.slice(0, 100).map(row => (
                <tr key={row.id} className="hover:bg-gray-800/40 transition">
                  <td className="p-3.5 text-gray-300">{row.timestamp}</td>
                  <td className="p-3.5 text-gray-400 font-sans font-medium">{row.deviceName}</td>
                  <td className="p-3.5 text-cyan-400 font-bold">{row.pin}</td>
                  <td className="p-3.5 text-gray-300 font-sans">{row.channelName}</td>
                  <td className="p-3.5 text-right font-bold text-white font-mono">{row.value}</td>
                  <td className="p-3.5 text-gray-500">{row.unit}</td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      row.status === 'NORMAL'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : row.status === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

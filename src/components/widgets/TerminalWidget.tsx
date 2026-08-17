import React, { useState } from 'react';
import { WidgetConfig } from '../../types/dashboard';
import { useTelemetry } from '../../context/TelemetryContext';
import { Terminal, Send, Trash2 } from 'lucide-react';

interface TerminalWidgetProps {
  config: WidgetConfig;
}

export const TerminalWidget: React.FC<TerminalWidgetProps> = ({ config }) => {
  const { logMessages, clearLogs, sendCommand } = useTelemetry();
  const [inputVal, setInputVal] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendCommand(config.deviceId, config.pin || 'CMD', inputVal);
    setInputVal('');
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-950/90 rounded-xl p-3 font-mono border border-gray-800 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-1.5 mb-2">
        <div className="flex items-center space-x-1.5 text-gray-400">
          <Terminal className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-[11px] font-bold">SERIAL CONSOLE MONITOR</span>
        </div>
        <button
          onClick={clearLogs}
          className="text-gray-500 hover:text-gray-300 transition p-1"
          title="Clear console"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[140px]">
        {logMessages.length === 0 ? (
          <div className="text-gray-600 italic">No telemetry messages received yet...</div>
        ) : (
          logMessages.slice(0, 20).map(log => (
            <div key={log.id} className="leading-relaxed">
              <span className="text-gray-500">[{log.timestamp}]</span>{' '}
              <span className={log.type === 'cmd' ? 'text-amber-400 font-bold' : 'text-cyan-400'}>
                {log.topic.split('/').slice(-1)[0]}:
              </span>{' '}
              <span className="text-gray-300 break-all">{log.payload}</span>
            </div>
          ))
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-800">
        <span className="text-brand-400">&gt;</span>
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Send custom serial / MQTT command..."
          className="flex-1 bg-transparent border-none text-gray-200 focus:outline-none text-xs placeholder:text-gray-600"
        />
        <button
          type="submit"
          className="p-1 bg-brand-500 hover:bg-brand-600 text-black rounded transition"
        >
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};

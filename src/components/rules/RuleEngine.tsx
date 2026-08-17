import React, { useState } from 'react';
import { useDevices } from '../../context/DeviceContext';
import { AutomationRule } from '../../types/rules';
import { INITIAL_RULES } from '../../utils/mockData';
import { storage } from '../../utils/storage';
import {
  Zap,
  Plus,
  Play,
  Trash2,
  Bell,
  Mail,
  Send,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const RuleEngine: React.FC = () => {
  const { devices } = useDevices();
  const [rules, setRules] = useState<AutomationRule[]>(() => storage.get('rules', INITIAL_RULES));
  const [showAddModal, setShowAddModal] = useState(false);
  const [testNotification, setTestNotification] = useState<string | null>(null);

  // New Rule Form State
  const [ruleName, setRuleName] = useState('');
  const [triggerDevice, setTriggerDevice] = useState(devices[0]?.id || '');
  const [triggerPin, setTriggerPin] = useState('V0');
  const [operator, setOperator] = useState<'>' | '<' | '=='>('>');
  const [thresholdVal, setThresholdVal] = useState<number>(85);
  const [actionType, setActionType] = useState<'send_telegram' | 'actuate_device' | 'send_email'>('send_telegram');
  const [alertMessage, setAlertMessage] = useState('🚨 Alert: Sensor threshold exceeded!');

  const toggleRule = (ruleId: string) => {
    setRules(prev => {
      const updated = prev.map(r => r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r);
      storage.set('rules', updated);
      return updated;
    });
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => {
      const updated = prev.filter(r => r.id !== ruleId);
      storage.set('rules', updated);
      return updated;
    });
  };

  const handleTestRule = (rule: AutomationRule) => {
    setTestNotification(`Rule [${rule.name}] executed! Dispatched action: ${rule.actions[0]?.type}`);
    setTimeout(() => setTestNotification(null), 3500);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    const newRule: AutomationRule = {
      id: 'rule_' + Math.random().toString(36).substring(2, 9),
      name: ruleName.trim(),
      description: `If ${triggerPin} ${operator} ${thresholdVal}, trigger ${actionType}`,
      isEnabled: true,
      trigger: {
        type: 'telemetry_threshold',
        deviceId: triggerDevice,
        pin: triggerPin,
        operator,
        thresholdValue: thresholdVal
      },
      actions: [
        {
          type: actionType,
          recipient: actionType === 'send_telegram' ? '@alerts_bot' : 'operator@iothub.local',
          messageTemplate: alertMessage,
          targetDeviceId: triggerDevice,
          targetPin: 'V2',
          targetValue: 0
        }
      ],
      executionCount: 0
    };

    const updated = [newRule, ...rules];
    setRules(updated);
    storage.set('rules', updated);
    setShowAddModal(false);
    setRuleName('');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0B0F19] p-6 space-y-6">
      {/* Test Alert Toast */}
      {testNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black px-4 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{testNotification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-heading text-white">Visual Rule Engine & Automation</h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Active Trigger Bus
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Build event-driven automations, emergency shutoff overrides, and multi-channel alerts
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create Automation Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4 pb-12">
        {rules.map(rule => (
          <div
            key={rule.id}
            className={`glass-panel p-5 rounded-3xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              rule.isEnabled ? 'border-gray-800 hover:border-brand-500/40' : 'border-gray-900 opacity-60'
            }`}
          >
            {/* Flow Visual Nodes */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-1">
              {/* Trigger Node */}
              <div className="bg-gray-950 p-3 rounded-2xl border border-gray-800 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-gray-500 font-bold">WHEN</div>
                  <div className="text-xs font-bold font-mono text-white">
                    {rule.trigger.pin || 'V0'} {rule.trigger.operator} {rule.trigger.thresholdValue}
                  </div>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-gray-600 hidden sm:block" />

              {/* Action Node */}
              <div className="bg-gray-950 p-3 rounded-2xl border border-gray-800 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-gray-500 font-bold">THEN EXECUTE</div>
                  <div className="text-xs font-bold font-mono text-cyan-300 capitalize">
                    {rule.actions[0]?.type.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Rule Title & Stats */}
              <div className="sm:ml-4">
                <h4 className="text-xs font-bold text-gray-200 font-heading">{rule.name}</h4>
                <p className="text-[11px] text-gray-400 line-clamp-1">{rule.description}</p>
                <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-mono mt-1">
                  <span>Executions: {rule.executionCount}</span>
                  {rule.lastTriggeredAt && (
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Last triggered 1h ago</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions & Toggles */}
            <div className="flex items-center space-x-3 self-end md:self-auto">
              <button
                onClick={() => handleTestRule(rule)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-mono transition flex items-center space-x-1"
                title="Test trigger now"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Simulate</span>
              </button>

              {/* Toggle Enable */}
              <button
                onClick={() => toggleRule(rule.id)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  rule.isEnabled ? 'bg-brand-500' : 'bg-gray-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    rule.isEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>

              <button
                onClick={() => deleteRule(rule.id)}
                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
            <h3 className="text-lg font-bold font-heading text-white mb-4">Create Automation Rule</h3>

            <form onSubmit={handleAddRule} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Temperature Critical Shutdown"
                  value={ruleName}
                  onChange={e => setRuleName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 focus:border-brand-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              {/* Condition setup */}
              <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 space-y-3">
                <span className="font-mono font-bold text-amber-400">Trigger Condition:</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-gray-500 block mb-1">Device Pin</label>
                    <select
                      value={triggerPin}
                      onChange={e => setTriggerPin(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2 font-mono"
                    >
                      <option value="V0">V0 (Temp)</option>
                      <option value="V1">V1 (Flow)</option>
                      <option value="V4">V4 (Pressure)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Operator</label>
                    <select
                      value={operator}
                      onChange={e => setOperator(e.target.value as any)}
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2 font-mono"
                    >
                      <option value=">">&gt; (Greater than)</option>
                      <option value="<">&lt; (Less than)</option>
                      <option value="==">== (Equals)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Threshold</label>
                    <input
                      type="number"
                      value={thresholdVal}
                      onChange={e => setThresholdVal(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Action setup */}
              <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 space-y-3">
                <span className="font-mono font-bold text-cyan-400">Action Dispatcher:</span>
                <div>
                  <label className="text-gray-500 block mb-1">Action Channel</label>
                  <select
                    value={actionType}
                    onChange={e => setActionType(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2 font-mono"
                  >
                    <option value="send_telegram">Telegram Bot Alert</option>
                    <option value="send_email">Email Notification</option>
                    <option value="actuate_device">Actuate Hardware Relay</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Alert Message Template</label>
                  <input
                    type="text"
                    value={alertMessage}
                    onChange={e => setAlertMessage(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-400 text-black font-bold rounded-xl"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

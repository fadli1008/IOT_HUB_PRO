import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import {
  LayoutDashboard,
  Cpu,
  Zap,
  Code2,
  Sliders,
  Terminal,
  Layers,
  Settings,
  LogOut,
  Sparkles,
  Building,
  FileSpreadsheet,
  ShieldCheck
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'devices' | 'simulator' | 'firmware' | 'rules' | 'analytics' | 'users' | 'api_docs';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { organization, logout, user } = useAuth();
  const { isKioskMode } = useDashboard();

  if (isKioskMode) return null;

  const NAV_ITEMS: Array<{ id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Dashboards', icon: LayoutDashboard },
    { id: 'devices', label: 'Device Fleet', icon: Cpu },
    { id: 'simulator', label: 'Virtual Hardware', icon: Zap },
    { id: 'firmware', label: 'Firmware SDK', icon: Code2 },
    { id: 'rules', label: 'Rule Engine', icon: Sliders },
    { id: 'analytics', label: 'History & Export', icon: FileSpreadsheet },
    { id: 'users', label: 'User Management', icon: ShieldCheck },
    { id: 'api_docs', label: 'API & MQTT Docs', icon: Terminal },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-gray-800/80 flex flex-col justify-between select-none h-screen z-30">
      {/* Brand & Workspace Switcher */}
      <div>
        <div className="p-4 border-b border-gray-800/80 flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-brand-500 text-black font-bold glow-cyan">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-extrabold font-heading text-white tracking-tight flex items-center space-x-1">
              <span>IoT Hub</span>
              <span className="text-[9px] bg-brand-500/20 text-brand-400 font-mono px-1.5 py-0.2 rounded border border-brand-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono truncate">{organization?.name || 'Workspace'}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 font-bold shadow-sm glow-cyan'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-gray-800/80 space-y-2">
        <div className="flex items-center space-x-3 p-2 rounded-xl bg-gray-900/60 border border-gray-800/60">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=user`}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-gray-700 bg-gray-800"
          />
          <div className="flex-1 truncate">
            <div className="text-xs font-bold text-gray-200 truncate">{user?.name || 'Muhamad Fadli'}</div>
            <div className="text-[10px] text-brand-400 font-mono font-semibold truncate">{user?.email || 'muhamad.fadli@iothub.local'}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

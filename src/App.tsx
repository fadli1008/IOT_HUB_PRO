import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/landing/OnboardingWizard';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { DashboardCanvas } from './components/dashboard/DashboardCanvas';
import { DeviceList } from './components/devices/DeviceList';
import { VirtualDeviceSimulator } from './components/simulator/VirtualDeviceSimulator';
import { FirmwareGenerator } from './components/firmware/FirmwareGenerator';
import { RuleEngine } from './components/rules/RuleEngine';
import { HistoricalExportView } from './components/analytics/HistoricalExportView';
import { UserManagementView } from './components/admin/UserManagementView';
import { ApiPlayground } from './components/api-docs/ApiPlayground';

export const App: React.FC = () => {
  const { isAuthenticated, onboarding } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // If user is not authenticated, show Public Landing Page + Gated Sign-Up / Login
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // If user is authenticated but hasn't completed onboarding wizard, show wizard
  if (!onboarding.isCompleted) {
    return <OnboardingWizard onComplete={() => setActiveTab('dashboard')} />;
  }

  // Authenticated Main Workspace Layout
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F19] text-gray-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {activeTab === 'dashboard' && <DashboardCanvas />}
        {activeTab === 'devices' && <DeviceList />}
        {activeTab === 'simulator' && <VirtualDeviceSimulator />}
        {activeTab === 'firmware' && <FirmwareGenerator />}
        {activeTab === 'rules' && <RuleEngine />}
        {activeTab === 'analytics' && <HistoricalExportView />}
        {activeTab === 'users' && <UserManagementView />}
        {activeTab === 'api_docs' && <ApiPlayground />}
      </main>
    </div>
  );
};

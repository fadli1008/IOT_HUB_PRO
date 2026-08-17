import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import { DeviceProvider } from './context/DeviceContext';
import { TelemetryProvider } from './context/TelemetryContext';
import { DashboardProvider } from './context/DashboardContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <DeviceProvider>
        <TelemetryProvider>
          <DashboardProvider>
            <App />
          </DashboardProvider>
        </TelemetryProvider>
      </DeviceProvider>
    </AuthProvider>
  </React.StrictMode>
);

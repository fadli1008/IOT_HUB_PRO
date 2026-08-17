import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Zap,
  Sliders,
  ShieldCheck,
  Code2,
  Activity,
  ArrowRight,
  Check,
  Sparkles,
  Server,
  Terminal,
  Play
} from 'lucide-react';
import { AuthModal } from './AuthModal';

export const LandingPage: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans selection:bg-brand-500 selection:text-black">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0B0F19]/80 backdrop-blur-lg border-b border-gray-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-brand-500 text-black font-bold glow-cyan">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold font-heading text-white tracking-tight">IoT Hub</span>
              <span className="text-[10px] uppercase font-mono font-bold bg-brand-500/20 text-brand-400 px-2.5 py-0.5 rounded-full border border-brand-500/30">
                by Muhamad Fadli
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-xs font-medium text-gray-300">
            <a href="#features" className="hover:text-brand-400 transition">Features</a>
            <a href="#benchmark" className="hover:text-brand-400 transition">Benchmark vs Blynk</a>
            <a href="#hardware" className="hover:text-brand-400 transition">Supported Hardware</a>
            <a href="#pricing" className="hover:text-brand-400 transition">Pricing</a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => openAuth('login')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800/80 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuth('register')}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition flex items-center space-x-1.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono mb-6 animate-float">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Engineered by Muhamad Fadli — Universal IoT Platform for Makers, Startups & Industry</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Connect Custom Hardware. Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-300 to-blue-500">Live Dashboards</span> in Minutes.
          </h1>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mt-6 leading-relaxed">
            The open, hardware-agnostic IoT platform benchmarked against Blynk and ThingsBoard. Features WYSIWYG drag-and-drop UI builder, built-in C++/MicroPython SDKs, and industrial SCADA HMI schematics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
            <button
              onClick={() => openAuth('register')}
              className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-sm rounded-2xl shadow-xl glow-cyan transition flex items-center justify-center space-x-2"
            >
              <span>Start Free (5 Devices Included)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openAuth('login')}
              className="w-full sm:w-auto px-6 py-4 bg-gray-900/90 hover:bg-gray-800 border border-gray-800 text-gray-200 font-semibold text-sm rounded-2xl transition flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 text-brand-400 fill-current" />
              <span>Explore Live Demo</span>
            </button>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="mt-14 relative rounded-3xl p-2 md:p-4 bg-gray-900/60 border border-gray-800 shadow-2xl backdrop-blur-xl max-w-5xl mx-auto">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 text-xs text-gray-500 font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-gray-400">app.iothub.io/dashboard/plant-alpha</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>MQTT TLS :8883 CONNECTED</span>
              </span>
            </div>

            {/* Mock Dashboard Grid Preview */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="glass-panel p-4 rounded-2xl border border-brand-500/30">
                <div className="text-xs text-gray-400 font-mono">ESP32 Core Boiler</div>
                <div className="text-3xl font-extrabold text-white mt-2 font-heading">78.5 °C</div>
                <div className="text-xs text-emerald-400 mt-1 font-mono">● Operational Normal</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl">
                <div className="text-xs text-gray-400 font-mono">Circulation Pump M-1</div>
                <div className="text-xl font-bold text-emerald-400 mt-2 font-mono">STATE: ENERGIZED</div>
                <div className="text-xs text-gray-500 mt-1 font-mono">Relay V2 Active</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl">
                <div className="text-xs text-gray-400 font-mono">Steam Chamber Pressure</div>
                <div className="text-3xl font-extrabold text-cyan-400 mt-2 font-heading">4.8 bar</div>
                <div className="text-xs text-gray-500 mt-1 font-mono">Max Limit: 15 bar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benchmark Comparison Table */}
      <section id="benchmark" className="py-20 px-6 border-t border-gray-800/80 bg-gray-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase text-brand-400 font-bold tracking-wider">Benchmark Matrix</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-2">
              Why Engineers & Makers Choose IoT Hub
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Comparing flexibility, industrial capabilities, and developer experience against Blynk and ThingsBoard.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-800 glass-panel">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/90 text-gray-300 font-mono uppercase text-[11px] border-b border-gray-800">
                <tr>
                  <th className="p-4">Key Capability</th>
                  <th className="p-4 text-brand-400 font-bold">IoT Hub (Our Platform)</th>
                  <th className="p-4 text-gray-400">Blynk IoT</th>
                  <th className="p-4 text-gray-400">ThingsBoard CE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 font-mono">
                <tr>
                  <td className="p-4 text-gray-200 font-sans font-medium">WYSIWYG Drag & Drop UI</td>
                  <td className="p-4 text-emerald-400 font-bold">✅ Yes (Desktop/Tablet/Mobile)</td>
                  <td className="p-4 text-emerald-400">✅ Yes</td>
                  <td className="p-4 text-emerald-400">✅ Yes</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-200 font-sans font-medium">Hardware Agnostic (Any MCU)</td>
                  <td className="p-4 text-emerald-400 font-bold">✅ Full (ESP32, RPi, STM32, Modbus)</td>
                  <td className="p-4 text-amber-400">⚠️ Proprietary Protocol</td>
                  <td className="p-4 text-emerald-400">✅ Full</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-200 font-sans font-medium">Interactive SCADA HMI Schematics</td>
                  <td className="p-4 text-emerald-400 font-bold">✅ Native SVG Dynamic HMI</td>
                  <td className="p-4 text-red-400">❌ Limited</td>
                  <td className="p-4 text-amber-400">⚠️ Complex Config</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-200 font-sans font-medium">Built-in Firmware SDK & Code Generator</td>
                  <td className="p-4 text-emerald-400 font-bold">✅ 1-Click C++ / MicroPython Generator</td>
                  <td className="p-4 text-amber-400">⚠️ Limited MCU Support</td>
                  <td className="p-4 text-red-400">❌ No Official SDK</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-200 font-sans font-medium">Virtual Hardware Simulator</td>
                  <td className="p-4 text-emerald-400 font-bold">✅ Included In-Browser</td>
                  <td className="p-4 text-red-400">❌ No</td>
                  <td className="p-4 text-red-400">❌ No</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-200 font-sans font-medium">Pricing Predictability</td>
                  <td className="p-4 text-emerald-400 font-bold">✅ Generous Free + Capacity-based</td>
                  <td className="p-4 text-red-400">❌ Expensive per device</td>
                  <td className="p-4 text-emerald-400">✅ Free Self-Host</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase text-brand-400 font-bold tracking-wider">Comprehensive Toolset</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-2">
              Everything You Need to Scale from Prototype to Factory
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-gray-800 hover:border-brand-500/40 transition group">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Drag & Drop Dashboard</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Magnetic snap-to-grid canvas with radial gauges, multi-axis time-series graphs, switches, sliders, RGB pickers, and live tables.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800 hover:border-brand-500/40 transition group">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Digital Twin & Device Shadow</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Seamless synchronization of desired vs reported states with automatic delta updates and offline command queuing.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800 hover:border-brand-500/40 transition group">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Interactive Firmware Generator</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Auto-generate copy-paste ready firmware code for ESP32 (Arduino C++), MicroPython, and Raspberry Pi with your token embedded.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800 hover:border-brand-500/40 transition group">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Visual Rule Engine</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Flow-based automation: trigger device shutdowns, send Telegram/WhatsApp alerts, and dispatch outbound webhooks when thresholds breach.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800 hover:border-brand-500/40 transition group">
              <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">SCADA Plant Schematics</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Industrial-grade dynamic SVG HMI schematics with live animated pipe flows, boiler states, and motor pump actuation.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800 hover:border-brand-500/40 transition group">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">API-First & MQTT TLS</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Full REST API documentation with live playground, standard MQTT v5.0 topic hierarchy, and high-speed WebSockets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 border-t border-gray-800 bg-gray-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase text-brand-400 font-bold tracking-wider">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-2">
              Start Free, Scale Predictably
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">No per-message surprises. Transparent capacity-based pricing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free */}
            <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-gray-400">FREE TIER</span>
                <div className="text-3xl font-extrabold text-white mt-2 font-heading">$0 <span className="text-xs text-gray-500 font-normal">/ month</span></div>
                <p className="text-xs text-gray-400 mt-2">Perfect for students, hobbyists, and prototypes.</p>
                <ul className="space-y-2.5 mt-6 text-xs text-gray-300">
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>5 Connected Devices</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>16 Virtual Pins / Device</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>7-Day Log Retention</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>Drag & Drop Builder</span></li>
                </ul>
              </div>
              <button onClick={() => openAuth('register')} className="w-full mt-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl transition">
                Get Started
              </button>
            </div>

            {/* Maker Plus */}
            <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400">MAKER PLUS</span>
                <div className="text-3xl font-extrabold text-white mt-2 font-heading">$9.90 <span className="text-xs text-gray-500 font-normal">/ month</span></div>
                <p className="text-xs text-gray-400 mt-2">For makers building full smart home setups.</p>
                <ul className="space-y-2.5 mt-6 text-xs text-gray-300">
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>25 Connected Devices</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>64 Virtual Pins / Device</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>30-Day Log Retention</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>Telegram & Email Alerts</span></li>
                </ul>
              </div>
              <button onClick={() => openAuth('register')} className="w-full mt-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl transition">
                Upgrade to Maker
              </button>
            </div>

            {/* Pro */}
            <div className="glass-panel p-6 rounded-3xl border-2 border-brand-500 bg-gray-900/80 relative shadow-2xl glow-cyan flex flex-col justify-between">
              <div className="absolute -top-3 right-6 bg-brand-500 text-black font-bold text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-brand-400">PRO / STARTUP</span>
                <div className="text-3xl font-extrabold text-white mt-2 font-heading">$79 <span className="text-xs text-gray-500 font-normal">/ month</span></div>
                <p className="text-xs text-gray-400 mt-2">For commercial IoT startups and device fleets.</p>
                <ul className="space-y-2.5 mt-6 text-xs text-gray-300">
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>250 Connected Devices</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>256 Virtual Pins / Device</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>1-Year Data Retention</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>OTA Fleet Rollout Manager</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>SCADA HMI Widgets</span></li>
                </ul>
              </div>
              <button onClick={() => openAuth('register')} className="w-full mt-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs rounded-xl shadow-lg glow-cyan transition">
                Start 14-Day Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-purple-400">ENTERPRISE</span>
                <div className="text-3xl font-extrabold text-white mt-2 font-heading">Custom</div>
                <p className="text-xs text-gray-400 mt-2">For factory automation, utilities, and OEM hardware.</p>
                <ul className="space-y-2.5 mt-6 text-xs text-gray-300">
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>Unlimited Devices</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>Self-Hosted On-Premise Docker</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>White-Label Custom Domain</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>99.95% SLA + 24/7 TAM Support</span></li>
                </ul>
              </div>
              <button onClick={() => openAuth('register')} className="w-full mt-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-800/80 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-gray-300">IoT Hub Platform</span>
            <span>— Universal & Industrial IoT Engine</span>
          </div>
          <div>
            Developed & Engineered by <strong className="text-gray-200">Muhamad Fadli</strong> • 2026
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

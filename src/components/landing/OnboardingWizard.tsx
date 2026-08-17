import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Building, Rocket, Factory, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [workspaceName, setWorkspaceName] = useState('My IoT Project');
  const [useCase, setUseCase] = useState<'hobby' | 'startup' | 'industrial'>('hobby');

  const handleFinish = () => {
    completeOnboarding(workspaceName, useCase);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]">
      <div className="relative w-full max-w-xl bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? 'w-12 bg-brand-500' : s < step ? 'w-6 bg-brand-500/50' : 'w-6 bg-gray-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Workspace Name */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 text-brand-400 mb-3">
                <Building className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">Name Your Workspace</h2>
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                Workspaces isolate your devices, dashboards, team members, and telemetry data.
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-2 font-medium">Workspace / Organization Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
                placeholder="e.g. Smart Agri Lab, Smart Home Alpha"
                className="w-full bg-gray-950 border-2 border-gray-800 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!workspaceName.trim()}
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition flex items-center justify-center space-x-2"
            >
              <span>Continue to Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Use Case Selection */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-400 mb-3">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">What Are You Building?</h2>
              <p className="text-xs text-gray-400 mt-1">
                We'll tailor your dashboard templates and starter firmware code accordingly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'hobby', label: 'Maker / Education', desc: 'ESP32, Arduino, university projects, and DIY home automation', icon: Rocket },
                { id: 'startup', label: 'IoT Commercial', desc: 'Smart metering, vehicle trackers, remote asset fleets', icon: Zap },
                { id: 'industrial', label: 'Industrial / IIoT', desc: 'SCADA HMI, Modbus RTU/TCP, factory boilers, high-volume sensor logs', icon: Factory }
              ].map(opt => {
                const Icon = opt.icon;
                const isSel = useCase === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setUseCase(opt.id as any)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      isSel
                        ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/20'
                        : 'border-gray-800 bg-gray-950/60 hover:border-gray-700'
                    }`}
                  >
                    <div>
                      <div className={`p-2 rounded-xl w-fit mb-3 ${isSel ? 'bg-brand-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-white font-heading">{opt.label}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{opt.desc}</p>
                    </div>
                    {isSel && (
                      <div className="mt-3 flex items-center space-x-1 text-[10px] text-brand-400 font-bold font-mono">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Selected</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-xl transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Plan Activation */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn text-center">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-3 glow-green">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">Your Workspace Is Ready!</h2>
              <p className="text-xs text-gray-400 mt-1">
                We have assigned you the <strong>Free Tier</strong> (5 free devices, unlimited dashboards).
              </p>
            </div>

            <div className="p-4 bg-gray-950 border border-gray-800 rounded-2xl text-left space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-800">
                <span className="text-gray-400">Assigned Plan:</span>
                <span className="font-bold text-brand-400 uppercase font-mono">Free Lifetime Tier</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-800">
                <span className="text-gray-400">Device Quota:</span>
                <span className="text-gray-200 font-mono">5 Active Devices</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Credit Card:</span>
                <span className="text-emerald-400 font-mono font-bold">Not Required</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-black font-bold text-sm rounded-2xl shadow-xl glow-cyan transition flex items-center justify-center space-x-2"
            >
              <span>Launch IoT Hub Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
